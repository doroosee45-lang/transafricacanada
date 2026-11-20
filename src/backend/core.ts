/**
 * Adaptateur du Core API Trans Afrique (`/api/v1`, voir core-api/docs/openapi.json).
 * Module pur : la fonction de requête est injectée (client HTTP sécurisé `apiClient` en production,
 * doublure dans les tests). Aucune donnée n'est simulée : toute fonction sans contrat Core API
 * rejette `NotConfiguredError` (rien n'est envoyé, rien n'est enregistré).
 */
import {ApiError} from '../api';
import type {Detail, Item, ListKey, Ports} from '../data/types';
import {LocalValidationError, NotConfiguredError} from '../data/types';
import type {Page, ParcelDetail, ParcelSummary, ParcelsService, TrackingEvent} from '../features/parcels/types';
import type {RecordDetail, RecordKind, RecordPage, RecordsService, RecordSummary} from '../features/records/model';
import {COUNTRY_HINT, toCountryCode} from './countries';

export type RequestOptions<T> = {method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'; body?: unknown; idempotencyKey?: string; signal?: AbortSignal; authenticated?: boolean; parse: (data: unknown) => T};
export type CoreRequest = <T>(path: string, options: RequestOptions<T>) => Promise<T>;

type Obj = Record<string, any>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
/** Enveloppe Core API : `{ success: true, data, meta }`. Toute autre forme est rejetée. */
export function envelope<T>(map: (data: any, meta: Obj) => T) {
  return (raw: unknown): T => {
    if (!isObj(raw) || raw.success !== true || !('data' in raw)) throw new Error('ENVELOPE');
    return map(raw.data, isObj(raw.meta) ? raw.meta : {});
  };
}
const arr = (v: unknown): Obj[] => { if (!Array.isArray(v)) throw new Error('ARRAY'); return v.filter(isObj); };
const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() ? v : typeof v === 'number' ? String(v) : undefined);
const req = (v: unknown, what: string): string => { const s = str(v); if (!s) throw new Error(`MISSING_${what}`); return s; };
const API = '/api/v1';
const enc = encodeURIComponent;

// Libellés d'affichage des statuts que le Core API renvoie sous forme de codes.
const QUOTE_STATUS: Record<string, string> = {draft: 'Brouillon', issued: 'Émis', viewed: 'Consulté', accepted: 'Accepté', rejected: 'Refusé', expired: 'Expiré', superseded: 'Remplacé', cancelled: 'Annulé'};
const PAYMENT_STATUS: Record<string, string> = {created: 'Créé', pending: 'En attente', processing: 'En traitement', succeeded: 'Confirmé', failed: 'Échoué', cancelled: 'Annulé', expired: 'Expiré', refunded: 'Remboursé', partially_refunded: 'Partiellement remboursé', under_review: 'En vérification'};
const REQUEST_STATUS: Record<string, string> = {new: 'Reçue', under_review: 'En étude', quoted: 'Devis émis', won: 'Acceptée', lost: 'Non retenue', cancelled: 'Annulée'};
const TICKET_STATUS: Record<string, string> = {open: 'Ouvert', in_progress: 'En cours', waiting_client: 'En attente de votre réponse', resolved: 'Résolu', closed: 'Clôturé'};
const label = (map: Record<string, string>, code: unknown) => { const c = str(code); return c ? map[c] ?? c : undefined; };
const money = (amount: unknown, currency: unknown) => { const a = str(amount), c = str(currency); return a && c ? `${a} ${c}` : undefined; };
const route = (o: Obj) => [str(o.origin_country), str(o.destination_country)].filter(Boolean).join(' → ') || undefined;
const field = (label: string, value: unknown) => { const v = str(value); return v ? [{label, value: v}] : []; };
const nextPage = (meta: Obj): string | null => {
  const p = meta.pagination;
  return isObj(p) && Number.isInteger(p.page) && Number.isInteger(p.pages) && p.page < p.pages ? String(p.page + 1) : null;
};
const pageQuery = (cursor: string | null) => {
  const page = cursor && /^\d{1,6}$/.test(cursor) ? Number(cursor) : 1;
  return `page=${page}&limit=20`;
};

