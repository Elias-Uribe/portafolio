import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';

type StoneId = 'mage' | 'warrior' | 'thief';

interface Stone {
  id: StoneId;
  name: string;
  rune: string;
  color: string;
  boon: string;
  devMeaning: string;
}

const STORAGE_KEY = 'skyrim-stone';

/**
 * Widget "Piedra Guardiana" — un guiño a las 13 Standing Stones de Skyrim.
 * El usuario elige The Mage, The Warrior o The Thief. Persiste en localStorage.
 */
@Component({
  selector: 'app-standing-stone',
  template: `
    <div class="stones">
      <div class="stones__header">
        <span class="stones__rune" aria-hidden="true">◆</span>
        <div>
          <h3 class="stones__title">Piedra Guardiana</h3>
          <p class="stones__subtitle">Elige la piedra que mejor te describa como developer</p>
        </div>
      </div>

      <div class="stones__row" role="radiogroup" aria-label="Standing Stone">
        @for (stone of stones; track stone.id) {
          <button
            type="button"
            class="stone"
            [class.stone--active]="active() === stone.id"
            [style.--stone-color]="stone.color"
            role="radio"
            [attr.aria-checked]="active() === stone.id"
            (click)="select(stone.id)"
          >
            <span class="stone__aura" aria-hidden="true"></span>
            <span class="stone__pillar" aria-hidden="true"></span>
            <span class="stone__rune" aria-hidden="true">{{ stone.rune }}</span>
            <span class="stone__name">{{ stone.name }}</span>
          </button>
        }
      </div>

      @if (activeStone(); as s) {
        <div class="stones__reveal" role="status" aria-live="polite">
          <p class="stones__boon">
            <span class="stones__boon-label">Don:</span> {{ s.boon }}
          </p>
          <p class="stones__meaning">{{ s.devMeaning }}</p>
        </div>
      } @else {
        <p class="stones__empty">
          <em>Aún no se ha elegido una piedra. Toca una para revelar su don.</em>
        </p>
      }
    </div>
  `,
  styles: [`
    :host { display: block; margin-top: 1.5rem; }

    .stones {
      padding: 1.5rem;
      background: rgba(10, 22, 40, 0.55);
      border: 1px solid rgba(125, 211, 252, 0.12);
      position: relative;
    }

    .stones__header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }

    .stones__rune {
      font-size: 1.4rem;
      color: #fbbf24;
      animation: runeGlow 3s ease-in-out infinite;
    }

    .stones__title {
      font-family: 'Cinzel', serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: #e2e8f0;
      letter-spacing: 0.1em;
      margin-bottom: 0.15rem;
    }

    .stones__subtitle {
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.72rem;
      color: #64748b;
      letter-spacing: 0.05em;
    }

    .stones__row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }

    .stone {
      --stone-color: #7dd3fc;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      padding: 1rem 0.5rem 0.85rem;
      background: rgba(6, 12, 20, 0.7);
      border: 1px solid rgba(125, 211, 252, 0.15);
      cursor: pointer;
      overflow: hidden;
      transition: border-color 300ms, background 300ms, transform 250ms;
      color: #cbd5e1;
      font-family: 'Cinzel', serif;

      &:hover {
        border-color: var(--stone-color);
        background: rgba(10, 22, 40, 0.85);
        transform: translateY(-2px);
      }

      &--active {
        border-color: var(--stone-color);
        background: color-mix(in srgb, var(--stone-color) 12%, rgba(10, 22, 40, 0.9));
        box-shadow:
          0 0 24px color-mix(in srgb, var(--stone-color) 25%, transparent),
          inset 0 0 20px color-mix(in srgb, var(--stone-color) 10%, transparent);

        .stone__aura   { opacity: 1; animation: stoneAura 2.5s ease-in-out infinite; }
        .stone__pillar { opacity: 1; }
        .stone__rune   { color: var(--stone-color); text-shadow: 0 0 12px color-mix(in srgb, var(--stone-color) 55%, transparent); }
        .stone__name   { color: color-mix(in srgb, var(--stone-color) 90%, #fff); }
      }
    }

    .stone__aura {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 60%, color-mix(in srgb, var(--stone-color) 22%, transparent) 0%, transparent 65%);
      opacity: 0;
      transition: opacity 400ms;
      pointer-events: none;
    }

    .stone__pillar {
      position: absolute;
      bottom: -3px;
      left: 50%;
      transform: translateX(-50%);
      width: 3px;
      height: 60%;
      background: linear-gradient(180deg, transparent 0%, var(--stone-color) 100%);
      opacity: 0;
      transition: opacity 400ms;
      pointer-events: none;
      filter: blur(1.5px);
    }

    .stone__rune {
      position: relative;
      font-size: 1.6rem;
      font-weight: 700;
      color: rgba(148, 163, 184, 0.7);
      transition: color 300ms, text-shadow 300ms;
    }

    .stone__name {
      position: relative;
      font-size: 0.72rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      font-weight: 600;
      transition: color 300ms;
    }

    @keyframes stoneAura {
      0%, 100% { opacity: 0.75; }
      50%      { opacity: 1; }
    }

    .stones__reveal {
      padding: 0.9rem 1rem;
      background: rgba(6, 12, 20, 0.7);
      border-left: 2px solid #fbbf24;
      animation: fadeIn 300ms ease-out;
    }

    .stones__boon {
      font-family: 'Cinzel', serif;
      font-size: 0.85rem;
      color: #e2e8f0;
      margin-bottom: 0.35rem;
      letter-spacing: 0.03em;
    }

    .stones__boon-label {
      color: #fbbf24;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      font-size: 0.7rem;
      margin-right: 0.35rem;
    }

    .stones__meaning {
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.82rem;
      color: #94a3b8;
      line-height: 1.55;
      font-style: italic;
    }

    .stones__empty {
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.8rem;
      color: #475569;
      text-align: center;
      padding: 0.5rem;
    }

    @media (prefers-reduced-motion: reduce) {
      .stone--active .stone__aura { animation: none; }
      .stones__rune { animation: none; }
    }
  `],
})
export class StandingStoneComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  readonly stones: readonly Stone[] = [
    {
      id: 'mage',
      name: 'The Mage',
      rune: '⚛',
      color: '#a78bfa',
      boon: 'Aumenta el aprendizaje en Magia y Encantamiento.',
      devMeaning: 'Te encanta entender lo abstracto: arquitectura, patrones, sistemas de tipos. Diseñás soluciones antes de escribir la primera línea.',
    },
    {
      id: 'warrior',
      name: 'The Warrior',
      rune: '⚔',
      color: '#fbbf24',
      boon: 'Aumenta el combate en Armas y Armadura Pesada.',
      devMeaning: 'Rompés deadlines a puro código. Preferís entregar un MVP sólido hoy antes que el diseño perfecto en un mes.',
    },
    {
      id: 'thief',
      name: 'The Thief',
      rune: '🗡',
      color: '#22d3ee',
      boon: 'Aumenta el sigilo en Robo y Alquimia.',
      devMeaning: 'Encontrás el atajo elegante que los demás no ven. Reutilizás, refactorizás y hackeás soluciones creativas.',
    },
  ];

  readonly active = signal<StoneId | null>(null);

  readonly activeStone = () => this.stones.find((s) => s.id === this.active()) ?? null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const saved = localStorage.getItem(STORAGE_KEY) as StoneId | null;
    if (saved && this.stones.some((s) => s.id === saved)) {
      this.active.set(saved);
    }
  }

  select(id: StoneId): void {
    const next = this.active() === id ? null : id;
    this.active.set(next);
    if (isPlatformBrowser(this.platformId)) {
      if (next) localStorage.setItem(STORAGE_KEY, next);
      else localStorage.removeItem(STORAGE_KEY);
    }
  }
}
