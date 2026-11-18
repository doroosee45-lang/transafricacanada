// Marchés, pays et devises — chargés depuis l'API (GET /api/config/markets), source unique
// côté backend (backend/config/markets.js). Ce module ne contient AUCUNE liste en dur.
//
// Les tableaux exportés sont remplis EN PLACE au démarrage (index.jsx attend loadMarketConfig()
// avant le premier rendu) : les écrans qui les importent restent inchangés.
// Formatage monétaire : Intl.NumberFormat, avec la précision ISO de chaque devise (TND : 3).

export const COUNTRIES = [];        // { key, code (=key), iso2, name, flag, currency:{code,name,symbol,digits}, prefix, timezones, market }
export const COUNTRY_OPTIONS = [];  // pays de transport (origine/destination/résidence)
export const MARKET_OPTIONS = [];   // les 4 marchés d'activité (agences)
export const CURRENCIES = [];       // { code, name, digits, legacyOnly? }

let loaded = false;
let loadError = null;
export const isMarketConfigLoaded = () => loaded;
export const marketConfigError = () => loadError;

const symbolOf = (code) => {
  try {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: code })
      .formatToParts(0).find((p) => p.type === 'currency')?.value || code;
  } catch { return code; }
};

/** Installe une configuration (réponse de l'API). Exposé pour les tests. */
export function setMarketConfig(cfg) {
  const currencies = new Map((cfg?.currencies || []).map((c) => [c.code, c]));
  const countries = (cfg?.countries || []).map((c) => ({
    key: c.key,
    code: c.key, // compatibilité : `code` = valeur stockée (enum backend)
    iso2: c.iso2,
    name: c.name,
    label: c.label || c.name, // libellé des listes de sélection (« Dubaï (EAU) »)
    shortName: c.shortName || c.name,
    flag: c.flag || '',
    market: !!c.market,
    timezones: c.timezones || [],
    defaultCity: c.defaultCity,
    prefix: c.phone?.dialCode,
    phone: c.phone,
    currency: { code: c.currency, name: currencies.get(c.currency)?.name || c.currency, symbol: symbolOf(c.currency), digits: currencies.get(c.currency)?.digits ?? 2 },
  }));
  const toOption = (c) => ({ value: c.key, label: `${c.flag} ${c.label}`.trim(), name: c.name, currency: c.currency, prefix: c.prefix, iso2: c.iso2, market: c.market });
  COUNTRIES.splice(0, COUNTRIES.length, ...countries);
  COUNTRY_OPTIONS.splice(0, COUNTRY_OPTIONS.length, ...countries.map(toOption));
  MARKET_OPTIONS.splice(0, MARKET_OPTIONS.length, ...countries.filter((c) => c.market).map(toOption));
  CURRENCIES.splice(0, CURRENCIES.length, ...(cfg?.currencies || []).map((c) => ({ ...c, symbol: symbolOf(c.code) })));
  loaded = countries.length > 0;
}

/** Charge la configuration depuis l'API. Ne lève pas : en cas d'échec, les listes restent vides
 *  et `marketConfigError()` renseigne l'erreur (les sélecteurs l'affichent). */
export async function loadMarketConfig(apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api') {
  try {
    const res = await fetch(`${apiBase}/config/markets`, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = await res.json();
    setMarketConfig(body.data);
    loadError = null;
  } catch (err) {
    loadError = err;
    console.warn('[config] marchés/devises indisponibles :', err.message);
  }
  return loaded;
}

const findCountry = (country) => {
  if (!country) return null;
  const q = String(country).toUpperCase();
  return COUNTRIES.find((c) => c.key.toUpperCase() === q || c.iso2 === q || c.name.toUpperCase() === q) || null;
};
export const countryOf = findCountry;

/** Devise d'un pays de transport. Aucune devise implicite (avant : USD par défaut). */
export const getCurrency = (country) => findCountry(country)?.currency || null;

export const digitsOf = (code) => CURRENCIES.find((c) => c.code === code)?.digits ?? (() => {
  try { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: code }).resolvedOptions().maximumFractionDigits; } catch { return 2; }
})();

/**
 * Formate un montant décimal dans SA devise (code ISO). Sans devise connue : montant seul,
 * jamais un symbole inventé (avant : « € » ou « $ » codés en dur quelle que soit la devise).
 */
