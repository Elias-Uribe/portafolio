import { Component } from '@angular/core';
import { PORTFOLIO_CONFIG } from '../../core/config/portfolio.config';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="footer__inner">
        <div class="footer__rune-row" aria-hidden="true">
          <span>ᚠ</span><span>ᚢ</span><span>ᚦ</span><span>ᚨ</span><span>ᚱ</span>
          <span>ᚲ</span><span>ᚷ</span><span>ᚹ</span><span>ᚺ</span><span>ᚾ</span>
        </div>

        <div class="footer__divider"></div>

        <div class="footer__content">
          <p class="footer__name">{{ config.identity.fullName }}</p>
          <p class="footer__subtitle">{{ config.identity.role }} · {{ config.identity.tagline }}</p>

          <div class="footer__links">
            <a [href]="config.socials.linkedin" target="_blank" rel="noopener noreferrer" class="footer__link" aria-label="LinkedIn">
              LinkedIn
            </a>
            <span class="footer__link-sep" aria-hidden="true">·</span>
            <a [href]="config.socials.github" target="_blank" rel="noopener noreferrer" class="footer__link" aria-label="GitHub">
              GitHub
            </a>
            <span class="footer__link-sep" aria-hidden="true">·</span>
            <a [href]="'mailto:' + config.contact.email" class="footer__link">Email</a>
            <span class="footer__link-sep" aria-hidden="true">·</span>
            <span class="footer__link footer__link--location">{{ config.identity.location }}</span>
          </div>
        </div>

        <p class="footer__copy">
          <span class="footer__copy-rune" aria-hidden="true">ᚱ</span>
          {{ year }} · Forjado con Angular 21 & dedicación
          <span class="footer__copy-rune" aria-hidden="true">ᚱ</span>
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      position: relative;
      padding: 3rem 2rem 2rem;
      background: linear-gradient(to top, #020408 60%, transparent);
      text-align: center;
    }
    .footer__inner { max-width: 1280px; margin: 0 auto; }

    .footer__rune-row {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
      color: rgba(125, 211, 252, 0.2);
      letter-spacing: 0.5rem;
    }
    .footer__rune-row span { animation: runeGlow 3s ease-in-out infinite; }
    .footer__rune-row span:nth-child(odd)  { animation-delay: 0.3s; }
    .footer__rune-row span:nth-child(even) { animation-delay: 0.9s; }

    .footer__divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(125, 211, 252, 0.2), transparent);
      margin-bottom: 1.5rem;
    }
    .footer__name {
      font-family: 'Cinzel', serif;
      font-size: 1.1rem;
      font-weight: 600;
      color: #e2e8f0;
      letter-spacing: 0.08em;
      margin-bottom: 0.25rem;
    }
    .footer__subtitle {
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.85rem;
      color: #7dd3fc;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: 1rem;
    }
    .footer__links {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }
    .footer__link {
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      color: #94a3b8;
      text-decoration: none;
      letter-spacing: 0.05em;
      transition: color 250ms;
    }
    .footer__link:hover { color: #7dd3fc; }
    .footer__link--location { cursor: default; }
    .footer__link-sep { color: rgba(125, 211, 252, 0.3); }

    .footer__copy {
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.8rem;
      color: #475569;
      letter-spacing: 0.05em;
    }
    .footer__copy-rune { color: rgba(125, 211, 252, 0.3); margin: 0 0.5rem; }
  `],
})
export class FooterComponent {
  readonly config = PORTFOLIO_CONFIG;
  readonly year = new Date().getFullYear();
}
