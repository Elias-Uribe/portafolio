/**
 * Fuente única de verdad para datos personales, redes y config runtime.
 *
 * Para activar el formulario de contacto:
 *   1. Ir a https://web3forms.com
 *   2. Ingresar el email destino (eliasuriibe@gmail.com)
 *   3. Copiar el access_key recibido por email en WEB3FORMS_ACCESS_KEY.
 */
export const PORTFOLIO_CONFIG = {
  identity: {
    fullName: 'Elias Alberto Uribe Curapil',
    displayName: 'Elias Uribe',
    role: 'Fullstack Developer',
    tagline: 'Angular & Spring Boot Developer',
    location: 'Junín, Buenos Aires, Argentina',
    timezone: 'GMT-3',
    availability: 'Disponible para proyectos remotos',
  },

  contact: {
    email: 'eliasuriibe@gmail.com',
  },

  socials: {
    linkedin: 'https://www.linkedin.com/in/elias-uribe-6b127b163/',
    linkedinHandle: 'elias-uribe-6b127b163',
    github: 'https://github.com/Elias-Uribe',
    githubHandle: 'Elias-Uribe',
  },

  seo: {
    siteUrl: 'https://eliasuribe.dev',
    ogImage: '/og-image.png',
    twitterHandle: '',
    keywords: [
      'Angular Developer',
      'Spring Boot Developer',
      'Full-Stack Developer',
      'Java Developer',
      'TypeScript',
      'Argentina',
      'Remote Developer',
    ],
  },

  cv: {
    es: 'files/cv-elias-uribe.pdf',
    // en: 'files/cv-elias-uribe-en.pdf', // pendiente
  },

  web3forms: {
    /**
     * Access key de https://web3forms.com — tied to eliasuriibe@gmail.com.
     * Es client-side por diseño (el servicio la valida contra el email destino).
     */
    accessKey: '7989bb12-c7a9-42d0-b537-19a74fc76050',
    endpoint: 'https://api.web3forms.com/submit',
  },
} as const;

export type PortfolioConfig = typeof PORTFOLIO_CONFIG;
