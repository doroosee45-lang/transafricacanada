const labels={registered:'Enregistré',preparing:'En préparation',transit:'En transit',customs:'Douane',arrived:'Arrivé',out_for_delivery:'En livraison',delivered:'Livré',returned:'Retourné',lost:'Perdu'};
const services={standard:'Standard',express:'Express',premium:'Premium'};
export function invoicePackages(payment){
 const byId=new Map();
 for(const item of [...(Array.isArray(payment.packages)?payment.packages:[]),payment.package].filter(Boolean)){
  const id=String(item._id||item);const prior=byId.get(id);
  if(!prior || (typeof item==='object'&&!item.missing&&(!prior.trackingNumber)))byId.set(id,item);
 }
 return [...byId].map(([id,p])=>{
  const missing=typeof p!=='object'||p.missing;
  const service=p.financial?.service||p.service;
  return {id,tracking:missing?`Colis introuvable (réf. ${id})`:p.trackingNumber||'Suivi non renseigné',
   route:missing?'Colis introuvable':`${p.origin||'Départ non renseigné'} → ${p.destination||'Destination non renseignée'}`,
   weight:missing?'Colis introuvable':p.weight!=null?`${p.weight} kg`:'Poids non renseigné',
   status:missing?'Colis introuvable':labels[p.status]||p.status||'Statut non renseigné',
   service:missing?'Colis introuvable':services[service]||service||'Service non renseigné',trackingNumber:missing?null:p.trackingNumber};
 });
}
// Lignes repliées et pagination : ne jamais tronquer un trajet ou une référence.
export function drawInvoicePackages(doc,rows,{y,m=18,W=210,H=297}){
 const widths=[40,49,23,32,30],titles=['N° Suivi','Trajet','Poids','Statut','Service'];
 const header=()=>{doc.setFont('helvetica','bold');doc.setFontSize(9);doc.text('COLIS CONCERNÉS',m,y+6);y+=10;let x=m;doc.setFontSize(8);titles.forEach((t,i)=>{doc.text(t,x+2,y+5);x+=widths[i];});y+=9;};
 header();
 for(const row of rows){
  doc.setFont('helvetica','normal');doc.setFontSize(8);
  const cells=[row.tracking,row.route.replace(' → ',' > '),row.weight,row.status,row.service].map((v,i)=>doc.splitTextToSize(v,widths[i]-4));
  const height=Math.max(...cells.map(c=>c.length))*4+5;
  if(y+height>H-20){doc.addPage();y=18;header();doc.setFont('helvetica','normal');doc.setFontSize(8);}
  let x=m;cells.forEach((c,i)=>{doc.text(c,x+2,y+5);x+=widths[i];});
  y+=height;doc.setDrawColor(233,225,213);doc.line(m,y,W-m,y);
 }
 return y+6;
}
