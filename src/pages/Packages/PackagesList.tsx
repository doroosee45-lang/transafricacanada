import { amountText } from '../../components/Finance/FinancialSummary';
﻿

// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { PlusIcon, EyeIcon, TruckIcon, CubeIcon, MagnifyingGlassIcon, FunnelIcon, SparklesIcon } from '@heroicons/react/24/outline';
// // import { toast } from 'react-toastify';
// // import axios from '../../api/axios';
// // import DataTable from '../../components/Common/DataTable';

// // /* ── Design tokens ── */
// // const tk = {
// //   ink: '#172F50', ink80: '#172F50', surface: '#F7FAFE', surf2: '#EDF5FC',
// //   border: '#DCE9F5', accent: '#4D91D9', emerald: '#059669',
// //   amber: '#d97706', rose: '#dc2626',
// //   textSec: '#52677D', textMut: '#8295A8',
// // };

// // const STATUS_CONFIG = {
// //   'en attente': { bg: '#fef3c7', color: '#92400e', border: '#fde68a', dot: '#f59e0b' },
// //   'en transit':  { bg: '#EDF5FC', color: '#172F50', border: '#DCE9F5', dot: '#79B5E8' },
// //   'livré':       { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0', dot: '#10b981' },
// //   'retardé':     { bg: '#fee2e2', color: '#991b1b', border: '#fecaca', dot: '#ef4444' },
// //   'annulé':      { bg: '#fee2e2', color: '#991b1b', border: '#fecaca', dot: '#ef4444' },
// // };

// // const StatusBadge = ({ status }) => {
// //   const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['en transit'];
// //   return (
// //     <span style={{
// //       display: 'inline-flex', alignItems: 'center', gap: 5,
// //       padding: '3px 10px', borderRadius: 99,
// //       background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
// //       fontSize: 11, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif", letterSpacing: '.02em',
// //     }}>
// //       <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot }} />
// //       {status}
// //     </span>
// //   );
// // };

// // const inputStyle = {
// //   width: '100%', padding: '9px 14px', borderRadius: 10, background: '#fff',
// //   color: tk.ink, fontSize: 13, border: `1.5px solid ${tk.border}`, outline: 'none',
// //   fontFamily: "'DM Sans', sans-serif",
// // };

// // const PackagesList = () => {
// //   const [packages, setPackages] = useState([]);
// //   const [stats, setStats] = useState({});
// //   const [loading, setLoading] = useState(true);
// //   const [filters, setFilters] = useState({ search: '', status: '', destination: '', dateFrom: '', dateTo: '' });
// //   const navigate = useNavigate();

// //   useEffect(() => { fetchPackages(); fetchStats(); }, [filters]);

// //   const fetchPackages = async () => {
// //     setLoading(true);
// //     try {
// //       const params = new URLSearchParams(filters).toString();
// //       const res = await axios.get(`/packages?${params}`);
// //       // ✅ Fix : extraire le tableau depuis res.data.data ou res.data
// //       const data = res.data?.data || res.data;
// //       setPackages(Array.isArray(data) ? data : []);
// //     } catch { toast.error('Erreur lors du chargement des colis'); }
// //     finally { setLoading(false); }
// //   };

// //   const fetchStats = async () => {
// //     try {
// //       const res = await axios.get('/packages/stats');
// //       // ✅ Fix : extraire les stats correctement
// //       setStats(res.data?.data || res.data || {});
// //     } catch { console.error('Stats error'); }
// //   };

