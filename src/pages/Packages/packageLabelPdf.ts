// Étiquette de colis Trans Africa Canada — PDF 100 × 150 mm (format d'étiquette transport 4 × 6 pouces).
// Charte Trans Africa Canada (noir / or, comme la facture d'expédition), destinataire mis en avant, VRAI QR code
// (scannable, généré localement) vers la page de suivi public. Avant : en-tête « AGENCE COLIS »,
// faux code-barres décoratif non scannable, site « agencecolis.com » inexistant, valeurs brutes.
import QRCode from 'qrcode';
import { countryOf } from '../../config/currencies';
import type { Package, Person } from '../../types/models';
import type { RGB, TextOptions } from '../../types/pdf';

interface ParagraphOptions { sz?: number; col?: RGB; max?: number; lh?: number; wt?: string }
export interface PackageLabelOptions {
  /** Libellé du statut (ex. « Enregistré »). */
  statusLabel?: string;
  /** Origine des URL (défaut : window.location.origin). */
  origin?: string;
}

const INK: RGB = [23, 22, 20], GOLD: RGB = [167, 123, 40], GOLD_L: RGB = [217, 180, 101], GRAY: RGB = [75, 90, 110], MUTED: RGB = [132, 148, 169];
const LIGHT: RGB = [250, 248, 245], WARM: RGB = [255, 248, 238], WHITE: RGB = [255, 255, 255], LINE: RGB = [233, 225, 213];
const RED: RGB = [220, 38, 38], GREEN: RGB = [5, 150, 105], AMBER: RGB = [217, 119, 6];

const TYPE: Record<string, string> = { document: 'Document', clothing: 'Vêtements', electronics: 'Électronique', food: 'Alimentaire', cosmetics: 'Cosmétiques', fragile_item: 'Fragile', other: 'Autre' };
const SERVICE: Record<string, string> = { standard: 'Standard', express: 'Express', premium: 'Premium' };
const STATUS_COLOR: Record<string, RGB> = { registered: AMBER, preparing: GOLD, transit: GOLD, customs: AMBER, arrived: GREEN, out_for_delivery: GOLD, delivered: GREEN, returned: RED, lost: RED };

const clean = (s: unknown) => String(s ?? '').replace(/[  ]/g, ' ');
const countryLabel = (key?: string) => countryOf(key)?.label || countryOf(key)?.name || key || '—';
const fullName = (p?: Person | null) => (p ? `${p.firstName || ''} ${p.lastName || ''}`.trim() : '') || '—';

/**
 * @param {object} pkg          colis (sender / receiver / agency peuplés)
 * @param {object} [opts]
 * @param {string} [opts.statusLabel]  libellé du statut (ex. « Enregistré »)
 * @param {string} [opts.origin]       origine des URL (défaut : window.location.origin)
 */
