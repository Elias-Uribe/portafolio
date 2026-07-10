import { Component, OnInit, inject } from '@angular/core';
import { FxService } from '../../core/services/fx.service';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';
import { HeroComponent } from '../../features/hero/hero';
import { AboutComponent } from '../../features/about/about';
import { SkillsComponent } from '../../features/skills/skills';
import { ProjectsComponent } from '../../features/projects/projects';
import { ExperienceComponent } from '../../features/experience/experience';
import { ContactComponent } from '../../features/contact/contact';
import { SnowfallComponent } from '../../shared/components/snowfall/snowfall';
import { SectionDividerComponent } from '../../shared/components/section-divider/section-divider';

@Component({
  selector: 'app-shell',
  imports: [
    HeaderComponent,
    FooterComponent,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ProjectsComponent,
    ExperienceComponent,
    ContactComponent,
    SnowfallComponent,
    SectionDividerComponent,
  ],
  template: `
    <a href="#hero" class="skip-link">Saltar al contenido</a>

    <!-- Ambient layers globales -->
    <app-snowfall />

    <app-header />
    <main id="main">
      <app-hero />
      <app-section-divider variant="frost" />
      <app-about />
      <app-section-divider variant="mixed" />
      <app-skills />
      <app-section-divider variant="gold" />
      <app-projects />
      <app-section-divider variant="mixed" />
      <app-experience />
      <app-section-divider variant="frost" />
      <app-contact />
    </main>
    <app-footer />
  `,
  styles: [`
    :host { display: block; background: #020408; }
    main { min-height: 100vh; position: relative; z-index: 2; }

    .skip-link {
      position: absolute;
      top: -100px;
      left: 1rem;
      z-index: 200;
      padding: 0.75rem 1.25rem;
      background: #060c14;
      color: #7dd3fc;
      font-family: 'Cinzel', serif;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-decoration: none;
      border: 1px solid rgba(125, 211, 252, 0.5);
      transition: top 200ms ease;
    }
    .skip-link:focus { top: 1rem; outline: none; box-shadow: 0 0 0 3px rgba(125, 211, 252, 0.35); }
  `],
})
export class ShellComponent implements OnInit {
  private readonly fx = inject(FxService);

  ngOnInit(): void {
    this.fx.installGlobalBurstHandler();
  }
}
