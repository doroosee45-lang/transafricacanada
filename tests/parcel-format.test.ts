import {test} from 'node:test';import assert from 'node:assert/strict';
import {formatDate,sortEvents,trackingView} from '../src/features/parcels/format';
import type {TrackingEvent} from '../src/features/parcels/types';
test('dates absentes ou invalides jamais inventées',()=>{assert.equal(formatDate(), 'Date indisponible');assert.equal(formatDate('invalid'), 'Date indisponible');});
test('événements triés sans mutation et dates invalides à la fin',()=>{const events:TrackingEvent[]=[{id:'1',label:'a',occurredAt:'bad'},{id:'2',label:'b',occurredAt:'2026-01-01T00:00:00Z'},{id:'3',label:'c',occurredAt:'2026-01-02T00:00:00Z'}];assert.deepEqual(sortEvents(events).map(v=>v.id),['3','2','1']);assert.equal(events[0].id,'1');});
test('un vol arrivé ne modifie jamais le statut du colis',()=>{const result=trackingView({id:'a',reference:'r',statusLabel:'En transit',flight:{number:'AB1',statusLabel:'Atterri'},events:[]});assert.equal(result.parcelStatus,'En transit');assert.equal(result.flightStatus,'Atterri');});
