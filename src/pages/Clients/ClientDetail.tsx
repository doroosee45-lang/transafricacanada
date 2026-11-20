import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  EnvelopeIcon, PhoneIcon, MapPinIcon,
  BuildingOfficeIcon, SparklesIcon,
  CubeIcon, CurrencyDollarIcon, UserIcon,
  ArrowLeftIcon, PlusIcon, CheckCircleIcon,
  TruckIcon, ClockIcon, ArrowRightIcon,
  MagnifyingGlassIcon, BanknotesIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { formatMoney, formatByCurrency, sumByCurrency, listToCurrencyMap } from '../../config/currencies';
import { asHttpError } from '../../types/api';
import type { Client, Package, Payment } from '../../types/models';
import type { IconComponent } from '../../types/ui';
import type { CurrencyAmount } from '../../config/currencies';

/** Identifiant d'une référence de colis, peuplée (objet) ou non (chaîne). */
const refId = (r: Package | string) => (typeof r === 'string' ? r : r._id);

interface StatusCfg { label: string; bg: string; color: string; border: string; dot: string }
/** Statistiques du client calculées par le serveur. */
interface ClientStats {
  totalPackages?: number;
  delivered?: number;
  pendingPackages?: number;
  spentByCurrency?: CurrencyAmount[];
}
interface InfoRowProps { icon: IconComponent; label?: string; value?: React.ReactNode; href?: string }
interface EmptyStateProps { icon: IconComponent; title: React.ReactNode; subtitle?: React.ReactNode; action?: React.ReactNode }

/* ── Tokens ── */
const tk = {
  ink: '#172F50', ink80: '#172F50',
  surface: '#F7FAFE', surf2: '#EDF5FC',
  border: '#DCE9F5',
  accent: '#4D91D9', emerald: '#059669',
  amber: '#d97706', rose: '#dc2626',
  textSec: '#52677D', textMut: '#8295A8',
};

/* ── Statuts colis (enum modèle) ── */
const STATUS_CFG: Record<string, StatusCfg> = {
  registered:       { label: 'Enregistré',          bg: '#F7FAFE', color: '#347FC5', border: '#DCE9F5', dot: '#79B5E8' },
  preparing:        { label: 'En préparation',       bg: '#fefce8', color: '#92400e', border: '#fde68a', dot: '#f59e0b' },
  transit:          { label: 'En transit',           bg: '#EDF5FC', color: '#172F50', border: '#DCE9F5', dot: '#79B5E8' },
  customs:          { label: 'En douane',            bg: '#fdf4ff', color: '#7e22ce', border: '#e9d5ff', dot: '#a855f7' },
  arrived:          { label: 'Arrivé',               bg: '#ecfdf5', color: '#065f46', border: '#a7f3d0', dot: '#10b981' },
  out_for_delivery: { label: 'En livraison',         bg: '#fff7ed', color: '#9a3412', border: '#fed7aa', dot: '#4D91D9' },
  delivered:        { label: 'Livré',                bg: '#d1fae5', color: '#065f46', border: '#6ee7b7', dot: '#059669' },
  returned:         { label: 'Retourné',             bg: '#fee2e2', color: '#991b1b', border: '#fecaca', dot: '#ef4444' },
  lost:             { label: 'Perdu',                bg: '#f1f5f9', color: '#475569', border: '#cbd5e1', dot: '#94a3b8' },
};

const PKG_TYPE_LABELS: Record<string, string> = {
  document:     '📄 Document',
  clothing:     '👕 Vêtements',
  electronics:  '📱 Électronique',
  food:         '🍱 Alimentaire',
  cosmetics:    '💄 Cosmétiques',
  fragile_item: '🔮 Fragile',
  other:        '📦 Autre',
};

const StatusBadge = ({ status }: { status?: string }) => {
  const cfg = (status && STATUS_CFG[status]) || STATUS_CFG.registered;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 99,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      fontSize: 11, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
};

