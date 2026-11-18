import { amountText } from '../../components/Finance/FinancialSummary';
// // import React, { useState, useEffect } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { useAuth } from '../../components/Context/AuthContext';
// // import { toast } from 'react-toastify';
// // import {
// //   CubeIcon, TruckIcon, CreditCardIcon, BellIcon,
// //   CalendarIcon, ChevronRightIcon, MagnifyingGlassIcon,
// //   ArrowPathIcon, CheckCircleIcon, ClockIcon,
// //   SparklesIcon, UserGroupIcon, CurrencyDollarIcon,
// // } from '@heroicons/react/24/outline';
// // import {
// //   Chart as ChartJS, CategoryScale, LinearScale, PointElement,
// //   LineElement, ArcElement, Title, Tooltip, Legend, Filler,
// // } from 'chart.js';
// // import { Line, Doughnut } from 'react-chartjs-2';
// // import axios from '../../api/axios';

// // ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement,
// //   ArcElement, Title, Tooltip, Legend, Filler);

// // /* ─────────────────────────────────────────────
// //    DESIGN TOKENS — identiques à ClientsList
// // ───────────────────────────────────────────── */
// // const tk = {
// //   ink:        '#171614',
// //   ink80:      '#26231e',
// //   surface:    '#faf8f5',
// //   surf2:      '#f5efe6',
// //   border:     '#e9e1d5',
// //   accent:     '#a77b28',
// //   accentDark: '#8a6520',
// //   emerald:    '#059669',
// //   amber:      '#d97706',
// //   rose:       '#dc2626',
// //   purple:     '#7c3aed',
// //   orange:     '#ea580c',
// //   textSec:    '#4b5a6e',
// //   textMut:    '#8494a9',
// // };

// // const fmt = (n) => Number(n || 0).toLocaleString('fr-FR');

// // // ── Badge Statut ──
// // const StatusBadge = ({ status }) => {
// //   const statusStyles = {
// //     'livré': { bg: `${tk.emerald}10`, color: tk.emerald, label: 'Livré', icon: CheckCircleIcon },
// //     'en transit': { bg: `${tk.accent}10`, color: tk.accent, label: 'En transit', icon: TruckIcon },
// //     'en attente': { bg: `${tk.amber}10`, color: tk.amber, label: 'En attente', icon: ClockIcon },
// //     'annulé': { bg: `${tk.rose}10`, color: tk.rose, label: 'Annulé', icon: null },
// //   };
// //   const s = statusStyles[status] || { bg: `${tk.textMut}10`, color: tk.textMut, label: status };
// //   const Icon = s.icon;
// //   return (
// //     <span style={{
// //       display: 'inline-flex', alignItems: 'center', gap: 6,
// //       padding: '4px 12px', borderRadius: 99,
// //       background: s.bg, color: s.color,
// //       fontSize: 11, fontWeight: 600, fontFamily: "'Open Sans', Arial, sans-serif",
// //     }}>
// //       {Icon && <Icon style={{ width: 12, height: 12 }} />}
// //       {s.label}
// //     </span>
// //   );
// // };

// // // ── Stat Card ──
// // const StatCard = ({ title, value, sub, icon: Icon, color = tk.accent, linkTo, linkLabel }) => (
// //   <div style={{
// //     background: '#fff', borderRadius: 16, padding: '16px 20px',
// //     border: `1.5px solid ${tk.border}`,
// //     boxShadow: '0 2px 8px rgba(23,22,20,.04)',
// //     transition: 'transform 0.2s, box-shadow 0.2s',
// //   }}
// //   onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(23,22,20,.08)'; }}
// //   onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(23,22,20,.04)'; }}>
// //     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
// //       <span style={{
// //         width: 40, height: 40, borderRadius: 12,
// //         background: `${color}10`,
// //         display: 'flex', alignItems: 'center', justifyContent: 'center',
// //       }}>
// //         <Icon style={{ width: 20, height: 20, color }} />
// //       </span>
// //       {linkTo && (
// //         <Link to={linkTo} style={{
// //           fontSize: 11, fontWeight: 500, color: color, textDecoration: 'none',
// //           display: 'flex', alignItems: 'center', gap: 4,
// //         }}>
// //           {linkLabel} <ChevronRightIcon style={{ width: 10, height: 10 }} />
// //         </Link>
// //       )}
// //     </div>
// //     <div style={{ fontSize: 28, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans', Arial, sans-serif", marginBottom: 4 }}>
// //       {value}
// //     </div>
// //     <div style={{ fontSize: 12, fontWeight: 500, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '.03em', marginBottom: sub ? 4 : 0 }}>
// //       {title}
// //     </div>
// //     {sub && <div style={{ fontSize: 11, color: color }}>{sub}</div>}
// //   </div>
// // );

// // // ── Colis Row ──
// // const ColisRow = ({ tracking, destination, status, date, weight }) => (
// //   <div style={{
// //     display: 'flex', alignItems: 'center', gap: 12,
// //     padding: '12px 0', borderBottom: `1px solid ${tk.border}`,
// //   }}>
// //     <div style={{
// //       width: 40, height: 40, borderRadius: 10, flexShrink: 0,
// //       background: status === 'livré' ? `${tk.emerald}10` : status === 'en transit' ? `${tk.accent}10` : `${tk.amber}10`,
// //       display: 'flex', alignItems: 'center', justifyContent: 'center',
// //     }}>
// //       <CubeIcon style={{
// //         width: 18, height: 18,
// //         color: status === 'livré' ? tk.emerald : status === 'en transit' ? tk.accent : tk.amber,
// //       }} />
// //     </div>
// //     <div style={{ flex: 1, minWidth: 0 }}>
// //       <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tk.ink,
// //         whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
// //         {tracking}
// //       </p>
// //       <p style={{ margin: '2px 0 0', fontSize: 11, color: tk.textMut }}>
// //         {destination} · {weight}
// //       </p>
// //     </div>
// //     <div style={{ textAlign: 'right', flexShrink: 0 }}>
// //       <StatusBadge status={status} />
// //       <p style={{ margin: '3px 0 0', fontSize: 10, color: tk.textMut }}>{date}</p>
// //     </div>
// //   </div>
// // );

// // // ── Timeline Step ──
// // const TimelineStep = ({ label, date, done, active }) => (
// //   <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
// //     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
// //       <div style={{
// //         width: 24, height: 24, borderRadius: '50%',
// //         background: done ? tk.emerald : active ? tk.accent : tk.surface,
// //         border: active ? `2px solid ${tk.accent}` : 'none',
// //         display: 'flex', alignItems: 'center', justifyContent: 'center',
// //       }}>
// //         {done && <CheckCircleIcon style={{ width: 14, height: 14, color: '#fff' }} />}
// //         {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
// //       </div>
// //       {!done && !active && <div style={{ width: 2, height: 20, background: tk.border, marginTop: 2 }} />}
// //       {done && <div style={{ width: 2, height: 20, background: tk.emerald, marginTop: 2 }} />}
// //       {active && <div style={{ width: 2, height: 20, background: tk.border, marginTop: 2 }} />}
// //     </div>
// //     <div style={{ paddingTop: 2 }}>
// //       <p style={{
// //         margin: 0, fontSize: 13,
// //         fontWeight: done || active ? 600 : 400,
// //         color: done ? tk.emerald : active ? tk.accent : tk.textSec,
// //       }}>{label}</p>
// //       {date && <p style={{ margin: '1px 0 0', fontSize: 11, color: tk.textMut }}>{date}</p>}
// //     </div>
// //   </div>
// // );

// // // ─── Dashboard Client ───────────────────────────────────────────
// // const DashboardClient = () => {
// //   const { user } = useAuth();
// //   const navigate = useNavigate();
// //   const [stats, setStats] = useState({ total: 0, enTransit: 0, livres: 0, enAttente: 0, depenses: 0 });
// //   const [mesColis, setMesColis] = useState([]);
// //   const [chartData, setChartData] = useState({ colisParMois: [], repartition: [] });
// //   const [trackingInput, setTracking] = useState('');
// //   const [loading, setLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [error, setError] = useState(null);

// //   useEffect(() => { fetchData(); }, []);

// //   const fetchData = async () => {
// //     setLoading(true); setError(null);
// //     try {
// //       const [pkgRes, chartRes] = await Promise.all([
// //         axios.get('/packages?limit=6&sort=-createdAt'),
// //         axios.get('/dashboard/charts'),
// //       ]);

// //       const pkgs = (() => {
// //         const d = pkgRes?.data;
// //         for (const k of ['packages', 'items']) {
// //           if (Array.isArray(d?.data?.[k])) return d.data[k];
// //           if (Array.isArray(d?.[k])) return d[k];
// //         }
// //         return Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
// //       })();

// //       setMesColis(pkgs);
// //       setStats({
// //         total: pkgs.length,
// //         enTransit: pkgs.filter(p => p.status === 'en transit').length,
// //         livres: pkgs.filter(p => p.status === 'livré').length,
// //         enAttente: pkgs.filter(p => p.status === 'en attente').length,
// //         depenses: pkgs.reduce((s, p) => s + Number(p.price || p.amount || 0), 0),
// //       });

// //       const cd = chartRes.data?.data ?? chartRes.data ?? {};
// //       setChartData({
// //         colisParMois: Array.isArray(cd.revenueByMonth) ? cd.revenueByMonth : [],
// //         repartition: Array.isArray(cd.packagesByStatus) ? cd.packagesByStatus : [],
// //       });
// //     } catch { setError('Impossible de charger vos données.'); }
// //     finally { setLoading(false); }
// //   };

// //   // Fonction pour actualiser uniquement les données (sans recharger la page)
// //   const handleRefresh = async () => {
// //     setRefreshing(true);
// //     try {
// //       const [pkgRes, chartRes] = await Promise.all([
// //         axios.get('/packages?limit=6&sort=-createdAt'),
// //         axios.get('/dashboard/charts'),
// //       ]);

// //       const pkgs = (() => {
// //         const d = pkgRes?.data;
// //         for (const k of ['packages', 'items']) {
// //           if (Array.isArray(d?.data?.[k])) return d.data[k];
// //           if (Array.isArray(d?.[k])) return d[k];
// //         }
// //         return Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : [];
// //       })();

