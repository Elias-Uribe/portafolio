import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Skill, SkillCategory } from '../../core/models/portfolio.models';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';

type CategoryId = SkillCategory | 'all';

interface CategoryTab {
  id: CategoryId;
  label: string;
  rune: string;
}

interface StarNode {
  skill: Skill;
  cx: number;
  cy: number;
  size: number;
}

interface ConstellationCluster {
  id: SkillCategory;
  label: string;
  rune: string;
  originX: number;
  originY: number;
  labelDy: number;
  stars: StarNode[];
}

interface ClusterLayoutSpec {
  id: SkillCategory;
  label: string;
  rune: string;
  cx: number;
  cy: number;
  radius: number;
  labelDy: number;
}

@Component({
  selector: 'app-skills',
  imports: [SectionHeaderComponent],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class SkillsComponent implements AfterViewInit, OnDestroy {
  private readonly data = inject(PortfolioDataService);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('constellationRef') constellationRef?: ElementRef<HTMLElement>;

  readonly categories: CategoryTab[] = [
    { id: 'all',          label: 'Todo',           rune: 'ᚠ' },
    { id: 'frontend',     label: 'Frontend',       rune: 'ᚢ' },
    { id: 'backend',      label: 'Backend',        rune: 'ᚦ' },
    { id: 'database',     label: 'Bases',          rune: 'ᚨ' },
    { id: 'tools',        label: 'Herramientas',   rune: 'ᚱ' },
    { id: 'architecture', label: 'Arquitectura',   rune: 'ᚲ' },
  ];

  readonly activeCategory = signal<CategoryId>('all');
  readonly hoveredSkill = signal<Skill | null>(null);
  readonly drawn = signal(false);

  private readonly layouts: ClusterLayoutSpec[] = [
    { id: 'frontend',     label: 'Frontend',       rune: 'ᚢ', cx: 240, cy: 200, radius: 130, labelDy: -160 },
    { id: 'backend',      label: 'Backend',        rune: 'ᚦ', cx: 700, cy: 200, radius: 105, labelDy: -140 },
    { id: 'database',     label: 'Bases de Datos', rune: 'ᚨ', cx: 240, cy: 500, radius: 100, labelDy: -130 },
    { id: 'tools',        label: 'Herramientas',   rune: 'ᚱ', cx: 700, cy: 490, radius: 95,  labelDy: -125 },
    { id: 'architecture', label: 'Arquitectura',   rune: 'ᚲ', cx: 470, cy: 350, radius: 65,  labelDy: -95 },
  ];

  readonly clusters = computed<ConstellationCluster[]>(() => {
    return this.layouts.map((layout) => {
      const clusterSkills = this.data.skills.filter((s) => s.category === layout.id);
      const count = clusterSkills.length;
      // ángulo inicial alterno para que las constelaciones no queden todas iguales
      const startAngle = layout.id === 'architecture'
        ? -Math.PI / 2
        : (this.layouts.findIndex(l => l.id === layout.id) * 0.6) - Math.PI / 2;

      const stars: StarNode[] = clusterSkills.map((skill, i) => {
        const angle = startAngle + (i / count) * Math.PI * 2;
        // jitter orgánico determinista
        const jitter = ((i * 37) % 15) / 15 - 0.5;
        const r = layout.radius * (0.85 + jitter * 0.25);
        return {
          skill,
          cx: layout.cx + Math.cos(angle) * r,
          cy: layout.cy + Math.sin(angle) * r,
          size: 3 + Math.min((skill.yearsUsed ?? 1) * 0.8, 5),
        };
      });

      return {
        id: layout.id,
        label: layout.label,
        rune: layout.rune,
        originX: layout.cx,
        originY: layout.cy,
        labelDy: layout.labelDy,
        stars,
      };
    });
  });

  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId) || !this.constellationRef) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      this.drawn.set(true);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            this.drawn.set(true);
            this.observer?.disconnect();
          }
        }
      },
      { threshold: 0.25 },
    );
    this.observer.observe(this.constellationRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  setCategory(cat: CategoryId): void {
    if (this.activeCategory() === cat) return;
    this.activeCategory.set(cat);
  }

  isClusterActive(id: SkillCategory): boolean {
    const active = this.activeCategory();
    return active === 'all' || active === id;
  }

  isSkillHovered(skill: Skill): boolean {
    return this.hoveredSkill()?.name === skill.name;
  }

  onStarEnter(skill: Skill): void {
    this.hoveredSkill.set(skill);
  }

  onStarLeave(): void {
    this.hoveredSkill.set(null);
  }

  yearsLabel(years: number | undefined): string {
    if (!years) return '';
    return years === 1 ? '1 año' : `${years} años`;
  }
}
