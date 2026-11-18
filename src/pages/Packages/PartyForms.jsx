// Parties d'un colis — formulaires de l'étape « Personnes ».
//  - SelfSenderSection : expéditeur = CLIENT CONNECTÉ, prérempli depuis sa fiche / son compte
//    (nom et e-mail du compte, non modifiables ici ; téléphone, pays, ville, adresse complétables).
//  - ReceiverSection   : destinataire saisi MANUELLEMENT, toujours vierge à l'ouverture,
//    jamais recopié depuis l'expéditeur.
// Les règles (pays autorisés, téléphone par pays, e-mail) sont les mêmes que celles du serveur
// (backend/services/packageParties.js) ; le serveur reste l'autorité.
import React, { useEffect, useState } from 'react';
import { UserIcon, MapPinIcon } from '@heroicons/react/24/outline';
import axios from '../../api/axios';
import { MARKET_OPTIONS, countryOf } from '../../config/currencies';

const tk = { ink: '#171614', surface: '#faf8f5', border: '#e9e1d5', accent: '#a77b28', emerald: '#059669', textSec: '#4b5a6e', textMut: '#8494a9', red: '#dc2626' };
const inp = { width: '100%', padding: '10px 14px', borderRadius: 10, background: '#fff', color: tk.ink, fontSize: 14, border: `1.5px solid ${tk.border}`, outline: 'none', fontFamily: "'DM Sans',sans-serif", boxSizing: 'border-box' };
const inpErr = { ...inp, borderColor: tk.red, background: '#fff5f5' };
const ro = { ...inp, background: '#f8fafc', color: tk.textSec };

/** Pays proposés pour l'expéditeur, le destinataire et le trajet d'un colis (liste centrale). */
export const PARTY_COUNTRIES = MARKET_OPTIONS;

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

/** Même normalisation que le serveur : « +216 20123456 », ou null si invalide pour ce pays. */
export function normalizePhone(raw, countryKey) {
  const c = countryOf(countryKey);
  if (!c?.phone || typeof raw !== 'string') return null;
  let s = raw.replace(/[\s.()/-]/g, '');
  if (s.startsWith('00')) s = `+${s.slice(2)}`;
  const dial = c.phone.dialCode;
  let national = s;
  if (s.startsWith('+')) { if (!s.startsWith(dial)) return null; national = s.slice(dial.length); }
  national = national.replace(/^0/, '');
  if (!/^\d+$/.test(national) || !c.phone.nationalDigits.includes(national.length)) return null;
  return `${dial} ${national}`;
}

/** Erreurs par champ d'une personne (vide = valide). */
export function validatePerson(p, { requireName = true } = {}) {
  const e = {};
  if (requireName && !p.firstName?.trim()) e.firstName = 'Prénom requis';
  if (requireName && !p.lastName?.trim()) e.lastName = 'Nom requis';
  if (!PARTY_COUNTRIES.some((c) => c.value === p.country)) e.country = 'Pays requis';
  if (!p.phone?.trim()) e.phone = 'Téléphone requis';
  else if (p.country && !normalizePhone(p.phone, p.country)) {
    const c = countryOf(p.country);
    e.phone = `Numéro invalide pour ce pays (${c?.phone?.dialCode}, ${c?.phone?.nationalDigits?.join(' ou ')} chiffres)`;
  }
  if (p.email?.trim() && !EMAIL.test(p.email.trim())) e.email = 'Adresse e-mail invalide';
  if ((p.city || '').length > 100) e.city = '100 caractères maximum';
  if ((p.address || '').length > 300) e.address = '300 caractères maximum';
  return e;
}

export const EMPTY_PERSON = { firstName: '', lastName: '', phone: '', email: '', country: '', city: '', address: '' };

const Lbl = ({ children, req, htmlFor }) => (
  <label htmlFor={htmlFor} style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, marginBottom: 6, fontFamily: "'Open Sans',Arial,sans-serif" }}>
    {children}{req && <span style={{ color: tk.red }}> *</span>}
  </label>
);
const Err = ({ m }) => (m ? <p role="alert" style={{ fontSize: 11, color: tk.red, marginTop: 3 }}>{m}</p> : null);

const Head = ({ title, color, icon: Ic = UserIcon, children }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 30, height: 30, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
        <Ic style={{ width: 15, height: 15, color }} />
      </span>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>{title}</span>
    </div>
    {children}
  </div>
);

