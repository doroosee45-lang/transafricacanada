import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  CurrencyDollarIcon,
  CubeIcon,
  UserGroupIcon,
  TruckIcon,
  SparklesIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  ClockIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { formatMoney, formatByCurrency, listToCurrencyMap } from '../../config/currencies';
import type { CurrencyAmount } from '../../config/currencies';

/** Agrégat MongoDB { _id, count, … } renvoyé par /analytics/dashboard. */
interface Bucket<K> { _id?: K; count?: number; revenue?: number }

/** Données affichées par l'écran Analytics (structure aplatie à partir de la réponse API). */
interface AnalyticsData {
  currency: string | null;
  currencies: string[];
  revenueByCurrency: CurrencyAmount[];
  totalRevenue: number;
  revenueGrowth: number | null;
  totalPackages: number;
  packagesGrowth: number;
  activeClients: number;
  deliveries: number;
  pendingAmount: number;
  pendingCount: number;
  revenueThisMonth: number;
  revenueByMonth: Array<{ month: string; value: number }>;
  packagesByStatus: Array<{ status: string; count: number }>;
  topDestinations: Array<{ city: string; count: number }>;
  marketplaceStats: { products: number; kilos: number };
  recentPackages: unknown[];
  // Indicateurs affichés par l'écran mais non fournis par l'API actuelle (restent vides).
  avgDeliveryTime?: number;
  deliveryRate?: number;
  satisfactionRate?: number;
  topProducts?: Array<{ name?: string; sales?: number }>;
  recentActivity?: Array<{ type?: string; description?: string; time?: string }>;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/* ─────────────────────────────────────────────
   DESIGN TOKENS — identiques à ClientsList
───────────────────────────────────────────── */
const tk = {
  ink:     '#172F50',
  ink80:   '#172F50',
  surface: '#F7FAFE',
  surf2:   '#EDF5FC',
  border:  '#DCE9F5',
  accent:  '#4D91D9',
  emerald: '#059669',
  amber:   '#d97706',
  rose:    '#dc2626',
  textSec: '#52677D',
  textMut: '#8295A8',
};

const Analytics = () => {
  const [period, setPeriod] = useState('month');
  const [data, setData] = useState<AnalyticsData | null>(null);
  // Devise des indicateurs monétaires (jamais de somme entre devises).
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period, selectedCurrency]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/analytics/dashboard', { params: selectedCurrency ? { currency: selectedCurrency } : {} });
      const raw = response.data?.data || response.data;