export async function buildPackageLabelPdf(pkg: Package, { statusLabel, origin }: PackageLabelOptions = {}) {
  if (!pkg?.trackingNumber) throw new Error('Numéro de suivi absent : étiquette impossible.');
  const { jsPDF } = await import('jspdf');
  const W = 100, H = 150, m = 5;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [W, H] });
  const base = origin ?? (typeof window !== 'undefined' ? window.location.origin : '');
  const trackingUrl = `${base}/tracking/${pkg.trackingNumber}`;

  const fill = (x: number, y: number, w: number, h: number, rgb: RGB) => { doc.setFillColor(...rgb); doc.rect(x, y, w, h, 'F'); };
  const box = (x: number, y: number, w: number, h: number, rgb: RGB) => { doc.setFillColor(...rgb); doc.setDrawColor(...LINE); doc.setLineWidth(0.3); doc.roundedRect(x, y, w, h, 2, 2, 'FD'); };
  const t = (s: unknown, x: number, y: number, { sz = 8, wt = 'normal', col = INK, align = 'left', maxW }: TextOptions = {}) => {
    doc.setFontSize(sz); doc.setFont('helvetica', wt); doc.setTextColor(...col);
    let text = clean(s);
    if (maxW) text = doc.splitTextToSize(text, maxW)[0] || '';
    doc.text(text, x, y, { align });
  };
  /** Texte sur plusieurs lignes (au plus `max`), renvoie la position suivante. */
  const para = (s: unknown, x: number, y: number, w: number, { sz = 7, col = GRAY, max = 2, lh = 3.4, wt = 'normal' }: ParagraphOptions = {}) => {
    doc.setFontSize(sz); doc.setFont('helvetica', wt); doc.setTextColor(...col);
    doc.splitTextToSize(clean(s), w).slice(0, max).forEach((row: string, i: number) => doc.text(row, x, y + i * lh));
    return y + Math.min(doc.splitTextToSize(clean(s), w).length, max) * lh;
  };

  /* ── En-tête Trans Africa Canada ── */
  fill(0, 0, W, 22, INK);
  fill(0, 0, W, 2, GOLD);
  t('Trans Africa Canada', m, 12.5, { sz: 11, wt: 'bold', col: WHITE });
  t('Expédition internationale de colis', m, 18, { sz: 6.5, col: [224, 215, 199] });
  t('ÉTIQUETTE COLIS', W - m, 9.5, { sz: 6.5, wt: 'bold', col: GOLD_L, align: 'right' });
  t(new Date(pkg.createdAt || Date.now()).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }), W - m, 16, { sz: 6.5, col: [224, 215, 199], align: 'right' });

  /* ── Suivi + QR code réel ── */
  let y = 25;
  const qr = await QRCode.toDataURL(trackingUrl, { errorCorrectionLevel: 'M', margin: 1, width: 320, color: { dark: '#172F50', light: '#ffffff' } });
  const qrS = 27;
  box(W - m - qrS - 2, y, qrS + 2, qrS + 2, WHITE);
  doc.addImage(qr, 'PNG', W - m - qrS - 1, y + 1, qrS, qrS);
  const leftW = W - 2 * m - qrS - 5;
  t('N° DE SUIVI', m, y + 4, { sz: 6, wt: 'bold', col: MUTED });
  t(pkg.trackingNumber, m, y + 12, { sz: 15, wt: 'bold', col: INK, maxW: leftW });
  // Statut
  const sc = STATUS_COLOR[pkg.status ?? ''] || GRAY;
  const sl = clean((statusLabel || pkg.status || '—')).toUpperCase();
  doc.setFontSize(6.5); doc.setFont('helvetica', 'bold');
  const pw = Math.min(leftW, doc.getTextWidth(sl) + 8);
  doc.setFillColor(...sc); doc.roundedRect(m, y + 16, pw, 6, 3, 3, 'F');
  t(sl, m + pw / 2, y + 20.2, { sz: 6.5, wt: 'bold', col: WHITE, align: 'center' });
  if (pkg.fragile || pkg.packageType === 'fragile_item') {
    const fx = m + pw + 3, fw = 18;
    if (fx + fw <= m + leftW) {
      doc.setFillColor(...RED); doc.roundedRect(fx, y + 16, fw, 6, 3, 3, 'F');
      t('FRAGILE', fx + fw / 2, y + 20.2, { sz: 6.5, wt: 'bold', col: WHITE, align: 'center' });
    }
  }
  t('Scannez pour suivre le colis', m, y + 27, { sz: 5.5, col: MUTED });
  y += 31;

  /* ── Trajet (libellés officiels complets, sur 2 lignes si nécessaire) ── */
  const half = (W - 2 * m) / 2;
  const bandH = 16;
  fill(m, y, W - 2 * m, bandH, INK);
  fill(m, y, 1.5, bandH, GOLD);
  const place = (label: string, x: number, align: 'left' | 'right') => {
    doc.setFontSize(6.8); doc.setFont('helvetica', 'bold'); doc.setTextColor(...WHITE);
    const rows = doc.splitTextToSize(clean(label), half - 9).slice(0, 2);
    rows.forEach((row: string, i: number) => doc.text(row, x, y + 9 + i * 3.2, { align }));
  };
  t('DÉPART', m + 4, y + 4.5, { sz: 5.5, wt: 'bold', col: GOLD_L });
  place(countryLabel(pkg.origin), m + 4, 'left');
  t('»', W / 2, y + 10, { sz: 11, wt: 'bold', col: GOLD_L, align: 'center' });
  t('ARRIVÉE', W - m - 3, y + 4.5, { sz: 5.5, wt: 'bold', col: GOLD_L, align: 'right' });
  place(countryLabel(pkg.destination), W - m - 3, 'right');
  y += bandH + 2;

  /* ── Destinataire (mis en avant) ── */
  const r = pkg.receiver || pkg.receiverData || {};
  box(m, y, W - 2 * m, 32, WARM);
  fill(m, y + 1, 1.5, 30, GOLD);
  t('DESTINATAIRE', m + 4, y + 5, { sz: 6, wt: 'bold', col: GOLD });
  t(fullName(r), m + 4, y + 11.5, { sz: 11, wt: 'bold', maxW: W - 2 * m - 8 });
  let ry = y + 16.5;
  if (r.phone) { t(r.phone, m + 4, ry, { sz: 8, wt: 'bold', col: INK }); ry += 4; }
  const raddr = [r.address, r.city].filter(Boolean).join(', ');
  if (raddr) ry = para(raddr, m + 4, ry, W - 2 * m - 8, { sz: 7, col: GRAY, max: 2 });
  t(countryLabel(r.country || pkg.destination).toUpperCase(), m + 4, y + 29, { sz: 7, wt: 'bold', col: INK, maxW: W - 2 * m - 8 });
  y += 35;

  /* ── Expéditeur (compact) ── */
  const s = pkg.sender || pkg.senderData || {};
  box(m, y, W - 2 * m, 16, LIGHT);
  t('EXPÉDITEUR', m + 4, y + 4.5, { sz: 5.5, wt: 'bold', col: GRAY });
  t(fullName(s), m + 4, y + 9, { sz: 8, wt: 'bold', maxW: W - 2 * m - 8 });
  t([s.phone, countryLabel(s.country || pkg.origin)].filter(Boolean).join('  ·  '), m + 4, y + 13, { sz: 6.5, col: GRAY, maxW: W - 2 * m - 8 });
  y += 19;

  /* ── Informations colis ── */
  const info: Array<[string, string]> = [
    ['POIDS', `${pkg.weight ?? '—'} kg`],
    ['ARTICLES', String(pkg.numberOfItems || 1)],
    ['TYPE', TYPE[pkg.packageType ?? ''] || '—'],
    ['SERVICE', SERVICE[pkg.service || pkg.financial?.service || ''] || 'Standard'],
  ];
  const cw = (W - 2 * m) / 4;
  box(m, y, W - 2 * m, 12, WHITE);
  info.forEach(([l, v], i) => {
    const cx = m + i * cw;
    if (i) { doc.setDrawColor(...LINE); doc.setLineWidth(0.3); doc.line(cx, y + 2, cx, y + 10); }
    t(l, cx + cw / 2, y + 4.5, { sz: 5, wt: 'bold', col: MUTED, align: 'center' });
    t(v, cx + cw / 2, y + 9.5, { sz: 7.5, wt: 'bold', col: INK, align: 'center', maxW: cw - 2 });
  });

  /* ── Pied ── */
  doc.setDrawColor(...LINE); doc.setLineWidth(0.3); doc.line(m, H - 8, W - m, H - 8);
  t(pkg.agency?.name ? `Agence : ${pkg.agency.name}` : 'Trans Africa Canada', m, H - 3.6, { sz: 6, wt: 'bold', col: GOLD, maxW: 45 });
  t(trackingUrl.replace(/^https?:\/\//, ''), W - m, H - 3.6, { sz: 5.5, col: MUTED, align: 'right', maxW: 48 });

  return doc;
}
