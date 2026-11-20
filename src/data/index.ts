import {useEffect, useRef, useState} from 'react';
import {ApiError} from '../api';
import {useAuth} from '../auth/AuthProvider';
import {coreDetail, coreList, corePortsImpl} from '../backend';
import type {DetailState, ListKey, ListState, Ports} from './types';
import {LocalValidationError, NotConfiguredError} from './types';

/**
 * Données branchées sur le Core API (`src/backend`). Aucune donnée n'est simulée :
 * sans configuration ou sans contrat Core API pour une rubrique, l'état reste « non configuré ».
 */
export type {Detail, DetailState, Item, ListKey, ListState, Point, Ports, RequestDraft} from './types';
export {LocalValidationError, NotConfiguredError} from './types';

const EMPTY_LIST: ListState = {items: [], loading: false, error: null, configured: false};
const EMPTY_DETAIL: DetailState = {detail: null, loading: false, error: null, configured: false};

export function errorMessage(cause: unknown): string {
  if (cause instanceof ApiError) return cause.message;
  return 'Le service est momentanément indisponible.';
}

type Fetched<T> = {sig: string; value: T | null; error: string | null};
const SIGNED_OUT = 'Connectez-vous pour consulter ces informations.';

/** Charge une ressource : l'état affiché est dérivé ; seules les réponses asynchrones écrivent l'état. */
function useFetched<T>(sig: string | null, load: ((signal: AbortSignal) => Promise<T>) | null): {value: T | null; loading: boolean; error: string | null} {
  const [fetched, setFetched] = useState<Fetched<T> | null>(null);
  useEffect(() => {
    if (!sig || !load) return;
    const controller = new AbortController();
    load(controller.signal)
      .then(value => { if (!controller.signal.aborted) setFetched({sig, value, error: null}); })
      .catch(cause => { if (!controller.signal.aborted) setFetched({sig, value: null, error: errorMessage(cause)}); });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);
  const current = sig && fetched?.sig === sig ? fetched : null;
  return {value: current?.value ?? null, loading: !!sig && !current, error: current?.error ?? null};
}

export function useList(key: ListKey): ListState {
  const {session} = useAuth();
  const userId = session?.user.id;
  const loader = coreList ? coreList(key) : null;
  const {value, loading, error} = useFetched(loader && userId ? `${key}|${userId}` : null, loader);
  if (!loader) return EMPTY_LIST;
  if (!userId) return {items: [], loading: false, error: SIGNED_OUT, configured: true};
  return {items: value ?? [], loading, error, configured: true};
}

export function useDetail(key: ListKey, id?: string): DetailState {
  const {session} = useAuth();
  const userId = session?.user.id;
  const loader = coreDetail ? coreDetail(key) : null;
  const {value, loading, error} = useFetched(loader && userId && id ? `${key}|${id}|${userId}` : null, loader && id ? (signal: AbortSignal) => loader(id, signal) : null);
  if (!loader) return EMPTY_DETAIL;
  if (!id) return {detail: null, loading: false, error: null, configured: true};
  if (!userId) return {detail: null, loading: false, error: SIGNED_OUT, configured: true};
  return {detail: value, loading, error, configured: true};
}

const off = () => Promise.reject(new NotConfiguredError());
export const ports: Ports = corePortsImpl ?? {
  createRequest: off, decideQuote: off, startPayment: off, createTicket: off, updateProfile: off, saveAddress: off,
  lookupLocation: off, receiveParcel: off, transferParcel: off, submitProof: off, createIncident: off,
};

export function useAction<A, R>(action: (input: A) => Promise<R>) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<R | null>(null);
  const locked = useRef(false);
  const revision = useRef(0);
  function clear() {
    revision.current++;
    setResult(null);
    setError('');
  }
  async function run(input: A): Promise<R | null> {
    if (locked.current) return null;
    locked.current = true;
    const submittedRevision = revision.current;
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const value = await action(input);
      if (revision.current !== submittedRevision) {
        setError('Les données ont été modifiées pendant l’opération. Vérifiez son statut avant de réessayer.');
        return null;
      }
      setResult(value);
      return value;
    } catch (cause) {
      setError(revision.current !== submittedRevision ?
        'Les données ont été modifiées pendant l’opération. Vérifiez son statut avant de réessayer.' :
        cause instanceof NotConfiguredError ?
        'Service non configuré : l’opération n’a pas été envoyée et rien n’a été enregistré.' :
        // Saisie refusée avant tout envoi (ex. pays non desservi) : message précis, rien n'a été enregistré.
        cause instanceof LocalValidationError ? cause.message :
        'Le résultat n’a pas pu être confirmé. Vérifiez son statut avant de réessayer.');
      return null;
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  return {run, busy, error, result, clear};
}
