import type {QueueItem, QueueStore} from './types';

/** La file chiffrée (SQLCipher) n'existe que sur Android et iOS : sur le web, rien n'est stocké en clair. */
const unavailable = () => new Error('La file hors ligne chiffrée est disponible uniquement sur l’application mobile.');

export const queueStore: QueueStore & {enqueue: (userId: string, type: string, reference: string, payload: Record<string, unknown>) => Promise<QueueItem>} = {
  async enqueue() { throw unavailable(); },
  async list() { return []; },
  async setResult() { throw unavailable(); },
};