// //       setMesColis(pkgs);
// //       setStats({
// //         total: pkgs.length,
// //         enTransit: pkgs.filter(p => p.status === 'en transit').length,
// //         livres: pkgs.filter(p => p.status === 'livré').length,
// //         enAttente: pkgs.filter(p => p.status === 'en attente').length,
// //         depenses: pkgs.reduce((s, p) => s + Number(p.price || p.amount || 0), 0),
// //       });

// //       const cd = chartRes.data?.data ?? chartRes.data ?? {};
// //       setChartData({
// //         colisParMois: Array.isArray(cd.revenueByMonth) ? cd.revenueByMonth : [],
// //         repartition: Array.isArray(cd.packagesByStatus) ? cd.packagesByStatus : [],
// //       });

// //       toast.success('Données actualisées avec succès');
// //     } catch {
// //       toast.error('Erreur lors de l\'actualisation');
// //     } finally {
// //       setRefreshing(false);
// //     }
// //   };

// //   const now = new Date();
// //   const prenom = user?.firstName || user?.name || 'Client';

// //   // Charts
// //   const lineData = {
// //     labels: chartData.colisParMois.map(i => i.month),
// //     datasets: [{
// //       label: 'Mes colis',
// //       data: chartData.colisParMois.map(i => i.count ?? i.value ?? 0),
// //       borderColor: tk.accent,
// //       backgroundColor: `${tk.accent}08`,
// //       tension: 0.45, fill: true, borderWidth: 2.5,
// //       pointBackgroundColor: tk.accent, pointRadius: 3, pointHoverRadius: 5,
// //     }],
// //   };

// //   const lineOptions = {
// //     responsive: true, maintainAspectRatio: false,
// //     plugins: {
// //       legend: { display: false },
// //       tooltip: {
// //         backgroundColor: '#fff', borderColor: tk.border, borderWidth: 1,
// //         titleColor: tk.ink, bodyColor: tk.textSec, padding: 10, cornerRadius: 8,
// //       },
// //     },
// //     scales: {
// //       y: { beginAtZero: true, grid: { color: tk.border }, ticks: { color: tk.textMut, font: { size: 11 } } },
// //       x: { grid: { display: false }, ticks: { color: tk.textMut, font: { size: 11 } } },
// //     },
// //   };

// //   const donutData = {
// //     labels: chartData.repartition.length > 0
// //       ? chartData.repartition.map(i => i.status)
// //       : ['Livrés', 'En transit', 'En attente'],
// //     datasets: [{
// //       data: chartData.repartition.length > 0
// //         ? chartData.repartition.map(i => i.count)
// //         : [stats.livres || 3, stats.enTransit || 2, stats.enAttente || 1],
// //       backgroundColor: [tk.emerald, tk.accent, tk.amber, tk.rose],
// //       borderWidth: 3, borderColor: '#fff', hoverOffset: 4,
// //     }],
// //   };

// //   const donutOptions = {
// //     responsive: true, maintainAspectRatio: false, cutout: '70%',
// //     plugins: {
// //       legend: {
// //         position: 'bottom',
// //         labels: { color: tk.textSec, padding: 10, font: { size: 11 }, boxWidth: 9, usePointStyle: true }
// //       },
// //       tooltip: {
// //         backgroundColor: '#fff', borderColor: tk.border, borderWidth: 1,
// //         titleColor: tk.ink, bodyColor: tk.textSec, padding: 10, cornerRadius: 8,
// //       },
// //     },
// //   };

// //   if (loading) {
// //     return (
// //       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '60vh', background: tk.surface }}>
// //         <div style={{ textAlign: 'center' }}>
// //           <div style={{
// //             width: 40, height: 40, border: `3px solid ${tk.border}`,
// //             borderTop: `3px solid ${tk.accent}`, borderRadius: '50%',
// //             animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
// //           }} />
// //           <p style={{ color: tk.textMut, fontSize: 13 }}>Chargement de votre espace...</p>
// //         </div>
// //         <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div style={{ display: 'flex', flex: 1, minHeight: '60vh', background: tk.surface,
// //         alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
// //         <p style={{ color: tk.rose, fontSize: 14 }}>{error}</p>
// //         <button onClick={fetchData} style={{
// //           padding: '10px 24px', background: tk.accent, border: 'none',
// //           borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600,
// //           cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
// //         }}>
// //           <ArrowPathIcon style={{ width: 16, height: 16 }} />
// //           Réessayer
// //         </button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div style={{ background: tk.surface, flex: 1, minHeight: '100vh' }}>
// //       <div style={{ padding: '28px 32px', maxWidth: 1400, margin: '0 auto' }}>

// //         {/* Header */}
// //         <div style={{ marginBottom: 28 }}>
// //           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
// //             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
// //               <div style={{
// //                 width: 48, height: 48, borderRadius: 16,
// //                 background: `${tk.accent}10`, display: 'flex',
// //                 alignItems: 'center', justifyContent: 'center',
// //               }}>
// //                 <SparklesIcon style={{ width: 24, height: 24, color: tk.accent }} />
// //               </div>
// //               <div>
// //                 <h1 style={{ fontSize: 24, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans', Arial, sans-serif", margin: 0 }}>
// //                   Bonjour, {prenom} 👋
// //                 </h1>
// //                 <p style={{ fontSize: 14, color: tk.textMut, margin: '4px 0 0', textTransform: 'capitalize' }}>
// //                   {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
// //                   {' · '}Mon espace client
// //                 </p>
// //               </div>
// //             </div>

// //             {/* Quick track */}
// //             <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
// //               <div style={{
// //                 display: 'flex', alignItems: 'center', gap: 8,
// //                 background: '#fff', border: `1.5px solid ${tk.border}`, borderRadius: 12,
// //                 padding: '8px 14px',
// //               }}>
// //                 <MagnifyingGlassIcon style={{ width: 16, height: 16, color: tk.textMut }} />
// //                 <input
// //                   value={trackingInput}
// //                   onChange={e => setTracking(e.target.value)}
// //                   placeholder="N° de suivi..."
// //                   style={{
// //                     border: 'none', outline: 'none', fontSize: 13,
// //                     color: tk.ink, width: 180, background: 'none',
// //                     fontFamily: "'DM Sans', sans-serif",
// //                   }}
// //                 />
// //               </div>
// //               {/* tracking button */}
// //               <button
// //                 onClick={() => {
// //                   const q = trackingInput?.trim();
// //                   if (q) navigate(`/app/packages/tracking?number=${encodeURIComponent(q)}`);
// //                   else navigate('/app/packages/tracking');
// //                 }}
// //                 style={{
// //                   display: 'inline-flex', alignItems: 'center', gap: 8,
// //                   padding: '9px 20px', borderRadius: 10,
// //                   background: tk.accent, color: '#fff', border: 'none',
// //                   fontSize: 13, fontWeight: 600, cursor: 'pointer',
// //                   fontFamily: "'Open Sans', Arial, sans-serif",
// //                 }}
// //               >
// //                 <TruckIcon style={{ width: 16, height: 16 }} />
// //                 Suivre
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Stat Cards */}
// //         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
// //           <StatCard title="Total mes colis" value={fmt(stats.total)} sub="Tous statuts" icon={CubeIcon} color={tk.accent} linkTo="/app/packages" linkLabel="Voir" />
// //           <StatCard title="En transit" value={fmt(stats.enTransit)} sub="En cours de livraison" icon={TruckIcon} color={tk.accent} linkTo="/app/packages" linkLabel="Détails" />
// //           <StatCard title="Livrés" value={fmt(stats.livres)} sub="Réceptionnés" icon={CheckCircleIcon} color={tk.emerald} linkTo="/app/packages" linkLabel="Historique" />
// //           <StatCard title="Mes dépenses" value={`${fmt(stats.depenses)} €`} sub="Total payé" icon={CurrencyDollarIcon} color={tk.purple} linkTo="/app/payments" linkLabel="Paiements" />
// //         </div>

// //         {/* Charts row */}
// //         <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, marginBottom: 28 }}>

// //           {/* Line Chart */}
// //           <div style={{
// //             background: '#fff', borderRadius: 20, padding: '20px 24px',
// //             border: `1.5px solid ${tk.border}`,
// //             boxShadow: '0 2px 8px rgba(23,22,20,.05)',
// //           }}>
// //             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
// //               <div>
// //                 <h3 style={{ fontSize: 15, fontWeight: 600, color: tk.ink, margin: 0 }}>Activité colis</h3>
// //                 <p style={{ fontSize: 12, color: tk.textMut, margin: '4px 0 0' }}>Nombre de colis par mois</p>
// //               </div>
// //               <select style={{
// //                 padding: '6px 12px', borderRadius: 8, border: `1.5px solid ${tk.border}`,
// //                 fontSize: 12, color: tk.textSec, background: '#fff', cursor: 'pointer',
// //               }}>
// //                 <option>6 derniers mois</option>
// //                 <option>12 derniers mois</option>
// //               </select>
// //             </div>
// //             <div style={{ height: 220 }}>
// //               {chartData.colisParMois.length > 0 ? (
// //                 <Line options={lineOptions} data={lineData} />
// //               ) : (
// //                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: tk.textMut, fontSize: 13 }}>
// //                   Aucune donnée disponible
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Donut Chart */}
// //           <div style={{
// //             background: '#fff', borderRadius: 20, padding: '20px 24px',
// //             border: `1.5px solid ${tk.border}`,
// //             boxShadow: '0 2px 8px rgba(23,22,20,.05)',
// //           }}>
// //             <h3 style={{ fontSize: 15, fontWeight: 600, color: tk.ink, margin: 0, marginBottom: 4 }}>Répartition colis</h3>
// //             <p style={{ fontSize: 12, color: tk.textMut, marginBottom: 16 }}>Par statut</p>
// //             <div style={{ height: 160 }}>
// //               <Doughnut data={donutData} options={donutOptions} />
// //             </div>
// //             <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
// //               {[
// //                 { label: 'Livrés', value: stats.livres, color: tk.emerald },
// //                 { label: 'En transit', value: stats.enTransit, color: tk.accent },
// //                 { label: 'En attente', value: stats.enAttente, color: tk.amber },
// //               ].map(r => (
// //                 <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// //                   <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: tk.textSec }}>
// //                     <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
// //                     {r.label}
// //                   </span>
// //                   <span style={{ fontSize: 14, fontWeight: 700, color: r.color }}>{r.value}</span>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Bottom row */}
// //         <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>

