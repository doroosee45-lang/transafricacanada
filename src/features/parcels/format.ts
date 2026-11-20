import type {ParcelDetail,TrackingEvent} from './types';
export function formatDate(value?:string):string {
 if(!value)return 'Date indisponible';
 const d=new Date(value);return Number.isNaN(d.getTime())?'Date indisponible':d.toLocaleString('fr-FR',{dateStyle:'medium',timeStyle:'short'});
}
export function sortEvents(events:TrackingEvent[]):TrackingEvent[]{
 return [...events].sort((a,b)=>{const aa=Date.parse(a.occurredAt),bb=Date.parse(b.occurredAt);if(Number.isNaN(aa))return Number.isNaN(bb)?0:1;if(Number.isNaN(bb))return -1;return bb-aa;});
}
/** Flight information never changes the parcel status; both are displayed independently. */
export function trackingView(detail:ParcelDetail){return {parcelStatus:detail.statusLabel, flightStatus:detail.flight?.statusLabel, events:sortEvents(detail.events)};}
