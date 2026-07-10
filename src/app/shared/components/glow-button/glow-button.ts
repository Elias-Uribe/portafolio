import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-glow-button',
  template: `
    <button
      class="glow-btn"
      [class]="'glow-btn--' + variant()"
      [type]="type()"
      (click)="clicked.emit()"
    >
      <span class="glow-btn__shimmer"></span>
      <span class="glow-btn__breath" aria-hidden="true"></span>
      <span class="glow-btn__content">
        @if (icon()) {
          <span class="glow-btn__icon">{{ icon() }}</span>
        }
        <ng-content />
      </span>
    </button>
  `,
  styles: [`
    .glow-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 2rem;
      font-family: 'Cinzel', serif;
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      border: 1px solid rgba(125, 211, 252, 0.4);
      background: transparent;
      color: #7dd3fc;
      cursor: pointer;
      overflow: hidden;
      transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
      clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
    }

    .glow-btn::before {
      content: '';
      position: absolute;
      inset: 0;
      background: rgba(125, 211, 252, 0.05);
      transition: background 300ms;
    }

    .glow-btn:hover {
      border-color: rgba(125, 211, 252, 0.8);
      color: #e0f2fe;
      box-shadow: 0 0 20px rgba(125, 211, 252, 0.3), 0 0 60px rgba(56, 189, 248, 0.1);
    }

    .glow-btn:hover::before {
      background: rgba(125, 211, 252, 0.1);
    }

    .glow-btn:active {
      transform: scale(0.97);
    }

    .glow-btn--gold {
      border-color: rgba(251, 191, 36, 0.4);
      color: #fbbf24;
    }
    .glow-btn--gold:hover {
      border-color: rgba(251, 191, 36, 0.8);
      color: #fef3c7;
      box-shadow: 0 0 20px rgba(251, 191, 36, 0.3), 0 0 60px rgba(251, 191, 36, 0.1);
    }
    .glow-btn--gold::before {
      background: rgba(251, 191, 36, 0.05);
    }

    .glow-btn--solid {
      background: rgba(125, 211, 252, 0.1);
      border-color: rgba(125, 211, 252, 0.6);
    }
    .glow-btn--solid:hover {
      background: rgba(125, 211, 252, 0.15);
    }

    .glow-btn__shimmer {
      position: absolute;
      top: 0;
      left: -100%;
      width: 60%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(125, 211, 252, 0.2),
        transparent
      );
      transform: skewX(-20deg);
      transition: left 0.6s ease;
    }

    .glow-btn:hover .glow-btn__shimmer {
      left: 150%;
    }

    .glow-btn__content {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .glow-btn__icon {
      font-size: 1rem;
    }

    /* Vaho de frío al hover */
    .glow-btn__breath {
      position: absolute;
      top: 50%;
      left: 100%;
      width: 40px;
      height: 22px;
      margin-top: -11px;
      border-radius: 50%;
      background: radial-gradient(ellipse, rgba(224, 242, 254, 0.55) 0%, rgba(224, 242, 254, 0) 70%);
      filter: blur(7px);
      opacity: 0;
      pointer-events: none;
    }
    .glow-btn:hover .glow-btn__breath {
      animation: btnBreath 1.2s ease-out;
    }
    @keyframes btnBreath {
      0%   { opacity: 0;   transform: translateX(0)   scale(0.5); }
      30%  { opacity: 0.85; transform: translateX(20px) scale(1); }
      100% { opacity: 0;   transform: translateX(70px) scale(1.6); }
    }
    @media (prefers-reduced-motion: reduce) {
      .glow-btn:hover .glow-btn__breath { animation: none; }
    }
  `],
})
export class GlowButtonComponent {
  readonly variant = input<'frost' | 'gold' | 'solid'>('frost');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly icon = input<string>('');

  readonly clicked = output<void>();
}
