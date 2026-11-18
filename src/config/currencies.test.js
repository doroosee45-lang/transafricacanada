import { describe, it, expect, beforeAll } from 'vitest';
import {
  setMarketConfig, COUNTRY_OPTIONS, MARKET_OPTIONS, CURRENCIES, getCurrency, formatMoney, formatMinor, timezonesOf, countryOf,
} from './currencies';

// Extrait de la réponse réelle de GET /api/config/markets (structure identique).
const CONFIG = {
  markets: ['Tunisie', 'RDC', 'EAU', 'France'],
  countries: [
    { key: 'Tunisie', iso2: 'TN', name: 'Tunisie', currency: 'TND', market: true, timezones: ['Africa/Tunis'], phone: { dialCode: '+216' }, flag: '🇹🇳' },
    { key: 'RDC', iso2: 'CD', name: 'République démocratique du Congo', currency: 'CDF', market: true, timezones: ['Africa/Kinshasa', 'Africa/Lubumbashi'], phone: { dialCode: '+243' }, flag: '🇨🇩' },
    { key: 'EAU', iso2: 'AE', name: 'Émirats arabes unis', currency: 'AED', market: true, timezones: ['Asia/Dubai'], phone: { dialCode: '+971' }, flag: '🇦🇪', defaultCity: 'Dubaï' },
    { key: 'France', iso2: 'FR', name: 'France', currency: 'EUR', market: true, timezones: ['Europe/Paris'], phone: { dialCode: '+33' }, flag: '🇫🇷' },
    { key: 'Canada', iso2: 'CA', name: 'Canada', currency: 'CAD', market: false, timezones: ['America/Toronto'], phone: { dialCode: '+1' }, flag: '🇨🇦' },
  ],
  currencies: [
    { code: 'TND', name: 'Dinar tunisien', digits: 3 }, { code: 'CDF', name: 'Franc congolais', digits: 2 },
    { code: 'AED', name: 'Dirham des Émirats', digits: 2 }, { code: 'EUR', name: 'Euro', digits: 2 },
    { code: 'CAD', name: 'Dollar canadien', digits: 2 }, { code: 'USD', name: 'Dollar américain', digits: 2, legacyOnly: true },
  ],
};
const nbsp = (s) => s.replace(/[  ]/g, ' ');

beforeAll(() => setMarketConfig(CONFIG));

describe('configuration des marchés (frontend)', () => {
  it('distingue les 4 marchés des pays de transport', () => {
    expect(MARKET_OPTIONS.map((m) => m.value)).toEqual(['Tunisie', 'RDC', 'EAU', 'France']);
    expect(COUNTRY_OPTIONS.map((m) => m.value)).toContain('Canada');
  });

  it("Dubaï : pays « Émirats arabes unis » (AE), ville par défaut Dubaï", () => {
    expect(countryOf('AE').name).toBe('Émirats arabes unis');
    expect(countryOf('EAU').defaultCity).toBe('Dubaï');
    expect(countryOf('Dubaï')).toBeNull();
  });

  it('devise par pays, sans devise implicite pour un pays inconnu', () => {
    expect(['Tunisie', 'RDC', 'EAU', 'France'].map((k) => getCurrency(k).code)).toEqual(['TND', 'CDF', 'AED', 'EUR']);
    expect(getCurrency('Atlantide')).toBeNull();
  });

  it('formate chaque devise avec sa précision ISO (TND : 3 décimales)', () => {
    expect(nbsp(formatMoney(24.69, 'TND'))).toBe('24,690 TND');
    expect(nbsp(formatMoney(1234.5, 'EUR'))).toBe('1 234,50 €');
    expect(nbsp(formatMoney(65.5, 'AED'))).toMatch(/65,50/);
    expect(nbsp(formatMoney(5795475 / 100, 'CDF'))).toMatch(/57 954,75/);
  });

  it('formate des unités mineures sans flottant cumulé', () => {
    expect(nbsp(formatMinor(5125, 'TND'))).toBe('5,125 TND');
    expect(nbsp(formatMinor(250, 'EUR'))).toBe('2,50 €');
  });

  it('sans devise connue : montant seul, jamais un symbole inventé', () => {
    expect(nbsp(formatMoney(10))).toBe('10');
    expect(formatMoney(null, 'EUR')).toBe('—');
  });

  it('fuseaux par pays (RDC : Kinshasa et Lubumbashi)', () => {
    expect(timezonesOf('RDC')).toEqual(['Africa/Kinshasa', 'Africa/Lubumbashi']);
    expect(CURRENCIES.find((c) => c.code === 'USD').legacyOnly).toBe(true);
  });
});