// //   const columns = [
// //     {
// //       key: 'trackingNumber', label: 'N° Suivi', sortable: true,
// //       render: val => (
// //         <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: tk.accent, background: 'rgba(77,145,217,.07)', padding: '2px 8px', borderRadius: 6 }}>
// //           {val}
// //         </span>
// //       ),
// //     },
// //     {
// //       key: 'sender', label: 'Expéditeur', sortable: true,
// //       render: val => val ? (
// //         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// //           <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(77,145,217,.1)', color: tk.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, fontFamily: "'Open Sans',Arial,sans-serif", flexShrink: 0 }}>
// //             {val.firstName?.[0]}{val.lastName?.[0]}
// //           </div>
// //           <span style={{ fontSize: 13, fontWeight: 500, color: tk.ink }}>{val.firstName} {val.lastName}</span>
// //         </div>
// //       ) : <span style={{ color: tk.textMut }}>—</span>,
// //     },
// //     {
// //       key: 'destination', label: 'Destination', sortable: true,
// //       render: val => (
// //         <span style={{ fontSize: 13, fontWeight: 500, color: tk.ink }}>{val || '—'}</span>
// //       ),
// //     },
// //     {
// //       key: 'weight', label: 'Poids', sortable: true,
// //       render: val => <span style={{ fontSize: 13, color: tk.ink }}>{val != null ? Number(val).toFixed(2) + ' kg' : '—'}</span>,
// //     },
// //     {
// //       key: 'status', label: 'Statut', sortable: true,
// //       render: val => <StatusBadge status={val} />,
// //     },
// //     {
// //       key: 'createdAt', label: 'Création', sortable: true,
// //       render: val => <span style={{ fontSize: 13, color: tk.textSec }}>{new Date(val).toLocaleDateString('fr-FR')}</span>,
// //     },
// //     {
// //       key: 'estimatedDelivery', label: 'Livraison estimée',
// //       render: val => <span style={{ fontSize: 13, color: val ? tk.emerald : tk.textMut, fontWeight: val ? 500 : 400 }}>
// //         {val ? new Date(val).toLocaleDateString('fr-FR') : '—'}
// //       </span>,
// //     },
// //     {
// //       key: 'actions', label: '',
// //       render: (_, row) => (
// //         <div style={{ display: 'flex', gap: 6 }}>
// //           <button onClick={e => { e.stopPropagation(); navigate(`/app/packages/${row._id}`); }}
// //             style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${tk.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tk.accent }}>
// //             <EyeIcon style={{ width: 15, height: 15 }} />
// //           </button>
// //           <button onClick={e => { e.stopPropagation(); navigate(`/app/packages/${row._id}/tracking`); }}
// //             style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${tk.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tk.emerald }}>
// //             <TruckIcon style={{ width: 15, height: 15 }} />
// //           </button>
// //         </div>
// //       ),
// //     },
// //   ];

// //   const statCards = [
// //     { title: 'Total colis', value: stats.total || 0, icon: CubeIcon, bg: 'rgba(77,145,217,.08)', color: tk.accent },
// //     { title: 'En transit',  value: stats.inTransit || 0, icon: TruckIcon, bg: 'rgba(217,119,6,.08)', color: tk.amber },
// //     { title: 'Livrés',      value: stats.delivered || 0, icon: CubeIcon, bg: 'rgba(5,150,105,.08)', color: tk.emerald },
// //     { title: 'En attente',  value: stats.pending || 0, icon: CubeIcon, bg: 'rgba(99,102,241,.08)', color: '#6366f1' },
// //   ];

// //   return (
// //     <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

// //       {/* ── Hero ── */}
// //       <section style={{
// //         position: 'relative',
// //         height: 260,
// //         display: 'flex',
// //         flexDirection: 'column',
// //         alignItems: 'center',
// //         justifyContent: 'center',
// //         overflow: 'hidden',
// //         marginBottom: 28,
// //         borderRadius: 24,
// //       }}>
// //         <div style={{ position: 'absolute', inset: 0 }}>
// //           <div style={{
// //             position: 'absolute', inset: 0,
// //             backgroundImage: "url('https://topcargointernational.com/assets/plane2.png')",
// //             backgroundSize: 'cover', backgroundPosition: 'center',
// //             animation: 'zoom-slow 12s ease-in-out infinite alternate',
// //           }} />
// //           <div style={{
// //             position: 'absolute', inset: 0,
// //             background: `linear-gradient(135deg, rgba(23,47,80,.88) 0%, rgba(77,145,217,.55) 60%, rgba(23,47,80,.75) 100%)`,
// //           }} />
// //           <div style={{
// //             position: 'absolute', inset: 0,
// //             backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px)',
// //             backgroundSize: '28px 28px',
// //           }} />
// //         </div>

// //         <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#fff', padding: '0 24px', maxWidth: 640 }}>
// //           <div style={{
// //             display: 'inline-flex', alignItems: 'center', gap: 8,
// //             background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
// //             border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
// //             padding: '6px 16px', marginBottom: 18,
// //           }}>
// //             <SparklesIcon style={{ width: 13, height: 13, color: '#C5DCEF' }} />
// //             <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
// //               Gestion des envois
// //             </span>
// //           </div>

// //           <h1 style={{
// //             fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2,
// //             marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif",
// //           }}>
// //             Tous vos{' '}
// //             <span style={{
// //               background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)',
// //               WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
// //             }}>
// //               colis
// //             </span>{' '}en un coup d'œil
// //           </h1>
// //           <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 14, lineHeight: 1.7, marginBottom: 22 }}>
// //             Suivez, gérez et organisez l'ensemble de vos expéditions depuis un seul endroit.
// //           </p>

// //           <button
// //             onClick={() => navigate('/app/packages/add')}
// //             style={{
// //               display: 'inline-flex', alignItems: 'center', gap: 8,
// //               padding: '11px 26px', borderRadius: 12,
// //               background: tk.accent, color: '#fff', border: 'none',
// //               cursor: 'pointer', fontSize: 14, fontWeight: 600,
// //               fontFamily: "'Open Sans',Arial,sans-serif",
// //               boxShadow: '0 6px 24px rgba(77,145,217,.45)',
// //               transition: 'transform .2s, box-shadow .2s',
// //             }}
// //             onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(77,145,217,.5)'; }}
// //             onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(77,145,217,.45)'; }}
// //           >
// //             <PlusIcon style={{ width: 16, height: 16 }} />
// //             Nouveau colis
// //           </button>
// //         </div>

