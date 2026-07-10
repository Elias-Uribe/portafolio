import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { Project } from '../../core/models/portfolio.models';
import { PortfolioDataService } from '../../core/services/portfolio-data.service';
import { NordicCornerComponent } from '../../shared/components/nordic-corner/nordic-corner';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';

@Component({
  selector: 'app-projects',
  imports: [SectionHeaderComponent, NordicCornerComponent],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent implements AfterViewChecked {
  private readonly data = inject(PortfolioDataService);
  private readonly platformId = inject(PLATFORM_ID);

  @ViewChild('modalRef') modalRef?: ElementRef<HTMLElement>;

  readonly projects = this.data.projects;
  readonly activeProject = signal<Project | null>(null);

  private lastTrigger: HTMLElement | null = null;
  private focusApplied = false;

  openModal(project: Project, event: Event): void {
    if (event.target instanceof HTMLElement) {
      this.lastTrigger = event.target.closest('.quest-card') as HTMLElement | null;
    }
    this.focusApplied = false;
    this.activeProject.set(project);

    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(): void {
    this.activeProject.set(null);
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
      this.lastTrigger?.focus();
    }
  }

  ngAfterViewChecked(): void {
    if (this.activeProject() && !this.focusApplied && this.modalRef) {
      this.modalRef.nativeElement.focus();
      this.focusApplied = true;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.activeProject()) this.closeModal();
  }

  @HostListener('document:keydown.tab', ['$event'])
  onTab(event: Event): void {
    if (!this.activeProject() || !this.modalRef) return;
    const kb = event as KeyboardEvent;
    const focusables = this.modalRef.nativeElement.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;

    if (kb.shiftKey && active === first) {
      kb.preventDefault();
      last.focus();
    } else if (!kb.shiftKey && active === last) {
      kb.preventDefault();
      first.focus();
    }
  }

  getStatusLabel(status: Project['status']): string {
    const map: Record<Project['status'], string> = {
      completed: 'Completada',
      'in-progress': 'En Progreso',
      archived: 'Archivada',
    };
    return map[status];
  }

  getStatusRune(status: Project['status']): string {
    return status === 'completed' ? '✓' : status === 'in-progress' ? '⚡' : '◌';
  }
}
