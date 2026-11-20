import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ScaleIcon, 
  CurrencyDollarIcon, 
  TruckIcon, 
  SparklesIcon,
  EyeIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { formatMoney, formatUnitPrice, formatByCurrency, listToCurrencyMap, offerCurrency } from '../../config/currencies';
import DataTable from '../../components/Common/DataTable';
import type { KiloOffer } from '../../types/models';
import type { CurrencyAmount } from '../../config/currencies';
import type { DataTableColumn } from '../../types/ui';

/** Réservation de kilos passée par l'utilisateur. */
interface KiloOrder { _id: string; offer?: KiloOffer | null; status?: string; createdAt?: string }
interface PurchaseStats { totalWeight?: number; totalSpentByCurrency?: CurrencyAmount[]; delivered?: number }

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

const MyKilosBought = () => {
  const [purchases, setPurchases] = useState<KiloOrder[]>([]);
  const [stats, setStats] = useState<PurchaseStats>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchases();
    fetchStats();
  }, []);

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/marketplace/my-kilos-bought');
      const data = Array.isArray(response.data?.data) ? response.data.data
                 : Array.isArray(response.data)        ? response.data
                 : [];
      setPurchases(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des achats');
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/marketplace/my-kilos-bought/stats');
      setStats(response.data?.data || response.data || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Statuts KiloOrder (enum backend)
  const ORDER_STATUS: Record<string, { bg: string; color: string; label: string }> = {
    pending:    { bg: 'rgba(217,119,6,.1)',  color: tk.amber,   label: 'En attente' },
    confirmed:  { bg: 'rgba(77,145,217,.1)',  color: tk.accent,  label: 'Confirmé' },
    paid:       { bg: 'rgba(77,145,217,.1)',  color: tk.accent,  label: 'Payé' },
    in_transit: { bg: 'rgba(124,58,237,.1)', color: '#7c3aed',  label: 'En transit' },
    delivered:  { bg: 'rgba(5,150,105,.1)',  color: tk.emerald, label: 'Livré' },
    cancelled:  { bg: 'rgba(220,38,38,.1)',  color: tk.rose,    label: 'Annulé' },
  };

  const columns: DataTableColumn<KiloOrder>[] = [
    {
      key: 'offer',
      label: 'Offre',
      render: (val) => val ? (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: tk.ink }}>
            {val.originCountry} → {val.destinationCountry}
          </div>
          <div style={{ fontSize: 11, color: tk.textMut }}>
            Départ : {val.departureDate ? new Date(val.departureDate).toLocaleDateString('fr-FR') : '—'}
          </div>
        </div>
      ) : <span style={{ color: tk.textMut }}>—</span>,
    },
    {
      key: 'reservedWeight',
      label: 'Poids réservé',
      render: (val) => <span style={{ fontWeight: 600 }}>{val || 0} kg</span>,
    },
    {
      key: 'pricePerKg',
      label: 'Prix/kg',
      render: (val, row) => <span style={{ color: tk.amber, fontWeight: 500 }}>{val != null ? formatUnitPrice(val, offerCurrency(row.offer)) : '—'}</span>,
    },
    {
      key: 'totalPrice',
      label: 'Total payé',
      render: (val, row) => <span style={{ fontWeight: 700, color: tk.emerald }}>{val != null ? formatMoney(val, offerCurrency(row.offer)) : '—'}</span>,
    },
    {
      key: 'status',
      label: 'Statut',
      render: (val) => {
        const s = ORDER_STATUS[val ?? ''] || ORDER_STATUS.pending;
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
      label: "Date d'achat",
      render: (val) => new Date(val).toLocaleDateString('fr-FR'),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            const offerId = row.offer?._id || row.offer;
            navigate(offerId ? `/app/marketplace/kilos/${offerId}` : '/app/marketplace/kilos');
          }}
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
              MES ACHATS
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Historique de vos{' '}
            <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              achats de kilos
            </span>
          </h1>
          <p style={{ color: '#172F50', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Consultez tous les kilos que vous avez achetés sur notre marketplace.
          </p>
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
            { label: 'Poids total acheté', value: `${(stats.totalWeight || 0).toLocaleString()} kg`, icon: ScaleIcon, color: tk.accent },
            { label: 'Dépense totale', value: formatByCurrency(listToCurrencyMap(stats.totalSpentByCurrency)), icon: CurrencyDollarIcon, color: tk.amber },
            { label: 'Livraisons reçues', value: stats.delivered || 0, icon: TruckIcon, color: tk.emerald },
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

        {/* ── Tableau des achats ── */}
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
                Historique des achats
              </span>
              <span style={{
                padding: '3px 10px', borderRadius: 99,
                background: 'rgba(77,145,217,.08)', color: tk.accent,
                fontSize: 11, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif",
              }}>
                {purchases.length} achat{purchases.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div style={{ padding: '0' }}>
            {!loading && purchases.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '48px 24px',
              }}>
                <ScaleIcon style={{
                  width: 56, height: 56, color: tk.textMut, margin: '0 auto 16px',
                }} />
                <h3 style={{ fontSize: 16, fontWeight: 600, color: tk.ink, marginBottom: 8 }}>
                  Aucun achat pour le moment
                </h3>
                <p style={{ fontSize: 13, color: tk.textMut, marginBottom: 16 }}>
                  Parcourez la marketplace pour acheter des kilos
                </p>
                <button
                  onClick={() => navigate('/app/marketplace/kilos')}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 24px', borderRadius: 10,
                    background: '#347FC5', color: '#fff', border: 'none',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Voir les annonces
                </button>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={purchases}
                onRowClick={(row) => {
                  const offerId = row.offer?._id || row.offer;
                  navigate(offerId ? `/app/marketplace/kilos/${offerId}` : '/app/marketplace/kilos');
                }}
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

export default MyKilosBought;