// ---------------------------------------------------------------- Colis
export function parcelsService(request: CoreRequest): ParcelsService {
  return {
    list: ({cursor, signal}) => request(`${API}/me/parcels?${pageQuery(cursor)}`, {signal, parse: envelope((data, meta): Page<ParcelSummary> => ({
      items: arr(data).map(p => ({id: req(p.id, 'ID'), reference: req(p.reference, 'REFERENCE'), statusLabel: str(p.status_label) ?? req(p.status, 'STATUS'),
        origin: str(p.origin_country), destination: str(p.destination_country), updatedAt: str(p.updated_at)})),
      nextCursor: nextPage(meta),
    }))}),
    get: ({id, signal}) => request(`${API}/me/parcels/${enc(id)}/tracking`, {signal, parse: envelope((d): ParcelDetail => {
      const p = d.parcel, t = d.package_tracking, f = d.flight_tracking;
      if (!isObj(p) || !isObj(t)) throw new Error('TRACKING');
      const events: TrackingEvent[] = arr(t.events).map((e, i) => ({id: `${i}-${str(e.occurred_at) ?? ''}`, label: str(e.status_label) ?? req(e.status, 'STATUS'),
        occurredAt: req(e.occurred_at, 'OCCURRED_AT'), locationLabel: str(e.location_text), sourceLabel: e.source === 'scan' ? 'Scan' : undefined}));
      const pos = isObj(t.last_confirmed_position) ? t.last_confirmed_position : null;
      return {
        id, reference: req(p.reference, 'REFERENCE'), statusLabel: str(p.status_label) ?? req(p.status, 'STATUS'),
        origin: str(p.origin_country), destination: str(p.destination_country), updatedAt: str(t.last_update_at) ?? str(p.updated_at), events,
        // Vol : informations aériennes distinctes du statut du colis ; aucune position n'est inventée.
        flight: isObj(f) ? {number: req(f.designator, 'DESIGNATOR'), airline: str(f.airline), statusLabel: str(f.status_label), updatedAt: isObj(f.last_confirmed) ? str(f.last_confirmed.at) : undefined} : undefined,
        // Dernière position confirmée = dernier scan physique (D-17) ; jamais de GPS.
        lastConfirmedLocation: pos && str(pos.at) ? {label: str(pos.location) ?? str(pos.warehouse) ?? 'Entrepôt', observedAt: str(pos.at)!, kind: 'scan'} : undefined,
      };
    })}),
  };
}

// ---------------------------------------------------------------- Rubriques (RecordsService)
const shipmentSummary = (s: Obj): RecordSummary => ({id: req(s.id, 'ID'), title: req(s.reference, 'REFERENCE'), subtitle: route(s),
  status: str(s.status_label) ?? str(s.status), updatedAt: str(s.arrived_at) ?? str(s.dispatched_at)});
const quoteSummary = (q: Obj): RecordSummary => ({id: req(q.id, 'ID'), title: req(q.reference, 'REFERENCE'),
  subtitle: [money(q.total, q.currency), q.current_version ? `version ${q.current_version}` : undefined].filter(Boolean).join(' · ') || undefined,
  status: label(QUOTE_STATUS, q.status), updatedAt: str(q.valid_until) ?? str(q.created_at)});
const paymentSummary = (p: Obj): RecordSummary => ({id: req(p.id, 'ID'), title: req(p.reference, 'REFERENCE'),
  subtitle: [money(p.amount_paid, p.currency) && `Payé ${money(p.amount_paid, p.currency)}`, money(p.amount_due, p.currency) && `sur ${money(p.amount_due, p.currency)}`].filter(Boolean).join(' ') || undefined,
  status: label(PAYMENT_STATUS, p.status), updatedAt: str(p.confirmed_at) ?? str(p.created_at)});
const paymentDetail = (p: Obj): RecordDetail => ({...paymentSummary(p), fields: [
  ...field('Objet', p.purpose), ...field('Montant dû', money(p.amount_due, p.currency)), ...field('Montant encaissé', money(p.amount_paid, p.currency)),
  ...field('Montant remboursé', money(p.amount_refunded, p.currency)), ...field('Échéance', p.due_date), ...field('Confirmé le', p.confirmed_at)],
  notice: 'Statut confirmé par le service financier de Trans Afrique Canada.'});

