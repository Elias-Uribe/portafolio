import { Component, input } from '@angular/core';

type Variant = 'frost' | 'gold';
type Position = 'tl' | 'tr' | 'bl' | 'br';

/**
 * SVG de nudo nórdico entrelazado — inspirado en los sellos de las Nordic Ruins.
 * Reemplaza los corner decorations planos.
 */
@Component({
  selector: 'app-nordic-corner',
  template: `
    <svg
      class="nordic-corner"
      [class.nordic-corner--gold]="variant() === 'gold'"
      [attr.data-position]="position()"
      viewBox="0 0 40 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <!-- Nudo entrelazado: dos curvas cruzadas + linea de esquina -->
      <path
        d="M 2 2 L 2 14 M 2 2 L 14 2"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        opacity="0.9"
      />
      <path
        d="M 6 6 Q 12 6 12 12 Q 12 18 18 18"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        opacity="0.65"
      />
      <path
        d="M 18 6 Q 18 12 12 12"
        fill="none"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        opacity="0.65"
      />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" opacity="0.9" />
      <circle cx="4" cy="4" r="0.8" fill="currentColor" opacity="0.5" />
    </svg>
  `,
  styles: [`
    :host {
      position: absolute;
      width: 32px;
      height: 32px;
      pointer-events: none;
      color: #7dd3fc;
      display: block;
    }
    .nordic-corner { width: 100%; height: 100%; transition: transform 400ms ease, filter 400ms ease; }
    .nordic-corner--gold { color: #fbbf24; }

    /* Posicionamiento por atributo data-position (rota el SVG) */
    :host:has([data-position="tl"]) { top: -1px; left: -1px; }
    :host:has([data-position="tr"]) { top: -1px; right: -1px; }
    :host:has([data-position="tr"]) .nordic-corner { transform: scaleX(-1); }
    :host:has([data-position="bl"]) { bottom: -1px; left: -1px; }
    :host:has([data-position="bl"]) .nordic-corner { transform: scaleY(-1); }
    :host:has([data-position="br"]) { bottom: -1px; right: -1px; }
    :host:has([data-position="br"]) .nordic-corner { transform: scale(-1, -1); }
  `],
})
export class NordicCornerComponent {
  readonly variant = input<Variant>('frost');
  readonly position = input<Position>('tl');
}
