
/** Identité visuelle officielle TransAfrica Canada
 *  Bleu royal + Bleu ciel
 *  Palette inspirée du logo officiel.
 */

export const colors = {
  // Couleurs principales de la marque
  blue: '#2D378F',
  accent: '#39A4E2',
  accentDark: '#212B78',

  // Anciennes propriétés conservées pour compatibilité
  gold: '#39A4E2',
  goldSoft: '#DDF1FC',

  // Fonds
  cream: '#F3F8FC',
  background: '#F7FAFC',
  surface2: '#EDF4F9',
  white: '#FFFFFF',

  // Textes
  ink: '#171B2B',
  ink80: '#29334A',
  muted: '#596579',
  mutedSoft: '#7B8798',

  // Bordures
  border: '#E1EAF2',

  // États fonctionnels
  green: '#059669',
  amber: '#D97706',
  rose: '#DC2626',
  purple: '#7C3AED',
  yellow: '#F2C51B',

  // Couleurs du logo
  navy: '#2D378F',
  sky: '#39A4E2',
  orange: '#F58220',
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const space = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 32,
  xxl: 48,
} as const;

export const font = {
  h1: {
    fontSize: 30,
    lineHeight: 37,
    fontWeight: '800',
  },
  h2: {
    fontSize: 22,
    lineHeight: 29,
    fontWeight: '800',
  },
  h3: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '400',
  },
  small: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
  },
  eyebrow: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1.6,
  },
} as const;

export const shadow = {
  card: {
    shadowColor: '#2D378F',
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  lift: {
    shadowColor: '#2D378F',
    shadowOpacity: 0.14,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 7,
  },
  gold: {
    shadowColor: '#39A4E2',
    shadowOpacity: 0.30,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
} as const;
