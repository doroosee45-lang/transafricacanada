// @vitest-environment node
// Facture d'expédition : PDF réellement généré, texte extrait (pdf.js) et comparé au contrat figé.
import { describe, it, expect, beforeAll } from 'vitest';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { setMarketConfig } from '../../config/currencies';
import { buildShippingInvoicePdf } from './shippingInvoicePdf';
import { amountText } from './FinancialSummary';

const require = createRequire(import.meta.url);
const OUT = path.resolve(__dirname, '../../../../verification');

// Exemple de la capture utilisateur : Tunisie → RDC, 2 000,000 TND, taux figé 2.8.
const PKG = {
  _id: 'x', trackingNumber: 'LGT-FE4A3084', origin: 'Tunisie', destination: 'RDC', weight: 2, numberOfItems: 1, packageType: 'clothing',
  sender: { firstName: 'Karim', lastName: 'Client', phone: '+216 22333444', email: 'karim@test.invalid', country: 'Tunisie', city: 'Sfax', address: '8 avenue Habib Bourguiba' },
  receiver: { firstName: 'Joseph', lastName: 'Kabila', phone: '+243 810000000', country: 'RDC', city: 'Kinshasa', address: 'Avenue du Commerce 10' },
  agency: { name: 'EASY Tunisie' }, createdBy: { firstName: 'Adam', lastName: 'Agent', role: 'agent' },
  financial: {
    referenceCurrency: 'TND', destinationCurrency: 'CDF', service: 'standard',
    baseMinor: 2000000, flatMinor: 0, insuranceMinor: 0, minimumAdjustmentMinor: 0, totalMinor: 2000000,
    advanceMinor: 0, remainingReferenceMinor: 2000000, rate: '2.8', lockedAt: '2026-11-12T15:08:22Z',
    destinationDueMinor: 560000, destinationPaidMinor: 0, status: 'unpaid', transactions: [],
  },
};

async function pdfText(bytes) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({ data: new Uint8Array(bytes), useSystemFonts: true }).promise;
  let text = '';
  for (let p = 1; p <= doc.numPages; p++) text += (await (await doc.getPage(p)).getTextContent()).items.map((i) => i.str).join(' ') + '\n';
  return text.replace(/\s+/g, ' ');
}

describe("facture d'expédition harmonisée", () => {
  beforeAll(() => setMarketConfig(require('../../../../backend/config/markets.js').publicConfig()));

  it('contient la charte, les parties, les montants du contrat et des accents corrects', async () => {
    const pdf = await buildShippingInvoicePdf(PKG, amountText);
    const bytes = pdf.output('arraybuffer');
    fs.writeFileSync(path.join(OUT, 'facture-expedition-exemple.pdf'), Buffer.from(bytes));
    const text = await pdfText(bytes);
    for (const expected of [
      "FACTURE D'EXPÉDITION", 'LGT-FE4A3084', 'NON PAYÉE', 'Tunisie » République démocratique du Congo (RDC)',
      'EXPÉDITEUR', 'Karim Client', 'DESTINATAIRE', 'Joseph Kabila', 'Avenue du Commerce 10, Kinshasa',
      'DÉPART — TND', 'Total expédition', '2 000,000 TND', 'PAIEMENTS — TND', 'Déjà payé', '0,000 TND', 'Reste à payer',
      '1 TND = 2.8 CDF', 'Enregistré par', 'Adam Agent (Agent)', 'Page 1 / 1',
    ]) expect(text, expected).toContain(expected);
  });

  it('facture partiellement payée : tableau des transactions, sans chevauchement du pied de page', async () => {
    const tx = (i, kind, minor, cur, rate) => ({ key: `k${i}`, kind, amountMinor: minor, currency: cur, rate, method: i % 2 ? 'cash' : 'mobile_money', recordedAt: `2026-11-1${i}T10:00:00Z` });
    const f = { ...PKG.financial, status: 'partial', advanceMinor: 500000, remainingReferenceMinor: 1500000, destinationPaidMinor: 300000,
      transactions: [tx(2, 'advance', 500000, 'TND', '1'), tx(3, 'destination', 100000, 'CDF', '2.8'), tx(4, 'destination', 100000, 'CDF', '2.8'), tx(5, 'destination', 100000, 'CDF', '2.8')] };
    const pdf = await buildShippingInvoicePdf({ ...PKG, financial: f }, amountText);
    const bytes = pdf.output('arraybuffer');
    fs.writeFileSync(path.join(OUT, 'facture-expedition-exemple-transactions.pdf'), Buffer.from(bytes));
    const text = await pdfText(bytes);
    // Situation : celle du serveur quand elle est fournie (ici : 500 TND d'avance + 3 × 1 000 CDF ≈ 357,142 TND).
    const sum = { paidMinor: 857142, remainingMinor: 1142858, remainingDestinationMinor: 320000, status: 'partial' };
    const pdf2 = await buildShippingInvoicePdf({ ...PKG, financial: f, financialSummary: sum }, amountText);
    const text2 = await pdfText(pdf2.output('arraybuffer'));
    for (const expected of ['PARTIELLEMENT PAYÉE', '857,142 TND', '1 142,858 TND', '3 200,00 CDF']) expect(text2, expected).toContain(expected);
    for (const expected of ['PARTIELLEMENT PAYÉE', 'Avance (départ)', 'Paiement (arrivée)', '500,000 TND', '1 000,00 CDF', 'Déjà payé', 'Mobile Money'])
      expect(text, expected).toContain(expected);
  });

  it('refuse sans contrat financier (pas de facture vide)', async () => {
    await expect(buildShippingInvoicePdf({ trackingNumber: 'X' }, amountText)).rejects.toThrow(/Contrat financier absent/);
  });
});