// //           {/* Mes derniers colis */}
// //           <div style={{
// //             background: '#fff', borderRadius: 20,
// //             border: `1.5px solid ${tk.border}`,
// //             boxShadow: '0 2px 8px rgba(23,22,20,.05)',
// //             overflow: 'hidden',
// //           }}>
// //             <div style={{
// //               display: 'flex', alignItems: 'center', justifyContent: 'space-between',
// //               padding: '16px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
// //             }}>
// //               <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
// //                 <div style={{
// //                   width: 30, height: 30, borderRadius: 8, background: '#fff',
// //                   display: 'flex', alignItems: 'center', justifyContent: 'center',
// //                   boxShadow: '0 1px 4px rgba(0,0,0,.08)',
// //                 }}>
// //                   <CubeIcon style={{ width: 14, height: 14, color: tk.accent }} />
// //                 </div>
// //                 <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans', Arial, sans-serif" }}>
// //                   Mes derniers colis
// //                 </span>
// //               </div>
// //               <Link to="/app/packages" style={{
// //                 fontSize: 12, fontWeight: 500, color: tk.accent, textDecoration: 'none',
// //                 display: 'flex', alignItems: 'center', gap: 4,
// //               }}>
// //                 Voir tout <ChevronRightIcon style={{ width: 12, height: 12 }} />
// //               </Link>
// //             </div>
// //             <div style={{ padding: '4px 20px' }}>
// //               {mesColis.length > 0 ? mesColis.slice(0, 5).map((p, i) => (
// //                 <ColisRow
// //                   key={i}
// //                   tracking={p.trackingNumber || `#PKG-${i + 1}`}
// //                   destination={p.destination || p.agency?.city || '—'}
// //                   status={p.status || 'en attente'}
// //                   date={p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : '—'}
// //                   weight={p.weight ? `${p.weight} kg` : '—'}
// //                 />
// //               )) : (
// //                 <>
// //                   <ColisRow tracking="CS1714000001" destination="Paris" status="livré" date="08/05/2026" weight="2.5 kg" />
// //                   <ColisRow tracking="CS1714000002" destination="Lyon" status="en transit" date="09/05/2026" weight="1.2 kg" />
// //                   <ColisRow tracking="CS1714000003" destination="Marseille" status="en attente" date="10/05/2026" weight="4.0 kg" />
// //                   <ColisRow tracking="CS1714000004" destination="Bordeaux" status="livré" date="07/05/2026" weight="0.8 kg" />
// //                 </>
// //               )}
// //             </div>
// //           </div>

// //           {/* Suivi rapide du dernier colis */}
// //           <div style={{
// //             background: '#fff', borderRadius: 20,
// //             border: `1.5px solid ${tk.border}`,
// //             boxShadow: '0 2px 8px rgba(23,22,20,.05)',
// //             overflow: 'hidden',
// //           }}>
// //             <div style={{
// //               display: 'flex', alignItems: 'center', justifyContent: 'space-between',
// //               padding: '16px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
// //             }}>
// //               <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
// //                 <div style={{
// //                   width: 30, height: 30, borderRadius: 8, background: '#fff',
// //                   display: 'flex', alignItems: 'center', justifyContent: 'center',
// //                   boxShadow: '0 1px 4px rgba(0,0,0,.08)',
// //                 }}>
// //                   <TruckIcon style={{ width: 14, height: 14, color: tk.accent }} />
// //                 </div>
// //                 <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans', Arial, sans-serif" }}>
// //                   Suivi en temps réel
// //                 </span>
// //               </div>
// //               <Link to="/app/packages" style={{
// //                 fontSize: 12, fontWeight: 500, color: tk.accent, textDecoration: 'none',
// //                 display: 'flex', alignItems: 'center', gap: 4,
// //               }}>
// //                 Détails <ChevronRightIcon style={{ width: 12, height: 12 }} />
// //               </Link>
// //             </div>

// //             <div style={{ padding: '20px' }}>
// //               {/* Colis actif affiché */}
// //               <div style={{
// //                 background: tk.surface, borderRadius: 12, padding: 14,
// //                 border: `1px solid ${tk.border}`, marginBottom: 20,
// //               }}>
// //                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
// //                   <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: tk.ink }}>
// //                     {mesColis[0]?.trackingNumber || 'CS1714000002'}
// //                   </p>
// //                   <StatusBadge status={mesColis[0]?.status || 'en transit'} />
// //                 </div>
// //                 <p style={{ margin: 0, fontSize: 12, color: tk.textMut }}>
// //                   Destination : {mesColis[0]?.destination || 'Lyon'}
// //                 </p>
// //               </div>

// //               {/* Timeline */}
// //               <TimelineStep label="Colis enregistré" date="09/05/2026 · 09:00" done active={false} />
// //               <TimelineStep label="En transit" date="09/05/2026 · 14:30" done active={false} />
// //               <TimelineStep label="En cours de livraison" date="10/05/2026" done={false} active={true} />
// //               <TimelineStep label="Livré" date={null} done={false} active={false} />

// //               {/* Bouton actualiser corrigé */}
// //               <button
// //                 onClick={handleRefresh}
// //                 disabled={refreshing}
// //                 style={{
// //                   display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
// //                   marginTop: 16, padding: '10px', borderRadius: 10,
// //                   background: `${tk.accent}08`, border: `1px solid ${tk.accent}20`,
// //                   fontSize: 12, fontWeight: 500, color: tk.accent, textDecoration: 'none',
// //                   width: '100%', cursor: refreshing ? 'not-allowed' : 'pointer',
// //                   opacity: refreshing ? 0.6 : 1, transition: 'all 0.2s ease',
// //                 }}
// //                 onMouseEnter={e => {
// //                   if (!refreshing) {
// //                     e.currentTarget.style.background = `${tk.accent}15`;
// //                     e.currentTarget.style.borderColor = tk.accent;
// //                   }
// //                 }}
// //                 onMouseLeave={e => {
// //                   if (!refreshing) {
// //                     e.currentTarget.style.background = `${tk.accent}08`;
// //                     e.currentTarget.style.borderColor = `${tk.accent}20`;
// //                   }
// //                 }}
// //               >
// //                 {refreshing ? (
// //                   <>
// //                     <div style={{
// //                       width: 14, height: 14, border: `2px solid ${tk.accent}`,
// //                       borderTopColor: 'transparent', borderRadius: '50%',
// //                       animation: 'spin 0.6s linear infinite',
// //                     }} />
// //                     Actualisation...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <ArrowPathIcon style={{ width: 14, height: 14 }} />
// //                     Actualiser le suivi
// //                   </>
// //                 )}
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DashboardClient;




// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../components/Context/AuthContext';
// import { toast } from 'react-toastify';
// import {
//   CubeIcon, TruckIcon, CreditCardIcon, BellIcon,
//   MagnifyingGlassIcon, ArrowPathIcon, CheckCircleIcon, ClockIcon,
//   SparklesIcon, CurrencyDollarIcon, ExclamationCircleIcon,
//   ChevronRightIcon, MapPinIcon, ScaleIcon, CalendarDaysIcon,
//   ArrowUpIcon, ArrowDownIcon, InboxIcon,
// } from '@heroicons/react/24/outline';
// import {
//   Chart as ChartJS,
//   CategoryScale, LinearScale, PointElement,
//   LineElement, ArcElement, Title, Tooltip, Legend, Filler,
// } from 'chart.js';
// import { Line, Doughnut } from 'react-chartjs-2';
// import axios from '../../api/axios';

// ChartJS.register(
//   CategoryScale, LinearScale, PointElement, LineElement,
//   ArcElement, Title, Tooltip, Legend, Filler,
// );

// /* ─── TOKENS ─────────────────────────────────── */
// const tk = {
//   bg:         '#f4f6fb',
//   white:      '#ffffff',
//   border:     '#e4e9f2',
//   ink:        '#0b1120',
//   sec:        '#4b5a72',
//   muted:      '#8898b0',
//   accent:     '#2560eb',
//   accentSoft: '#deeafd',
//   emerald:    '#059669',
//   emeraldSoft:'#d1fae5',
//   amber:      '#d97706',
//   amberSoft:  '#fef3c7',
//   rose:       '#dc2626',
//   roseSoft:   '#fee2e2',
//   purple:     '#7c3aed',
//   purpleSoft: '#ede9fe',
// };

// /* ─── HELPERS ─────────────────────────────────── */
// const fmt  = n  => Number(n || 0).toLocaleString('fr-FR');
// const fmtE = n  => `${Number(n || 0).toLocaleString('fr-FR')} €`;
// const fmtDate = d => d ? new Date(d).toLocaleDateString('fr-FR') : '—';
// const fmtDateTime = d => d
//   ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
//   : '—';

// /* ─── STATUS BADGE ───────────────────────────── */
// const StatusBadge = ({ status, size = 'md' }) => {
//   const map = {
//     'livré':      { bg: '#d1fae5', color: '#059669', label: 'Livré',      Icon: CheckCircleIcon },
//     'en transit': { bg: '#deeafd', color: '#2560eb', label: 'En transit', Icon: TruckIcon },
//     'en attente': { bg: '#fef3c7', color: '#d97706', label: 'En attente', Icon: ClockIcon },
//     'annulé':     { bg: '#fee2e2', color: '#dc2626', label: 'Annulé',     Icon: ExclamationCircleIcon },
//     'payé':       { bg: '#d1fae5', color: '#059669', label: 'Payé',       Icon: CheckCircleIcon },
//     'impayé':     { bg: '#fef3c7', color: '#d97706', label: 'Impayé',     Icon: ExclamationCircleIcon },
//   };
//   const s = map[status] || { bg: '#f1f3f7', color: '#8898b0', label: status, Icon: null };
//   const sm = size === 'sm';
//   return (
//     <span style={{
//       display: 'inline-flex', alignItems: 'center', gap: sm ? 4 : 5,
//       padding: sm ? '2px 8px' : '3px 10px', borderRadius: 99,
//       background: s.bg, color: s.color,
//       fontSize: sm ? 10 : 11, fontWeight: 700,
//     }}>
//       {s.Icon && <s.Icon style={{ width: sm ? 10 : 11, height: sm ? 10 : 11 }} />}
//       {s.label}
//     </span>
//   );
// };

