import { describe, it, expect, beforeAll } from 'vitest';
import { setMarketConfig, formatMoneyCode, sumByCurrency, formatByCurrency, formatMoney } from '../config/currencies';
import { invoiceAmounts, invoiceTotals, invoiceCurrencyNotice } from './invoiceMoney';
import { buildReportRows, buildReportCsv } from './reportCsv';

beforeAll(() => setMarketConfig({
  markets: ['Tunisie', 'RDC', 'EAU', 'France'],
  countries: [
    { key: 'Tunisie', iso2: 'TN', name: 'Tunisie', currency: 'TND', market: true, timezones: [], phone: {} },
    { key: 'RDC', iso2: 'CD', name: 'RDC', currency: 'CDF', market: true, timezones: [], phone: {} },
    { key: 'EAU', iso2: 'AE', name: 'Émirats arabes unis', currency: 'AED', market: true, timezones: [], phone: {} },
    { key: 'France', iso2: 'FR', name: 'France', currency: 'EUR', market: true, timezones: [], phone: {} },
  ],
  currencies: [{ code: 'TND', digits: 3 }, { code: 'CDF', digits: 2 }, { code: 'AED', digits: 2 }, { code: 'EUR', digits: 2 }, { code: 'USD', digits: 2, legacyOnly: true }],
}));

describe('Factures : montants dans la devise réelle', () => {
  it.each([
    ['TND', { amount: 12.345, amountPaid: 5.125, status: 'partial' }, '12,345 TND', '5,125 TND', '7,220 TND'],
    ['CDF', { amount: 1500.75, amountPaid: 0, status: 'pending' }, '1 500,75 CDF', '0,00 CDF', '1 500,75 CDF'],
    ['AED', { amount: 65.5, amountPaid: 65.5, status: 'paid' }, '65,50 AED', '65,50 AED', '0,00 AED'],
    ['EUR', { amount: 80, amountPaid: 30.1, status: 'partial' }, '80,00 EUR', '30,10 EUR', '49,90 EUR'],
  ])('facture %s : total, réglé, reste dû', (currency, p, total, paid, due) => {
    const a = invoiceAmounts({ ...p, currency });
    expect([a.total, a.paid, a.due]).toEqual([total, paid, due]);
  });

  it('TND : jamais tronqué à 2 décimales', () => {
    expect(invoiceAmounts({ amount: 0.005, amountPaid: 0, status: 'pending', currency: 'TND' }).total).toBe('0,005 TND');
  });

  it('reste dû calculé en unités mineures (pas de 5.225000000000001)', () => {
    const t = invoiceTotals({ amount: 10.325, amountPaid: 5.1, status: 'partial', currency: 'TND' });
    expect(t).toEqual({ currency: 'TND', totalMinor: 10325, paidMinor: 5100, dueMinor: 5225 });
  });

  it('facture « payée » : réglée intégralement même si amountPaid n’a pas été renseigné', () => {
    const a = invoiceAmounts({ amount: 80, amountPaid: 0, status: 'paid', currency: 'EUR' });
    expect([a.paid, a.due, a.headline]).toEqual(['80,00 EUR', '0,00 EUR', '80,00 EUR']);
  });

  it('réglé borné au total (jamais de reste dû négatif)', () => {
    expect(invoiceAmounts({ amount: 10, amountPaid: 12, status: 'partial', currency: 'EUR' }).due).toBe('0,00 EUR');
  });

  it('format identique écran/PDF : code ISO et espaces ordinaires (aucune espace fine)', () => {
    const s = formatMoneyCode(1234567.891, 'TND');
    expect(s).toBe('1 234 567,891 TND');
    expect(/[  ]/.test(s)).toBe(false);
  });

  it('sans devise : pas de symbole inventé', () => {
    expect(invoiceAmounts({ amount: 10 }).total).toBe('—');
  });

  it('ancienne facture USD liée à des colis tunisiens : signalée, jamais convertie', () => {
    expect(invoiceCurrencyNotice({ currency: 'USD' }, [{ origin: 'Tunisie' }])).toMatch(/USD.*TND.*sans conversion/);
    expect(invoiceCurrencyNotice({ currency: 'TND' }, [{ origin: 'Tunisie' }])).toBeNull();
  });
});

describe('Totaux multi-devises : jamais additionnés entre devises', () => {
  it('quatre devises simultanées → quatre totaux', () => {
    const items = [
      { a: 12.345, c: 'TND' }, { a: 0.655, c: 'TND' },
      { a: 1500.75, c: 'CDF' }, { a: 65.5, c: 'AED' }, { a: 80, c: 'EUR' }, { a: 0.1, c: 'EUR' }, { a: 0.2, c: 'EUR' },
    ];
    const map = sumByCurrency(items, (i) => i.a, (i) => i.c);
    expect(map).toEqual({ TND: 13, CDF: 1500.75, AED: 65.5, EUR: 80.3 });
    expect(formatByCurrency(map, formatMoneyCode)).toBe('13,000 TND · 1 500,75 CDF · 65,50 AED · 80,30 EUR');
  });

  it('formatMoney à l’écran : symbole ou code selon la devise, précision ISO', () => {
    expect(formatMoney(12.5, 'TND').replace(/[  ]/g, ' ')).toBe('12,500 TND');
  });
});

describe('Export CSV des rapports', () => {
  const data = {
    revenue: [
      { _id: { month: 11, year: 2026 }, currency: 'TND', total: 12.345, digits: 3, count: 2 },
      { _id: { month: 11, year: 2026 }, currency: 'EUR', total: 80, digits: 2, count: 1 },
    ],
    packages: [{ _id: { month: 11, year: 2026 }, total: 4 }],
    clients: [{ _id: { month: 11, year: 2026 }, count: 3 }],
  };

  it('une ligne par devise, colonne Devise, précision ISO', () => {
    const rows = buildReportRows(data);
    expect(rows[0]).toEqual(['Type', 'Mois', 'Année', 'Total', 'Devise', 'Détail']);
    expect(rows).toContainEqual(['Revenus', 11, 2026, '12.345', 'TND', '2 opération(s)']);
    expect(rows).toContainEqual(['Revenus', 11, 2026, '80.00', 'EUR', '1 opération(s)']);
    expect(rows).toContainEqual(['Colis', 11, 2026, 4, '', '']);
  });

  it('CSV : BOM, séparateur « ; », formules neutralisées', () => {
    const csv = buildReportCsv({ revenue: [{ _id: { month: '=cmd()', year: 2026 }, currency: 'TND', total: 1, digits: 3 }] });
    expect(csv.startsWith('﻿')).toBe(true);
    expect(csv).toContain("'=cmd()");
    expect(csv.split('\n')[0]).toBe('﻿Type;Mois;Année;Total;Devise;Détail');
  });
});
