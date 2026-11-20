// Marchés, pays et devises — chargés depuis l'API (GET /api/config/markets), source unique
// côté backend (backend/config/markets.js). Ce module ne contient AUCUNE liste en dur.
//
// Les tableaux exportés sont remplis EN PLACE au démarrage (index.tsx attend loadMarketConfig()
// avant le premier rendu) : les écrans qui les importent restent inchangés.
// Formatage monétaire : Intl.NumberFormat, avec la précision ISO de chaque devise (TND : 3).

/** Devise telle que renvoyée par l'API. */
export interface CurrencyDef {
  code: string;
  name?: string;
  digits?: number;
  legacyOnly?: boolean;
  symbol?: string;
}

export interface CountryPhone {
  dialCode?: string;
  /** Nombres de chiffres acceptés pour le numéro national (ex. [8] ou [9, 10]). */
  nationalDigits?: number[];
  [key: string]: unknown;
}

/** Pays tel que renvoyé par l'API (`/config/markets`). */
export interface RawCountry {
  key: string;
  iso2?: string;
  name: string;
  label?: string;
  shortName?: string;
  flag?: string;
  market?: boolean;
  timezones?: string[];
  defaultCity?: string;
  phone?: CountryPhone;
  currency: string;
}

export interface MarketConfig {
  currencies?: CurrencyDef[];
  countries?: RawCountry[];
}

/** Devise résolue d'un pays. */
export interface CountryCurrency {
  code: string;
  name: string;
  symbol: string;
  digits: number;
}

export interface Country {
  key: string;
  code: string;
  iso2?: string;
  name: string;
  label: string;
  shortName: string;
  flag: string;
  market: boolean;
  timezones: string[];
  defaultCity?: string;
  prefix?: string;
  phone?: CountryPhone;
  currency: CountryCurrency;
}

export interface CountryOption {
  value: string;
  label: string;
  name: string;
  currency: CountryCurrency;
  prefix?: string;
  iso2?: string;
  market: boolean;
}

export interface MoneyFormatOptions {
  locale?: string;
}

/**
 * Pays desservis par Trans Africa Canada : Canada, RDC (Congo-Kinshasa) et Brazzaville (Congo).
 * Seuls ces pays sont proposés dans les listes (transport, agences, contact). La table complète
 * `COUNTRIES` reste chargée pour afficher correctement les données historiques d'autres pays.
 */
export const SERVED_COUNTRY_ISO2 = ['CA', 'CD', 'CG'];
const SERVED_COUNTRY_KEYS = ['CANADA', 'RDC', 'BRAZZAVILLE'];
export const isServedCountry = (c: { key: string; iso2?: string }): boolean =>
  SERVED_COUNTRY_ISO2.includes((c.iso2 || '').toUpperCase()) || SERVED_COUNTRY_KEYS.includes(c.key.toUpperCase());

export const COUNTRIES: Country[] = [];              // { key, code (=key), iso2, name, flag, currency:{code,name,symbol,digits}, prefix, timezones, market }
export const COUNTRY_OPTIONS: CountryOption[] = [];  // pays de transport (origine/destination/résidence)
export const MARKET_OPTIONS: CountryOption[] = [];   // marchés d'activité (agences) : les pays desservis
export const CURRENCIES: CurrencyDef[] = [];         // { code, name, digits, legacyOnly? }

let loaded = false;
let loadError: Error | null = null;
export const isMarketConfigLoaded = (): boolean => loaded;
export const marketConfigError = (): Error | null => loadError;

const symbolOf = (code: string): string => {
  try {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: code })
      .formatToParts(0).find((p) => p.type === 'currency')?.value || code;
  } catch { return code; }
};

