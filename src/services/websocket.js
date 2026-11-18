import { io } from 'socket.io-client';

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
  constructor(factory = io) {
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
      auth: (cb) => cb({ token: localStorage.getItem('token') || undefined }),
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

    this.socket.on('disconnect', (reason) => {
      // Déconnexion forcée par le serveur (jeton expiré, droits modifiés) : le client
      // Socket.IO ne se reconnecte pas seul dans ce cas. On se reconnecte pour être réévalué.
      if (reason === 'io server disconnect' && this.socket) this.socket.connect();
    });

    this.socket.on('connect_error', (err) => {
      console.warn('[WS] erreur connexion:', err.message);
    });

    RELAYED_EVENTS.forEach((event) => {
      this.socket.on(event, (data) => this.emit(event, data));
    });
  }

  requestJoin(room) {
    this.socket.emit('join_room', room, (res) => {
      if (res && res.ok === false) {
        // Refus serveur (non authentifié, rôle insuffisant, colis hors périmètre) : abandon.
        this.rooms.delete(room);
        console.warn(`[WS] abonnement refusé : ${room}`);
      }
    });
  }

  // Demande d'abonnement à une room (mémorisée pour être rejouée après reconnexion).
  joinRoom(room) {
    this.rooms.add(room);
    if (this.socket?.connected) this.requestJoin(room);
  }

  leaveRoom(room) {
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

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event).filter(cb => cb !== callback);
      this.listeners.set(event, callbacks);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  sendMessage(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }
}

const webSocketService = new WebSocketService();
export { WebSocketService };
export default webSocketService;
