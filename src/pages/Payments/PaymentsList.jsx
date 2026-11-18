// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   PlusIcon, CreditCardIcon, DocumentTextIcon, SparklesIcon,
//   MagnifyingGlassIcon, FunnelIcon, XMarkIcon,
// } from '@heroicons/react/24/outline';
// import { toast } from 'react-toastify';
// import axios from '../../api/axios';
// import DataTable from '../../components/Common/DataTable';
// import Footer from '../../components/Layout/Footer';

// /* ─────────────────────────────────────────────
//    DESIGN TOKENS — identiques à ClientsList
// ───────────────────────────────────────────── */
// const tk = {
//   ink:     '#171614',
//   ink80:   '#26231e',
//   surface: '#faf8f5',
//   surf2:   '#f5efe6',
//   border:  '#e9e1d5',
//   accent:  '#a77b28',
//   emerald: '#059669',
//   amber:   '#d97706',
//   rose:    '#dc2626',
//   textSec: '#4b5a6e',
//   textMut: '#8494a9',
// };

// const inputStyle = {
//   width: '100%', padding: '10px 14px', borderRadius: 10,
//   background: '#fff', color: tk.ink, fontSize: 14,
//   border: `1.5px solid ${tk.border}`, outline: 'none',
//   fontFamily: "'DM Sans', sans-serif", transition: 'border .18s',
// };

// /* ─────────────────────────────────────────────
//    MAIN COMPONENT
// ───────────────────────────────────────────── */
// const PaymentsList = () => {
//   const [payments, setPayments] = useState([]);
//   const [stats, setStats] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     search: '',
//     status: '',
//     method: '',
//     dateFrom: '',
//     dateTo: '',
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchPayments();
//     fetchStats();
//   }, [filters]);

//   const fetchPayments = async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams(filters).toString();
//       const res = await axios.get(`/payments?${params}`);
//       setPayments(res.data);
//     } catch {
//       toast.error('Erreur lors du chargement des paiements');
//     } finally { setLoading(false); }
//   };

//   const fetchStats = async () => {
//     try {
//       const res = await axios.get('/payments/stats');
//       setStats(res.data);
//     } catch {
//       console.error('Error fetching stats');
//     }
//   };

//   const getMethodIcon = (method) => {
//     const icons = {
//       card:         '💳',
//       bank_transfer:'🏦',
//       cash:         '💵',
//       cheque:       '📝',
//       mobile_money: '📱',
//     };
//     return icons[method] || '💰';
//   };

