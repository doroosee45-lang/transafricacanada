import FinancialSummary, { amountText, financialLines, moneyDigits } from '../../components/Finance/FinancialSummary';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
// Règle métier : uniquement les 4 pays autorisés (liste centrale servie par l'API, cf. PartyForms).
import { MARKET_OPTIONS as COUNTRY_OPTIONS } from '../../config/currencies';
import { toast } from 'react-toastify';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from '../../api/axios';
import { formatAmount, packageCurrency } from '../../config/currencies';
import { useAuth } from '../../components/Context/AuthContext';
import { SelfSenderSection, ReceiverSection, validatePerson, normalizePhone, EMPTY_PERSON } from './PartyForms';

// Personnel (création pour le compte d'un client) : rôles autorisés à sélectionner un client.
const STAFF_ROLES = ['superadmin', 'admin', 'manager', 'agent'];
import {
  UserIcon, CubeIcon, MapPinIcon, TruckIcon,
  CheckCircleIcon, ArrowRightIcon, ArrowLeftIcon,
  SparklesIcon, PhotoIcon, CurrencyEuroIcon,
  ShareIcon, PrinterIcon,
  MagnifyingGlassIcon, PencilSquareIcon, XMarkIcon,
  ScaleIcon, DocumentTextIcon,
  BanknotesIcon, ClockIcon, PhoneIcon,
} from '@heroicons/react/24/outline';

/* ── Tokens ── */
const tk = {
  ink: '#171614', ink80: '#26231e',
  surface: '#faf8f5', surf2: '#f5efe6',
  border: '#e9e1d5',
  accent: '#a77b28', emerald: '#059669', amber: '#d97706',
  textSec: '#4b5a6e', textMut: '#8494a9', red: '#dc2626',
};

// Calculé à l'usage : la configuration des pays est chargée au démarrage, après l'import du module.
const isKnownCountry = (v) => COUNTRY_OPTIONS.some(c => c.value === v);
const PKG_TYPES    = [
  { value: 'document',      label: '📄 Document',       color: '#6366f1' },
  { value: 'clothing',      label: '👕 Vêtements',       color: '#ec4899' },
  { value: 'electronics',   label: '📱 Électronique',    color: '#c7983a' },
  { value: 'food',          label: '🍱 Alimentaire',     color: '#f59e0b' },
  { value: 'cosmetics',     label: '💄 Cosmétiques',     color: '#a855f7' },
  { value: 'fragile_item',  label: '🔮 Article fragile', color: '#ef4444' },
  { value: 'other',         label: '📦 Autre',           color: '#64748b' },
];
const PAY_METHODS  = [
  { value: 'cash',           label: '💵 Espèces' },
  { value: 'mobile_money',   label: '📱 Mobile Money' },
  { value: 'bank_transfer',  label: '🏦 Virement bancaire' },
  { value: 'other',          label: '🔄 Autre' },
];

/* ── Shared styles ── */
const inp = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  background: '#fff', color: tk.ink, fontSize: 14,
  border: `1.5px solid ${tk.border}`, outline: 'none',
  fontFamily: "'DM Sans',sans-serif", boxSizing: 'border-box',
};
const inpErr = { ...inp, borderColor: tk.red, background: '#fff5f5' };

const Lbl = ({ children, req }) => (
  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, marginBottom: 6, fontFamily: "'Open Sans',Arial,sans-serif" }}>
    {children}{req && <span style={{ color: tk.red }}> *</span>}
  </label>
);

