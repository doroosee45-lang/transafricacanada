import React,{useState,useEffect} from 'react';
import axios from '../../api/axios';
import {COUNTRY_OPTIONS,CURRENCIES,getCurrency} from '../../config/currencies';
export default function ShippingPricing(){
 const [config,setConfig]=useState({tariffs:[],rates:[]});const [error,setError]=useState('');const [message,setMessage]=useState('');
 const load=()=>axios.get('/shipping-finance/configuration').then(r=>setConfig(r.data)).catch(e=>setError(e.response?.data?.message||e.message));useEffect(()=>{load();},[]);
 const [origin,setOrigin]=useState(COUNTRY_OPTIONS[0]?.value||'');
 const publish=async(e,path)=>{e.preventDefault();setError('');setMessage('');const form=e.currentTarget;const data=Object.fromEntries(new FormData(form));try{await axios.post('/shipping-finance/'+path,data);setMessage('Nouvelle version publiée. Les colis déjà confirmés restent inchangés.');load();}catch(e){setError(e.response?.data?.message||e.message);}};
 const country=(name,onChange)=><select name={name} required onChange={onChange}>{COUNTRY_OPTIONS.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}</select>;
 // Devises opérationnelles issues de la configuration centrale (avant : liste en dur sans TND/AED/EUR).
 const currencies=CURRENCIES.filter(c=>!c.legacyOnly).map(c=>c.code);
 return <div style={{padding:24,maxWidth:1100,margin:'auto'}}><h1 style={{fontSize:26,fontWeight:800}}>Tarifs & taux d’expédition</h1>
 <p>Aucun tarif par défaut. Chaque publication crée une version historique. Les valeurs sont exprimées dans la devise de départ. Taux direct : 1 unité de départ = taux × unité de destination. Aucun taux inverse automatique.</p>
 {error&&<p role="alert" style={{color:'red'}}>{error}</p>}{message&&<p role="status">{message}</p>}
 <form onSubmit={e=>publish(e,'tariffs')} style={{display:'grid',gap:14,padding:20,border:'1px solid #ddd',marginTop:20}}>
  <h2>Publier un tarif</h2><label>Départ {country('origin',e=>setOrigin(e.target.value))}</label><label>Destination {country('destination')}</label>
  <label>Service <select name="service"><option value="standard">Standard</option><option value="express">Express</option><option value="premium">Premium</option></select></label>
  {['perKg','flatFee','minimum','insuranceFee'].map((k,i)=><label key={k}>{['Prix/kg','Frais fixes','Minimum de facturation','Assurance fixe si demandée'][i]} ({getCurrency(origin)?.code||'devise inconnue'}) <input name={k} type="text" inputMode="decimal" required placeholder="Valeur officielle (0 si aucun frais)" /></label>)}
  <button type="submit">Publier cette version du tarif</button>
 </form>
 <form onSubmit={e=>publish(e,'rates')} style={{display:'grid',gap:14,padding:20,border:'1px solid #ddd',marginTop:20}}><h2>Publier un taux de change</h2>
 {['from','to'].map((k,i)=><label key={k}>{i?'Devise de destination':'Devise de départ'} <select name={k}>{currencies.map(c=><option key={c}>{c}</option>)}</select></label>)}
 <label>Taux officiel direct <input name="rate" required inputMode="decimal" placeholder="Jusqu’à 12 décimales, séparateur point" /></label><button>Publier ce taux</button></form>
 <h2 style={{marginTop:20}}>Historique des tarifs</h2>{config.tariffs.map(t=><p key={t._id}>{t.origin} → {t.destination} · {t.service} · {t.perKg} {getCurrency(t.origin)?.code||''}/kg · frais {t.flatFee} · minimum {t.minimum} · assurance {t.insuranceFee} · {new Date(t.createdAt).toLocaleString('fr-FR')}</p>)}
 <h2>Historique des taux</h2>{config.rates.map(t=><p key={t._id}>1 {t.from} = {t.rate} {t.to} · {new Date(t.createdAt).toLocaleString('fr-FR')}</p>)}
 </div>;
}