//   const columns = [
//     {
//       key: 'invoiceNumber', label: 'Facture', sortable: true,
//       render: (val) => (
//         <span style={{
//           fontFamily: "'SF Mono', 'Fira Code', monospace",
//           fontSize: 12, fontWeight: 600, color: tk.accent,
//           background: 'rgba(167,123,40,.06)', padding: '4px 10px',
//           borderRadius: 8, display: 'inline-block', whiteSpace: 'nowrap',
//         }}>{val || '—'}</span>
//       ),
//     },
//     {
//       key: 'client', label: 'Client', sortable: true,
//       render: (val) => val ? `${val.firstName} ${val.lastName}` : '—',
//     },
//     {
//       key: 'amount', label: 'Montant', sortable: true,
//       render: (val) => (
//         <span style={{ fontWeight: 700, color: tk.ink }}>
//           {Number(val || 0).toFixed(2)} $
//         </span>
//       ),
//     },
//     {
//       key: 'method', label: 'Méthode',
//       render: (val) => {
//         const labels = { cash:'💵 Espèces', card:'💳 Carte', bank_transfer:'🏦 Virement', mobile_money:'📱 Mobile', cheque:'📝 Chèque' };
//         return <span style={{ fontSize: 12, color: tk.textSec }}>{labels[val] || val || '—'}</span>;
//       },
//     },
//     {
//       key: 'status', label: 'Statut',
//       render: (val) => {
//         const statusStyles = {
//           'paid':      { bg: 'rgba(5,150,105,.1)',  color: tk.emerald, label: 'Payé' },
//           'pending':   { bg: 'rgba(217,119,6,.1)',  color: tk.amber,   label: 'En attente' },
//           'partial':   { bg: 'rgba(167,123,40,.1)',  color: tk.accent,  label: 'Partiel' },
//           'refunded':  { bg: 'rgba(167,123,40,.1)',  color: tk.accent,  label: 'Remboursé' },
//           'cancelled': { bg: 'rgba(220,38,38,.1)',  color: tk.rose,    label: 'Annulé' },
//         };
//         const s = statusStyles[val] || statusStyles['pending'];
//         return (
//           <span style={{
//             display: 'inline-flex', padding: '4px 12px', borderRadius: 99,
//             background: s.bg, color: s.color,
//             fontSize: 12, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
//           }}>{s.label}</span>
//         );
//       }
//     },
//     {
//       key: 'packages', label: 'Colis',
//       render: (val, row) => {
//         const pkgs = [
//           ...(Array.isArray(val) ? val : []),
//           ...(row.package && !Array.isArray(val)?.find?.(p => (p._id || p) === (row.package?._id || row.package)) ? [row.package] : []),
//         ];
//         if (!pkgs.length) return <span style={{ fontSize: 11, color: tk.textMut }}>—</span>;
//         return (
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
//             {pkgs.slice(0, 2).map((p, i) => (
//               <span key={i} style={{ fontSize: 10, fontFamily: 'monospace', padding: '2px 5px', borderRadius: 4, background: 'rgba(167,123,40,.07)', color: tk.accent, fontWeight: 600, whiteSpace: 'nowrap' }}>
//                 {p.trackingNumber || (typeof p === 'string' ? p.slice(-6) : '—')}
//               </span>
//             ))}
//             {pkgs.length > 2 && <span style={{ fontSize: 10, color: tk.textMut }}>+{pkgs.length - 2}</span>}
//           </div>
//         );
//       },
//     },
//     {
//       key: 'createdAt', label: 'Date', sortable: true,
//       render: (val) => new Date(val).toLocaleDateString('fr-FR'),
//     },
//     {
//       key: 'actions', label: 'Actions',
//       render: (_, row) => (
//         <div style={{ display: 'flex', gap: 6 }}>
//           <button onClick={(e) => { e.stopPropagation(); navigate(`/app/payments/${row._id}`); }}
//             style={{
//               width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${tk.border}`,
//               background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
//               cursor: 'pointer', color: tk.accent, transition: 'all .15s',
//             }}
//             onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,123,40,.06)'; e.currentTarget.style.borderColor = tk.accent; }}
//             onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
//           >
//             <CreditCardIcon style={{ width: 14, height: 14 }} />
//           </button>
//           <button onClick={(e) => { e.stopPropagation(); navigate(`/app/payments/${row._id}`); }}
//             style={{
//               width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${tk.border}`,
//               background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
//               cursor: 'pointer', color: tk.emerald, transition: 'all .15s',
//             }}
//             onMouseEnter={e => { e.currentTarget.style.background = 'rgba(5,150,105,.06)'; e.currentTarget.style.borderColor = tk.emerald; }}
//             onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
//           >
//             <DocumentTextIcon style={{ width: 14, height: 14 }} />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div style={{ minHeight: '100vh', background: tk.surface }}>

//       {/* ─────────────── HERO — identique à ClientsList ─────────────── */}
//       <section style={{
//         position: 'relative', height: 280,
//         display: 'flex', flexDirection: 'column',
//         alignItems: 'center', justifyContent: 'center',
//         overflow: 'hidden',
//       }}>
//         <div style={{ position: 'absolute', inset: 0 }}>
//           <div style={{
//             position: 'absolute', inset: 0,
//             backgroundImage: "url('https://topcargointernational.com/assets/plane2.png')",
//             backgroundSize: 'cover', backgroundPosition: 'center',
//             animation: 'zoom-slow 12s ease-in-out infinite alternate',
//           }} />
//           <div style={{
//             position: 'absolute', inset: 0,
//             background: 'linear-gradient(135deg, rgba(23,22,20,.88) 0%, rgba(167,123,40,.55) 60%, rgba(23,22,20,.75) 100%)',
//           }} />
//           <div style={{
//             position: 'absolute', inset: 0,
//             backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px)',
//             backgroundSize: '28px 28px',
//           }} />
//         </div>

