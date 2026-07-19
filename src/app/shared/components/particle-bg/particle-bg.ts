import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

@Component({
  selector: 'app-particle-bg',
  template: `
    <div class="particle-container" aria-hidden="true">
      <canvas #canvas class="particle-canvas"></canvas>
      <div class="fog-layer fog-layer--1"></div>
      <div class="fog-layer fog-layer--2"></div>
      <div class="fog-layer fog-layer--3"></div>
    </div>
  `,
  styles: [`
    :host {
      position: absolute;
      inset: 0;
      display: block;
      pointer-events: none;
      z-index: 0;
    }
    .particle-container { position: absolute; inset: 0; }
    .particle-canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
    .fog-layer { position: absolute; inset: 0; pointer-events: none; }
    .fog-layer--1 {
      background: radial-gradient(ellipse 80% 50% at 20% 80%, rgba(14, 165, 233, 0.06) 0%, transparent 70%);
      animation: fogDrift1 20s ease-in-out infinite alternate;
    }
    .fog-layer--2 {
      background: radial-gradient(ellipse 60% 40% at 80% 20%, rgba(56, 189, 248, 0.04) 0%, transparent 70%);
      animation: fogDrift2 25s ease-in-out infinite alternate;
    }
    .fog-layer--3 {
      background: radial-gradient(ellipse 100% 30% at 50% 100%, rgba(6, 12, 20, 0.8) 0%, transparent 100%);
    }
    @keyframes fogDrift1 {
      from { transform: translate(-5%, 2%) scale(1); }
      to   { transform: translate(5%, -2%) scale(1.05); }
    }
    @keyframes fogDrift2 {
      from { transform: translate(3%, -3%) scale(1.05); }
      to   { transform: translate(-3%, 3%) scale(1); }
    }
    @media (prefers-reduced-motion: reduce) {
      .fog-layer--1, .fog-layer--2 { animation: none; }
    }
  `],
})
export class ParticleBgComponent implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly platformId = inject(PLATFORM_ID);

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId = 0;
  private resizeHandler = () => this.resize();
  private frameCount = 0;

  private readonly colors = [
    'rgba(125, 211, 252,',
    'rgba(56, 189, 248,',
    'rgba(165, 243, 252,',
    'rgba(251, 191, 36,',
    'rgba(255, 255, 255,',
  ];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    this.canvas = this.el.nativeElement.querySelector('canvas');
    const context = this.canvas.getContext('2d');
    if (!context) return;
    this.ctx = context;

    this.resize();
    this.initParticles();
    this.animate();

    window.addEventListener('resize', this.resizeHandler, { passive: true });
  }

  ngOnDestroy(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  private isMobile(): boolean {
    return window.innerWidth < 768;
  }

  private currentParticleCount(): number {
    return this.isMobile() ? 14 : 55;
  }

  private resize(): void {
    const parent = this.el.nativeElement.parentElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = parent?.offsetWidth ?? window.innerWidth;
    const height = parent?.offsetHeight ?? window.innerHeight;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  private initParticles(): void {
    this.particles = Array.from({ length: this.currentParticleCount() }, () =>
      this.createParticle(),
    );
  }

  private createParticle(): Particle {
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    const maxLife = 120 + Math.random() * 180;
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    const mobile = this.isMobile();
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      /* En mobile: partículas más pequeñas para que no compitan con el texto */
      size: mobile ? Math.random() * 1.1 + 0.4 : Math.random() * 2.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: 0,
      color,
      life: Math.random() * maxLife,
      maxLife,
    };
  }

  private animate(): void {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);
    this.ctx.clearRect(0, 0, width, height);
    this.frameCount++;

    for (const p of this.particles) {
      p.life += 1;
      if (p.life > p.maxLife) {
        Object.assign(p, this.createParticle());
        p.x = Math.random() * width;
        p.y = height + 10;
        p.life = 0;
        continue;
      }

      const progress = p.life / p.maxLife;
      p.opacity =
        progress < 0.2
          ? progress / 0.2
          : progress > 0.8
            ? (1 - progress) / 0.2
            : 1;

      p.x += p.speedX;
      p.y += p.speedY;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      /* En mobile bajamos la opacidad final para que no compitan con el hero */
      const mobileFade = this.isMobile() ? 0.45 : 0.7;
      this.ctx.fillStyle = `${p.color}${p.opacity * mobileFade})`;
      this.ctx.fill();

      /* Sombras/halo solo en desktop — en mobile crea streaks feos */
      if (!this.isMobile() && p.size > 1.5 && this.frameCount % 3 === 0) {
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = `${p.color}0.5)`;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}