export function recordsService(request: CoreRequest): RecordsService {
  const list = <T>(path: string, signal: AbortSignal, map: (rows: Obj[], meta: Obj) => T) => request(path, {signal, parse: envelope((d, m) => map(arr(d), m))});
  const notAvailable = () => Promise.reject(new ApiError('forbidden', 'Cette rubrique n’est pas proposée aux clients par le Core API.', 403));
  return {
    list(kind: RecordKind, {cursor, signal}): Promise<RecordPage> {
      switch (kind) {
        case 'shipments': return list(`${API}/me/shipments`, signal, rows => ({items: rows.map(shipmentSummary), nextCursor: null}));
        case 'quotes': return list(`${API}/me/quotes`, signal, rows => ({items: rows.map(quoteSummary), nextCursor: null}));
        case 'payments': return list(`${API}/me/payments`, signal, rows => ({items: rows.map(paymentSummary), nextCursor: null}));
        case 'notifications': return list(`${API}/me/notifications?${pageQuery(cursor)}`, signal, (rows, meta) => ({nextCursor: nextPage(meta),
          items: rows.map(n => ({id: req(n.id, 'ID'), title: req(n.title, 'TITLE'), subtitle: str(n.body), updatedAt: str(n.created_at), unread: !n.read_at}))}));
        case 'agencies': return notAvailable();
      }
    },
    async get(kind: RecordKind, id: string, {signal}): Promise<RecordDetail> {
      switch (kind) {
        case 'shipments': {
          const rows = await list(`${API}/me/shipments`, signal, r => r);
          const s = rows.find(r => r.id === id); if (!s) throw new ApiError('not_found', 'Élément introuvable.', 404);
          const flights = Array.isArray(s.flights) ? s.flights.filter(isObj) : [];
          return {...shipmentSummary(s), fields: [...field('Mode', s.transport_mode), ...field('Départ', s.dispatched_at), ...field('Arrivée', s.arrived_at)],
            events: flights.map((f, i) => ({id: `${i}`, label: `Vol ${str(f.designator) ?? ''}`.trim(), occurredAt: str(f.flight_date),
              description: [str(f.departure_airport), str(f.arrival_airport)].filter(Boolean).join(' → ') + (str(f.status) ? ` · ${f.status}` : '')}))};
        }
        case 'quotes': return request(`${API}/me/quotes/${enc(id)}`, {signal, parse: envelope(q => quoteDetail(q))});
        case 'payments': {
          const rows = await list(`${API}/me/payments`, signal, r => r);
          const p = rows.find(r => r.id === id); if (!p) throw new ApiError('not_found', 'Élément introuvable.', 404);
          return paymentDetail(p);
        }
        case 'notifications': {
          const rows = await list(`${API}/me/notifications?page=1&limit=100`, signal, r => r);
          const n = rows.find(r => r.id === id); if (!n) throw new ApiError('not_found', 'Élément introuvable.', 404);
          return {id, title: req(n.title, 'TITLE'), updatedAt: str(n.created_at), unread: !n.read_at, fields: field('Message', n.body)};
        }
        case 'agencies': return notAvailable();
      }
    },
    markNotificationRead: (id, {signal}) => request(`${API}/me/notifications/${enc(id)}/read`, {method: 'POST', signal, parse: envelope(() => undefined)}),
  };
}

function quoteDetail(q: Obj): RecordDetail {
  const versions = arr(q.versions);
  const current = versions.find(v => v.version === q.current_version) ?? versions[versions.length - 1];
  const lines = current ? arr(current.lines ?? []) : [];
  return {
    id: req(q.id, 'ID'), title: req(q.reference, 'REFERENCE'), subtitle: route(q), status: current ? label(QUOTE_STATUS, current.status) : undefined,
    updatedAt: current ? str(current.valid_until) : undefined,
    fields: [
      ...field('Version', current?.version), ...field('Total', current ? money(current.total, current.currency) : undefined), ...field('Valable jusqu’au', current?.valid_until),
      ...lines.map(l => ({label: str(l.designation) ?? 'Ligne', value: money(l.amount, l.currency) ?? '—'})),
      ...field('Conditions', current?.conditions),
    ],
  };
}

// ---------------------------------------------------------------- Listes et détails génériques (écrans ListScreen / DetailScreen)
const requestItem = (r: Obj): Item => ({id: req(r.id, 'ID'), title: req(r.reference, 'REFERENCE'), subtitle: route(r), status: label(REQUEST_STATUS, r.status), date: str(r.created_at)});
const ticketItem = (t: Obj): Item => ({id: req(t.id, 'ID'), title: req(t.subject, 'SUBJECT'), subtitle: str(t.reference), status: str(t.status_label) ?? label(TICKET_STATUS, t.status), date: str(t.updated_at) ?? str(t.created_at)});
const addressItem = (a: Obj): Item => ({id: req(a.id, 'ID'), title: str(a.label) ?? req(a.line1, 'LINE1'),
  subtitle: [str(a.line1), str(a.line2), str(a.city), str(a.country_code)].filter(Boolean).join(', '), status: a.is_default ? 'Par défaut' : undefined});