// //         <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
// //           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 50" style={{ width: '100%', display: 'block' }}>
// //             <path fill={tk.surface} d="M0,20L80,24C160,28,320,36,480,35C640,34,800,24,960,21C1120,18,1280,22,1360,24L1440,26L1440,50L0,50Z" />
// //           </svg>
// //         </div>
// //       </section>

// //       {/* ── Content ── */}
// //       <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

// //         {/* ── Stat Cards ── */}
// //         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
// //           {statCards.map(({ title, value, icon: Icon, bg, color }) => (
// //             <div key={title} style={{
// //               background: '#fff', border: `1.5px solid ${tk.border}`, borderRadius: 18,
// //               padding: '20px 22px', boxShadow: '0 2px 8px rgba(23,47,80,.05)',
// //               display: 'flex', alignItems: 'center', gap: 16,
// //             }}>
// //               <div style={{ width: 46, height: 46, borderRadius: 13, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
// //                 <Icon style={{ width: 22, height: 22, color }} />
// //               </div>
// //               <div>
// //                 <p style={{ fontSize: 11, fontWeight: 600, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 2 }}>{title}</p>
// //                 <p style={{ fontSize: 26, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", lineHeight: 1 }}>{value}</p>
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         {/* ── Filters ── */}
// //         <div style={{ background: '#fff', border: `1.5px solid ${tk.border}`, borderRadius: 18, padding: '20px 22px', boxShadow: '0 2px 8px rgba(23,47,80,.05)' }}>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
// //             <FunnelIcon style={{ width: 16, height: 16, color: tk.textMut }} />
// //             <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>Filtres</span>
// //           </div>
// //           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
// //             <div style={{ position: 'relative' }}>
// //               <MagnifyingGlassIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
// //               <input type="text" placeholder="Rechercher..." value={filters.search}
// //                 onChange={e => setFilters({ ...filters, search: e.target.value })}
// //                 style={{ ...inputStyle, paddingLeft: 36 }} />
// //             </div>
// //             <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} style={inputStyle}>
// //               <option value="">Tous les statuts</option>
// //               {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
// //             </select>
// //             <input type="date" value={filters.dateFrom} onChange={e => setFilters({ ...filters, dateFrom: e.target.value })} style={inputStyle} />
// //             <input type="date" value={filters.dateTo} onChange={e => setFilters({ ...filters, dateTo: e.target.value })} style={inputStyle} />
// //           </div>
// //           <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
// //             <button onClick={() => setFilters({ search: '', status: '', destination: '', dateFrom: '', dateTo: '' })} style={{
// //               padding: '7px 16px', borderRadius: 9, background: '#fff', border: `1.5px solid ${tk.border}`,
// //               color: tk.textSec, cursor: 'pointer', fontSize: 12, fontWeight: 500,
// //             }}>Réinitialiser</button>
// //           </div>
// //         </div>

// //         {/* ── Table ── */}
// //         <div style={{ background: '#fff', border: `1.5px solid ${tk.border}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 8px rgba(23,47,80,.05)' }}>
// //           <DataTable
// //             columns={columns}
// //             data={packages}
// //             onRowClick={row => navigate(`/app/packages/${row._id}`)}
// //             loading={loading}
// //           />
// //         </div>

// //       </div>

// //       <style>{`
// //         @keyframes zoom-slow {
// //           from { transform: scale(1); }
// //           to   { transform: scale(1.06); }
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default PackagesList;






// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { PlusIcon, EyeIcon, TruckIcon, CubeIcon, MagnifyingGlassIcon, FunnelIcon, SparklesIcon } from '@heroicons/react/24/outline';
// import { toast } from 'react-toastify';
// import axios from '../../api/axios';
// import DataTable from '../../components/Common/DataTable';

// /* ── Design tokens ── */
// const tk = {
//   ink: '#172F50', ink80: '#172F50', surface: '#F7FAFE', surf2: '#EDF5FC',
//   border: '#DCE9F5', accent: '#4D91D9', emerald: '#059669',
//   amber: '#d97706', rose: '#dc2626',
//   textSec: '#52677D', textMut: '#8295A8',
// };

// const STATUS_CONFIG = {
//   'en attente': { bg: '#fef3c7', color: '#92400e', border: '#fde68a', dot: '#f59e0b' },
//   'en transit':  { bg: '#EDF5FC', color: '#172F50', border: '#DCE9F5', dot: '#79B5E8' },
//   'livré':       { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0', dot: '#10b981' },
//   'retardé':     { bg: '#fee2e2', color: '#991b1b', border: '#fecaca', dot: '#ef4444' },
//   'annulé':      { bg: '#fee2e2', color: '#991b1b', border: '#fecaca', dot: '#ef4444' },
// };

