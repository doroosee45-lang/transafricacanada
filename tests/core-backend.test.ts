import {test} from 'node:test';
import assert from 'node:assert/strict';
import {apiClient, ApiError} from '../src/api';
import {corePorts, detailLoader, envelope, listLoader, parcelsService, recordsService} from '../src/backend/core';
import type {CoreRequest} from '../src/backend/core';
import {toCountryCode} from '../src/backend/countries';
import {LocalValidationError, NotConfiguredError} from '../src/data/types';

/** Doublure de transport : enregistre chaque appel et renvoie une réponse au format du Core API. */
type Call = {url: string; method: string; headers: Record<string, string>; body: any};
function harness(routes: Record<string, unknown>) {
  const calls: Call[] = [];
  const fetcher: typeof fetch = async (input, init) => {
    const url = new URL(String(input));
    const call = {url: url.pathname + url.search, method: init?.method ?? 'GET', headers: (init?.headers ?? {}) as Record<string, string>, body: init?.body ? JSON.parse(String(init.body)) : undefined};
    calls.push(call);
    const key = `${call.method} ${url.pathname}`;
    if (!(key in routes)) return new Response(JSON.stringify({success: false, error: {code: 'NOT_FOUND'}}), {status: 404});
    return new Response(JSON.stringify({success: true, data: routes[key], meta: {correlation_id: 'x', ...(routes[`META ${url.pathname}`] as object ?? {})}}), {status: 200});
  };
  const request = apiClient('https://api.example.test', async () => 'jwt-test', fetcher) as CoreRequest;
  return {calls, request};
}
let n = 0;
const key = () => `test-key-${++n}`;

test('pays : codes ISO et noms des cinq pays desservis ; « Congo » seul est refusé (ambigu)', () => {
  assert.equal(toCountryCode('CA'), 'CA');
  assert.equal(toCountryCode(' chine '), 'CN');
  assert.equal(toCountryCode('RDC'), 'CD');
  assert.equal(toCountryCode('République démocratique du Congo'), 'CD');
  assert.equal(toCountryCode('Congo-Brazzaville'), 'CG');
  assert.equal(toCountryCode('Cameroun'), 'CM');
  assert.equal(toCountryCode('Congo'), null);
  assert.equal(toCountryCode('France'), null);
  assert.equal(toCountryCode('__proto__'), null);
});

test('enveloppe : seule une réponse { success: true, data } est acceptée', () => {
  const parse = envelope(d => d);
  assert.equal(parse({success: true, data: 1}), 1);
  assert.throws(() => parse({success: false, data: 1}));
  assert.throws(() => parse([1]));
});

test('colis : liste paginée sur /api/v1/me/parcels avec jeton Bearer', async () => {
  const {calls, request} = harness({
    'GET /api/v1/me/parcels': [{id: 'p1', reference: 'TA-ABC123', status: 'in_transit', status_label: 'En transit', origin_country: 'CN', destination_country: 'CD', updated_at: '2026-11-20T10:00:00Z'}],
    'META /api/v1/me/parcels': {pagination: {page: 1, limit: 20, total: 25, pages: 2}},
  });
  const page = await parcelsService(request).list({cursor: null, signal: new AbortController().signal});
  assert.equal(calls[0].url, '/api/v1/me/parcels?page=1&limit=20');
  assert.equal(calls[0].headers.Authorization, 'Bearer jwt-test');
  assert.deepEqual(page.items[0], {id: 'p1', reference: 'TA-ABC123', statusLabel: 'En transit', origin: 'CN', destination: 'CD', updatedAt: '2026-11-20T10:00:00Z'});
  assert.equal(page.nextCursor, '2');
});

