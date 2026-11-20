


// // import React, { useState, useEffect, useCallback, useRef } from 'react';
// // import { Link } from 'react-router-dom';
// // import {
// //   CurrencyDollarIcon, CubeIcon, UserGroupIcon, TruckIcon,
// //   BuildingOfficeIcon, CalendarIcon, ChevronRightIcon, SparklesIcon,
// //   ArrowTrendingUpIcon, ArrowTrendingDownIcon, CheckCircleIcon,
// //   ClockIcon, ArrowPathIcon, ExclamationCircleIcon, BanknotesIcon,
// //   ChartBarIcon, GlobeAltIcon, BellAlertIcon, ArrowUpIcon,
// // } from '@heroicons/react/24/outline';
// // import {
// //   Chart as ChartJS,
// //   CategoryScale, LinearScale, PointElement,
// //   LineElement, BarElement, ArcElement,
// //   Title, Tooltip, Legend, Filler,
// // } from 'chart.js';
// // import { Line, Bar, Doughnut } from 'react-chartjs-2';
// // import axios from '../../api/axios';

// // ChartJS.register(
// //   CategoryScale, LinearScale, PointElement, LineElement,
// //   BarElement, ArcElement, Title, Tooltip, Legend, Filler,
// // );

// // /* ─── TOKENS ─────────────────────────────────── */
// // const tk = {
// //   bg:         '#F7FAFE',
// //   white:      '#ffffff',
// //   border:     '#DCE9F5',
// //   ink:        '#172F50',
// //   ink2:       '#172F50',
// //   sec:        '#52677D',
// //   muted:      '#8295A8',
// //   accent:     '#4D91D9',
// //   accentSoft: '#E1EFFB',
// //   emerald:    '#059669',
// //   emeraldSoft:'#d1fae5',
// //   amber:      '#d97706',
// //   amberSoft:  '#fef3c7',
// //   rose:       '#dc2626',
// //   roseSoft:   '#fee2e2',
// //   purple:     '#7c3aed',
// //   purpleSoft: '#ede9fe',
// //   indigo:     '#4338ca',
// //   indigoSoft: '#e0e7ff',
// // };

// // /* ─── HELPERS ─────────────────────────────────── */
// // const fmt  = n => Number(n || 0).toLocaleString('fr-FR');
// // const fmtE = n => `${Number(n || 0).toLocaleString('fr-FR')} €`;

// // /* ─── STATUS BADGE ───────────────────────────── */
// // const StatusBadge = ({ status }) => {
// //   const map = {
// //     'livré':      { bg: tk.emeraldSoft, color: tk.emerald,  label: 'Livré',       Icon: CheckCircleIcon },
// //     'en transit': { bg: tk.accentSoft,  color: tk.accent,   label: 'En transit',  Icon: TruckIcon },
// //     'en attente': { bg: tk.amberSoft,   color: tk.amber,    label: 'En attente',  Icon: ClockIcon },
// //     'payé':       { bg: tk.emeraldSoft, color: tk.emerald,  label: 'Payé',        Icon: CheckCircleIcon },
// //     'impayé':     { bg: tk.amberSoft,   color: tk.amber,    label: 'Impayé',      Icon: ExclamationCircleIcon },
// //     'annulé':     { bg: tk.roseSoft,    color: tk.rose,     label: 'Annulé',      Icon: ExclamationCircleIcon },
// //   };
// //   const s = map[status] || { bg: `${tk.muted}18`, color: tk.muted, label: status, Icon: null };
// //   return (
// //     <span style={{
// //       display: 'inline-flex', alignItems: 'center', gap: 5,
// //       padding: '3px 10px', borderRadius: 99,
// //       background: s.bg, color: s.color,
// //       fontSize: 11, fontWeight: 700, letterSpacing: '.02em',
// //     }}>
// //       {s.Icon && <s.Icon style={{ width: 11, height: 11 }} />}
// //       {s.label}
// //     </span>
// //   );
// // };

// // /* ─── STAT CARD ──────────────────────────────── */
// // const StatCard = ({ title, value, sub, icon: Icon, color, trend, trendVal, loading }) => {
// //   const trendUp = trend === 'up' || (typeof trendVal === 'number' && trendVal > 0);
// //   return (
// //     <div style={{
// //       background: tk.white, borderRadius: 18, padding: '20px 22px',
// //       border: `1.5px solid ${tk.border}`,
// //       boxShadow: '0 1px 4px rgba(23,47,80,.04)',
// //       transition: 'transform .2s, box-shadow .2s',
// //       cursor: 'default',
// //     }}
// //     onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(23,47,80,.09)'; }}
// //     onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = '0 1px 4px rgba(23,47,80,.04)'; }}>
// //       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
// //         <div style={{
// //           width: 44, height: 44, borderRadius: 13,
// //           background: `${color}18`,
// //           display: 'flex', alignItems: 'center', justifyContent: 'center',
// //         }}>
// //           <Icon style={{ width: 22, height: 22, color }} />
// //         </div>
// //         {trendVal !== undefined && (
// //           <span style={{
// //             display: 'inline-flex', alignItems: 'center', gap: 3,
// //             fontSize: 11, fontWeight: 700,
// //             color:   trendUp ? tk.emerald : tk.rose,
// //             background: trendUp ? tk.emeraldSoft : tk.roseSoft,
// //             padding: '3px 9px', borderRadius: 99,
// //           }}>
// //             {trendUp
// //               ? <ArrowTrendingUpIcon   style={{ width: 11, height: 11 }} />
// //               : <ArrowTrendingDownIcon style={{ width: 11, height: 11 }} />
// //             }
// //             {typeof trendVal === 'number' ? `${trendVal > 0 ? '+' : ''}${trendVal}%` : trendVal}
// //           </span>
// //         )}
// //       </div>
// //       {loading ? (
// //         <div style={{ height: 38, background: tk.bg, borderRadius: 8, marginBottom: 6 }} />
// //       ) : (
// //         <div style={{ fontSize: 30, fontWeight: 800, color: tk.ink, letterSpacing: '-.02em', marginBottom: 4 }}>
// //           {value}
// //         </div>
// //       )}
// //       <div style={{ fontSize: 12, fontWeight: 600, color: tk.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>
// //         {title}
// //       </div>
// //       {sub && <div style={{ fontSize: 11, color: tk.muted, marginTop: 3 }}>{sub}</div>}
// //     </div>
// //   );
// // };

// // /* ─── SECTION HEADER ─────────────────────────── */
// // const SectionHeader = ({ icon: Icon, title, color = tk.accent, action }) => (
// //   <div style={{
// //     display: 'flex', alignItems: 'center', justifyContent: 'space-between',
// //     padding: '14px 20px',
// //     background: tk.bg, borderBottom: `1px solid ${tk.border}`,
// //   }}>
// //     <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
// //       <div style={{
// //         width: 30, height: 30, borderRadius: 8, background: tk.white,
// //         display: 'flex', alignItems: 'center', justifyContent: 'center',
// //         boxShadow: '0 1px 4px rgba(0,0,0,.07)',
// //       }}>
// //         <Icon style={{ width: 14, height: 14, color }} />
// //       </div>
// //       <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.muted }}>
// //         {title}
// //       </span>
// //     </div>
// //     {action}
// //   </div>
// // );

// // /* ─── PACKAGE ROW ────────────────────────────── */
// // const PkgRow = ({ tracking, client, destination, status, date, amount }) => (
// //   <div style={{
// //     display: 'grid',
// //     gridTemplateColumns: '2fr 1.5fr 1fr 1.2fr 90px',
// //     alignItems: 'center',
// //     gap: 12, padding: '11px 20px',
// //     borderBottom: `1px solid ${tk.border}`,
// //     transition: 'background .12s',
// //     cursor: 'pointer',
// //   }}
// //   onMouseEnter={e => e.currentTarget.style.background = tk.bg}
// //   onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
// //     <div>
// //       <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tk.ink }}>{tracking}</p>
// //       <p style={{ margin: '2px 0 0', fontSize: 11, color: tk.muted }}>{client}</p>
// //     </div>
// //     <p style={{ margin: 0, fontSize: 12, color: tk.sec }}>{destination || '—'}</p>
// //     <StatusBadge status={status} />
// //     <p style={{ margin: 0, fontSize: 12, color: tk.muted, textAlign: 'right' }}>{date}</p>
// //     <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tk.ink, textAlign: 'right' }}>
// //       {amount ? fmtE(amount) : '—'}
// //     </p>
// //   </div>
// // );

// // /* ─── PAYMENT ROW ────────────────────────────── */
// // const PayRow = ({ ref_, client, amount, status, date }) => (
// //   <div style={{
// //     display: 'grid',
// //     gridTemplateColumns: '2fr 1.5fr 90px 1fr',
// //     alignItems: 'center',
// //     gap: 12, padding: '11px 20px',
// //     borderBottom: `1px solid ${tk.border}`,
// //     transition: 'background .12s',
// //   }}
// //   onMouseEnter={e => e.currentTarget.style.background = tk.bg}
// //   onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
// //     <div>
// //       <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tk.ink }}>{ref_ || '—'}</p>
// //       <p style={{ margin: '2px 0 0', fontSize: 11, color: tk.muted }}>{client}</p>
// //     </div>
// //     <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tk.ink }}>{fmtE(amount)}</p>
// //     <StatusBadge status={status} />
// //     <p style={{ margin: 0, fontSize: 12, color: tk.muted, textAlign: 'right' }}>{date}</p>
// //   </div>
// // );

// // /* ─── TABLE HEADER ───────────────────────────── */
// // const TableHead = ({ cols }) => (
// //   <div style={{
// //     display: 'grid',
// //     gridTemplateColumns: cols.template,
// //     gap: 12, padding: '8px 20px',
// //     background: `${tk.bg}cc`,
// //     borderBottom: `1px solid ${tk.border}`,
// //   }}>
// //     {cols.labels.map((l, i) => (
// //       <span key={i} style={{
// //         fontSize: 10, fontWeight: 700, color: tk.muted,
// //         textTransform: 'uppercase', letterSpacing: '.1em',
// //         textAlign: i === cols.labels.length - 1 ? 'right' : 'left',
// //       }}>{l}</span>
// //     ))}
// //   </div>
// // );

// // /* ─── MINI KPI ───────────────────────────────── */
// // const MiniKpi = ({ label, value, color }) => (
// //   <div style={{
// //     display: 'flex', justifyContent: 'space-between', alignItems: 'center',
// //     padding: '10px 0', borderBottom: `1px solid ${tk.border}`,
// //   }}>
// //     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// //       <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
// //       <span style={{ fontSize: 13, color: tk.sec }}>{label}</span>
// //     </div>
// //     <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}</span>
// //   </div>
// // );

// // /* ─── AGENCY ROW ─────────────────────────────── */
// // const AgencyRow = ({ name, city, packages, revenue, active }) => (
// //   <div style={{
// //     display: 'flex', alignItems: 'center', gap: 12,
// //     padding: '11px 0', borderBottom: `1px solid ${tk.border}`,
// //   }}>
// //     <div style={{
// //       width: 36, height: 36, borderRadius: 10, background: active ? tk.accentSoft : tk.bg,
// //       display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
// //     }}>
// //       <BuildingOfficeIcon style={{ width: 16, height: 16, color: active ? tk.accent : tk.muted }} />
// //     </div>
// //     <div style={{ flex: 1, minWidth: 0 }}>
// //       <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tk.ink,
// //         whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
// //       <p style={{ margin: '1px 0 0', fontSize: 11, color: tk.muted }}>{city}</p>
// //     </div>
// //     <div style={{ textAlign: 'right', flexShrink: 0 }}>
// //       <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tk.ink }}>{packages} colis</p>
// //       <p style={{ margin: '1px 0 0', fontSize: 11, color: tk.muted }}>{fmtE(revenue)}</p>
// //     </div>
// //   </div>
// // );

// // /* ─── MAIN COMPONENT ─────────────────────────── */
// // const Dashboard = () => {
// //   const [stats,    setStats]    = useState(null);
// //   const [charts,   setCharts]   = useState({ revenueByMonth: [], packagesByStatus: [] });
// //   const [packages, setPackages] = useState([]);
// //   const [payments, setPayments] = useState([]);
// //   const [agencies, setAgencies] = useState([]);
// //   const [loading,  setLoading]  = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [error,    setError]    = useState(null);
// //   const [lastRefresh, setLastRefresh] = useState(new Date());
// //   const timerRef = useRef(null);