/** Champs d'adresse communs (pays, téléphone, e-mail, ville, adresse). */
function ContactFields({ id, value, onChange, errors, readOnlyEmail }) {
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.value });
  const c = countryOf(value.country);
  return (
    <>
      <div className="party-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <Lbl req htmlFor={`${id}-country`}>Pays</Lbl>
          <select id={`${id}-country`} value={value.country} onChange={set('country')} style={errors.country ? inpErr : inp}>
            <option value="">— Sélectionner —</option>
            {PARTY_COUNTRIES.map((o) => <option key={o.value} value={o.value}>{o.label}{o.prefix ? ` (${o.prefix})` : ''}</option>)}
          </select>
          <Err m={errors.country} />
        </div>
        <div>
          <Lbl req htmlFor={`${id}-phone`}>Téléphone</Lbl>
          <input id={`${id}-phone`} type="tel" value={value.phone} onChange={set('phone')} placeholder={c?.phone?.dialCode ? `${c.phone.dialCode} …` : 'Choisissez d\'abord le pays'} style={errors.phone ? inpErr : inp} />
          <Err m={errors.phone} />
        </div>
      </div>
      <div className="party-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div>
          <Lbl htmlFor={`${id}-email`}>E-mail</Lbl>
          <input id={`${id}-email`} type="email" value={value.email} onChange={set('email')} readOnly={readOnlyEmail} placeholder="email@exemple.com" style={readOnlyEmail ? ro : errors.email ? inpErr : inp} />
          <Err m={errors.email} />
        </div>
        <div>
          <Lbl htmlFor={`${id}-city`}>Ville</Lbl>
          <input id={`${id}-city`} type="text" value={value.city} onChange={set('city')} placeholder={c?.defaultCity || 'Ville'} style={errors.city ? inpErr : inp} />
          <Err m={errors.city} />
        </div>
      </div>
      <div>
        <Lbl htmlFor={`${id}-address`}>Adresse complète</Lbl>
        <input id={`${id}-address`} type="text" value={value.address} onChange={set('address')} placeholder="Rue, numéro, quartier, repère…" style={errors.address ? inpErr : inp} />
        <Err m={errors.address} />
      </div>
    </>
  );
}

/** Expéditeur = client connecté : préremplissage automatique depuis sa fiche ou son compte. */
export function SelfSenderSection({ value, onChange, errors }) {
  const [state, setState] = useState('loading'); // loading | ready | error
  useEffect(() => {
    let alive = true;
    axios.get('/clients/me')
      .then((r) => {
        if (!alive) return;
        const { client, account } = r.data?.data || {};
        // Nom et e-mail : ceux du COMPTE (le serveur impose la même règle).
        onChange({
          ...EMPTY_PERSON,
          firstName: account?.firstName || '', lastName: account?.lastName || '', email: account?.email || '',
          phone: client?.phone || account?.phone || '', country: client?.country || '',
          city: client?.city || '', address: client?.address || '',
        });
        setState('ready');
      })
      .catch(() => alive && setState('error'));
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div data-testid="self-sender" style={{ border: `1.5px solid ${tk.accent}55`, borderRadius: 16, overflow: 'hidden' }}>
      <Head title="Expéditeur — vous" color={tk.accent} />
      <div style={{ padding: 18, background: '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {state === 'loading' && <p style={{ fontSize: 13, color: tk.textMut }}>Chargement de votre profil…</p>}
        {state === 'error' && <p role="alert" style={{ fontSize: 13, color: tk.red }}>Impossible de charger votre profil. Rechargez la page.</p>}
        {state === 'ready' && (
          <>
            <p style={{ fontSize: 12, color: tk.textSec }}>Informations reprises de votre compte. Complétez ou corrigez vos coordonnées si nécessaire : elles seront enregistrées dans votre profil expéditeur.</p>
            <div className="party-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div><Lbl>Prénom</Lbl><input value={value.firstName} readOnly style={ro} aria-label="Prénom de l'expéditeur" /></div>
              <div><Lbl>Nom</Lbl><input value={value.lastName} readOnly style={ro} aria-label="Nom de l'expéditeur" /></div>
            </div>
            <ContactFields id="sender" value={value} onChange={onChange} errors={errors} readOnlyEmail />
          </>
        )}
      </div>
    </div>
  );
}

/** Destinataire : saisie manuelle, indépendante de l'expéditeur. */
export function ReceiverSection({ value, onChange, errors }) {
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.value });
  return (
    <div data-testid="receiver-form" style={{ border: `1.5px solid ${tk.emerald}55`, borderRadius: 16, overflow: 'hidden' }}>
      <Head title="Destinataire — récupère le colis" color={tk.emerald} icon={MapPinIcon} />
      <div style={{ padding: 18, background: '#fff', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="party-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <Lbl req htmlFor="receiver-firstName">Prénom</Lbl>
            <input id="receiver-firstName" value={value.firstName} onChange={set('firstName')} style={errors.firstName ? inpErr : inp} />
            <Err m={errors.firstName} />
          </div>
          <div>
            <Lbl req htmlFor="receiver-lastName">Nom</Lbl>
            <input id="receiver-lastName" value={value.lastName} onChange={set('lastName')} style={errors.lastName ? inpErr : inp} />
            <Err m={errors.lastName} />
          </div>
        </div>
        <ContactFields id="receiver" value={value} onChange={onChange} errors={errors} />
      </div>
    </div>
  );
}
