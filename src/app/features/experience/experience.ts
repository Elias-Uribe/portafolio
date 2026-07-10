import { Component, inject } from '@angular/core';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';

@Component({
  selector: 'app-experience',
  imports: [SectionHeaderComponent],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class ExperienceComponent {
  private readonly data = inject(PortfolioDataService);

  readonly experiences = this.data.experiences;
  readonly education = this.data.education;
}