// /* ─── STAT CARD ──────────────────────────────── */
// const StatCard = ({ title, value, sub, icon: Icon, color, linkTo, linkLabel, delta }) => (
//   <div style={{
//     background: tk.white, borderRadius: 18, padding: '20px 22px',
//     border: `1.5px solid ${tk.border}`,
//     boxShadow: '0 1px 4px rgba(11,17,32,.04)',
//     transition: 'transform .2s, box-shadow .2s',
//   }}
//   onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(11,17,32,.09)'; }}
//   onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = '0 1px 4px rgba(11,17,32,.04)'; }}>
//     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
//       <span style={{
//         width: 44, height: 44, borderRadius: 13, background: `${color}18`,
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//       }}>
//         <Icon style={{ width: 22, height: 22, color }} />
//       </span>
//       {linkTo && (
//         <Link to={linkTo} style={{
//           fontSize: 11, fontWeight: 600, color, textDecoration: 'none',
//           display: 'flex', alignItems: 'center', gap: 3,
//           padding: '4px 10px', borderRadius: 99, background: `${color}10`,
//         }}>
//           {linkLabel} <ChevronRightIcon style={{ width: 10, height: 10 }} />
//         </Link>
//       )}
//     </div>
//     <div style={{ fontSize: 30, fontWeight: 800, color: tk.ink, letterSpacing: '-.02em', marginBottom: 4 }}>
//       {value}
//     </div>
//     <div style={{ fontSize: 12, fontWeight: 600, color: tk.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>
//       {title}
//     </div>
//     {sub && <div style={{ fontSize: 11, color: tk.muted, marginTop: 3 }}>{sub}</div>}
//   </div>
// );

// /* ─── PACKAGE CARD ───────────────────────────── */
// const PkgCard = ({ pkg, onClick, active }) => {
//   const statusColor = {
//     'livré': tk.emerald, 'en transit': tk.accent, 'en attente': tk.amber, 'annulé': tk.rose,
//   }[pkg.status] || tk.muted;

//   return (
//     <div
//       onClick={() => onClick(pkg)}
//       style={{
//         display: 'flex', alignItems: 'center', gap: 14,
//         padding: '13px 20px', cursor: 'pointer',
//         background: active ? tk.accentSoft : 'transparent',
//         borderLeft: `3px solid ${active ? tk.accent : 'transparent'}`,
//         borderBottom: `1px solid ${tk.border}`,
//         transition: 'background .12s',
//       }}
//       onMouseEnter={e => { if (!active) e.currentTarget.style.background = tk.bg; }}
//       onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
//       <div style={{
//         width: 42, height: 42, borderRadius: 12, flexShrink: 0,
//         background: `${statusColor}12`,
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//       }}>
//         <CubeIcon style={{ width: 20, height: 20, color: statusColor }} />
//       </div>
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tk.ink,
//           whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//           {pkg.trackingNumber || `#PKG`}
//         </p>
//         <p style={{ margin: '2px 0 0', fontSize: 11, color: tk.muted }}>
//           {pkg.destination || '—'} · {pkg.weight ? `${pkg.weight} kg` : '—'}
//         </p>
//       </div>
//       <div style={{ textAlign: 'right', flexShrink: 0 }}>
//         <StatusBadge status={pkg.status || 'en attente'} size="sm" />
//         <p style={{ margin: '3px 0 0', fontSize: 10, color: tk.muted }}>{fmtDate(pkg.createdAt)}</p>
//       </div>
//     </div>
//   );
// };

// /* ─── TIMELINE ───────────────────────────────── */
// const getTimeline = (pkg) => {
//   const status = pkg?.status || '';
//   const steps = [
//     { key: 'enregistré', label: 'Colis enregistré',       date: pkg?.createdAt,      done: true },
//     { key: 'transit',    label: 'En transit',             date: pkg?.updatedAt,      done: ['en transit','livré'].includes(status) },
//     { key: 'livraison',  label: 'En cours de livraison',  date: null,                done: status === 'livré', active: status === 'en transit' },
//     { key: 'livré',      label: 'Livré',                  date: status === 'livré' ? pkg?.updatedAt : null,
//       done: status === 'livré', active: false },
//   ];
//   if (status === 'annulé') {
//     return [
//       { key: 'enregistré', label: 'Colis enregistré', date: pkg?.createdAt, done: true },
//       { key: 'annulé', label: 'Annulé', date: pkg?.updatedAt, done: true, cancelled: true },
//     ];
//   }
//   return steps;
// };

// const TimelineStep = ({ label, date, done, active, cancelled, last }) => {
//   const color = cancelled ? tk.rose : done ? tk.emerald : active ? tk.accent : tk.border;
//   return (
//     <div style={{ display: 'flex', gap: 14, marginBottom: last ? 0 : 4 }}>
//       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
//         <div style={{
//           width: 28, height: 28, borderRadius: '50%',
//           background: done || cancelled ? color : active ? tk.accentSoft : tk.bg,
//           border: `2px solid ${color}`,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           flexShrink: 0,
//         }}>
//           {(done || cancelled) && <CheckCircleIcon style={{ width: 14, height: 14, color: '#fff' }} />}
//           {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: tk.accent }} />}
//         </div>
//         {!last && <div style={{ width: 2, flex: 1, minHeight: 24, background: done ? color : tk.border, marginTop: 2 }} />}
//       </div>
//       <div style={{ paddingTop: 4, paddingBottom: 18 }}>
//         <p style={{
//           margin: 0, fontSize: 13,
//           fontWeight: done || active ? 700 : 400,
//           color: cancelled ? tk.rose : done ? tk.emerald : active ? tk.accent : tk.muted,
//         }}>{label}</p>
//         {date && (
//           <p style={{ margin: '2px 0 0', fontSize: 11, color: tk.muted }}>
//             {fmtDateTime(date)}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// /* ─── PAYMENT ROW ────────────────────────────── */
// const PayRow = ({ ref_, amount, status, date }) => (
//   <div style={{
//     display: 'flex', alignItems: 'center', gap: 14,
//     padding: '12px 0', borderBottom: `1px solid ${tk.border}`,
//   }}>
//     <div style={{
//       width: 38, height: 38, borderRadius: 10, flexShrink: 0,
//       background: status === 'payé' ? tk.emeraldSoft : tk.amberSoft,
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//     }}>
//       <CreditCardIcon style={{ width: 18, height: 18, color: status === 'payé' ? tk.emerald : tk.amber }} />
//     </div>
//     <div style={{ flex: 1 }}>
//       <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tk.ink }}>{ref_ || '—'}</p>
//       <p style={{ margin: '2px 0 0', fontSize: 11, color: tk.muted }}>{date}</p>
//     </div>
//     <div style={{ textAlign: 'right', flexShrink: 0 }}>
//       <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: tk.ink }}>{fmtE(amount)}</p>
//       <div style={{ marginTop: 3 }}><StatusBadge status={status} size="sm" /></div>
//     </div>
//   </div>
// );

// /* ─── SECTION HEADER ─────────────────────────── */
// const SectionHeader = ({ icon: Icon, title, color = tk.accent, action }) => (
//   <div style={{
//     display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//     padding: '14px 20px', background: tk.bg, borderBottom: `1px solid ${tk.border}`,
//   }}>
//     <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//       <div style={{ width: 30, height: 30, borderRadius: 8, background: tk.white,
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         boxShadow: '0 1px 4px rgba(0,0,0,.07)' }}>
//         <Icon style={{ width: 14, height: 14, color }} />
//       </div>
//       <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.muted }}>
//         {title}
//       </span>
//     </div>
//     {action}
//   </div>
// );

// /* ─── MAIN COMPONENT ─────────────────────────── */
// const DashboardClient = () => {
//   const { user } = useAuth();
//   const navigate  = useNavigate();
//   const [stats,    setStats]    = useState({ total: 0, enTransit: 0, livres: 0, enAttente: 0, annules: 0, depenses: 0 });
//   const [packages, setPackages] = useState([]);
//   const [payments, setPayments] = useState([]);
//   const [chartData,setChartData]= useState({ colisParMois: [], repartition: [] });
//   const [selected, setSelected] = useState(null);
//   const [trackingInput, setTracking] = useState('');
//   const [loading,  setLoading]  = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error,    setError]    = useState(null);
//   const [lastRefresh, setLastRefresh] = useState(new Date());
//   const timerRef = useRef(null);

//   /* ── fetch ── */
//   const fetchAll = useCallback(async (silent = false) => {
//     if (!silent) setLoading(true);
//     else setRefreshing(true);
//     setError(null);
//     try {
//       const [pkgRes, payRes, cRes] = await Promise.allSettled([
//         axios.get('/packages?sort=-createdAt'),
//         axios.get('/payments?limit=8&sort=-createdAt'),
//         axios.get('/dashboard/charts'),
//       ]);

//       let pkgs = [];
//       if (pkgRes.status === 'fulfilled') {
//         const d = pkgRes.value.data;
//         pkgs = d?.data?.packages ?? d?.data?.items ?? d?.packages ?? d?.items
//           ?? (Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
//         setPackages(pkgs);
//         setStats({
//           total:     pkgs.length,
//           enTransit: pkgs.filter(p => p.status === 'en transit').length,
//           livres:    pkgs.filter(p => p.status === 'livré').length,
//           enAttente: pkgs.filter(p => p.status === 'en attente').length,
//           annules:   pkgs.filter(p => p.status === 'annulé').length,
//           depenses:  pkgs.filter(p=>!p.financial).reduce((s, p) => s + Number(p.price ?? p.amount ?? p.totalPrice ?? 0), 0),
//         });
//         if (pkgs.length > 0 && !selected) setSelected(pkgs[0]);
//       }