//         <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#fff', padding: '0 24px', maxWidth: 640 }}>
//           <div style={{
//             display: 'inline-flex', alignItems: 'center', gap: 8,
//             background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
//             border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
//             padding: '6px 16px', marginBottom: 18,
//           }}>
//             <SparklesIcon style={{ width: 13, height: 13, color: '#ecd5a3' }} />
//             <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
//               Gestion des paiements
//             </span>
//           </div>

//           <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
//             Suivez vos{' '}
//             <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
//               transactions
//             </span>{' '}en toute transparence
//           </h1>
//           <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
//             Consultez l'historique de vos paiements, gérez les statuts et générez des factures.
//           </p>

//           <button
//             onClick={() => navigate('/app/AddPayment')}
//             style={{
//               display: 'inline-flex', alignItems: 'center', gap: 8,
//               padding: '11px 24px', borderRadius: 12,
//               background: tk.accent, color: '#fff', border: 'none',
//               cursor: 'pointer', fontSize: 14, fontWeight: 600,
//               fontFamily: "'Open Sans',Arial,sans-serif",
//               boxShadow: '0 4px 20px rgba(167,123,40,.4)',
//             }}
//           >
//             <PlusIcon style={{ width: 16, height: 16 }} /> Nouveau paiement
//           </button>
//         </div>

//         <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 50" style={{ width: '100%', display: 'block' }}>
//             <path fill={tk.surface} d="M0,20L80,24C160,28,320,36,480,35C640,34,800,24,960,21C1120,18,1280,22,1360,24L1440,26L1440,50L0,50Z" />
//           </svg>
//         </div>
//       </section>

//       {/* ─────────────── CONTENU ─────────────── */}
//       <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 48px' }}>

//         {/* ── Cartes statistiques ── */}
//         <div style={{
//           display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
//           gap: 16, marginBottom: 24,
//         }}>
//           {[
//             { label: 'Total revenus', value: `${(stats.totalRevenue || 0).toLocaleString()} €`, icon: CreditCardIcon, color: tk.accent },
//             { label: 'Paiements en attente', value: `${(stats.pendingAmount || 0).toLocaleString()} €`, icon: CreditCardIcon, color: tk.amber },
//             { label: 'Paiements réussis', value: stats.successfulCount || 0, icon: CreditCardIcon, color: tk.emerald },
//             { label: 'Taux de réussite', value: `${stats.successRate || 0}%`, icon: CreditCardIcon, color: tk.accent },
//           ].map((stat, idx) => (
//             <div key={idx} style={{
//               background: '#fff', borderRadius: 16, padding: '16px 20px',
//               border: `1.5px solid ${tk.border}`, boxShadow: '0 2px 8px rgba(23,22,20,.04)',
//             }}>
//               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
//                 <span style={{
//                   width: 36, height: 36, borderRadius: 12,
//                   background: `${stat.color}10`,
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 }}>
//                   <stat.icon style={{ width: 18, height: 18, color: stat.color }} />
//                 </span>
//               </div>
//               <div style={{ fontSize: 28, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 4 }}>
//                 {stat.value}
//               </div>
//               <div style={{ fontSize: 12, fontWeight: 500, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '.03em' }}>
//                 {stat.label}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ── Filtres ── */}
//         <div style={{
//           background: '#fff', borderRadius: 20,
//           border: `1.5px solid ${tk.border}`,
//           boxShadow: '0 2px 8px rgba(23,22,20,.05)',
//           overflow: 'hidden', marginBottom: 24,
//         }}>
//           <div style={{
//             display: 'flex', alignItems: 'center', gap: 10,
//             padding: '12px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
//           }}>
//             <span style={{
//               width: 30, height: 30, borderRadius: 8, background: '#fff',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               boxShadow: '0 1px 4px rgba(0,0,0,.08)',
//             }}>
//               <FunnelIcon style={{ width: 14, height: 14, color: tk.accent }} />
//             </span>
//             <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
//               Filtres
//             </span>
//             {(filters.search || filters.status || filters.method || filters.dateFrom || filters.dateTo) && (
//               <button onClick={() => setFilters({ search: '', status: '', method: '', dateFrom: '', dateTo: '' })} style={{
//                 marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
//                 padding: '4px 10px', borderRadius: 8,
//                 background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.15)',
//                 color: tk.rose, cursor: 'pointer', fontSize: 12, fontWeight: 500,
//               }}>
//                 <XMarkIcon style={{ width: 12, height: 12 }} /> Réinitialiser
//               </button>
//             )}
//           </div>

