import { Component, input } from '@angular/core';

/**
 * Spinner temático: sello de dragón rotando lento.
 * Reemplaza el círculo/dots genérico en estados de carga.
 */
@Component({
  selector: 'app-loading-dragon',
  template: `
    <div class="loading-dragon" [attr.aria-label]="label()" role="status">
      <svg class="loading-dragon__mark" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <!-- Anillo exterior -->
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="1" opacity="0.4" stroke-dasharray="4 4"/>
        <!-- Ala izquierda dracónica -->
        <path
          d="M 50 20 Q 30 30 25 50 Q 30 60 42 55 Q 46 45 50 50"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          opacity="0.85"
        />
        <!-- Ala derecha dracónica -->
        <path
          d="M 50 20 Q 70 30 75 50 Q 70 60 58 55 Q 54 45 50 50"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          opacity="0.85"
        />
        <!-- Cuerpo central -->
        <path
          d="M 50 22 L 50 78"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
        <!-- Corona/crestas -->
        <path d="M 44 30 L 50 22 L 56 30" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <!-- Ojo -->
        <circle cx="50" cy="50" r="3" fill="currentColor"/>
      </svg>
      <span class="sr-only">{{ label() }}</span>
    </div>
  `,
  styles: [`
    :host { display: inline-flex; align-items: center; justify-content: center; }
    .loading-dragon {
      width: var(--dragon-size, 42px);
      height: var(--dragon-size, 42px);
      color: #fbbf24;
      filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.5));
    }
    .loading-dragon__mark {
      width: 100%;
      height: 100%;
      animation: dragonSpin 3s linear infinite;
    }
    @keyframes dragonSpin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @media (prefers-reduced-motion: reduce) {
      .loading-dragon__mark { animation: none; opacity: 0.7; }
    }
  `],
})
export class LoadingDragonComponent {
  readonly label = input<string>('Cargando');
}
