# Elias Uribe — Portfolio

Portafolio personal con temática **Skyrim**, construido en Angular 21 zoneless.

> **Full-Stack Developer** · Angular 21 · Spring Boot · TypeScript · Java
> Basado en Junín, Buenos Aires, Argentina — disponible para proyectos remotos.

## Stack

- **Angular 21.2** (zoneless change detection, signals, control flow)
- **Tailwind CSS 4** vía PostCSS
- **GSAP 3.15** para animaciones cinemáticas
- **TypeScript 5.9** (strict + Angular strict templates)
- **Web3Forms** para el formulario de contacto
- **bun** como package manager

## Arquitectura

```
src/
├── app/
│   ├── core/
│   │   ├── config/           # PORTFOLIO_CONFIG — datos personales, redes, keys
│   │   ├── models/           # Interfaces de dominio
│   │   └── services/         # PortfolioDataService, ContactService
│   ├── features/             # Secciones (hero, about, skills, projects,
│   │   ├── hero/                experience, contact)
│   │   ├── about/
│   │   └── ...
│   ├── layout/               # shell + header + footer
│   └── shared/               # componentes reutilizables (glow-button,
│                                rune-divider, section-header, particle-bg)
├── styles.css                # tokens Tailwind + base + keyframes
└── index.html                # SEO, OG, JSON-LD, preload de fuentes
```

## Setup

```bash
bun install
bun start           # http://localhost:4200
```

## Scripts

| Script | Descripción |
|--------|-------------|
| `bun start` | Dev server (hot reload) |
| `bun run build` | Build de desarrollo |
| `bun run build:prod` | Build optimizado para producción |
| `bun run lint` | ESLint (TS + templates) |
| `bun run format` | Prettier |
| `bun run test` | Vitest |

## Configuración

Toda la data personal vive en un solo archivo:
[`src/app/core/config/portfolio.config.ts`](src/app/core/config/portfolio.config.ts)

### Activar el formulario de contacto

El formulario usa [Web3Forms](https://web3forms.com) (sin backend propio):

1. Ir a https://web3forms.com y registrar `eliasuriibe@gmail.com`.
2. Copiar el `access_key` que llega por email.
3. Pegarlo en `PORTFOLIO_CONFIG.web3forms.accessKey`.

Mientras esté vacío, el form muestra un aviso informativo y no intenta enviar.

## SEO / OG

- `<title>`, description, canonical y `robots` configurados.
- Open Graph + Twitter Card apuntan a `/og-image.svg` (1200×630).
- JSON-LD `Person` schema en el `<head>` para Rich Results de Google.
- `public/robots.txt` + `public/sitemap.xml` incluidos.

> Para máxima compatibilidad con LinkedIn, convertir `og-image.svg` a PNG
> (herramientas: [svgexport](https://github.com/shakiba/svgexport), CloudConvert)
> y actualizar la meta a `.png`.

## Accesibilidad

- Skip link inicial (`Saltar al contenido`).
- Runas decorativas marcadas con `aria-hidden`.
- Modal de proyectos con focus-trap manual + ESC para cerrar + devolución de foco.
- `role="tablist"` / `role="tabpanel"` completos en Skills.
- Respeta `prefers-reduced-motion` en animaciones globales y en el canvas de partículas.
- Focus visible global con outline consistente.

## Performance

- Fuentes precargadas via `<link rel="preload" as="style">`.
- Devicon fijado a versión (evita rupturas del CDN `@latest`).
- Canvas de partículas reduce densidad en mobile y renderiza sombras solo cada 3 frames.
- Desactiva partículas y GSAP timelines cuando `prefers-reduced-motion: reduce`.
- `backdrop-filter` reducido en mobile.

## Deploy

Sitio pensado para deploy estático (Vercel / Netlify / Cloudflare Pages / GitHub Pages).

```bash
bun run build:prod
# dist/elias-portfolio/browser/ → publicar
```

## Próximos pasos

- [ ] CV en inglés
- [ ] Screenshots reales de proyectos
- [ ] Prerendering con `@angular/ssr` para SEO 100%
- [ ] Analytics privacy-friendly (Plausible/Umami)
- [ ] Blog / notas técnicas
- [ ] Sección de testimonios

## Licencia

Código propio · Sin licencia pública. El contenido personal (CV, textos, imagen) es intransferible.