//       if (payRes.status === 'fulfilled') {
//         const d = payRes.value.data;
//         const list = d?.data?.payments ?? d?.data?.items ?? d?.payments ?? d?.items
//           ?? (Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
//         setPayments(list);
//       }

//       if (cRes.status === 'fulfilled') {
//         const c = cRes.value.data?.data ?? cRes.value.data ?? {};
//         setChartData({
//           colisParMois: Array.isArray(c.revenueByMonth)   ? c.revenueByMonth   : [],
//           repartition:  Array.isArray(c.packagesByStatus) ? c.packagesByStatus : [],
//         });
//       }

//       setLastRefresh(new Date());
//     } catch { setError('Impossible de charger vos données.'); }
//     finally { setLoading(false); setRefreshing(false); }
//   }, []);

//   useEffect(() => {
//     fetchAll(false);
//     timerRef.current = setInterval(() => fetchAll(true), 60_000);
//     return () => clearInterval(timerRef.current);
//   }, [fetchAll]);

//   const handleRefresh = async () => {
//     await fetchAll(true);
//     toast.success('Données actualisées');
//   };

//   const prenom = user?.firstName || user?.name || 'Client';
//   const now    = new Date();
//   const timeline = selected ? getTimeline(selected) : [];

//   /* ── chart configs ── */
//   const lineData = {
//     labels: chartData.colisParMois.map(i => i.month),
//     datasets: [{
//       label: 'Mes colis',
//       data: chartData.colisParMois.map(i => i.count ?? i.value ?? 0),
//       borderColor: tk.accent,
//       backgroundColor: `${tk.accent}0c`,
//       tension: .45, fill: true, borderWidth: 2.5,
//       pointBackgroundColor: tk.accent, pointRadius: 4, pointHoverRadius: 6,
//     }],
//   };
//   const lineOptions = {
//     responsive: true, maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       tooltip: { backgroundColor: '#fff', borderColor: tk.border, borderWidth: 1,
//         titleColor: tk.ink, bodyColor: tk.sec, padding: 10, cornerRadius: 8 },
//     },
//     scales: {
//       y: { beginAtZero: true, grid: { color: tk.border }, ticks: { color: tk.muted, font: { size: 11 } } },
//       x: { grid: { display: false }, ticks: { color: tk.muted, font: { size: 11 } } },
//     },
//   };

//   const donutColors = [tk.emerald, tk.accent, tk.amber, tk.rose];
//   const donutLabels = chartData.repartition.length
//     ? chartData.repartition.map(i => i.status)
//     : ['Livrés', 'En transit', 'En attente'];
//   const donutValues = chartData.repartition.length
//     ? chartData.repartition.map(i => i.count)
//     : [stats.livres, stats.enTransit, stats.enAttente];

//   const donutData = {
//     labels: donutLabels,
//     datasets: [{
//       data: donutValues,
//       backgroundColor: donutColors,
//       borderWidth: 3, borderColor: '#fff', hoverOffset: 4,
//     }],
//   };
//   const donutOptions = {
//     responsive: true, maintainAspectRatio: false, cutout: '70%',
//     plugins: {
//       legend: { display: false },
//       tooltip: { backgroundColor: '#fff', borderColor: tk.border, borderWidth: 1,
//         titleColor: tk.ink, bodyColor: tk.sec, padding: 10, cornerRadius: 8 },
//     },
//   };

//   /* ── LOADING ── */
//   if (loading) return (
//     <div style={{ display: 'flex', flex: 1, minHeight: '100vh', background: tk.bg,
//       alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
//       <div style={{
//         width: 44, height: 44, border: `3px solid ${tk.border}`,
//         borderTop: `3px solid ${tk.accent}`, borderRadius: '50%',
//         animation: 'spin .9s linear infinite',
//       }} />
//       <p style={{ color: tk.muted, fontSize: 13, margin: 0 }}>Chargement de votre espace…</p>
//       <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
//     </div>
//   );

//   if (error) return (
//     <div style={{ display: 'flex', flex: 1, minHeight: '100vh', background: tk.bg,
//       alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
//       <ExclamationCircleIcon style={{ width: 40, height: 40, color: tk.rose }} />
//       <p style={{ color: tk.rose, fontSize: 14, margin: 0 }}>{error}</p>
//       <button onClick={() => fetchAll(false)} style={{
//         padding: '10px 24px', background: tk.accent, border: 'none',
//         borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600,
//         cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
//       }}>
//         <ArrowPathIcon style={{ width: 16, height: 16 }} />Réessayer
//       </button>
//     </div>
//   );

//   return (
//     <div style={{ background: tk.bg, flex: 1, minHeight: '100vh' }}>
//       <style>{`@keyframes spin { to { transform:rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
//       <div style={{ padding: '28px 32px', maxWidth: 1520, margin: '0 auto' }}>

//         {/* ── HEADER ── */}
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
//             <div style={{ width: 52, height: 52, borderRadius: 16, background: tk.accentSoft,
//               display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               <SparklesIcon style={{ width: 26, height: 26, color: tk.accent }} />
//             </div>
//             <div>
//               <h1 style={{ fontSize: 22, fontWeight: 800, color: tk.ink, margin: 0, letterSpacing: '-.02em' }}>
//                 Bonjour, {prenom} 👋
//               </h1>
//               <p style={{ fontSize: 13, color: tk.muted, margin: '3px 0 0', textTransform: 'capitalize' }}>
//                 {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
//                 {' · '}Mon espace client
//               </p>
//             </div>
//           </div>

//           <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
//             {/* live indicator */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px',
//               background: tk.white, border: `1.5px solid ${tk.border}`, borderRadius: 10 }}>
//               <span style={{ width: 8, height: 8, borderRadius: '50%', background: tk.emerald, animation: 'pulse 2s ease infinite' }} />
//               <span style={{ fontSize: 12, color: tk.sec, fontWeight: 500 }}>
//                 {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
//               </span>
//             </div>
//             {/* Search tracking */}
//             <div style={{ display: 'flex', alignItems: 'center', gap: 8,
//               background: tk.white, border: `1.5px solid ${tk.border}`, borderRadius: 12, padding: '8px 14px' }}>
//               <MagnifyingGlassIcon style={{ width: 16, height: 16, color: tk.muted }} />
//               <input
//                 value={trackingInput}
//                 onChange={e => setTracking(e.target.value)}
//                 onKeyDown={e => e.key === 'Enter' && navigate(`/app/packages/tracking?number=${encodeURIComponent(trackingInput.trim())}`)}
//                 placeholder="N° de suivi…"
//                 style={{ border: 'none', outline: 'none', fontSize: 13, color: tk.ink, width: 170, background: 'none' }}
//               />
//             </div>
//             <button
//               onClick={() => {
//                 const q = trackingInput.trim();
//                 navigate(q ? `/app/packages/tracking?number=${encodeURIComponent(q)}` : '/app/packages/tracking');
//               }}
//               style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 20px',
//                 borderRadius: 10, background: tk.accent, color: '#fff', border: 'none',
//                 fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
//               <TruckIcon style={{ width: 16, height: 16 }} />Suivre
//             </button>
//             <button
//               onClick={handleRefresh} disabled={refreshing}
//               style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px',
//                 borderRadius: 10, background: tk.white, color: tk.accent,
//                 border: `1.5px solid ${tk.border}`, fontSize: 13, fontWeight: 600,
//                 cursor: refreshing ? 'not-allowed' : 'pointer', opacity: refreshing ? .7 : 1 }}>
//               <ArrowPathIcon style={{ width: 15, height: 15, animation: refreshing ? 'spin .8s linear infinite' : 'none' }} />
//               {refreshing ? 'Actualisation…' : 'Actualiser'}
//             </button>
//           </div>
//         </div>

//         {/* ── STAT CARDS ── */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
//           <StatCard title="Total colis" value={fmt(stats.total)} sub="Tous statuts" icon={CubeIcon} color={tk.accent} linkTo="/app/packages" linkLabel="Voir" />
//           <StatCard title="En transit" value={fmt(stats.enTransit)} sub="En route" icon={TruckIcon} color={tk.accent} linkTo="/app/packages" linkLabel="Détails" />
//           <StatCard title="Livrés" value={fmt(stats.livres)} sub="Réceptionnés" icon={CheckCircleIcon} color={tk.emerald} linkTo="/app/packages" linkLabel="Historique" />
//           <StatCard title="En attente" value={fmt(stats.enAttente)} sub="Non traités" icon={ClockIcon} color={tk.amber} linkTo="/app/packages" linkLabel="Voir" />
//           <StatCard title="Mes dépenses" value={fmtE(stats.depenses)} sub="Total payé" icon={CurrencyDollarIcon} color={tk.purple} linkTo="/app/payments" linkLabel="Paiements" />
//         </div>

//         {/* ── CHARTS ── */}
//         <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 20, marginBottom: 24 }}>

//           {/* Line chart */}
//           <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(11,17,32,.04)' }}>
//             <div style={{ padding: '18px 22px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//               <div>
//                 <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, margin: 0 }}>Activité colis</h3>
//                 <p style={{ fontSize: 12, color: tk.muted, margin: '3px 0 0' }}>Volume par mois — 6 derniers mois</p>
//               </div>
//             </div>
//             <div style={{ padding: '0 22px 20px', height: 230 }}>
//               {chartData.colisParMois.length > 0
//                 ? <Line data={lineData} options={lineOptions} />
//                 : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
//                     <InboxIcon style={{ width: 36, height: 36, color: tk.border }} />
//                     <span style={{ fontSize: 13, color: tk.muted }}>Aucune donnée disponible</span>
//                   </div>
//               }
//             </div>
//           </div>

