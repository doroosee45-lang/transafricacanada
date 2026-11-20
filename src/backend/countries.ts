/**
 * Conversion d'une saisie libre en code pays ISO attendu par le Core API.
 * Seuls les cinq pays desservis sont reconnus, par code ISO ou par nom non ambigu.
 * « Congo » seul est volontairement refusé : il peut désigner la RDC (CD) ou le Congo-Brazzaville (CG).
 */
export type CountryCode = 'CA' | 'CN' | 'CD' | 'CG' | 'CM';

const normalize = (v: string) => v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]+/g, ' ').trim();

const NAMES: Record<string, CountryCode> = {
  'ca': 'CA', 'canada': 'CA',
  'cn': 'CN', 'chine': 'CN', 'china': 'CN',
  'cd': 'CD', 'rdc': 'CD', 'r d c': 'CD', 'drc': 'CD', 'kinshasa': 'CD', 'congo kinshasa': 'CD',
  'republique democratique du congo': 'CD', 'democratic republic of the congo': 'CD',
  'cg': 'CG', 'brazzaville': 'CG', 'congo brazzaville': 'CG', 'republique du congo': 'CG', 'republic of the congo': 'CG',
  'cm': 'CM', 'cameroun': 'CM', 'cameroon': 'CM',
};

export const COUNTRY_HINT = 'Indiquez un pays desservi : Canada, Chine, RDC, Congo-Brazzaville ou Cameroun.';

export function toCountryCode(input: string): CountryCode | null {
  const key = normalize(input);
  return Object.hasOwn(NAMES, key) ? NAMES[key] : null;
}
