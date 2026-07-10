import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PORTFOLIO_CONFIG } from '../../core/config/portfolio.config';
import { ContactService } from '../../core/services/contact.service';
import { GlowButtonComponent } from '../../shared/components/glow-button/glow-button';
import { LoadingDragonComponent } from '../../shared/components/loading-dragon/loading-dragon';
import { RuneDividerComponent } from '../../shared/components/rune-divider/rune-divider';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';

interface ContactLink {
  icon: string;
  label: string;
  value: string;
  href: string;
  external: boolean;
}

@Component({
  selector: 'app-contact',
  imports: [
    FormsModule,
    SectionHeaderComponent,
    GlowButtonComponent,
    RuneDividerComponent,
    LoadingDragonComponent,
  ],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactComponent {
  private readonly contactService = inject(ContactService);
  private readonly config = PORTFOLIO_CONFIG;

  readonly name    = signal('');
  readonly email   = signal('');
  readonly message = signal('');
  readonly botcheck = signal('');

  readonly sent    = signal(false);
  readonly sending = signal(false);
  readonly error   = signal<string | null>(null);

  readonly emailAddress = this.config.contact.email;
  readonly emailHref    = `mailto:${this.config.contact.email}`;

  readonly links: ContactLink[] = [
    {
      icon: '📧',
      label: 'Email',
      value: this.config.contact.email,
      href: `mailto:${this.config.contact.email}`,
      external: false,
    },
    {
      icon: '🔗',
      label: 'LinkedIn',
      value: this.config.socials.linkedinHandle,
      href: this.config.socials.linkedin,
      external: true,
    },
    {
      icon: '🐙',
      label: 'GitHub',
      value: this.config.socials.githubHandle,
      href: this.config.socials.github,
      external: true,
    },
    {
      icon: '📍',
      label: 'Ubicación',
      value: this.config.identity.location,
      href: '#',
      external: false,
    },
  ];

  async submit(): Promise<void> {
    if (this.sending()) return;
    if (!this.name().trim() || !this.email().trim() || !this.message().trim()) {
      this.error.set('Por favor completá nombre, email y mensaje.');
      return;
    }

    this.error.set(null);
    this.sending.set(true);

    const result = await this.contactService.send({
      name: this.name().trim(),
      email: this.email().trim(),
      message: this.message().trim(),
      botcheck: this.botcheck(),
    });

    this.sending.set(false);

    if (result.ok) {
      this.sent.set(true);
      this.name.set('');
      this.email.set('');
      this.message.set('');
      return;
    }

    this.error.set(result.message);
  }

  resetForm(): void {
    this.sent.set(false);
    this.error.set(null);
  }
}
