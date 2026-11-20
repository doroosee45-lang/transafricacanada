/**
 * Câblage réel du Core API : URL publique HTTPS (origine seule, les chemins portent `/api/v1`),
 * jeton de la session Supabase courante, clés d'idempotence aléatoires.
 * Sans `EXPO_PUBLIC_CORE_API_URL` valide ou sans authentification configurée, rien n'est branché :
 * les écrans affichent « service non configuré » (aucune donnée simulée).
 */
import * as Crypto from 'expo-crypto';
import {apiClient} from '../api';
import {supabase} from '../auth/supabase';
import {corePorts, detailLoader, listLoader, parcelsService, recordsService} from './core';
import type {CoreRequest} from './core';

const raw = process.env.EXPO_PUBLIC_CORE_API_URL;

function makeRequest(): CoreRequest | null {
  if (!raw || !supabase) return null;
  try {
    const client = supabase;
    return apiClient(raw, async () => (await client.auth.getSession()).data.session?.access_token ?? null) as CoreRequest;
  } catch {
    return null; // URL non HTTPS ou invalide : refus de brancher (voir src/api.ts)
  }
}

export const coreRequest = makeRequest();
export const coreConfigured = coreRequest !== null;
const newKey = () => Crypto.randomUUID();

export const coreParcels = coreRequest ? parcelsService(coreRequest) : null;
export const coreRecords = coreRequest ? recordsService(coreRequest) : null;
export const corePortsImpl = coreRequest ? corePorts(coreRequest, newKey) : null;
export const coreList = coreRequest ? (key: Parameters<typeof listLoader>[1]) => listLoader(coreRequest, key) : null;
export const coreDetail = coreRequest ? (key: Parameters<typeof detailLoader>[1]) => detailLoader(coreRequest, key) : null;
