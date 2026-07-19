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
            src="images/logo-96.png"
            srcset="images/logo-96.png 1x, images/logo-192.png 2x"
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
          @for (item of navItems; track item.anchor; let i = $index) {
            @if (i > 0) {
              <span class="header__nav-sep" aria-hidden="true">◆</span>
            }
            <a
              class="header__nav-link"
              [href]="'#' + item.anchor"
              (click)="scrollTo(item.anchor, $event)"
              data-fx="burst"
            >
              <span class="header__nav-rune font-rune" aria-hidden="true">{{ item.rune }}</span>
              <span class="header__nav-label">{{ item.label }}</span>
            </a>
          }

          <!-- Toggle Dawnguard (vampire mode) -->
          <button
            type="button"
            class="header__theme-toggle"
            [class.header__theme-toggle--on]="dawnguard()"
            (click)="toggleDawnguard()"
            [attr.aria-pressed]="dawnguard()"
            [attr.data-tip]="dawnguard() ? 'Volver al alba' : 'Dawnguard mode'"
            aria-label="Alternar tema Dawnguard"
          >
            <span aria-hidden="true">{{ dawnguard() ? '☾' : '☼' }}</span>
          </button>
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
              <span class="font-rune" aria-hidden="true">{{ item.rune }}</span> {{ item.label }}
            </a>
          }
          <button
            type="button"
            class="header__mobile-link header__mobile-toggle-theme"
            (click)="toggleDawnguard()"
          >
            <span aria-hidden="true">{{ dawnguard() ? '☾' : '☼' }}</span>
            {{ dawnguard() ? 'Volver al alba' : 'Modo Dawnguard' }}
          </button>
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
      gap: 0.35rem;
      margin-left: auto;
    }
    .header__nav-link {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.4rem 0.7rem;
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.1em;
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
      width: 70%;
      height: 1px;
      background: linear-gradient(90deg, transparent, #fbbf24 30%, #fbbf24 70%, transparent);
      transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .header__nav-link:hover { color: #fef3c7; }
    .header__nav-link:hover::after { transform: translateX(-50%) scaleX(1); }
    .header__nav-link:focus-visible {
      outline: none;
      color: #fef3c7;
      box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.4);
      border-radius: 2px;
    }
    .header__nav-rune {
      font-size: 1rem;
      line-height: 1;
      color: #fbbf24;
      opacity: 0.65;
      transition: opacity 250ms, text-shadow 250ms;
      /* stack de fuentes forzado por :host — usamos font-rune inline */
      text-shadow: 0 0 6px rgba(251, 191, 36, 0.15);
    }
    .header__nav-link:hover .header__nav-rune {
      opacity: 1;
      text-shadow: 0 0 10px rgba(251, 191, 36, 0.55);
    }
    .header__nav-label { line-height: 1; }

    /* Separador vertical dorado tipo cadena de eslabones */
    .header__nav-sep {
      color: rgba(251, 191, 36, 0.35);
      font-size: 0.35rem;
      user-select: none;
      pointer-events: none;
      padding: 0 0.1rem;
    }

    /* Toggle Dawnguard */
    .header__theme-toggle {
      margin-left: 0.5rem;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(125, 211, 252, 0.05);
      border: 1px solid rgba(125, 211, 252, 0.25);
      color: #fbbf24;
      cursor: pointer;
      transition: all 250ms;
      clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
      font-size: 1.1rem;
    }
    .header__theme-toggle:hover {
      background: rgba(251, 191, 36, 0.08);
      border-color: rgba(251, 191, 36, 0.55);
      transform: rotate(-8deg);
    }
    .header__theme-toggle--on {
      background: rgba(168, 85, 247, 0.15);
      border-color: rgba(168, 85, 247, 0.55);
      color: #f0abfc;
      box-shadow: 0 0 16px rgba(168, 85, 247, 0.3);
    }
    .header__theme-toggle:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.4);
    }

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

    .header__mobile-toggle-theme {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      background: none;
      color: #fbbf24;
      text-transform: none;
      font-family: 'Cinzel', serif;
    }

    @media (max-width: 768px) {
      .header__nav { display: none; }
      .header__mobile-toggle { display: flex; margin-left: auto; }
      .header { padding: 0.85rem 1rem; }
      .header--scrolled { padding: 0.65rem 1rem; }
      .header__inner { gap: 0.75rem; }
      .header__logo-name { font-size: 0.9rem; }
      .header__logo-title { font-size: 0.62rem; letter-spacing: 0.12em; }
      .header__logo-mark { width: 38px; height: 38px; }
      .header--scrolled .header__logo-mark { width: 34px; height: 34px; }
    }

    @media (max-width: 380px) {
      .header__logo-text { display: none; }
      .header { padding: 0.7rem 0.85rem; }
    }
  `],
})
export class HeaderComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly scrolled = signal(false);
  readonly mobileOpen = signal(false);
  readonly dawnguard = signal(false);
  private dawnguardTimeout: ReturnType<typeof setTimeout> | null = null;

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

  /** Activa/desactiva el tema Dawnguard. Auto-revierte a los 30s. */
  toggleDawnguard(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const next = !this.dawnguard();
    this.dawnguard.set(next);
    document.documentElement.setAttribute('data-theme', next ? 'dawnguard' : '');
    if (this.dawnguardTimeout) {
      clearTimeout(this.dawnguardTimeout);
      this.dawnguardTimeout = null;
    }
    if (next) {
      this.dawnguardTimeout = setTimeout(() => {
        this.dawnguard.set(false);
        document.documentElement.setAttribute('data-theme', '');
        this.dawnguardTimeout = null;
      }, 30000);
    }
  }
}
