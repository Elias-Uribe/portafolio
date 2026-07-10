import { Injectable } from '@angular/core';
import {
  Education,
  Experience,
  Project,
  Skill,
  TimelineEntry,
} from '../models/portfolio.models';

@Injectable({ providedIn: 'root' })
export class PortfolioDataService {
  readonly skills: readonly Skill[] = [
    // ── Frontend ───────────────────────────────────────────────
    { name: 'Angular',      category: 'frontend', yearsUsed: 4, deviconClass: 'devicon-angular-plain colored' },
    { name: 'TypeScript',   category: 'frontend', yearsUsed: 4, deviconClass: 'devicon-typescript-plain colored' },
    { name: 'JavaScript',   category: 'frontend', yearsUsed: 5, deviconClass: 'devicon-javascript-plain colored' },
    { name: 'SCSS',         category: 'frontend', yearsUsed: 4, deviconClass: 'devicon-sass-original colored' },
    { name: 'Tailwind CSS', category: 'frontend', yearsUsed: 2, deviconClass: 'devicon-tailwindcss-plain colored' },
    { name: 'RxJS',         category: 'frontend', yearsUsed: 3, icon: '🔄' },
    { name: 'PrimeNG',      category: 'frontend', yearsUsed: 2, icon: '🔷' },
    { name: 'React',        category: 'frontend', yearsUsed: 1, deviconClass: 'devicon-react-original colored' },

    // ── Backend ────────────────────────────────────────────────
    { name: 'Spring Boot',      category: 'backend', yearsUsed: 2, deviconClass: 'devicon-spring-plain colored' },
    { name: 'Java',             category: 'backend', yearsUsed: 3, deviconClass: 'devicon-java-plain colored' },
    { name: 'REST APIs',        category: 'backend', yearsUsed: 3, icon: '🌐' },
    { name: 'Spring Security',  category: 'backend', yearsUsed: 1, deviconClass: 'devicon-spring-plain colored' },

    // ── Databases ──────────────────────────────────────────────
    { name: 'PostgreSQL', category: 'database', yearsUsed: 3, deviconClass: 'devicon-postgresql-plain colored' },
    { name: 'Firebase',   category: 'database', yearsUsed: 3, deviconClass: 'devicon-firebase-plain colored' },
    { name: 'MySQL',      category: 'database', yearsUsed: 2, deviconClass: 'devicon-mysql-plain colored' },
    { name: 'SAP HANA',   category: 'database', yearsUsed: 1, icon: '💎' },

    // ── Tools ──────────────────────────────────────────────────
    { name: 'Git',    category: 'tools', yearsUsed: 5, deviconClass: 'devicon-git-plain colored' },
    { name: 'GitHub', category: 'tools', yearsUsed: 5, deviconClass: 'devicon-github-original' },
    { name: 'Docker', category: 'tools', yearsUsed: 1, deviconClass: 'devicon-docker-plain colored' },

    // ── Architecture ───────────────────────────────────────────
    { name: 'Clean Architecture', category: 'architecture', icon: '🏛️' },
    { name: 'API Design',         category: 'architecture', icon: '📐' },
  ];

  readonly projects: readonly Project[] = [
    {
      id: 'elias-portfolio',
      title: 'Portfolio Skyrim',
      subtitle: 'Este mismo sitio',
      description:
        'Portfolio personal con temática de Skyrim construido en Angular 21 zoneless, signals, Tailwind 4 y GSAP. Enfoque en performance, accesibilidad y storytelling temático coherente.',
      status: 'completed',
      tech: ['Angular 21', 'TypeScript', 'Tailwind 4', 'GSAP', 'bun'],
      role: 'Creador · Diseño & Desarrollo',
      year: 2026,
    },
    {
      id: 'sms-sudamerica',
      title: 'SMS-SUDAMERICA',
      subtitle: 'Sistema Electoral Nacional',
      description:
        'Sistema crítico para las Elecciones Legislativas de Argentina. Desarrollé e implementé interfaces complejas para tres módulos críticos del sistema electoral, además de contribuir en el backend con Spring Boot.',
      status: 'completed',
      tech: ['Angular 18', 'Spring Boot', 'Java', 'PostgreSQL'],
      role: 'Fullstack Developer',
      year: 2024,
      confidential: true,
    },
    {
      id: 'remedi',
      title: 'REMEDI',
      subtitle: 'Plataforma de Gestión Médica',
      description:
        'Plataforma integral para el envío, visualización y gestión de radiografías digitales. Implementé funcionalidades clave de administración de usuarios, perfiles de radiólogos y disponibilidad.',
      status: 'completed',
      tech: ['React', 'Spring Boot', 'Java', 'PostgreSQL'],
      role: 'Full-Stack Developer',
      year: 2024,
      confidential: true,
    },
    {
      id: 'sap-integration',
      title: 'Integración SAP',
      subtitle: 'Cliente Corporativo',
      description:
        'API REST con Spring Boot para calcular precios finales integrando lógica de negocio con consultas optimizadas a SAP HANA. Interfaces Angular que consumían servicios de sistemas SAP empresariales.',
      status: 'completed',
      tech: ['Angular', 'Spring Boot', 'SAP HANA', 'Java'],
      role: 'Fullstack Developer',
      year: 2024,
      confidential: true,
    },
    {
      id: 'cet30',
      title: 'CET N°30',
      subtitle: 'Portal Institucional',
      description:
        'Portal web autoadministrable con panel de control exclusivo para gestión de novedades, blogs y archivos. Implementé autenticación Firebase y diseño responsive completo.',
      status: 'completed',
      tech: ['Angular 14', 'PrimeNG', 'Firebase', 'SCSS'],
      role: 'Frontend Developer',
      year: 2023,
    },
    {
      id: 'camara-cipolletti',
      title: 'Cámara de Comercio',
      subtitle: 'Cipolletti, Río Negro',
      description:
        'Sitio web autoadministrable con Angular y Firebase. Definí la arquitectura de componentes y desarrollé funcionalidades CRUD para noticias, eventos, convenios y cursos.',
      status: 'completed',
      tech: ['Angular 11', 'Firebase', 'TypeScript', 'SCSS'],
      role: 'Frontend Developer',
      year: 2021,
    },
    {
      id: 'municipalidad-fernandez-oro',
      title: 'Municipalidad',
      subtitle: 'General Fernández Oro',
      description:
        'Portal institucional con Angular Material. Sistema de publicación dinámica de noticias, gestión de trámites municipales y panel de administración centralizado.',
      status: 'completed',
      tech: ['Angular 10', 'Angular Material', 'Firebase'],
      role: 'Frontend Developer',
      year: 2021,
    },
  ];

