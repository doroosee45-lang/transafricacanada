// Facture d'expédition multidevise (PDF A4 vectoriel, jsPDF) — même charte que la facture de
// paiement (PaymentDetail) : bandeau sombre et liseré or, bandeau de statut, cartes arrondies.
// Tous les montants et le taux viennent du CONTRAT FIGÉ (pkg.financial) : aucun recalcul.
import { countryOf } from '../../config/currencies';
import type { Package, PaymentSituation, Person } from '../../types/models';
import type { RGB, TextOptions } from '../../types/pdf';

/** Ligne libellé / valeur d'un encadré ; `true` en 3e position = valeur en gras. */
type InvoiceRow = [string, string] | [string, string, boolean];
/** Formateur montant mineur + devise → texte (amountText de FinancialSummary). */
export type AmountFormatter = (minor: number | null | undefined, currency: string | null | undefined) => string;

const INK: RGB = [23, 22, 20], GOLD: RGB = [167, 123, 40], GRAY: RGB = [75, 90, 110], MUTED: RGB = [132, 148, 169];
const LIGHT: RGB = [250, 248, 245], WARM: RGB = [255, 248, 238], WHITE: RGB = [255, 255, 255], LINE: RGB = [233, 225, 213];
const GREEN: RGB = [5, 150, 105], AMBER: RGB = [217, 119, 6];

const STATUS: Record<string, { label: string; color: RGB }> = {
  unpaid:  { label: 'NON PAYÉE',             color: AMBER },
  partial: { label: 'PARTIELLEMENT PAYÉE',   color: GOLD },
  paid:    { label: 'PAYÉE',                 color: GREEN },
};
const METHOD: Record<string, string> = { cash: 'Espèces', bank_transfer: 'Virement', mobile_money: 'Mobile Money', card: 'Carte', other: 'Autre' };
const SERVICE: Record<string, string> = { standard: 'Standard', express: 'Express', premium: 'Premium' };
const TYPE: Record<string, string> = { document: 'Document', clothing: 'Vêtements', electronics: 'Électronique', food: 'Alimentaire', cosmetics: 'Cosmétiques', fragile_item: 'Article fragile', other: 'Autre' };
const ROLE: Record<string, string> = { superadmin: 'Super-admin', admin: 'Administrateur', manager: 'Manager', agent: 'Agent', client: 'Client' };

// jsPDF (polices standard) ne connaît pas les espaces fines insécables produites par Intl.
const clean = (s: unknown) => String(s ?? '').replace(/[  ]/g, ' ').replace(/[→]/g, '»');
const countryLabel = (key?: string) => countryOf(key)?.label || countryOf(key)?.name || key || '—';
const fullName = (p?: Person | null) => (p ? `${p.firstName || ''} ${p.lastName || ''}`.trim() : '') || '—';

/**
 * @param {object} pkg       colis (sender/receiver/agency/createdBy peuplés si disponibles)
 * @param {(minor:number, currency:string)=>string} amountText  formateur entier → texte (devise ISO)
 */