test('suivi : statut du colis et vol restent distincts ; dernière position = scan, jamais de GPS', async () => {
  const {request} = harness({'GET /api/v1/me/parcels/p1/tracking': {
    parcel: {reference: 'TA-ABC123', status: 'dispatched', status_label: 'Expédié', origin_country: 'CN', destination_country: 'CD', updated_at: '2026-11-20T10:00:00Z'},
    package_tracking: {events: [{status: 'received', status_label: 'Reçu', occurred_at: '2026-11-18T09:00:00Z', location_text: 'Entrepôt Guangzhou', source: 'scan'}],
      last_confirmed_event: null, last_confirmed_position: {kind: 'scan', at: '2026-11-18T09:00:00Z', location: 'Entrepôt Guangzhou'}, last_update_at: '2026-11-20T10:00:00Z'},
    flight_tracking: {designator: 'ET607', airline: 'Ethiopian Airlines', status_label: 'Atterri', last_confirmed: {at: '2026-11-20T08:00:00Z'}, position: null},
  }});
  const d = await parcelsService(request).get({id: 'p1', signal: new AbortController().signal});
  assert.equal(d.statusLabel, 'Expédié');
  assert.equal(d.flight?.statusLabel, 'Atterri');
  assert.deepEqual(d.lastConfirmedLocation, {label: 'Entrepôt Guangzhou', observedAt: '2026-11-18T09:00:00Z', kind: 'scan'});
  assert.equal(d.events[0].sourceLabel, 'Scan');
});

test('rubriques : devis (version courante), notifications non lues, marquage lu ; agences non exposées aux clients', async () => {
  const {calls, request} = harness({
    'GET /api/v1/me/quotes/q1': {id: 'q1', reference: 'QT-000001', origin_country: 'CN', destination_country: 'CD', current_version: 2, versions: [
      {version: 1, status: 'superseded', total: '30.00', currency: 'USD', lines: []},
      {version: 2, status: 'issued', total: '38.60', currency: 'USD', valid_until: '2026-12-04T00:00:00Z', lines: [{designation: 'Transport', amount: '33.60', currency: 'USD'}]}]},
    'GET /api/v1/me/notifications': [{id: 'n1', title: 'Vol publié', body: 'Votre expédition…', read_at: null, created_at: '2026-11-20T10:00:00Z'}],
    'POST /api/v1/me/notifications/n1/read': {id: 'n1', read: true},
  });
  const records = recordsService(request);
  const signal = new AbortController().signal;
  const q = await records.get('quotes', 'q1', {signal});
  assert.equal(q.status, 'Émis');
  assert.ok(q.fields.some(f => f.label === 'Total' && f.value === '38.60 USD'));
  assert.ok(q.fields.some(f => f.label === 'Transport' && f.value === '33.60 USD'));
  const notifs = await records.list('notifications', {cursor: null, signal});
  assert.equal(notifs.items[0].unread, true);
  await records.markNotificationRead('n1', {signal});
  assert.equal(calls.at(-1)?.method, 'POST');
  await assert.rejects(() => records.list('agencies', {cursor: null, signal}), (e: unknown) => e instanceof ApiError && e.code === 'forbidden');
});

test('demande : pays convertis, destinataire conservé dans le message, clé d’idempotence transmise', async () => {
  const {calls, request} = harness({'POST /api/v1/me/requests': {id: 'r1', reference: 'REQ-AB12CD34', status: 'new'}});
  const ports = corePorts(request, key);
  const r = await ports.createRequest({origin: 'Chine', destination: 'RDC', description: 'Vêtements', weightKg: '4,5', recipientName: 'Grace M.', recipientPhone: '+243810000000'});
  assert.equal(r.reference, 'REQ-AB12CD34');
  assert.deepEqual(calls[0].body, {origin_country: 'CN', destination_country: 'CD', shipment_type: 'parcel', estimated_weight_kg: 4.5, message: 'Vêtements\nDestinataire : Grace M. (+243810000000)'});
  assert.match(calls[0].headers['Idempotency-Key'], /^test-key-\d+$/);
});

