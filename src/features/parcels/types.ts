/** Modèles d'affichage internes, indépendants de la structure de l'API officielle. */
export type ParcelSummary={id:string;reference:string;statusLabel:string;origin?:string;destination?:string;updatedAt?:string};
export type TrackingEvent={id:string;label:string;occurredAt:string;locationLabel?:string;sourceLabel?:string;description?:string};
export type FlightInfo={number:string;airline?:string;statusLabel?:string;updatedAt?:string};
export type ParcelDetail=ParcelSummary & {events:TrackingEvent[];flight?:FlightInfo;lastConfirmedLocation?:{label:string;observedAt:string;kind:'gps'|'scan'|'confirmed_event'}};
export type Page<T>={items:T[];nextCursor:string|null};
/** À implémenter uniquement après validation OpenAPI et autorisations côté serveur. */
export interface ParcelsService {
 list(input:{cursor:string|null;signal:AbortSignal}):Promise<Page<ParcelSummary>>;
 get(input:{id:string;signal:AbortSignal}):Promise<ParcelDetail>;
}