// const StatusBadge = ({ status }) => {
//   const cfg = STATUS_CONFIG[(status || '').toLowerCase()] || STATUS_CONFIG['en transit'];
//   return (
//     <span style={{
//       display: 'inline-flex', alignItems: 'center', gap: 5,
//       padding: '3px 10px', borderRadius: 99,
//       background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
//       fontSize: 11, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif", letterSpacing: '.02em',
//     }}>
//       <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot }} />
//       {status}
//     </span>
//   );
// };

// const inputStyle = {
//   width: '100%', padding: '9px 14px', borderRadius: 10, background: '#fff',
//   color: tk.ink, fontSize: 13, border: `1.5px solid ${tk.border}`, outline: 'none',
//   fontFamily: "'DM Sans', sans-serif",
// };

// /* ─── Extraction universelle ─────────────────────────────────────────────────
//    Gère tous les formats API courants :
//    { data: [...] }  |  { data: { packages: [...] } }  |  { packages: [...] }
//    { success, data: [...] }  |  [...]
// */
// const extractPackages = (responseData) => {
//   if (!responseData) return [];

//   // Format direct : tableau
//   if (Array.isArray(responseData)) return responseData;

//   const d = responseData;

//   // { data: [...] }
//   if (Array.isArray(d.data)) return d.data;

//   // { data: { packages/items/docs/results: [...] } }
//   if (d.data && typeof d.data === 'object') {
//     for (const key of ['packages', 'colis', 'items', 'docs', 'results', 'list']) {
//       if (Array.isArray(d.data[key])) return d.data[key];
//     }
//   }

//   // { packages/items/docs/results: [...] }
//   for (const key of ['packages', 'colis', 'items', 'docs', 'results', 'list']) {
//     if (Array.isArray(d[key])) return d[key];
//   }

//   return [];
// };

// const extractStats = (responseData) => {
//   if (!responseData) return {};
//   if (Array.isArray(responseData.data)) return {};   // pas un objet stats
//   return responseData.data?.stats ?? responseData.data ?? responseData ?? {};
// };

// const PackagesList = () => {
//   const [packages, setPackages] = useState([]);
//   const [stats, setStats] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({ search: '', status: '', destination: '', dateFrom: '', dateTo: '' });
//   const navigate = useNavigate();

//   useEffect(() => { fetchPackages(); }, [filters]);
//   useEffect(() => { fetchStats(); }, []);

//   const fetchPackages = async () => {
//     setLoading(true);
//     try {
//       // Construire les paramètres sans clés vides
//       const params = Object.fromEntries(
//         Object.entries(filters).filter(([_, v]) => v !== '')
//       );
//       const res = await axios.get('/packages', { params });

//       const list = extractPackages(res.data);
//       setPackages(list);
//     } catch (err) {
//       console.error('[PackagesList] Erreur chargement colis:', err);
//       toast.error('Erreur lors du chargement des colis');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const res = await axios.get('/packages/stats');
//       const s = extractStats(res.data);
//       setStats(s);
//     } catch (err) {
//       console.error('[PackagesList] Erreur stats:', err);
//     }
//   };

//   /* ── Extraire le nom du client (expediteur ou destinataire) ── */
//   const getClientName = (val) => {
//     if (!val) return '—';
//     if (typeof val === 'string') return val;
//     const fn = val.firstName ?? val.prenom ?? '';
//     const ln = val.lastName  ?? val.nom    ?? '';
//     return `${fn} ${ln}`.trim() || val.email || '—';
//   };