// //   /* ── fetch ── */
// //   const fetchAll = useCallback(async (silent = false) => {
// //     if (!silent) setLoading(true);
// //     else setRefreshing(true);
// //     setError(null);
// //     try {
// //       const [sRes, cRes, pkgRes, payRes, agRes] = await Promise.allSettled([
// //         axios.get('/dashboard/stats'),
// //         axios.get('/dashboard/charts'),
// //         axios.get('/packages?limit=8&sort=-createdAt'),
// //         axios.get('/payments?limit=6&sort=-createdAt'),
// //         axios.get('/agencies?limit=5&sort=-packagesCount'),
// //       ]);

// //       /* stats */
// //       if (sRes.status === 'fulfilled') {
// //         const s = sRes.value.data?.data ?? sRes.value.data ?? {};
// //         setStats({
// //           revenue:       Number(s.revenue      ?? 0),
// //           revenueTrend:  Number(s.revenueTrend ?? 0),
// //           packages:      Number(s.packages     ?? 0),
// //           packagesTrend: Number(s.packagesTrend ?? 0),
// //           clients:       Number(s.clients      ?? 0),
// //           deliveries:    Number(s.deliveries   ?? 0),
// //           agencies:      Number(s.agencies     ?? 0),
// //           pendingPayments: Number(s.pendingPayments ?? 0),
// //         });
// //       }

// //       /* charts */
// //       if (cRes.status === 'fulfilled') {
// //         const c = cRes.value.data?.data ?? cRes.value.data ?? {};
// //         setCharts({
// //           revenueByMonth:   Array.isArray(c.revenueByMonth)   ? c.revenueByMonth   : [],
// //           packagesByStatus: Array.isArray(c.packagesByStatus) ? c.packagesByStatus : [],
// //         });
// //       }

// //       /* packages */
// //       if (pkgRes.status === 'fulfilled') {
// //         const d = pkgRes.value.data;
// //         const list = d?.data?.packages ?? d?.data?.items ?? d?.packages ?? d?.items
// //           ?? (Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
// //         setPackages(list);
// //       }

// //       /* payments */
// //       if (payRes.status === 'fulfilled') {
// //         const d = payRes.value.data;
// //         const list = d?.data?.payments ?? d?.data?.items ?? d?.payments ?? d?.items
// //           ?? (Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
// //         setPayments(list);
// //       }

// //       /* agencies */
// //       if (agRes.status === 'fulfilled') {
// //         const d = agRes.value.data;
// //         const list = d?.data?.agencies ?? d?.data?.items ?? d?.agencies ?? d?.items
// //           ?? (Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
// //         setAgencies(list);
// //       }

// //       setLastRefresh(new Date());
// //     } catch {
// //       setError('Impossible de charger les données du tableau de bord.');
// //     } finally {
// //       setLoading(false);
// //       setRefreshing(false);
// //     }
// //   }, []);

// //   /* auto-refresh every 60 s */
// //   useEffect(() => {
// //     fetchAll(false);
// //     timerRef.current = setInterval(() => fetchAll(true), 60_000);
// //     return () => clearInterval(timerRef.current);
// //   }, [fetchAll]);

// //   /* ── chart configs ── */
// //   const lineData = {
// //     labels: charts.revenueByMonth.map(i => i.month),
// //     datasets: [
// //       {
// //         label: 'Revenus (€)',
// //         data: charts.revenueByMonth.map(i => i.value ?? 0),
// //         borderColor: tk.accent,
// //         backgroundColor: `${tk.accent}0c`,
// //         tension: .45, fill: true, borderWidth: 2.5,
// //         pointBackgroundColor: tk.accent, pointRadius: 4, pointHoverRadius: 6,
// //       },
// //       {
// //         label: 'Colis',
// //         data: charts.revenueByMonth.map(i => i.count ?? 0),
// //         borderColor: tk.emerald,
// //         backgroundColor: `${tk.emerald}0c`,
// //         tension: .45, fill: true, borderWidth: 2.5,
// //         pointBackgroundColor: tk.emerald, pointRadius: 4, pointHoverRadius: 6,
// //         yAxisID: 'y2',
// //       },
// //     ],
// //   };
// //   const lineOptions = {
// //     responsive: true, maintainAspectRatio: false,
// //     interaction: { mode: 'index', intersect: false },
// //     plugins: {
// //       legend: { display: true, position: 'top',
// //         labels: { color: tk.sec, font: { size: 11 }, boxWidth: 10, padding: 16, usePointStyle: true } },
// //       tooltip: {
// //         backgroundColor: '#fff', borderColor: tk.border, borderWidth: 1,
// //         titleColor: tk.ink, bodyColor: tk.sec, padding: 12, cornerRadius: 10,
// //         callbacks: { label: ctx => ctx.dataset.yAxisID === 'y2'
// //           ? `${ctx.dataset.label}: ${ctx.parsed.y} colis`
// //           : `${ctx.dataset.label}: ${fmt(ctx.parsed.y)} €` },
// //       },
// //     },
// //     scales: {
// //       y:  { beginAtZero: true, grid: { color: tk.border }, ticks: { color: tk.muted, font: { size: 11 }, callback: v => `${fmt(v)} €` } },
// //       y2: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { color: tk.muted, font: { size: 11 } } },
// //       x:  { grid: { display: false }, ticks: { color: tk.muted, font: { size: 11 } } },
// //     },
// //   };

// //   const donutData = {
// //     labels: charts.packagesByStatus.length ? charts.packagesByStatus.map(i => i.status) : ['Livré', 'En transit', 'En attente'],
// //     datasets: [{
// //       data: charts.packagesByStatus.length
// //         ? charts.packagesByStatus.map(i => i.count)
// //         : [0, 0, 0],
// //       backgroundColor: [tk.emerald, tk.accent, tk.amber, tk.rose, tk.purple],
// //       borderWidth: 3, borderColor: '#fff', hoverOffset: 4,
// //     }],
// //   };
// //   const donutOptions = {
// //     responsive: true, maintainAspectRatio: false, cutout: '68%',
// //     plugins: {
// //       legend: { display: false },
// //       tooltip: {
// //         backgroundColor: '#fff', borderColor: tk.border, borderWidth: 1,
// //         titleColor: tk.ink, bodyColor: tk.sec, padding: 12, cornerRadius: 10,
// //       },
// //     },
// //   };

// //   /* barChart for package trend */
// //   const barData = {
// //     labels: charts.revenueByMonth.map(i => i.month),
// //     datasets: [{
// //       label: 'Colis créés',
// //       data: charts.revenueByMonth.map(i => i.count ?? 0),
// //       backgroundColor: `${tk.accent}22`,
// //       borderColor: tk.accent,
// //       borderWidth: 1.5,
// //       borderRadius: 6,
// //     }],
// //   };
// //   const barOptions = {
// //     responsive: true, maintainAspectRatio: false,
// //     plugins: {
// //       legend: { display: false },
// //       tooltip: { backgroundColor: '#fff', borderColor: tk.border, borderWidth: 1, titleColor: tk.ink, bodyColor: tk.sec, padding: 10, cornerRadius: 8 },
// //     },
// //     scales: {
// //       y: { beginAtZero: true, grid: { color: tk.border }, ticks: { color: tk.muted, font: { size: 11 } } },
// //       x: { grid: { display: false }, ticks: { color: tk.muted, font: { size: 11 } } },
// //     },
// //   };

// //   const now = new Date();
// //   const donutColors = [tk.emerald, tk.accent, tk.amber, tk.rose, tk.purple];

// //   /* ── LOADING ── */
// //   if (loading) return (
// //     <div style={{ display: 'flex', flex: 1, minHeight: '100vh', background: tk.bg,
// //       alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
// //       <div style={{
// //         width: 44, height: 44, border: `3px solid ${tk.border}`,
// //         borderTop: `3px solid ${tk.accent}`, borderRadius: '50%',
// //         animation: 'spin .9s linear infinite',
// //       }} />
// //       <p style={{ color: tk.muted, fontSize: 13, margin: 0 }}>Chargement du tableau de bord…</p>
// //       <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
// //     </div>
// //   );

// //   if (error) return (
// //     <div style={{ display: 'flex', flex: 1, minHeight: '100vh', background: tk.bg,
// //       alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
// //       <ExclamationCircleIcon style={{ width: 40, height: 40, color: tk.rose }} />
// //       <p style={{ color: tk.rose, fontSize: 14, margin: 0 }}>{error}</p>
// //       <button onClick={() => fetchAll(false)} style={{
// //         padding: '10px 24px', background: tk.accent, border: 'none',
// //         borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600,
// //         cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
// //       }}>
// //         <ArrowPathIcon style={{ width: 16, height: 16 }} />Réessayer
// //       </button>
// //     </div>
// //   );

// //   const statusDonut = charts.packagesByStatus.length
// //     ? charts.packagesByStatus
// //     : [{ status: 'Livré', count: 0 }, { status: 'En transit', count: 0 }, { status: 'En attente', count: 0 }];

// //   return (
// //     <div style={{ background: tk.bg, flex: 1, minHeight: '100vh' }}>
// //       <style>{`@keyframes spin { to { transform:rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
// //       <div style={{ padding: '28px 32px', maxWidth: 1520, margin: '0 auto' }}>

// //         {/* ── HEADER ── */}
// //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
// //             <div style={{
// //               width: 48, height: 48, borderRadius: 14,
// //               background: tk.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
// //             }}>
// //               <ChartBarIcon style={{ width: 24, height: 24, color: tk.accent }} />
// //             </div>
// //             <div>
// //               <h1 style={{ fontSize: 22, fontWeight: 800, color: tk.ink, margin: 0, letterSpacing: '-.02em' }}>
// //                 Tableau de bord
// //               </h1>
// //               <p style={{ fontSize: 13, color: tk.muted, margin: '3px 0 0', textTransform: 'capitalize' }}>
// //                 {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
// //               </p>
// //             </div>
// //           </div>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
// //             {/* Live indicator */}
// //             <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px',
// //               background: tk.white, border: `1.5px solid ${tk.border}`, borderRadius: 10 }}>
// //               <span style={{
// //                 width: 8, height: 8, borderRadius: '50%', background: tk.emerald,
// //                 animation: 'pulse 2s ease infinite',
// //               }} />
// //               <span style={{ fontSize: 12, color: tk.sec, fontWeight: 500 }}>
// //                 Mis à jour {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
// //               </span>
// //             </div>
// //             <button
// //               onClick={() => fetchAll(true)}
// //               disabled={refreshing}
// //               style={{
// //                 display: 'inline-flex', alignItems: 'center', gap: 8,
// //                 padding: '9px 18px', borderRadius: 10,
// //                 background: tk.accent, color: '#fff', border: 'none',
// //                 fontSize: 13, fontWeight: 600, cursor: refreshing ? 'not-allowed' : 'pointer',
// //                 opacity: refreshing ? .7 : 1, transition: 'opacity .15s',
// //               }}>
// //               <ArrowPathIcon style={{
// //                 width: 15, height: 15,
// //                 animation: refreshing ? 'spin .8s linear infinite' : 'none',
// //               }} />
// //               {refreshing ? 'Actualisation…' : 'Actualiser'}
// //             </button>
// //           </div>
// //         </div>

// //         {/* ── KPI GRID ── */}
// //         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 24 }}>
// //           <StatCard
// //             title="Revenus totaux" value={fmtE(stats?.revenue)}
// //             sub="Paiements confirmés"
// //             icon={BanknotesIcon} color={tk.emerald}
// //             trendVal={stats?.revenueTrend}
// //           />
// //           <StatCard
// //             title="Colis actifs" value={fmt(stats?.packages)}
// //             sub="En attente + Transit"
// //             icon={CubeIcon} color={tk.accent}
// //             trendVal={stats?.packagesTrend}
// //           />
// //           <StatCard
// //             title="Clients actifs" value={fmt(stats?.clients)}
// //             sub="Comptes vérifiés"
// //             icon={UserGroupIcon} color={tk.purple}
// //           />
// //           <StatCard
// //             title="Livraisons totales" value={fmt(stats?.deliveries)}
// //             sub="Statut : livré"
// //             icon={TruckIcon} color={tk.amber}
// //           />
// //         </div>

