import { Component, input } from '@angular/core';

type Variant = 'frost' | 'gold' | 'mixed';

/**
 * Divisor horizontal dorado con glifo central para separar secciones.
 * Reemplaza los dividers planos y da ritmo visual al scroll.
 */
@Component({
  selector: 'app-section-divider',
  template: `
    <div class="section-divider" [class]="'section-divider--' + variant()">
      <div class="section-divider__line section-divider__line--left" aria-hidden="true"></div>
      <div class="section-divider__glyph" aria-hidden="true">
        <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <!-- Diamante decorativo con dragón estilizado -->
          <circle cx="30" cy="30" r="18" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4"/>
          <circle cx="30" cy="30" r="10" fill="none" stroke="currentColor" stroke-width="1" opacity="0.7"/>
          <!-- Símbolo dracónico simplificado -->
          <path
            d="M 30 16 L 34 26 L 44 30 L 34 34 L 30 44 L 26 34 L 16 30 L 26 26 Z"
            fill="currentColor"
            opacity="0.85"
          />
          <circle cx="30" cy="30" r="2" fill="#020408"/>
        </svg>
      </div>
      <div class="section-divider__line section-divider__line--right" aria-hidden="true"></div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .section-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      padding: 2.5rem 2rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .section-divider__line {
      flex: 1;
      height: 1px;
      max-width: 340px;
      position: relative;

      &::before, &::after {
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 4px; height: 4px;
        background: currentColor;
        border-radius: 50%;
        opacity: 0.7;
      }
    }
    .section-divider__line--left  { color: rgba(125, 211, 252, 0.5); background: linear-gradient(90deg, transparent, currentColor 40%, currentColor); }
    .section-divider__line--left::before { left: 20%; }
    .section-divider__line--left::after  { right: 0; }

    .section-divider__line--right { color: rgba(125, 211, 252, 0.5); background: linear-gradient(90deg, currentColor, currentColor 60%, transparent); }
    .section-divider__line--right::before { left: 0; }
    .section-divider__line--right::after  { right: 20%; }

    .section-divider__glyph {
      color: #7dd3fc;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pulse-rune 4s ease-in-out infinite;
      filter: drop-shadow(0 0 12px rgba(125, 211, 252, 0.35));
    }
    .section-divider__glyph svg { width: 100%; height: 100%; }

    /* Variante Gold */
    .section-divider--gold .section-divider__line--left,
    .section-divider--gold .section-divider__line--right {
      color: rgba(251, 191, 36, 0.5);
    }
    .section-divider--gold .section-divider__glyph {
      color: #fbbf24;
      filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.4));
    }

    /* Variante Mixed: frost izquierda, gold derecha */
    .section-divider--mixed .section-divider__line--right {
      color: rgba(251, 191, 36, 0.5);
    }
    .section-divider--mixed .section-divider__glyph {
      color: #fbbf24;
    }

    @media (prefers-reduced-motion: reduce) {
      .section-divider__glyph { animation: none; }
    }
  `],
})
export class SectionDividerComponent {
  readonly variant = input<Variant>('frost');
}