//   const columns = [
//     {
//       key: 'trackingNumber', label: 'N° Suivi', sortable: true,
//       render: val => (
//         <span style={{
//           fontFamily: 'monospace', fontSize: 13, fontWeight: 600, color: tk.accent,
//           background: 'rgba(77,145,217,.07)', padding: '2px 8px', borderRadius: 6,
//         }}>
//           {val || '—'}
//         </span>
//       ),
//     },
//     {
//       key: 'sender', label: 'Expéditeur', sortable: true,
//       render: (val, row) => {
//         // sender OU client selon le modèle
//         const person = val ?? row.client ?? row.expediteur;
//         const name = getClientName(person);
//         if (name === '—') return <span style={{ color: tk.textMut }}>—</span>;
//         const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
//         return (
//           <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//             <div style={{
//               width: 30, height: 30, borderRadius: '50%',
//               background: 'rgba(77,145,217,.1)', color: tk.accent,
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               fontWeight: 700, fontSize: 11, flexShrink: 0,
//             }}>
//               {initials}
//             </div>
//             <span style={{ fontSize: 13, fontWeight: 500, color: tk.ink }}>{name}</span>
//           </div>
//         );
//       },
//     },
//     {
//       key: 'destination', label: 'Destination', sortable: true,
//       render: (val, row) => {
//         let dest = '';
//         if (typeof val === 'string') dest = val;
//         else if (val?.city)          dest = `${val.city}${val.country ? ', ' + val.country : ''}`;
//         else                          dest = row.destinationCity ?? row.destinationPays ?? '—';
//         return <span style={{ fontSize: 13, fontWeight: 500, color: tk.ink }}>{dest || '—'}</span>;
//       },
//     },
//     {
//       key: 'weight', label: 'Poids', sortable: true,
//       render: (val, row) => {
//         const w = val ?? row.poids;
//         return <span style={{ fontSize: 13, color: tk.ink }}>{w != null ? `${Number(w).toFixed(2)} kg` : '—'}</span>;
//       },
//     },
//     {
//       key: 'status', label: 'Statut', sortable: true,
//       render: (val, row) => <StatusBadge status={val ?? row.statut ?? '—'} />,
//     },
//     {
//       key: 'createdAt', label: 'Création', sortable: true,
//       render: val => <span style={{ fontSize: 13, color: tk.textSec }}>
//         {val ? new Date(val).toLocaleDateString('fr-FR') : '—'}
//       </span>,
//     },
//     {
//       key: 'estimatedDelivery', label: 'Livraison estimée',
//       render: (val, row) => {
//         const d = val ?? row.estimatedDeliveryDate ?? row.dateEstimee;
//         return <span style={{ fontSize: 13, color: d ? tk.emerald : tk.textMut, fontWeight: d ? 500 : 400 }}>
//           {d ? new Date(d).toLocaleDateString('fr-FR') : '—'}
//         </span>;
//       },
//     },
//     {
//       key: 'actions', label: '',
//       render: (_, row) => (
//         <div style={{ display: 'flex', gap: 6 }}>
//           <button onClick={e => { e.stopPropagation(); navigate(`/app/packages/${row._id}`); }}
//             style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${tk.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tk.accent }}>
//             <EyeIcon style={{ width: 15, height: 15 }} />
//           </button>
//           <button onClick={e => { e.stopPropagation(); navigate(`/app/packages/${row._id}/tracking`); }}
//             style={{ width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${tk.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: tk.emerald }}>
//             <TruckIcon style={{ width: 15, height: 15 }} />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   const statCards = [
//     { title: 'Total colis',  value: stats.total     ?? packages.length,             icon: CubeIcon,  bg: 'rgba(77,145,217,.08)',  color: tk.accent  },
//     { title: 'En transit',   value: stats.inTransit ?? stats['en transit'] ?? 0,     icon: TruckIcon, bg: 'rgba(217,119,6,.08)',  color: tk.amber   },
//     { title: 'Livrés',       value: stats.delivered ?? stats['livré'] ?? 0,          icon: CubeIcon,  bg: 'rgba(5,150,105,.08)',  color: tk.emerald },
//     { title: 'En attente',   value: stats.pending   ?? stats['en attente'] ?? 0,     icon: CubeIcon,  bg: 'rgba(99,102,241,.08)', color: '#6366f1'  },
//   ];

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

//       {/* ── Hero ── */}
//       <section style={{
//         position: 'relative', height: 260,
//         display: 'flex', flexDirection: 'column',
//         alignItems: 'center', justifyContent: 'center',
//         overflow: 'hidden', marginBottom: 28, borderRadius: 24,
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
//             background: 'linear-gradient(135deg, rgba(23,47,80,.88) 0%, rgba(77,145,217,.55) 60%, rgba(23,47,80,.75) 100%)',
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
//             <SparklesIcon style={{ width: 13, height: 13, color: '#C5DCEF' }} />
//             <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
//               Gestion des envois
//             </span>
//           </div>

//           <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
//             Tous vos{' '}
//             <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
//               colis
//             </span>{' '}en un coup d'œil
//           </h1>
//           <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 14, lineHeight: 1.7, marginBottom: 22 }}>
//             Suivez, gérez et organisez l'ensemble de vos expéditions depuis un seul endroit.
//           </p>

//           <button
//             onClick={() => navigate('/app/packages/add')}
//             style={{
//               display: 'inline-flex', alignItems: 'center', gap: 8,
//               padding: '11px 26px', borderRadius: 12,
//               background: tk.accent, color: '#fff', border: 'none',
//               cursor: 'pointer', fontSize: 14, fontWeight: 600,
//               fontFamily: "'Open Sans',Arial,sans-serif",
//               boxShadow: '0 6px 24px rgba(77,145,217,.45)',
//               transition: 'transform .2s, box-shadow .2s',
//             }}
//             onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(77,145,217,.5)'; }}
//             onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = '0 6px 24px rgba(77,145,217,.45)'; }}
//           >
//             <PlusIcon style={{ width: 16, height: 16 }} />
//             Nouveau colis
//           </button>
//         </div>

