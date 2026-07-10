import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  input,
} from '@angular/core';

/**
 * Directiva standalone: interpola de 0 al valor final cuando el elemento
 * entra en el viewport. Respeta prefers-reduced-motion.
 *
 * Uso: <span [appCountUp]="4" suffix="+">4</span>
 */
@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);

  readonly appCountUp = input.required<number>();
  readonly suffix = input<string>('');
  readonly duration = input<number>(1600);

  private observer?: IntersectionObserver;
  private raf = 0;
  private started = false;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      this.host.nativeElement.textContent = `${this.appCountUp()}${this.suffix()}`;
      return;
    }

    this.host.nativeElement.textContent = `0${this.suffix()}`;

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !this.started) {
            this.started = true;
            this.run();
            this.observer?.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.raf) cancelAnimationFrame(this.raf);
  }

  private run(): void {
    const target = this.appCountUp();
    const duration = this.duration();
    const start = performance.now();

    const step = () => {
      const elapsed = performance.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      this.host.nativeElement.textContent = `${value}${this.suffix()}`;
      if (t < 1) this.raf = requestAnimationFrame(step);
    };

    this.raf = requestAnimationFrame(step);
  }
}
