import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

/**
 * Efectos globales del portfolio:
 * - Level-up burst dorado en la posición del clic sobre cualquier
 *   elemento con `data-fx="burst"`.
 */
@Injectable({ providedIn: 'root' })
export class FxService {
  private readonly platformId = inject(PLATFORM_ID);

  /** Onda expansiva dorada desde el punto del clic. Se auto-remueve. */
  burst(x: number, y: number): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const el = document.createElement('span');
    el.className = 'fx-burst';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  /**
   * Registra un handler global de clicks: cualquier elemento con
   * `data-fx="burst"` (o descendiente) dispara un burst en las coords del clic.
   */
  installGlobalBurstHandler(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const trigger = target.closest<HTMLElement>('[data-fx="burst"]');
      if (!trigger) return;
      this.burst(e.clientX, e.clientY);
    });
  }
}
