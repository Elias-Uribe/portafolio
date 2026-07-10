import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { gsap } from 'gsap';
import { PORTFOLIO_CONFIG } from '../../core/config/portfolio.config';
import { AuroraComponent } from '../../shared/components/aurora/aurora';
import { GlowButtonComponent } from '../../shared/components/glow-button/glow-button';
import { ParticleBgComponent } from '../../shared/components/particle-bg/particle-bg';
import { CountUpDirective } from '../../shared/directives/count-up.directive';

@Component({
  selector: 'app-hero',
  imports: [ParticleBgComponent, AuroraComponent, GlowButtonComponent, CountUpDirective],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  @ViewChild('heroSection') heroRef!: ElementRef<HTMLElement>;

  readonly config = PORTFOLIO_CONFIG;
  readonly cvHref = PORTFOLIO_CONFIG.cv.es;
  readonly typewriterText = signal('');

  private readonly phrases = [
    'Arquitecto de experiencias web.',
    'Especialista en Angular & Spring Boot.',
    'Constructor de interfaces épicas.',
    'Fullstack desde Junín, Argentina.',
  ];
  private phraseIndex = 0;
  private charIndex = 0;
  private deleting = false;
  private typeTimeout: ReturnType<typeof setTimeout> | null = null;
  private ctx: gsap.Context | null = null;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(
          [
            '.hero__eyebrow',
            '.hero__availability',
            '.hero__title-word',
            '.hero__subtitle',
            '.hero__cta-group',
            '.hero__scroll',
            '.hero__rune-bg',
          ],
          { opacity: 1, y: 0, scale: 1 },
        );
        this.startTypewriter();
        return;
      }

      const tl = gsap.timeline({ delay: 0.3 });
      tl.from('.hero__eyebrow', { opacity: 0, y: -20, duration: 0.8, ease: 'power3.out' })
        .from('.hero__availability', { opacity: 0, y: -10, duration: 0.5, ease: 'power2.out' }, '-=0.5')
        .from('.hero__title-word', { opacity: 0, y: 60, duration: 1, stagger: 0.15, ease: 'power3.out' }, '-=0.4')
        .from('.hero__subtitle', { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out' }, '-=0.3')
        .from('.hero__cta-group', { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' }, '-=0.2')
        .from('.hero__scroll', { opacity: 0, duration: 0.6, ease: 'power1.out' }, '-=0.1')
        .from('.hero__rune-bg', { opacity: 0, scale: 0.85, duration: 2, ease: 'power1.out' }, 0)
        .add(() => {
          this.startTypewriter();
          this.triggerShout();
        });

      gsap.to('.hero__rune-bg', { rotation: 360, duration: 120, repeat: -1, ease: 'none' });
      gsap.to('.hero__orb', {
        y: -25,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 1,
      });
    }, this.heroRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
    if (this.typeTimeout) clearTimeout(this.typeTimeout);
  }

  scrollToSection(id: string): void {
    if (!this.isBrowser) return;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /** FUS RO DAH — onda expansiva desde el nombre. Se puede re-invocar clickeando "Uribe". */
  triggerShout(): void {
    if (!this.isBrowser) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const shout = this.heroRef.nativeElement.querySelector<HTMLElement>('.hero__shout');
    if (!shout) return;
    gsap.killTweensOf(shout);
    gsap.fromTo(
      shout,
      { scale: 0.15, opacity: 0.95 },
      {
        scale: 6,
        opacity: 0,
        duration: 1.6,
        ease: 'power2.out',
      },
    );
  }

  private startTypewriter(): void {
    if (!this.isBrowser) return;

    const type = () => {
      const current = this.phrases[this.phraseIndex];
      if (!this.deleting) {
        this.charIndex++;
        this.typewriterText.set(current.slice(0, this.charIndex));
        if (this.charIndex >= current.length) {
          this.deleting = true;
          this.typeTimeout = setTimeout(type, 2200);
          return;
        }
        this.typeTimeout = setTimeout(type, 60);
      } else {
        this.charIndex--;
        this.typewriterText.set(current.slice(0, this.charIndex));
        if (this.charIndex <= 0) {
          this.deleting = false;
          this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
          this.typeTimeout = setTimeout(type, 400);
          return;
        }
        this.typeTimeout = setTimeout(type, 30);
      }
    };

    this.typeTimeout = setTimeout(type, 800);
  }
}