//           <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 12 }}>
//             <div style={{ position: 'relative' }}>
//               <MagnifyingGlassIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
//               <input
//                 type="text"
//                 placeholder="Rechercher..."
//                 value={filters.search}
//                 onChange={e => setFilters({ ...filters, search: e.target.value })}
//                 style={{ ...inputStyle, paddingLeft: 38 }}
//               />
//             </div>
//             <select
//               value={filters.status}
//               onChange={e => setFilters({ ...filters, status: e.target.value })}
//               style={inputStyle}
//             >
//               <option value="">Tous statuts</option>
//               <option value="paid">Payé</option>
//               <option value="pending">En attente</option>
//               <option value="partial">Partiel</option>
//               <option value="refunded">Remboursé</option>
//               <option value="cancelled">Annulé</option>
//             </select>
//             <select
//               value={filters.method}
//               onChange={e => setFilters({ ...filters, method: e.target.value })}
//               style={inputStyle}
//             >
//               <option value="">Toutes méthodes</option>
//               <option value="cash">Espèces</option>
//               <option value="card">Carte bancaire</option>
//               <option value="bank_transfer">Virement</option>
//               <option value="mobile_money">Mobile Money</option>
//               <option value="cheque">Chèque</option>
//             </select>
//             <input
//               type="date"
//               value={filters.dateFrom}
//               onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
//               style={inputStyle}
//               placeholder="Date début"
//             />
//             <input
//               type="date"
//               value={filters.dateTo}
//               onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
//               style={inputStyle}
//               placeholder="Date fin"
//             />
//           </div>
//         </div>

//         {/* ── Tableau ── */}
//         <div style={{
//           background: '#fff', borderRadius: 20,
//           border: `1.5px solid ${tk.border}`,
//           boxShadow: '0 2px 8px rgba(23,22,20,.05)',
//           overflow: 'hidden',
//         }}>
//           <div style={{
//             display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//             padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//               <span style={{
//                 width: 30, height: 30, borderRadius: 8, background: '#fff',
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 boxShadow: '0 1px 4px rgba(0,0,0,.08)',
//               }}>
//                 <CreditCardIcon style={{ width: 14, height: 14, color: tk.accent }} />
//               </span>
//               <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
//                 Liste des paiements
//               </span>
//               <span style={{
//                 padding: '3px 10px', borderRadius: 99,
//                 background: 'rgba(167,123,40,.08)', color: tk.accent,
//                 fontSize: 11, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif",
//               }}>
//                 {payments.length} paiement{payments.length !== 1 ? 's' : ''}
//               </span>
//             </div>
//           </div>

//           <div style={{ padding: '0' }}>
//             <DataTable
//               columns={columns}
//               data={payments}
//               onRowClick={row => navigate(`/app/payments/${row._id}`)}
//               loading={loading}
//             />
//           </div>
//         </div>
//       </div>

//
//       <style>{`
//         @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
//       `}</style>
//     </div>
//   );
// };

// export default PaymentsList;