//           {/* Donut */}
//           <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(11,17,32,.04)' }}>
//             <div style={{ padding: '18px 22px 12px' }}>
//               <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, margin: 0 }}>Répartition</h3>
//               <p style={{ fontSize: 12, color: tk.muted, margin: '3px 0 0' }}>Colis par statut</p>
//             </div>
//             <div style={{ padding: '0 22px', height: 160 }}>
//               <Doughnut data={donutData} options={donutOptions} />
//             </div>
//             <div style={{ padding: '12px 22px 20px' }}>
//               {[
//                 { label: 'Livrés',    value: stats.livres,    color: tk.emerald },
//                 { label: 'En transit',value: stats.enTransit, color: tk.accent  },
//                 { label: 'En attente',value: stats.enAttente, color: tk.amber   },
//                 { label: 'Annulés',   value: stats.annules,   color: tk.rose    },
//               ].map(r => (
//                 <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${tk.border}` }}>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                     <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
//                     <span style={{ fontSize: 13, color: tk.sec }}>{r.label}</span>
//                   </div>
//                   <span style={{ fontSize: 14, fontWeight: 700, color: r.color }}>{r.value}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ── COLIS + SUIVI ── */}
//         <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginBottom: 24 }}>

//           {/* Liste colis */}
//           <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(11,17,32,.04)' }}>
//             <SectionHeader
//               icon={CubeIcon} title="Mes colis"
//               action={
//                 <Link to="/app/packages" style={{ fontSize: 12, color: tk.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
//                   Voir tout <ChevronRightIcon style={{ width: 11, height: 11 }} />
//                 </Link>
//               }
//             />
//             <div style={{ maxHeight: 420, overflowY: 'auto' }}>
//               {packages.length > 0 ? packages.map((p, i) => (
//                 <PkgCard
//                   key={p._id || i}
//                   pkg={p}
//                   onClick={setSelected}
//                   active={selected?._id === p._id}
//                 />
//               )) : (
//                 <div style={{ padding: '40px 20px', textAlign: 'center' }}>
//                   <InboxIcon style={{ width: 40, height: 40, color: tk.border, marginBottom: 10 }} />
//                   <p style={{ color: tk.muted, fontSize: 13, margin: 0 }}>Vous n'avez aucun colis</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Suivi détaillé */}
//           <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(11,17,32,.04)' }}>
//             <SectionHeader icon={TruckIcon} title="Suivi en temps réel" />
//             <div style={{ padding: '18px 22px' }}>
//               {selected ? (
//                 <>
//                   {/* Colis info */}
//                   <div style={{
//                     background: tk.bg, borderRadius: 14, padding: '14px 16px',
//                     border: `1px solid ${tk.border}`, marginBottom: 20,
//                   }}>
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
//                       <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: tk.ink }}>
//                         {selected.trackingNumber || '—'}
//                       </p>
//                       <StatusBadge status={selected.status || 'en attente'} />
//                     </div>
//                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
//                       {[
//                         { Icon: MapPinIcon,       label: 'Destination', val: selected.destination || '—' },
//                         { Icon: ScaleIcon,         label: 'Poids',       val: selected.weight ? `${selected.weight} kg` : '—' },
//                         { Icon: CalendarDaysIcon,  label: 'Création',    val: fmtDate(selected.createdAt) },
//                         { Icon: CurrencyDollarIcon, label: 'Montant',   val: selected.financial ? amountText(selected.financial.totalMinor,selected.financial.referenceCurrency) : fmtE(selected.price ?? selected.amount ?? selected.totalPrice ?? 0) },
//                       ].map(r => (
//                         <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
//                           <r.Icon style={{ width: 13, height: 13, color: tk.muted, flexShrink: 0 }} />
//                           <div>
//                             <p style={{ margin: 0, fontSize: 10, color: tk.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>{r.label}</p>
//                             <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: tk.ink }}>{r.val}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Timeline */}
//                   <div>
//                     {timeline.map((step, i) => (
//                       <TimelineStep
//                         key={step.key}
//                         label={step.label}
//                         date={step.date}
//                         done={step.done}
//                         active={step.active}
//                         cancelled={step.cancelled}
//                         last={i === timeline.length - 1}
//                       />
//                     ))}
//                   </div>
//                 </>
//               ) : (
//                 <div style={{ textAlign: 'center', padding: '40px 0' }}>
//                   <TruckIcon style={{ width: 40, height: 40, color: tk.border, marginBottom: 10 }} />
//                   <p style={{ color: tk.muted, fontSize: 13, margin: 0 }}>Sélectionnez un colis pour voir son suivi</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ── PAIEMENTS ── */}
//         <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(11,17,32,.04)' }}>
//           <SectionHeader
//             icon={CreditCardIcon} title="Mes paiements"
//             action={
//               <Link to="/app/payments" style={{ fontSize: 12, color: tk.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
//                 Voir tout <ChevronRightIcon style={{ width: 11, height: 11 }} />
//               </Link>
//             }
//           />
//           <div style={{ padding: '0 20px' }}>
//             {payments.length > 0 ? payments.slice(0, 6).map((p, i) => (
//               <PayRow
//                 key={p._id || i}
//                 ref_={p.reference || p.trackingNumber || `#PAY-${i + 1}`}
//                 amount={p.amount ?? 0}
//                 status={p.status || 'impayé'}
//                 date={fmtDateTime(p.createdAt)}
//               />
//             )) : (
//               <div style={{ padding: '40px 0', textAlign: 'center' }}>
//                 <CreditCardIcon style={{ width: 36, height: 36, color: tk.border, marginBottom: 8 }} />
//                 <p style={{ color: tk.muted, fontSize: 13, margin: 0 }}>Aucun paiement trouvé</p>
//               </div>
//             )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default DashboardClient;




















import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Context/AuthContext';
import { toast } from 'react-toastify';
import WebSocketService from '../../services/websocket';
import {
  CubeIcon, TruckIcon, CreditCardIcon, BellIcon,
  MagnifyingGlassIcon, ArrowPathIcon, CheckCircleIcon, ClockIcon,
  SparklesIcon, CurrencyDollarIcon, ExclamationCircleIcon,
  ChevronRightIcon, MapPinIcon, ScaleIcon, CalendarDaysIcon,
  ArrowUpIcon, ArrowDownIcon, InboxIcon,
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import axios from '../../api/axios';
import { formatMoney, getCurrency, digitsOf } from '../../config/currencies';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler,
);

/* ─── TOKENS ─────────────────────────────────── */
const tk = {
  bg:         '#f4f6fb',
  white:      '#ffffff',
  border:     '#e4e9f2',
  ink:        '#0b1120',
  sec:        '#4b5a72',
  muted:      '#8898b0',
  accent:     '#2560eb',
  accentSoft: '#deeafd',
  emerald:    '#059669',
  emeraldSoft:'#d1fae5',
  amber:      '#d97706',
  amberSoft:  '#fef3c7',
  rose:       '#dc2626',
  roseSoft:   '#fee2e2',
  purple:     '#7c3aed',
  purpleSoft: '#ede9fe',
};

/* ─── HELPERS ─────────────────────────────────── */
const fmt  = n  => Number(n || 0).toLocaleString('fr-FR');
// Montant dans SA devise (avant : « € » pour tous les montants).
const fmtE = (n, currency) => formatMoney(Number(n || 0), currency);
// Totaux PAR DEVISE → « 24,690 TND · 2,50 € » (jamais d'addition entre devises).
const fmtByCurrency = (map) => {
  const entries = Object.entries(map || {}).filter(([, v]) => v);
  return entries.length ? entries.map(([c, v]) => fmtE(v, c)).join(' · ') : fmtE(0);
};
const fmtDate = d => d ? new Date(d).toLocaleDateString('fr-FR') : '—';
const fmtDateTime = d => d
  ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  : '—';

/* ─── STATUS BADGE ───────────────────────────── */
const StatusBadge = ({ status, size = 'md' }) => {
  const map = {
    'livré':      { bg: '#d1fae5', color: '#059669', label: 'Livré',      Icon: CheckCircleIcon },
    'en transit': { bg: '#deeafd', color: '#2560eb', label: 'En transit', Icon: TruckIcon },
    'en attente': { bg: '#fef3c7', color: '#d97706', label: 'En attente', Icon: ClockIcon },
    'annulé':     { bg: '#fee2e2', color: '#dc2626', label: 'Annulé',     Icon: ExclamationCircleIcon },
    'payé':       { bg: '#d1fae5', color: '#059669', label: 'Payé',       Icon: CheckCircleIcon },
    'impayé':     { bg: '#fef3c7', color: '#d97706', label: 'Impayé',     Icon: ExclamationCircleIcon },
  };
  const s = map[status] || { bg: '#f1f3f7', color: '#8898b0', label: status, Icon: null };
  const sm = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: sm ? 4 : 5,
      padding: sm ? '2px 8px' : '3px 10px', borderRadius: 99,
      background: s.bg, color: s.color,
      fontSize: sm ? 10 : 11, fontWeight: 700,
    }}>
      {s.Icon && <s.Icon style={{ width: sm ? 10 : 11, height: sm ? 10 : 11 }} />}
      {s.label}
    </span>
  );
};