//         <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 50" style={{ width: '100%', display: 'block' }}>
//             <path fill={tk.surface} d="M0,20L80,24C160,28,320,36,480,35C640,34,800,24,960,21C1120,18,1280,22,1360,24L1440,26L1440,50L0,50Z" />
//           </svg>
//         </div>
//       </section>

//       {/* ── Content ── */}
//       <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

//         {/* ── Stat Cards ── */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
//           {statCards.map(({ title, value, icon: Icon, bg, color }) => (
//             <div key={title} style={{
//               background: '#fff', border: `1.5px solid ${tk.border}`, borderRadius: 18,
//               padding: '20px 22px', boxShadow: '0 2px 8px rgba(23,47,80,.05)',
//               display: 'flex', alignItems: 'center', gap: 16,
//             }}>
//               <div style={{ width: 46, height: 46, borderRadius: 13, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
//                 <Icon style={{ width: 22, height: 22, color }} />
//               </div>
//               <div>
//                 <p style={{ fontSize: 11, fontWeight: 600, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '.08em', fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 2 }}>{title}</p>
//                 <p style={{ fontSize: 26, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", lineHeight: 1 }}>{value}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ── Filters ── */}
//         <div style={{ background: '#fff', border: `1.5px solid ${tk.border}`, borderRadius: 18, padding: '20px 22px', boxShadow: '0 2px 8px rgba(23,47,80,.05)' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
//             <FunnelIcon style={{ width: 16, height: 16, color: tk.textMut }} />
//             <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>Filtres</span>
//           </div>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
//             <div style={{ position: 'relative' }}>
//               <MagnifyingGlassIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
//               <input type="text" placeholder="Rechercher..." value={filters.search}
//                 onChange={e => setFilters({ ...filters, search: e.target.value })}
//                 style={{ ...inputStyle, paddingLeft: 36 }} />
//             </div>
//             <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} style={inputStyle}>
//               <option value="">Tous les statuts</option>
//               {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
//             </select>
//             <input type="date" value={filters.dateFrom} onChange={e => setFilters({ ...filters, dateFrom: e.target.value })} style={inputStyle} />
//             <input type="date" value={filters.dateTo}   onChange={e => setFilters({ ...filters, dateTo:   e.target.value })} style={inputStyle} />
//           </div>
//           <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
//             <button
//               onClick={() => setFilters({ search: '', status: '', destination: '', dateFrom: '', dateTo: '' })}
//               style={{ padding: '7px 16px', borderRadius: 9, background: '#fff', border: `1.5px solid ${tk.border}`, color: tk.textSec, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
//               Réinitialiser
//             </button>
//           </div>
//         </div>

//         {/* ── Table ── */}
//         <div style={{ background: '#fff', border: `1.5px solid ${tk.border}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 8px rgba(23,47,80,.05)' }}>
//           {/* Header avec compteur */}
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//               <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
//                 Liste des colis
//               </span>
//               <span style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(77,145,217,.08)', color: tk.accent, fontSize: 11, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif" }}>
//                 {packages.length} colis
//               </span>
//             </div>
//             <button
//               onClick={() => navigate('/app/packages/add')}
//               style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 10, background: tk.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
//               <PlusIcon style={{ width: 14, height: 14 }} /> Nouveau colis
//             </button>
//           </div>

//           <DataTable
//             columns={columns}
//             data={packages}
//             onRowClick={row => navigate(`/app/packages/${row._id}`)}
//             loading={loading}
//           />
//         </div>
//       </div>

//       <style>{`
//         @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
//       `}</style>
//     </div>
//   );
// };

// export default PackagesList;































import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon, EyeIcon, TruckIcon, CubeIcon,
  MagnifyingGlassIcon, FunnelIcon, SparklesIcon, XMarkIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { formatMoney, packageCurrency } from '../../config/currencies';
import DataTable from '../../components/Common/DataTable';
import { extractArray, extractObj } from '../../utils/apiHelpers';
import type { Package } from '../../types/models';
import type { DataTableColumn } from '../../types/ui';

interface PackageStats { total?: number; inTransit?: number; delivered?: number; pending?: number }

/* ── Design tokens ── */
const tk = {
  ink: '#172F50', surface: '#F7FAFE', surf2: '#EDF5FC',
  border: '#DCE9F5', accent: '#4D91D9', emerald: '#059669',
  amber: '#d97706', rose: '#dc2626', textSec: '#52677D', textMut: '#8295A8',
};

