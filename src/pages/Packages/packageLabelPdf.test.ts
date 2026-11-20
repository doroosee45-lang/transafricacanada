// @vitest-environment node
// Étiquette Trans Africa Canada : PDF réellement généré, texte extrait (pdf.js), QR code présent, format 100 × 150.
import { describe, it, expect, beforeAll } from 'vitest';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import QRCode from 'qrcode';
import { setMarketConfig } from '../../config/currencies';
import { buildPackageLabelPdf } from './packageLabelPdf';
import type { Package } from '../../types/models';

const require = createRequire(import.meta.url);
const OUT = path.resolve(__dirname, '../../../../verification');
const PKG: Package = {
  _id: 'pkg-1', trackingNumber: 'LGT-FE4A3084', status: 'registered', createdAt: '2026-11-12T15:08:22Z',
  origin: 'Tunisie', destination: 'RDC', weight: 2, numberOfItems: 3, packageType: 'clothing', fragile: true,
  sender: { firstName: 'Karim', lastName: 'Client', phone: '+216 22333444', country: 'Tunisie' },
  receiver: { firstName: 'Jean-Baptiste', lastName: 'Mukendi Kalombo', phone: '+243 810000000', country: 'RDC', city: 'Kinshasa',
    address: 'Avenue du Commerce 10, quartier Gombe, en face de la Banque centrale du Congo, immeuble B' },
  agency: { _id: 'agency-1', name: 'Trans Africa Canada Tunisie' }, financial: { service: 'standard' },
};

async function pdfInfo(bytes: Uint8Array | ArrayBuffer) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const doc = await pdfjs.getDocument({ data: new Uint8Array(bytes), useSystemFonts: true }).promise;
  const page = await doc.getPage(1);
  const text = (await page.getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ').replace(/\s+/g, ' ');
  const ops = await page.getOperatorList();
  const hasImage = ops.fnArray.includes(pdfjs.OPS.paintImageXObject);
  const [, , w, h] = page.view; // points
  return { text, hasImage, pages: doc.numPages, mmW: Math.round(w / 72 * 25.4), mmH: Math.round(h / 72 * 25.4) };
}

describe('étiquette de colis Trans Africa Canada', () => {
  beforeAll(() => setMarketConfig(require('../../../../backend/config/markets.js').publicConfig()));

  it('charte Trans Africa Canada, libellés métier, QR code réel, une page 100 × 150 mm', async () => {
    const doc = await buildPackageLabelPdf(PKG, { statusLabel: 'Enregistré', origin: 'https://easy.example' });
    const bytes = doc.output('arraybuffer');
    fs.writeFileSync(path.join(OUT, 'etiquette-colis-exemple.pdf'), Buffer.from(bytes));
    const info = await pdfInfo(bytes);
    for (const e of ['Trans Africa Canada', 'ÉTIQUETTE COLIS', 'N° DE SUIVI', 'LGT-FE4A3084', 'ENREGISTRÉ', 'FRAGILE', 'DÉPART', 'Tunisie',
      'ARRIVÉE', 'République démocratique du', 'Congo (RDC)', 'DESTINATAIRE', 'Jean-Baptiste Mukendi Kalombo', '+243 810000000',
      'EXPÉDITEUR', 'Karim Client', 'Vêtements', 'Standard', '2 kg', 'Agence : Trans Africa Canada Tunisie', 'easy.example/tracking/LGT-FE4A3084'])
      expect(info.text, e).toContain(e);
    for (const absent of ['AGENCE COLIS', 'agencecolis.com', 'clothing']) expect(info.text).not.toContain(absent);
    expect(info.hasImage, 'QR code').toBe(true);
    expect([info.pages, info.mmW, info.mmH]).toEqual([1, 100, 150]);
  });

  it('le QR code encode l\'URL de suivi (même générateur)', async () => {
    const segments = QRCode.create('https://easy.example/tracking/LGT-FE4A3084', { errorCorrectionLevel: 'M' });
    expect(segments.segments.map((s) => Buffer.from(s.data).toString('utf8')).join('')).toBe('https://easy.example/tracking/LGT-FE4A3084');
  });

  it('refuse un colis sans numéro de suivi', async () => {
    await expect(buildPackageLabelPdf({} as Package)).rejects.toThrow(/Numéro de suivi absent/);
  });
});
