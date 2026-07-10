import { Component, input } from '@angular/core';

type Variant = 'frost' | 'gold';
type Glyph = 'dragon' | 'hammer' | 'rune';

/**
 * Divisor inline con glifo ilustrado del Elder Scrolls:
 * - dragon: dragón de dos cabezas (emblema imperial)
 * - hammer: martillo de Talos
 * - rune:   variante con carácter rúnico (para compatibilidad)
 */
@Component({
  selector: 'app-rune-divider',
  template: `
    <div class="rune-divider" [class]="'rune-divider--' + variant()">
      <span class="rune-divider__line" aria-hidden="true"></span>

      <span class="rune-divider__center" aria-hidden="true">
        @if (glyph() === 'dragon') {
          <!-- Dragón de dos cabezas (emblema imperial simplificado) -->
          <svg viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg" class="rune-divider__svg">
            <!-- Cuerpo central -->
            <path d="M 30 16 L 34 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <!-- Cabeza izquierda -->
            <path d="M 28 16 Q 22 12 16 14 Q 10 15 6 12 M 16 14 L 12 10 M 16 14 L 12 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="17.5" cy="14" r="1.2" fill="currentColor"/>
            <!-- Cabeza derecha -->
            <path d="M 36 16 Q 42 12 48 14 Q 54 15 58 12 M 48 14 L 52 10 M 48 14 L 52 18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="46.5" cy="14" r="1.2" fill="currentColor"/>
            <!-- Alas superiores -->
            <path d="M 28 16 Q 26 8 20 6 M 36 16 Q 38 8 44 6" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
            <!-- Cola / detalles inferiores -->
            <path d="M 30 18 Q 28 22 24 24 M 34 18 Q 36 22 40 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.7"/>
            <!-- Rombo central -->
            <path d="M 32 12 L 34 16 L 32 20 L 30 16 Z" fill="currentColor" opacity="0.9"/>
          </svg>
        } @else if (glyph() === 'hammer') {
          <!-- Martillo de Talos (Mjolnir estilizado) -->
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" class="rune-divider__svg">
            <!-- Cabeza del martillo -->
            <rect x="6" y="8" width="20" height="8" fill="currentColor" opacity="0.85" rx="1"/>
            <!-- Detalles de la cabeza -->
            <line x1="10" y1="8" x2="10" y2="16" stroke="#020408" stroke-width="1" opacity="0.4"/>
            <line x1="22" y1="8" x2="22" y2="16" stroke="#020408" stroke-width="1" opacity="0.4"/>
            <!-- Runa en el centro del martillo -->
            <text x="16" y="14" text-anchor="middle" font-family="Cinzel, serif" font-size="6" font-weight="700" fill="#020408">ᚦ</text>
            <!-- Mango -->
            <rect x="14" y="16" width="4" height="12" fill="currentColor" opacity="0.85"/>
            <line x1="16" y1="17" x2="16" y2="27" stroke="#020408" stroke-width="0.5" opacity="0.4"/>
            <!-- Pomo -->
            <circle cx="16" cy="29" r="2" fill="currentColor" opacity="0.9"/>
          </svg>
        } @else {
          <span class="rune-divider__symbol">{{ symbol() }}</span>
        }
      </span>

      <span class="rune-divider__line" aria-hidden="true"></span>
    </div>
  `,
  styles: [`
    .rune-divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 2rem 0;
      color: #7dd3fc;
    }

    .rune-divider__line {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, currentColor 40%, currentColor 60%, transparent);
      opacity: 0.4;
    }

    .rune-divider__center {
      display: flex;
      align-items: center;
      justify-content: center;
      color: inherit;
    }

    .rune-divider__svg {
      width: 44px;
      height: auto;
      display: block;
      color: inherit;
      filter: drop-shadow(0 0 6px color-mix(in srgb, currentColor 35%, transparent));
      animation: runeGlow 3s ease-in-out infinite;
    }

    .rune-divider__symbol {
      font-size: 1.25rem;
      color: inherit;
      animation: runeGlow 3s ease-in-out infinite;
      user-select: none;
    }

    .rune-divider--gold { color: #fbbf24; }

    @media (prefers-reduced-motion: reduce) {
      .rune-divider__svg, .rune-divider__symbol { animation: none; }
    }
  `],
})
export class RuneDividerComponent {
  readonly variant = input<Variant>('frost');
  readonly symbol = input<string>('ᚱ');
  readonly glyph = input<Glyph>('dragon');
}