  readonly experiences: readonly Experience[] = [
    {
      id: 'edit-software',
      company: 'Edit Software',
      role: 'Full-Stack Developer',
      period: 'Feb 2024 – Actualidad',
      location: 'Junín, Buenos Aires, Argentina',
      current: true,
      description:
        'Parte del equipo de desarrollo contribuyendo en múltiples proyectos de alto impacto para clientes de primer nivel, abarcando frontend con Angular y backend con Spring Boot.',
      achievements: [
        'Desarrollé módulos críticos para el sistema electoral nacional (SMS-SUDAMERICA)',
        'Plataforma médica de gestión radiológica (REMEDI) con React y Spring Boot',
        'Integración SAP HANA con APIs REST optimizadas y Angular frontend',
        'Trabajo bajo metodologías ágiles con plazos ajustados y alta exigencia de calidad',
      ],
      tech: ['Angular 18', 'Spring Boot', 'Java', 'React', 'SAP HANA', 'PostgreSQL'],
    },
    {
      id: 'freelance',
      company: 'Freelance',
      role: 'Frontend Developer',
      period: '2021 – 2023',
      location: 'Remoto · Argentina',
      current: false,
      description:
        'Desarrollo de portales institucionales autoadministrables para organismos públicos y entidades del sector privado, con foco en Angular + Firebase y arquitectura de componentes reutilizables.',
      achievements: [
        'Portal institucional CET N°30 con panel autoadministrable y auth Firebase',
        'Sitio Cámara de Comercio de Cipolletti — arquitectura de componentes + CRUD completo',
        'Portal de la Municipalidad de General Fernández Oro (Angular Material)',
        'Definición de arquitectura y entrega end-to-end como único desarrollador',
      ],
      tech: ['Angular', 'PrimeNG', 'Angular Material', 'Firebase', 'TypeScript', 'SCSS'],
    },
  ];

  readonly education: readonly Education[] = [
    {
      id: 'unnoba',
      title: 'Ingeniería en Informática',
      institution: 'Universidad Nacional del Noroeste de la PBA (UNNOBA)',
      period: 'Feb 2022 – Presente',
      current: true,
    },
    {
      id: 'cet30',
      title: 'Técnico en Programación',
      institution: 'CET N°30',
      period: '2015 – 2021',
      current: false,
    },
  ];

  readonly timeline: readonly TimelineEntry[] = [
    {
      year: '2024',
      title: 'Full-Stack Developer',
      institution: 'Edit Software',
      description: 'Ingreso al equipo profesional trabajando en proyectos de alto impacto a nivel nacional.',
      type: 'work',
    },
    {
      year: '2023',
      title: 'Proyecto CET N°30',
      institution: 'Freelance',
      description: 'Portal institucional autoadministrable con Angular 14 y Firebase.',
      type: 'work',
    },
    {
      year: '2022',
      title: 'Ingeniería en Informática',
      institution: 'UNNOBA',
      description: 'Inicio de la carrera universitaria en la Universidad Nacional del Noroeste de la PBA.',
      type: 'education',
    },
    {
      year: '2021',
      title: 'Proyectos Institucionales',
      institution: 'Freelance',
      description: 'Municipalidad de Fernández Oro y Cámara de Comercio de Cipolletti. Primeros proyectos profesionales.',
      type: 'work',
    },
    {
      year: '2021',
      title: 'Técnico en Programación',
      institution: 'CET N°30',
      description: 'Graduación como Técnico en Programación tras 6 años de formación técnica intensiva.',
      type: 'education',
    },
  ];
}
