import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, throttleTime } from 'rxjs';

interface NavItem {
  label: string;
  anchor: string;
  rune: string;
}

@Component({
  selector: 'app-header',
  template: `
    <header class="header" [class.header--scrolled]="scrolled()">
      <div class="header__inner">
        <a class="header__logo" href="#hero" (click)="scrollTo('hero', $event)">
          <img
            class="header__logo-mark"
            src="/images/logo-96.png"
            srcset="/images/logo-96.png 1x, /images/logo-192.png 2x"
            width="44"
            height="44"
            alt=""
            aria-hidden="true"
          />
          <span class="header__logo-text">
            <span class="header__logo-name">Elias Uribe</span>
            <span class="header__logo-title">Fullstack Developer</span>
          </span>
        </a>

        <nav class="header__nav" aria-label="Navegación principal">
          @for (item of navItems; track item.anchor) {
            <a
              class="header__nav-link"
              [href]="'#' + item.anchor"
              (click)="scrollTo(item.anchor, $event)"
            >
              <span class="header__nav-rune" aria-hidden="true">{{ item.rune }}</span>
              {{ item.label }}
            </a>
          }
        </nav>

        <button
          class="header__mobile-toggle"
          type="button"
          [attr.aria-expanded]="mobileOpen()"
          aria-controls="mobile-nav"
          aria-label="Abrir menú"
          (click)="toggleMobile()"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      @if (mobileOpen()) {
        <nav id="mobile-nav" class="header__mobile-nav" aria-label="Menú móvil">
          @for (item of navItems; track item.anchor) {
            <a
              class="header__mobile-link"
              [href]="'#' + item.anchor"
              (click)="scrollTo(item.anchor, $event)"
            >
              <span aria-hidden="true">{{ item.rune }}</span> {{ item.label }}
            </a>
          }
        </nav>
      }
    </header>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 1.25rem 2rem;
      transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .header--scrolled {
      padding: 0.75rem 2rem;
      background: rgba(6, 12, 20, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(125, 211, 252, 0.1);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
    }
    .header__inner {
      max-width: 1280px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    .header__logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      color: inherit;
      flex-shrink: 0;
    }
    .header__logo-mark {
      width: 44px;
      height: 44px;
      display: block;
      flex-shrink: 0;
      filter: drop-shadow(0 0 8px rgba(125, 211, 252, 0.35));
      transition: filter 300ms, transform 300ms;
    }
    .header--scrolled .header__logo-mark {
      width: 38px;
      height: 38px;
    }
    .header__logo:hover .header__logo-mark {
      filter: drop-shadow(0 0 14px rgba(125, 211, 252, 0.6));
      transform: scale(1.05) rotate(-2deg);
    }
    .header__logo-text { display: flex; flex-direction: column; line-height: 1.2; }
    .header__logo-name {
      font-family: 'Cinzel', serif;
      font-size: 1rem;
      font-weight: 700;
      color: #e2e8f0;
      letter-spacing: 0.08em;
    }
    .header__logo-title {
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.7rem;
      color: #7dd3fc;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }
    .header__nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: auto;
    }
    .header__nav-link {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.4rem 0.8rem;
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #94a3b8;
      text-decoration: none;
      transition: color 250ms;
      position: relative;
    }
    .header__nav-link::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%) scaleX(0);
      width: 80%;
      height: 1px;
      background: #7dd3fc;
      transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .header__nav-link:hover { color: #e2e8f0; }
    .header__nav-link:hover::after { transform: translateX(-50%) scaleX(1); }
    .header__nav-link:focus-visible {
      outline: none;
      color: #e2e8f0;
      box-shadow: 0 0 0 2px rgba(125, 211, 252, 0.4);
      border-radius: 2px;
    }
    .header__nav-rune {
      font-size: 0.9rem;
      color: #7dd3fc;
      opacity: 0.6;
      transition: opacity 250ms;
    }
    .header__nav-link:hover .header__nav-rune { opacity: 1; }

    .header__mobile-toggle {
      display: none;
      flex-direction: column;
      gap: 5px;
      padding: 0.5rem;
      margin-left: auto;
      cursor: pointer;
      background: none;
      border: none;
    }
    .header__mobile-toggle span {
      display: block;
      width: 22px;
      height: 2px;
      background: #7dd3fc;
      transition: all 300ms;
    }
    .header__mobile-toggle:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px rgba(125, 211, 252, 0.4);
      border-radius: 2px;
    }

    .header__mobile-nav {
      display: flex;
      flex-direction: column;
      padding: 1rem 2rem 1.5rem;
      gap: 0.25rem;
      border-top: 1px solid rgba(125, 211, 252, 0.1);
      background: rgba(6, 12, 20, 0.95);
      backdrop-filter: blur(16px);
      animation: fadeInUp 200ms ease-out;
    }
    .header__mobile-link {
      padding: 0.75rem 0;
      font-family: 'Cinzel', serif;
      font-size: 0.875rem;
      letter-spacing: 0.1em;
      color: #94a3b8;
      text-decoration: none;
      border-bottom: 1px solid rgba(125, 211, 252, 0.05);
      transition: color 200ms;
    }
    .header__mobile-link:hover { color: #7dd3fc; }

    @media (max-width: 768px) {
      .header__nav { display: none; }
      .header__mobile-toggle { display: flex; }
      .header { padding: 1rem 1.25rem; }
      .header--scrolled { padding: 0.75rem 1.25rem; }
    }
  `],
})
export class HeaderComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly scrolled = signal(false);
  readonly mobileOpen = signal(false);

  readonly navItems: NavItem[] = [
    { label: 'Inicio',       anchor: 'hero',       rune: 'ᚠ' },
    { label: 'Sobre mí',     anchor: 'about',      rune: 'ᚢ' },
    { label: 'Habilidades',  anchor: 'skills',     rune: 'ᚱ' },
    { label: 'Proyectos',    anchor: 'projects',   rune: 'ᚦ' },
    { label: 'Experiencia',  anchor: 'experience', rune: 'ᚨ' },
    { label: 'Contacto',     anchor: 'contact',    rune: 'ᚲ' },
  ];

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    fromEvent(window, 'scroll', { passive: true })
      .pipe(throttleTime(80, undefined, { leading: true, trailing: true }), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.scrolled.set(window.scrollY > 50));
  }

  toggleMobile(): void {
    this.mobileOpen.update((v) => !v);
  }

  scrollTo(anchor: string, event: Event): void {
    event.preventDefault();
    this.mobileOpen.set(false);
    if (!isPlatformBrowser(this.platformId)) return;
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