// //         {/* ── KPI ROW 2 ── */}
// //         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 28 }}>
// //           <StatCard
// //             title="Agences" value={fmt(stats?.agencies)}
// //             sub="Réseau actif"
// //             icon={BuildingOfficeIcon} color={tk.indigo}
// //           />
// //           <StatCard
// //             title="Impayés" value={fmtE(stats?.pendingPayments)}
// //             sub="En attente règlement"
// //             icon={ExclamationCircleIcon} color={tk.rose}
// //           />
// //           <StatCard
// //             title="Taux livraison"
// //             value={stats && stats.deliveries + stats.packages > 0
// //               ? `${Math.round((stats.deliveries / (stats.deliveries + stats.packages)) * 100)} %`
// //               : '—'}
// //             sub="Livré / total colis"
// //             icon={CheckCircleIcon} color={tk.emerald}
// //           />
// //           <StatCard
// //             title="Rev. moyen/colis"
// //             value={stats && stats.deliveries > 0
// //               ? fmtE(Math.round(stats.revenue / stats.deliveries))
// //               : '—'}
// //             sub="Par livraison"
// //             icon={CurrencyDollarIcon} color={tk.accent}
// //           />
// //         </div>

// //         {/* ── CHARTS ROW ── */}
// //         <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 20, marginBottom: 24 }}>

// //           {/* Line chart */}
// //           <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)' }}>
// //             <div style={{ padding: '18px 22px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
// //               <div>
// //                 <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, margin: 0 }}>Évolution mensuelle</h3>
// //                 <p style={{ fontSize: 12, color: tk.muted, margin: '3px 0 0' }}>Revenus & volume colis — 6 derniers mois</p>
// //               </div>
// //               <Link to="/app/reports" style={{ fontSize: 12, color: tk.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
// //                 Rapport <ChevronRightIcon style={{ width: 11, height: 11 }} />
// //               </Link>
// //             </div>
// //             <div style={{ padding: '0 22px 20px', height: 270 }}>
// //               {charts.revenueByMonth.length > 0
// //                 ? <Line data={lineData} options={lineOptions} />
// //                 : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: tk.muted, fontSize: 13 }}>Aucune donnée disponible</div>
// //               }
// //             </div>
// //           </div>

// //           {/* Donut */}
// //           <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)' }}>
// //             <div style={{ padding: '18px 22px 12px' }}>
// //               <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, margin: 0 }}>Répartition des colis</h3>
// //               <p style={{ fontSize: 12, color: tk.muted, margin: '3px 0 0' }}>Par statut — tous temps</p>
// //             </div>
// //             <div style={{ padding: '0 22px', height: 170 }}>
// //               <Doughnut data={donutData} options={donutOptions} />
// //             </div>
// //             <div style={{ padding: '12px 22px 20px' }}>
// //               {statusDonut.map((s, i) => (
// //                 <MiniKpi
// //                   key={s.status}
// //                   label={s.status}
// //                   value={fmt(s.count)}
// //                   color={donutColors[i] || tk.muted}
// //                 />
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //         {/* ── CHART + AGENCIES ── */}
// //         <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 24 }}>

// //           {/* Bar chart */}
// //           <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)' }}>
// //             <div style={{ padding: '18px 22px 12px' }}>
// //               <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, margin: 0 }}>Volume de colis mensuel</h3>
// //               <p style={{ fontSize: 12, color: tk.muted, margin: '3px 0 0' }}>Colis créés par mois</p>
// //             </div>
// //             <div style={{ padding: '0 22px 20px', height: 220 }}>
// //               {charts.revenueByMonth.length > 0
// //                 ? <Bar data={barData} options={barOptions} />
// //                 : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: tk.muted, fontSize: 13 }}>Aucune donnée</div>
// //               }
// //             </div>
// //           </div>

// //           {/* Top agences */}
// //           <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)' }}>
// //             <SectionHeader
// //               icon={BuildingOfficeIcon} title="Top agences"
// //               action={
// //                 <Link to="/app/agencies" style={{ fontSize: 12, color: tk.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
// //                   Voir tout <ChevronRightIcon style={{ width: 11, height: 11 }} />
// //                 </Link>
// //               }
// //             />
// //             <div style={{ padding: '6px 20px' }}>
// //               {agencies.length > 0 ? agencies.map((a, i) => (
// //                 <AgencyRow
// //                   key={a._id || i}
// //                   name={a.name || `Agence ${i + 1}`}
// //                   city={a.city || a.location || '—'}
// //                   packages={fmt(a.packagesCount ?? a.packages ?? 0)}
// //                   revenue={a.revenue ?? 0}
// //                   active={a.isActive !== false}
// //                 />
// //               )) : (
// //                 [{ name: 'Agence Tunis Centre', city: 'Tunis', packages: '—', revenue: 0, active: true },
// //                  { name: 'Agence Sfax', city: 'Sfax', packages: '—', revenue: 0, active: true },
// //                  { name: 'Agence Sousse', city: 'Sousse', packages: '—', revenue: 0, active: false }]
// //                  .map((a, i) => <AgencyRow key={i} {...a} />)
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* ── PACKAGES TABLE ── */}
// //         <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)', marginBottom: 24 }}>
// //           <SectionHeader
// //             icon={CubeIcon} title="Derniers colis"
// //             action={
// //               <Link to="/app/packages" style={{ fontSize: 12, color: tk.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
// //                 Voir tout <ChevronRightIcon style={{ width: 11, height: 11 }} />
// //               </Link>
// //             }
// //           />
// //           <TableHead cols={{
// //             template: '2fr 1.5fr 1fr 1.2fr 90px',
// //             labels: ['Tracking / Client', 'Destination', 'Statut', 'Date', 'Montant'],
// //           }} />
// //           {packages.length > 0 ? packages.slice(0, 8).map((p, i) => (
// //             <PkgRow
// //               key={p._id || i}
// //               tracking={p.trackingNumber || `#PKG-${i + 1}`}
// //               client={p.client ? `${p.client.firstName || ''} ${p.client.lastName || ''}`.trim() || '—' : '—'}
// //               destination={p.destination || p.agency?.city || '—'}
// //               status={p.status || 'en attente'}
// //               date={p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : '—'}
// //               amount={p.price ?? p.amount ?? null}
// //             />
// //           )) : (
// //             <div style={{ padding: 40, textAlign: 'center', color: tk.muted, fontSize: 13 }}>
// //               Aucun colis trouvé
// //             </div>
// //           )}
// //         </div>

// //         {/* ── PAYMENTS TABLE ── */}
// //         <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)' }}>
// //           <SectionHeader
// //             icon={BanknotesIcon} title="Derniers paiements"
// //             action={
// //               <Link to="/app/payments" style={{ fontSize: 12, color: tk.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
// //                 Voir tout <ChevronRightIcon style={{ width: 11, height: 11 }} />
// //               </Link>
// //             }
// //           />
// //           <TableHead cols={{
// //             template: '2fr 1.5fr 90px 1fr',
// //             labels: ['Référence / Client', 'Montant', 'Statut', 'Date'],
// //           }} />
// //           {payments.length > 0 ? payments.slice(0, 6).map((p, i) => (
// //             <PayRow
// //               key={p._id || i}
// //               ref_={p.reference || p.trackingNumber || `#PAY-${i + 1}`}
// //               client={p.client ? `${p.client.firstName || ''} ${p.client.lastName || ''}`.trim() || '—' : '—'}
// //               amount={p.amount ?? 0}
// //               status={p.status || 'en attente de paiement'}
// //               date={p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : '—'}
// //             />
// //           )) : (
// //             <div style={{ padding: 40, textAlign: 'center', color: tk.muted, fontSize: 13 }}>
// //               Aucun paiement trouvé
// //             </div>
// //           )}
// //         </div>

// //       </div>
// //     </div>
// //   );
// // };

// // export default Dashboard;







// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import {
//   CurrencyDollarIcon, CubeIcon, UserGroupIcon, TruckIcon,
//   BuildingOfficeIcon, CalendarIcon, ChevronRightIcon, SparklesIcon,
//   ArrowTrendingUpIcon, ArrowTrendingDownIcon, CheckCircleIcon,
//   ClockIcon, ArrowPathIcon, ExclamationCircleIcon, BanknotesIcon,
//   ChartBarIcon, GlobeAltIcon, BellAlertIcon, ArrowUpIcon,
// } from '@heroicons/react/24/outline';
// import {
//   Chart as ChartJS,
//   CategoryScale, LinearScale, PointElement,
//   LineElement, BarElement, ArcElement,
//   Title, Tooltip, Legend, Filler,
// } from 'chart.js';
// import { Line, Bar, Doughnut } from 'react-chartjs-2';
// import axios from '../../api/axios';

// ChartJS.register(
//   CategoryScale, LinearScale, PointElement, LineElement,
//   BarElement, ArcElement, Title, Tooltip, Legend, Filler,
// );

// /* ─── TOKENS ─────────────────────────────────── */
// const tk = {
//   bg:         '#F7FAFE',
//   white:      '#ffffff',
//   border:     '#DCE9F5',
//   ink:        '#172F50',
//   ink2:       '#172F50',
//   sec:        '#52677D',
//   muted:      '#8295A8',
//   accent:     '#4D91D9',
//   accentSoft: '#E1EFFB',
//   emerald:    '#059669',
//   emeraldSoft:'#d1fae5',
//   amber:      '#d97706',
//   amberSoft:  '#fef3c7',
//   rose:       '#dc2626',
//   roseSoft:   '#fee2e2',
//   purple:     '#7c3aed',
//   purpleSoft: '#ede9fe',
//   indigo:     '#4338ca',
//   indigoSoft: '#e0e7ff',
// };

// /* ─── HELPER UNIVERSEL ───────────────────────────────────────────────────────
//    Extrait un tableau depuis n'importe quel format de réponse API courant :
//    - { data: { packages: [...] } }
//    - { data: { items: [...] } }
//    - { data: [...] }
//    - { packages: [...] }
//    - [...]
//    - { success, count, data: [...] }
// */
// const extractArray = (response, ...keys) => {
//   const raw = response?.data;                  // axios enveloppe dans .data
//   if (!raw) return [];

//   // Chercher dans raw.data.key, raw.key, raw.data, raw directement
//   const candidates = [raw?.data, raw];
//   for (const obj of candidates) {
//     if (Array.isArray(obj)) return obj;
//     if (obj && typeof obj === 'object') {
//       for (const k of keys) {
//         if (Array.isArray(obj[k])) return obj[k];
//       }
//     }
//   }
//   return [];
// };

// /* Extraire un objet stats */
// const extractStats = (response) => {
//   const raw = response?.data;
//   return raw?.data ?? raw ?? {};
// };

// const fmt  = n => Number(n || 0).toLocaleString('fr-FR');
// const fmtE = n => `${Number(n || 0).toLocaleString('fr-FR')} €`;

// /* ─── STATUS BADGE ───────────────────────────── */
// const StatusBadge = ({ status }) => {
//   const map = {
//     'livré':      { bg: tk.emeraldSoft, color: tk.emerald,  label: 'Livré',       Icon: CheckCircleIcon },
//     'en transit': { bg: tk.accentSoft,  color: tk.accent,   label: 'En transit',  Icon: TruckIcon },
//     'en attente': { bg: tk.amberSoft,   color: tk.amber,    label: 'En attente',  Icon: ClockIcon },
//     'payé':       { bg: tk.emeraldSoft, color: tk.emerald,  label: 'Payé',        Icon: CheckCircleIcon },
//     'impayé':     { bg: tk.amberSoft,   color: tk.amber,    label: 'Impayé',      Icon: ExclamationCircleIcon },
//     'annulé':     { bg: tk.roseSoft,    color: tk.rose,     label: 'Annulé',      Icon: ExclamationCircleIcon },
//   };
//   const s = map[(status || '').toLowerCase()] || { bg: `${tk.muted}18`, color: tk.muted, label: status || '—', Icon: null };
//   return (
//     <span style={{
//       display: 'inline-flex', alignItems: 'center', gap: 5,
//       padding: '3px 10px', borderRadius: 99,
//       background: s.bg, color: s.color,
//       fontSize: 11, fontWeight: 700, letterSpacing: '.02em',
//     }}>
//       {s.Icon && <s.Icon style={{ width: 11, height: 11 }} />}
//       {s.label}
//     </span>
//   );
// };

