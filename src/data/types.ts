/** Types partagés des écrans et de l'adaptateur Core API (sans dépendance React). */
export type Item = {id: string; title: string; subtitle?: string; status?: string; date?: string};
export type Detail = Item & {fields: {label: string; value: string}[]; quoteId?: string};
export type ListKey = 'requests' | 'quotes' | 'payments' | 'flights' | 'tickets' | 'addresses' | 'tasks' | 'deliveries' | 'incidents';
export type ListState = {items: Item[]; loading: boolean; error: string | null; configured: boolean};
export type DetailState = {detail: Detail | null; loading: boolean; error: string | null; configured: boolean};

export class NotConfiguredError extends Error {
  constructor() {
    super('NOT_CONFIGURED');
  }
}

/** Saisie refusée AVANT tout envoi (ex. pays non desservi) : message destiné à l'utilisateur. */
export class LocalValidationError extends Error {}

export type RequestDraft = {origin: string; destination: string; description: string; weightKg: string; recipientName: string; recipientPhone: string};
export type Point = {x: number; y: number};

type Port<A, R = void> = (input: A) => Promise<R>;
export type Ports = {
  createRequest: Port<RequestDraft, {reference: string}>;
  decideQuote: Port<{id: string; decision: 'accept' | 'refuse'}>;
  startPayment: Port<{id: string; method: string}, {paymentId: string}>;
  createTicket: Port<{subject: string; category: string; message: string; reference: string}, {id: string}>;
  updateProfile: Port<{name: string; phone: string}>;
  saveAddress: Port<{label: string; recipient: string; phone: string; line: string; city: string; country: string}>;
  lookupLocation: Port<{reference: string}, {description: string}>;
  receiveParcel: Port<{reference: string; condition: string; note: string}>;
  transferParcel: Port<{reference: string; target: string; note: string}>;
  submitProof: Port<{deliveryId: string; recipient: string; signature: Point[][]; photoUri: string}>;
  createIncident: Port<{reference: string; type: string; description: string}>;
};
