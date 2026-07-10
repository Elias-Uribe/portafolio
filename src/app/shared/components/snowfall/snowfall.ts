import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';

interface Flake {
  x: number;
  y: number;
  size: number;
  speedY: number;
  drift: number;
  driftPhase: number;
  opacity: number;
  layer: 0 | 1 | 2; // profundidad para parallax
}

/**
 * Nieve cayendo global, fixed, detrás de todo el contenido.
 * 3 capas con parallax de scroll, respeta reduced-motion, pausa cuando la tab pierde foco.
 */
@Component({
  selector: 'app-snowfall',
  template: `
    <canvas #canvas class="snowfall" aria-hidden="true"></canvas>
  `,
  styles: [`
    :host {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1;
    }
    .snowfall { position: absolute; inset: 0; width: 100%; height: 100%; }
    @media (prefers-reduced-motion: reduce) {
      :host { display: none; }
    }
  `],
})
export class SnowfallComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly platformId = inject(PLATFORM_ID);
  private ctx!: CanvasRenderingContext2D;
  private flakes: Flake[] = [];
  private raf = 0;
  private resizeHandler = () => this.resize();
  private visHandler = () => this.onVisibility();
  private scrollY = 0;
  private scrollHandler = () => {
    this.scrollY = window.scrollY;
  };
  private paused = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const canvas = this.canvasRef.nativeElement;
    const context = canvas.getContext('2d');
    if (!context) return;
    this.ctx = context;

    this.resize();
    this.initFlakes();
    this.animate();

    window.addEventListener('resize', this.resizeHandler, { passive: true });
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    document.addEventListener('visibilitychange', this.visHandler);
  }

  ngOnDestroy(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.resizeHandler);
      window.removeEventListener('scroll', this.scrollHandler);
      document.removeEventListener('visibilitychange', this.visHandler);
    }
  }

  private onVisibility(): void {
    this.paused = document.hidden;
    if (!this.paused && !this.raf) this.animate();
  }

  private resize(): void {
    const canvas = this.canvasRef.nativeElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private currentCount(): number {
    return window.innerWidth < 768 ? 40 : 90;
  }

  private initFlakes(): void {
    this.flakes = Array.from({ length: this.currentCount() }, () => this.makeFlake(true));
  }

  private makeFlake(startAnywhere = false): Flake {
    const layer = (Math.floor(Math.random() * 3) as 0 | 1 | 2);
    return {
      x: Math.random() * window.innerWidth,
      y: startAnywhere ? Math.random() * window.innerHeight : -10,
      size: layer === 2 ? 2.6 + Math.random() * 1.2 : layer === 1 ? 1.6 + Math.random() * 0.8 : 0.8 + Math.random() * 0.6,
      speedY: layer === 2 ? 0.9 + Math.random() * 0.5 : layer === 1 ? 0.5 + Math.random() * 0.3 : 0.25 + Math.random() * 0.15,
      drift: (Math.random() - 0.5) * 0.6,
      driftPhase: Math.random() * Math.PI * 2,
      opacity: layer === 2 ? 0.85 : layer === 1 ? 0.6 : 0.35,
      layer,
    };
  }

  private drawFlake(f: Flake): void {
    // Copo simplificado con 6 puntas trazadas
    const cx = f.x;
    const cy = f.y - this.scrollY * (0.03 + f.layer * 0.05);
    const s = f.size;

    this.ctx.strokeStyle = `rgba(224, 242, 254, ${f.opacity})`;
    this.ctx.lineWidth = f.layer === 2 ? 1 : 0.7;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const dx = Math.cos(angle) * s;
      const dy = Math.sin(angle) * s;
      this.ctx.moveTo(cx, cy);
      this.ctx.lineTo(cx + dx, cy + dy);
    }
    this.ctx.stroke();

    if (f.layer === 2) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity * 0.9})`;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, s * 0.35, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private animate(): void {
    if (this.paused) {
      this.raf = 0;
      return;
    }
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const t = performance.now() * 0.001;

    for (const f of this.flakes) {
      f.y += f.speedY;
      f.x += Math.sin(t + f.driftPhase) * f.drift;

      if (f.y > window.innerHeight + 10) {
        Object.assign(f, this.makeFlake(false));
      }
      if (f.x < -10) f.x = window.innerWidth + 10;
      if (f.x > window.innerWidth + 10) f.x = -10;

      this.drawFlake(f);
    }

    this.raf = requestAnimationFrame(() => this.animate());
  }
}