import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon, CreditCardIcon, DocumentTextIcon, SparklesIcon,
  MagnifyingGlassIcon, FunnelIcon, XMarkIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { formatMoney } from '../../config/currencies';
import DataTable from '../../components/Common/DataTable';

const tk = {
  ink: '#171614', surface: '#faf8f5', border: '#e9e1d5',
  accent: '#a77b28', emerald: '#059669', amber: '#d97706',
  rose: '#dc2626', textSec: '#4b5a6e', textMut: '#8494a9',
};

/* ── Helper universel d'extraction ── */
const extractArray = (res, ...keys) => {
  const body = res?.data ?? res;
  const candidates = [body?.data, body];
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
    for (const k of keys) {
      if (Array.isArray(c?.[k])) return c[k];
    }
  }
  return [];
};

const extractObj = (res) => {
  const body = res?.data ?? res;
  return body?.data ?? body ?? {};
};

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  background: '#fff', color: tk.ink, fontSize: 14,
  border: `1.5px solid ${tk.border}`, outline: 'none',
};

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [stats,    setStats]    = useState({});
  const [loading,  setLoading]  = useState(true);
  const [filters,  setFilters]  = useState({ search: '', status: '', method: '', dateFrom: '', dateTo: '' });
  const navigate = useNavigate();

  const debounceRef = useRef(null);
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { fetchPayments(); }, 400);
    return () => clearTimeout(debounceRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);
  useEffect(() => { fetchStats(); }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const res = await axios.get('/payments', { params });
      // ✅ Extraction robuste
      const list = extractArray(res, 'payments', 'items', 'data', 'paiements');
      setPayments(list);
    } catch (err) {
      console.error('fetchPayments error:', err);
      toast.error('Erreur lors du chargement des paiements');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/payments/stats');
      setStats(extractObj(res));
    } catch {
      console.warn('Stats endpoint unavailable');
    }
  };

  // Stats calculées depuis la liste si endpoint absent
  // Montants fournis par l'API, PAR DEVISE (avant : champs inexistants, repli sur une somme
  // de toutes les factures quelle que soit leur devise, affichée en « € »).
  const computedStats = {
    revenueText:     (stats.byCurrency || []).length ? stats.byCurrency.map(b => formatMoney(b.total, b.currency)).join(' · ') : formatMoney(0),
    pendingText:     stats.currency ? formatMoney(stats.totalPending ?? 0, stats.currency) : '—',
    currency:        stats.currency,
    // Indicateurs de l'API (factures + paiements des colis, devise sélectionnée ; annulés non réussis).
    successfulCount: stats.countPaid ?? payments.filter(p => ['payé','paid'].includes(p.status)).length,
    successRate:     stats.total ? Math.round(((stats.countPaid || 0) / stats.total) * 100) : (payments.length > 0 ? Math.round((payments.filter(p => ['payé','paid'].includes(p.status)).length / payments.length) * 100) : 0),
  };

  const STATUS_LABEL = {
    'payé': { bg: '#d1fae5', color: '#059669', label: 'Payé' },
    'paid':      { bg: '#d1fae5', color: '#059669', label: 'Payé' },
    'en attente de paiement': { bg: '#fef3c7', color: '#d97706', label: 'En attente' },
    'pending':   { bg: '#fef3c7', color: '#d97706', label: 'En attente' },
    'partial':   { bg: '#fdf0e2', color: '#8a6520', label: 'Partiel' },
    'refunded':  { bg: '#fdf0e2', color: '#8a6520', label: 'Remboursé' },
    'annulé':    { bg: '#fee2e2', color: '#dc2626', label: 'Annulé' },
    'cancelled': { bg: '#fee2e2', color: '#dc2626', label: 'Annulé' },
  };

  const columns = [
    {
      key: 'reference', label: 'Référence', sortable: true,
      render: (val, row) => (
        <span style={{
          fontFamily: 'monospace', fontSize: 12, fontWeight: 600, color: tk.accent,
          background: 'rgba(167,123,40,.06)', padding: '4px 10px', borderRadius: 8,
          display: 'inline-block', whiteSpace: 'nowrap',
        }}>{val || row.invoiceNumber || row._id?.slice(-8) || '—'}</span>
      ),
    },
    {
      key: 'client', label: 'Client', sortable: true,
      render: (val, row) => {
        const person = val || row.user;
        if (!person) return <span style={{ color: tk.textMut }}>—</span>;
        return <span style={{ fontSize: 13, fontWeight: 500, color: tk.ink }}>{person.firstName} {person.lastName}</span>;
      },
    },
    {
      key: 'amount', label: 'Montant', sortable: true,
      // Montant dans la devise de LA facture (avant : « € » pour toutes).
      render: (val, row) => (
        <span style={{ fontWeight: 700, color: tk.ink, fontSize: 13 }}>
          {formatMoney(val || 0, row?.currency)}
        </span>
      ),
    },
    {
      key: 'method', label: 'Méthode',
      render: val => {
        const labels = { cash: '💵 Espèces', card: '💳 Carte', bank_transfer: '🏦 Virement', mobile_money: '📱 Mobile', cheque: '📝 Chèque' };
        return <span style={{ fontSize: 12, color: tk.textSec }}>{labels[val] || val || '—'}</span>;
      },
    },
    {
      key: 'status', label: 'Statut',
      render: val => {
        const s = STATUS_LABEL[val] || { bg: '#f1f5f9', color: '#475569', label: val || '—' };
        return (
          <span style={{ display: 'inline-flex', padding: '4px 12px', borderRadius: 99, background: s.bg, color: s.color, fontSize: 11, fontWeight: 600 }}>
            {s.label}
          </span>
        );
      },
    },
    {
      key: 'packages', label: 'Colis',
      render: (val, row) => {
        const pkgs = Array.isArray(val) ? val : (row.package ? [row.package] : []);
        if (!pkgs.length) return <span style={{ fontSize: 11, color: tk.textMut }}>—</span>;
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {pkgs.slice(0, 2).map((p, i) => (
              <span key={i} style={{ fontSize: 10, fontFamily: 'monospace', padding: '2px 5px', borderRadius: 4, background: 'rgba(167,123,40,.07)', color: tk.accent, fontWeight: 600 }}>
                {p.trackingNumber || (typeof p === 'string' ? p.slice(-6) : '—')}
              </span>
            ))}
            {pkgs.length > 2 && <span style={{ fontSize: 10, color: tk.textMut }}>+{pkgs.length - 2}</span>}
          </div>
        );
      },
    },
    {
      key: 'createdAt', label: 'Date', sortable: true,
      render: val => <span style={{ fontSize: 13, color: tk.textSec }}>{val ? new Date(val).toLocaleDateString('fr-FR') : '—'}</span>,
    },
    {
      key: 'actions', label: '',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={e => { e.stopPropagation(); navigate(`/app/payments/${row._id}`); }}
            style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${tk.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tk.accent }}>
            <CreditCardIcon style={{ width: 14, height: 14 }} />
          </button>
          <button onClick={e => { e.stopPropagation(); navigate(`/app/payments/${row._id}`); }}
            style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${tk.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tk.emerald }}>
            <DocumentTextIcon style={{ width: 14, height: 14 }} />
          </button>
        </div>
      ),
    },
  ];

  const hasFilters = Object.values(filters).some(v => v !== '');

  return (
    <div style={{ minHeight: '100vh', background: tk.surface }}>

      {/* Hero */}
      <section className="easy-internal-header" style={{ position: 'relative', height: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#37312a', padding: '0 24px', maxWidth: 640 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 99, padding: '6px 16px', marginBottom: 18 }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#ecd5a3' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase' }}>Gestion des paiements</span>
          </div>
          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12 }}>
            Suivez vos{' '}
            <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>transactions</span>{' '}en toute transparence
          </h1>
          <button onClick={() => navigate('/app/payments/add')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, background: tk.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 20px rgba(167,123,40,.4)' }}>
            <PlusIcon style={{ width: 16, height: 16 }} /> Nouveau paiement
          </button>
        </div>
        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      <div className="page-content" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 48px' }}>

        {/* Stat Cards */}
        <div className="grid-kpi-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Total encaissé (par devise)', value: computedStats.revenueText,   color: tk.emerald },
            { label: `En attente${computedStats.currency ? ` (${computedStats.currency})` : ''}`, value: computedStats.pendingText,  color: tk.amber },
            { label: 'Paiements réussis',    value: computedStats.successfulCount,                                        color: tk.accent },
            { label: 'Taux de réussite',     value: `${computedStats.successRate} %`,                                    color: tk.accent },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', border: `1.5px solid ${tk.border}`, boxShadow: '0 2px 8px rgba(23,22,20,.04)' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: tk.ink, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '.04em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FunnelIcon style={{ width: 14, height: 14, color: tk.accent }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut }}>Filtres</span>
            </div>
            {hasFilters && (
              <button onClick={() => setFilters({ search: '', status: '', method: '', dateFrom: '', dateTo: '' })} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.15)', color: tk.rose, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
                <XMarkIcon style={{ width: 12, height: 12 }} /> Réinitialiser
              </button>
            )}
          </div>
          <div className="pl-filters-grid" style={{ padding: '16px 20px' }}>
            <div style={{ position: 'relative' }}>
              <MagnifyingGlassIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
              <input type="text" placeholder="Référence, client…" value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} style={{ ...inputStyle, paddingLeft: 38 }} />
            </div>
            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} style={inputStyle}>
              <option value="">Tous statuts</option>
              <option value="payé">Payé</option>
              <option value="en attente de paiement">En attente</option>
              <option value="annulé">Annulé</option>
            </select>
            <select value={filters.method} onChange={e => setFilters({ ...filters, method: e.target.value })} style={inputStyle}>
              <option value="">Toutes méthodes</option>
              <option value="cash">Espèces</option>
              <option value="card">Carte</option>
              <option value="bank_transfer">Virement</option>
              <option value="mobile_money">Mobile</option>
              <option value="cheque">Chèque</option>
            </select>
            <input type="date" value={filters.dateFrom} onChange={e => setFilters({ ...filters, dateFrom: e.target.value })} style={inputStyle} />
            <input type="date" value={filters.dateTo} onChange={e => setFilters({ ...filters, dateTo: e.target.value })} style={inputStyle} />
          </div>
        </div>

        {/* Tableau */}
        <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 2px 8px rgba(23,22,20,.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CreditCardIcon style={{ width: 14, height: 14, color: tk.accent }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.textMut }}>Liste des paiements</span>
              <span style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(167,123,40,.08)', color: tk.accent, fontSize: 11, fontWeight: 700 }}>
                {payments.length} paiement{payments.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button onClick={() => navigate('/app/payments/add')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 10, background: tk.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              <PlusIcon style={{ width: 14, height: 14 }} /> Nouveau paiement
            </button>
          </div>
          <DataTable columns={columns} data={payments} onRowClick={row => navigate(`/app/payments/${row._id}`)} loading={loading} />
        </div>
      </div>

      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }

        /* ── Responsive PaymentsList ──────────────────────── */

        /* KPI cards : 4→2→1 colonnes */
        .grid-kpi-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
        @media (max-width: 900px) {
          .grid-kpi-4 { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 520px) {
          .grid-kpi-4 { grid-template-columns: 1fr !important; gap: 10px !important; }
        }

        /* Filtres : 5→2→1 colonnes */
        .pl-filters-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 12px; }
        @media (max-width: 900px) {
          .pl-filters-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 520px) {
          .pl-filters-grid { grid-template-columns: 1fr !important; }
        }

        /* Hero : bouton centré sur mobile */
        @media (max-width: 520px) {
          .page-content { padding: 20px 12px 40px !important; }
        }
      `}</style>
    </div>
  );
};

export default PaymentsList;