test('demande avec pays ambigu : refus local AVANT tout envoi (rien n’est enregistré)', async () => {
  const {calls, request} = harness({});
  await assert.rejects(() => corePorts(request, key).createRequest({origin: 'Congo', destination: 'Canada', description: 'x', weightKg: '', recipientName: 'y', recipientPhone: ''}),
    (e: unknown) => e instanceof LocalValidationError);
  assert.equal(calls.length, 0);
});

test('devis : la décision porte sur la version courante lue à l’instant ; acceptation explicite et idempotente', async () => {
  const {calls, request} = harness({
    'GET /api/v1/me/quotes/q1': {id: 'q1', reference: 'QT-1', current_version: 3, versions: []},
    'POST /api/v1/me/quotes/q1/versions/3/accept': {status: 'accepted'},
    'POST /api/v1/me/quotes/q1/versions/3/reject': {status: 'rejected'},
  });
  const ports = corePorts(request, key);
  await ports.decideQuote({id: 'q1', decision: 'accept'});
  assert.equal(calls[1].url, '/api/v1/me/quotes/q1/versions/3/accept');
  assert.deepEqual(calls[1].body, {accept_conditions: true});
  assert.ok(calls[1].headers['Idempotency-Key']);
  await ports.decideQuote({id: 'q1', decision: 'refuse'});
  assert.equal(calls[3].url, '/api/v1/me/quotes/q1/versions/3/reject');
});

test('réception terrain : recherche par référence puis transition « received » ; l’état constaté reste un commentaire', async () => {
  const {calls, request} = harness({
    'GET /api/v1/canada/parcels/by-reference/TA-ABC123': {id: 'p9', status: 'expected', events: []},
    'POST /api/v1/canada/parcels/p9/transitions': {id: 'p9', status: 'received'},
  });
  await corePorts(request, key).receiveParcel({reference: 'ta-abc123', condition: 'damaged', note: 'Carton enfoncé'});
  assert.deepEqual(calls[1].body, {to_status: 'received', comment: 'État constaté : Endommagé. Carton enfoncé', source: 'scan'});
});

test('sans contrat Core API : paiement en ligne, transfert, preuve, incident et rubriques terrain non configurés (aucun appel)', async () => {
  const {calls, request} = harness({});
  const ports = corePorts(request, key);
  await assert.rejects(() => ports.startPayment({id: 'q1', method: 'card'}), (e: unknown) => e instanceof NotConfiguredError);
  await assert.rejects(() => ports.transferParcel({reference: 'x', target: 'y', note: ''}), (e: unknown) => e instanceof NotConfiguredError);
  await assert.rejects(() => ports.createIncident({reference: 'x', type: 'y', description: ''}), (e: unknown) => e instanceof NotConfiguredError);
  assert.equal(calls.length, 0);
  assert.equal(listLoader(request, 'tasks'), null);
  assert.equal(detailLoader(request, 'deliveries'), null);
});

test('vols du client : dérivés de ses expéditions (aucun accès à la liste interne des vols)', async () => {
  const {calls, request} = harness({'GET /api/v1/me/shipments': [{id: 's1', reference: 'SH-1', status: 'dispatched', flights: [
    {designator: 'ET607', flight_date: '2026-11-26', status: 'PUBLISHED', departure_airport: 'CAN', arrival_airport: 'FIH', leg_sequence: 1}]}]});
  const items = await listLoader(request, 'flights')!(new AbortController().signal);
  assert.equal(calls[0].url, '/api/v1/me/shipments');
  assert.deepEqual(items[0], {id: 's1:1', title: 'Vol ET607', subtitle: 'CAN → FIH · expédition SH-1', status: 'PUBLISHED', date: '2026-11-26'});
});

test('erreurs HTTP du Core API typées (403 hors périmètre, 401 session)', async () => {
  const request = apiClient('https://api.example.test', async () => 'jwt', async () => new Response('{}', {status: 403})) as CoreRequest;
  await assert.rejects(() => parcelsService(request).get({id: 'x', signal: new AbortController().signal}), (e: unknown) => e instanceof ApiError && e.code === 'forbidden');
});