/** Installe une configuration (réponse de l'API). Exposé pour les tests. */
export function setMarketConfig(cfg?: MarketConfig | null): void {
  const currencies = new Map((cfg?.currencies || []).map((c) => [c.code, c]));
  const countries: Country[] = (cfg?.countries || []).map((c) => ({
    key: c.key,
    code: c.key, // compatibilité : `code` = valeur stockée (enum backend)
    iso2: c.iso2,
    name: c.name,
    label: c.label || c.name, // libellé des listes de sélection (ex. « Brazzaville (Congo) »)
    shortName: c.shortName || c.name,
    flag: c.flag || '',
    market: !!c.market,
    timezones: c.timezones || [],
    defaultCity: c.defaultCity,
    prefix: c.phone?.dialCode,
    phone: c.phone,
    currency: { code: c.currency, name: currencies.get(c.currency)?.name || c.currency, symbol: symbolOf(c.currency), digits: currencies.get(c.currency)?.digits ?? 2 },
  }));
  const toOption = (c: Country): CountryOption => ({ value: c.key, label: `${c.flag} ${c.label}`.trim(), name: c.name, currency: c.currency, prefix: c.prefix, iso2: c.iso2, market: c.market });
  COUNTRIES.splice(0, COUNTRIES.length, ...countries);
  const served = countries.filter(isServedCountry);
  COUNTRY_OPTIONS.splice(0, COUNTRY_OPTIONS.length, ...served.map(toOption));
  MARKET_OPTIONS.splice(0, MARKET_OPTIONS.length, ...served.map(toOption));
  CURRENCIES.splice(0, CURRENCIES.length, ...(cfg?.currencies || []).map((c) => ({ ...c, symbol: symbolOf(c.code) })));
  loaded = countries.length > 0;
}

/** Charge la configuration depuis l'API. Ne lève pas : en cas d'échec, les listes restent vides
 *  et `marketConfigError()` renseigne l'erreur (les sélecteurs l'affichent). */
export async function loadMarketConfig(apiBase: string = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'): Promise<boolean> {
  try {
    const res = await fetch(`${apiBase}/config/markets`, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = (await res.json()) as { data?: MarketConfig };
    setMarketConfig(body.data);
    loadError = null;
  } catch (err) {
    loadError = err instanceof Error ? err : new Error(String(err));
    console.warn('[config] marchés/devises indisponibles :', loadError.message);
  }
  return loaded;
}

const findCountry = (country?: string | null): Country | null => {
  if (!country) return null;
  const q = String(country).toUpperCase();
  return COUNTRIES.find((c) => c.key.toUpperCase() === q || c.iso2 === q || c.name.toUpperCase() === q) || null;
};
export const countryOf = findCountry;

/** Devise d'un pays de transport. Aucune devise implicite (avant : USD par défaut). */
export const getCurrency = (country?: string | null): CountryCurrency | null => findCountry(country)?.currency || null;

export const digitsOf = (code?: string | null): number => CURRENCIES.find((c) => c.code === code)?.digits ?? (() => {
  try { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: code ?? undefined }).resolvedOptions().maximumFractionDigits ?? 2; } catch { return 2; }
})();

type Amount = number | string | null | undefined;
type CurrencyCode = string | null | undefined;

/**
 * Formate un montant décimal dans SA devise (code ISO). Sans devise connue : montant seul,
 * jamais un symbole inventé (avant : « € » ou « $ » codés en dur quelle que soit la devise).
 */
