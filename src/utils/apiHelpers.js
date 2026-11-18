import { formatMoney } from '../config/currencies';
/**
 * apiHelpers.js
 * ─────────────────────────────────────────────────────────────
 * Helpers universels pour extraire les données des réponses API
 * Compatibles avec toutes les structures de réponse possibles :
 *   { data: [...] }
 *   { data: { packages: [...] } }
 *   { packages: [...] }
 *   [...]  (tableau brut)
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Extrait un tableau depuis une réponse Axios ou un objet brut.
 * @param {*} res - Réponse Axios ou objet
 * @param  {...string} keys - Clés à chercher dans les objets imbriqués
 * @returns {Array}
 */
export const extractArray = (res, ...keys) => {
  const body = res?.data ?? res;
  const candidates = [body?.data, body];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
    for (const k of keys) {
      if (Array.isArray(c?.[k])) return c[k];
    }
  }
  return [];
};

/**
 * Extrait un objet (stats, metadata) depuis une réponse Axios.
 * @param {*} res - Réponse Axios ou objet
 * @returns {Object}
 */
export const extractObj = (res) => {
  const body = res?.data ?? res;
  return body?.data ?? body ?? {};
};

/**
 * Formate un nombre en monnaie locale française.
 * @param {number} n
 * @returns {string}
 */
export const fmt = (n) => Number(n || 0).toLocaleString('fr-FR');

/**
 * Formate un nombre en euros.
 * @param {number} n
 * @returns {string}
 */
// Devise explicite obligatoire pour un symbole (avant : « € » imposé). Sans devise : montant seul.
export const fmtE = (n, currency) => formatMoney(Number(n || 0), currency);

/**
 * Formate une date ISO en date française.
 * @param {string|Date} d
 * @returns {string}
 */
export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('fr-FR') : '—';

/**
 * Formate une date ISO en date+heure française.
 * @param {string|Date} d
 * @returns {string}
 */
export const fmtDateTime = (d) =>
  d
    ? new Date(d).toLocaleDateString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : '—';