const STATUS_CONFIG: Record<string, { bg: string; color: string; border: string; dot: string }> = {
  'en attente': { bg: '#fef3c7', color: '#92400e', border: '#fde68a', dot: '#f59e0b' },
  'en transit':  { bg: '#EDF5FC', color: '#172F50', border: '#DCE9F5', dot: '#79B5E8' },
  'livré':       { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0', dot: '#10b981' },
  'retardé':     { bg: '#fee2e2', color: '#991b1b', border: '#fecaca', dot: '#ef4444' },
  'annulé':      { bg: '#fee2e2', color: '#991b1b', border: '#fecaca', dot: '#ef4444' },
};

const StatusBadge = ({ status }: { status?: string }) => {
  const cfg = STATUS_CONFIG[status ?? ''] || { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1', dot: '#94a3b8' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 99,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      fontSize: 11, fontWeight: 600, letterSpacing: '.02em',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot }} />
      {status}
    </span>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 14px', borderRadius: 10, background: '#fff',
  color: tk.ink, fontSize: 13, border: `1.5px solid ${tk.border}`, outline: 'none',
};

const PackagesList = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [stats,    setStats]    = useState<PackageStats>({});
  const [loading,  setLoading]  = useState(true);
  const [filters,  setFilters]  = useState({ search: '', status: '', dateFrom: '', dateTo: '' });
  const navigate = useNavigate();

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    clearTimeout(debounceRef.current ?? undefined);
    debounceRef.current = setTimeout(() => { fetchPackages(); }, 400);
    return () => clearTimeout(debounceRef.current ?? undefined);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);
  useEffect(() => { fetchStats(); }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      // Construire les params en excluant les valeurs vides
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== '')
      );
      const res = await axios.get('/packages', { params });
      // ✅ Extraction robuste — gère tous les formats de réponse possibles
      const list = extractArray<Package>(res, 'packages', 'items', 'data', 'colis');
      setPackages(list);
    } catch (err) {
      console.error('fetchPackages error:', err);
      toast.error('Erreur lors du chargement des colis');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/packages/stats');
      setStats(extractObj(res));
    } catch (err) {
      // /packages/stats peut ne pas exister — calculer depuis la liste
      console.warn('Stats endpoint unavailable, computing from list');
    }
  };

  // Recalcul des stats depuis la liste si l'endpoint stats échoue
  const computedStats = {
    total:     stats.total     ?? packages.length,
    inTransit: stats.inTransit ?? packages.filter(p => p.status === 'en transit').length,
    delivered: stats.delivered ?? packages.filter(p => p.status === 'livré').length,
    pending:   stats.pending   ?? packages.filter(p => p.status === 'en attente').length,
  };

  const columns: DataTableColumn<Package>[] = [
    {
      key: 'trackingNumber', label: 'N° Suivi', sortable: true,
      render: val => (
        <span style={{
          fontFamily: 'monospace', fontSize: 13, fontWeight: 600,
          color: tk.accent, background: 'rgba(77,145,217,.07)',
          padding: '2px 8px', borderRadius: 6,
        }}>{val || '—'}</span>
      ),
    },
    {
      key: 'client', label: 'Client', sortable: true,
      render: (val, row: Package) => {
        // Essaie client, sender, recipient selon le modèle
        const person = val || row.sender || row.recipient;
        if (!person) return <span style={{ color: tk.textMut }}>—</span>;
        const initials = `${person.firstName?.[0] || ''}${person.lastName?.[0] || ''}`;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(77,145,217,.1)', color: tk.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 11, flexShrink: 0,
            }}>{initials || '?'}</div>
            <span style={{ fontSize: 13, fontWeight: 500, color: tk.ink }}>
              {person.firstName} {person.lastName}
            </span>
          </div>
        );
      },
    },
    {
      key: 'destination', label: 'Destination', sortable: true,
      render: (val, row: Package) => {
        // destination peut être string ou objet { city, country }
        const dest = typeof val === 'string' ? val
          : val?.city ? `${val.city}${val.country ? ', ' + val.country : ''}`
          : row.destinationCity || '—';
        return <span style={{ fontSize: 13, color: tk.ink }}>{dest}</span>;
      },
    },
    {
      key: 'weight', label: 'Poids', sortable: true,
      render: val => (
        <span style={{ fontSize: 13, color: tk.ink }}>
          {val != null ? `${Number(val).toFixed(2)} kg` : '—'}
        </span>
      ),
    },
    {
      key: 'price', label: 'Montant', sortable: true,
      render: (val, row: Package) => {
        if(row.financial)return <span>{amountText(row.financial.totalMinor,row.financial.referenceCurrency)}</span>;
        const amount = val ?? row.amount ?? row.totalPrice;
        return (
          <span style={{ fontSize: 13, fontWeight: 700, color: tk.ink }}>
            {amount != null ? formatMoney(Number(amount), packageCurrency(row)) : '—'}
          </span>
        );
      },
    },
    {
      key: 'status', label: 'Statut', sortable: true,
      render: val => <StatusBadge status={val} />,
    },
    {
      key: 'createdAt', label: 'Création', sortable: true,
      render: val => (
        <span style={{ fontSize: 13, color: tk.textSec }}>
          {val ? new Date(val).toLocaleDateString('fr-FR') : '—'}
        </span>
      ),
    },
    {
      key: 'actions', label: '',
      render: (_: unknown, row: Package) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={e => { e.stopPropagation(); navigate(`/app/packages/${row._id}`); }}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: `1.5px solid ${tk.border}`, background: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: tk.accent,
            }}
          ><EyeIcon style={{ width: 15, height: 15 }} /></button>
          <button
            onClick={e => { e.stopPropagation(); navigate(`/app/packages/${row._id}/tracking`); }}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: `1.5px solid ${tk.border}`, background: '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: tk.emerald,
            }}
          ><TruckIcon style={{ width: 15, height: 15 }} /></button>
        </div>
      ),
    },
  ];

  const statCards = [
    { title: 'Total colis',  value: computedStats.total,     color: tk.accent,   bg: 'rgba(77,145,217,.08)',  icon: CubeIcon },
    { title: 'En transit',   value: computedStats.inTransit, color: tk.amber,    bg: 'rgba(217,119,6,.08)',  icon: TruckIcon },
    { title: 'Livrés',       value: computedStats.delivered, color: tk.emerald,  bg: 'rgba(5,150,105,.08)',  icon: CubeIcon },
    { title: 'En attente',   value: computedStats.pending,   color: '#6366f1',   bg: 'rgba(99,102,241,.08)', icon: CubeIcon },
  ];

  const hasFilters = Object.values(filters).some(v => v !== '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Hero ── */}
      <section className="easy-internal-header" style={{
        position: 'relative', height: 260,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', marginBottom: 28, borderRadius: 24,
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
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase' }}>
              Gestion des envois
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12 }}>
            Tous vos{' '}
            <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              colis
            </span>{' '}en un coup d'œil
          </h1>
          <p style={{ color: '#172F50', fontSize: 14, lineHeight: 1.7, marginBottom: 22 }}>
            Suivez, gérez et organisez l'ensemble de vos expéditions depuis un seul endroit.
          </p>
          <button
            onClick={() => navigate('/app/packages/add')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 26px', borderRadius: 12,
              background: '#347FC5', color: '#fff', border: 'none',
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
              boxShadow: '0 6px 24px rgba(77,145,217,.45)',
            }}
          >
            <PlusIcon style={{ width: 16, height: 16 }} /> Nouveau colis
          </button>
        </div>
        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── Stat Cards ── */}
        <div className="grid-kpi-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {statCards.map(({ title, value, icon: Icon, bg, color }) => (
            <div key={title} style={{
              background: '#fff', border: `1.5px solid ${tk.border}`, borderRadius: 18,
              padding: '20px 22px', boxShadow: '0 2px 8px rgba(23,47,80,.05)',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon style={{ width: 22, height: 22, color }} />
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 2 }}>{title}</p>
                <p style={{ fontSize: 26, fontWeight: 800, color: tk.ink, lineHeight: 1 }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filtres ── */}
        <div style={{ background: '#fff', border: `1.5px solid ${tk.border}`, borderRadius: 18, padding: '20px 22px', boxShadow: '0 2px 8px rgba(23,47,80,.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FunnelIcon style={{ width: 16, height: 16, color: tk.textMut }} />
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.textMut }}>Filtres</span>
            </div>
            {hasFilters && (
              <button onClick={() => setFilters({ search: '', status: '', dateFrom: '', dateTo: '' })}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8,
                  background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.15)',
                  color: tk.rose, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
                <XMarkIcon style={{ width: 12, height: 12 }} /> Réinitialiser
              </button>
            )}
          </div>
          <div className="grid-filters-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <MagnifyingGlassIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
              <input type="text" placeholder="Numéro, client, destination…" value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                style={{ ...inputStyle, paddingLeft: 36 }} />
            </div>
            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} style={inputStyle}>
              <option value="">Tous les statuts</option>
              {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="date" value={filters.dateFrom} onChange={e => setFilters({ ...filters, dateFrom: e.target.value })} style={inputStyle} />
            <input type="date" value={filters.dateTo} onChange={e => setFilters({ ...filters, dateTo: e.target.value })} style={inputStyle} />
          </div>
        </div>

        {/* ── Tableau ── */}
        <div style={{ background: '#fff', border: `1.5px solid ${tk.border}`, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 8px rgba(23,47,80,.05)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CubeIcon style={{ width: 16, height: 16, color: tk.accent }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.textMut }}>
                Liste des colis
              </span>
              <span style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(77,145,217,.08)', color: tk.accent, fontSize: 11, fontWeight: 700 }}>
                {packages.length} colis
              </span>
            </div>
            <button onClick={() => navigate('/app/packages/add')} style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
              borderRadius: 10, background: '#347FC5', color: '#fff', border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}>
              <PlusIcon style={{ width: 14, height: 14 }} /> Nouveau colis
            </button>
          </div>
          <DataTable
            columns={columns}
            data={packages}
            onRowClick={row => navigate(`/app/packages/${row._id}`)}
            loading={loading}
          />
        </div>
      </div>

      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
      `}</style>
    </div>
  );
};

export default PackagesList;
