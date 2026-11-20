/** Modèles d'interface : ils ne constituent ni des schémas API ni des données serveur. */
export type RecordKind='shipments'|'quotes'|'payments'|'notifications'|'agencies';
export type RecordField={label:string;value:string};
export type RecordEvent={id:string;label:string;occurredAt?:string;description?:string};
export type RecordSummary={id:string;title:string;subtitle?:string;status?:string;updatedAt?:string;unread?:boolean};
export type RecordDetail=RecordSummary & {fields:RecordField[];events?:RecordEvent[];notice?:string};
export type RecordPage={items:RecordSummary[];nextCursor:string|null};
/** Adapter les données du Core API aux modèles ci-dessus après validation OpenAPI. */
export interface RecordsService {
 list(kind:RecordKind,options:{cursor:string|null;signal:AbortSignal}):Promise<RecordPage>;
 get(kind:RecordKind,id:string,options:{signal:AbortSignal}):Promise<RecordDetail>;
 markNotificationRead(id:string,options:{signal:AbortSignal}):Promise<void>;
}
export const recordKinds:Record<RecordKind,{title:string;description:string;empty:string}>= {
 shipments:{title:'Expéditions',description:'Consultez le parcours et les étapes de vos expéditions.',empty:'Aucune expédition à afficher.'},
 quotes:{title:'Devis et factures',description:'Consultez vos documents et leurs conditions.',empty:'Aucun document à afficher.'},
 payments:{title:'Paiements',description:'Consultez les informations confirmées par le service financier.',empty:'Aucun paiement à afficher.'},
 notifications:{title:'Notifications',description:'Retrouvez les informations relatives à vos opérations.',empty:'Aucune notification à afficher.'},
 agencies:{title:'Agences',description:'Retrouvez les coordonnées et les horaires des agences.',empty:'Aucune agence à afficher.'}
};
export function isRecordKind(value:unknown):value is RecordKind{return typeof value==='string'&&Object.hasOwn(recordKinds,value);}
export function uniqueRecords(existing:RecordSummary[],incoming:RecordSummary[]):RecordSummary[]{const map=new Map(existing.map(i=>[i.id,i]));for(const item of incoming)if(!map.has(item.id))map.set(item.id,item);return [...map.values()];}
