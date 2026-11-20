import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBagIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  SparklesIcon,
  EyeIcon,
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { formatMoney, formatByCurrency, sumByCurrency, productCurrency } from '../../config/currencies';
import type { Person, Product, ProductImage } from '../../types/models';
import type { IconComponent } from '../../types/ui';
import type { CurrencyAmount } from '../../config/currencies';

interface SalesStats { totalSales?: number; totalRevenue?: ReturnType<typeof sumByCurrency>; uniqueBuyers?: number; activeSales?: number }

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const tk = {
  ink:     '#172F50', ink80: '#172F50',
  surface: '#F7FAFE', surf2: '#EDF5FC',
  border:  '#DCE9F5',
  accent:  '#4D91D9', accentDark: '#347FC5',
  emerald: '#059669',
  amber:   '#d97706',
  rose:    '#dc2626',
  purple:  '#7c3aed',
  textSec: '#52677D', textMut: '#8295A8',
};

/* URL de base pour les images uploadées */
const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const imgSrc = (img: ProductImage | null | undefined): string | null => {
  if (!img) return null;
  if (typeof img === 'string') {
    if (img.startsWith('data:') || img.startsWith('http') || img.startsWith('blob:')) return img;
    return `${API_BASE}${img}`;
  }
  if (img?.url) {
    if (img.url.startsWith('data:') || img.url.startsWith('http') || img.url.startsWith('blob:')) return img.url;
    return `${API_BASE}${img.url}`;
  }
  return null;
};

/* Badge de statut produit */
const STATUS_CONFIG: Record<string, { bg: string; color: string; label: string; icon: IconComponent }> = {
  available:  { label: 'Disponible',  bg: 'rgba(5,150,105,.1)',   color: '#059669', icon: CheckCircleIcon },
  reserved:   { label: 'Réservé',     bg: 'rgba(217,119,6,.1)',   color: '#d97706', icon: ClockIcon },
  sold:       { label: 'Vendu',       bg: 'rgba(77,145,217,.1)',   color: '#4D91D9', icon: ShoppingBagIcon },
  shipped:    { label: 'Expédié',     bg: 'rgba(77,145,217,.1)',   color: '#4D91D9', icon: TruckIcon },
  delivered:  { label: 'Livré',       bg: 'rgba(5,150,105,.1)',   color: '#059669', icon: CheckCircleIcon },
  cancelled:  { label: 'Annulé',      bg: 'rgba(220,38,38,.1)',   color: '#dc2626', icon: XCircleIcon },
};

const StatusBadge = ({ status }: { status?: string }) => {
  const cfg = STATUS_CONFIG[status ?? ''] || STATUS_CONFIG.available;
  const Icon = cfg.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 12px', borderRadius: 99,
      background: cfg.bg, color: cfg.color,
      fontSize: 12, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
    }}>
      <Icon style={{ width: 11, height: 11 }} />
      {cfg.label}
    </span>
  );
};