// /* ─── STAT CARD ──────────────────────────────── */
// const StatCard = ({ title, value, sub, icon: Icon, color, trendVal, loading }) => {
//   const trendUp = typeof trendVal === 'number' ? trendVal >= 0 : true;
//   return (
//     <div style={{
//       background: tk.white, borderRadius: 18, padding: '20px 22px',
//       border: `1.5px solid ${tk.border}`,
//       boxShadow: '0 1px 4px rgba(23,47,80,.04)',
//       transition: 'transform .2s, box-shadow .2s', cursor: 'default',
//     }}
//     onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(23,47,80,.09)'; }}
//     onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = '0 1px 4px rgba(23,47,80,.04)'; }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
//         <div style={{
//           width: 44, height: 44, borderRadius: 13, background: `${color}18`,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//         }}>
//           <Icon style={{ width: 22, height: 22, color }} />
//         </div>
//         {trendVal !== undefined && trendVal !== null && (
//           <span style={{
//             display: 'inline-flex', alignItems: 'center', gap: 3,
//             fontSize: 11, fontWeight: 700,
//             color:   trendUp ? tk.emerald : tk.rose,
//             background: trendUp ? tk.emeraldSoft : tk.roseSoft,
//             padding: '3px 9px', borderRadius: 99,
//           }}>
//             {trendUp
//               ? <ArrowTrendingUpIcon   style={{ width: 11, height: 11 }} />
//               : <ArrowTrendingDownIcon style={{ width: 11, height: 11 }} />
//             }
//             {typeof trendVal === 'number' ? `${trendVal > 0 ? '+' : ''}${trendVal}%` : trendVal}
//           </span>
//         )}
//       </div>
//       {loading ? (
//         <div style={{ height: 38, background: tk.bg, borderRadius: 8, marginBottom: 6, animation: 'pulse 1.5s ease infinite' }} />
//       ) : (
//         <div style={{ fontSize: 30, fontWeight: 800, color: tk.ink, letterSpacing: '-.02em', marginBottom: 4 }}>
//           {value ?? '—'}
//         </div>
//       )}
//       <div style={{ fontSize: 12, fontWeight: 600, color: tk.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>
//         {title}
//       </div>
//       {sub && <div style={{ fontSize: 11, color: tk.muted, marginTop: 3 }}>{sub}</div>}
//     </div>
//   );
// };

// /* ─── SECTION HEADER ─────────────────────────── */
// const SectionHeader = ({ icon: Icon, title, color = tk.accent, action }) => (
//   <div style={{
//     display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//     padding: '14px 20px', background: tk.bg, borderBottom: `1px solid ${tk.border}`,
//   }}>
//     <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//       <div style={{
//         width: 30, height: 30, borderRadius: 8, background: tk.white,
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         boxShadow: '0 1px 4px rgba(0,0,0,.07)',
//       }}>
//         <Icon style={{ width: 14, height: 14, color }} />
//       </div>
//       <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.muted }}>
//         {title}
//       </span>
//     </div>
//     {action}
//   </div>
// );

// /* ─── PACKAGE ROW ────────────────────────────── */
// const PkgRow = ({ tracking, client, destination, status, date, amount }) => (
//   <div style={{
//     display: 'grid',
//     gridTemplateColumns: '2fr 1.5fr 1fr 1.2fr 90px',
//     alignItems: 'center',
//     gap: 12, padding: '11px 20px',
//     borderBottom: `1px solid ${tk.border}`,
//     transition: 'background .12s', cursor: 'pointer',
//   }}
//   onMouseEnter={e => e.currentTarget.style.background = tk.bg}
//   onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
//     <div>
//       <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tk.ink }}>{tracking}</p>
//       <p style={{ margin: '2px 0 0', fontSize: 11, color: tk.muted }}>{client}</p>
//     </div>
//     <p style={{ margin: 0, fontSize: 12, color: tk.sec }}>{destination || '—'}</p>
//     <StatusBadge status={status} />
//     <p style={{ margin: 0, fontSize: 12, color: tk.muted, textAlign: 'right' }}>{date}</p>
//     <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tk.ink, textAlign: 'right' }}>
//       {amount ? fmtE(amount) : '—'}
//     </p>
//   </div>
// );

// /* ─── PAYMENT ROW ────────────────────────────── */
// const PayRow = ({ ref_, client, amount, status, date }) => (
//   <div style={{
//     display: 'grid',
//     gridTemplateColumns: '2fr 1.5fr 90px 1fr',
//     alignItems: 'center',
//     gap: 12, padding: '11px 20px',
//     borderBottom: `1px solid ${tk.border}`,
//     transition: 'background .12s',
//   }}
//   onMouseEnter={e => e.currentTarget.style.background = tk.bg}
//   onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
//     <div>
//       <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tk.ink }}>{ref_ || '—'}</p>
//       <p style={{ margin: '2px 0 0', fontSize: 11, color: tk.muted }}>{client}</p>
//     </div>
//     <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tk.ink }}>{fmtE(amount)}</p>
//     <StatusBadge status={status} />
//     <p style={{ margin: 0, fontSize: 12, color: tk.muted, textAlign: 'right' }}>{date}</p>
//   </div>
// );

// /* ─── TABLE HEADER ───────────────────────────── */
// const TableHead = ({ cols }) => (
//   <div style={{
//     display: 'grid',
//     gridTemplateColumns: cols.template,
//     gap: 12, padding: '8px 20px',
//     background: `${tk.bg}cc`, borderBottom: `1px solid ${tk.border}`,
//   }}>
//     {cols.labels.map((l, i) => (
//       <span key={i} style={{
//         fontSize: 10, fontWeight: 700, color: tk.muted,
//         textTransform: 'uppercase', letterSpacing: '.1em',
//         textAlign: i === cols.labels.length - 1 ? 'right' : 'left',
//       }}>{l}</span>
//     ))}
//   </div>
// );

// /* ─── MINI KPI ───────────────────────────────── */
// const MiniKpi = ({ label, value, color }) => (
//   <div style={{
//     display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//     padding: '10px 0', borderBottom: `1px solid ${tk.border}`,
//   }}>
//     <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//       <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
//       <span style={{ fontSize: 13, color: tk.sec }}>{label}</span>
//     </div>
//     <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}</span>
//   </div>
// );

// /* ─── AGENCY ROW ─────────────────────────────── */
// const AgencyRow = ({ name, city, packages, revenue, active }) => (
//   <div style={{
//     display: 'flex', alignItems: 'center', gap: 12,
//     padding: '11px 0', borderBottom: `1px solid ${tk.border}`,
//   }}>
//     <div style={{
//       width: 36, height: 36, borderRadius: 10, background: active ? tk.accentSoft : tk.bg,
//       display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
//     }}>
//       <BuildingOfficeIcon style={{ width: 16, height: 16, color: active ? tk.accent : tk.muted }} />
//     </div>
//     <div style={{ flex: 1, minWidth: 0 }}>
//       <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tk.ink,
//         whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
//       <p style={{ margin: '1px 0 0', fontSize: 11, color: tk.muted }}>{city}</p>
//     </div>
//     <div style={{ textAlign: 'right', flexShrink: 0 }}>
//       <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tk.ink }}>{packages} colis</p>
//       <p style={{ margin: '1px 0 0', fontSize: 11, color: tk.muted }}>{fmtE(revenue)}</p>
//     </div>
//   </div>
// );

// /* ─── MAIN COMPONENT ─────────────────────────── */
// const Dashboard = () => {
//   const [stats,      setStats]      = useState(null);
//   const [charts,     setCharts]     = useState({ revenueByMonth: [], packagesByStatus: [] });
//   const [packages,   setPackages]   = useState([]);
//   const [payments,   setPayments]   = useState([]);
//   const [agencies,   setAgencies]   = useState([]);
//   const [loading,    setLoading]    = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error,      setError]      = useState(null);
//   const [lastRefresh,setLastRefresh]= useState(new Date());
//   const timerRef = useRef(null);

//   const fetchAll = useCallback(async (silent = false) => {
//     if (!silent) setLoading(true);
//     else setRefreshing(true);
//     setError(null);

//     try {
//       const [sRes, cRes, pkgRes, payRes, agRes] = await Promise.allSettled([
//         axios.get('/dashboard/stats'),
//         axios.get('/dashboard/charts'),
//         axios.get('/packages?limit=8&sort=-createdAt'),
//         axios.get('/payments?limit=6&sort=-createdAt'),
//         axios.get('/agencies?limit=5&sort=-packagesCount'),
//       ]);

//       /* ── Stats : plusieurs formats possibles ── */
//       if (sRes.status === 'fulfilled') {
//         const raw = extractStats(sRes.value);
//         setStats({
//           revenue:         Number(raw.revenue         ?? raw.totalRevenue    ?? 0),
//           revenueTrend:    Number(raw.revenueTrend    ?? 0),
//           packages:        Number(raw.packages        ?? raw.totalPackages   ?? raw.packagesCount ?? 0),
//           packagesTrend:   Number(raw.packagesTrend   ?? 0),
//           clients:         Number(raw.clients         ?? raw.totalClients    ?? raw.clientsCount  ?? 0),
//           deliveries:      Number(raw.deliveries      ?? raw.delivered       ?? raw.deliveriesCount ?? 0),
//           agencies:        Number(raw.agencies        ?? raw.totalAgencies   ?? raw.agenciesCount ?? 0),
//           pendingPayments: Number(raw.pendingPayments ?? raw.pendingRevenue  ?? 0),
//         });
//       }

//       /* ── Charts ── */
//       if (cRes.status === 'fulfilled') {
//         const raw = extractStats(cRes.value);
//         setCharts({
//           revenueByMonth:   Array.isArray(raw.revenueByMonth)   ? raw.revenueByMonth   : [],
//           packagesByStatus: Array.isArray(raw.packagesByStatus) ? raw.packagesByStatus : [],
//         });
//       }

//       /* ── Packages : essayer toutes les clés possibles ── */
//       if (pkgRes.status === 'fulfilled') {
//         const list = extractArray(pkgRes.value, 'packages', 'items', 'colis', 'docs');
//         setPackages(list);
//       }

//       /* ── Payments : idem ── */
//       if (payRes.status === 'fulfilled') {
//         const list = extractArray(payRes.value, 'payments', 'paiements', 'items', 'docs');
//         setPayments(list);
//       }

//       /* ── Agencies ── */
//       if (agRes.status === 'fulfilled') {
//         const list = extractArray(agRes.value, 'agencies', 'agences', 'items', 'docs');
//         setAgencies(list);
//       }

//       setLastRefresh(new Date());
//     } catch {
//       setError('Impossible de charger les données du tableau de bord.');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchAll(false);
//     timerRef.current = setInterval(() => fetchAll(true), 60_000);
//     return () => clearInterval(timerRef.current);
//   }, [fetchAll]);

//   /* ── Chart configs ── */
//   const lineData = {
//     labels: charts.revenueByMonth.map(i => i.month),
//     datasets: [
//       {
//         label: 'Revenus (€)',
//         data: charts.revenueByMonth.map(i => i.value ?? i.revenue ?? 0),
//         borderColor: tk.accent, backgroundColor: `${tk.accent}0c`,
//         tension: .45, fill: true, borderWidth: 2.5,
//         pointBackgroundColor: tk.accent, pointRadius: 4, pointHoverRadius: 6,
//       },
//       {
//         label: 'Colis',
//         data: charts.revenueByMonth.map(i => i.count ?? i.packages ?? 0),
//         borderColor: tk.emerald, backgroundColor: `${tk.emerald}0c`,
//         tension: .45, fill: true, borderWidth: 2.5,
//         pointBackgroundColor: tk.emerald, pointRadius: 4, pointHoverRadius: 6,
//         yAxisID: 'y2',
//       },
//     ],
//   };
//   const lineOptions = {
//     responsive: true, maintainAspectRatio: false,
//     interaction: { mode: 'index', intersect: false },
//     plugins: {
//       legend: { display: true, position: 'top',
//         labels: { color: tk.sec, font: { size: 11 }, boxWidth: 10, padding: 16, usePointStyle: true } },
//       tooltip: {
//         backgroundColor: '#fff', borderColor: tk.border, borderWidth: 1,
//         titleColor: tk.ink, bodyColor: tk.sec, padding: 12, cornerRadius: 10,
//       },
//     },
//     scales: {
//       y:  { beginAtZero: true, grid: { color: tk.border }, ticks: { color: tk.muted, font: { size: 11 }, callback: v => `${fmt(v)} €` } },
//       y2: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { color: tk.muted, font: { size: 11 } } },
//       x:  { grid: { display: false }, ticks: { color: tk.muted, font: { size: 11 } } },
//     },
//   };

