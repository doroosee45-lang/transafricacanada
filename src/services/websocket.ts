import { io, type Socket, type ManagerOptions, type SocketOptions } from 'socket.io-client';

export type SocketFactory = (url: string, opts?: Partial<ManagerOptions & SocketOptions>) => Socket;
/** Écouteur d'un événement relayé ; le type de la charge utile est fixé par l'abonné. */
export type WsListener<T = unknown> = (data: T) => void;

interface JoinAck { ok?: boolean }

// Événements serveur relayés aux composants abonnés via on()/off().
// (Liste inchangée par rapport à la version précédente.)
const RELAYED_EVENTS = ['notification', 'notifications_sync', 'tracking_update', 'dashboard_update'];

/**
 * Client Socket.IO unique de l'application.
 *
 * Sécurité : le serveur décide seul des abonnements autorisés (voir backend
 * services/realtimeAccess.js). Ce service se contente de :
 *  - présenter le jeton COURANT à chaque (re)connexion (fonction `auth`) ;
 *  - réémettre ses demandes d'abonnement après chaque reconnexion (le serveur les revalide) ;
 *  - oublier un abonnement refusé par le serveur ;
 *  - être réinitialisé à la connexion/déconnexion de l'utilisateur (reset), pour qu'aucune
 *    connexion ne survive avec l'identité précédente.
 */
class WebSocketService {
  factory: SocketFactory;
  socket: Socket | null;
  listeners: Map<string, WsListener[]>;
  rooms: Set<string>;

  constructor(factory: SocketFactory = io) {
    this.factory = factory;
    this.socket = null;
    this.listeners = new Map();
    this.rooms = new Set();
  }

  connect() {
    if (this.socket) {
      // Déjà créé : relancer seulement s'il n'est ni connecté ni en reconnexion automatique.
      if (!this.socket.connected && !this.socket.active) this.socket.connect();
      return;
    }

    this.socket = this.factory(import.meta.env.VITE_WS_URL || 'http://localhost:5000', {
      // Lu à chaque tentative : une reconnexion utilise toujours le jeton actuel.
      auth: (cb: (data: object) => void) => cb({ token: localStorage.getItem('token') || undefined }),
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      // Les rooms sont perdues à chaque reconnexion : redemander (le serveur réautorise).
      this.rooms.forEach((room) => this.requestJoin(room));
      // Signal interne : les écrans rechargent ce qu'ils ont pu manquer (ex. notifications).
      this.emit('connected');
    });

    this.socket.on('disconnect', (reason: Socket.DisconnectReason) => {
      // Déconnexion forcée par le serveur (jeton expiré, droits modifiés) : le client
      // Socket.IO ne se reconnecte pas seul dans ce cas. On se reconnecte pour être réévalué.
      if (reason === 'io server disconnect' && this.socket) this.socket.connect();
    });

    this.socket.on('connect_error', (err: Error) => {
      console.warn('[WS] erreur connexion:', err.message);
    });

    const socket = this.socket;
    RELAYED_EVENTS.forEach((event) => {
      socket.on(event, (data: unknown) => this.emit(event, data));
    });
  }

  requestJoin(room: string) {
    this.socket?.emit('join_room', room, (res?: JoinAck) => {
      if (res && res.ok === false) {
        // Refus serveur (non authentifié, rôle insuffisant, colis hors périmètre) : abandon.
        this.rooms.delete(room);
        console.warn(`[WS] abonnement refusé : ${room}`);
      }
    });
  }

  // Demande d'abonnement à une room (mémorisée pour être rejouée après reconnexion).
  joinRoom(room: string) {
    this.rooms.add(room);
    if (this.socket?.connected) this.requestJoin(room);
  }

  leaveRoom(room: string) {
    this.rooms.delete(room);
    if (this.socket?.connected) this.socket.emit('leave_room', room);
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Changement d'identité (connexion, inscription, déconnexion) : aucune connexion ni
  // abonnement ne survit. Les écouteurs des composants sont conservés.
  reset() {
    this.rooms.clear();
    this.disconnect();
  }

  on<T = unknown>(event: string, callback: WsListener<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback as WsListener);
  }

  off<T = unknown>(event: string, callback: WsListener<T>) {
    if (this.listeners.has(event)) {
      const callbacks = (this.listeners.get(event) ?? []).filter(cb => cb !== callback);
      this.listeners.set(event, callbacks);
    }
  }

  emit(event: string, data?: unknown) {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.forEach(callback => callback(data));
    }
  }

  sendMessage(event: string, data?: unknown) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

const webSocketService = new WebSocketService();
export { WebSocketService };
export default webSocketService;
