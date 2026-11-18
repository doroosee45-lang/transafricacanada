import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { COUNTRY_OPTIONS } from '../../config/currencies';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBagIcon,
  ScaleIcon,
  ArrowRightIcon,
  SparklesIcon,
  TagIcon,
  GlobeAltIcon,
  CurrencyEuroIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';

const tk = {
  ink:     '#171614',
  ink80:   '#26231e',
  surface: '#faf8f5',
  surf2:   '#f5efe6',
  border:  '#e9e1d5',
  accent:  '#a77b28',
  emerald: '#059669',
  rose:    '#dc2626',
  amber:   '#d97706',
  textSec: '#4b5a6e',
  textMut: '#8494a9',
};

const FeatureChip = ({ icon: Icon, label, color }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: `${color}12`, border: `1px solid ${color}25`,
    borderRadius: 99, padding: '5px 12px',
  }}>
    <Icon style={{ width: 12, height: 12, color }} />
    <span style={{ fontSize: 11, fontWeight: 600, color, letterSpacing: '.04em' }}>{label}</span>
  </div>
);

const MarketplaceHub = () => {
  const navigate = useNavigate();
  // Statistiques RÉELLES (avant : « +500 », « 48h », « +200 », « 3€ », « 30+ » codés en dur).
  // Pas de « prix moyen / kg » : une moyenne entre devises différentes n'a pas de sens.
  const [hub, setHub] = useState(null);
  useEffect(() => {
    let alive = true;
    Promise.allSettled([
      axios.get('/marketplace/products', { params: { limit: 1 } }),
      axios.get('/marketplace/products', { params: { limit: 1, status: 'sold' } }),
      axios.get('/marketplace/kilos/stats'),
    ]).then(([active, sold, kilos]) => {
      if (!alive) return;
      const total = (r) => (r.status === 'fulfilled' ? r.value.data?.pagination?.total ?? null : null);
      const k = kilos.status === 'fulfilled' ? kilos.value.data?.data : null;
      setHub({
        activeProducts: total(active),
        soldProducts: total(sold),
        openOffers: k ? (k.available || 0) + (k.partial || 0) : null,
        freeKilos: k ? Math.max(0, (k.totalWeight || 0) - (k.reservedWeight || 0)) : null,
      });
    });
    return () => { alive = false; };
  }, []);
  const show = (v, suffix = '') => (v === null || v === undefined ? '—' : `${Number(v).toLocaleString('fr-FR')}${suffix}`);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── HERO ── */}
      <section className="easy-internal-header" style={{
        position: 'relative', height: 280,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', marginBottom: 36, borderRadius: 24,
      }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#37312a', padding: '0 24px', maxWidth: 620 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
            padding: '6px 18px', marginBottom: 20,
          }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#ecd5a3' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
              MARKETPLACE
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(26px,4vw,42px)', fontWeight: 800, lineHeight: 1.15, marginBottom: 14, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            La plateforme{' '}
            <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              d'échange
            </span>{' '}
            EASY
          </h1>
          <p style={{ color: '#37312a', fontSize: 14, lineHeight: 1.7 }}>
            Vendez vos colis ou achetez de l'espace kilo pour vos expéditions internationales.
          </p>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ── DEUX CARTES PRINCIPALES ── */}
      <div className="mkt-hub-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 24, marginBottom: 40,
      }}>

        {/* ── VENDRE UN COLIS ── */}
        <div style={{
          background: '#fff',
          borderRadius: 24,
          border: `1.5px solid ${tk.border}`,
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(23,22,20,.07)',
          display: 'flex', flexDirection: 'column',
          transition: 'transform .2s, box-shadow .2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 56px rgba(167,123,40,.14)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(23,22,20,.07)'; }}
        >
          {/* Couleur bande */}
          <div style={{ height: 5, background: 'linear-gradient(90deg, #a77b28, #d9b465)' }} />

          <div style={{ padding: '32px 32px 28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Icône */}
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg, #a77b28, #d9b465)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(167,123,40,.3)',
            }}>
              <ShoppingBagIcon style={{ width: 30, height: 30, color: '#fff' }} />
            </div>

            {/* Titre */}
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 10 }}>
                Vendre un Produit
              </h2>
              <p style={{ fontSize: 14, color: tk.textSec, lineHeight: 1.7 }}>
                Publiez une annonce pour vendre votre colis ou votre marchandise.
                Fixez votre prix et entrez en contact avec des acheteurs partout dans le monde.
              </p>
            </div>

            {/* Features */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <FeatureChip icon={TagIcon}          label="Prix libre"         color={tk.accent} />
              <FeatureChip icon={GlobeAltIcon}     label="International"      color={tk.accent} />
              <FeatureChip icon={CurrencyEuroIcon} label="Paiement sécurisé"  color={tk.accent} />
            </div>

            {/* Stats */}
            <div style={{
              background: tk.surface, borderRadius: 14,
              padding: '14px 18px',
              display: 'flex', gap: 24,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: tk.accent, fontFamily: "'Open Sans',Arial,sans-serif" }}>{show(hub?.activeProducts)}</div>
                <div style={{ fontSize: 11, color: tk.textMut }}>Annonces actives</div>
              </div>
              <div style={{ width: 1, background: tk.border }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: tk.accent, fontFamily: "'Open Sans',Arial,sans-serif" }}>{show(hub?.soldProducts)}</div>
                <div style={{ fontSize: 11, color: tk.textMut }}>Produits vendus</div>
              </div>
              <div style={{ width: 1, background: tk.border }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: tk.accent, fontFamily: "'Open Sans',Arial,sans-serif" }}>0%</div>
                <div style={{ fontSize: 11, color: tk.textMut }}>Commission</div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div style={{
            padding: '20px 32px 28px',
            display: 'flex', flexDirection: 'column', gap: 10,
            borderTop: `1px solid ${tk.border}`,
          }}>
            <button
              onClick={() => navigate('/app/marketplace/products/add')}
              style={{
                width: '100%', padding: '14px 24px', borderRadius: 12,
                background: 'linear-gradient(135deg, #a77b28, #8a6520)',
                color: '#fff', border: 'none',
                fontSize: 15, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif",
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 18px rgba(167,123,40,.35)',
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Publier une annonce
              <ArrowRightIcon style={{ width: 16, height: 16 }} />
            </button>
            <button
              onClick={() => navigate('/app/marketplace/products')}
              style={{
                width: '100%', padding: '12px 24px', borderRadius: 12,
                background: 'none',
                color: tk.accent, border: `1.5px solid ${tk.accent}22`,
                fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(167,123,40,.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              Voir les annonces
            </button>
          </div>
        </div>

        {/* ── ACHETER UN KILO ── */}
        <div style={{
          background: '#fff',
          borderRadius: 24,
          border: `1.5px solid ${tk.border}`,
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(23,22,20,.07)',
          display: 'flex', flexDirection: 'column',
          transition: 'transform .2s, box-shadow .2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 56px rgba(5,150,105,.14)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(23,22,20,.07)'; }}
        >
          {/* Couleur bande */}
          <div style={{ height: 5, background: 'linear-gradient(90deg, #059669, #34d399)' }} />

          <div style={{ padding: '32px 32px 28px', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Icône */}
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg, #059669, #34d399)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(5,150,105,.3)',
            }}>
              <ScaleIcon style={{ width: 30, height: 30, color: '#fff' }} />
            </div>

            {/* Titre */}
            <div>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 10 }}>
                Acheter un kilo
              </h2>
              <p style={{ fontSize: 14, color: tk.textSec, lineHeight: 1.7 }}>
                Réservez de l'espace dans les bagages de voyageurs en partance.
                Envoyez vos affaires à moindre coût sur des destinations internationales.
              </p>
            </div>

            {/* Features */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              <FeatureChip icon={TruckIcon}        label="Livraison rapide"   color={tk.emerald} />
              <FeatureChip icon={GlobeAltIcon}     label="Toutes destinations" color={tk.emerald} />
              <FeatureChip icon={CurrencyEuroIcon} label="Prix par kg"         color={tk.emerald} />
            </div>

            {/* Stats */}
            <div style={{
              background: tk.surface, borderRadius: 14,
              padding: '14px 18px',
              display: 'flex', gap: 24,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: tk.emerald, fontFamily: "'Open Sans',Arial,sans-serif" }}>{show(hub?.openOffers)}</div>
                <div style={{ fontSize: 11, color: tk.textMut }}>Offres disponibles</div>
              </div>
              <div style={{ width: 1, background: tk.border }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: tk.emerald, fontFamily: "'Open Sans',Arial,sans-serif" }}>{show(hub?.freeKilos, ' kg')}</div>
                <div style={{ fontSize: 11, color: tk.textMut }}>Kilos disponibles</div>
              </div>
              <div style={{ width: 1, background: tk.border }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: tk.emerald, fontFamily: "'Open Sans',Arial,sans-serif" }}>{COUNTRY_OPTIONS.length}</div>
                <div style={{ fontSize: 11, color: tk.textMut }}>Pays configurés</div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div style={{
            padding: '20px 32px 28px',
            display: 'flex', flexDirection: 'column', gap: 10,
            borderTop: `1px solid ${tk.border}`,
          }}>
            <button
              onClick={() => navigate('/app/marketplace/kilos')}
              style={{
                width: '100%', padding: '14px 24px', borderRadius: 12,
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: '#fff', border: 'none',
                fontSize: 15, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif",
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 18px rgba(5,150,105,.35)',
                transition: 'opacity .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Parcourir les offres
              <ArrowRightIcon style={{ width: 16, height: 16 }} />
            </button>
            <button
              onClick={() => navigate('/app/marketplace/my-kilos-bought')}
              style={{
                width: '100%', padding: '12px 24px', borderRadius: 12,
                background: 'none',
                color: tk.emerald, border: `1.5px solid ${tk.emerald}22`,
                fontSize: 13, fontWeight: 600,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                transition: 'background .15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(5,150,105,.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              Mes réservations
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
        @media (max-width: 767px) {
          .mkt-hub-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default MarketplaceHub;
