import { Component } from '@angular/core';

/**
 * Aurora Boreal — 3 capas de gradientes ondulando lentamente.
 * Se posiciona detrás del contenido, sobre el fondo negro del sitio.
 * CSS puro, sin JS, respeta prefers-reduced-motion.
 */
@Component({
  selector: 'app-aurora',
  template: `
    <div class="aurora" aria-hidden="true">
      <div class="aurora__band aurora__band--1"></div>
      <div class="aurora__band aurora__band--2"></div>
      <div class="aurora__band aurora__band--3"></div>
      <div class="aurora__stars"></div>
    </div>
  `,
  styles: [`
    :host {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    }

    .aurora { position: absolute; inset: 0; }

    .aurora__band {
      position: absolute;
      top: -20%;
      left: -30%;
      width: 160%;
      height: 70%;
      filter: blur(60px);
      mix-blend-mode: screen;
      opacity: 0.55;
      transform-origin: center;
    }

    .aurora__band--1 {
      background:
        radial-gradient(ellipse 80% 40% at 30% 40%, rgba(52, 211, 153, 0.35) 0%, transparent 60%),
        radial-gradient(ellipse 60% 30% at 70% 60%, rgba(56, 189, 248, 0.28) 0%, transparent 60%);
      animation: auroraFlow1 24s ease-in-out infinite alternate;
    }

    .aurora__band--2 {
      background:
        radial-gradient(ellipse 70% 35% at 60% 30%, rgba(167, 139, 250, 0.28) 0%, transparent 60%),
        radial-gradient(ellipse 60% 30% at 25% 65%, rgba(52, 211, 153, 0.22) 0%, transparent 60%);
      animation: auroraFlow2 32s ease-in-out infinite alternate;
      top: 5%;
    }

    .aurora__band--3 {
      background:
        radial-gradient(ellipse 65% 30% at 40% 55%, rgba(56, 189, 248, 0.22) 0%, transparent 60%),
        radial-gradient(ellipse 55% 25% at 80% 40%, rgba(217, 70, 239, 0.15) 0%, transparent 60%);
      animation: auroraFlow3 40s ease-in-out infinite alternate;
      top: -10%;
    }

    /* Puntos de estrellas atenuados sobre la aurora */
    .aurora__stars {
      position: absolute;
      inset: 0;
      background-image:
        radial-gradient(1px 1px at 12% 20%, rgba(255, 255, 255, 0.7) 100%, transparent),
        radial-gradient(1px 1px at 25% 60%, rgba(255, 255, 255, 0.5) 100%, transparent),
        radial-gradient(1px 1px at 45% 15%, rgba(255, 255, 255, 0.6) 100%, transparent),
        radial-gradient(1px 1px at 60% 40%, rgba(255, 255, 255, 0.4) 100%, transparent),
        radial-gradient(1px 1px at 80% 25%, rgba(255, 255, 255, 0.7) 100%, transparent),
        radial-gradient(1px 1px at 90% 70%, rgba(255, 255, 255, 0.5) 100%, transparent),
        radial-gradient(1.5px 1.5px at 35% 80%, rgba(255, 255, 255, 0.4) 100%, transparent),
        radial-gradient(1px 1px at 70% 90%, rgba(255, 255, 255, 0.5) 100%, transparent);
      background-size: 400px 300px;
      background-repeat: repeat;
      opacity: 0.6;
      animation: twinkle 8s ease-in-out infinite;
    }

    @keyframes auroraFlow1 {
      from { transform: translateX(-8%) translateY(0) scaleY(1); opacity: 0.35; }
      to   { transform: translateX(12%) translateY(3%) scaleY(1.1); opacity: 0.6; }
    }
    @keyframes auroraFlow2 {
      from { transform: translateX(6%) translateY(-2%) scaleY(0.95); opacity: 0.4; }
      to   { transform: translateX(-10%) translateY(4%) scaleY(1.15); opacity: 0.65; }
    }
    @keyframes auroraFlow3 {
      from { transform: translateX(-4%) translateY(2%) scale(1, 1);   opacity: 0.3; }
      to   { transform: translateX(8%)  translateY(-3%) scale(1.1, 1); opacity: 0.55; }
    }
    @keyframes twinkle {
      0%, 100% { opacity: 0.4; }
      50%      { opacity: 0.75; }
    }

    @media (prefers-reduced-motion: reduce) {
      .aurora__band, .aurora__stars { animation: none; }
      .aurora__band { opacity: 0.35; }
    }

    /* Mobile: menos blur para performance */
    @media (max-width: 640px) {
      .aurora__band { filter: blur(40px); opacity: 0.4; }
    }
  `],
})
export class AuroraComponent {}
