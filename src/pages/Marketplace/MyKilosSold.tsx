import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ScaleIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  SparklesIcon, 
  ShoppingBagIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { formatMoney, formatUnitPrice, formatByCurrency, sumByCurrency, offerCurrency } from '../../config/currencies';
import DataTable from '../../components/Common/DataTable';
import type { KiloOffer } from '../../types/models';
import type { DataTableColumn } from '../../types/ui';

interface KiloSalesStats { totalOffers?: number; totalRevenue?: ReturnType<typeof sumByCurrency>; totalReserved?: number; activeOffers?: number }

/* ─────────────────────────────────────────────
   DESIGN TOKENS — identiques à ClientsList
───────────────────────────────────────────── */
const tk = {
  ink:        '#172F50',
  ink80:      '#172F50',
  surface:    '#F7FAFE',
  surf2:      '#EDF5FC',
  border:     '#DCE9F5',
  accent:     '#4D91D9',
  accentDark: '#347FC5',
  emerald:    '#059669',
  amber:      '#d97706',
  rose:       '#dc2626',
  textSec:    '#52677D',
  textMut:    '#8295A8',
};

const MyKilosSold = () => {
  const [sales, setSales] = useState<KiloOffer[]>([]);
  const [stats, setStats] = useState<KiloSalesStats>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSales();
    fetchStats();
  }, []);

  const fetchSales = async () => {
    setLoading(true);
    try {
      // Route correcte : mes offres de kilos publiées
      const response = await axios.get('/marketplace/kilos/my-offers');
      const data: KiloOffer[] = Array.isArray(response.data?.data) ? response.data.data
                 : Array.isArray(response.data)        ? response.data
                 : [];
      setSales(data);
      // Stats calculées localement depuis les offres
      setStats({
        totalOffers:    data.length,
        totalRevenue:   sumByCurrency(data, (o) => (o.reservedWeight || 0) * (o.pricePerKg || 0), (o) => offerCurrency(o)), // par devise
        totalReserved:  data.reduce((s, o) => s + (o.reservedWeight || 0), 0),
        activeOffers:   data.filter(o => ['available','partial'].includes(o.status ?? '')).length,
      });
    } catch (error) {
      toast.error('Erreur lors du chargement des offres');
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  // Stats calculées dans fetchSales
  const fetchStats = () => {};

  // Statuts KiloOffer
  const KILO_STATUS: Record<string, { label: string; bg: string; color: string }> = {
    available: { bg: 'rgba(5,150,105,.1)',  color: tk.emerald, label: 'Disponible' },
    partial:   { bg: 'rgba(217,119,6,.1)',  color: tk.amber,   label: 'Partiel' },
    full:      { bg: 'rgba(77,145,217,.1)',  color: tk.accent,  label: 'Complet' },
    expired:   { bg: 'rgba(220,38,38,.1)',  color: tk.rose,    label: 'Expiré' },
    cancelled: { bg: 'rgba(220,38,38,.1)',  color: tk.rose,    label: 'Annulé' },
  };

  const columns: DataTableColumn<KiloOffer>[] = [
    {
      key: 'originCountry',
      label: 'Trajet',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: tk.ink }}>{val} → {row.destinationCountry}</div>
          <div style={{ fontSize: 11, color: tk.textMut }}>
            Départ : {row.departureDate ? new Date(row.departureDate).toLocaleDateString('fr-FR') : '—'}
          </div>
        </div>
      ),
    },
    {
      key: 'availableWeight',
      label: 'Poids',
      render: (val, row) => (
        <div>
          <span style={{ fontWeight: 600, fontSize: 14, color: tk.ink }}>{val} kg</span>
          <div style={{ fontSize: 11, color: tk.textMut }}>
            Réservé : {row.reservedWeight || 0} kg
          </div>
        </div>
      ),
    },
    {
      key: 'pricePerKg',
      label: 'Prix/kg',
      render: (val, row) => <span style={{ fontWeight: 700, color: tk.emerald }}>{val != null ? formatUnitPrice(val, offerCurrency(row)) : '—'}</span>,
    },
    {
      key: 'reservedWeight',
      label: 'Revenu estimé',
      render: (val, row) => {
        const rev = (val || 0) * (row.pricePerKg || 0);
        return rev > 0
          ? <span style={{ fontWeight: 700, color: tk.accent }}>{formatMoney(rev, offerCurrency(row))}</span>
          : <span style={{ color: tk.textMut }}>—</span>;
      },
    },
    {
      key: 'status',
      label: 'Statut',
      render: (val) => {
        const s = KILO_STATUS[val ?? ''] || KILO_STATUS.available;
        return (
          <span style={{
            display: 'inline-flex', padding: '4px 12px', borderRadius: 99,
            background: s.bg, color: s.color,
            fontSize: 12, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
          }}>{s.label}</span>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Publié le',
      render: (val) => new Date(val).toLocaleDateString('fr-FR'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/app/marketplace/kilos/${row._id}`); }}
          style={{
            width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${tk.border}`,
            background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: tk.accent, transition: 'all .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(77,145,217,.06)'; e.currentTarget.style.borderColor = tk.accent; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
          title="Détails"
        >
          <EyeIcon style={{ width: 14, height: 14 }} />
        </button>
      ),
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: tk.surface }}>

      {/* ─────────────── HERO — identique à ClientsList ─────────────── */}
      <section className="easy-internal-header" style={{
        position: 'relative', height: 280,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#172F50', padding: '0 24px', maxWidth: 640 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
            padding: '6px 16px', marginBottom: 18,
          }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#C5DCEF' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
              MES VENTES
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Kilos vendus{' '}
            <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              historique de vos ventes
            </span>
          </h1>
          <p style={{ color: '#172F50', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Consultez toutes les transactions et revenus générés par la vente de vos kilos.
          </p>

          {/* Boutons style ClientsList */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/app/marketplace/my-kilos-bought')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 24px', borderRadius: 12,
                background: '#fff', color: tk.ink,
                border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.background = tk.surface; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#fff'; }}
            >
              <ShoppingBagIcon style={{ width: 16, height: 16 }} />
              Mes achats
            </button>
            <button
              onClick={() => navigate('/app/marketplace/my-sales')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 24px', borderRadius: 12,
                background: '#347FC5', color: '#fff',
                border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
                boxShadow: '0 4px 12px rgba(77,145,217,.3)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.background = '#172F50'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#347FC5'; }}
            >
              <ShoppingBagIcon style={{ width: 16, height: 16 }} />
              Mes ventes
            </button>
          </div>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─────────────── CONTENU ─────────────── */}
      <div className="page-content" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 48px' }}>

        {/* ── Cartes statistiques ── */}
        <div className="grid-kpi-3" style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16, marginBottom: 24,
        }}>
          {[
            { label: 'Poids réservé', value: `${(stats.totalReserved || 0).toLocaleString()} kg`, icon: ScaleIcon, color: tk.accent },
            { label: 'Revenu estimé', value: formatByCurrency(stats.totalRevenue), icon: CurrencyDollarIcon, color: tk.emerald },
            { label: 'Offres actives', value: stats.activeOffers || 0, icon: UserGroupIcon, color: tk.amber },
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: '#fff', borderRadius: 16, padding: '16px 20px',
              border: `1.5px solid ${tk.border}`, boxShadow: '0 2px 8px rgba(23,47,80,.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 12,
                  background: `${stat.color}10`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <stat.icon style={{ width: 18, height: 18, color: stat.color }} />
                </span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '.03em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Tableau des ventes ── */}
        <div style={{
          background: '#fff', borderRadius: 20,
          border: `1.5px solid ${tk.border}`,
          boxShadow: '0 2px 8px rgba(23,47,80,.05)',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 30, height: 30, borderRadius: 8, background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,.08)',
              }}>
                <ShoppingBagIcon style={{ width: 14, height: 14, color: tk.accent }} />
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                Historique des ventes
              </span>
              <span style={{
                padding: '3px 10px', borderRadius: 99,
                background: 'rgba(77,145,217,.08)', color: tk.accent,
                fontSize: 11, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif",
              }}>
                {sales.length} vente{sales.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div style={{ padding: '0' }}>
            {!loading && sales.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '48px 24px',
              }}>
                <ScaleIcon style={{
                  width: 56, height: 56, color: tk.textMut, margin: '0 auto 16px',
                }} />
                <h3 style={{ fontSize: 16, fontWeight: 600, color: tk.ink, marginBottom: 8 }}>
                  Aucune vente pour le moment
                </h3>
                <p style={{ fontSize: 13, color: tk.textMut, marginBottom: 16 }}>
                  Publiez des annonces pour vendre vos kilos
                </p>
                <button
                  onClick={() => navigate('/app/marketplace/kilos/sell')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 24px', borderRadius: 10,
                    background: '#347FC5', color: '#fff', border: 'none',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Vendre des kilos
                </button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={sales}
                onRowClick={(row) => navigate(`/app/marketplace/kilos/${row._id}`)}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>


      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
      `}</style>
    </div>
  );
};

export default MyKilosSold;