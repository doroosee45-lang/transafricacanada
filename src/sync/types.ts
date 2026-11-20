/** A local record is not proof that an operation was accepted by the server. */
export type QueueStatus = 'pending' | 'accepted' | 'rejected' | 'conflict';
export type QueueItem = {
  id: string; userId: string; type: string; reference: string;
  createdAt: string; idempotencyKey: string; status: QueueStatus;
  // Only the validated minimum required for the operation. Never include tokens or passwords.
  payload: Record<string, unknown>; serverMessage?: string;
};
export type ServerResult = {kind:'accepted'} | {kind:'rejected'|'conflict'; message:string} | {kind:'retry'};
export interface QueueStore {
  list(userId: string): Promise<QueueItem[]>;
  setResult(id: string, userId: string, status: QueueStatus, message?: string): Promise<void>;
}
export type SendOperation = (item: QueueItem) => Promise<ServerResult>;