/* ─── STAT CARD ──────────────────────────────── */
const StatCard = ({ title, value, sub, icon: Icon, color, linkTo, linkLabel, delta }) => (
  <div style={{
    background: tk.white, borderRadius: 18, padding: '20px 22px',
    border: `1.5px solid ${tk.border}`,
    boxShadow: '0 1px 4px rgba(11,17,32,.04)',
    transition: 'transform .2s, box-shadow .2s',
  }}
  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(11,17,32,.09)'; }}
  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = '0 1px 4px rgba(11,17,32,.04)'; }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
      <span style={{
        width: 44, height: 44, borderRadius: 13, background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon style={{ width: 22, height: 22, color }} />
      </span>
      {linkTo && (
        <Link to={linkTo} style={{
          fontSize: 11, fontWeight: 600, color, textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: 3,
          padding: '4px 10px', borderRadius: 99, background: `${color}10`,
        }}>
          {linkLabel} <ChevronRightIcon style={{ width: 10, height: 10 }} />
        </Link>
      )}
    </div>
    <div style={{ fontSize: 30, fontWeight: 800, color: tk.ink, letterSpacing: '-.02em', marginBottom: 4 }}>
      {value}
    </div>
    <div style={{ fontSize: 12, fontWeight: 600, color: tk.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>
      {title}
    </div>
    {sub && <div style={{ fontSize: 11, color: tk.muted, marginTop: 3 }}>{sub}</div>}
  </div>
);

/* ─── PACKAGE CARD ───────────────────────────── */
const PkgCard = ({ pkg, onClick, active }) => {
  const statusColor = {
    'livré': tk.emerald, 'en transit': tk.accent, 'en attente': tk.amber, 'annulé': tk.rose,
  }[pkg.status] || tk.muted;

  return (
    <div
      onClick={() => onClick(pkg)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '13px 20px', cursor: 'pointer',
        background: active ? tk.accentSoft : 'transparent',
        borderLeft: `3px solid ${active ? tk.accent : 'transparent'}`,
        borderBottom: `1px solid ${tk.border}`,
        transition: 'background .12s',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = tk.bg; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
        background: `${statusColor}12`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <CubeIcon style={{ width: 20, height: 20, color: statusColor }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tk.ink,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {pkg.trackingNumber || `#PKG`}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: tk.muted }}>
          {pkg.destination || '—'} · {pkg.weight ? `${pkg.weight} kg` : '—'}
        </p>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <StatusBadge status={pkg.status || 'en attente'} size="sm" />
        <p style={{ margin: '3px 0 0', fontSize: 10, color: tk.muted }}>{fmtDate(pkg.createdAt)}</p>
      </div>
    </div>
  );
};

/* ─── TIMELINE ───────────────────────────────── */
const getTimeline = (pkg) => {
  const status = pkg?.status || '';
  const steps = [
    { key: 'enregistré', label: 'Colis enregistré',       date: pkg?.createdAt,      done: true },
    { key: 'transit',    label: 'En transit',             date: pkg?.updatedAt,      done: ['en transit','livré'].includes(status) },
    { key: 'livraison',  label: 'En cours de livraison',  date: null,                done: status === 'livré', active: status === 'en transit' },
    { key: 'livré',      label: 'Livré',                  date: status === 'livré' ? pkg?.updatedAt : null,
      done: status === 'livré', active: false },
  ];
  if (status === 'annulé') {
    return [
      { key: 'enregistré', label: 'Colis enregistré', date: pkg?.createdAt, done: true },
      { key: 'annulé', label: 'Annulé', date: pkg?.updatedAt, done: true, cancelled: true },
    ];
  }
  return steps;
};

const TimelineStep = ({ label, date, done, active, cancelled, last }) => {
  const color = cancelled ? tk.rose : done ? tk.emerald : active ? tk.accent : tk.border;
  return (
    <div style={{ display: 'flex', gap: 14, marginBottom: last ? 0 : 4 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: done || cancelled ? color : active ? tk.accentSoft : tk.bg,
          border: `2px solid ${color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {(done || cancelled) && <CheckCircleIcon style={{ width: 14, height: 14, color: '#fff' }} />}
          {active && <div style={{ width: 8, height: 8, borderRadius: '50%', background: tk.accent }} />}
        </div>
        {!last && <div style={{ width: 2, flex: 1, minHeight: 24, background: done ? color : tk.border, marginTop: 2 }} />}
      </div>
      <div style={{ paddingTop: 4, paddingBottom: 18 }}>
        <p style={{
          margin: 0, fontSize: 13,
          fontWeight: done || active ? 700 : 400,
          color: cancelled ? tk.rose : done ? tk.emerald : active ? tk.accent : tk.muted,
        }}>{label}</p>
        {date && (
          <p style={{ margin: '2px 0 0', fontSize: 11, color: tk.muted }}>
            {fmtDateTime(date)}
          </p>
        )}
      </div>
    </div>
  );
};

/* ─── PAYMENT ROW ────────────────────────────── */
const PayRow = ({ ref_, amount, currency, status, date }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '12px 0', borderBottom: `1px solid ${tk.border}`,
  }}>
    <div style={{
      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
      background: status === 'payé' ? tk.emeraldSoft : tk.amberSoft,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <CreditCardIcon style={{ width: 18, height: 18, color: status === 'payé' ? tk.emerald : tk.amber }} />
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tk.ink }}>{ref_ || '—'}</p>
      <p style={{ margin: '2px 0 0', fontSize: 11, color: tk.muted }}>{date}</p>
    </div>
    <div style={{ textAlign: 'right', flexShrink: 0 }}>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: tk.ink }}>{fmtE(amount, currency)}</p>
      <div style={{ marginTop: 3 }}><StatusBadge status={status} size="sm" /></div>
    </div>
  </div>
);

/* ─── SECTION HEADER ─────────────────────────── */
const SectionHeader = ({ icon: Icon, title, color = tk.accent, action }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px', background: tk.bg, borderBottom: `1px solid ${tk.border}`,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: tk.white,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,.07)' }}>
        <Icon style={{ width: 14, height: 14, color }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.muted }}>
        {title}
      </span>
    </div>
    {action}
  </div>
);

/* ─── MAIN COMPONENT ─────────────────────────── */
const DashboardClient = () => {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [stats,    setStats]    = useState({ total: 0, enTransit: 0, livres: 0, enAttente: 0, annules: 0, depenses: {} });
  const [packages, setPackages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [chartData,setChartData]= useState({ colisParMois: [], repartition: [] });
  const [selected, setSelected] = useState(null);
  const [trackingInput, setTracking] = useState('');
  const [loading,  setLoading]  = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,    setError]    = useState(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const timerRef = useRef(null);

  /* ── fetch ── */
  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const [pkgRes, payRes, cRes] = await Promise.allSettled([
        axios.get('/packages?sort=-createdAt'),
        axios.get('/payments?limit=8&sort=-createdAt'),
        axios.get('/dashboard/charts'),
      ]);

      let pkgs = [];
      if (pkgRes.status === 'fulfilled') {
        const d = pkgRes.value.data;
        pkgs = d?.data?.packages ?? d?.data?.items ?? d?.packages ?? d?.items
          ?? (Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
        setPackages(pkgs);
        setStats({
          total:     pkgs.length,
          enTransit: pkgs.filter(p => p.status === 'en transit').length,
          livres:    pkgs.filter(p => p.status === 'livré').length,
          enAttente: pkgs.filter(p => p.status === 'en attente').length,
          annules:   pkgs.filter(p => p.status === 'annulé').length,
          // Montants réellement payés, PAR DEVISE : encaissements multidevises (dans leur devise)
          // + anciens colis marqués payés (devise du pays d'origine). Avant : somme de tous les prix,
          // payés ou non, toutes devises confondues, affichée en euros.
          depenses: pkgs.reduce((acc, p) => {
            if (p.financial) {
              for (const t of p.financial.transactions || []) { if (t.status === 'cancelled') continue; acc[t.currency] = (acc[t.currency] || 0) + t.amountMinor / 10 ** digitsOf(t.currency); } // paiements annulés exclus
            } else if (p.isPaid && p.totalPrice) {
              const c = getCurrency(p.origin)?.code || '';
              acc[c] = (acc[c] || 0) + Number(p.totalPrice);
            }
            return acc;
          }, {}),
        });
        if (pkgs.length > 0 && !selected) setSelected(pkgs[0]);
      }

      if (payRes.status === 'fulfilled') {
        const d = payRes.value.data;
        const list = d?.data?.payments ?? d?.data?.items ?? d?.payments ?? d?.items
          ?? (Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
        setPayments(list);
      }

      if (cRes.status === 'fulfilled') {
        const c = cRes.value.data?.data ?? cRes.value.data ?? {};
        setChartData({
          colisParMois: Array.isArray(c.revenueByMonth)   ? c.revenueByMonth   : [],
          repartition:  Array.isArray(c.packagesByStatus) ? c.packagesByStatus : [],
        });
      }

      setLastRefresh(new Date());
    } catch { setError('Impossible de charger vos données.'); }
    finally { setLoading(false); setRefreshing(false); }
  }, []);

  /* Chargement initial + Socket.IO temps réel + fallback polling 5 min */
  useEffect(() => {
    fetchAll(false);

    // Socket.IO : mise à jour instantanée dès qu'un colis change
    WebSocketService.connect();
    const handleDashboardUpdate = () => fetchAll(true);
    WebSocketService.on('dashboard_update', handleDashboardUpdate);

    // Fallback polling toutes les 5 min (était 60 s)
    timerRef.current = setInterval(() => fetchAll(true), 300_000);

    return () => {
      clearInterval(timerRef.current);
      WebSocketService.off('dashboard_update', handleDashboardUpdate);
    };
  }, [fetchAll]);

  const handleRefresh = async () => {
    await fetchAll(true);
    toast.success('Données actualisées');
  };

  const prenom = user?.firstName || user?.name || 'Client';
  const now    = new Date();
  const timeline = selected ? getTimeline(selected) : [];

  /* ── chart configs ── */
  const lineData = {
    labels: chartData.colisParMois.map(i => i.month),
    datasets: [{
      label: 'Mes colis',
      data: chartData.colisParMois.map(i => i.count ?? i.value ?? 0),
      borderColor: tk.accent,
      backgroundColor: `${tk.accent}0c`,
      tension: .45, fill: true, borderWidth: 2.5,
      pointBackgroundColor: tk.accent, pointRadius: 4, pointHoverRadius: 6,
    }],
  };
  const lineOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#fff', borderColor: tk.border, borderWidth: 1,
        titleColor: tk.ink, bodyColor: tk.sec, padding: 10, cornerRadius: 8 },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: tk.border }, ticks: { color: tk.muted, font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { color: tk.muted, font: { size: 11 } } },
    },
  };

  const donutColors = [tk.emerald, tk.accent, tk.amber, tk.rose];
  const donutLabels = chartData.repartition.length
    ? chartData.repartition.map(i => i.status)
    : ['Livrés', 'En transit', 'En attente'];
  const donutValues = chartData.repartition.length
    ? chartData.repartition.map(i => i.count)
    : [stats.livres, stats.enTransit, stats.enAttente];

  const donutData = {
    labels: donutLabels,
    datasets: [{
      data: donutValues,
      backgroundColor: donutColors,
      borderWidth: 3, borderColor: '#fff', hoverOffset: 4,
    }],
  };
  const donutOptions = {
    responsive: true, maintainAspectRatio: false, cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#fff', borderColor: tk.border, borderWidth: 1,
        titleColor: tk.ink, bodyColor: tk.sec, padding: 10, cornerRadius: 8 },
    },
  };

  /* ── LOADING ── */
  if (loading) return (
    <div style={{ display: 'flex', flex: 1, minHeight: '100vh', background: tk.bg,
      alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{
        width: 44, height: 44, border: `3px solid ${tk.border}`,
        borderTop: `3px solid ${tk.accent}`, borderRadius: '50%',
        animation: 'spin .9s linear infinite',
      }} />
      <p style={{ color: tk.muted, fontSize: 13, margin: 0 }}>Chargement de votre espace…</p>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', flex: 1, minHeight: '100vh', background: tk.bg,
      alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <ExclamationCircleIcon style={{ width: 40, height: 40, color: tk.rose }} />
      <p style={{ color: tk.rose, fontSize: 14, margin: 0 }}>{error}</p>
      <button onClick={() => fetchAll(false)} style={{
        padding: '10px 24px', background: tk.accent, border: 'none',
        borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600,
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
        <ArrowPathIcon style={{ width: 16, height: 16 }} />Réessayer
      </button>
    </div>
  );

  return (
    <div style={{ background: tk.bg, flex: 1, minHeight: '100vh' }}>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
      <div className="page-content" style={{ padding: '28px 32px', maxWidth: 1520, margin: '0 auto' }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: tk.accentSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <SparklesIcon style={{ width: 26, height: 26, color: tk.accent }} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: tk.ink, margin: 0, letterSpacing: '-.02em' }}>
                Bonjour, {prenom} 👋
              </h1>
              <p style={{ fontSize: 13, color: tk.muted, margin: '3px 0 0', textTransform: 'capitalize' }}>
                {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                {' · '}Mon espace client
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* live indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px',
              background: tk.white, border: `1.5px solid ${tk.border}`, borderRadius: 10 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: tk.emerald, animation: 'pulse 2s ease infinite' }} />
              <span style={{ fontSize: 12, color: tk.sec, fontWeight: 500 }}>
                {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {/* Search tracking */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8,
              background: tk.white, border: `1.5px solid ${tk.border}`, borderRadius: 12, padding: '8px 14px' }}>
              <MagnifyingGlassIcon style={{ width: 16, height: 16, color: tk.muted }} />
              <input
                value={trackingInput}
                onChange={e => setTracking(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && navigate(`/app/packages/tracking?number=${encodeURIComponent(trackingInput.trim())}`)}
                placeholder="N° de suivi…"
                style={{ border: 'none', outline: 'none', fontSize: 13, color: tk.ink, width: 170, background: 'none' }}
              />
            </div>
            <button
              onClick={() => {
                const q = trackingInput.trim();
                navigate(q ? `/app/packages/tracking?number=${encodeURIComponent(q)}` : '/app/packages/tracking');
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 20px',
                borderRadius: 10, background: tk.accent, color: '#fff', border: 'none',
                fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <TruckIcon style={{ width: 16, height: 16 }} />Suivre
            </button>
            <button
              onClick={handleRefresh} disabled={refreshing}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 18px',
                borderRadius: 10, background: tk.white, color: tk.accent,
                border: `1.5px solid ${tk.border}`, fontSize: 13, fontWeight: 600,
                cursor: refreshing ? 'not-allowed' : 'pointer', opacity: refreshing ? .7 : 1 }}>
              <ArrowPathIcon style={{ width: 15, height: 15, animation: refreshing ? 'spin .8s linear infinite' : 'none' }} />
              {refreshing ? 'Actualisation…' : 'Actualiser'}
            </button>
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid-kpi-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard title="Total colis" value={fmt(stats.total)} sub="Tous statuts" icon={CubeIcon} color={tk.accent} linkTo="/app/packages" linkLabel="Voir" />
          <StatCard title="En transit" value={fmt(stats.enTransit)} sub="En route" icon={TruckIcon} color={tk.accent} linkTo="/app/packages" linkLabel="Détails" />
          <StatCard title="Livrés" value={fmt(stats.livres)} sub="Réceptionnés" icon={CheckCircleIcon} color={tk.emerald} linkTo="/app/packages" linkLabel="Historique" />
          <StatCard title="En attente" value={fmt(stats.enAttente)} sub="Non traités" icon={ClockIcon} color={tk.amber} linkTo="/app/packages" linkLabel="Voir" />
          <StatCard title="Mes dépenses" value={fmtByCurrency(stats.depenses)} sub="Total payé (par devise)" icon={CurrencyDollarIcon} color={tk.purple} linkTo="/app/payments" linkLabel="Paiements" />
        </div>

        {/* ── CHARTS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 20, marginBottom: 24 }}>

          {/* Line chart */}
          <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(11,17,32,.04)' }}>
            <div style={{ padding: '18px 22px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, margin: 0 }}>Activité colis</h3>
                <p style={{ fontSize: 12, color: tk.muted, margin: '3px 0 0' }}>Volume par mois — 6 derniers mois</p>
              </div>
            </div>
            <div style={{ padding: '0 22px 20px', height: 230 }}>
              {chartData.colisParMois.length > 0
                ? <Line data={lineData} options={lineOptions} />
                : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
                    <InboxIcon style={{ width: 36, height: 36, color: tk.border }} />
                    <span style={{ fontSize: 13, color: tk.muted }}>Aucune donnée disponible</span>
                  </div>
              }
            </div>
          </div>

          {/* Donut */}
          <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(11,17,32,.04)' }}>
            <div style={{ padding: '18px 22px 12px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, margin: 0 }}>Répartition</h3>
              <p style={{ fontSize: 12, color: tk.muted, margin: '3px 0 0' }}>Colis par statut</p>
            </div>
            <div style={{ padding: '0 22px', height: 160 }}>
              <Doughnut data={donutData} options={donutOptions} />
            </div>
            <div style={{ padding: '12px 22px 20px' }}>
              {[
                { label: 'Livrés',    value: stats.livres,    color: tk.emerald },
                { label: 'En transit',value: stats.enTransit, color: tk.accent  },
                { label: 'En attente',value: stats.enAttente, color: tk.amber   },
                { label: 'Annulés',   value: stats.annules,   color: tk.rose    },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${tk.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: r.color }} />
                    <span style={{ fontSize: 13, color: tk.sec }}>{r.label}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: r.color }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── COLIS + SUIVI ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20, marginBottom: 24 }}>

          {/* Liste colis */}
          <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(11,17,32,.04)' }}>
            <SectionHeader
              icon={CubeIcon} title="Mes colis"
              action={
                <Link to="/app/packages" style={{ fontSize: 12, color: tk.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                  Voir tout <ChevronRightIcon style={{ width: 11, height: 11 }} />
                </Link>
              }
            />
            <div style={{ maxHeight: 420, overflowY: 'auto' }}>
              {packages.length > 0 ? packages.map((p, i) => (
                <PkgCard
                  key={p._id || i}
                  pkg={p}
                  onClick={setSelected}
                  active={selected?._id === p._id}
                />
              )) : (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <InboxIcon style={{ width: 40, height: 40, color: tk.border, marginBottom: 10 }} />
                  <p style={{ color: tk.muted, fontSize: 13, margin: 0 }}>Vous n'avez aucun colis</p>
                </div>
              )}
            </div>
          </div>

          {/* Suivi détaillé */}
          <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(11,17,32,.04)' }}>
            <SectionHeader icon={TruckIcon} title="Suivi en temps réel" />
            <div style={{ padding: '18px 22px' }}>
              {selected ? (
                <>
                  {/* Colis info */}
                  <div style={{
                    background: tk.bg, borderRadius: 14, padding: '14px 16px',
                    border: `1px solid ${tk.border}`, marginBottom: 20,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: tk.ink }}>
                        {selected.trackingNumber || '—'}
                      </p>
                      <StatusBadge status={selected.status || 'en attente'} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[
                        { Icon: MapPinIcon,       label: 'Destination', val: selected.destination || '—' },
                        { Icon: ScaleIcon,         label: 'Poids',       val: selected.weight ? `${selected.weight} kg` : '—' },
                        { Icon: CalendarDaysIcon,  label: 'Création',    val: fmtDate(selected.createdAt) },
                        { Icon: CurrencyDollarIcon, label: 'Montant',   val: selected.financial ? amountText(selected.financial.totalMinor,selected.financial.referenceCurrency) : fmtE(selected.price ?? selected.amount ?? selected.totalPrice ?? 0, getCurrency(selected.origin)?.code) },
                      ].map(r => (
                        <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <r.Icon style={{ width: 13, height: 13, color: tk.muted, flexShrink: 0 }} />
                          <div>
                            <p style={{ margin: 0, fontSize: 10, color: tk.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>{r.label}</p>
                            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: tk.ink }}>{r.val}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    {timeline.map((step, i) => (
                      <TimelineStep
                        key={step.key}
                        label={step.label}
                        date={step.date}
                        done={step.done}
                        active={step.active}
                        cancelled={step.cancelled}
                        last={i === timeline.length - 1}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <TruckIcon style={{ width: 40, height: 40, color: tk.border, marginBottom: 10 }} />
                  <p style={{ color: tk.muted, fontSize: 13, margin: 0 }}>Sélectionnez un colis pour voir son suivi</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── PAIEMENTS ── */}
        <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(11,17,32,.04)' }}>
          <SectionHeader
            icon={CreditCardIcon} title="Mes paiements"
            action={
              <Link to="/app/payments" style={{ fontSize: 12, color: tk.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                Voir tout <ChevronRightIcon style={{ width: 11, height: 11 }} />
              </Link>
            }
          />
          <div style={{ padding: '0 20px' }}>
            {payments.length > 0 ? payments.slice(0, 6).map((p, i) => (
              <PayRow
                key={p._id || i}
                ref_={p.reference || p.trackingNumber || `#PAY-${i + 1}`}
                amount={p.amount ?? 0}
                currency={p.currency}
                status={p.status || 'impayé'}
                date={fmtDateTime(p.createdAt)}
              />
            )) : (
              <div style={{ padding: '40px 0', textAlign: 'center' }}>
                <CreditCardIcon style={{ width: 36, height: 36, color: tk.border, marginBottom: 8 }} />
                <p style={{ color: tk.muted, fontSize: 13, margin: 0 }}>Aucun paiement trouvé</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardClient;