import type { jsPDF } from 'jspdf';

const labels: Record<string, string> = {registered:'Enregistré',preparing:'En préparation',transit:'En transit',customs:'Douane',arrived:'Arrivé',out_for_delivery:'En livraison',delivered:'Livré',returned:'Retourné',lost:'Perdu'};
const services: Record<string, string> = {standard:'Standard',express:'Express',premium:'Premium'};

/** Colis tel qu'il peut apparaître dans une facture (peuplé, ou simple identifiant). */
export interface InvoicePackageRef {
  _id?: string;
  missing?: boolean;
  trackingNumber?: string;
  origin?: string;
  destination?: string;
  weight?: number | null;
  status?: string;
  service?: string;
  financial?: { service?: string } | null;
}

export interface InvoicePackageSource {
  packages?: Array<InvoicePackageRef | string> | null;
  package?: InvoicePackageRef | string | null;
}

export interface InvoicePackageRow {
  id: string;
  tracking: string;
  route: string;
  weight: string;
  status: string;
  service: string;
  trackingNumber: string | null | undefined;
}

export function invoicePackages(payment: InvoicePackageSource): InvoicePackageRow[] {
 const byId=new Map<string, InvoicePackageRef | string>();
 const items=[...(Array.isArray(payment.packages)?payment.packages:[]),payment.package].filter((x): x is InvoicePackageRef | string => Boolean(x));
 for(const item of items){
  const id=String(typeof item==='object'?item._id||item:item);const prior=byId.get(id);
  if(!prior || (typeof item==='object'&&!item.missing&&(!(typeof prior==='object'&&prior.trackingNumber))))byId.set(id,item);
 }
 return [...byId].map(([id,p])=>{
  if(typeof p!=='object'||p.missing){
   return {id,tracking:`Colis introuvable (réf. ${id})`,route:'Colis introuvable',weight:'Colis introuvable',status:'Colis introuvable',service:'Colis introuvable',trackingNumber:null};
  }
  const service=p.financial?.service||p.service;
  return {id,tracking:p.trackingNumber||'Suivi non renseigné',
   route:`${p.origin||'Départ non renseigné'} → ${p.destination||'Destination non renseignée'}`,
   weight:p.weight!=null?`${p.weight} kg`:'Poids non renseigné',
   status:(p.status&&labels[p.status])||p.status||'Statut non renseigné',
   service:(service&&services[service])||service||'Service non renseigné',trackingNumber:p.trackingNumber};
 });
}

interface DrawOptions { y: number; m?: number; W?: number; H?: number }

// Lignes repliées et pagination : ne jamais tronquer un trajet ou une référence.
export function drawInvoicePackages(doc: jsPDF, rows: InvoicePackageRow[], {y,m=18,W=210,H=297}: DrawOptions): number {
 const widths=[40,49,23,32,30],titles=['N° Suivi','Trajet','Poids','Statut','Service'];
 const header=()=>{doc.setFont('helvetica','bold');doc.setFontSize(9);doc.text('COLIS CONCERNÉS',m,y+6);y+=10;let x=m;doc.setFontSize(8);titles.forEach((t,i)=>{doc.text(t,x+2,y+5);x+=widths[i];});y+=9;};
 header();
 for(const row of rows){
  doc.setFont('helvetica','normal');doc.setFontSize(8);
  const cells: string[][]=[row.tracking,row.route.replace(' → ',' > '),row.weight,row.status,row.service].map((v,i)=>doc.splitTextToSize(v,widths[i]-4));
  const height=Math.max(...cells.map(c=>c.length))*4+5;
  if(y+height>H-20){doc.addPage();y=18;header();doc.setFont('helvetica','normal');doc.setFontSize(8);}
  let x=m;cells.forEach((c,i)=>{doc.text(c,x+2,y+5);x+=widths[i];});
  y+=height;doc.setDrawColor(233,225,213);doc.line(m,y,W-m,y);
 }
 return y+6;
}