/* ── Info row sidebar ── */
const InfoRow = ({ icon: Ic, label, value, href }: InfoRowProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: tk.surface, border: `1px solid ${tk.border}` }}>
    <Ic style={{ width: 14, height: 14, color: tk.accent, flexShrink: 0 }} />
    {href
      ? <a href={href} style={{ fontSize: 12, color: tk.accent, fontWeight: 500, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || '—'}</a>
      : <span style={{ fontSize: 12, color: tk.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || '—'}</span>
    }
  </div>
);

/* ── Empty state ── */
const EmptyState = ({ icon: Ic, title, subtitle, action }: EmptyStateProps) => (
  <div style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
    <div style={{ width: 56, height: 56, borderRadius: 16, background: tk.surf2, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
      <Ic style={{ width: 26, height: 26, color: tk.textMut }} />
    </div>
    <p style={{ fontSize: 15, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif" }}>{title}</p>
    <p style={{ fontSize: 13, color: tk.textMut, maxWidth: 280 }}>{subtitle}</p>
    {action}
  </div>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client,   setClient]   = useState<Client | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats,    setStats]    = useState<ClientStats>({});
  const [loading,  setLoading]  = useState(true);
  const [pkgLoading, setPkgLoading] = useState(false);
  const [activeTab, setActiveTab]   = useState('packages');
  const [search, setSearch]         = useState('');

  /* ── Fetch ── */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [clientRes, pkgRes, payRes, statsRes] = await Promise.all([
        axios.get(`/clients/${id}`),
        axios.get(`/clients/${id}/packages`),
        axios.get(`/clients/${id}/payments`),
        axios.get(`/clients/${id}/stats`),
      ]);
      // sendResponse spreads {data:...} → res.data.data est le payload
      setClient(  clientRes.data?.data  || null);
      setPackages(pkgRes.data?.data     || []);
      setPayments(payRes.data?.data     || []);
      setStats(   statsRes.data?.data   || {});
    } catch (caught) {
      const err = asHttpError(caught);
      // 404 : fiche inexistante OU hors du périmètre de l'utilisateur (le serveur ne distingue pas).
      if (err.response?.status === 404) toast.error('Client introuvable.');
      else { console.error(err); toast.error('Erreur lors du chargement des données'); }
      navigate('/app/clients');
    } finally { setLoading(false); }
  }, [id, navigate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  /* ── Refresh packages uniquement ── */
  const refreshPackages = async () => {
    setPkgLoading(true);
    try {
      const [pkgRes, statsRes] = await Promise.all([
        axios.get(`/clients/${id}/packages`),
        axios.get(`/clients/${id}/stats`),
      ]);
      setPackages(pkgRes.data?.data   || []);
      setStats(   statsRes.data?.data || {});
    } catch { toast.error('Erreur rafraîchissement'); }
    finally { setPkgLoading(false); }
  };

  /* ── Filtrage local ── */
  const filteredPackages = packages.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.trackingNumber?.toLowerCase().includes(q) ||
      p.origin?.toLowerCase().includes(q) ||
      p.destination?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      STATUS_CFG[p.status ?? '']?.label?.toLowerCase().includes(q)
    );
  });

  /* ── Loading ── */
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 320 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, border: `3px solid ${tk.surf2}`, borderTop: `3px solid ${tk.accent}`, borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ fontSize: 13, color: tk.textMut }}>Chargement du profil…</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!client) return (
    <div style={{ textAlign: 'center', padding: '64px 0' }}>
      <p style={{ color: tk.rose, marginBottom: 16 }}>Client introuvable</p>
      <button onClick={() => navigate('/app/clients')} style={{ padding: '10px 22px', borderRadius: 10, background: '#347FC5', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Open Sans',Arial,sans-serif", fontWeight: 600 }}>
        Retour à la liste
      </button>
    </div>
  );

  /* ════════════════════════════════
     RENDER
  ════════════════════════════════ */
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Hero ── */}
      <section className="easy-internal-header" style={{ position: 'relative', height: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 28, borderRadius: 24 }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#172F50', padding: '0 24px', maxWidth: 640 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 99, padding: '6px 16px', marginBottom: 16 }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#C5DCEF' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>Profil client</span>
          </div>
          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 10, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            {client.firstName}{' '}
            <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{client.lastName}</span>
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 12, padding: '7px 18px' }}>
            {client.email && <span style={{ fontSize: 12, color: '#172F50' }}>{client.email}</span>}
            {client.phone && <><span style={{ width: 1, height: 13, background: 'rgba(255,255,255,.25)' }} /><span style={{ fontSize: 12, color: '#172F50' }}>{client.phone}</span></>}
            {client.country && <><span style={{ width: 1, height: 13, background: 'rgba(255,255,255,.25)' }} /><span style={{ fontSize: 12, color: '#C5DCEF', fontWeight: 600 }}>{client.country}</span></>}
          </div>
        </div>
        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ── Bouton retour ── */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => navigate('/app/clients')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, background: '#fff', border: `1.5px solid ${tk.border}`, color: tk.textSec, cursor: 'pointer', fontSize: 13, fontWeight: 500, boxShadow: '0 1px 4px rgba(0,0,0,.05)' }}>
          <ArrowLeftIcon style={{ width: 14, height: 14 }} /> Retour à la liste
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid-kpi-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Total colis',    value: stats.totalPackages  || 0, icon: CubeIcon,          color: tk.accent,  bg: 'rgba(77,145,217,.08)'  },
          { label: 'Livrés',         value: stats.delivered      || 0, icon: CheckCircleIcon,   color: tk.emerald, bg: 'rgba(5,150,105,.08)'  },
          { label: 'En cours',       value: stats.pendingPackages|| 0, icon: ClockIcon,         color: tk.amber,   bg: 'rgba(217,119,6,.08)'  },
          { label: 'Total dépensé',  value: formatByCurrency(listToCurrencyMap(stats.spentByCurrency)), icon: CurrencyDollarIcon, color: '#7c3aed', bg: 'rgba(124,58,237,.08)' },
        ].map(({ label, value, icon: Ic, color, bg }, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, border: `1.5px solid ${tk.border}`, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 8px rgba(23,47,80,.04)' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Ic style={{ width: 20, height: 20, color }} />
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 3 }}>{label}</p>
              <p style={{ fontSize: 22, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", lineHeight: 1 }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Grille principale ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>

        {/* ── Sidebar ── */}
        <div>
          <div style={{ position: 'sticky', top: 24, borderRadius: 18, overflow: 'hidden', border: `1.5px solid ${tk.border}` }}>
            {/* Avatar header */}
            <div style={{ background: `linear-gradient(145deg,${tk.ink} 0%,${tk.ink80} 100%)`, padding: '24px 18px', textAlign: 'center' }}>
              <div style={{ width: 68, height: 68, margin: '0 auto 12px', background: 'rgba(77,145,217,.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid rgba(255,255,255,.15)', fontWeight: 800, fontSize: 22, color: '#C5DCEF', fontFamily: "'Open Sans',Arial,sans-serif" }}>
                {client.firstName?.[0]}{client.lastName?.[0]}
              </div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 3 }}>
                {client.firstName} {client.lastName}
              </p>
              <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 6, background: 'rgba(77,145,217,.3)', color: '#C5DCEF', fontSize: 11, fontWeight: 600 }}>
                {client.country}
              </span>
            </div>

            {/* Infos */}
            <div style={{ background: '#fff', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {client.email  && <InfoRow icon={EnvelopeIcon} label="Email"     value={client.email}  href={`mailto:${client.email}`} />}
              {client.phone  && <InfoRow icon={PhoneIcon}    label="Téléphone" value={client.phone}  href={`tel:${client.phone}`} />}
              {client.address && <InfoRow icon={MapPinIcon}  label="Adresse"   value={client.address} />}
              {client.notes  && (
                <div style={{ padding: '10px 12px', borderRadius: 10, background: '#fefce8', border: `1px solid #fde68a` }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#92400e', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>Notes</p>
                  <p style={{ fontSize: 12, color: '#78350f' }}>{client.notes}</p>
                </div>
              )}
            </div>

            {/* Action */}
            <div style={{ padding: '12px', borderTop: `1px solid ${tk.border}`, background: tk.surface }}>
              <button
                onClick={() => navigate('/app/packages/add', { state: { clientId: id } })}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '10px 0', borderRadius: 10, background: '#347FC5', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif", boxShadow: '0 3px 12px rgba(77,145,217,.25)' }}
              >
                <PlusIcon style={{ width: 14, height: 14 }} /> Nouveau colis
              </button>
            </div>
          </div>
        </div>

        {/* ── Contenu principal ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Card avec onglets */}
          <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(23,47,80,.06)' }}>

            {/* Tab bar */}
            <div style={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${tk.border}`, background: tk.surface, padding: '0 8px' }}>
              {[
                { key: 'packages', label: `Colis (${packages.length})`, icon: CubeIcon },
                { key: 'payments', label: `Paiements (${payments.length})`, icon: CurrencyDollarIcon },
              ].map(({ key, label, icon: Ic }) => {
                const active = activeTab === key;
                return (
                  <button key={key} onClick={() => setActiveTab(key)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', borderBottom: `2.5px solid ${active ? tk.accent : 'transparent'}`, color: active ? tk.accent : tk.textMut, fontSize: 13, fontWeight: active ? 700 : 500, fontFamily: "'Open Sans',Arial,sans-serif", transition: 'all .15s', marginBottom: '-1px' }}>
                    <Ic style={{ width: 14, height: 14 }} />{label}
                  </button>
                );
              })}

              {/* Recherche + bouton */}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}>
                {activeTab === 'packages' && (
                  <div style={{ position: 'relative' }}>
                    <MagnifyingGlassIcon style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: tk.textMut }} />
                    <input
                      type="text"
                      placeholder="Rechercher…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      style={{ paddingLeft: 30, paddingRight: 10, paddingTop: 6, paddingBottom: 6, borderRadius: 8, border: `1.5px solid ${tk.border}`, fontSize: 12, color: tk.ink, background: '#fff', outline: 'none', width: 160, fontFamily: "'DM Sans',sans-serif" }}
                    />
                  </div>
                )}
                <button
                  onClick={() => navigate(
                    activeTab === 'packages' ? '/app/packages/add' : '/app/payments/add',
                    { state: { clientId: id } }
                  )}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, background: activeTab === 'payments' ? tk.emerald : '#347FC5', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif", boxShadow: '0 2px 10px rgba(77,145,217,.2)', whiteSpace: 'nowrap' }}
                >
                  <PlusIcon style={{ width: 13, height: 13 }} />
                  {activeTab === 'packages' ? 'Nouveau colis' : 'Nouveau paiement'}
                </button>
              </div>
            </div>

            {/* ═══════ TAB : COLIS ═══════ */}
            {activeTab === 'packages' && (
              pkgLoading ? (
                <div style={{ padding: 40, textAlign: 'center' }}>
                  <div style={{ width: 32, height: 32, border: `2px solid ${tk.surf2}`, borderTop: `2px solid ${tk.accent}`, borderRadius: '50%', animation: 'spin .8s linear infinite', margin: '0 auto' }} />
                </div>
              ) : filteredPackages.length === 0 ? (
                <EmptyState
                  icon={CubeIcon}
                  title={search ? "Aucun colis trouvé" : "Aucun colis pour ce client"}
                  subtitle={search ? `Aucun résultat pour « ${search} »` : "Ce client n'a encore aucun colis enregistré."}
                  action={
                    !search && (
                      <button onClick={() => navigate('/app/packages/add', { state: { clientId: id } })} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, background: '#347FC5', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                        <PlusIcon style={{ width: 14, height: 14 }} /> Créer le premier colis
                      </button>
                    )
                  }
                />
              ) : (
                <div>
                  {/* Header tableau */}
                  <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 100px 80px 110px 100px', gap: 8, padding: '10px 20px', background: '#f8fafc', borderBottom: `1px solid ${tk.border}` }}>
                    {['N° Suivi', 'Trajet', 'Poids', 'Type', 'Statut', 'Date'].map(h => (
                      <p key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", margin: 0 }}>{h}</p>
                    ))}
                  </div>

                  {/* Lignes */}
                  {filteredPackages.map((pkg, i) => (
                    <div
                      key={pkg._id}
                      onClick={() => navigate(`/app/packages/${pkg._id}`)}
                      style={{
                        display: 'grid', gridTemplateColumns: '160px 1fr 100px 80px 110px 100px',
                        gap: 8, padding: '14px 20px', cursor: 'pointer',
                        borderBottom: i < filteredPackages.length - 1 ? `1px solid ${tk.border}` : 'none',
                        transition: 'background .15s', alignItems: 'center',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = tk.surface}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Numéro de suivi */}
                      <div>
                        <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: tk.accent, letterSpacing: '.06em' }}>
                          {pkg.trackingNumber}
                        </span>
                        {pkg.fragile && <span style={{ marginLeft: 6, fontSize: 10, padding: '1px 6px', borderRadius: 4, background: '#fef3c7', color: '#92400e' }}>Fragile</span>}
                      </div>

                      {/* Trajet origine → destination */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: tk.accent, whiteSpace: 'nowrap' }}>{pkg.origin}</span>
                        <ArrowRightIcon style={{ width: 12, height: 12, color: tk.textMut, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: tk.emerald, whiteSpace: 'nowrap' }}>{pkg.destination}</span>
                      </div>

                      {/* Poids */}
                      <span style={{ fontSize: 13, fontWeight: 600, color: tk.ink }}>{pkg.weight} kg</span>

                      {/* Type */}
                      <span style={{ fontSize: 11, color: tk.textSec }}>{PKG_TYPE_LABELS[pkg.packageType ?? ''] || '📦'}</span>

                      {/* Statut */}
                      <StatusBadge status={pkg.status} />

                      {/* Date */}
                      <span style={{ fontSize: 11, color: tk.textMut }}>
                        {new Date(pkg.createdAt as string).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' })}
                      </span>
                    </div>
                  ))}

                  {/* Footer récap */}
                  <div style={{ padding: '12px 20px', background: tk.surface, borderTop: `1px solid ${tk.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: 12, color: tk.textMut }}>
                      {filteredPackages.length} colis{search ? ` (filtré sur ${packages.length})` : ''}
                    </p>
                    <button onClick={refreshPackages} style={{ fontSize: 12, color: tk.accent, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                      ↻ Rafraîchir
                    </button>
                  </div>
                </div>
              )
            )}

            {/* ═══════ TAB : PAIEMENTS ═══════ */}
            {activeTab === 'payments' && (
              payments.length === 0 ? (
                <EmptyState
                  icon={BanknotesIcon}
                  title="Aucun paiement enregistré"
                  subtitle="Les paiements de ce client apparaîtront ici dès qu'une facture est créée."
                  action={
                    <button
                      onClick={() => navigate('/app/payments/add', { state: { clientId: id } })}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, background: tk.emerald, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif" }}
                    >
                      <PlusIcon style={{ width: 14, height: 14 }} /> Créer un paiement
                    </button>
                  }
                />
              ) : (
                <div>
                  {/* Entêtes */}
                  <div style={{ display: 'grid', gridTemplateColumns: '150px 100px 100px 120px 1fr 90px', gap: 8, padding: '10px 20px', background: '#f8fafc', borderBottom: `1px solid ${tk.border}` }}>
                    {['Facture', 'Montant', 'Statut', 'Méthode', 'Colis liés', 'Date'].map(h => (
                      <p key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", margin: 0 }}>{h}</p>
                    ))}
                  </div>

                  {payments.map((pay, i) => {
                    const statusCfg = ({
                      paid:      { bg: 'rgba(5,150,105,.1)',  color: tk.emerald, label: 'Payé'       },
                      pending:   { bg: 'rgba(217,119,6,.1)',  color: tk.amber,   label: 'En attente' },
                      partial:   { bg: 'rgba(77,145,217,.1)',  color: tk.accent,  label: 'Partiel'    },
                      refunded:  { bg: 'rgba(77,145,217,.1)',  color: tk.accent,  label: 'Remboursé'  },
                      cancelled: { bg: 'rgba(220,38,38,.1)',  color: tk.rose,    label: 'Annulé'     },
                    } as Record<string, { bg: string; color: string; label: string }>)[pay.status ?? ''] || { bg: 'rgba(217,119,6,.1)', color: tk.amber, label: pay.status };

                    const methodLabel = ({
                      cash:'💵 Espèces', card:'💳 Carte', bank_transfer:'🏦 Virement',
                      mobile_money:'📱 Mobile', cheque:'📝 Chèque',
                    } as Record<string, string>)[pay.method ?? ''] || pay.method || '—';

                    // Colis liés (packages[] ou package singulier)
                    const pkgList = [
                      ...(pay.packages || []),
                      ...(pay.package && !pay.packages?.find(p => refId(p) === refId(pay.package as Package | string)) ? [pay.package] : []),
                    ];

                    return (
                      <div
                        key={pay._id}
                        onClick={() => navigate(`/app/payments/${pay._id}`)}
                        style={{ display: 'grid', gridTemplateColumns: '150px 100px 100px 120px 1fr 90px', gap: 8, padding: '14px 20px', borderBottom: i < payments.length - 1 ? `1px solid ${tk.border}` : 'none', alignItems: 'center', cursor: 'pointer', transition: 'background .15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = tk.surface}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: tk.accent }}>{pay.invoiceNumber || '—'}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: tk.ink }}>{formatMoney(pay.amount || 0, pay.currency)}</span>
                        <span style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: 99, background: statusCfg.bg, color: statusCfg.color, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>{statusCfg.label}</span>
                        <span style={{ fontSize: 12, color: tk.textSec }}>{methodLabel}</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {pkgList.length > 0 ? pkgList.map((pk, j) => (
                            <span key={j} style={{ fontSize: 10, fontFamily: 'monospace', padding: '2px 6px', borderRadius: 4, background: 'rgba(77,145,217,.07)', color: tk.accent, fontWeight: 600 }}>
                              {(typeof pk === 'string' ? undefined : pk.trackingNumber) || (typeof pk === 'string' ? pk.slice(-6) : '—')}
                            </span>
                          )) : <span style={{ fontSize: 12, color: tk.textMut }}>—</span>}
                        </div>
                        <span style={{ fontSize: 11, color: tk.textMut }}>{new Date(pay.createdAt as string).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' })}</span>
                      </div>
                    );
                  })}

                  <div style={{ padding: '12px 20px', background: tk.surface, borderTop: `1px solid ${tk.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: 12, color: tk.textMut }}>{payments.length} paiement(s)</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: tk.emerald }}>
                        Total encaissé : {formatByCurrency(sumByCurrency(payments.filter(p => p.status === 'paid'), p => p.amount, p => p.currency))}
                      </p>
                      <button
                        onClick={() => navigate('/app/payments/add', { state: { clientId: id } })}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 9, background: tk.emerald, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif" }}
                      >
                        <PlusIcon style={{ width: 12, height: 12 }} /> Nouveau paiement
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes zoom-slow { from{transform:scale(1)} to{transform:scale(1.06)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
};

export default ClientDetail;
