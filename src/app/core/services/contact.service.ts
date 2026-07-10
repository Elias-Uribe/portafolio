import { Injectable } from '@angular/core';
import { PORTFOLIO_CONFIG } from '../config/portfolio.config';

export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  /** Honeypot anti-bot — debe llegar vacío. */
  botcheck?: string;
}

export type ContactResult =
  | { ok: true }
  | { ok: false; error: 'not-configured' | 'network' | 'server'; message: string };

@Injectable({ providedIn: 'root' })
export class ContactService {
  async send(payload: ContactPayload): Promise<ContactResult> {
    // Honeypot: si un bot llenó el campo oculto, fingimos éxito y no enviamos nada
    if (payload.botcheck) {
      return { ok: true };
    }

    const { accessKey, endpoint } = PORTFOLIO_CONFIG.web3forms;

    if (!accessKey) {
      return {
        ok: false,
        error: 'not-configured',
        message:
          'El servicio de mensajería aún no está configurado. Escribíme directo a ' +
          PORTFOLIO_CONFIG.contact.email,
      };
    }

    /**
     * Usamos application/x-www-form-urlencoded para que sea una "simple CORS request"
     * (sin preflight OPTIONS), replicando el comportamiento del HTML form nativo
     * que documenta Web3Forms.
     */
    const body = new URLSearchParams();
    body.append('access_key', accessKey);
    body.append('name', payload.name);
    body.append('email', payload.email);
    body.append('message', payload.message);
    body.append('subject', `Nuevo mensaje desde el portfolio · ${payload.name}`);
    body.append('from_name', payload.name);
    body.append('reply_to', payload.email);
    // botcheck vacío es OK — solo lo enviamos si tiene algo (que no debería)
    if (payload.botcheck) body.append('botcheck', payload.botcheck);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      });

      let data: { success?: boolean; message?: string } = {};
      try {
        data = await res.json();
      } catch {
        // Si no vino JSON, dejamos data vacío y decidimos por status
      }

      if (!res.ok || data.success === false) {
        return {
          ok: false,
          error: 'server',
          message:
            data.message ??
            `El servicio respondió con estado ${res.status}. Intentá de nuevo o escribíme por email.`,
        };
      }

      return { ok: true };
    } catch {
      return {
        ok: false,
        error: 'network',
        message:
          'Hubo un problema de red. Verificá tu conexión o escribíme a ' +
          PORTFOLIO_CONFIG.contact.email,
      };
    }
  }
}