//   const statusColors = [tk.emerald, tk.accent, tk.amber, tk.rose, tk.purple];
//   const donutData = {
//     labels: charts.packagesByStatus.length
//       ? charts.packagesByStatus.map(i => i.status ?? i._id ?? i.label ?? '—')
//       : ['Livré', 'En transit', 'En attente'],
//     datasets: [{
//       data: charts.packagesByStatus.length
//         ? charts.packagesByStatus.map(i => i.count ?? i.value ?? 0)
//         : [0, 0, 0],
//       backgroundColor: statusColors,
//       borderWidth: 3, borderColor: '#fff', hoverOffset: 4,
//     }],
//   };
//   const donutOptions = {
//     responsive: true, maintainAspectRatio: false, cutout: '68%',
//     plugins: {
//       legend: { display: false },
//       tooltip: { backgroundColor: '#fff', borderColor: tk.border, borderWidth: 1, titleColor: tk.ink, bodyColor: tk.sec, padding: 12, cornerRadius: 10 },
//     },
//   };

//   const barData = {
//     labels: charts.revenueByMonth.map(i => i.month),
//     datasets: [{
//       label: 'Colis créés',
//       data: charts.revenueByMonth.map(i => i.count ?? i.packages ?? 0),
//       backgroundColor: `${tk.accent}22`, borderColor: tk.accent,
//       borderWidth: 1.5, borderRadius: 6,
//     }],
//   };
//   const barOptions = {
//     responsive: true, maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//       tooltip: { backgroundColor: '#fff', borderColor: tk.border, borderWidth: 1, titleColor: tk.ink, bodyColor: tk.sec, padding: 10, cornerRadius: 8 },
//     },
//     scales: {
//       y: { beginAtZero: true, grid: { color: tk.border }, ticks: { color: tk.muted, font: { size: 11 } } },
//       x: { grid: { display: false }, ticks: { color: tk.muted, font: { size: 11 } } },
//     },
//   };

//   const now = new Date();
//   const statusDonut = charts.packagesByStatus.length
//     ? charts.packagesByStatus.map(i => ({ status: i.status ?? i._id ?? i.label ?? '—', count: i.count ?? i.value ?? 0 }))
//     : [{ status: 'Livré', count: 0 }, { status: 'En transit', count: 0 }, { status: 'En attente', count: 0 }];

//   /* ── Helper : extraire infos client depuis un colis ── */
//   const getClientName = (p) => {
//     const c = p.client ?? p.sender ?? p.expediteur;
//     if (!c) return '—';
//     if (typeof c === 'string') return c;
//     const fn = c.firstName ?? c.prenom ?? c.nom ?? '';
//     const ln = c.lastName  ?? c.nomFamille ?? '';
//     return `${fn} ${ln}`.trim() || c.email || '—';
//   };

//   const getDestination = (p) => {
//     if (typeof p.destination === 'string') return p.destination;
//     if (p.destination?.city) return `${p.destination.city}${p.destination.country ? ', ' + p.destination.country : ''}`;
//     return p.agency?.city ?? p.destinationCity ?? '—';
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
//       <p style={{ color: tk.muted, fontSize: 13, margin: 0 }}>Chargement du tableau de bord…</p>
//       <style>{`@keyframes spin { to { transform:rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
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
//       <style>{`
//         @keyframes spin   { to { transform:rotate(360deg); } }
//         @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.4} }
//       `}</style>

//       <div style={{ padding: '28px 32px', maxWidth: 1520, margin: '0 auto' }}>

//         {/* ── HEADER ── */}
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
//             <div style={{
//               width: 48, height: 48, borderRadius: 14,
//               background: tk.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
//             }}>
//               <ChartBarIcon style={{ width: 24, height: 24, color: tk.accent }} />
//             </div>
//             <div>
//               <h1 style={{ fontSize: 22, fontWeight: 800, color: tk.ink, margin: 0, letterSpacing: '-.02em' }}>
//                 Tableau de bord
//               </h1>
//               <p style={{ fontSize: 13, color: tk.muted, margin: '3px 0 0', textTransform: 'capitalize' }}>
//                 {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
//               </p>
//             </div>
//           </div>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px',
//               background: tk.white, border: `1.5px solid ${tk.border}`, borderRadius: 10 }}>
//               <span style={{ width: 8, height: 8, borderRadius: '50%', background: tk.emerald, animation: 'pulse 2s ease infinite' }} />
//               <span style={{ fontSize: 12, color: tk.sec, fontWeight: 500 }}>
//                 Mis à jour {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
//               </span>
//             </div>
//             <button
//               onClick={() => fetchAll(true)}
//               disabled={refreshing}
//               style={{
//                 display: 'inline-flex', alignItems: 'center', gap: 8,
//                 padding: '9px 18px', borderRadius: 10,
//                 background: tk.accent, color: '#fff', border: 'none',
//                 fontSize: 13, fontWeight: 600, cursor: refreshing ? 'not-allowed' : 'pointer',
//                 opacity: refreshing ? .7 : 1, transition: 'opacity .15s',
//               }}>
//               <ArrowPathIcon style={{ width: 15, height: 15, animation: refreshing ? 'spin .8s linear infinite' : 'none' }} />
//               {refreshing ? 'Actualisation…' : 'Actualiser'}
//             </button>
//           </div>
//         </div>

//         {/* ── KPI ROW 1 ── */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 18 }}>
//           <StatCard title="Revenus totaux"   value={fmtE(stats?.revenue)}   sub="Paiements confirmés" icon={BanknotesIcon}   color={tk.emerald} trendVal={stats?.revenueTrend} />
//           <StatCard title="Colis actifs"     value={fmt(stats?.packages)}   sub="En attente + Transit" icon={CubeIcon}       color={tk.accent}  trendVal={stats?.packagesTrend} />
//           <StatCard title="Clients actifs"   value={fmt(stats?.clients)}    sub="Comptes vérifiés"   icon={UserGroupIcon}  color={tk.purple} />
//           <StatCard title="Livraisons"       value={fmt(stats?.deliveries)} sub="Statut : livré"     icon={TruckIcon}      color={tk.amber} />
//         </div>

//         {/* ── KPI ROW 2 ── */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 28 }}>
//           <StatCard title="Agences"          value={fmt(stats?.agencies)}         sub="Réseau actif"         icon={BuildingOfficeIcon}   color={tk.indigo} />
//           <StatCard title="Impayés"          value={fmtE(stats?.pendingPayments)} sub="En attente règlement" icon={ExclamationCircleIcon} color={tk.rose} />
//           <StatCard title="Taux livraison"
//             value={stats && (stats.deliveries + stats.packages) > 0
//               ? `${Math.round(stats.deliveries / (stats.deliveries + stats.packages) * 100)} %`
//               : stats?.deliveries > 0 ? '100 %' : '—'}
//             sub="Livré / total" icon={CheckCircleIcon} color={tk.emerald} />
//           <StatCard title="Rev. moy./colis"
//             value={stats?.deliveries > 0 ? fmtE(Math.round(stats.revenue / stats.deliveries)) : '—'}
//             sub="Par livraison" icon={CurrencyDollarIcon} color={tk.accent} />
//         </div>

//         {/* ── CHARTS ROW ── */}
//         <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 20, marginBottom: 24 }}>

//           <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)' }}>
//             <div style={{ padding: '18px 22px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//               <div>
//                 <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, margin: 0 }}>Évolution mensuelle</h3>
//                 <p style={{ fontSize: 12, color: tk.muted, margin: '3px 0 0' }}>Revenus & volume colis — 6 derniers mois</p>
//               </div>
//               <Link to="/app/reports" style={{ fontSize: 12, color: tk.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
//                 Rapport <ChevronRightIcon style={{ width: 11, height: 11 }} />
//               </Link>
//             </div>
//             <div style={{ padding: '0 22px 20px', height: 270 }}>
//               {charts.revenueByMonth.length > 0
//                 ? <Line data={lineData} options={lineOptions} />
//                 : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: tk.muted, fontSize: 13 }}>
//                     Aucune donnée disponible
//                   </div>
//               }
//             </div>
//           </div>

//           <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)' }}>
//             <div style={{ padding: '18px 22px 12px' }}>
//               <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, margin: 0 }}>Répartition des colis</h3>
//               <p style={{ fontSize: 12, color: tk.muted, margin: '3px 0 0' }}>Par statut — tous temps</p>
//             </div>
//             <div style={{ padding: '0 22px', height: 170 }}>
//               <Doughnut data={donutData} options={donutOptions} />
//             </div>
//             <div style={{ padding: '12px 22px 20px' }}>
//               {statusDonut.map((s, i) => (
//                 <MiniKpi key={s.status} label={s.status} value={fmt(s.count)} color={statusColors[i] || tk.muted} />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ── BAR CHART + AGENCIES ── */}
//         <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20, marginBottom: 24 }}>

//           <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)' }}>
//             <div style={{ padding: '18px 22px 12px' }}>
//               <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, margin: 0 }}>Volume de colis mensuel</h3>
//               <p style={{ fontSize: 12, color: tk.muted, margin: '3px 0 0' }}>Colis créés par mois</p>
//             </div>
//             <div style={{ padding: '0 22px 20px', height: 220 }}>
//               {charts.revenueByMonth.length > 0
//                 ? <Bar data={barData} options={barOptions} />
//                 : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: tk.muted, fontSize: 13 }}>Aucune donnée</div>
//               }
//             </div>
//           </div>

//           <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)' }}>
//             <SectionHeader icon={BuildingOfficeIcon} title="Top agences"
//               action={
//                 <Link to="/app/agencies" style={{ fontSize: 12, color: tk.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
//                   Voir tout <ChevronRightIcon style={{ width: 11, height: 11 }} />
//                 </Link>
//               }
//             />
//             <div style={{ padding: '6px 20px' }}>
//               {agencies.length > 0
//                 ? agencies.map((a, i) => (
//                     <AgencyRow
//                       key={a._id || i}
//                       name={a.name || a.nom || `Agence ${i + 1}`}
//                       city={a.city || a.ville || a.location || a.address?.city || '—'}
//                       packages={fmt(a.packagesCount ?? a.packages ?? a.totalPackages ?? 0)}
//                       revenue={a.revenue ?? a.totalRevenue ?? 0}
//                       active={a.isActive !== false && a.status !== 'inactif'}
//                     />
//                   ))
//                 : [
//                     { name: 'Aucune agence', city: '—', packages: '—', revenue: 0, active: false },
//                   ].map((a, i) => <AgencyRow key={i} {...a} />)
//               }
//             </div>
//           </div>
//         </div>

//         {/* ── PACKAGES TABLE ── */}
//         <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)', marginBottom: 24 }}>
//           <SectionHeader icon={CubeIcon} title={`Derniers colis${packages.length > 0 ? ` (${packages.length})` : ''}`}
//             action={
//               <Link to="/app/packages" style={{ fontSize: 12, color: tk.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
//                 Voir tout <ChevronRightIcon style={{ width: 11, height: 11 }} />
//               </Link>
//             }
//           />
//           <TableHead cols={{ template: '2fr 1.5fr 1fr 1.2fr 90px', labels: ['Tracking / Client', 'Destination', 'Statut', 'Date', 'Montant'] }} />
//           {packages.length > 0
//             ? packages.slice(0, 8).map((p, i) => (
//                 <PkgRow
//                   key={p._id || i}
//                   tracking={p.trackingNumber || p.numeroSuivi || `#PKG-${i + 1}`}
//                   client={getClientName(p)}
//                   destination={getDestination(p)}
//                   status={p.status || p.statut || 'en attente'}
//                   date={p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : '—'}
//                   amount={p.price ?? p.amount ?? p.montant ?? p.prix ?? null}
//                 />
//               ))
//             : (
//                 <div style={{ padding: 40, textAlign: 'center', color: tk.muted, fontSize: 13 }}>
//                   Aucun colis trouvé
//                 </div>
//               )
//           }
//         </div>