const MySales = () => {
  const [sales, setSales]   = useState<Product[]>([]);
  const [stats, setStats]   = useState<SalesStats>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => { fetchSales(); }, [filter]); // eslint-disable-line

  const fetchSales = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await axios.get('/marketplace/products/my-sales', { params });
      const data: Product[] = Array.isArray(response.data?.data) ? response.data.data
                 : Array.isArray(response.data)        ? response.data
                 : [];
      setSales(data);
      // Statistiques calculées localement
      setStats({
        totalSales:    data.length,
        totalRevenue:  sumByCurrency(data, (v) => v.price, (v) => productCurrency(v)), // par devise
        uniqueBuyers:  new Set(data.map(v => v.buyer?._id?.toString() || (v.buyer as Person | string | null | undefined)?.toString()).filter(Boolean)).size,
        activeSales:   data.filter(v => ['available', 'reserved'].includes(v.status ?? '')).length,
      });
    } catch {
      toast.error('Erreur lors du chargement des ventes');
      setSales([]);
    } finally {
      setLoading(false);
    }
  };

  /* ── Filtres disponibles ── */
  const FILTERS = [
    { value: 'all',       label: 'Toutes' },
    { value: 'available', label: 'Disponibles' },
    { value: 'sold',      label: 'Vendus' },
    { value: 'delivered', label: 'Livrés' },
    { value: 'cancelled', label: 'Annulés' },
  ];

  /* ── Affichage de la liste ── */
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: tk.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${tk.border}`, borderTopColor: tk.accent, animation: 'spin .8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: tk.surface }}>

      {/* ─── HERO ─── */}
      <section className="easy-internal-header" style={{ position: 'relative', height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#172F50', padding: '0 24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 99, padding: '6px 16px', marginBottom: 16 }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#C5DCEF' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>MES VENTES</span>
          </div>
          <h1 style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 8, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Gérez vos produits{' '}
            <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>sur la marketplace</span>
          </h1>
          <p style={{ color: '#172F50', fontSize: 14, margin: 0 }}>Suivez l'état de vos produits mis en vente et vos revenus.</p>
        </div>
        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─── CONTENU ─── */}
      <div className="page-content" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 48px' }}>

        {/* ── Statistiques ── */}
        <div className="grid-kpi-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total produits', value: stats.totalSales || 0,  icon: ShoppingBagIcon,  color: tk.accent  },
            { label: "Chiffre d'affaires", value: formatByCurrency(stats.totalRevenue), icon: CurrencyDollarIcon, color: tk.emerald },
            { label: 'Acheteurs uniques', value: stats.uniqueBuyers || 0, icon: UserGroupIcon, color: tk.purple },
            { label: 'En vente',          value: stats.activeSales  || 0, icon: ChartBarIcon,  color: tk.amber  },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', border: `1.5px solid ${tk.border}`, boxShadow: '0 2px 8px rgba(23,47,80,.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ width: 36, height: 36, borderRadius: 12, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon style={{ width: 18, height: 18, color: s.color }} />
                </span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Filtres + Bouton ajouter ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {FILTERS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                style={{
                  padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: filter === opt.value ? tk.accent : '#fff',
                  color: filter === opt.value ? '#fff' : tk.textSec,
                  border: filter === opt.value ? 'none' : `1.5px solid ${tk.border}`,
                  cursor: 'pointer', transition: 'all .15s',
                }}
              >{opt.label}</button>
            ))}
          </div>
          <button
            onClick={() => navigate('/app/marketplace/products/add')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 20px', borderRadius: 10,
              background: '#347FC5', color: '#fff', border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <PlusIcon style={{ width: 16, height: 16 }} />
            Vendre un produit
          </button>
        </div>

        {/* ── Liste des produits ── */}
        {sales.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${tk.border}`, padding: '64px 24px', textAlign: 'center', boxShadow: '0 2px 8px rgba(23,47,80,.04)' }}>
            <ShoppingBagIcon style={{ width: 56, height: 56, color: tk.textMut, margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: tk.ink, marginBottom: 8 }}>Aucun produit{filter !== 'all' ? ` avec ce statut` : ''}</h3>
            <p style={{ fontSize: 13, color: tk.textMut, marginBottom: 20 }}>Publiez votre premier produit sur la marketplace</p>
            <button
              onClick={() => navigate('/app/marketplace/products/add')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 10, background: '#347FC5', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              <PlusIcon style={{ width: 16, height: 16 }} /> Publier un produit
            </button>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(23,47,80,.04)' }}>
            {/* En-tête tableau */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
              <ShoppingBagIcon style={{ width: 16, height: 16, color: tk.accent }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                Mes produits
              </span>
              <span style={{ padding: '2px 10px', borderRadius: 99, background: 'rgba(77,145,217,.08)', color: tk.accent, fontSize: 11, fontWeight: 700 }}>
                {sales.length}
              </span>
            </div>

            {/* Lignes */}
            <div>
              {sales.map((product, idx) => {
                const thumb = imgSrc(product.images?.[0]);
                return (
                  <div
                    key={product._id || idx}
                    onClick={() => navigate(`/app/marketplace/products/${product._id}`)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '3fr 1.5fr 1fr 1.2fr 1fr auto',
                      alignItems: 'center', gap: 16,
                      padding: '14px 20px',
                      borderBottom: idx < sales.length - 1 ? `1px solid ${tk.border}` : 'none',
                      cursor: 'pointer', transition: 'background .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = tk.surface}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    {/* Produit */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 10, background: tk.surf2, border: `1.5px solid ${tk.border}`, overflow: 'hidden', flexShrink: 0 }}>
                        {thumb ? (
                          <img src={thumb} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShoppingBagIcon style={{ width: 20, height: 20, color: tk.textMut }} />
                          </div>
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: tk.ink, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {product.title || '—'}
                        </div>
                        <div style={{ fontSize: 11, color: tk.textMut }}>
                          {product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : '—'}
                          {product.condition ? ` · ${product.condition}` : ''}
                        </div>
                      </div>
                    </div>

                    {/* Acheteur */}
                    <div>
                      {product.buyer ? (
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: tk.ink }}>
                            {product.buyer.firstName} {product.buyer.lastName}
                          </div>
                          <div style={{ fontSize: 11, color: tk.textMut }}>Acheteur</div>
                        </div>
                      ) : (
                        <span style={{ fontSize: 13, color: tk.textMut }}>—</span>
                      )}
                    </div>

                    {/* Prix */}
                    <div style={{ fontSize: 15, fontWeight: 700, color: tk.emerald }}>
                      {formatMoney(product.price, productCurrency(product))}
                    </div>

                    {/* Statut */}
                    <div><StatusBadge status={product.status} /></div>

                    {/* Date */}
                    <div style={{ fontSize: 12, color: tk.textMut }}>
                      {new Date(product.createdAt as string).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>

                    {/* Action */}
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/app/marketplace/products/${product._id}`); }}
                      style={{
                        width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${tk.border}`,
                        background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: tk.accent, transition: 'all .15s', flexShrink: 0,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(77,145,217,.06)'; e.currentTarget.style.borderColor = tk.accent; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
                    >
                      <EyeIcon style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>


      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default MySales;