      // Transformer la réponse imbriquée en structure plate attendue par les graphiques
      const monthNames = ['', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
      const kpis     = raw?.kpis     || {};
      const charts   = raw?.charts   || {};
      const pkgByStatus: Bucket<string>[] = charts.packagesByStatus || [];
      const deliveredCount = pkgByStatus.find(s => s._id === 'delivered')?.count || 0;

      setData({
        // KPIs
        currency:       kpis.currency || null,
        currencies:     kpis.currencies || [],
        revenueByCurrency: kpis.revenueByCurrency || [],
        totalRevenue:   kpis.totalRevenue   || 0,
        revenueGrowth:  kpis.revenueGrowth ?? null,
        totalPackages:  kpis.totalPackages  || 0,
        packagesGrowth: kpis.packagesGrowth || 0,
        activeClients:  kpis.totalClients   || 0,
        deliveries:     deliveredCount,
        pendingAmount:  kpis.pendingAmount  || 0,
        pendingCount:   kpis.pendingCount   || 0,
        revenueThisMonth: kpis.revenueThisMonth || 0,

        // Graphiques
        revenueByMonth: (charts.monthlyEvolution || []).map((item: Bucket<{ month?: number; year?: number }>) => ({
          month: `${monthNames[item._id?.month ?? 0] || ''} ${item._id?.year || ''}`,
          value: item.revenue || 0,
        })).reverse(),

        packagesByStatus: pkgByStatus.map(item => ({
          status: item._id || 'inconnu',
          count:  item.count || 0,
        })),

        topDestinations: (charts.topRoutes || []).map((item: Bucket<{ destination?: string }>) => ({
          city:  item._id?.destination || 'Inconnu',
          count: item.count || 0,
        })),

        // Avant : { products: 0, kilos: 0, services: 0 } codés en dur. Valeurs réelles (pas de module « services »).
        marketplaceStats: { products: raw?.marketplace?.products ?? 0, kilos: raw?.marketplace?.kiloOffers ?? 0 },
        recentPackages: raw?.recentPackages || [],
      });
    } catch (error) {
      toast.error('Erreur lors du chargement des analytics');
    } finally {
      setLoading(false);
    }
  };

  const revenueChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { callback: (value) => formatMoney(Number(value), data?.currency) },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  const revenueChartData = {
    labels: data?.revenueByMonth?.map((item) => item.month) || [],
    datasets: [
      {
        label: 'Revenus',
        data: data?.revenueByMonth?.map((item) => item.value) || [],
        borderColor: tk.accent,
        backgroundColor: 'rgba(77,145,217, 0.08)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: tk.accent,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const packagesChartData = {
    labels: data?.packagesByStatus?.map((item) => item.status) || [],
    datasets: [
      {
        data: data?.packagesByStatus?.map((item) => item.count) || [],
        backgroundColor: [
          'rgba(77,145,217, 0.8)',
          'rgba(5, 150, 105, 0.8)',
          'rgba(217, 119, 6, 0.8)',
          'rgba(220, 38, 38, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const topDestinationsData = {
    labels: data?.topDestinations?.map((item) => item.city) || [],
    datasets: [
      {
        label: 'Nombre de colis',
        data: data?.topDestinations?.map((item) => item.count) || [],
        backgroundColor: tk.accent,
        borderRadius: 8,
      },
    ],
  };

  const marketplaceData = {
    labels: ['Produits disponibles', 'Offres de kilos ouvertes'],
    datasets: [
      {
        data: [
          data?.marketplaceStats?.products || 0,
          data?.marketplaceStats?.kilos || 0,
        ],
        backgroundColor: [
          tk.accent,
          tk.emerald,
          tk.amber,
        ],
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: tk.surface }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: '100vh',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: `3px solid ${tk.border}`,
            borderTopColor: tk.accent,
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

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
              ANALYTICS
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Tableau de bord{' '}
            <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              analysez vos performances
            </span>
          </h1>
          <p style={{ color: '#172F50', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Suivez l'évolution de votre activité, vos revenus, et les indicateurs clés.
          </p>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─────────────── CONTENU ─────────────── */}
      <div className="page-content" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 48px' }}>

        {/* ── Période ── */}
        <div style={{
          display: 'flex', justifyContent: 'flex-end', marginBottom: 24,
          flexWrap: 'wrap', gap: 8,
        }}>
          <div style={{
            display: 'inline-flex', gap: 8, background: '#fff',
            padding: 4, borderRadius: 12, border: `1.5px solid ${tk.border}`,
            flexWrap: 'wrap',
          }}>
            {[
              { value: 'week', label: 'Semaine' },
              { value: 'month', label: 'Mois' },
              { value: 'year', label: 'Année' },
            ].map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                style={{
                  padding: '8px 20px', borderRadius: 10,
                  fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
                  background: period === p.value ? tk.accent : 'transparent',
                  color: period === p.value ? '#fff' : tk.textSec,
                  border: 'none', cursor: 'pointer', transition: 'all .15s',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Devise des indicateurs monétaires ── */}
        {(data?.currencies?.length ?? 0) > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <label htmlFor="analytics-currency" style={{ fontSize: 12, fontWeight: 600, color: tk.textSec }}>Devise affichée</label>
            <select id="analytics-currency" value={data?.currency || ''} onChange={(e) => setSelectedCurrency(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${tk.border}`, fontSize: 13 }}>
              {data?.currencies.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <span style={{ fontSize: 11, color: tk.textMut }}>Montants non convertis : chaque devise est présentée séparément.</span>
          </div>
        )}
        {/* ── Cartes statistiques ── */}
        <div className="grid-kpi-4" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16, marginBottom: 24,
        }}>
          {[
            { label: 'Revenus totaux', value: data?.currency ? formatMoney(data?.totalRevenue || 0, data.currency) : formatByCurrency(listToCurrencyMap(data?.revenueByCurrency)), icon: CurrencyDollarIcon, color: tk.accent, trend: `+${data?.revenueGrowth || 0}%` },
            { label: 'Colis traités', value: data?.totalPackages || 0, icon: CubeIcon, color: tk.emerald, trend: `+${data?.packagesGrowth || 0}` },
            { label: 'Clients actifs', value: data?.activeClients || 0, icon: UserGroupIcon, color: tk.accent },
            { label: 'Livraisons', value: data?.deliveries || 0, icon: TruckIcon, color: tk.amber },
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
                {stat.trend && (
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: tk.emerald,
                    background: 'rgba(5,150,105,.1)', padding: '4px 10px', borderRadius: 99,
                  }}>
                    ↑ {stat.trend}
                  </span>
                )}
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

        {/* ── Grille des graphiques ── */}
        <div className="grid-analytics-charts" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 24, marginBottom: 24,
        }}>
          {/* Évolution des revenus */}
          <div style={{
            background: '#fff', borderRadius: 20,
            border: `1.5px solid ${tk.border}`,
            boxShadow: '0 2px 8px rgba(23,47,80,.05)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                Évolution des revenus
              </h3>
            </div>
            <div style={{ padding: 20, height: 320 }}>
              <Line options={revenueChartOptions} data={revenueChartData} />
            </div>
          </div>

          {/* Colis par statut */}
          <div style={{
            background: '#fff', borderRadius: 20,
            border: `1.5px solid ${tk.border}`,
            boxShadow: '0 2px 8px rgba(23,47,80,.05)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                Colis par statut
              </h3>
            </div>
            <div style={{ padding: 20, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut
                data={packagesChartData}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
              />
            </div>
          </div>

          {/* Destinations principales */}
          <div style={{
            background: '#fff', borderRadius: 20,
            border: `1.5px solid ${tk.border}`,
            boxShadow: '0 2px 8px rgba(23,47,80,.05)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                Destinations principales
              </h3>
            </div>
            <div style={{ padding: 20, height: 320 }}>
              <Bar
                data={topDestinationsData}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
              />
            </div>
          </div>

          {/* Répartition Marketplace */}
          <div style={{
            background: '#fff', borderRadius: 20,
            border: `1.5px solid ${tk.border}`,
            boxShadow: '0 2px 8px rgba(23,47,80,.05)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                Répartition Marketplace
              </h3>
            </div>
            <div style={{ padding: 20, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut
                data={marketplaceData}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
              />
            </div>
          </div>
        </div>

        {/* ── Indicateurs supplémentaires ── */}
        <div className="grid-analytics-bottom" style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 24,
        }}>
          {/* Indicateurs de performance */}
          <div style={{
            background: '#fff', borderRadius: 20,
            border: `1.5px solid ${tk.border}`,
            boxShadow: '0 2px 8px rgba(23,47,80,.05)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                Indicateurs de performance
              </h3>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: tk.textSec }}>Taux de livraison</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: tk.ink }}>{data?.deliveryRate || 0}%</span>
                </div>
                <div style={{
                  width: '100%', height: 6, background: tk.border, borderRadius: 99,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${data?.deliveryRate || 0}%`, height: '100%',
                    background: tk.emerald, borderRadius: 99,
                  }} />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: tk.textSec }}>Satisfaction client</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: tk.ink }}>{data?.satisfactionRate || 0}%</span>
                </div>
                <div style={{
                  width: '100%', height: 6, background: tk.border, borderRadius: 99,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${data?.satisfactionRate || 0}%`, height: '100%',
                    background: tk.accent, borderRadius: 99,
                  }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: tk.textSec }}>Délai moyen</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: tk.ink }}>{data?.avgDeliveryTime || 0} jours</span>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6, marginTop: 8,
                }}>
                  <ClockIcon style={{ width: 14, height: 14, color: tk.textMut }} />
                  <span style={{ fontSize: 11, color: tk.textMut }}>Délai de livraison standard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Produits les plus vendus */}
          <div style={{
            background: '#fff', borderRadius: 20,
            border: `1.5px solid ${tk.border}`,
            boxShadow: '0 2px 8px rgba(23,47,80,.05)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                Produits les plus vendus
              </h3>
            </div>
            <div style={{ padding: 20 }}>
              {data?.topProducts?.map((product, index) => (
                <div key={index} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: 8,
                      background: `${tk.accent}10`, color: tk.accent,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700,
                    }}>{index + 1}</span>
                    <span style={{ fontSize: 14, color: tk.ink }}>{product.name}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: tk.accent }}>{product.sales} ventes</span>
                </div>
              ))}
              {(!data?.topProducts || data.topProducts.length === 0) && (
                <p style={{ color: tk.textMut, fontSize: 13, textAlign: 'center' }}>Aucune donnée disponible</p>
              )}
            </div>
          </div>

          {/* Activité récente */}
          <div style={{
            background: '#fff', borderRadius: 20,
            border: `1.5px solid ${tk.border}`,
            boxShadow: '0 2px 8px rgba(23,47,80,.05)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                Activité récente
              </h3>
            </div>
            <div style={{ padding: 20 }}>
              {data?.recentActivity?.map((activity, index) => (
                <div key={index} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12,
                  marginBottom: 16, paddingBottom: 12,
                  borderBottom: index !== (data.recentActivity?.length ?? 0) - 1 ? `1px solid ${tk.border}` : 'none',
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', marginTop: 6,
                    background: activity.type === 'success' ? tk.emerald : activity.type === 'warning' ? tk.amber : tk.accent,
                  }} />
                  <div>
                    <p style={{ fontSize: 13, color: tk.ink, marginBottom: 4 }}>{activity.description}</p>
                    <p style={{ fontSize: 11, color: tk.textMut }}>{activity.time}</p>
                  </div>
                </div>
              ))}
              {(!data?.recentActivity || data.recentActivity.length === 0) && (
                <p style={{ color: tk.textMut, fontSize: 13, textAlign: 'center' }}>Aucune activité récente</p>
              )}
            </div>
          </div>
        </div>
      </div>


      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
      `}</style>
    </div>
  );
};

export default Analytics;