//         {/* ── PAYMENTS TABLE ── */}
//         <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)' }}>
//           <SectionHeader icon={BanknotesIcon} title={`Derniers paiements${payments.length > 0 ? ` (${payments.length})` : ''}`}
//             action={
//               <Link to="/app/payments" style={{ fontSize: 12, color: tk.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
//                 Voir tout <ChevronRightIcon style={{ width: 11, height: 11 }} />
//               </Link>
//             }
//           />
//           <TableHead cols={{ template: '2fr 1.5fr 90px 1fr', labels: ['Référence / Client', 'Montant', 'Statut', 'Date'] }} />
//           {payments.length > 0
//             ? payments.slice(0, 6).map((p, i) => (
//                 <PayRow
//                   key={p._id || i}
//                   ref_={p.reference || p.invoiceNumber || p.trackingNumber || `#PAY-${i + 1}`}
//                   client={getClientName(p)}
//                   amount={p.amount ?? p.montant ?? p.total ?? 0}
//                   status={p.status || p.statut || 'en attente de paiement'}
//                   date={p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : '—'}
//                 />
//               ))
//             : (
//                 <div style={{ padding: 40, textAlign: 'center', color: tk.muted, fontSize: 13 }}>
//                   Aucun paiement trouvé
//                 </div>
//               )
//           }
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Dashboard;





import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  CurrencyDollarIcon, CubeIcon, UserGroupIcon, TruckIcon,
  BuildingOfficeIcon, CalendarIcon, ChevronRightIcon, SparklesIcon,
  ArrowTrendingUpIcon, ArrowTrendingDownIcon, CheckCircleIcon,
  ClockIcon, ArrowPathIcon, ExclamationCircleIcon, BanknotesIcon,
  ChartBarIcon, GlobeAltIcon, BellAlertIcon, ArrowUpIcon,
} from '@heroicons/react/24/outline';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement,
  Title, Tooltip, Legend, Filler,
  type ChartOptions,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import axios from '../../api/axios';
import WebSocketService from '../../services/websocket';
import { formatMoney, digitsOf, getCurrency } from '../../config/currencies';
import type { Agency, Package, Payment } from '../../types/models';
import type { IconComponent } from '../../types/ui';

/** Indicateurs du tableau de bord (montants dans la devise affichée). */
interface DashboardStats {
  revenue: number;
  revenueTrend?: number;
  packages: number;
  packagesTrend: number;
  clients: number;
  deliveries: number;
  agencies: number;
  pendingPayments: number;
  currency: string | null;
  currencies: string[];
}
interface MonthPoint { month?: string; value?: number; count?: number }
interface StatusPoint { status?: string; count?: number }
interface DashboardCharts { revenueByMonth: MonthPoint[]; packagesByStatus: StatusPoint[] }

/** Événement du fil d'activité (temps réel). */
interface Activity {
  _id: string;
  type?: string;
  title?: string;
  description?: string;
  createdAt?: string;
  actor?: { name?: string } | null;
}

/** Agence telle que renvoyée par la liste du tableau de bord (compteurs inclus). */
type DashboardAgency = Agency & { packages?: number };

interface StatCardProps {
  title: React.ReactNode;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon: IconComponent;
  color: string;
  trend?: 'up' | 'down';
  trendVal?: number;
  loading?: boolean;
}

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler,
);

/* ─── TOKENS ─────────────────────────────────── */
const tk = {
  bg:         '#F7FAFE',
  white:      '#ffffff',
  border:     '#DCE9F5',
  ink:        '#172F50',
  ink2:       '#172F50',
  sec:        '#52677D',
  muted:      '#8295A8',
  accent:     '#4D91D9',
  accentSoft: '#E1EFFB',
  emerald:    '#059669',
  emeraldSoft:'#d1fae5',
  amber:      '#d97706',
  amberSoft:  '#fef3c7',
  rose:       '#dc2626',
  roseSoft:   '#fee2e2',
  purple:     '#7c3aed',
  purpleSoft: '#ede9fe',
  indigo:     '#4338ca',
  indigoSoft: '#e0e7ff',
};

/* ─── HELPERS ─────────────────────────────────── */
const fmt  = (n: number | string | null | undefined) => Number(n || 0).toLocaleString('fr-FR');
// Montant dans SA devise (avant : « € » imposé à tous les montants, quelle que soit leur devise).
const fmtE = (n: number | string | null | undefined, currency?: string | null) => formatMoney(Number(n || 0), currency);
// Prix d'un colis : contrat multidevise (unités mineures, devise de départ) ou ancien prix (devise d'origine).
const packagePrice = (p: Package): { amount: number | null; currency: string | null | undefined } => (p.financial?.totalMinor != null
  ? { amount: p.financial.totalMinor / 10 ** digitsOf(p.financial.referenceCurrency), currency: p.financial.referenceCurrency }
  : p.totalPrice ? { amount: p.totalPrice, currency: getCurrency(p.origin)?.code } : { amount: null, currency: null });

/* ─── STATUS BADGE ───────────────────────────── */
const StatusBadge = ({ status }: { status?: string }) => {
  const map: Record<string, { bg: string; color: string; label: string; Icon: IconComponent | null }> = {
    'livré':      { bg: tk.emeraldSoft, color: tk.emerald,  label: 'Livré',       Icon: CheckCircleIcon },
    'en transit': { bg: tk.accentSoft,  color: tk.accent,   label: 'En transit',  Icon: TruckIcon },
    'en attente': { bg: tk.amberSoft,   color: tk.amber,    label: 'En attente',  Icon: ClockIcon },
    'payé':       { bg: tk.emeraldSoft, color: tk.emerald,  label: 'Payé',        Icon: CheckCircleIcon },
    'impayé':     { bg: tk.amberSoft,   color: tk.amber,    label: 'Impayé',      Icon: ExclamationCircleIcon },
    'annulé':     { bg: tk.roseSoft,    color: tk.rose,     label: 'Annulé',      Icon: ExclamationCircleIcon },
  };
  const s = map[status ?? ''] || { bg: `${tk.muted}18`, color: tk.muted, label: status, Icon: null };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 99,
      background: s.bg, color: s.color,
      fontSize: 11, fontWeight: 700, letterSpacing: '.02em',
    }}>
      {s.Icon && <s.Icon style={{ width: 11, height: 11 }} />}
      {s.label}
    </span>
  );
};

/* ─── STAT CARD ──────────────────────────────── */
const StatCard = ({ title, value, sub, icon: Icon, color, trend, trendVal, loading }: StatCardProps) => {
  const trendUp = trend === 'up' || (typeof trendVal === 'number' && trendVal > 0);
  return (
    <div style={{
      background: tk.white, borderRadius: 18, padding: '20px 22px',
      border: `1.5px solid ${tk.border}`,
      boxShadow: '0 1px 4px rgba(23,47,80,.04)',
      transition: 'transform .2s, box-shadow .2s',
      cursor: 'default',
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(23,47,80,.09)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';   e.currentTarget.style.boxShadow = '0 1px 4px rgba(23,47,80,.04)'; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 13,
          background: `${color}18`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon style={{ width: 22, height: 22, color }} />
        </div>
        {trendVal !== undefined && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 3,
            fontSize: 11, fontWeight: 700,
            color:   trendUp ? tk.emerald : tk.rose,
            background: trendUp ? tk.emeraldSoft : tk.roseSoft,
            padding: '3px 9px', borderRadius: 99,
          }}>
            {trendUp
              ? <ArrowTrendingUpIcon   style={{ width: 11, height: 11 }} />
              : <ArrowTrendingDownIcon style={{ width: 11, height: 11 }} />
            }
            {typeof trendVal === 'number' ? `${trendVal > 0 ? '+' : ''}${trendVal}%` : trendVal}
          </span>
        )}
      </div>
      {loading ? (
        <div style={{ height: 38, background: tk.bg, borderRadius: 8, marginBottom: 6 }} />
      ) : (
        <div style={{ fontSize: 30, fontWeight: 800, color: tk.ink, letterSpacing: '-.02em', marginBottom: 4 }}>
          {value}
        </div>
      )}
      <div style={{ fontSize: 12, fontWeight: 600, color: tk.muted, textTransform: 'uppercase', letterSpacing: '.06em' }}>
        {title}
      </div>
      {sub && <div style={{ fontSize: 11, color: tk.muted, marginTop: 3 }}>{sub}</div>}
    </div>
  );
};

/* ─── SECTION HEADER ─────────────────────────── */
const SectionHeader = ({ icon: Icon, title, color = tk.accent, action }: { icon: IconComponent; title: React.ReactNode; color?: string; action?: React.ReactNode }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 20px',
    background: tk.bg, borderBottom: `1px solid ${tk.border}`,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8, background: tk.white,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,.07)',
      }}>
        <Icon style={{ width: 14, height: 14, color }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.muted }}>
        {title}
      </span>
    </div>
    {action}
  </div>
);

/* ─── PACKAGE ROW ────────────────────────────── */
const PkgRow = ({ tracking, client, destination, status, date, amount, currency }: { tracking?: string; client?: string; destination?: string; status?: string; date?: string; amount?: number | null; currency?: string | null }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1fr 1.2fr 90px',
    alignItems: 'center',
    gap: 12, padding: '11px 20px',
    borderBottom: `1px solid ${tk.border}`,
    transition: 'background .12s',
    cursor: 'pointer',
  }}
  onMouseEnter={e => e.currentTarget.style.background = tk.bg}
  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
    <div>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tk.ink }}>{tracking}</p>
      <p style={{ margin: '2px 0 0', fontSize: 11, color: tk.muted }}>{client}</p>
    </div>
    <p style={{ margin: 0, fontSize: 12, color: tk.sec }}>{destination || '—'}</p>
    <StatusBadge status={status} />
    <p style={{ margin: 0, fontSize: 12, color: tk.muted, textAlign: 'right' }}>{date}</p>
    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tk.ink, textAlign: 'right' }}>
      {amount ? fmtE(amount, currency) : '—'}
    </p>
  </div>
);

/* ─── PAYMENT ROW ────────────────────────────── */
const PayRow = ({ ref_, client, amount, currency, status, date }: { ref_?: string; client?: string; amount?: number; currency?: string; status?: string; date?: string }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 90px 1fr',
    alignItems: 'center',
    gap: 12, padding: '11px 20px',
    borderBottom: `1px solid ${tk.border}`,
    transition: 'background .12s',
  }}
  onMouseEnter={e => e.currentTarget.style.background = tk.bg}
  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
    <div>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tk.ink }}>{ref_ || '—'}</p>
      <p style={{ margin: '2px 0 0', fontSize: 11, color: tk.muted }}>{client}</p>
    </div>
    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tk.ink }}>{fmtE(amount, currency)}</p>
    <StatusBadge status={status} />
    <p style={{ margin: 0, fontSize: 12, color: tk.muted, textAlign: 'right' }}>{date}</p>
  </div>
);

/* ─── TABLE HEADER ───────────────────────────── */
const TableHead = ({ cols }: { cols: { template: string; labels: string[] } }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: cols.template,
    gap: 12, padding: '8px 20px',
    background: `${tk.bg}cc`,
    borderBottom: `1px solid ${tk.border}`,
  }}>
    {cols.labels.map((l, i) => (
      <span key={i} style={{
        fontSize: 10, fontWeight: 700, color: tk.muted,
        textTransform: 'uppercase', letterSpacing: '.1em',
        textAlign: i === cols.labels.length - 1 ? 'right' : 'left',
      }}>{l}</span>
    ))}
  </div>
);

/* ─── MINI KPI ───────────────────────────────── */
const MiniKpi = ({ label, value, color }: { label?: string; value: React.ReactNode; color: string }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 0', borderBottom: `1px solid ${tk.border}`,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: tk.sec }}>{label}</span>
    </div>
    <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}</span>
  </div>
);