export const formatMoney = (amount: Amount, currency?: CurrencyCode, { locale = 'fr-FR' }: MoneyFormatOptions = {}): string => {
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
export const formatMinor = (minor: Amount, currency: CurrencyCode, opts?: MoneyFormatOptions): string => formatMoney(Number(minor) / 10 ** digitsOf(currency), currency, opts);

/**
 * Format « document » (factures, PDF, e-mails) : code ISO et espaces ordinaires.
 * Identique à l'écran et dans le PDF (jsPDF ne sait pas afficher les espaces fines d'Intl).
 * Ex. 120,500 TND · 80,00 EUR · 57 954,75 CDF · 65,50 AED.
 */
export const formatMoneyCode = (amount: Amount, currency?: CurrencyCode, { locale = 'fr-FR' }: MoneyFormatOptions = {}): string => {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return '—';
  const digits = currency ? digitsOf(currency) : 2;
  let text: string;
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
export const toMinor = (amount: Amount, currency: CurrencyCode): number => Math.round(Number(amount || 0) * 10 ** digitsOf(currency));
export const fromMinor = (minor: Amount, currency: CurrencyCode): number => Number(minor || 0) / 10 ** digitsOf(currency);

interface WithPackageCurrency {
  financial?: { referenceCurrency?: string | null } | null;
  origin?: string | null;
}

/** Devise d'un colis : contrat multidevise (devise de départ), sinon devise du pays d'origine. */
export const packageCurrency = (pkg?: WithPackageCurrency | null): string | null => pkg?.financial?.referenceCurrency || getCurrency(pkg?.origin)?.code || null;

/**
 * Additionne des montants PAR DEVISE (jamais entre devises), en unités mineures.
 * @returns devise → montant décimal
 */
export const sumByCurrency = <T>(
  items: readonly T[] | null | undefined,
  amountOf: (item: T) => Amount,
  currencyOf: (item: T) => CurrencyCode,
): Record<string, number> => {
  const minor: Record<string, number> = {};
  for (const it of items || []) {
    const cur = currencyOf(it);
    const amt = amountOf(it);
    if (!cur || amt === null || amt === undefined || Number.isNaN(Number(amt))) continue;
    minor[cur] = (minor[cur] || 0) + toMinor(amt, cur);
  }
  return Object.fromEntries(Object.entries(minor).map(([c, m]) => [c, fromMinor(m, c)]));
};

/** « 24,690 TND · 2,50 € » — un montant par devise ; '—' si aucun. */
export const formatByCurrency = (
  map: Record<string, Amount> | null | undefined,
  fmt: (amount: Amount, currency: string) => string = formatMoney,
): string => {
  const entries = Object.entries(map || {}).filter(([, v]) => v !== null && v !== undefined);
  return entries.length ? entries.map(([c, v]) => fmt(v, c)).join(' · ') : '—';
};

export interface CurrencyAmount {
  currency: string;
  amount?: number;
  total?: number;
}

/** Liste [{currency, amount}] (API) → objet devise → montant. */
export const listToCurrencyMap = (list?: readonly CurrencyAmount[] | null): Record<string, number | undefined> =>
  Object.fromEntries((list || []).map((x) => [x.currency, x.amount ?? x.total]));

interface WithOriginCurrency {
  currency?: string | null;
  originCountry?: string | null;
}

/** Devise d'un produit marketplace : enregistrée, sinon celle du pays d'origine. */
export const productCurrency = (p?: WithOriginCurrency | null): string | null => p?.currency || getCurrency(p?.originCountry)?.code || null;
/** Devise d'une offre de kilos (ou d'une commande via son offre peuplée). */
export const offerCurrency = (o?: WithOriginCurrency | null): string | null => o?.currency || getCurrency(o?.originCountry)?.code || null;

/** Nombre seul, à la précision de la devise (le code est affiché à côté par l'appelant). */
export const formatAmount = (amount: Amount, currency?: CurrencyCode, { locale = 'fr-FR' }: MoneyFormatOptions = {}): string => {
  if (amount === null || amount === undefined || Number.isNaN(Number(amount))) return '—';
  const digits = currency ? digitsOf(currency) : 2;
  return new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits })
    .format(Number(amount)).replace(/[  ]/g, ' ');
};

/** Prix unitaire : « 12,500 TND/kg ». */
export const formatUnitPrice = (amount: Amount, currency?: CurrencyCode, unit = 'kg'): string => `${formatMoney(amount, currency)}/${unit}`;

/** Libellé de champ : « Prix (TND) » ; sans devise connue : « Prix ». */
export const withCurrencyLabel = (label: string, currency?: CurrencyCode): string => (currency ? `${label} (${currency})` : label);

/** Compatibilité : formate un montant dans la devise du pays. */
export const formatPrice = (amount: Amount, country?: string | null): string => formatMoney(amount, getCurrency(country)?.code);

export const timezonesOf = (country?: string | null): string[] => findCountry(country)?.timezones || [];
