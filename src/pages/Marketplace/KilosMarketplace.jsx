import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COUNTRY_OPTIONS } from '../../config/currencies';
import {
  PlusIcon,
  ScaleIcon,
  SparklesIcon,
  ShoppingBagIcon,
  XMarkIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { formatMoney, offerCurrency } from '../../config/currencies';

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const tk = {
  ink:        '#171614',
  surface:    '#faf8f5',
  border:     '#e9e1d5',
  accent:     '#a77b28',
  accentDark: '#8a6520',
  emerald:    '#059669',
  amber:      '#d97706',
  rose:       '#dc2626',
  violet:     '#7c3aed',
  textSec:    '#4b5a6e',
  textMut:    '#8494a9',
};


const STATUS_CHIP = {
  available: { bg: 'rgba(5,150,105,.1)',   color: '#059669', label: 'Disponible' },
  partial:   { bg: 'rgba(167,123,40,.1)',   color: '#a77b28', label: 'Partiel' },
  full:      { bg: 'rgba(220,38,38,.1)',   color: '#dc2626', label: 'Complet' },
  expired:   { bg: 'rgba(132,148,169,.1)', color: '#8494a9', label: 'Expiré' },
};

const inputStyle = {
  width: '100%', padding: '9px 13px', borderRadius: 10,
  background: '#fff', color: tk.ink, fontSize: 13,
  border: `1.5px solid ${tk.border}`, outline: 'none',
  fontFamily: "'DM Sans', sans-serif", transition: 'border .18s',
  boxSizing: 'border-box',
};

/* ── Format date ── */
const fmt = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

/* ── Kilo Offer Card ── */
const OfferCard = ({ offer }) => {
  const navigate = useNavigate();
  const chip = STATUS_CHIP[offer.status] || STATUS_CHIP.available;
  const remaining = (offer.availableWeight || 0) - (offer.reservedWeight || 0);
  const pct = offer.availableWeight ? Math.round((offer.reservedWeight / offer.availableWeight) * 100) : 0;

  return (
    <div
      onClick={() => navigate(`/app/marketplace/kilos/${offer._id}`)}
      style={{
        background: '#fff', borderRadius: 18,
        border: `1.5px solid ${tk.border}`,
        overflow: 'hidden', cursor: 'pointer',
        transition: 'all .2s ease',
        display: 'flex', flexDirection: 'column',
        animation: 'fadeUp .3s ease both',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(167,123,40,.12)';
        e.currentTarget.style.borderColor = tk.accent;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = tk.border;
      }}
    >
      {/* ── Top bar : status + price ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 18px 0',
      }}>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
          background: chip.bg, color: chip.color, letterSpacing: '.04em',
        }}>
          {chip.label}
        </span>
        <span style={{ fontSize: 22, fontWeight: 800, color: tk.emerald, fontFamily: "'Open Sans',Arial,sans-serif" }}>
          {formatMoney(offer.pricePerKg, offerCurrency(offer))} <span style={{ fontSize: 13, fontWeight: 600 }}>/kg</span>
        </span>
      </div>

      {/* ── Trajet ── */}
      <div style={{ padding: '12px 18px 6px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 15, fontWeight: 700, color: tk.ink,
        }}>
          <span>{offer.originCountry}</span>
          <ArrowRightIcon style={{ width: 14, height: 14, color: tk.textMut, flexShrink: 0 }} />
          <span>{offer.destinationCountry}</span>
        </div>

        {offer.description && (
          <p style={{
            fontSize: 12, color: tk.textSec, lineHeight: 1.5, marginTop: 6,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {offer.description}
          </p>
        )}
      </div>

      {/* ── Poids progress ── */}
      <div style={{ padding: '10px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: tk.textMut, marginBottom: 4 }}>
          <span>Disponible : <strong style={{ color: tk.ink }}>{remaining} kg</strong></span>
          <span>Total : {offer.availableWeight} kg</span>
        </div>
        <div style={{ height: 5, borderRadius: 99, background: tk.border }}>
          <div style={{
            height: '100%', borderRadius: 99,
            background: pct >= 90 ? tk.rose : pct >= 60 ? tk.amber : tk.emerald,
            width: `${pct}%`, transition: 'width .4s',
          }} />
        </div>
      </div>

      {/* ── Dates + vendeur ── */}
      <div style={{
        padding: '10px 18px 14px',
        display: 'flex', flexDirection: 'column', gap: 5, flex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: tk.textSec }}>
          <CalendarDaysIcon style={{ width: 13, height: 13, color: tk.textMut, flexShrink: 0 }} />
          <span>Départ : <strong style={{ color: tk.ink }}>{fmt(offer.departureDate)}</strong></span>
        </div>
        {offer.arrivalDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: tk.textSec }}>
            <CalendarDaysIcon style={{ width: 13, height: 13, color: tk.textMut, flexShrink: 0 }} />
            <span>Arrivée estimée : <strong style={{ color: tk.ink }}>{fmt(offer.arrivalDate)}</strong></span>
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: '12px 18px', borderTop: `1px solid ${tk.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: tk.surface,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: `${tk.accent}15`, color: tk.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700,
          }}>
            {offer.seller?.firstName?.[0]}{offer.seller?.lastName?.[0]}
          </div>
          <span style={{ fontSize: 12, color: tk.textMut }}>
            {offer.seller?.firstName} {offer.seller?.lastName}
          </span>
        </div>
        <button
          onClick={e => { e.stopPropagation(); navigate(`/app/marketplace/kilos/${offer._id}`); }}
          style={{
            fontSize: 12, fontWeight: 600, color: '#fff',
            background: tk.accent, border: 'none', cursor: 'pointer',
            padding: '6px 14px', borderRadius: 8, transition: 'background .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = tk.accentDark}
          onMouseLeave={e => e.currentTarget.style.background = tk.accent}
        >
          Réserver →
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   PAGE PRINCIPALE
══════════════════════════════════════════ */
const KilosMarketplace = () => {
  const [offers, setOffers]   = useState([]);
  const [stats, setStats]     = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ origin: '', destination: '', maxPrice: '' });
  const navigate = useNavigate();

  /* ── Fetch offres avec AbortController ── */
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(
          Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
        ).toString();
        const res = await axios.get(
          `/marketplace/kilos${params ? `?${params}` : ''}`,
          { signal: controller.signal }
        );
        // Backend returns { data: { data: [...], pagination: {...} } } via paginateResponse
        const raw = res.data?.data;
        const list = Array.isArray(raw) ? raw
                   : Array.isArray(raw?.data) ? raw.data
                   : [];
        setOffers(list);
      } catch (err) {
        if (err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError') return;
        toast.error('Erreur lors du chargement des offres');
        setOffers([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [filters]);

  /* ── Fetch stats — une seule fois ── */
  useEffect(() => {
    axios.get('/marketplace/kilos/stats')
      .then(res => setStats(res.data?.data || {}))
      .catch(() => {});
  }, []);

  const hasFilters = filters.origin || filters.destination || filters.maxPrice;
  const resetFilters = () => setFilters({ origin: '', destination: '', maxPrice: '' });

  return (
    <div style={{ minHeight: '100vh', background: tk.surface }}>

      {/* ─────────────── HERO ─────────────── */}
      <section className="easy-internal-header" style={{
        position: 'relative', height: 280,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#37312a', padding: '0 24px', maxWidth: 640 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
            padding: '6px 16px', marginBottom: 18,
          }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#ecd5a3' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
              MARKETPLACE DE KILOS
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Achetez ou vendez{' '}
            <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              de l'espace de transport
            </span>
          </h1>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 20 }}>
            <button
              onClick={() => navigate('/app/marketplace/my-kilos-bought')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 24px', borderRadius: 12,
                background: '#fff', color: tk.ink,
                border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
                transition: 'all .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = tk.surface}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              <ShoppingBagIcon style={{ width: 16, height: 16 }} />
              Mes réservations
            </button>
            <button
              onClick={() => navigate('/app/marketplace/kilos/sell')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 24px', borderRadius: 12,
                background: tk.accent, color: '#fff',
                border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
                boxShadow: '0 4px 12px rgba(167,123,40,.3)', transition: 'all .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = tk.accentDark}
              onMouseLeave={e => e.currentTarget.style.background = tk.accent}
            >
              <PlusIcon style={{ width: 16, height: 16 }} />
              Proposer mes kilos
            </button>
          </div>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─────────────── CONTENU ─────────────── */}
      <div className="page-content" style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 20px 48px' }}>

        {/* ── Statistiques ── */}
        <div className="kilo-stats grid-kpi-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Offres disponibles',  value: (stats.available || 0) + (stats.partial || 0), color: tk.emerald,  icon: ScaleIcon },
            { label: 'Kg disponibles',       value: `${(stats.totalWeight    || 0).toLocaleString('fr-FR')} kg`, color: tk.accent,  icon: ScaleIcon },
            { label: 'Kg réservés',          value: `${(stats.reservedWeight || 0).toLocaleString('fr-FR')} kg`, color: tk.amber,   icon: ScaleIcon },
            { label: 'Total commandes',      value: stats.totalOrders || 0,              color: tk.violet,  icon: ScaleIcon },
          ].map((s, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: 16, padding: '16px 20px',
              border: `1.5px solid ${tk.border}`, boxShadow: '0 2px 8px rgba(23,22,20,.04)',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${s.color}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 10,
              }}>
                <s.icon style={{ width: 18, height: 18, color: s.color }} />
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Filtres ── */}
        <div style={{
          background: '#fff', borderRadius: 18,
          border: `1.5px solid ${tk.border}`,
          boxShadow: '0 2px 8px rgba(23,22,20,.05)',
          overflow: 'hidden', marginBottom: 20,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
          }}>
            <FunnelIcon style={{ width: 14, height: 14, color: tk.accent }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
              Filtrer les offres
            </span>
            {hasFilters && (
              <button onClick={resetFilters} style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 8,
                background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.15)',
                color: tk.rose, cursor: 'pointer', fontSize: 12, fontWeight: 500,
              }}>
                <XMarkIcon style={{ width: 12, height: 12 }} /> Réinitialiser
              </button>
            )}
          </div>
          <div className="kilo-filters" style={{ padding: '14px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: tk.textMut, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                Pays d'origine
              </label>
              <select value={filters.origin} onChange={e => setFilters(f => ({ ...f, origin: e.target.value }))} style={inputStyle}>
                <option value="">Tous les pays</option>
                {COUNTRY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: tk.textMut, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                Pays de destination
              </label>
              <select value={filters.destination} onChange={e => setFilters(f => ({ ...f, destination: e.target.value }))} style={inputStyle}>
                <option value="">Tous les pays</option>
                {COUNTRY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: tk.textMut, display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em' }}>
                Prix max / kg (devise de l'offre)
              </label>
              <input
                type="number"
                placeholder="Ex : 5.00"
                value={filters.maxPrice}
                onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))}
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* ── Grille des offres ── */}
        <div style={{
          background: '#fff', borderRadius: 18,
          border: `1.5px solid ${tk.border}`,
          boxShadow: '0 2px 8px rgba(23,22,20,.05)',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <ScaleIcon style={{ width: 16, height: 16, color: tk.accent }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                Offres de kilos disponibles
              </span>
              <span style={{
                padding: '3px 10px', borderRadius: 99,
                background: 'rgba(167,123,40,.08)', color: tk.accent,
                fontSize: 11, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif",
              }}>
                {offers.length} offre{offers.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={() => navigate('/app/marketplace/kilos/sell')}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 16px', borderRadius: 10,
                background: tk.accent, color: '#fff', border: 'none',
                fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = tk.accentDark}
              onMouseLeave={e => e.currentTarget.style.background = tk.accent}
            >
              <PlusIcon style={{ width: 14, height: 14 }} />
              Proposer
            </button>
          </div>

          <div style={{ padding: '20px' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  border: `3px solid ${tk.border}`, borderTopColor: tk.accent,
                  animation: 'spin .8s linear infinite',
                }} />
              </div>
            ) : offers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                <ScaleIcon style={{ width: 56, height: 56, color: tk.textMut, margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: 16, fontWeight: 600, color: tk.ink, marginBottom: 6 }}>Aucune offre disponible</h3>
                <p style={{ fontSize: 13, color: tk.textMut, marginBottom: 20 }}>
                  Soyez le premier à proposer des kilos !
                </p>
                <button
                  onClick={() => navigate('/app/marketplace/kilos/sell')}
                  style={{
                    padding: '10px 24px', borderRadius: 10,
                    background: tk.accent, color: '#fff', border: 'none',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Proposer des kilos
                </button>
              </div>
            ) : (
              <div className="kilo-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 18,
              }}>
                {offers.map((offer) => (
                  <OfferCard key={offer._id} offer={offer} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>


      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @media (max-width: 1023px) {
          .kilo-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 639px) {
          .kilo-grid { grid-template-columns: 1fr !important; }
          .kilo-stats { grid-template-columns: repeat(2,1fr) !important; }
          .kilo-filters { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default KilosMarketplace;
