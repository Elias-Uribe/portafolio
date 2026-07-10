import { Component, input } from '@angular/core';
import { RuneDividerComponent } from '../rune-divider/rune-divider';

@Component({
  selector: 'app-section-header',
  imports: [RuneDividerComponent],
  template: `
    <div class="section-header">
      <p class="section-header__label">{{ label() }}</p>
      <h2 class="section-header__title">{{ title() }}</h2>
      @if (subtitle()) {
        <p class="section-header__subtitle">{{ subtitle() }}</p>
      }
      <app-rune-divider [variant]="dividerVariant()" />
    </div>
  `,
  styles: [`
    .section-header {
      text-align: center;
      margin-bottom: 4rem;
    }

    .section-header__label {
      font-family: 'Cinzel', serif;
      font-size: 0.75rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #7dd3fc;
      margin-bottom: 0.75rem;
      opacity: 0.8;
    }

    .section-header__title {
      font-family: 'Cinzel', serif;
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 700;
      color: #e2e8f0;
      margin-bottom: 1rem;
      text-shadow: 0 0 40px rgba(125, 211, 252, 0.2);
    }

    .section-header__subtitle {
      font-family: 'Rajdhani', sans-serif;
      font-size: 1.1rem;
      color: #94a3b8;
      max-width: 600px;
      margin: 0 auto 1rem;
      line-height: 1.6;
    }
  `],
})
export class SectionHeaderComponent {
  readonly label = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly dividerVariant = input<'frost' | 'gold'>('frost');
}