export const formatMoney = (amount, currency, { locale = 'fr-FR' } = {}) => {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return '—';
  if (!currency) return new Intl.NumberFormat(locale).format(Number(amount));
  try {
    const digits = digitsOf(currency);
    return new Intl.NumberFormat(locale, { style: 'currency', currency, minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Number(amount));
  } catch {
    return `${new Intl.NumberFormat(locale).format(Number(amount))} ${currency}`;
  }
};

/** Montant en unités mineures (entier, ex. millimes) → texte, sans passer par un flottant cumulé. */
export const formatMinor = (minor, currency, opts) => formatMoney(Number(minor) / 10 ** digitsOf(currency), currency, opts);

/**
 * Format « document » (factures, PDF, e-mails) : code ISO et espaces ordinaires.
 * Identique à l'écran et dans le PDF (jsPDF ne sait pas afficher les espaces fines d'Intl).
 * Ex. 120,500 TND · 80,00 EUR · 57 954,75 CDF · 65,50 AED.
 */
export const formatMoneyCode = (amount, currency, { locale = 'fr-FR' } = {}) => {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return '—';
  const digits = currency ? digitsOf(currency) : 2;
  let text;
  try {
    text = currency
      ? new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: 'code', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Number(amount))
      : new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Number(amount));
  } catch {
    text = `${Number(amount).toFixed(digits)} ${currency || ''}`.trim();
  }
  return text.replace(/[  ]/g, ' ');
};

/** Montant décimal → unités mineures entières de la devise (arrondi au plus proche). */
export const toMinor = (amount, currency) => Math.round(Number(amount || 0) * 10 ** digitsOf(currency));
export const fromMinor = (minor, currency) => Number(minor || 0) / 10 ** digitsOf(currency);

/** Devise d'un colis : contrat multidevise (devise de départ), sinon devise du pays d'origine. */
export const packageCurrency = (pkg) => pkg?.financial?.referenceCurrency || getCurrency(pkg?.origin)?.code || null;

/**
 * Additionne des montants PAR DEVISE (jamais entre devises), en unités mineures.
 * @returns {Object<string, number>} devise → montant décimal
 */
export const sumByCurrency = (items, amountOf, currencyOf) => {
  const minor = {};
  for (const it of items || []) {
    const cur = currencyOf(it);
    const amt = amountOf(it);
    if (!cur || amt === null || amt === undefined || Number.isNaN(Number(amt))) continue;
    minor[cur] = (minor[cur] || 0) + toMinor(amt, cur);
  }
  return Object.fromEntries(Object.entries(minor).map(([c, m]) => [c, fromMinor(m, c)]));
};

/** « 24,690 TND · 2,50 € » — un montant par devise ; '—' si aucun. */
export const formatByCurrency = (map, fmt = formatMoney) => {
  const entries = Object.entries(map || {}).filter(([, v]) => v !== null && v !== undefined);
  return entries.length ? entries.map(([c, v]) => fmt(v, c)).join(' · ') : '—';
};

/** Liste [{currency, amount}] (API) → objet devise → montant. */
export const listToCurrencyMap = (list) => Object.fromEntries((list || []).map((x) => [x.currency, x.amount ?? x.total]));

/** Devise d'un produit marketplace : enregistrée, sinon celle du pays d'origine. */
export const productCurrency = (p) => p?.currency || getCurrency(p?.originCountry)?.code || null;
/** Devise d'une offre de kilos (ou d'une commande via son offre peuplée). */
export const offerCurrency = (o) => o?.currency || getCurrency(o?.originCountry)?.code || null;

/** Nombre seul, à la précision de la devise (le code est affiché à côté par l'appelant). */
export const formatAmount = (amount, currency, { locale = 'fr-FR' } = {}) => {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return '—';
  const digits = currency ? digitsOf(currency) : 2;
  return new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
    .format(Number(amount)).replace(/[  ]/g, ' ');
};

/** Prix unitaire : « 12,500 TND/kg ». */
export const formatUnitPrice = (amount, currency, unit = 'kg') => `${formatMoney(amount, currency)}/${unit}`;

/** Libellé de champ : « Prix (TND) » ; sans devise connue : « Prix ». */
export const withCurrencyLabel = (label, currency) => (currency ? `${label} (${currency})` : label);

/** Compatibilité : formate un montant dans la devise du pays. */
export const formatPrice = (amount, country) => formatMoney(amount, getCurrency(country)?.code);

export const timezonesOf = (country) => findCountry(country)?.timezones || [];
