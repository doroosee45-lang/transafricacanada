// Montants d'une facture — source UNIQUE pour l'écran, le PDF et l'e-mail.
//
// - Devise : celle enregistrée sur la facture (jamais un symbole fixe ; avant : « $ » partout).
// - Calculs en unités mineures de la devise (TND : millièmes) : pas de résidu flottant.
// - Le modèle de facture ne contient ni taxe ni remise : aucune n'est inventée ici.
import { formatMoneyCode, toMinor, fromMinor, packageCurrency } from '../config/currencies';

/**
 * Totaux d'une facture.
 * Une facture « payée » est intégralement réglée (le statut a pu être posé sans renseigner
 * amountPaid sur d'anciennes factures) ; sinon réglé = amountPaid, borné à [0, total].
 */
export function invoiceTotals(payment) {
  const currency = payment?.currency || null;
  if (!currency) return { currency: null, totalMinor: null, paidMinor: null, dueMinor: null };
  const totalMinor = toMinor(payment.amount, currency);
  const paidMinor = payment.status === 'paid'
    ? totalMinor
    : Math.min(Math.max(toMinor(payment.amountPaid, currency), 0), totalMinor);
  return { currency, totalMinor, paidMinor, dueMinor: totalMinor - paidMinor };
}

/** Textes formatés (identiques à l'écran et dans le PDF). */
export function invoiceAmounts(payment) {
  const t = invoiceTotals(payment);
  const f = (minor) => (minor === null ? '—' : formatMoneyCode(fromMinor(minor, t.currency), t.currency));
  return {
    currency: t.currency,
    total: f(t.totalMinor),
    paid: f(t.paidMinor),
    due: f(t.dueMinor),
    // Montant mis en avant : total si payée, sinon déjà réglé (comportement d'origine conservé).
    headline: f(payment?.status === 'paid' ? t.totalMinor : t.paidMinor),
    format: (amount) => formatMoneyCode(amount, t.currency),
  };
}

/**
 * Cohérence devise de la facture / devise des colis liés. Une ancienne facture peut porter
 * « USD » (ancienne valeur par défaut) alors que ses colis sont dans une autre devise :
 * on l'affiche telle qu'enregistrée et on le signale, sans réécrire l'historique.
 */
export function invoiceCurrencyNotice(payment, packages = []) {
  const pkgCurrencies = [...new Set(packages.map((p) => packageCurrency(p)).filter(Boolean))];
  if (!payment?.currency || !pkgCurrencies.length) return null;
  if (pkgCurrencies.length === 1 && pkgCurrencies[0] === payment.currency) return null;
  return `Devise enregistrée sur la facture : ${payment.currency}. Colis liés en ${pkgCurrencies.join(', ')}. `
    + 'Montants affichés tels qu’enregistrés, sans conversion.';
}
