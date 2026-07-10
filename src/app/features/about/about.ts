import { Component, inject } from '@angular/core';
import { PORTFOLIO_CONFIG } from '../../core/config/portfolio.config';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { NordicCornerComponent } from '../../shared/components/nordic-corner/nordic-corner';
import { RuneDividerComponent } from '../../shared/components/rune-divider/rune-divider';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { StandingStoneComponent } from '../../shared/components/standing-stone/standing-stone';

interface Attribute {
  icon: string;
  name: string;
  value: string;
}

@Component({
  selector: 'app-about',
  imports: [
    SectionHeaderComponent,
    RuneDividerComponent,
    NordicCornerComponent,
    StandingStoneComponent,
  ],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent {
  private readonly data = inject(PortfolioDataService);

  readonly timeline = this.data.timeline;
  readonly config = PORTFOLIO_CONFIG;

  readonly attributes: Attribute[] = [
    { icon: '📍', name: 'Ubicación',    value: PORTFOLIO_CONFIG.identity.location },
    { icon: '🎓', name: 'Formación',    value: 'Ing. Informática · UNNOBA (en curso)' },
    { icon: '💼', name: 'Empresa',      value: 'Edit Software · Full-Stack Dev' },
    { icon: '📧', name: 'Email',        value: PORTFOLIO_CONFIG.contact.email },
    { icon: '🔗', name: 'LinkedIn',     value: PORTFOLIO_CONFIG.socials.linkedinHandle },
    { icon: '⚔️', name: 'Especialidad', value: 'Angular · Spring Boot · Java' },
  ];
}