const SectionHead = ({ icon: Ic, color = tk.accent, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
    <span style={{ width: 30, height: 30, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
      <Ic style={{ width: 15, height: 15, color }} />
    </span>
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>{title}</span>
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 16, overflow: 'hidden', ...style }}>
    {children}
  </div>
);

/* ══ PersonSection ══ */
const PersonSection = ({ title, accentColor, onClientReady, error, initialClientId }) => {
  const [mode, setMode]       = useState('search');
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [showDrop, setShowDrop] = useState(false);
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const [mf, setMf]             = useState({ ...EMPTY_PERSON });
  const [mfErr, setMfErr]       = useState({});

  const doSearch = useCallback(async (q) => {
    if (!q || q.length < 2) { setResults([]); return; }
    try {
      const res  = await axios.get(`/clients?search=${encodeURIComponent(q)}&limit=6`);
      const list = res.data?.data;
      setResults(Array.isArray(list) ? list : []);
    } catch { setResults([]); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(t);
  }, [query, doSearch]);

  const pick = (c) => {
    const label = `${c.firstName} ${c.lastName}`;
    setSelected({ id: c._id, label, phone: c.phone, email: c.email, country: c.country, city: c.city, address: c.address });
    setQuery(label); setShowDrop(false);
    onClientReady(c._id, label, c);
  };

  // Ouverture depuis une fiche client (« Nouveau colis ») : le client est chargé et AFFICHÉ
  // (avant : son identifiant était retenu sans que l'expéditeur apparaisse à l'écran).
  useEffect(() => {
    if (!initialClientId) return;
    let alive = true;
    axios.get(`/clients/${initialClientId}`)
      .then((r) => { const c = r.data?.data; if (alive && c) pick(c); })
      .catch(() => { if (alive) { onClientReady('', '', null); toast.error('Client présélectionné introuvable dans votre périmètre.'); } });
    return () => { alive = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialClientId]);

  const clear = () => {
    setSelected(null); setQuery(''); setResults([]);
    onClientReady('', '', null);
  };

  const validateMF = () => {
    const e = validatePerson(mf); // mêmes règles que le serveur (pays autorisés, téléphone, e-mail)
    setMfErr(e);
    return Object.keys(e).length === 0;
  };

  const createClient = async () => {
    if (!validateMF()) return;
    setCreating(true);
    try {
      // Téléphone enregistré au format international du pays (même normalisation que le serveur).
      const res    = await axios.post('/clients', { ...mf, phone: normalizePhone(mf.phone, mf.country) || mf.phone });
      const nc     = res.data?.data || res.data;
      const label  = `${nc.firstName} ${nc.lastName}`;
      setSelected({ id: nc._id, label, phone: nc.phone, email: nc.email, country: nc.country });
      onClientReady(nc._id, label, nc);
      toast.success(`Client "${label}" créé !`);
      setMode('search');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur création client');
    } finally { setCreating(false); }
  };

  return (
    <Card style={{ boxShadow: selected ? `0 0 0 3px ${accentColor}18` : 'none', border: `1.5px solid ${selected ? accentColor + '55' : tk.border}`, transition: 'all .2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 30, height: 30, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
            <UserIcon style={{ width: 15, height: 15, color: accentColor }} />
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>{title}</span>
        </div>
        {!selected && (
          <div style={{ display: 'flex', background: tk.surf2, borderRadius: 8, padding: 3, gap: 2 }}>
            {[{ k: 'search', I: MagnifyingGlassIcon, l: 'Chercher' }, { k: 'manual', I: PencilSquareIcon, l: 'Nouveau' }].map(({ k, I, l }) => (
              <button key={k} type="button" onClick={() => setMode(k)} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: mode === k ? '#fff' : 'transparent', color: mode === k ? accentColor : tk.textMut, fontWeight: mode === k ? 600 : 400, fontSize: 11, fontFamily: "'Open Sans',Arial,sans-serif", boxShadow: mode === k ? '0 1px 4px rgba(0,0,0,.1)' : 'none', transition: 'all .15s' }}>
                <I style={{ width: 12, height: 12 }} />{l}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: 18, background: '#fff' }}>
        {selected ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${accentColor}08`, border: `1.5px solid ${accentColor}30`, borderRadius: 12, padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: `${accentColor}20`, color: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                {selected.label.split(' ').map(w => w[0]).slice(0, 2).join('')}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: tk.ink, marginBottom: 2 }}>{selected.label}</p>
                <p style={{ fontSize: 12, color: tk.textMut }}>{selected.phone}{selected.email ? ' · ' + selected.email : ''} · {selected.country}{selected.city ? ' · ' + selected.city : ''}</p>
                {selected.address && <p style={{ fontSize: 12, color: tk.textMut }}>{selected.address}</p>}
              </div>
            </div>
            <button type="button" onClick={clear} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: '#f1f5f9', color: tk.textMut, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XMarkIcon style={{ width: 14, height: 14 }} />
            </button>
          </div>
        ) : mode === 'search' ? (
          <div style={{ position: 'relative' }}>
            <Lbl req>Rechercher un client existant</Lbl>
            <div style={{ position: 'relative' }}>
              <MagnifyingGlassIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: tk.textMut }} />
              <input type="text" placeholder="Nom, prénom, téléphone, email…" value={query}
                onChange={e => { setQuery(e.target.value); setShowDrop(true); }}
                onFocus={() => setShowDrop(true)}
                onBlur={() => setTimeout(() => setShowDrop(false), 200)}
                style={{ ...inp, paddingLeft: 40, borderColor: error ? tk.red : tk.border }} />
            </div>
            {showDrop && query.length >= 2 && (
              <div style={{ position: 'absolute', zIndex: 50, top: 'calc(100% + 6px)', left: 0, right: 0, background: '#fff', borderRadius: 14, boxShadow: '0 8px 32px rgba(23,22,20,.14)', border: `1.5px solid ${tk.border}`, overflow: 'hidden', maxHeight: 260, overflowY: 'auto' }}>
                {results.length > 0 ? results.map(c => (
                  <button key={c._id} type="button" onMouseDown={() => pick(c)}
                    style={{ width: '100%', textAlign: 'left', padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', borderBottom: `1px solid ${tk.border}` }}
                    onMouseEnter={e => e.currentTarget.style.background = tk.surface}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: `${accentColor}18`, color: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>
                      {c.firstName?.[0]}{c.lastName?.[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: tk.ink }}>{c.firstName} {c.lastName}</p>
                      <p style={{ fontSize: 12, color: tk.textMut }}>{c.phone} · {c.email} · {c.country}</p>
                    </div>
                  </button>
                )) : (
                  <div style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: tk.textMut, marginBottom: 10 }}>Aucun résultat pour « {query} »</p>
                    <button type="button" onClick={() => setMode('manual')} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: accentColor, color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                      ✍️ Créer ce client
                    </button>
                  </div>
                )}
              </div>
            )}
            {error && <p style={{ fontSize: 11, color: tk.red, marginTop: 6 }}>Veuillez sélectionner un client</p>}
            <p style={{ fontSize: 11, color: tk.textMut, marginTop: 8 }}>
              Pas de résultat ?{' '}
              <button type="button" onClick={() => setMode('manual')} style={{ background: 'none', border: 'none', color: accentColor, cursor: 'pointer', fontSize: 11, fontWeight: 600, padding: 0 }}>
                Saisir manuellement →
              </button>
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: tk.ink }}>Nouveau client</p>
              <button type="button" onClick={() => setMode('search')} style={{ background: 'none', border: 'none', color: tk.textMut, cursor: 'pointer', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                <MagnifyingGlassIcon style={{ width: 12, height: 12 }} /> Rechercher
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[{ k: 'firstName', p: 'Prénom', req: true }, { k: 'lastName', p: 'Nom', req: true }].map(({ k, p, req }) => (
                <div key={k}>
                  <Lbl req={req}>{p}</Lbl>
                  <input type="text" placeholder={p} value={mf[k]} onChange={e => setMf(v => ({ ...v, [k]: e.target.value }))} style={mfErr[k] ? inpErr : inp} />
                  {mfErr[k] && <p style={{ fontSize: 11, color: tk.red, marginTop: 3 }}>{mfErr[k]}</p>}
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <Lbl req>Téléphone</Lbl>
                <input type="tel" placeholder="+243 81 000 0000" value={mf.phone} onChange={e => setMf(v => ({ ...v, phone: e.target.value }))} style={mfErr.phone ? inpErr : inp} />
                {mfErr.phone && <p style={{ fontSize: 11, color: tk.red, marginTop: 3 }}>{mfErr.phone}</p>}
              </div>
              <div>
                <Lbl>Email</Lbl>
                <input type="email" placeholder="email@exemple.com" value={mf.email} onChange={e => setMf(v => ({ ...v, email: e.target.value }))} style={inp} />
              </div>
            </div>
            {mfErr.email && <p style={{ fontSize: 11, color: tk.red, marginTop: -6 }}>{mfErr.email}</p>}
            <div>
              <Lbl req>Pays</Lbl>
              <select value={mf.country} onChange={e => setMf(v => ({ ...v, country: e.target.value }))} style={mfErr.country ? inpErr : inp}>
                <option value="">— Sélectionner —</option>
                {COUNTRY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              {mfErr.country && <p style={{ fontSize: 11, color: tk.red, marginTop: 3 }}>{mfErr.country}</p>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <Lbl>Ville</Lbl>
                <input type="text" placeholder="Ville" value={mf.city} onChange={e => setMf(v => ({ ...v, city: e.target.value }))} style={inp} />
              </div>
              <div>
                <Lbl>Adresse</Lbl>
                <input type="text" placeholder="Rue, quartier…" value={mf.address} onChange={e => setMf(v => ({ ...v, address: e.target.value }))} style={inp} />
              </div>
            </div>
            <button type="button" onClick={createClient} disabled={creating} style={{ padding: '11px 0', borderRadius: 10, border: 'none', background: creating ? '#94a3b8' : accentColor, color: '#fff', cursor: creating ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {creating ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin .8s linear infinite', display: 'inline-block' }} /> Création…</> : '✅ Valider et sélectionner'}
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

/* ══════════════════════════════════════════
   INVOICE COMPONENT (printable)
══════════════════════════════════════════ */
const Invoice = React.forwardRef(({ pkg }, ref) => {
  if (!pkg) return null;

  const cur = packageCurrency(pkg) || '';
  const fmt  = (n) => formatAmount(n, cur);
  const date = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  const typeLabel = PKG_TYPES.find(t => t.value === pkg.packageType)?.label || '📦 Autre';
  const payLabel  = PAY_METHODS.find(p => p.value === pkg.paymentMethod)?.label || '💵 Espèces';

  const base     = (pkg.weight || 0) * (pkg.pricePerKg || 0);
  const extra    = pkg.extraFees    || 0;
  const insur    = pkg.insuranceFee || 0;
  const total    = Number(pkg.totalPrice ?? (base + extra + insur));

  // QR : URL complète de suivi pour que le scan ouvre directement le tracking
  const trackingUrl = `${window.location.origin}/tracking/${pkg.trackingNumber}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(trackingUrl)}&bgcolor=ffffff&color=0d1117&margin=6&ecc=H`;

  return (
    <div ref={ref} style={{ fontFamily: "'DM Sans',sans-serif", color: '#26231e', background: '#fff', padding: '0', maxWidth: 820, margin: '0 auto' }}>

      {/* ── HEADER ── */}
      <div style={{ background: 'linear-gradient(135deg,#171614 0%,#1e3a5f 60%,#a77b28 100%)', padding: '28px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TruckIcon style={{ width: 22, height: 22, color: '#ecd5a3' }} />
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: "'Open Sans',Arial,sans-serif", letterSpacing: '.02em', margin: 0 }}>EASY</p>
              <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', margin: 0 }}>Agence de colis international</p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', margin: '0 0 4px' }}>Bordereau d'expédition</p>
          <p style={{ color: '#ecd5a3', fontFamily: 'monospace', fontSize: 22, fontWeight: 800, letterSpacing: '.1em', margin: '0 0 4px' }}>{pkg.trackingNumber}</p>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 12, margin: 0 }}>{date}</p>
        </div>
      </div>

      {/* ── STATUS BANNER ── */}
      <div style={{ background: pkg.isPaid ? '#059669' : '#d97706', padding: '8px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase' }}>
          {pkg.financial ? {unpaid:'NON PAYÉ',partial:'PARTIELLEMENT PAYÉ',paid:'ENTIÈREMENT PAYÉ'}[pkg.financial.status] : pkg.isPaid ? '✅ PAYÉ' : '⏳ EN ATTENTE DE PAIEMENT'}
        </span>
        <span style={{ color: 'rgba(255,255,255,.85)', fontSize: 11 }}>{payLabel}</span>
      </div>

      <div style={{ padding: '24px 36px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── SENDER / RECEIVER ── */}
        <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { label: 'EXPÉDITEUR', color: '#a77b28', bg: '#fff8ee', border: '#f0dbb3', data: pkg.senderData },
            { label: 'DESTINATAIRE', color: '#059669', bg: '#f0fdf4', border: '#bbf7d0', data: pkg.receiverData },
          ].map(({ label, color, bg, border, data }) => (
            <div key={label} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 12, padding: '14px 18px' }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 10 }}>{label}</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#171614', marginBottom: 4, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                {data?.firstName} {data?.lastName}
              </p>
              {data?.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <PhoneIcon style={{ width: 12, height: 12, color, flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: '#4b5a6e', margin: 0 }}>{data.phone}</p>
                </div>
              )}
              {data?.email && <p style={{ fontSize: 12, color: '#8494a9', marginBottom: 3 }}>{data.email}</p>}
              <div style={{ display: 'inline-block', marginTop: 6, padding: '3px 10px', borderRadius: 6, background: color, color: '#fff', fontSize: 11, fontWeight: 700 }}>{data?.country}</div>
            </div>
          ))}
        </div>

        {/* ── ROUTE ── */}
        <div style={{ background: tk.surface, border: `1.5px solid ${tk.border}`, borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: tk.textMut, marginBottom: 4 }}>ORIGINE</p>
            <div style={{ display: 'inline-block', padding: '5px 16px', borderRadius: 8, background: '#a77b28', color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: "'Open Sans',Arial,sans-serif" }}>{pkg.origin}</div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <div style={{ height: 2, flex: 1, background: 'linear-gradient(90deg,#a77b28,#059669)', borderRadius: 2 }} />
            <div style={{ padding: '6px 12px', borderRadius: 8, background: '#fff', border: `1.5px solid ${tk.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: tk.accent, marginBottom: 2 }}>{pkg.service === 'premium' ? 'PREMIUM' : pkg.service === 'express' ? 'EXPRESS' : 'STANDARD'}</p>
              <p style={{ fontSize: 10, color: tk.textMut }}>
                {pkg.service === 'premium' ? 'Jour même' : pkg.service === 'express' ? '24–48h' : '3–5 jours'}
              </p>
            </div>
            <div style={{ height: 2, flex: 1, background: 'linear-gradient(90deg,#a77b28,#059669)', borderRadius: 2 }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: tk.textMut, marginBottom: 4 }}>DESTINATION</p>
            <div style={{ display: 'inline-block', padding: '5px 16px', borderRadius: 8, background: '#059669', color: '#fff', fontWeight: 800, fontSize: 14, fontFamily: "'Open Sans',Arial,sans-serif" }}>{pkg.destination}</div>
          </div>
        </div>

        {/* ── PACKAGE DETAILS TABLE ── */}
        <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ background: tk.surface, padding: '10px 18px', borderBottom: `1px solid ${tk.border}` }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", margin: 0 }}>DÉTAILS DU COLIS</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                {['Description', 'Type', 'Poids', 'Dimensions', 'Nbre articles', 'Valeur déclarée'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: tk.textMut, letterSpacing: '.1em', textTransform: 'uppercase', borderBottom: `1px solid ${tk.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px 12px', fontSize: 13, color: tk.ink, borderBottom: `1px solid ${tk.border}` }}>{pkg.description || '—'}</td>
                <td style={{ padding: '12px 12px', fontSize: 13, borderBottom: `1px solid ${tk.border}` }}>{typeLabel}</td>
                <td style={{ padding: '12px 12px', fontSize: 14, fontWeight: 700, color: tk.accent, borderBottom: `1px solid ${tk.border}` }}>{pkg.weight} kg</td>
                <td style={{ padding: '12px 12px', fontSize: 12, color: tk.textSec, borderBottom: `1px solid ${tk.border}` }}>
                  {pkg.length && pkg.width && pkg.height ? `${pkg.length}×${pkg.width}×${pkg.height} cm` : '—'}
                </td>
                <td style={{ padding: '12px 12px', fontSize: 13, textAlign: 'center', borderBottom: `1px solid ${tk.border}` }}>{pkg.numberOfItems || 1}</td>
                <td style={{ padding: '12px 12px', fontSize: 13, fontWeight: 600, borderBottom: `1px solid ${tk.border}` }}>{fmt(pkg.declaredValue)} {cur}</td>
              </tr>
            </tbody>
          </table>
          {(pkg.fragile || pkg.insurance) && (
            <div style={{ padding: '10px 12px', display: 'flex', gap: 10 }}>
              {pkg.fragile    && <span style={{ padding: '3px 10px', borderRadius: 6, background: '#fef3c7', color: '#92400e', fontSize: 11, fontWeight: 600 }}>⚠️ Fragile</span>}
              {pkg.insurance  && <span style={{ padding: '3px 10px', borderRadius: 6, background: '#d1fae5', color: '#065f46', fontSize: 11, fontWeight: 600 }}>🛡️ Assuré</span>}
            </div>
          )}
        </div>

        {/* ── PRICING ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>

          {/* Dates */}
          <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ background: tk.surface, padding: '10px 18px', borderBottom: `1px solid ${tk.border}` }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", margin: 0 }}>DATES</p>
            </div>
            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { l: "Date d'enregistrement", v: date },
                { l: "Date d'expédition",     v: pkg.expeditionDate ? new Date(pkg.expeditionDate).toLocaleDateString('fr-FR') : date },
                { l: "Arrivée estimée",        v: <span style={{ color: tk.emerald, fontWeight: 700 }}>{pkg.estimatedArrival}</span> },
              ].map(({ l, v }, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < 2 ? 10 : 0, borderBottom: i < 2 ? `1px solid ${tk.border}` : 'none' }}>
                  <span style={{ fontSize: 12, color: tk.textMut }}>{l}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: tk.ink }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tarif */}
          <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ background: tk.surface, padding: '10px 18px', borderBottom: `1px solid ${tk.border}` }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", margin: 0 }}>TARIFICATION</p>
            </div>
            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { l: `Prix de base (${pkg.weight}kg × ${fmt(pkg.pricePerKg)} ${cur})`, v: pkg.financial ? amountText(pkg.financial.baseMinor,cur) : `${fmt(base)} ${cur}` },
                { l: 'Frais supplémentaires', v: pkg.financial ? amountText(pkg.financial.flatMinor,cur) : `${fmt(extra)} ${cur}` },
                ...(pkg.insurance ? [{ l: 'Assurance', v: pkg.financial ? amountText(pkg.financial.insuranceMinor,cur) : `${fmt(insur)} ${cur}` }] : []),
              ].map(({ l, v }, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: tk.textMut }}>{l}</span>
                  <span style={{ fontSize: 12, color: tk.ink }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: `2px solid ${tk.border}`, marginTop: 6, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif" }}>TOTAL</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: tk.accent, fontFamily: "'Open Sans',Arial,sans-serif" }}>{pkg.financial ? amountText(pkg.financial.totalMinor,cur) : `${fmt(total)} ${cur}`}</span>
              </div>
            </div>
          </div>
        </div>

        {pkg.financial && <section><h2 style={{fontWeight:800}}>EASY — Facture d’expédition</h2>{financialLines(pkg.financial).map((line,i)=><p key={i} style={{marginTop:6}}>{line}</p>)}</section>}
        {/* ── NOTES + QR ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
          <div>
            {pkg.specialInstructions && (
              <div style={{ background: '#fefce8', border: '1.5px solid #fde68a', borderRadius: 12, padding: '12px 16px', marginBottom: 12 }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#92400e', fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 6 }}>INSTRUCTIONS SPÉCIALES</p>
                <p style={{ fontSize: 13, color: '#78350f' }}>{pkg.specialInstructions}</p>
              </div>
            )}
            {pkg.notes && (
              <div style={{ background: tk.surface, border: `1.5px solid ${tk.border}`, borderRadius: 12, padding: '12px 16px' }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 6 }}>NOTES INTERNES</p>
                <p style={{ fontSize: 12, color: tk.textSec }}>{pkg.notes}</p>
              </div>
            )}
            {/* Signature zone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
              {['Signature expéditeur', 'Signature destinataire'].map(s => (
                <div key={s} style={{ border: `1.5px dashed ${tk.border}`, borderRadius: 10, padding: '24px 16px 12px', textAlign: 'center' }}>
                  <p style={{ fontSize: 11, color: tk.textMut }}>{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* QR code */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 180 }}>
            <div style={{ padding: 10, background: '#fff', borderRadius: 14, border: `2px solid ${tk.border}`, boxShadow: '0 2px 10px rgba(0,0,0,.06)' }}>
              <img
                src={qrSrc}
                alt="QR Code suivi"
                style={{ display: 'block', width: 160, height: 160, borderRadius: 6 }}
                onError={e => { e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${pkg.trackingNumber}&bgcolor=ffffff&color=0d1117&margin=6`; }}
              />
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: tk.textMut, textAlign: 'center', maxWidth: 180, margin: '4px 0 2px' }}>📱 Scanner pour suivre</p>
            <p style={{ fontSize: 10, fontFamily: 'monospace', color: tk.accent, fontWeight: 800, letterSpacing: '.1em', textAlign: 'center' }}>{pkg.trackingNumber}</p>
            <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 8, padding: '4px 8px', maxWidth: 180, wordBreak: 'break-all' }}>
              <p style={{ fontSize: 8, color: tk.textMut, textAlign: 'center', lineHeight: 1.4 }}>Statut : <span style={{ fontWeight: 700, color: pkg.isPaid ? '#059669' : '#d97706' }}>{pkg.isPaid ? 'Payé ✓' : 'En attente'}</span></p>
              <p style={{ fontSize: 8, color: tk.textMut, textAlign: 'center' }}>{pkg.origin} → {pkg.destination}</p>
              <p style={{ fontSize: 8, color: tk.textMut, textAlign: 'center' }}>{pkg.senderData?.firstName} {pkg.senderData?.lastName} → {pkg.receiverData?.firstName} {pkg.receiverData?.lastName}</p>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ borderTop: `1.5px solid ${tk.border}`, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 11, color: tk.textMut, maxWidth: 400 }}>
            Ce bordereau fait foi de l'enregistrement du colis. Conservez-le pour tout litige.
            Les colis sont soumis aux conditions générales de transport international.
          </p>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: tk.accent, letterSpacing: '.1em', marginBottom: 2 }}>EASY</p>
            <p style={{ fontSize: 10, color: tk.textMut }}>www.logicolis.com</p>
          </div>
        </div>
      </div>
    </div>
  );
});
Invoice.displayName = 'Invoice';

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function AddPackage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const today     = new Date().toISOString().split('T')[0];

  const [step, setStep]             = useState(0);
  const [loading, setLoading]       = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);   // génération PDF en cours
  const [submitted, setSubmitted]   = useState(false);
  const [createdPkg, setCreatedPkg] = useState(null);
  const [pkgImage, setPkgImage]     = useState(null);
  const [_imageFile, setImageFile]   = useState(null); // eslint-disable-line no-unused-vars
  const fileRef = useRef(null);
  const invoiceRef = useRef(null);

  // Personnes
  const [senderId, setSenderId]         = useState(location.state?.clientId || '');
  const [senderLabel, setSenderLabel]   = useState('');
  const [senderData, setSenderData]     = useState(null);
  const [receiverId, setReceiverId]     = useState('');
  const [receiverLabel, setReceiverLabel] = useState('');
  const [receiverData, setReceiverData]   = useState(null);
  const [personErr, setPersonErr]         = useState({ s: false, r: false });
  // Rôle : un client crée pour LUI-MÊME (expéditeur prérempli) ; le personnel sélectionne un client.
  const { user } = useAuth();
  const isStaff = STAFF_ROLES.includes(user?.role);
  const [selfSender, setSelfSender]       = useState({ ...EMPTY_PERSON });
  const [selfErr, setSelfErr]             = useState({});
  const [receiverForm, setReceiverForm]   = useState({ ...EMPTY_PERSON }); // toujours vierge
  const [receiverErr, setReceiverErr]     = useState({});
  const submittingRef = useRef(false); // garde contre la double soumission

  const { register, handleSubmit, formState: { errors }, trigger, watch } = useForm({
    defaultValues: {
      numberOfItems: 1, weight: '', length: '', width: '', height: '',
      packageType: 'other', description: '', declaredValue: '',
      fragile: false, insurance: false, insuranceFee: '',
      origin: '', destination: '', service: 'standard',
      expeditionDate: today, specialInstructions: '',
      pricePerKg: '', extraFees: '0', totalPrice: '',
      isPaid: false, paymentMethod: 'cash', notes: '',
    },
  });

  const w = watch();
  const insurance = w.insurance;

  const [advance,setAdvance] = useState('0');
  const [quote,setQuote] = useState(null);
  const [quoteError,setQuoteError] = useState('Sélectionnez le trajet et le poids pour calculer le prix.');
  const [quoting,setQuoting] = useState(false);
  const [refreshQuote,setRefreshQuote] = useState(0);
  const quoteKey=JSON.stringify([w.origin,w.destination,w.weight,w.service,!!w.insurance,advance]);
  const quoteValid=quote?.key===quoteKey && Date.now()<quote.expiresAt;
  const computedTotal=quoteValid ? quote.snapshot.totalMinor/(10**moneyDigits[quote.snapshot.referenceCurrency]) : 0;
  useEffect(()=>{
    let current=true; setQuote(null);
    if(!w.origin||!w.destination||!w.weight){setQuoting(false);setQuoteError('Sélectionnez le trajet et le poids pour calculer le prix.');return;}
    setQuoting(true);setQuoteError('');
    const timer=setTimeout(()=>axios.post('/shipping-finance/quote',{origin:w.origin,destination:w.destination,weight:String(w.weight),service:w.service||'standard',insurance:!!w.insurance,advance:advance||'0'})
      .then(r=>{if(current)setQuote({...r.data,key:quoteKey,expiresAt:Date.now()+r.data.expiresInSeconds*1000});})
      .catch(e=>{if(current)setQuoteError(e.response?.data?.message||'Calcul indisponible. Confirmation bloquée.');})
      .finally(()=>{if(current)setQuoting(false);}),300);
    return ()=>{current=false;clearTimeout(timer);};
  // Les champs tarifaires manuels historiques ne participent plus au calcul.
  },[quoteKey,refreshQuote]);

  const getArrival = (svc) => {
    const d = new Date();
    d.setDate(d.getDate() + (svc === 'premium' ? 1 : svc === 'express' ? 2 : 5));
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const steps = [
    { name: 'Personnes',   icon: UserIcon   },
    { name: 'Colis',       icon: CubeIcon   },
    { name: 'Itinéraire',  icon: MapPinIcon  },
    { name: 'Tarification', icon: BanknotesIcon },
  ];

  /* ── Print ── */
  const handlePrint = useReactToPrint({
    contentRef:    invoiceRef,
    documentTitle: () => `Bordereau-${createdPkg?.trackingNumber || 'colis'}`,
    pageStyle:     `
      @page { margin: 10mm; size: A4; }
      @media print {
        body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        img { max-width: 100% !important; }
      }
    `,
    onPrintError: (loc, err) => { console.error('Print error', loc, err); toast.error('Erreur impression : ' + err.message); },
  });

  /* ── Image ── */
  const handleImg = (e) => {
    const f = e.target.files[0];
    if (f?.type.startsWith('image/')) {
      setImageFile(f);
      const r = new FileReader();
      r.onload = ev => setPkgImage(ev.target.result);
      r.readAsDataURL(f);
    } else toast.error('Image invalide');
  };

  /* ── Navigation ── */
  const nextStep = async () => {
    if (step === 0) {
      const sErr = isStaff ? {} : validatePerson(selfSender);
      const rErr = validatePerson(receiverForm);
      setSelfErr(sErr); setReceiverErr(rErr);
      const e = { s: isStaff ? !senderId : Object.keys(sErr).length > 0, r: Object.keys(rErr).length > 0 };
      setPersonErr(e);
      if (e.s || e.r) { toast.error("Vérifiez les informations de l'expéditeur et du destinataire."); return; }
    } else {
      const fieldMap = [
        [],
        ['weight', 'packageType'],
        ['origin', 'destination'],
        [],
      ];
      const ok = await trigger(fieldMap[step]);
      if (!ok) return;
    }
    setStep(p => Math.min(p + 1, steps.length - 1));
  };
  const prevStep = () => setStep(p => Math.max(p - 1, 0));

  /* ── Submit ── */
  const onSubmit = async (data) => {
    if (submittingRef.current) return; // double clic / double Entrée
    const sErr = isStaff ? {} : validatePerson(selfSender);
    const rErr = validatePerson(receiverForm);
    if ((isStaff && !senderId) || Object.keys(sErr).length || Object.keys(rErr).length) {
      setSelfErr(sErr); setReceiverErr(rErr);
      setPersonErr({ s: isStaff ? !senderId : Object.keys(sErr).length > 0, r: Object.keys(rErr).length > 0 });
      setStep(0);
      toast.error("Veuillez renseigner l'expéditeur et le destinataire");
      return;
    }
    if(!quoteValid){toast.error('Devis absent ou expiré : recalculez le prix.');setRefreshQuote(v=>v+1);return;}
    submittingRef.current = true;
    setLoading(true);
    try {
      const estimatedDelivery = (() => {
        const d = new Date();
        d.setDate(d.getDate() + (data.service === 'premium' ? 1 : data.service === 'express' ? 2 : 5));
        return d.toISOString();
      })();

      const clean = (p) => Object.fromEntries(Object.entries(p).filter(([, v]) => typeof v === 'string' && v.trim() !== '').map(([k, v]) => [k, v.trim()]));
      const payload = {
        // Expéditeur : client sélectionné (personnel) ou le client connecté lui-même (le serveur
        // impose sa propre fiche). Destinataire : TOUJOURS la saisie manuelle.
        ...(isStaff ? { sender: senderId } : { senderInfo: clean(selfSender) }),
        receiverInfo: clean(receiverForm),
        weight:      parseFloat(data.weight),
        length:      parseFloat(data.length)  || undefined,
        width:       parseFloat(data.width)   || undefined,
        height:      parseFloat(data.height)  || undefined,
        numberOfItems: parseInt(data.numberOfItems) || 1,
        packageType: data.packageType,
        description: data.description || '',
        declaredValue: parseFloat(data.declaredValue) || 0,
        fragile:     data.fragile || false,
        insurance:   data.insurance || false,
        insuranceFee: data.insurance ? (parseFloat(data.insuranceFee) || 0) : 0,
        origin:      data.origin,
        destination: data.destination,
        specialInstructions: data.specialInstructions || '',
        pricePerKg:  parseFloat(data.pricePerKg) || 0,
        extraFees:   parseFloat(data.extraFees)  || 0,
        totalPrice: computedTotal,
        quoteToken: quote.token,
        service: data.service || 'standard',
        isPaid:      data.isPaid || false,
        paymentMethod: data.paymentMethod,
        notes:       data.notes || '',
        estimatedDelivery,
      };

      const res     = await axios.post('/packages', payload);
      const created = res.data?.data || res.data;
      const nameOf  = (p) => (p ? `${p.firstName || ''} ${p.lastName || ''}`.trim() : '');

      setCreatedPkg({
        ...payload,
        ...created,
        trackingNumber:  created.trackingNumber,
        _id:             created._id,
        estimatedArrival: getArrival(data.service),
        packageImageUrl: pkgImage,
        // Parties telles qu'ENREGISTRÉES par le serveur (fiches peuplées dans la réponse).
        senderData:    created.sender || senderData,
        receiverData:  created.receiver || receiverData,
        senderLabel:   nameOf(created.sender) || senderLabel,
        receiverLabel: nameOf(created.receiver) || receiverLabel,
        expeditionDate: data.expeditionDate,
        service:        data.service,
      });
      setSubmitted(true);
      toast.success('Colis enregistré avec succès !');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Erreur création';
      toast.error(msg);
      if (err.response?.data?.field === 'sender' || err.response?.data?.field === 'receiver') setStep(0);
    } finally { setLoading(false); submittingRef.current = false; }
  };

  /* ══ Génération PDF (html2canvas + jsPDF) ══════════════════════ */
  const generatePDFBlob = async () => {
    if (!invoiceRef.current) throw new Error('Référence facture manquante');
    setPdfLoading(true);
    try {
      // 1. Convertir les images cross-origin (QR code) en data-URL
      //    pour que html2canvas puisse les capturer sans CORS taint
      const imgs = [...invoiceRef.current.querySelectorAll('img[src^="http"]')];
      await Promise.all(imgs.map(async (img) => {
        try {
          const resp = await fetch(img.src, { mode: 'cors' });
          const blob = await resp.blob();
          const reader = new FileReader();
          await new Promise(res => {
            reader.onload = e => { img.src = e.target.result; res(); };
            reader.onerror = res;
            reader.readAsDataURL(blob);
          });
        } catch { /* conserver le src original si fetch échoue */ }
      }));

      // 2. Attendre que toutes les images soient chargées
      await Promise.all([...invoiceRef.current.querySelectorAll('img')].map(img =>
        img.complete
          ? Promise.resolve()
          : new Promise(res => { img.onload = res; img.onerror = res; })
      ));

      // 3. Capturer en canvas haute résolution
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: false,      // false car on a déjà converti en data-URL
        allowTaint: false,   // false = on peut appeler toDataURL()
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 0,
      });

      // 4. Créer le PDF en A4 (portrait)
      const pdf     = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW    = pdf.internal.pageSize.getWidth();   // 210 mm
      const pdfH    = pdf.internal.pageSize.getHeight();  // 297 mm
      // Calculer la hauteur proportionnelle au contenu
      const imgAR   = canvas.height / canvas.width;
      const contentH = pdfW * imgAR;

      if (contentH <= pdfH) {
        // Tout tient sur une page
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pdfW, contentH);
      } else {
        // Multi-page
        const pageImgH = pdfH;
        let y = 0;
        while (y < contentH) {
          if (y > 0) pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, -y, pdfW, contentH);
          y += pageImgH;
        }
      }

      return pdf.output('blob');
    } finally {
      setPdfLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const blob = await generatePDFBlob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `Bordereau-${createdPkg.trackingNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return blob;
    } catch (err) {
      toast.error('Erreur génération PDF : ' + err.message);
      return null;
    }
  };

  /* ── WhatsApp : PDF en pièce jointe (mobile) ou téléchargement + lien (desktop) ── */
  const shareWhatsApp = async () => {
    if (!createdPkg) return;
    const trackingUrl = `${window.location.origin}/tracking/${createdPkg.trackingNumber}`;
    const msg = [
      `📦 *Bordereau EASY*`,
      `🔖 N° : *${createdPkg.trackingNumber}*`,
      `🗺️ Trajet : *${createdPkg.origin} → ${createdPkg.destination}*`,
      `⚖️ Poids : ${createdPkg.weight} kg  |  💰 ${createdPkg.financial ? amountText(createdPkg.financial.totalMinor,createdPkg.financial.referenceCurrency) : createdPkg.totalPrice}`,
      `👤 Exp. : ${createdPkg.senderLabel}`,
      `👤 Dest. : ${createdPkg.receiverLabel}`,
      `✅ ${createdPkg.isPaid ? 'Payé' : 'En attente de paiement'}`,
      ``,
      `🔗 Suivi : ${trackingUrl}`,
    ].join('\n');

    try {
      const blob = await generatePDFBlob();
      const file = new File([blob], `Bordereau-${createdPkg.trackingNumber}.pdf`, { type: 'application/pdf' });

      // Web Share API niveau 2 — fonctionne sur mobile (Chrome Android, Safari iOS)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title:  `Bordereau ${createdPkg.trackingNumber}`,
          text:   msg,
          files:  [file],
        });
        return;
      }
    } catch { /* si la génération PDF échoue, on tombe sur le fallback */ }

    // Fallback desktop : téléchargement + ouverture WhatsApp
    await downloadPDF();
    toast.info('📥 PDF téléchargé — collez-le dans WhatsApp après ouverture', { autoClose: 5000 });
    setTimeout(() => window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank'), 800);
  };

  /* ── Email : PDF en pièce jointe (mobile) ou téléchargement + mailto (desktop) ── */
  const shareEmail = async () => {
    if (!createdPkg) return;
    const trackingUrl = `${window.location.origin}/tracking/${createdPkg.trackingNumber}`;
    const to      = createdPkg.receiverData?.email || '';
    const subject = `Bordereau EASY – N° ${createdPkg.trackingNumber}`;
    const body    = [
      `Bonjour ${createdPkg.receiverLabel},`,
      ``,
      `Votre colis a été enregistré chez EASY.`,
      ``,
      `N° de suivi  : ${createdPkg.trackingNumber}`,
      `Trajet       : ${createdPkg.origin} → ${createdPkg.destination}`,
      `Expéditeur   : ${createdPkg.senderLabel}`,
      `Poids        : ${createdPkg.weight} kg`,
      `Montant      : ${createdPkg.financial ? amountText(createdPkg.financial.totalMinor,createdPkg.financial.referenceCurrency) : createdPkg.totalPrice}`,
      `Paiement     : ${createdPkg.isPaid ? 'Payé ✓' : 'En attente'}`,
      ``,
      `Suivi en ligne : ${trackingUrl}`,
      ``,
      `Le bordereau PDF est en pièce jointe.`,
      ``,
      `Cordialement,`,
      `L'équipe EASY`,
    ].join('\n');

    try {
      const blob = await generatePDFBlob();
      const file = new File([blob], `Bordereau-${createdPkg.trackingNumber}.pdf`, { type: 'application/pdf' });

      // Web Share API niveau 2
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: subject, text: body, files: [file] });
        return;
      }
    } catch { /* fallback */ }

    // Fallback : télécharger PDF + ouvrir client mail
    await downloadPDF();
    toast.info('📥 PDF téléchargé — attachez-le à votre email', { autoClose: 5000 });
    setTimeout(() => {
      window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }, 400);
  };

  /* ══ CONFIRMATION + FACTURE ══ */
  if (submitted && createdPkg) {

    /* Spinner commun pour les boutons PDF */
    const Spin = () => (
      <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.35)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block', flexShrink: 0 }} />
    );
    const btnDisabled = pdfLoading ? { opacity: .6, cursor: 'not-allowed', pointerEvents: 'none' } : {};

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Hero de confirmation ── */}
        <section className="easy-internal-header" style={{ position: 'relative', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 24 }}>
          {/* Fond decoratif retire : en-tete interne neutre. */}

          <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#37312a', padding: '0 24px', maxWidth: 700 }}>
            {/* Badge succès */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(52,211,153,.2)', backdropFilter: 'blur(12px)', border: '1px solid rgba(52,211,153,.4)', borderRadius: 99, padding: '6px 18px', marginBottom: 14 }}>
              <CheckCircleIcon style={{ width: 14, height: 14, color: '#34d399' }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif", color: '#34d399' }}>Colis enregistré avec succès</span>
            </div>

            {/* Numéro */}
            <h1 style={{ fontSize: 'clamp(18px,3vw,30px)', fontWeight: 800, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 6 }}>
              Bordereau N°{' '}
              <span style={{ fontFamily: 'monospace', color: '#ecd5a3', letterSpacing: '.1em' }}>{createdPkg.trackingNumber}</span>
            </h1>
            <p style={{ color: '#37312a', fontSize: 12, marginBottom: 20 }}>
              {createdPkg.origin} → {createdPkg.destination} · {createdPkg.weight} kg · {createdPkg.financial ? amountText(createdPkg.financial.totalMinor,createdPkg.financial.referenceCurrency) : createdPkg.totalPrice}
            </p>

            {/* ── Boutons d'action ── */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>

              {/* Imprimer (react-to-print, no PDF generation needed) */}
              <button onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, background: '#fff', color: '#171614', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif", boxShadow: '0 2px 12px rgba(0,0,0,.18)' }}>
                <PrinterIcon style={{ width: 16, height: 16 }} /> Imprimer
              </button>

              {/* Télécharger PDF */}
              <button onClick={downloadPDF} disabled={pdfLoading} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, background: tk.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif", boxShadow: '0 2px 12px rgba(167,123,40,.35)', ...btnDisabled }}>
                {pdfLoading ? <><Spin /> Génération…</> : <><span>📥</span> Télécharger PDF</>}
              </button>

              {/* WhatsApp */}
              <button onClick={shareWhatsApp} disabled={pdfLoading} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, background: '#25d366', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif", boxShadow: '0 2px 12px rgba(37,211,102,.3)', ...btnDisabled }}>
                {pdfLoading ? <><Spin /> PDF…</> : <><span style={{ fontSize: 16 }}>💬</span> WhatsApp</>}
              </button>

              {/* Email */}
              <button onClick={shareEmail} disabled={pdfLoading} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, background: 'rgba(255,255,255,.15)', color: '#fff', border: '1px solid rgba(255,255,255,.3)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif", backdropFilter: 'blur(8px)', ...btnDisabled }}>
                {pdfLoading ? <><Spin /> PDF…</> : <><span style={{ fontSize: 16 }}>✉️</span> Email</>}
              </button>

              {/* Copier N° */}
              <button onClick={() => { navigator.clipboard.writeText(createdPkg.trackingNumber); toast.success('N° copié !'); }} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '10px 20px', borderRadius: 10, background: 'rgba(255,255,255,.08)', color: '#fff', border: '1px solid rgba(255,255,255,.18)', cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                <ShareIcon style={{ width: 15, height: 15 }} /> Copier N°
              </button>
            </div>

            {/* Note explicative desktop */}
            {pdfLoading && (
              <p style={{ marginTop: 14, fontSize: 11, color: '#37312a' }}>⏳ Génération du PDF en cours…</p>
            )}
          </div>

          {/* Wave */}
          {/* Fond decoratif retire : en-tete interne neutre. */}
        </section>

        {/* ── Barre de partage PDF (dans la card) ── */}
        <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 8px 48px rgba(23,22,20,.1)', border: `1.5px solid ${tk.border}`, overflow: 'hidden' }}>

          {/* Header de la card */}
          <div style={{ padding: '14px 28px', background: tk.surface, borderBottom: `1px solid ${tk.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>📄</span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", margin: 0 }}>Bordereau d'expédition</p>
                <p style={{ fontSize: 10, color: tk.textMut, margin: 0 }}>Partagez le PDF directement en pièce jointe</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={shareWhatsApp} disabled={pdfLoading} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 9, background: '#25d366', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, boxShadow: '0 2px 8px rgba(37,211,102,.25)', ...btnDisabled }}>
                {pdfLoading ? <><Spin />Génération…</> : <>💬 WhatsApp PDF</>}
              </button>
              <button onClick={shareEmail} disabled={pdfLoading} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 9, background: '#6366f1', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, boxShadow: '0 2px 8px rgba(99,102,241,.25)', ...btnDisabled }}>
                {pdfLoading ? <><Spin />Génération…</> : <>✉️ Email PDF</>}
              </button>
              <button onClick={downloadPDF} disabled={pdfLoading} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 9, background: '#171614', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, ...btnDisabled }}>
                {pdfLoading ? <><Spin />…</> : <>📥 PDF</>}
              </button>
              <button onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 9, background: tk.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                <PrinterIcon style={{ width: 14, height: 14 }} /> Imprimer
              </button>
            </div>
          </div>

          {/* Invoice component */}
          <Invoice ref={invoiceRef} pkg={createdPkg} />
          {createdPkg.financial && <FinancialSummary financial={createdPkg.financial} pkg={createdPkg} onUpdated={p=>setCreatedPkg(old=>({...old,...p}))} />}
        </div>

        {/* ── Note comportement desktop/mobile ── */}
        <div style={{ background: `${tk.accent}08`, border: `1px solid ${tk.accent}20`, borderRadius: 14, padding: '12px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: tk.accent, marginBottom: 3 }}>Comment fonctionne le partage PDF ?</p>
            <p style={{ fontSize: 11, color: tk.textSec, lineHeight: 1.6 }}>
              <b>📱 Mobile :</b> Le PDF s'ouvre directement dans la feuille de partage — choisissez WhatsApp, Gmail ou toute autre app.<br />
              <b>🖥️ Ordinateur :</b> Le PDF est téléchargé automatiquement, puis votre client email (ou WhatsApp Web) s'ouvre pour que vous puissiez l'attacher.
            </p>
          </div>
        </div>

        {/* Actions bas de page */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <button
            onClick={() => navigate('/app/packages')}
            style={{ padding: '14px 0', borderRadius: 12, background: '#fff', color: tk.textSec, border: `1.5px solid ${tk.border}`, cursor: 'pointer', fontFamily: "'Open Sans',Arial,sans-serif", fontSize: 14, fontWeight: 500 }}
          >
            ← Liste des colis
          </button>

          {/* ── Bouton Payer maintenant ── */}
          {createdPkg && !createdPkg.financial && !createdPkg.isPaid && (
            <button
              onClick={() => navigate('/app/payments/add', {
                state: {
                  packageId: createdPkg._id,
                  clientId:  createdPkg.sender?._id || createdPkg.sender,
                  amount:    createdPkg.totalPrice,
                },
              })}
              style={{ padding: '14px 0', borderRadius: 12, background: tk.emerald, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Open Sans',Arial,sans-serif", fontSize: 14, fontWeight: 700, boxShadow: '0 4px 18px rgba(5,150,105,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <BanknotesIcon style={{ width: 16, height: 16 }} /> Payer maintenant
            </button>
          )}
          {createdPkg && createdPkg.isPaid && (
            <button
              onClick={() => navigate(`/app/packages/${createdPkg._id}`)}
              style={{ padding: '14px 0', borderRadius: 12, background: tk.emerald, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Open Sans',Arial,sans-serif", fontSize: 14, fontWeight: 700, boxShadow: '0 4px 18px rgba(5,150,105,.3)' }}
            >
              ✓ Voir le colis
            </button>
          )}

          <button
            onClick={() => { setSubmitted(false); setCreatedPkg(null); setStep(0); setSenderId(''); setReceiverId(''); setReceiverForm({ ...EMPTY_PERSON }); setReceiverErr({}); submittingRef.current = false; }}
            style={{ padding: '14px 0', borderRadius: 12, background: tk.accent, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Open Sans',Arial,sans-serif", fontSize: 14, fontWeight: 600, boxShadow: '0 4px 18px rgba(167,123,40,.25)' }}
          >
            + Nouveau colis
          </button>
        </div>

        <style>{`
          @keyframes zoom-slow { from { transform:scale(1) } to { transform:scale(1.06) } }
          @keyframes spin { to { transform:rotate(360deg) } }
        `}</style>
      </div>
    );
  }

  /* ══ FORMULAIRE ══ */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* Hero */}
      <section className="easy-internal-header" style={{ position: 'relative', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 28, borderRadius: 24 }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#37312a', padding: '0 24px', maxWidth: 640 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 99, padding: '6px 16px', marginBottom: 16 }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#ecd5a3' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>Nouvelle expédition</span>
          </div>
          <h1 style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 10, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Créez votre <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>bordereau</span> d'expédition
          </h1>
          <p style={{ color: '#37312a', fontSize: 13 }}>Informations complètes • Numéro de suivi automatique • Facture imprimable</p>
        </div>
        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 8px 48px rgba(23,22,20,.08)', border: `1.5px solid ${tk.border}`, overflow: 'hidden' }}>

        {/* Stepper */}
        <div className="form-stepper-header" style={{ padding: '24px 32px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ position: 'absolute', top: 20, left: '6%', right: '6%', height: 1, background: tk.border, zIndex: 0 }}>
              <div style={{ height: '100%', background: tk.accent, width: `${(step / (steps.length - 1)) * 100}%`, transition: 'width .4s ease' }} />
            </div>
            {steps.map((s, i) => {
              const done = i < step, active = i === step;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', border: `2px solid ${done || active ? tk.accent : tk.border}`, background: done ? tk.accent : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: done ? '#fff' : active ? tk.accent : tk.textMut, boxShadow: active ? `0 0 0 4px rgba(167,123,40,.12),0 2px 8px rgba(167,123,40,.2)` : 'none', transition: 'all .3s' }}>
                    {done ? <CheckCircleIcon style={{ width: 18, height: 18 }} /> : <s.icon style={{ width: 16, height: 16 }} />}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif", color: active ? tk.accent : done ? tk.ink : tk.textMut }}>{s.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-card-body" style={{ padding: '40px 40px 32px' }}>
          <div className="form-layout-sidebar" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 40 }}>

            {/* Sidebar */}
            <div className="form-sidebar">
              <div style={{ position: 'sticky', top: 24, borderRadius: 18, overflow: 'hidden', border: `1.5px solid ${tk.border}` }}>
                <div style={{ background: `linear-gradient(145deg,${tk.ink} 0%,${tk.ink80} 100%)`, padding: '24px 18px', textAlign: 'center' }}>
                  <div style={{ width: 64, height: 64, margin: '0 auto 14px', background: 'rgba(255,255,255,.1)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src="https://cdn-icons-png.flaticon.com/512/2942/2942709.png" alt="" style={{ width: 44, objectFit: 'contain' }} />
                  </div>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 13, fontFamily: "'Open Sans',Arial,sans-serif" }}>Étape {step + 1} / {steps.length}</p>
                  <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 12 }}>{steps[step].name}</p>
                </div>
                <div style={{ background: '#fff', padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {steps.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: i === step ? 'rgba(167,123,40,.06)' : 'transparent', border: i === step ? `1px solid rgba(167,123,40,.15)` : '1px solid transparent', transition: 'all .2s' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: i < step ? tk.emerald : i === step ? tk.accent : tk.surf2, color: i <= step ? '#fff' : tk.textMut }}>
                        {i < step ? '✓' : i + 1}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: i === step ? tk.accent : i < step ? tk.ink : tk.textMut }}>{s.name}</span>
                    </div>
                  ))}
                </div>
                {/* Récap live */}
                {(senderId || w.weight || w.origin) && (
                  <div style={{ borderTop: `1px solid ${tk.border}`, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: tk.textMut, marginBottom: 4 }}>Récapitulatif</p>
                    {senderLabel   && <p style={{ fontSize: 11, color: tk.ink }}><span style={{ color: tk.textMut }}>Exp. </span>{senderLabel}</p>}
                    {receiverLabel && <p style={{ fontSize: 11, color: tk.ink }}><span style={{ color: tk.textMut }}>Dest. </span>{receiverLabel}</p>}
                    {w.weight      && <p style={{ fontSize: 11, color: tk.ink }}><span style={{ color: tk.textMut }}>Poids </span>{w.weight} kg</p>}
                    {w.origin && w.destination && <p style={{ fontSize: 11, color: tk.ink }}>{w.origin} → {w.destination}</p>}
                    {computedTotal > 0 && <p style={{ fontSize: 13, fontWeight: 800, color: tk.accent, marginTop: 4 }}>{quoteValid ? amountText(quote.snapshot.totalMinor,quote.snapshot.referenceCurrency) : "Tarif indisponible"}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            <div>
            {/* Devis : affiché à l'étape Tarification seulement (avant : visible dès l'étape 1, avec un
                message d'erreur rouge). L'avance n'est proposée qu'au personnel : le serveur la refuse
                pour un client (services/shippingFinance). Le calcul du devis n'est pas modifié. */}
            {step === steps.length - 1 && (
            <div style={{padding:18,border:'1px solid #ddd',borderRadius:12,marginBottom:18}}>
              {isStaff && (
                <label>Avance réellement encaissée au départ (devise du pays de départ)
                  <input aria-label="Avance au départ" type="number" min="0" step="0.01" value={advance} onChange={e=>setAdvance(e.target.value)} style={{...inp,marginTop:8}} />
                </label>
              )}
              {quoting&&<p role="status">Calcul du prix…</p>}
              {quoteError&&<p role="alert" style={{color:'#b91c1c'}}>{quoteError}</p>}
              {quoteValid&&<FinancialSummary financial={quote.snapshot} preview />}
              <button type="button" onClick={()=>setRefreshQuote(v=>v+1)}>Recalculer le devis</button>
            </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* ══ ÉTAPE 0 — Personnes ══ */}
              {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 4 }}>Expéditeur & Destinataire</h2>
                    <p style={{ fontSize: 14, color: tk.textSec }}>
                      {isStaff
                        ? "Sélectionnez le client expéditeur (ses informations sont reprises automatiquement), puis saisissez le destinataire."
                        : "Vos informations d'expéditeur sont reprises de votre compte. Saisissez ensuite le destinataire."}
                    </p>
                  </div>
                  {isStaff ? (
                    <PersonSection title="Expéditeur — client pour lequel le colis est enregistré" accentColor={tk.accent}
                      initialClientId={location.state?.clientId}
                      onClientReady={(id, lbl, data) => { setSenderId(id); setSenderLabel(lbl); setSenderData(data); setPersonErr(p => ({ ...p, s: false })); }}
                      error={personErr.s} />
                  ) : (
                    <SelfSenderSection value={selfSender} errors={selfErr}
                      onChange={(v) => { setSelfSender(v); setSenderLabel(`${v.firstName} ${v.lastName}`.trim()); setSenderData(v); }} />
                  )}
                  <ReceiverSection value={receiverForm} errors={receiverErr}
                    onChange={(v) => { setReceiverForm(v); setReceiverLabel(`${v.firstName} ${v.lastName}`.trim()); setReceiverData(v); }} />
                </div>
              )}

              {/* ══ ÉTAPE 1 — Colis ══ */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 4 }}>Détails du colis</h2>
                    <p style={{ fontSize: 14, color: tk.textSec }}>Renseignez toutes les caractéristiques du colis à expédier.</p>
                  </div>

                  {/* Photo */}
                  <Card>
                    <SectionHead icon={PhotoIcon} title="Photo du colis (recommandée)" />
                    <div style={{ padding: 18 }}>
                      <div style={{ border: `2px dashed ${pkgImage ? tk.border : '#cbd5e1'}`, borderRadius: 14, padding: pkgImage ? 16 : 36, textAlign: pkgImage ? 'left' : 'center', background: pkgImage ? '#fff' : tk.surface }}>
                        {pkgImage ? (
                          <div style={{ position: 'relative', display: 'inline-flex' }}>
                            <img src={pkgImage} alt="" style={{ maxHeight: 160, borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,.1)' }} />
                            <button type="button" onClick={() => { setPkgImage(null); setImageFile(null); if (fileRef.current) fileRef.current.value = ''; }} style={{ position: 'absolute', top: -8, right: -8, width: 26, height: 26, background: tk.red, color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                          </div>
                        ) : (
                          <>
                            <PhotoIcon style={{ width: 40, height: 40, color: tk.textMut, margin: '0 auto 10px' }} />
                            <p style={{ fontSize: 13, color: tk.textSec, marginBottom: 12 }}>Ajoutez une photo pour faciliter l'identification</p>
                            <button type="button" onClick={() => fileRef.current?.click()} style={{ padding: '8px 18px', background: tk.accent, color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Choisir une photo</button>
                            <input ref={fileRef} type="file" accept="image/*" onChange={handleImg} style={{ display: 'none' }} />
                          </>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Type & Qté */}
                  <Card>
                    <SectionHead icon={CubeIcon} title="Type et quantité" />
                    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div>
                        <Lbl req>Type de colis</Lbl>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                          {PKG_TYPES.map(({ value, label, color }) => (
                            <label key={value} style={{ cursor: 'pointer', borderRadius: 10, border: `2px solid ${w.packageType === value ? color : tk.border}`, background: w.packageType === value ? color + '12' : '#fff', padding: '10px 8px', textAlign: 'center', transition: 'all .15s', fontSize: 11, fontWeight: w.packageType === value ? 700 : 400, color: w.packageType === value ? color : tk.textSec }}>
                              <input type="radio" value={value} {...register('packageType', { required: true })} style={{ display: 'none' }} />
                              {label}
                            </label>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 14 }}>
                        <div>
                          <Lbl>Nombre d'articles</Lbl>
                          <input type="number" min="1" {...register('numberOfItems', { min: 1 })} style={inp} />
                        </div>
                        <div>
                          <Lbl>Description du contenu</Lbl>
                          <input type="text" placeholder="Vêtements, livres, électronique…" {...register('description')} style={inp} />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Poids & Dimensions */}
                  <Card>
                    <SectionHead icon={ScaleIcon} title="Poids & Dimensions" />
                    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div>
                          <Lbl req>Poids total (kg)</Lbl>
                          <input type="number" step="0.01" placeholder="ex : 3.5" {...register('weight', { required: 'Poids requis', min: { value: 0.1, message: 'Min 0.1 kg' } })} style={errors.weight ? inpErr : inp} />
                          {errors.weight && <p style={{ fontSize: 11, color: tk.red, marginTop: 4 }}>{errors.weight.message}</p>}
                        </div>
                        <div>
                          <Lbl>Valeur déclarée (monnaie du départ)</Lbl>
                          <input type="number" step="0.01" placeholder="ex : 150.00" {...register('declaredValue', { min: 0 })} style={inp} />
                        </div>
                      </div>
                      <div>
                        <Lbl>Dimensions (cm) — Longueur × Largeur × Hauteur</Lbl>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                          {[['length', 'L'], ['width', 'l'], ['height', 'H']].map(([k, ph]) => (
                            <input key={k} type="number" step="0.1" placeholder={`${ph} cm`} {...register(k, { min: 0 })} style={inp} />
                          ))}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${w.fragile ? '#fbbf24' : tk.border}`, background: w.fragile ? '#fefce8' : '#fff', transition: 'all .15s' }}>
                          <input type="checkbox" {...register('fragile')} style={{ width: 15, height: 15, accentColor: '#d97706' }} />
                          <span style={{ fontSize: 13, fontWeight: 500, color: w.fragile ? '#92400e' : tk.ink }}>⚠️ Colis fragile</span>
                        </label>
                        <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '12px 16px', borderRadius: 10, border: `1.5px solid ${insurance ? '#10b981' : tk.border}`, background: insurance ? '#f0fdf4' : '#fff', transition: 'all .15s' }}>
                          <input type="checkbox" {...register('insurance')} style={{ width: 15, height: 15, accentColor: tk.emerald }} />
                          <span style={{ fontSize: 13, fontWeight: 500, color: insurance ? '#065f46' : tk.ink }}>🛡️ Assurance transport</span>
                        </label>
                      </div>
                      {insurance && (
                        <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: 10, padding: '12px 16px' }}>
                          <p>Assurance calculée automatiquement selon le tarif administratif du trajet.</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ ÉTAPE 2 — Itinéraire ══ */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 4 }}>Itinéraire & Service</h2>
                    <p style={{ fontSize: 14, color: tk.textSec }}>Définissez l'origine, la destination et le niveau de service.</p>
                  </div>

                  {/* Origin → Destination */}
                  <Card>
                    <SectionHead icon={MapPinIcon} title="Trajet" />
                    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'end' }}>
                        <div>
                          <Lbl req>Pays d'origine</Lbl>
                          <select {...register('origin', { required: "Requis", validate: v => isKnownCountry(v) || 'Invalide' })} style={errors.origin ? inpErr : inp}>
                            <option value="">— Sélectionner —</option>
                            {COUNTRY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                          </select>
                          {errors.origin && <p style={{ fontSize: 11, color: tk.red, marginTop: 4 }}>{errors.origin.message}</p>}
                        </div>
                        <div style={{ paddingBottom: 8, display: 'flex', justifyContent: 'center' }}>
                          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#a77b28,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(167,123,40,.3)' }}>
                            <ArrowRightIcon style={{ width: 18, height: 18, color: '#fff' }} />
                          </div>
                        </div>
                        <div>
                          <Lbl req>Pays de destination</Lbl>
                          <select {...register('destination', { required: "Requis", validate: v => isKnownCountry(v) || 'Invalide' })} style={errors.destination ? inpErr : inp}>
                            <option value="">— Sélectionner —</option>
                            {COUNTRY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                          </select>
                          {errors.destination && <p style={{ fontSize: 11, color: tk.red, marginTop: 4 }}>{errors.destination.message}</p>}
                        </div>
                      </div>
                      {w.origin && w.destination && w.origin !== w.destination && (
                        <div style={{ background: 'linear-gradient(135deg,rgba(167,123,40,.06),rgba(5,150,105,.06))', border: `1.5px solid rgba(167,123,40,.15)`, borderRadius: 12, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: tk.accent }}>{w.origin}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 30, height: 2, background: tk.border }} />
                            <TruckIcon style={{ width: 18, height: 18, color: tk.emerald }} />
                            <div style={{ width: 30, height: 2, background: tk.border }} />
                          </div>
                          <span style={{ fontSize: 16, fontWeight: 800, color: tk.emerald }}>{w.destination}</span>
                        </div>
                      )}
                      {w.origin && w.destination && w.origin === w.destination && (
                        <p style={{ fontSize: 13, color: tk.red, background: '#fff5f5', padding: '10px 14px', borderRadius: 10, border: `1px solid #fca5a5` }}>⚠️ Origine et destination identiques</p>
                      )}
                    </div>
                  </Card>

                  {/* Service + Date */}
                  <Card>
                    <SectionHead icon={TruckIcon} title="Service & Date d'expédition" />
                    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                        {[
                          { val: 'standard', label: 'Standard', sub: '3–5 jours', color: '#64748b' },
                          { val: 'express',  label: 'Express',  sub: '24–48 h',  color: tk.accent  },
                          { val: 'premium',  label: 'Premium',  sub: 'Jour même', color: '#d97706'  },
                        ].map(({ val, label, sub, color }) => (
                          <label key={val} style={{ position: 'relative', cursor: 'pointer', borderRadius: 12, border: `2px solid ${w.service === val ? color : tk.border}`, background: w.service === val ? color + '10' : '#fff', padding: '14px', transition: 'all .2s' }}>
                            <input type="radio" value={val} {...register('service')} style={{ display: 'none' }} />
                            <p style={{ fontWeight: 700, fontSize: 14, color: w.service === val ? color : tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 2 }}>{label}</p>
                            <p style={{ fontSize: 12, color: tk.textMut }}>{sub}</p>
                            {w.service === val && <div style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 18, background: color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#fff', fontSize: 9, fontWeight: 800 }}>✓</span></div>}
                          </label>
                        ))}
                      </div>
                      <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div>
                          <Lbl req>Date d'expédition</Lbl>
                          <input type="date" {...register('expeditionDate', { required: true })} style={errors.expeditionDate ? inpErr : inp} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(167,123,40,.05)', border: `1.5px solid rgba(167,123,40,.15)`, borderRadius: 10, padding: '10px 14px' }}>
                          <ClockIcon style={{ width: 22, height: 22, color: tk.accent, flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.accent, marginBottom: 2 }}>Arrivée estimée</p>
                            <p style={{ fontSize: 12, fontWeight: 700, color: tk.ink, textTransform: 'capitalize' }}>{getArrival(w.service)}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Lbl>Instructions spéciales</Lbl>
                        <textarea rows={2} placeholder="Manipuler avec précaution, garder au sec…" {...register('specialInstructions')} style={{ ...inp, resize: 'none' }} />
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* ══ ÉTAPE 3 — Tarification ══ */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 4 }}>Tarification & Paiement</h2>
                    <p style={{ fontSize: 14, color: tk.textSec }}>Calculez le tarif et enregistrez les conditions de paiement.</p>
                  </div>

                  <p>Le prix calculé et les deux devises sont visibles dans le récapitulatif au-dessus du formulaire. Le serveur vérifiera à nouveau les tarifs et taux avant confirmation.</p>

                  {/* Paiement */}
                  <Card>
                    <SectionHead icon={BanknotesIcon} title="Méthode de paiement" />
                    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                        {PAY_METHODS.map(({ value, label }) => (
                          <label key={value} style={{ cursor: 'pointer', borderRadius: 10, border: `2px solid ${w.paymentMethod === value ? tk.accent : tk.border}`, background: w.paymentMethod === value ? 'rgba(167,123,40,.06)' : '#fff', padding: '12px 16px', transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input type="radio" value={value} {...register('paymentMethod')} style={{ display: 'none' }} />
                            <div style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${w.paymentMethod === value ? tk.accent : tk.border}`, background: w.paymentMethod === value ? tk.accent : '#fff', flexShrink: 0, transition: 'all .15s' }} />
                            <span style={{ fontSize: 13, fontWeight: w.paymentMethod === value ? 600 : 400, color: w.paymentMethod === value ? tk.accent : tk.textSec }}>{label}</span>
                          </label>
                        ))}
                      </div>
                      <p>Le statut de paiement est déterminé par l’avance encaissée et le journal des transactions, jamais par une case à cocher.</p>
                    </div>
                  </Card>

                  {/* Notes */}
                  <Card>
                    <SectionHead icon={DocumentTextIcon} title="Notes internes" />
                    <div style={{ padding: 18 }}>
                      <textarea rows={3} placeholder="Remarques, instructions de livraison, informations complémentaires…" {...register('notes')} style={{ ...inp, resize: 'none' }} />
                    </div>
                  </Card>
                </div>
              )}

              {/* ── Navigation ── */}
              <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 24, borderTop: `1px solid ${tk.border}` }}>
                <button type="button" onClick={prevStep} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, background: 'none', border: `1.5px solid ${tk.border}`, color: tk.textSec, cursor: 'pointer', fontSize: 13, fontWeight: 500, visibility: step === 0 ? 'hidden' : 'visible' }}>
                  <ArrowLeftIcon style={{ width: 15, height: 15 }} /> Précédent
                </button>
                {step < steps.length - 1 ? (
                  <button key="next-step" type="button" onClick={nextStep} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 28px', borderRadius: 11, background: tk.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif", boxShadow: '0 4px 18px rgba(167,123,40,.3)' }}>
                    Suivant <ArrowRightIcon style={{ width: 15, height: 15 }} />
                  </button>
                ) : (
                  <button key="confirm-package" type="submit" disabled={loading || quoting || !quoteValid} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 32px', borderRadius: 11, background: tk.emerald, color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .65 : 1, fontSize: 14, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif", boxShadow: '0 4px 18px rgba(5,150,105,.28)' }}>
                    {loading
                      ? <><span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin .8s linear infinite', display: 'inline-block' }} /> Enregistrement…</>
                      : <><TruckIcon style={{ width: 15, height: 15 }} /> Confirmer & Générer le bordereau</>}
                  </button>
                )}
              </div>
            </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes zoom-slow { from { transform:scale(1) } to { transform:scale(1.06) } }
        @keyframes spin { to { transform:rotate(360deg) } }
        @media print {
          body > *:not(.invoice-print) { display: none !important; }
        }
      `}</style>
    </div>
  );
}