type FlightRow = {id: string; shipment: string; f: Obj};
const flightRows = (shipments: Obj[]): FlightRow[] => shipments.flatMap(s => (Array.isArray(s.flights) ? s.flights.filter(isObj) : [])
  .map((f: Obj) => ({id: `${req(s.id, 'ID')}:${f.leg_sequence ?? 1}`, shipment: req(s.reference, 'REFERENCE'), f})));
const flightItem = ({id, shipment, f}: FlightRow): Item => ({id, title: `Vol ${req(f.designator, 'DESIGNATOR')}`,
  subtitle: [[str(f.departure_airport), str(f.arrival_airport)].filter(Boolean).join(' → '), `expédition ${shipment}`].filter(Boolean).join(' · '), status: str(f.status), date: str(f.flight_date)});

/** Listes fournies par le Core API ; `null` = aucun contrat Core API (écran « non configuré »). */
export function listLoader(request: CoreRequest, key: ListKey): ((signal: AbortSignal) => Promise<Item[]>) | null {
  const get = (path: string, signal: AbortSignal) => request(path, {signal, parse: envelope(d => arr(d))});
  switch (key) {
    case 'requests': return async s => (await get(`${API}/me/requests`, s)).map(requestItem);
    case 'quotes': return async s => (await get(`${API}/me/quotes`, s)).map(q => {const r = quoteSummary(q); return {id: r.id, title: r.title, subtitle: r.subtitle, status: r.status, date: r.updatedAt};});
    case 'payments': return async s => (await get(`${API}/me/payments`, s)).map(p => {const r = paymentSummary(p); return {id: r.id, title: r.title, subtitle: r.subtitle, status: r.status, date: r.updatedAt};});
    case 'flights': return async s => flightRows(await get(`${API}/me/shipments`, s)).map(flightItem);
    case 'tickets': return async s => (await get(`${API}/me/support-tickets`, s)).map(ticketItem);
    case 'addresses': return async s => (await get(`${API}/me/addresses`, s)).map(addressItem);
    // Tâches, livraisons et incidents terrain : aucun contrat dans le Core API à ce jour.
    case 'tasks': case 'deliveries': case 'incidents': return null;
  }
}

export function detailLoader(request: CoreRequest, key: ListKey): ((id: string, signal: AbortSignal) => Promise<Detail>) | null {
  const records = recordsService(request);
  const fromRecord = (r: RecordDetail, quoteId?: string): Detail => ({id: r.id, title: r.title, subtitle: r.subtitle, status: r.status, date: r.updatedAt, fields: r.fields, quoteId});
  switch (key) {
    case 'quotes': return async (id, s) => fromRecord(await records.get('quotes', id, {signal: s}), id);
    case 'payments': return async (id, s) => fromRecord(await records.get('payments', id, {signal: s}));
    case 'requests': return async (id, s) => {
      const rows = await request(`${API}/me/requests`, {signal: s, parse: envelope(d => arr(d))});
      const r = rows.find(x => x.id === id); if (!r) throw new ApiError('not_found', 'Élément introuvable.', 404);
      return {...requestItem(r), fields: [...field('Origine', r.origin_country), ...field('Destination', r.destination_country), ...field('Type', r.shipment_type), ...field('Créée le', r.created_at)]};
    };
    case 'tickets': return (id, s) => request(`${API}/me/support-tickets/${enc(id)}`, {signal: s, parse: envelope((t): Detail => ({...ticketItem(t),
      fields: [...field('Catégorie', t.category), ...arr(t.messages ?? []).map(m => ({label: m.author_side === 'client' ? 'Vous' : 'Support', value: str(m.body) ?? ''}))]}))});
    case 'flights': return async (id, s) => {
      const rows = flightRows(await request(`${API}/me/shipments`, {signal: s, parse: envelope(d => arr(d))}));
      const row = rows.find(r => r.id === id); if (!row) throw new ApiError('not_found', 'Élément introuvable.', 404);
      return {...flightItem(row), fields: [...field('Date du vol', row.f.flight_date), ...field('Départ', row.f.departure_airport), ...field('Arrivée', row.f.arrival_airport), ...field('Statut', row.f.status)]};
    };
    case 'addresses': case 'tasks': case 'deliveries': case 'incidents': return null;
  }
}

// ---------------------------------------------------------------- Actions (ports)
const TICKET_CATEGORY: Record<string, string> = {parcel: 'parcel', payment: 'payment', delay: 'delay', delivery: 'delivery', account: 'other', other: 'other'};
const CONDITION: Record<string, string> = {good: 'Bon état', damaged: 'Endommagé', incomplete: 'Incomplet'};
const off = () => Promise.reject(new NotConfiguredError());

