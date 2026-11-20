// Types transverses des échanges avec l'API.

export type Id = string;

/** Paramètres de requête libres (filtres, pagination…). */
export type QueryParams = Record<string, string | number | boolean | undefined | null>;

/** Corps de requête générique (formulaires envoyés tels quels à l'API). */
export type Payload = Record<string, unknown> | FormData;

/** Enveloppe standard des réponses du backend. */
export interface ApiEnvelope<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  [key: string]: unknown;
}

/** Corps d'erreur renvoyé par le backend. */
export interface ApiErrorBody {
  message?: string;
  error?: string;
  /** Erreurs de validation par champ : { email: 'Adresse invalide', … }. */
  errors?: Record<string, string>;
  /** Champ fautif signalé par certaines routes (ex. création de colis). */
  field?: string;
  /** Réponse textuelle (route du chat). */
  response?: string;
}

/** Erreur levée par fetch()/axios et exploitée dans les écrans. */
export interface HttpError extends Error {
  /** Code d'erreur axios (ex. 'ERR_CANCELED' pour une requête annulée). */
  code?: string;
  response?: { data?: ApiErrorBody; status?: number };
}

/**
 * Donne un type à l'erreur capturée par un `catch` (typée `unknown` en TypeScript).
 * Ne transforme pas l'objet : c'est la même erreur, simplement typée.
 */
export const asHttpError = (err: unknown): HttpError => err as HttpError;

/** Pagination renvoyée par les routes de liste. */
export interface Pagination {
  page: number;
  totalPages: number;
  total?: number;
  limit?: number;
}
