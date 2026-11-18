import React, { useState } from 'react';
import { CURRENCIES } from '../../config/currencies';
// Décimales ISO de chaque devise, lues dans la configuration CENTRALE (GET /api/config/markets).
// Avant : table codée en dur {CAD, CDF, XAF, XOF} — EUR, TND et AED absents, donc tout devis au
// départ de la France, de la Tunisie ou de Dubaï faisait planter l'écran de création de colis.
// Repli (configuration non chargée) : décimales ISO 4217 connues du navigateur pour un code valide
// (TND 3, EUR 2, XAF 0…) ; un code invalide reste refusé (undefined → erreur explicite).
const isoDigits = (code) => {
  if (!/^[A-Z]{3}$/.test(code)) return undefined;
  try { return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: code }).resolvedOptions().maximumFractionDigits; }
  catch { return undefined; }
};
export const moneyDigits = new Proxy({}, {
  get: (_, code) => (typeof code === 'string' ? (CURRENCIES.find((c) => c.code === code)?.digits ?? isoDigits(code)) : undefined),
});
export const amountText = (minor, currency) => {
 const d=moneyDigits[currency];if(d===undefined||!Number.isSafeInteger(minor))throw new Error('Montant / devise non valide.');
 const n=BigInt(minor),scale=10n**BigInt(d),whole=n/scale;
 const fraction=d?','+(n%scale).toString().padStart(d,'0'):'';
 return `${new Intl.NumberFormat('fr-FR').format(whole)}${fraction} ${currency}`;
};
export function financialLines(f) {
 return [
  `Total expedition : ${amountText(f.totalMinor,f.referenceCurrency)}`,
  `Avance au depart : ${amountText(f.advanceMinor,f.referenceCurrency)}`,
  `Solde reference a la confirmation : ${amountText(f.remainingReferenceMinor,f.referenceCurrency)}`,
  `${f.lockedAt?'Taux fige':'Taux propose avant confirmation'} : 1 ${f.referenceCurrency} = ${f.rate} ${f.destinationCurrency}`,
  `Date de fixation : ${f.lockedAt ? new Date(f.lockedAt).toLocaleString('fr-FR') : 'A la confirmation'}`,
  `${f.lockedAt?'Solde destination fige':'Solde destination avant confirmation'} : ${amountText(f.destinationDueMinor,f.destinationCurrency)}`,
  `Encaisse a destination : ${amountText(f.destinationPaidMinor||0,f.destinationCurrency)}`,
  `Reste a encaisser a destination : ${amountText(f.destinationDueMinor-(f.destinationPaidMinor||0),f.destinationCurrency)}`,
  `Statut : ${{unpaid:'Non paye',partial:'Partiellement paye',paid:'Entierement paye'}[f.status]}`,
  ...(f.transactions||[]).map(t=>`${new Date(t.recordedAt).toLocaleString('fr-FR')} | ${t.kind} | ${amountText(t.amountMinor,t.currency)} | taux ${t.rate} | ${t.method}`),
 ];
}
// Facture téléchargeable : mise en page harmonisée avec la facture de paiement (shippingInvoicePdf).
export async function downloadFinancialInvoice(pkg) {
 const { buildShippingInvoicePdf } = await import('./shippingInvoicePdf');
 const pdf = await buildShippingInvoicePdf(pkg, amountText);
 pdf.save(`Facture-${pkg.trackingNumber||pkg._id}.pdf`);
 return pdf;
}
export default function FinancialSummary({financial:f,pkg,preview=false}) {
 // Encaissements : composant PackagePayments (fiche colis). Ici : prix figé et facture PDF.
 const [error,setError]=useState('');
 if(!f)return null;
 return <section aria-label="Tarification multidevise" style={{background:'#fff',border:'2px solid #c7983a',borderRadius:14,padding:20,margin:'16px 0',color:'#171614'}}>
  <h2 style={{fontWeight:800,fontSize:20}}>Prix d’expédition {preview?'— avant confirmation':''}</h2>
  <p style={{fontSize:26,fontWeight:800,margin:'12px 0'}}>{amountText(f.totalMinor,f.referenceCurrency)}</p>
  <p>Base : {amountText(f.baseMinor,f.referenceCurrency)} · Frais : {amountText(f.flatMinor,f.referenceCurrency)} · Assurance : {amountText(f.insuranceMinor,f.referenceCurrency)} · Ajustement au minimum : {amountText(f.minimumAdjustmentMinor||0,f.referenceCurrency)}</p>
  {/* Devis : détail avant confirmation. Colis confirmé : taux figé seulement — la situation des
      paiements (payé, reste, statut, historique) est dans la section « Paiements du colis »,
      calculée par le serveur à partir des paiements VALIDES. */}
  {(preview?financialLines(f).slice(1,6):financialLines(f).slice(3,5)).map((s,i)=><p key={i} style={{marginTop:6}}>{s}</p>)}
  {preview&&<p style={{marginTop:10}}>Le tarif et le taux seront vérifiés puis figés à la confirmation. Devis valable 15 minutes.</p>}
  {!preview&&<button type="button" onClick={()=>downloadFinancialInvoice(pkg).catch(e=>setError(e.message))} style={{padding:10,marginTop:14,border:'1px solid #a77b28',borderRadius:8}}>Télécharger la facture (PDF)</button>}
  {error&&<p role="alert" style={{color:'#b91c1c'}}>{error}</p>}
 </section>;
}