export async function buildShippingInvoicePdf(pkg: Package, amountText: AmountFormatter) {
  const f = pkg?.financial;
  if (!f) throw new Error('Contrat financier absent : facture indisponible.');
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210, H = 297, m = 18;
  const amt = (minor: number | null | undefined, cur: string | null | undefined) => clean(amountText(minor, cur));

  const fill = (x: number, y: number, w: number, h: number, rgb: RGB) => { doc.setFillColor(...rgb); doc.rect(x, y, w, h, 'F'); };
  const card = (x: number, y: number, w: number, h: number, rgb: RGB) => { doc.setFillColor(...rgb); doc.setDrawColor(...LINE); doc.setLineWidth(0.3); doc.roundedRect(x, y, w, h, 3, 3, 'FD'); };
  const t = (s: unknown, x: number, y: number, { sz = 10, wt = 'normal', col = INK, align = 'left', maxW }: TextOptions = {}) => {
    doc.setFontSize(sz); doc.setFont('helvetica', wt); doc.setTextColor(...col);
    let text = clean(s);
    if (maxW) text = doc.splitTextToSize(text, maxW)[0] || '';
    doc.text(text, x, y, { align });
  };
  const hline = (x1: number, y: number, x2: number) => { doc.setDrawColor(...LINE); doc.setLineWidth(0.3); doc.line(x1, y, x2, y); };
  const rows = (x: number, y: number, w: number, list: InvoiceRow[]) => {
    list.forEach(([label, value, strong], i) => {
      t(label, x, y, { sz: 9, col: GRAY });
      t(value, x + w, y, { sz: 9, wt: strong ? 'bold' : 'normal', col: INK, align: 'right', maxW: w * 0.62 });
      if (i < list.length - 1) hline(x, y + 3, x + w);
      y += 8;
    });
    return y;
  };

  const ref = f.referenceCurrency, dest = f.destinationCurrency;
  // Situation des paiements : celle calculée par le SERVEUR (paiements valides, devise du colis).
  // Repli (aperçu hors API) : même règle, appliquée localement aux transactions valides.
  const sum: PaymentSituation & { remainingDestinationMinor?: number | null } = pkg.financialSummary || (() => {
    const valid = (f.transactions || []).filter((x) => (x.status || 'valid') === 'valid');
    const total = f.totalMinor as number;
    const paid = Math.min(valid.reduce((acc, x) => acc + ((x.currency === f.referenceCurrency ? x.amountMinor : (x.referenceMinor ?? 0)) as number), 0), total);
    return { paidMinor: paid, remainingMinor: total - paid, remainingDestinationMinor: null, status: paid <= 0 ? 'unpaid' : paid >= total ? 'paid' : 'partial' };
  })();
  const status = (sum.status && STATUS[sum.status]) || STATUS.unpaid;
  const issued = new Date(f.lockedAt || pkg.createdAt || Date.now());
  const hw = (W - m * 2 - 8) / 2, rx = m + hw + 8;

  /* ── EN-TÊTE ── */
  fill(0, 0, W, 52, INK);
  fill(0, 0, W, 5, GOLD);
  t('Trans Africa Canada', m, 22, { sz: 18, wt: 'bold', col: WHITE });
  t('Agence de colis international', m, 31, { sz: 9, col: [224, 215, 199] });
  t('FACTURE D\'EXPÉDITION', W - m, 16, { sz: 8, wt: 'bold', col: [217, 180, 101], align: 'right' });
  t(pkg.trackingNumber || pkg._id || '—', W - m, 28, { sz: 17, wt: 'bold', col: WHITE, align: 'right' });
  t(issued.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }), W - m, 38, { sz: 9, col: [224, 215, 199], align: 'right' });

  /* ── BANDEAU STATUT ── */
  fill(0, 52, W, 13, status.color);
  t(status.label, m, 60, { sz: 9, wt: 'bold', col: WHITE });
  t(`${countryLabel(pkg.origin)}  »  ${countryLabel(pkg.destination)}`, W - m, 60, { sz: 9, wt: 'bold', col: WHITE, align: 'right' });

  let y = 73;

  /* ── EXPÉDITEUR / DESTINATAIRE ── */
  const person = (x: number, title: string, p: Person | null | undefined, bg: RGB, titleCol: RGB) => {
    card(x, y, hw, 46, bg);
    t(title, x + 8, y + 9, { sz: 8, wt: 'bold', col: titleCol });
    t(fullName(p), x + 8, y + 18, { sz: 12, wt: 'bold', maxW: hw - 16 });
    let py = y + 25;
    if (p?.phone) { t(p.phone, x + 8, py, { sz: 9, col: GRAY }); py += 5; }
    if (p?.email) { t(p.email, x + 8, py, { sz: 8, col: GRAY, maxW: hw - 16 }); py += 5; }
    const addr = [p?.address, p?.city].filter(Boolean).join(', ');
    if (addr) t(addr, x + 8, py, { sz: 8, col: GRAY, maxW: hw - 16 });
    if (p?.country) {
      const lbl = countryLabel(p.country);
      const bw = Math.min(hw - 16, doc.getTextWidth(lbl) * 0.85 + 10);
      fill(x + 8, y + 37, bw, 5.5, GOLD);
      t(lbl, x + 8 + bw / 2, y + 40.8, { sz: 7.5, wt: 'bold', col: WHITE, align: 'center' });
    }
  };
  person(m, 'EXPÉDITEUR', pkg.sender || pkg.senderData, WARM, GOLD);
  person(rx, 'DESTINATAIRE', pkg.receiver || pkg.receiverData, LIGHT, GRAY);
  y += 52;

  /* ── DÉTAILS DU COLIS ── */
  card(m, y, W - m * 2, 35, LIGHT);
  t('DÉTAILS DU COLIS', m + 8, y + 9, { sz: 8, wt: 'bold', col: GRAY });
  const details: Array<[string, string]> = [
    ['Poids', `${pkg.weight ?? f.weight ?? '—'} kg`],
    ['Service', SERVICE[f.service || pkg.service || ''] || f.service || '—'],
    ['Type', TYPE[pkg.packageType || ''] || '—'],
    ['Articles', String(pkg.numberOfItems || 1)],
    ['Agence', pkg.agency?.name || '—'],
    ['Enregistré par', pkg.createdBy?.firstName ? `${fullName(pkg.createdBy)}${pkg.createdBy.role ? ` (${ROLE[pkg.createdBy.role] || pkg.createdBy.role})` : ''}` : '—'],
  ];
  const colW = (W - m * 2 - 16) / 3;
  details.forEach(([l, v], i) => {
    const cx = m + 8 + (i % 3) * colW, cy = y + 16 + Math.floor(i / 3) * 11;
    t(l, cx, cy, { sz: 7.5, col: MUTED });
    t(v, cx, cy + 4.5, { sz: 9, wt: 'bold', maxW: colW - 4 });
  });
  y += 41;

  /* ── RÈGLEMENTS : DÉPART / DESTINATION ── */
  const boxH = f.minimumAdjustmentMinor ? 76 : 68;
  card(m, y, hw, boxH, LIGHT);
  t(`DÉPART — ${ref}`, m + 8, y + 9, { sz: 8, wt: 'bold', col: GRAY });
  rows(m + 8, y + 17, hw - 16, [
    ['Transport', amt(f.baseMinor, ref)],
    ['Frais fixes', amt(f.flatMinor, ref)],
    ['Assurance', amt(f.insuranceMinor, ref)],
    ...(f.minimumAdjustmentMinor ? [['Ajustement minimum', amt(f.minimumAdjustmentMinor, ref)] as InvoiceRow] : []),
    ['Total expédition', amt(f.totalMinor, ref), true],
    ['Avance au départ', amt(f.advanceMinor, ref)],
    ['Solde à la confirmation', amt(f.remainingReferenceMinor, ref), true],
  ]);

  card(rx, y, hw, boxH, WARM);
  t(`PAIEMENTS — ${ref}`, rx + 8, y + 9, { sz: 8, wt: 'bold', col: GOLD });
  rows(rx + 8, y + 17, hw - 16, [
    ['Déjà payé', amt(sum.paidMinor, ref)],
    ['Reste à payer', amt(sum.remainingMinor, ref), true],
    ...(dest !== ref && sum.remainingDestinationMinor != null ? [[`Reste en ${dest}`, amt(sum.remainingDestinationMinor, dest)] as InvoiceRow] : []),
    ...(dest !== ref ? [['Taux figé', `1 ${ref} = ${f.rate} ${dest}`, true] as InvoiceRow] : []),
    ['Date de fixation', f.lockedAt ? new Date(f.lockedAt).toLocaleString('fr-FR') : 'À la confirmation'],
  ]);
  y += boxH + 6;

  /* ── TOTAL MIS EN AVANT ── */
  fill(m, y, W - m * 2, 14, INK);
  fill(m, y, 3, 14, GOLD);
  t('TOTAL EXPÉDITION', m + 9, y + 9, { sz: 9, wt: 'bold', col: [217, 180, 101] });
  t(amt(f.totalMinor, ref), W - m - 6, y + 9.5, { sz: 14, wt: 'bold', col: WHITE, align: 'right' });
  y += 19;

  /* ── TRANSACTIONS ── */
  const tx = f.transactions || [];
  // Zone utile : au-dessus du pied de page (ligne à H - 20). Sinon, page suivante.
  const BOTTOM = H - 24;
  // Titre + en-tête de tableau jamais isolés : au moins deux lignes (ou le message vide) avec eux.
  const need = tx.length ? 4 + 8 + Math.min(tx.length, 2) * 8 : 12;
  if (y + need > BOTTOM) { doc.addPage(); y = 22; }
  t('TRANSACTIONS ENREGISTRÉES', m, y, { sz: 8, wt: 'bold', col: GRAY });
  y += 4;
  if (!tx.length) {
    t('Aucun encaissement enregistré à ce jour.', m, y + 6, { sz: 9, col: MUTED });
    y += 12;
  } else {
    const cols: Array<[number, string]> = [[m + 3, 'Date'], [m + 50, 'Type'], [m + 104, 'Mode'], [W - m - 40, 'Taux'], [W - m - 3, 'Montant']];
    const header = () => {
      fill(m, y, W - m * 2, 8, LIGHT);
      cols.forEach(([x, h], i) => t(h, x, y + 5.5, { sz: 8, wt: 'bold', col: GRAY, align: i === cols.length - 1 ? 'right' : 'left' }));
      y += 8;
    };
    header();
    tx.forEach((r) => {
      if (y + 8 > BOTTOM) { doc.addPage(); y = 22; header(); } // en-tête répété sur la page suivante
      const cancelled = (r.status || 'valid') === 'cancelled';
      t(new Date((r.paidAt || r.recordedAt) as string).toLocaleString('fr-FR'), m + 3, y + 5.5, { sz: 8 });
      t(`${({ advance: 'Avance (départ)', departure: 'Paiement (départ)', destination: 'Paiement (arrivée)' } as Record<string, string>)[r.kind || ''] || 'Paiement'}${cancelled ? ' — ANNULÉ' : ''}`, m + 50, y + 5.5, { sz: 8, col: cancelled ? MUTED : INK, wt: cancelled ? 'bold' : 'normal' });
      t(METHOD[r.method || ''] || r.method || '—', m + 104, y + 5.5, { sz: 8 });
      t(r.rate || '—', W - m - 40, y + 5.5, { sz: 8 });
      t(amt(r.amountMinor, r.currency), W - m - 3, y + 5.5, { sz: 8, wt: 'bold', align: 'right' });
      hline(m, y + 8, W - m);
      y += 8;
    });
  }

  /* ── PIED DE PAGE ── */
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    hline(m, H - 20, W - m);
    t('Montants et taux issus du contrat confirmé : la conversion est figée à la date de fixation.', m, H - 14, { sz: 7.5, col: MUTED });
    t(`Suivi : ${typeof window !== 'undefined' ? window.location.origin : ''}/tracking/${pkg.trackingNumber || ''}`, m, H - 9, { sz: 7.5, col: MUTED });
    t(`Page ${p} / ${pages}`, W - m, H - 9, { sz: 7.5, col: MUTED, align: 'right' });
  }
  return doc;
}
