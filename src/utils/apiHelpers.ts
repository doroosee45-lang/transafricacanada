import { formatMoney } from '../config/currencies';
/**
 * apiHelpers.ts
 * ─────────────────────────────────────────────────────────────
 * Helpers universels pour extraire les données des réponses API
 * Compatibles avec toutes les structures de réponse possibles :
 *   { data: [...] }
 *   { data: { packages: [...] } }
 *   { packages: [...] }
 *   [...]  (tableau brut)
 * ─────────────────────────────────────────────────────────────
 */

type Loose = Record<string, unknown> | null | undefined;

const asRecord = (v: unknown): Loose =>
  v !== null && typeof v === 'object' ? (v as Record<string, unknown>) : undefined;

/**
 * Extrait un tableau depuis une réponse Axios ou un objet brut.
 * @param res - Réponse Axios ou objet
 * @param keys - Clés à chercher dans les objets imbriqués
 */
export const extractArray = <T = unknown>(res: unknown, ...keys: string[]): T[] => {
  const r = asRecord(res);
  const body: unknown = r?.data ?? res;
  const candidates: unknown[] = [asRecord(body)?.data, body];
  for (const c of candidates) {
    if (Array.isArray(c)) return c as T[];
    for (const k of keys) {
      const v = asRecord(c)?.[k];
      if (Array.isArray(v)) return v as T[];
    }
  }
  return [];
};

/**
 * Extrait un objet (stats, metadata) depuis une réponse Axios.
 * @param res - Réponse Axios ou objet
 */
export const extractObj = <T = Record<string, unknown>>(res: unknown): T => {
  const body: unknown = asRecord(res)?.data ?? res;
  return (asRecord(body)?.data ?? body ?? {}) as T;
};

/** Formate un nombre en monnaie locale française. */
export const fmt = (n: number | string | null | undefined): string => Number(n || 0).toLocaleString('fr-FR');

// Devise explicite obligatoire pour un symbole (avant : « € » imposé). Sans devise : montant seul.
export const fmtE = (n: number | string | null | undefined, currency?: string | null): string =>
  formatMoney(Number(n || 0), currency);

/** Formate une date ISO en date française. */
export const fmtDate = (d?: string | number | Date | null): string =>
  d ? new Date(d).toLocaleDateString('fr-FR') : '—';

/** Formate une date ISO en date+heure française. */
export const fmtDateTime = (d?: string | number | Date | null): string =>
  d
    ? new Date(d).toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : '—';