export function corePorts(request: CoreRequest, newKey: () => string): Ports {
  const findParcel = async (reference: string) => request(`${API}/canada/parcels/by-reference/${enc(reference.trim().toUpperCase())}`,
    {parse: envelope(p => ({id: req(p.id, 'ID'), status: str(p.status_label) ?? str(p.status), events: Array.isArray(p.events) ? p.events.filter(isObj) : []}))});
  const country = (value: string) => { const c = toCountryCode(value); if (!c) throw new LocalValidationError(COUNTRY_HINT); return c; };
  return {
    createRequest: async d => {
      const weight = d.weightKg.trim() ? Number(d.weightKg.replace(',', '.')) : undefined;
      const recipient = [d.recipientName.trim(), d.recipientPhone.trim() && `(${d.recipientPhone.trim()})`].filter(Boolean).join(' ');
      const body = {origin_country: country(d.origin), destination_country: country(d.destination), shipment_type: 'parcel',
        ...(weight !== undefined ? {estimated_weight_kg: weight} : {}), message: `${d.description.trim()}\nDestinataire : ${recipient}`.slice(0, 2000)};
      return request(`${API}/me/requests`, {method: 'POST', body, idempotencyKey: newKey(), parse: envelope(r => ({reference: req(r.reference, 'REFERENCE')}))});
    },
    decideQuote: async ({id, decision}) => {
      // L'acceptation porte TOUJOURS sur une version précise : la version courante lue à l'instant.
      const version = await request(`${API}/me/quotes/${enc(id)}`, {parse: envelope(q => { if (!Number.isInteger(q.current_version)) throw new Error('VERSION'); return q.current_version as number; })});
      const path = `${API}/me/quotes/${enc(id)}/versions/${version}/${decision === 'accept' ? 'accept' : 'reject'}`;
      await request(path, decision === 'accept'
        ? {method: 'POST', body: {accept_conditions: true}, idempotencyKey: newKey(), parse: envelope(() => undefined)}
        : {method: 'POST', body: {reason: null}, parse: envelope(() => undefined)});
    },
    // Paiement en ligne : prestataires non choisis (D-05) ; aucun paiement n'est simulé.
    startPayment: off,
    createTicket: async ({subject, category, message, reference}) => {
      const parcel_id = reference.trim() ? (await findParcel(reference)).id : null;
      return request(`${API}/me/support-tickets`, {method: 'POST', idempotencyKey: newKey(),
        body: {category: TICKET_CATEGORY[category] ?? 'other', subject, message, parcel_id}, parse: envelope(t => ({id: req(t.id, 'ID')}))});
    },
    updateProfile: async ({name, phone}) => {
      await request(`${API}/identity/me`, {method: 'PATCH', body: {display_name: name}, parse: envelope(() => undefined)});
      if (phone) await request(`${API}/me/client`, {method: 'PATCH', body: {phone}, parse: envelope(() => undefined)});
    },
    saveAddress: async a => {
      await request(`${API}/me/addresses`, {method: 'POST', parse: envelope(() => undefined), body: {
        label: a.label.trim() || null, country_code: country(a.country), city: a.city.trim(), line1: a.line.trim(),
        line2: a.recipient.trim() ? `À l’attention de : ${a.recipient.trim()}` : null, phone: a.phone.trim() || null}});
    },
    // Terrain : consultation et réception reposent sur les contrats existants du Core API.
    lookupLocation: async ({reference}) => {
      const p = await findParcel(reference);
      const last = [...p.events].reverse().find(e => str(e.location_text));
      return {description: [p.status && `Statut : ${p.status}`, last ? `Dernier emplacement confirmé : ${last.location_text}` : 'Aucun emplacement confirmé'].filter(Boolean).join(' · ')};
    },
    receiveParcel: async ({reference, condition, note}) => {
      const p = await findParcel(reference);
      // L'état constaté est consigné ; il n'est pas converti en statut (règle métier non définie).
      const comment = [`État constaté : ${CONDITION[condition] ?? condition}`, note.trim()].filter(Boolean).join('. ');
      await request(`${API}/canada/parcels/${enc(p.id)}/transitions`, {method: 'POST', idempotencyKey: newKey(),
        body: {to_status: 'received', comment, source: 'scan'}, parse: envelope(() => undefined)});
    },
    // Sans contrat Core API correspondant : transfert vers une cible libre, preuve de livraison signée, incident.
    transferParcel: off, submitProof: off, createIncident: off,
  };
}