/* ─── AGENCY ROW ─────────────────────────────── */
const AgencyRow = ({ name, city, packages, revenue, currency, active }: { name?: string; city?: string; packages?: React.ReactNode; revenue?: number | null; currency?: string | null; active?: boolean }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '11px 0', borderBottom: `1px solid ${tk.border}`,
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: 10, background: active ? tk.accentSoft : tk.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <BuildingOfficeIcon style={{ width: 16, height: 16, color: active ? tk.accent : tk.muted }} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tk.ink,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</p>
      <p style={{ margin: '1px 0 0', fontSize: 11, color: tk.muted }}>{city}</p>
    </div>
    <div style={{ textAlign: 'right', flexShrink: 0 }}>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: tk.ink }}>{packages} colis</p>
      <p style={{ margin: '1px 0 0', fontSize: 11, color: tk.muted }}>{revenue != null ? fmtE(revenue, currency) : '—'}</p>
    </div>
  </div>
);

/* ─── MAIN COMPONENT ─────────────────────────── */
const Dashboard = () => {
  const [stats,    setStats]    = useState<DashboardStats | null>(null);
  // Devise affichée (les montants de devises différentes ne sont jamais additionnés).
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [charts,   setCharts]   = useState<DashboardCharts>({ revenueByMonth: [], packagesByStatus: [] });
  const [packages, setPackages] = useState<Package[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [agencies, setAgencies] = useState<DashboardAgency[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [refreshing,   setRefreshing]   = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [lastRefresh,  setLastRefresh]  = useState(new Date());
  const [activities,   setActivities]   = useState<Activity[]>([]);
  const [newActivityId,setNewActivityId]= useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── fetch ── */
  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const [sRes, cRes, pkgRes, payRes, agRes] = await Promise.allSettled([
        axios.get('/dashboard/stats', { params: selectedCurrency ? { currency: selectedCurrency } : {} }),
        axios.get('/dashboard/charts', { params: selectedCurrency ? { currency: selectedCurrency } : {} }),
        axios.get('/packages?limit=8&sort=-createdAt'),
        axios.get('/payments?limit=6&sort=-createdAt'),
        axios.get('/agencies?limit=5&sort=-packagesCount'),
      ]);

      /* stats */
      if (sRes.status === 'fulfilled') {
        const s = sRes.value.data?.data ?? sRes.value.data ?? {};
        setStats({
          revenue:       Number(s.revenue      ?? 0),
          revenueTrend:  s.revenueTrend == null ? undefined : Number(s.revenueTrend),
          packages:      Number(s.packages     ?? 0),
          packagesTrend: Number(s.packagesTrend ?? 0),
          clients:       Number(s.clients      ?? 0),
          deliveries:    Number(s.deliveries   ?? 0),
          agencies:      Number(s.agencies     ?? 0),
          pendingPayments: Number(s.pendingPayments ?? 0),
          currency:        s.currency || null,
          currencies:      Array.isArray(s.currencies) ? s.currencies : [],
        });
      }

      /* charts */
      if (cRes.status === 'fulfilled') {
        const c = cRes.value.data?.data ?? cRes.value.data ?? {};
        setCharts({
          revenueByMonth:   Array.isArray(c.revenueByMonth)   ? c.revenueByMonth   : [],
          packagesByStatus: Array.isArray(c.packagesByStatus) ? c.packagesByStatus : [],
        });
      }

      /* packages */
      if (pkgRes.status === 'fulfilled') {
        const d = pkgRes.value.data;
        const list = d?.data?.packages ?? d?.data?.items ?? d?.packages ?? d?.items
          ?? (Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
        setPackages(list);
      }

      /* payments */
      if (payRes.status === 'fulfilled') {
        const d = payRes.value.data;
        const list = d?.data?.payments ?? d?.data?.items ?? d?.payments ?? d?.items
          ?? (Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
        setPayments(list);
      }

      /* agencies */
      if (agRes.status === 'fulfilled') {
        const d = agRes.value.data;
        const list = d?.data?.agencies ?? d?.data?.items ?? d?.agencies ?? d?.items
          ?? (Array.isArray(d?.data) ? d.data : Array.isArray(d) ? d : []);
        setAgencies(list);
      }

      setLastRefresh(new Date());
    } catch {
      setError('Impossible de charger les données du tableau de bord.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCurrency]);

  const fetchActivities = useCallback(async () => {
    try {
      const res  = await axios.get('/activities?limit=30');
      const list = res.data?.data;
      setActivities(Array.isArray(list) ? list : []);
    } catch { /* silent — ne bloque pas le dashboard */ }
  }, []);

  /* Chargement initial + Socket.IO temps réel + fallback polling 5 min */
  useEffect(() => {
    fetchAll(false);
    fetchActivities();

    WebSocketService.connect();
    WebSocketService.joinRoom('dashboard_admin');

    const handleDashboardUpdate = () => fetchAll(true);
    WebSocketService.on('dashboard_update', handleDashboardUpdate);

    const handleActivityEvent = (activity: Activity) => {
      setActivities(prev => [activity, ...prev].slice(0, 30));
      setNewActivityId(activity._id);
      setTimeout(() => setNewActivityId(null), 3000);
    };
    WebSocketService.on('activity_event', handleActivityEvent);

    timerRef.current = setInterval(() => fetchAll(true), 300_000);

    return () => {
      clearInterval(timerRef.current ?? undefined);
      WebSocketService.off('dashboard_update', handleDashboardUpdate);
      WebSocketService.off('activity_event', handleActivityEvent);
    };
  }, [fetchAll, fetchActivities]);

  /* ── chart configs ── */
  const lineData = {
    labels: charts.revenueByMonth.map(i => i.month),
    datasets: [
      {
        label: `Encaissements${stats?.currency ? ` (${stats.currency})` : ''}`,
        data: charts.revenueByMonth.map(i => i.value ?? 0),
        borderColor: tk.accent,
        backgroundColor: `${tk.accent}0c`,
        tension: .45, fill: true, borderWidth: 2.5,
        pointBackgroundColor: tk.accent, pointRadius: 4, pointHoverRadius: 6,
      },
      {
        label: 'Colis',
        data: charts.revenueByMonth.map(i => i.count ?? 0),
        borderColor: tk.emerald,
        backgroundColor: `${tk.emerald}0c`,
        tension: .45, fill: true, borderWidth: 2.5,
        pointBackgroundColor: tk.emerald, pointRadius: 4, pointHoverRadius: 6,
        yAxisID: 'y2',
      },
    ],
  };
  const lineOptions: ChartOptions<'line'> = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: true, position: 'top',
        labels: { color: tk.sec, font: { size: 11 }, boxWidth: 10, padding: 16, usePointStyle: true } },
      tooltip: {
        backgroundColor: '#fff', borderColor: tk.border, borderWidth: 1,
        titleColor: tk.ink, bodyColor: tk.sec, padding: 12, cornerRadius: 10,
        callbacks: { label: ctx => (ctx.dataset as { yAxisID?: string }).yAxisID === 'y2'
          ? `${ctx.dataset.label}: ${ctx.parsed.y} colis`
          : `${ctx.dataset.label}: ${fmtE(ctx.parsed.y, stats?.currency)}` },
      },
    },
    scales: {
      y:  { beginAtZero: true, grid: { color: tk.border }, ticks: { color: tk.muted, font: { size: 11 }, callback: v => fmtE(v, stats?.currency) } },
      y2: { beginAtZero: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { color: tk.muted, font: { size: 11 } } },
      x:  { grid: { display: false }, ticks: { color: tk.muted, font: { size: 11 } } },
    },
  };

  const donutData = {
    labels: charts.packagesByStatus.length ? charts.packagesByStatus.map(i => i.status) : ['Livré', 'En transit', 'En attente'],
    datasets: [{
      data: charts.packagesByStatus.length
        ? charts.packagesByStatus.map(i => i.count)
        : [0, 0, 0],
      backgroundColor: [tk.emerald, tk.accent, tk.amber, tk.rose, tk.purple],
      borderWidth: 3, borderColor: '#fff', hoverOffset: 4,
    }],
  };
  const donutOptions: ChartOptions<'doughnut'> = {
    responsive: true, maintainAspectRatio: false, cutout: '68%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff', borderColor: tk.border, borderWidth: 1,
        titleColor: tk.ink, bodyColor: tk.sec, padding: 12, cornerRadius: 10,
      },
    },
  };

  /* barChart for package trend */
  const barData = {
    labels: charts.revenueByMonth.map(i => i.month),
    datasets: [{
      label: 'Colis créés',
      data: charts.revenueByMonth.map(i => i.count ?? 0),
      backgroundColor: `${tk.accent}22`,
      borderColor: tk.accent,
      borderWidth: 1.5,
      borderRadius: 6,
    }],
  };
  const barOptions: ChartOptions<'bar'> = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#fff', borderColor: tk.border, borderWidth: 1, titleColor: tk.ink, bodyColor: tk.sec, padding: 10, cornerRadius: 8 },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: tk.border }, ticks: { color: tk.muted, font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { color: tk.muted, font: { size: 11 } } },
    },
  };

  const now = new Date();
  const donutColors = [tk.emerald, tk.accent, tk.amber, tk.rose, tk.purple];

  /* ── LOADING ── */
  if (loading) return (
    <div style={{ display: 'flex', flex: 1, minHeight: '100vh', background: tk.bg,
      alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{
        width: 44, height: 44, border: `3px solid ${tk.border}`,
        borderTop: `3px solid ${tk.accent}`, borderRadius: '50%',
        animation: 'spin .9s linear infinite',
      }} />
      <p style={{ color: tk.muted, fontSize: 13, margin: 0 }}>Chargement du tableau de bord…</p>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', flex: 1, minHeight: '100vh', background: tk.bg,
      alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <ExclamationCircleIcon style={{ width: 40, height: 40, color: tk.rose }} />
      <p style={{ color: tk.rose, fontSize: 14, margin: 0 }}>{error}</p>
      <button onClick={() => fetchAll(false)} style={{
        padding: '10px 24px', background: '#347FC5', border: 'none',
        borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 600,
        cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
      }}>
        <ArrowPathIcon style={{ width: 16, height: 16 }} />Réessayer
      </button>
    </div>
  );

  const statusDonut = charts.packagesByStatus.length
    ? charts.packagesByStatus
    : [{ status: 'Livré', count: 0 }, { status: 'En transit', count: 0 }, { status: 'En attente', count: 0 }];

  return (
    <div style={{ background: tk.bg, flex: 1, minHeight: '100vh' }}>
      <style>{`
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
        .db-charts-row     { display:grid; grid-template-columns:1.8fr 1fr; gap:20px; margin-bottom:24px; }
        .db-chart-agencies { display:grid; grid-template-columns:1.4fr 1fr; gap:20px; margin-bottom:24px; }
        /* ── Responsive dashboard ── */
        @media (max-width:900px) {
          .grid-kpi-4 { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media (max-width:768px) {
          .db-charts-row,
          .db-chart-agencies { grid-template-columns:1fr; }
          .page-content { padding:16px 12px !important; }
        }
        @media (max-width:520px) {
          .grid-kpi-4 { grid-template-columns:1fr !important; }
        }
      `}</style>
      <div className="page-content" style={{ padding: '28px 32px', maxWidth: 1520, margin: '0 auto' }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: tk.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ChartBarIcon style={{ width: 24, height: 24, color: tk.accent }} />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: tk.ink, margin: 0, letterSpacing: '-.02em' }}>
                Tableau de bord
              </h1>
              <p style={{ fontSize: 13, color: tk.muted, margin: '3px 0 0', textTransform: 'capitalize' }}>
                {now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Live indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px',
              background: tk.white, border: `1.5px solid ${tk.border}`, borderRadius: 10 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', background: tk.emerald,
                animation: 'pulse 2s ease infinite',
              }} />
              <span style={{ fontSize: 12, color: tk.sec, fontWeight: 500 }}>
                Mis à jour {lastRefresh.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <button
              onClick={() => fetchAll(true)}
              disabled={refreshing}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '9px 18px', borderRadius: 10,
                background: '#347FC5', color: '#fff', border: 'none',
                fontSize: 13, fontWeight: 600, cursor: refreshing ? 'not-allowed' : 'pointer',
                opacity: refreshing ? .7 : 1, transition: 'opacity .15s',
              }}>
              <ArrowPathIcon style={{
                width: 15, height: 15,
                animation: refreshing ? 'spin .8s linear infinite' : 'none',
              }} />
              {refreshing ? 'Actualisation…' : 'Actualiser'}
            </button>
          </div>
        </div>

        {/* ── Devise affichée : un indicateur monétaire = une seule devise ── */}
        {(stats?.currencies?.length ?? 0) > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
            <label htmlFor="dashboard-currency" style={{ fontSize: 12, color: tk.muted, fontWeight: 600 }}>Devise affichée</label>
            <select id="dashboard-currency" value={stats?.currency || ''} onChange={e => setSelectedCurrency(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${tk.border}`, fontSize: 13 }}>
              {stats?.currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span style={{ fontSize: 11, color: tk.muted }}>Montants non convertis : chaque devise est présentée séparément.</span>
          </div>
        )}
        {/* ── KPI GRID ── */}
        <div className="grid-kpi-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 24 }}>
          <StatCard
            title={`Encaissements${stats?.currency ? ` (${stats.currency})` : ''}`} value={stats?.currency ? fmtE(stats.revenue, stats.currency) : '—'}
            sub="Paiements confirmés"
            icon={BanknotesIcon} color={tk.emerald}
            trendVal={stats?.revenueTrend}
          />
          <StatCard
            title="Colis actifs" value={fmt(stats?.packages)}
            sub="En attente + Transit"
            icon={CubeIcon} color={tk.accent}
            trendVal={stats?.packagesTrend}
          />
          <StatCard
            title="Clients actifs" value={fmt(stats?.clients)}
            sub="Comptes vérifiés"
            icon={UserGroupIcon} color={tk.purple}
          />
          <StatCard
            title="Livraisons totales" value={fmt(stats?.deliveries)}
            sub="Statut : livré"
            icon={TruckIcon} color={tk.amber}
          />
        </div>

        {/* ── KPI ROW 2 ── */}
        <div className="grid-kpi-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 28 }}>
          <StatCard
            title="Agences" value={fmt(stats?.agencies)}
            sub="Réseau actif"
            icon={BuildingOfficeIcon} color={tk.indigo}
          />
          <StatCard
            title={`Reste à encaisser${stats?.currency ? ` (${stats.currency})` : ''}`} value={stats?.currency ? fmtE(stats.pendingPayments, stats.currency) : '—'}
            sub="En attente règlement"
            icon={ExclamationCircleIcon} color={tk.rose}
          />
          <StatCard
            title="Taux livraison"
            value={stats && stats.deliveries + stats.packages > 0
              ? `${Math.round((stats.deliveries / (stats.deliveries + stats.packages)) * 100)} %`
              : '—'}
            sub="Livré / total colis"
            icon={CheckCircleIcon} color={tk.emerald}
          />
          <StatCard
            title="Rev. moyen/colis"
            value={stats && stats.deliveries > 0
              ? fmtE(stats.revenue / stats.deliveries, stats.currency)
              : '—'}
            sub="Par livraison"
            icon={CurrencyDollarIcon} color={tk.accent}
          />
        </div>

        {/* ── CHARTS ROW ── */}
        <div className="db-charts-row">

          {/* Line chart */}
          <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)' }}>
            <div style={{ padding: '18px 22px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, margin: 0 }}>Évolution mensuelle</h3>
                <p style={{ fontSize: 12, color: tk.muted, margin: '3px 0 0' }}>Revenus & volume colis — 6 derniers mois</p>
              </div>
              <Link to="/app/reports" style={{ fontSize: 12, color: tk.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                Rapport <ChevronRightIcon style={{ width: 11, height: 11 }} />
              </Link>
            </div>
            <div style={{ padding: '0 22px 20px', height: 270 }}>
              {charts.revenueByMonth.length > 0
                ? <Line data={lineData} options={lineOptions} />
                : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: tk.muted, fontSize: 13 }}>Aucune donnée disponible</div>
              }
            </div>
          </div>

          {/* Donut */}
          <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)' }}>
            <div style={{ padding: '18px 22px 12px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, margin: 0 }}>Répartition des colis</h3>
              <p style={{ fontSize: 12, color: tk.muted, margin: '3px 0 0' }}>Par statut — tous temps</p>
            </div>
            <div style={{ padding: '0 22px', height: 170 }}>
              <Doughnut data={donutData} options={donutOptions} />
            </div>
            <div style={{ padding: '12px 22px 20px' }}>
              {statusDonut.map((s, i) => (
                <MiniKpi
                  key={s.status}
                  label={s.status}
                  value={fmt(s.count)}
                  color={donutColors[i] || tk.muted}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── CHART + AGENCIES ── */}
        <div className="db-chart-agencies">

          {/* Bar chart */}
          <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)' }}>
            <div style={{ padding: '18px 22px 12px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: tk.ink, margin: 0 }}>Volume de colis mensuel</h3>
              <p style={{ fontSize: 12, color: tk.muted, margin: '3px 0 0' }}>Colis créés par mois</p>
            </div>
            <div style={{ padding: '0 22px 20px', height: 220 }}>
              {charts.revenueByMonth.length > 0
                ? <Bar data={barData} options={barOptions} />
                : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: tk.muted, fontSize: 13 }}>Aucune donnée</div>
              }
            </div>
          </div>

          {/* Top agences */}
          <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)' }}>
            <SectionHeader
              icon={BuildingOfficeIcon} title="Top agences"
              action={
                <Link to="/app/agencies" style={{ fontSize: 12, color: tk.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                  Voir tout <ChevronRightIcon style={{ width: 11, height: 11 }} />
                </Link>
              }
            />
            <div style={{ padding: '6px 20px' }}>
              {agencies.length > 0 ? agencies.map((a, i) => (
                <AgencyRow
                  key={a._id || i}
                  name={a.name || `Agence ${i + 1}`}
                  city={a.city || a.location || '—'}
                  packages={fmt(a.packagesCount ?? a.packages ?? 0)}
                  revenue={a.revenue ?? null}
                  currency={getCurrency(a.address?.country)?.code}
                  active={a.isActive !== false}
                />
              )) : (
                // Avant : trois agences fictives affichées comme réelles. Désormais : état vide explicite.
                <p style={{ padding: '18px 0', textAlign: 'center', color: tk.muted, fontSize: 13 }}>Aucune agence enregistrée.</p>
              )}
            </div>
          </div>
        </div>

        {/* ── PACKAGES TABLE ── */}
        <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)', marginBottom: 24 }}>
          <SectionHeader
            icon={CubeIcon} title="Derniers colis"
            action={
              <Link to="/app/packages" style={{ fontSize: 12, color: tk.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                Voir tout <ChevronRightIcon style={{ width: 11, height: 11 }} />
              </Link>
            }
          />
          <div style={{ overflowX: 'auto' }}>
          <TableHead cols={{
            template: '2fr 1.5fr 1fr 1.2fr 90px',
            labels: ['Tracking / Client', 'Destination', 'Statut', 'Date', 'Montant'],
          }} />
          {packages.length > 0 ? packages.slice(0, 8).map((p, i) => (
            <PkgRow
              key={p._id || i}
              tracking={p.trackingNumber || `#PKG-${i + 1}`}
              client={p.client ? `${p.client.firstName || ''} ${p.client.lastName || ''}`.trim() || '—' : '—'}
              destination={p.destination || p.agency?.city || '—'}
              status={p.status || 'en attente'}
              date={p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : '—'}
              amount={packagePrice(p).amount}
              currency={packagePrice(p).currency}
            />
          )) : (
            <div style={{ padding: 40, textAlign: 'center', color: tk.muted, fontSize: 13 }}>
              Aucun colis trouvé
            </div>
          )}
          </div>
        </div>

        {/* ── PAYMENTS TABLE ── */}
        <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)', marginBottom: 24 }}>
          <SectionHeader
            icon={BanknotesIcon} title="Derniers paiements"
            action={
              <Link to="/app/payments" style={{ fontSize: 12, color: tk.accent, textDecoration: 'none', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                Voir tout <ChevronRightIcon style={{ width: 11, height: 11 }} />
              </Link>
            }
          />
          <div style={{ overflowX: 'auto' }}>
          <TableHead cols={{
            template: '2fr 1.5fr 90px 1fr',
            labels: ['Référence / Client', 'Montant', 'Statut', 'Date'],
          }} />
          {payments.length > 0 ? payments.slice(0, 6).map((p, i) => (
            <PayRow
              key={p._id || i}
              ref_={p.reference || p.trackingNumber || `#PAY-${i + 1}`}
              client={p.client ? `${p.client.firstName || ''} ${p.client.lastName || ''}`.trim() || '—' : '—'}
              amount={p.amount ?? 0}
              currency={p.currency}
              status={p.status || 'en attente de paiement'}
              date={p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : '—'}
            />
          )) : (
            <div style={{ padding: 40, textAlign: 'center', color: tk.muted, fontSize: 13 }}>
              Aucun paiement trouvé
            </div>
          )}
          </div>
        </div>

        {/* ── FLUX D'ACTIVITÉ TEMPS RÉEL ── */}
        <div style={{ background: tk.white, borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(23,47,80,.04)' }}>
          <SectionHeader
            icon={BellAlertIcon} title="Activité en temps réel"
            color={tk.purple}
            action={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 11, color: tk.emerald, fontWeight: 600,
                background: tk.emeraldSoft, padding: '3px 10px', borderRadius: 99 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: tk.emerald, animation: 'pulse 2s ease infinite' }} />
                Live
              </span>
            }
          />
          {activities.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: tk.muted, fontSize: 13 }}>
              Aucune activité récente
            </div>
          ) : (
            <div style={{ maxHeight: 480, overflowY: 'auto' }}>
              {activities.map((act) => {
                const typeMap: Record<string, { Icon: IconComponent; color: string; label: string }> = {
                  package_created:  { Icon: CubeIcon,           color: tk.accent,  label: 'Colis créé' },
                  package_status:   { Icon: TruckIcon,           color: tk.amber,   label: 'Statut colis' },
                  package_deleted:  { Icon: CubeIcon,           color: tk.rose,    label: 'Colis supprimé' },
                  payment_created:  { Icon: BanknotesIcon,      color: tk.emerald, label: 'Paiement' },
                  payment_updated:  { Icon: BanknotesIcon,      color: tk.emerald, label: 'Paiement encaissé' },
                  client_created:   { Icon: UserGroupIcon,      color: tk.purple,  label: 'Nouveau client' },
                  client_updated:   { Icon: UserGroupIcon,      color: tk.purple,  label: 'Client mis à jour' },
                  employee_created: { Icon: SparklesIcon,       color: tk.indigo,  label: 'Nouvel employé' },
                  agency_created:   { Icon: BuildingOfficeIcon, color: tk.indigo,  label: 'Agence créée' },
                  kilo_order:       { Icon: CubeIcon,           color: tk.amber,   label: 'Commande kilo' },
                  user_login:       { Icon: GlobeAltIcon,       color: tk.muted,   label: 'Connexion' },
                };
                const { Icon, color, label } = typeMap[act.type ?? ''] || { Icon: BellAlertIcon, color: tk.muted, label: act.type };
                const isNew = act._id === newActivityId;
                const ts = act.createdAt
                  ? new Date(act.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                  : '—';
                return (
                  <div key={act._id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    padding: '13px 20px',
                    borderBottom: `1px solid ${tk.border}`,
                    background: isNew ? `${color}09` : 'transparent',
                    transition: 'background .6s',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: `${color}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon style={{ width: 16, height: 16, color }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
                          letterSpacing: '.1em', color, background: `${color}18`,
                          padding: '2px 7px', borderRadius: 99 }}>{label}</span>
                        {isNew && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: tk.emerald,
                            background: tk.emeraldSoft, padding: '2px 7px', borderRadius: 99 }}>Nouveau</span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: tk.ink,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {act.title}
                      </p>
                      {act.description && (
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: tk.muted,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {act.description}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ margin: 0, fontSize: 11, color: tk.muted }}>{ts}</p>
                      {act.actor?.name && (
                        <p style={{ margin: '2px 0 0', fontSize: 11, color: tk.sec, fontWeight: 500 }}>
                          {act.actor.name}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;