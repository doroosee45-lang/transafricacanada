// Politique de mot de passe — MIROIR de backend/services/passwordPolicy.js, pour guider la saisie.
// Le serveur reste l'autorité : il applique la même règle et renvoie son propre message.
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX_BYTES = 72;

export interface PasswordCheck {
  id: 'length' | 'upper' | 'digit';
  label: string;
  ok: boolean;
}

const byteLength = (s: string): number => new TextEncoder().encode(s).length;

/** Liste des règles, avec leur état pour `pw` (affichage d'une check-list). */
export function passwordChecks(pw = ''): PasswordCheck[] {
  return [
    { id: 'length',  label: `${PASSWORD_MIN} caractères minimum`, ok: pw.length >= PASSWORD_MIN },
    { id: 'upper',   label: 'Une majuscule',                      ok: /[A-ZÀ-ÖØ-Þ]/.test(pw) },
    { id: 'digit',   label: 'Un chiffre',                         ok: /\d/.test(pw) },
  ];
}

/** Message d'erreur (même texte que le serveur) ou null si conforme. */
export function validatePassword(pw: unknown, { email }: { email?: unknown } = {}): string | null {
  if (typeof pw !== 'string') return 'Mot de passe requis.';
  if (pw.length < PASSWORD_MIN) return `Le mot de passe doit contenir au moins ${PASSWORD_MIN} caractères.`;
  if (byteLength(pw) > PASSWORD_MAX_BYTES) return `Le mot de passe est trop long (${PASSWORD_MAX_BYTES} octets maximum).`;
  if (!/[A-ZÀ-ÖØ-Þ]/.test(pw)) return 'Le mot de passe doit contenir au moins une majuscule.';
  if (!/\d/.test(pw)) return 'Le mot de passe doit contenir au moins un chiffre.';
  if (/^\s|\s$/.test(pw)) return 'Le mot de passe ne doit pas commencer ni finir par un espace.';
  const e = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (e && (pw.toLowerCase() === e || pw.toLowerCase() === e.split('@')[0])) {
    return 'Le mot de passe ne doit pas reprendre votre adresse e-mail.';
  }
  return null;
}
