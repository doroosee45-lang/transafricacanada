import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WebSocketService } from './websocket';

// Faux client Socket.IO : enregistre les émissions et permet de déclencher les événements.
function fakeFactory() {
  const created = [];
  const factory = (url, options) => {
    const handlers = {};
    const socket = {
      options, connected: false, active: true, emitted: [], connectCalls: 0,
      on: (event, cb) => { (handlers[event] ||= []).push(cb); },
      emit: (...args) => socket.emitted.push(args),
      fire: (event, ...args) => (handlers[event] || []).forEach((cb) => cb(...args)),
      connect: () => { socket.connectCalls += 1; },
      disconnect: vi.fn(),
      removeAllListeners: vi.fn(),
    };
    created.push(socket);
    return socket;
  };
  return { factory, created };
}

// Stockage explicite : sous Node ≥ 25, le `localStorage` global de Node (non configuré)
// masque celui de jsdom et vaut undefined. Le service lit le global `localStorage`.
beforeEach(() => {
  const store = new Map();
  vi.stubGlobal('localStorage', {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  });
});

describe('WebSocketService', () => {
  it('présente le jeton COURANT à chaque (re)connexion', () => {
    const { factory, created } = fakeFactory();
    const service = new WebSocketService(factory);
    localStorage.setItem('token', 'jeton-1');
    service.connect();
    const readAuth = () => new Promise((resolve) => created[0].options.auth(resolve));
    return readAuth().then((first) => {
      expect(first).toEqual({ token: 'jeton-1' });
      localStorage.setItem('token', 'jeton-2');
      return readAuth();
    }).then((second) => expect(second).toEqual({ token: 'jeton-2' }));
  });

  it('ne crée pas de seconde connexion pendant une connexion en cours', () => {
    const { factory, created } = fakeFactory();
    const service = new WebSocketService(factory);
    service.connect();
    service.connect();
    expect(created).toHaveLength(1);
  });

  it('rejoue les abonnements après reconnexion (le serveur les réautorise)', () => {
    const { factory, created } = fakeFactory();
    const service = new WebSocketService(factory);
    service.connect();
    service.joinRoom('tracking_LGT-1A2B3C4D');
    expect(created[0].emitted).toHaveLength(0); // pas encore connecté
    created[0].connected = true;
    created[0].fire('connect');
    created[0].fire('connect'); // reconnexion
    const joins = created[0].emitted.filter(([event]) => event === 'join_room');
    expect(joins.map(([, room]) => room)).toEqual(['tracking_LGT-1A2B3C4D', 'tracking_LGT-1A2B3C4D']);
  });

  it('oublie un abonnement refusé par le serveur', () => {
    const { factory, created } = fakeFactory();
    const service = new WebSocketService(factory);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    service.connect();
    created[0].connected = true;
    service.joinRoom('dashboard_admin');
    const [, , ack] = created[0].emitted[0];
    ack({ ok: false, error: 'Abonnement refusé.' });
    created[0].fire('connect');
    expect(created[0].emitted.filter(([e]) => e === 'join_room')).toHaveLength(1);
  });

  it('se reconnecte après une déconnexion imposée par le serveur', () => {
    const { factory, created } = fakeFactory();
    const service = new WebSocketService(factory);
    service.connect();
    created[0].fire('disconnect', 'io server disconnect');
    expect(created[0].connectCalls).toBe(1);
    created[0].fire('disconnect', 'transport close'); // reconnexion automatique de socket.io
    expect(created[0].connectCalls).toBe(1);
  });

  it('reset() ferme la connexion et efface les abonnements (changement d’identité)', () => {
    const { factory, created } = fakeFactory();
    const service = new WebSocketService(factory);
    service.connect();
    service.joinRoom('dashboard_admin');
    service.reset();
    expect(created[0].disconnect).toHaveBeenCalled();
    service.connect();
    expect(created).toHaveLength(2);
    created[1].connected = true;
    created[1].fire('connect');
    expect(created[1].emitted).toHaveLength(0); // aucun ancien abonnement rejoué
  });

  it('leaveRoom retire la room des abonnements rejoués', () => {
    const { factory, created } = fakeFactory();
    const service = new WebSocketService(factory);
    service.connect();
    service.joinRoom('tracking_LGT-AAAA0001');
    service.leaveRoom('tracking_LGT-AAAA0001');
    created[0].connected = true;
    created[0].fire('connect');
    expect(created[0].emitted.filter(([e]) => e === 'join_room')).toHaveLength(0);
  });
});
