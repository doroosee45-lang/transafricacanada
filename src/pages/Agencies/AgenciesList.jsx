





// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import {
// //   PlusIcon, PencilIcon, TrashIcon, SparklesIcon,
// //   BuildingOfficeIcon, MagnifyingGlassIcon, FunnelIcon,
// //   XMarkIcon, PhoneIcon, EnvelopeIcon, MapPinIcon,
// //   UserGroupIcon, CubeIcon,
// // } from '@heroicons/react/24/outline';
// // import { toast } from 'react-toastify';
// // import agencyService from '../../services/Agencyservice';
// // import Footer from '../../components/Layout/Footer';

// // /* ─────────────────────────────────────────────
// //    DESIGN TOKENS — identiques à AddPackage
// // ───────────────────────────────────────────── */
// // const tk = {
// //   ink:     '#171614',
// //   ink80:   '#26231e',
// //   surface: '#faf8f5',
// //   surf2:   '#f5efe6',
// //   border:  '#e9e1d5',
// //   accent:  '#a77b28',
// //   emerald: '#059669',
// //   amber:   '#d97706',
// //   rose:    '#dc2626',
// //   orange:  '#ea580c',
// //   textSec: '#4b5a6e',
// //   textMut: '#8494a9',
// // };

// // const inputStyle = {
// //   width: '100%', padding: '10px 14px', borderRadius: 10,
// //   background: '#fff', color: tk.ink, fontSize: 14,
// //   border: `1.5px solid ${tk.border}`, outline: 'none',
// //   fontFamily: "'DM Sans', sans-serif", transition: 'border .18s',
// // };

// // /* Status badge */
// // const StatusBadge = ({ status }) => {
// //   const active = status === 'actif';
// //   return (
// //     <span style={{
// //       display: 'inline-flex', alignItems: 'center', gap: 5,
// //       padding: '4px 12px', borderRadius: 99,
// //       background: active ? '#d1fae5' : '#fee2e2',
// //       color: active ? '#065f46' : '#991b1b',
// //       border: `1px solid ${active ? '#a7f3d0' : '#fecaca'}`,
// //       fontSize: 11, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
// //     }}>
// //       <span style={{ width: 5, height: 5, borderRadius: '50%', background: active ? '#10b981' : '#ef4444' }} />
// //       {active ? 'Actif' : 'Inactif'}
// //     </span>
// //   );
// // };

// // /* Section block header */
// // const SectionHeader = ({ icon: Icon, iconColor = tk.accent, title, badge, action }) => (
// //   <div style={{
// //     display: 'flex', alignItems: 'center', gap: 10,
// //     padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
// //   }}>
// //     <span style={{
// //       width: 30, height: 30, borderRadius: 8, background: '#fff',
// //       display: 'flex', alignItems: 'center', justifyContent: 'center',
// //       boxShadow: '0 1px 4px rgba(0,0,0,.08)',
// //     }}>
// //       <Icon style={{ width: 14, height: 14, color: iconColor }} />
// //     </span>
// //     <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", flex: 1 }}>
// //       {title}
// //     </span>
// //     {badge}
// //     {action}
// //   </div>
// // );

// // /* ─────────────────────────────────────────────
// //    MAIN COMPONENT
// // ───────────────────────────────────────────── */
// // const AgenciesList = () => {
// //   const [agencies, setAgencies] = useState([]);
// //   const [stats, setStats] = useState({});
// //   const [loading, setLoading] = useState(true);
// //   const [filters, setFilters] = useState({ search: '', country: '', status: '' });
// //   const navigate = useNavigate();

// //   useEffect(() => { fetchAgencies(); fetchStats(); }, [filters]);

// //   const fetchAgencies = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await agencyService.getAll(filters);
// //       setAgencies(res.data?.data || res.data || []);
// //     } catch { toast.error('Erreur lors du chargement des agences'); }
// //     finally { setLoading(false); }
// //   };

// //   const fetchStats = async () => {
// //     try {
// //       const res = await agencyService.getStats();
// //       setStats(res.data?.data || res.data || {});
// //     } catch { console.error('Error fetching stats'); }
// //   };

// //   const handleDelete = async (id) => {
// //     if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette agence ? Cette action est irréversible.')) return;
// //     try {
// //       await agencyService.delete(id);
// //       toast.success('Agence supprimée avec succès');
// //       fetchAgencies(); fetchStats();
// //     } catch (err) { toast.error(err.response?.data?.message || 'Erreur lors de la suppression'); }
// //   };

// //   const hasFilters = filters.search || filters.country || filters.status;

// //   return (
// //     <div style={{ minHeight: '100vh', background: tk.surface }}>

// //       {/* ─────────────── HERO ─────────────── */}
// //       <section style={{
// //         position: 'relative', height: 300,
// //         display: 'flex', flexDirection: 'column',
// //         alignItems: 'center', justifyContent: 'center',
// //         overflow: 'hidden',
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
// //             background: 'linear-gradient(135deg, rgba(23,22,20,.88) 0%, rgba(167,123,40,.55) 60%, rgba(23,22,20,.75) 100%)',
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
// //             <SparklesIcon style={{ width: 13, height: 13, color: '#ecd5a3' }} />
// //             <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
// //               Réseau d'agences
// //             </span>
// //           </div>

// //           <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
// //             Gérez vos{' '}
// //             <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
// //               agences
// //             </span>{' '}& succursales
// //           </h1>

// //           {/* Stats rapides dans le hero */}
// //           <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 24 }}>
// //             {[
// //               { val: stats.total || 0, label: 'Agences totales', color: '#fff' },
// //               { val: stats.active || 0, label: 'Actives', color: '#34d399' },
// //               { val: stats.totalEmployees || 0, label: 'Employés', color: '#ecd5a3' },
// //             ].map(({ val, label, color }, i) => (
// //               <div key={i} style={{ textAlign: 'center' }}>
// //                 <p style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'Open Sans',Arial,sans-serif", lineHeight: 1 }}>{val}</p>
// //                 <p style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginTop: 4 }}>{label}</p>
// //               </div>
// //             ))}
// //           </div>

// //           <button onClick={() => navigate('/app/agencies/add')} style={{
// //             display: 'inline-flex', alignItems: 'center', gap: 8,
// //             padding: '11px 24px', borderRadius: 12,
// //             background: tk.accent, color: '#fff', border: 'none',
// //             cursor: 'pointer', fontSize: 14, fontWeight: 600,
// //             fontFamily: "'Open Sans',Arial,sans-serif",
// //             boxShadow: '0 4px 20px rgba(167,123,40,.4)',
// //           }}>
// //             <PlusIcon style={{ width: 16, height: 16 }} /> Nouvelle agence
// //           </button>
// //         </div>

// //         <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
// //           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 50" style={{ width: '100%', display: 'block' }}>
// //             <path fill={tk.surface} d="M0,20L80,24C160,28,320,36,480,35C640,34,800,24,960,21C1120,18,1280,22,1360,24L1440,26L1440,50L0,50Z" />
// //           </svg>
// //         </div>
// //       </section>

// //       {/* ─────────────── CONTENU ─────────────── */}
// //       <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 48px' }}>

// //         {/* Filtres */}
// //         <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${tk.border}`, boxShadow: '0 2px 8px rgba(23,22,20,.05)', overflow: 'hidden', marginBottom: 24 }}>
// //           <SectionHeader
// //             icon={FunnelIcon}
// //             title="Filtres"
// //             action={hasFilters && (
// //               <button onClick={() => setFilters({ search: '', country: '', status: '' })} style={{
// //                 display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8,
// //                 background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.15)',
// //                 color: tk.rose, cursor: 'pointer', fontSize: 12, fontWeight: 500,
// //               }}>
// //                 <XMarkIcon style={{ width: 12, height: 12 }} /> Réinitialiser
// //               </button>
// //             )}
// //           />
// //           <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
// //             <div style={{ position: 'relative' }}>
// //               <MagnifyingGlassIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
// //               <input type="text" placeholder="Rechercher une agence..."
// //                 value={filters.search}
// //                 onChange={e => setFilters({ ...filters, search: e.target.value })}
// //                 style={{ ...inputStyle, paddingLeft: 38 }} />
// //             </div>
// //             <select value={filters.country} onChange={e => setFilters({ ...filters, country: e.target.value })} style={inputStyle}>
// //               <option value="">Tous les pays</option>
// //               <option value="Canada">Canada</option>
// //               <option value="RDC">RDC</option>
// //               <option value="Cameroun">Cameroun</option>
// //               <option value="Benin">Bénin</option>
// //             </select>
// //             <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} style={inputStyle}>
// //               <option value="">Tous les statuts</option>
// //               <option value="actif">Actif</option>
// //               <option value="inactif">Inactif</option>
// //             </select>
// //           </div>
// //         </div>

// //         {/* Header liste + bouton */}
// //         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
// //           <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
// //             <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
// //               Liste des agences
// //             </span>
// //             <span style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(167,123,40,.08)', color: tk.accent, fontSize: 11, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif" }}>
// //               {agencies.length} agence{agencies.length !== 1 ? 's' : ''}
// //             </span>
// //           </div>
// //         </div>

// //         {/* Grid de cards */}
// //         {loading ? (
// //           <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
// //             <div style={{ width: 44, height: 44, border: `3px solid ${tk.surf2}`, borderTop: `3px solid ${tk.accent}`, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
// //           </div>
// //         ) : agencies.length === 0 ? (
// //           <div style={{ textAlign: 'center', padding: '64px 0', color: tk.textMut, fontSize: 14 }}>
// //             Aucune agence trouvée avec ces filtres.
// //           </div>
// //         ) : (
// //           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
// //             {agencies.map((agency) => (
// //               <div
// //                 key={agency._id}
// //                 onClick={() => navigate(`/app/agencies/${agency._id}`)}
// //                 style={{
// //                   background: '#fff', borderRadius: 20,
// //                   border: `1.5px solid ${tk.border}`,
// //                   overflow: 'hidden', cursor: 'pointer',
// //                   boxShadow: '0 2px 8px rgba(23,22,20,.05)',
// //                   transition: 'box-shadow .2s, transform .2s',
// //                 }}
// //                 onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(23,22,20,.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
// //                 onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(23,22,20,.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
// //               >
// //                 {/* Photo */}
// //                 <div style={{ height: 180, background: tk.surface, position: 'relative', overflow: 'hidden' }}>
// //                   <img
// //                     src={agency.image || 'https://images.unsplash.com/photo-1486406146926-c627a392ad40?w=800&q=80'}
// //                     alt={agency.name}
// //                     style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }}
// //                     onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
// //                     onMouseLeave={e => e.target.style.transform = 'scale(1)'}
// //                   />
// //                   {/* Overlay gradient bas */}
// //                   <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(23,22,20,.5) 0%, transparent 50%)' }} />
// //                   <div style={{ position: 'absolute', top: 12, right: 12 }}>
// //                     <StatusBadge status={agency.status} />
// //                   </div>
// //                   {/* Nom sur l'image */}
// //                   <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
// //                     <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, fontFamily: "'Open Sans',Arial,sans-serif", lineHeight: 1.3 }}>{agency.name}</p>
// //                     {agency.code && (
// //                       <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 11, fontFamily: 'monospace', marginTop: 2 }}>#{agency.code}</p>
// //                     )}
// //                   </div>
// //                 </div>

// //                 {/* Infos */}
// //                 <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
// //                   {[
// //                     { icon: MapPinIcon, val: `${agency.address?.city || agency.city || '—'}, ${agency.address?.country || agency.country || ''}` },
// //                     { icon: PhoneIcon, val: agency.phone || '—' },
// //                     { icon: EnvelopeIcon, val: agency.email || '—' },
// //                   ].map(({ icon: Ic, val }, i) => (
// //                     <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
// //                       <Ic style={{ width: 13, height: 13, color: tk.textMut, flexShrink: 0 }} />
// //                       <span style={{ fontSize: 13, color: tk.textSec, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</span>
// //                     </div>
// //                   ))}

// //                   {agency.manager && (
// //                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0 0', borderTop: `1px solid ${tk.surface}`, marginTop: 4 }}>
// //                       <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(167,123,40,.1)', color: tk.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
// //                         {agency.manager.firstName?.[0]}{agency.manager.lastName?.[0]}
// //                       </div>
// //                       <span style={{ fontSize: 13, color: tk.textSec, fontWeight: 500 }}>
// //                         {agency.manager.firstName} {agency.manager.lastName}
// //                       </span>
// //                     </div>
// //                   )}
// //                 </div>

// //                 {/* Actions */}
// //                 <div style={{ padding: '10px 18px 14px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: `1px solid ${tk.border}` }}>
// //                   <button
// //                     onClick={e => { e.stopPropagation(); navigate(`/app/agencies/${agency._id}/edit`); }}
// //                     style={{
// //                       width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${tk.border}`,
// //                       background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
// //                       cursor: 'pointer', color: tk.accent, transition: 'all .15s',
// //                     }}
// //                     onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,123,40,.06)'; e.currentTarget.style.borderColor = tk.accent; }}
// //                     onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
// //                   >
// //                     <PencilIcon style={{ width: 14, height: 14 }} />
// //                   </button>
// //                   <button
// //                     onClick={e => { e.stopPropagation(); handleDelete(agency._id); }}
// //                     style={{
// //                       width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${tk.border}`,
// //                       background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
// //                       cursor: 'pointer', color: tk.rose, transition: 'all .15s',
// //                     }}
// //                     onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,.06)'; e.currentTarget.style.borderColor = tk.rose; }}
// //                     onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
// //                   >
// //                     <TrashIcon style={{ width: 14, height: 14 }} />
// //                   </button>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>

// //// //       <style>{`
// //         @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
// //         @keyframes spin { to { transform: rotate(360deg); } }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default AgenciesList;






// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   PlusIcon, PencilIcon, TrashIcon, SparklesIcon,
//   BuildingOfficeIcon, MagnifyingGlassIcon, FunnelIcon,
//   XMarkIcon, PhoneIcon, EnvelopeIcon, MapPinIcon,
//   UserGroupIcon, CubeIcon,
// } from '@heroicons/react/24/outline';
// import { toast } from 'react-toastify';
// import agencyService from '../../services/Agencyservice';
// import Footer from '../../components/Layout/Footer';

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
//   orange:  '#ea580c',
//   textSec: '#4b5a6e',
//   textMut: '#8494a9',
// };

// const inputStyle = {
//   width: '100%', padding: '10px 14px', borderRadius: 10,
//   background: '#fff', color: tk.ink, fontSize: 14,
//   border: `1.5px solid ${tk.border}`, outline: 'none',
//   fontFamily: "'DM Sans', sans-serif", transition: 'border .18s',
// };

// const StatusBadge = ({ status }) => {
//   const active = status === 'actif' || status === 'active' || status === true;
//   return (
//     <span style={{
//       display: 'inline-flex', alignItems: 'center', gap: 5,
//       padding: '4px 12px', borderRadius: 99,
//       background: active ? '#d1fae5' : '#fee2e2',
//       color: active ? '#065f46' : '#991b1b',
//       border: `1px solid ${active ? '#a7f3d0' : '#fecaca'}`,
//       fontSize: 11, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
//     }}>
//       <span style={{ width: 5, height: 5, borderRadius: '50%', background: active ? '#10b981' : '#ef4444' }} />
//       {active ? 'Actif' : 'Inactif'}
//     </span>
//   );
// };

// const SectionHeader = ({ icon: Icon, iconColor = tk.accent, title, badge, action }) => (
//   <div style={{
//     display: 'flex', alignItems: 'center', gap: 10,
//     padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
//   }}>
//     <span style={{
//       width: 30, height: 30, borderRadius: 8, background: '#fff',
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       boxShadow: '0 1px 4px rgba(0,0,0,.08)',
//     }}>
//       <Icon style={{ width: 14, height: 14, color: iconColor }} />
//     </span>
//     <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", flex: 1 }}>
//       {title}
//     </span>
//     {badge}
//     {action}
//   </div>
// );

// /* ─── Extraction universelle ─────────────────────────────────────────────── */
// const extractArray = (responseData, ...keys) => {
//   if (!responseData) return [];
//   if (Array.isArray(responseData)) return responseData;

//   const d = responseData;

//   // { data: [...] }
//   if (Array.isArray(d.data)) return d.data;

//   // { data: { agencies: [...] } }
//   if (d.data && typeof d.data === 'object') {
//     for (const k of [...keys, 'agencies', 'agences', 'items', 'docs', 'results']) {
//       if (Array.isArray(d.data[k])) return d.data[k];
//     }
//   }

//   // { agencies: [...] }
//   for (const k of [...keys, 'agencies', 'agences', 'items', 'docs', 'results']) {
//     if (Array.isArray(d[k])) return d[k];
//   }

//   return [];
// };

// const extractStats = (responseData) => {
//   if (!responseData) return {};
//   if (Array.isArray(responseData)) return {};
//   const d = responseData;
//   if (d.data && !Array.isArray(d.data)) return d.data;
//   return d;
// };

// const AgenciesList = () => {
//   const [agencies, setAgencies] = useState([]);
//   const [stats,    setStats]    = useState({});
//   const [loading,  setLoading]  = useState(true);
//   const [filters,  setFilters]  = useState({ search: '', country: '', status: '' });
//   const navigate = useNavigate();

//   useEffect(() => { fetchAgencies(); }, [filters]);
//   useEffect(() => { fetchStats(); }, []);

//   const fetchAgencies = async () => {
//     setLoading(true);
//     try {
//       const res = await agencyService.getAll(filters);
//       const list = extractArray(res.data);
//       setAgencies(list);
//     } catch (err) {
//       console.error('[AgenciesList] Erreur:', err);
//       toast.error('Erreur lors du chargement des agences');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const res = await agencyService.getStats();
//       const s = extractStats(res.data);
//       setStats(s);
//     } catch (err) {
//       console.error('[AgenciesList] Erreur stats:', err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette agence ?')) return;
//     try {
//       await agencyService.delete(id);
//       toast.success('Agence supprimée avec succès');
//       fetchAgencies(); fetchStats();
//     } catch (err) { toast.error(err.response?.data?.message || 'Erreur lors de la suppression'); }
//   };

//   /* Extraire les infos d'une agence de façon robuste */
//   const getCity = (a) =>
//     a.city || a.ville || a.address?.city || a.location?.city || a.location || '—';

//   const getCountry = (a) =>
//     a.country || a.pays || a.address?.country || '';

//   const getRevenue = (a) => {
//     const v = a.revenue ?? a.totalRevenue ?? a.chiffreAffaires ?? null;
//     if (v == null) return null;
//     return Number(v).toLocaleString('fr-FR') + ' €';
//   };

//   const getPackages = (a) =>
//     a.packagesCount ?? a.packages ?? a.totalPackages ?? a.colisCount ?? 0;

//   const getEmployees = (a) =>
//     a.employeesCount ?? a.employees ?? a.employeCount ?? a.agentsCount ?? 0;

//   const isActive = (a) =>
//     a.isActive !== false && a.status !== 'inactif' && a.status !== 'inactive' && a.actif !== false;

//   const hasFilters = filters.search || filters.country || filters.status;

//   return (
//     <div style={{ minHeight: '100vh', background: tk.surface }}>

//       {/* ── Hero ── */}
//       <section style={{
//         position: 'relative', height: 300,
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
//               Réseau d'agences
//             </span>
//           </div>

//           <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
//             Gérez vos{' '}
//             <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
//               agences
//             </span>{' '}& succursales
//           </h1>

//           {/* Stats rapides */}
//           <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 24, flexWrap: 'wrap' }}>
//             {[
//               { val: stats.total     ?? stats.totalAgencies ?? agencies.length, label: 'Agences totales',   color: '#fff'    },
//               { val: stats.active    ?? stats.activeAgencies ?? agencies.filter(a => isActive(a)).length, label: 'Actives', color: '#34d399' },
//               { val: stats.totalEmployees ?? stats.employees ?? agencies.reduce((s, a) => s + getEmployees(a), 0), label: 'Employés', color: '#ecd5a3' },
//             ].map(({ val, label, color }, i) => (
//               <div key={i} style={{ textAlign: 'center', minWidth: 80 }}>
//                 <p style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "'Open Sans',Arial,sans-serif", lineHeight: 1 }}>{val}</p>
//                 <p style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', marginTop: 4 }}>{label}</p>
//               </div>
//             ))}
//           </div>

//           <button onClick={() => navigate('/app/agencies/add')} style={{
//             display: 'inline-flex', alignItems: 'center', gap: 8,
//             padding: '11px 24px', borderRadius: 12,
//             background: tk.accent, color: '#fff', border: 'none',
//             cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
//             boxShadow: '0 4px 20px rgba(167,123,40,.4)',
//           }}>
//             <PlusIcon style={{ width: 16, height: 16 }} /> Nouvelle agence
//           </button>
//         </div>

//         <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 50" style={{ width: '100%', display: 'block' }}>
//             <path fill={tk.surface} d="M0,20L80,24C160,28,320,36,480,35C640,34,800,24,960,21C1120,18,1280,22,1360,24L1440,26L1440,50L0,50Z" />
//           </svg>
//         </div>
//       </section>

//       <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 48px' }}>

//         {/* ── Filtres ── */}
//         <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${tk.border}`, boxShadow: '0 2px 8px rgba(23,22,20,.05)', overflow: 'hidden', marginBottom: 24 }}>
//           <SectionHeader
//             icon={FunnelIcon} title="Filtres"
//             action={hasFilters && (
//               <button onClick={() => setFilters({ search: '', country: '', status: '' })} style={{
//                 display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8,
//                 background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.15)',
//                 color: tk.rose, cursor: 'pointer', fontSize: 12, fontWeight: 500,
//               }}>
//                 <XMarkIcon style={{ width: 12, height: 12 }} /> Réinitialiser
//               </button>
//             )}
//           />
//           <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
//             <div style={{ position: 'relative' }}>
//               <MagnifyingGlassIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
//               <input type="text" placeholder="Rechercher une agence..."
//                 value={filters.search}
//                 onChange={e => setFilters({ ...filters, search: e.target.value })}
//                 style={{ ...inputStyle, paddingLeft: 38 }} />
//             </div>
//             <select value={filters.country} onChange={e => setFilters({ ...filters, country: e.target.value })} style={inputStyle}>
//               <option value="">Tous les pays</option>
//               <option value="Canada">Canada</option>
//               <option value="RDC">RDC</option>
//               <option value="Cameroun">Cameroun</option>
//               <option value="Benin">Bénin</option>
//               <option value="France">France</option>
//               <option value="Belgique">Belgique</option>
//             </select>
//             <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} style={inputStyle}>
//               <option value="">Tous les statuts</option>
//               <option value="actif">Actif</option>
//               <option value="inactif">Inactif</option>
//             </select>
//           </div>
//         </div>

//         {/* ── Header liste ── */}
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//             <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
//               Liste des agences
//             </span>
//             <span style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(167,123,40,.08)', color: tk.accent, fontSize: 11, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif" }}>
//               {agencies.length} agence{agencies.length !== 1 ? 's' : ''}
//             </span>
//           </div>
//           <button onClick={() => navigate('/app/agencies/add')} style={{
//             display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
//             borderRadius: 10, background: tk.accent, color: '#fff', border: 'none',
//             cursor: 'pointer', fontSize: 13, fontWeight: 600,
//           }}>
//             <PlusIcon style={{ width: 14, height: 14 }} /> Nouvelle agence
//           </button>
//         </div>

//         {/* ── Grid ── */}
//         {loading ? (
//           <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
//             <div style={{ width: 44, height: 44, border: `3px solid ${tk.surf2}`, borderTop: `3px solid ${tk.accent}`, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
//           </div>
//         ) : agencies.length === 0 ? (
//           <div style={{ textAlign: 'center', padding: '64px 0', color: tk.textMut, fontSize: 14 }}>
//             Aucune agence trouvée{hasFilters ? ' avec ces filtres' : ''}.
//           </div>
//         ) : (
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
//             {agencies.map((agency) => (
//               <div
//                 key={agency._id}
//                 onClick={() => navigate(`/app/agencies/${agency._id}`)}
//                 style={{
//                   background: '#fff', borderRadius: 20, border: `1.5px solid ${tk.border}`,
//                   overflow: 'hidden', cursor: 'pointer',
//                   boxShadow: '0 2px 8px rgba(23,22,20,.05)',
//                   transition: 'box-shadow .2s, transform .2s',
//                 }}
//                 onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(23,22,20,.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
//                 onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(23,22,20,.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
//               >
//                 {/* Photo */}
//                 <div style={{ height: 180, background: tk.surface, position: 'relative', overflow: 'hidden' }}>
//                   <img
//                     src={agency.image || agency.photo || agency.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a392ad40?w=800&q=80'}
//                     alt={agency.name || agency.nom || 'Agence'}
//                     style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }}
//                     onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
//                     onMouseLeave={e => e.target.style.transform = 'scale(1)'}
//                   />
//                   <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(23,22,20,.5) 0%, transparent 50%)' }} />
//                   <div style={{ position: 'absolute', top: 12, right: 12 }}>
//                     <StatusBadge status={agency.status ?? (agency.isActive !== false ? 'actif' : 'inactif')} />
//                   </div>
//                   <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
//                     <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, fontFamily: "'Open Sans',Arial,sans-serif", lineHeight: 1.3 }}>
//                       {agency.name || agency.nom || 'Agence sans nom'}
//                     </p>
//                     {(agency.code || agency.reference) && (
//                       <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 11, fontFamily: 'monospace', marginTop: 2 }}>
//                         #{agency.code || agency.reference}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Infos */}
//                 <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
//                   {[
//                     { icon: MapPinIcon, val: [getCity(agency), getCountry(agency)].filter(Boolean).join(', ') || '—' },
//                     { icon: PhoneIcon,  val: agency.phone  || agency.telephone || agency.tel  || '—' },
//                     { icon: EnvelopeIcon,val:agency.email  || agency.mail                       || '—' },
//                   ].map(({ icon: Ic, val }, i) => (
//                     <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                       <Ic style={{ width: 13, height: 13, color: tk.textMut, flexShrink: 0 }} />
//                       <span style={{ fontSize: 13, color: tk.textSec, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</span>
//                     </div>
//                   ))}

//                   {/* Statistiques agence */}
//                   <div style={{ display: 'flex', gap: 12, marginTop: 4, paddingTop: 8, borderTop: `1px solid ${tk.surface}` }}>
//                     <div style={{ flex: 1, textAlign: 'center', background: 'rgba(167,123,40,.06)', borderRadius: 10, padding: '7px 4px' }}>
//                       <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: tk.accent, fontFamily: "'Open Sans',Arial,sans-serif" }}>{getPackages(agency)}</p>
//                       <p style={{ margin: '2px 0 0', fontSize: 10, color: tk.textMut }}>Colis</p>
//                     </div>
//                     <div style={{ flex: 1, textAlign: 'center', background: 'rgba(5,150,105,.06)', borderRadius: 10, padding: '7px 4px' }}>
//                       <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: tk.emerald, fontFamily: "'Open Sans',Arial,sans-serif" }}>
//                         {getRevenue(agency) ?? '—'}
//                       </p>
//                       <p style={{ margin: '2px 0 0', fontSize: 10, color: tk.textMut }}>Revenus</p>
//                     </div>
//                     {getEmployees(agency) > 0 && (
//                       <div style={{ flex: 1, textAlign: 'center', background: 'rgba(124,58,237,.06)', borderRadius: 10, padding: '7px 4px' }}>
//                         <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#7c3aed', fontFamily: "'Open Sans',Arial,sans-serif" }}>{getEmployees(agency)}</p>
//                         <p style={{ margin: '2px 0 0', fontSize: 10, color: tk.textMut }}>Agents</p>
//                       </div>
//                     )}
//                   </div>

//                   {(agency.manager || agency.responsable) && (() => {
//                     const m = agency.manager || agency.responsable;
//                     const fn = typeof m === 'string' ? m : `${m.firstName ?? m.prenom ?? ''} ${m.lastName ?? m.nom ?? ''}`.trim();
//                     if (!fn) return null;
//                     return (
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4 }}>
//                         <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(167,123,40,.1)', color: tk.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
//                           {fn.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
//                         </div>
//                         <span style={{ fontSize: 13, color: tk.textSec, fontWeight: 500 }}>{fn}</span>
//                       </div>
//                     );
//                   })()}
//                 </div>

//                 {/* Actions */}
//                 <div style={{ padding: '10px 18px 14px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: `1px solid ${tk.border}` }}>
//                   <button
//                     onClick={e => { e.stopPropagation(); navigate(`/app/agencies/${agency._id}/edit`); }}
//                     style={{
//                       width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${tk.border}`,
//                       background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       cursor: 'pointer', color: tk.accent, transition: 'all .15s',
//                     }}
//                     onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,123,40,.06)'; e.currentTarget.style.borderColor = tk.accent; }}
//                     onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
//                     title="Modifier"
//                   >
//                     <PencilIcon style={{ width: 14, height: 14 }} />
//                   </button>
//                   <button
//                     onClick={e => { e.stopPropagation(); handleDelete(agency._id); }}
//                     style={{
//                       width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${tk.border}`,
//                       background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       cursor: 'pointer', color: tk.rose, transition: 'all .15s',
//                     }}
//                     onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,.06)'; e.currentTarget.style.borderColor = tk.rose; }}
//                     onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
//                     title="Supprimer"
//                   >
//                     <TrashIcon style={{ width: 14, height: 14 }} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

////       <style>{`
//         @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}</style>
//     </div>
//   );
// };

// export default AgenciesList;





import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon, PencilIcon, TrashIcon, SparklesIcon,
  BuildingOfficeIcon, MagnifyingGlassIcon, FunnelIcon,
  XMarkIcon, PhoneIcon, EnvelopeIcon, MapPinIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import agencyService, { photoUrl } from '../../services/Agencyservice';
import { COUNTRY_OPTIONS, getCurrency, formatMoney } from '../../config/currencies';

const tk = {
  ink: '#171614', surface: '#faf8f5', surf2: '#f5efe6',
  border: '#e9e1d5', accent: '#a77b28', emerald: '#059669',
  amber: '#d97706', rose: '#dc2626', textSec: '#4b5a6e', textMut: '#8494a9',
};

/* ── Helper universel ── */
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

const StatusBadge = ({ status }) => {
  const active = status === 'actif' || status === true || status === 'active';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 12px', borderRadius: 99,
      background: active ? '#d1fae5' : '#fee2e2',
      color: active ? '#065f46' : '#991b1b',
      border: `1px solid ${active ? '#a7f3d0' : '#fecaca'}`,
      fontSize: 11, fontWeight: 600,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: active ? '#10b981' : '#ef4444' }} />
      {active ? 'Actif' : 'Inactif'}
    </span>
  );
};

const AgenciesList = () => {
  const [agencies, setAgencies] = useState([]);
  const [stats,    setStats]    = useState({});
  const [loading,  setLoading]  = useState(true);
  const [filters,  setFilters]  = useState({ search: '', country: '', status: '' });
  const navigate = useNavigate();

  const debounceRef = useRef(null);
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { fetchAgencies(); }, 400);
    return () => clearTimeout(debounceRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);
  useEffect(() => { fetchStats(); }, []);

  const fetchAgencies = async () => {
    setLoading(true);
    try {
      const res = await agencyService.getAll(filters);
      // ✅ Extraction robuste
      const list = extractArray(res, 'agencies', 'items', 'agences', 'data');
      setAgencies(list);
    } catch (err) {
      console.error('fetchAgencies error:', err);
      toast.error('Erreur lors du chargement des agences');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await agencyService.getStats();
      setStats(extractObj(res));
    } catch {
      console.warn('Agency stats endpoint unavailable');
    }
  };

  // Stats calculées depuis la liste si endpoint absent
  const computedStats = {
    total:  stats.total  ?? agencies.length,
    active: stats.active ?? agencies.filter(a => a.status === 'actif' || a.isActive === true).length,
    totalEmployees: stats.totalEmployees ?? agencies.reduce((s, a) => s + Number(a.employeesCount || a.employees?.length || 0), 0),
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette agence ?')) return;
    try {
      await agencyService.delete(id);
      toast.success('Agence supprimée avec succès');
      fetchAgencies();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const hasFilters = Object.values(filters).some(v => v !== '');

  return (
    <div style={{ minHeight: '100vh', background: tk.surface }}>

      {/* ── Hero ── */}
      <section className="easy-internal-header" style={{ position: 'relative', height: 300, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#37312a', padding: '0 24px', maxWidth: 640 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 99, padding: '6px 16px', marginBottom: 18 }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#ecd5a3' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase' }}>Réseau d'agences</span>
          </div>

          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            Gérez vos{' '}
            <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              agences
            </span>{' '}& succursales
          </h1>

          {/* Stats hero */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 24 }}>
            {[
              { val: computedStats.total,          label: 'Agences totales', color: '#fff' },
              { val: computedStats.active,          label: 'Actives',         color: '#34d399' },
              { val: computedStats.totalEmployees,  label: 'Employés',        color: '#ecd5a3' },
            ].map(({ val, label, color }, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{val}</p>
                <p style={{ fontSize: 12, color: '#37312a', marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>

          <button onClick={() => navigate('/app/agencies/add')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', borderRadius: 12, background: tk.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 20px rgba(167,123,40,.4)' }}>
            <PlusIcon style={{ width: 16, height: 16 }} /> Nouvelle agence
          </button>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 48px' }}>

        {/* Filtres */}
        <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FunnelIcon style={{ width: 14, height: 14, color: tk.accent }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut }}>Filtres</span>
            </div>
            {hasFilters && (
              <button onClick={() => setFilters({ search: '', country: '', status: '' })} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.15)', color: tk.rose, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>
                <XMarkIcon style={{ width: 12, height: 12 }} /> Réinitialiser
              </button>
            )}
          </div>
          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <MagnifyingGlassIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
              <input type="text" placeholder="Rechercher une agence…" value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                style={{ ...inputStyle, paddingLeft: 38 }} />
            </div>
            <select value={filters.country} onChange={e => setFilters({ ...filters, country: e.target.value })} style={inputStyle}>
              <option value="">Tous les pays</option>
              {/* Liste issue de la configuration centrale : 4 marchés + corridors historiques. */}
              {COUNTRY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} style={inputStyle}>
              <option value="">Tous les statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
        </div>

        {/* Header liste */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BuildingOfficeIcon style={{ width: 16, height: 16, color: tk.accent }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.textMut }}>
              Liste des agences
            </span>
            <span style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(167,123,40,.08)', color: tk.accent, fontSize: 11, fontWeight: 700 }}>
              {agencies.length} agence{agencies.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button onClick={() => navigate('/app/agencies/add')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 10, background: tk.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            <PlusIcon style={{ width: 14, height: 14 }} /> Nouvelle agence
          </button>
        </div>

        {/* Grid de cards */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
            <div style={{ width: 44, height: 44, border: `3px solid ${tk.surf2}`, borderTop: `3px solid ${tk.accent}`, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
          </div>
        ) : agencies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <BuildingOfficeIcon style={{ width: 48, height: 48, color: tk.border, marginBottom: 12 }} />
            <p style={{ color: tk.textMut, fontSize: 14 }}>Aucune agence trouvée</p>
            <button onClick={() => navigate('/app/agencies/add')} style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 10, background: tk.accent, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              <PlusIcon style={{ width: 14, height: 14 }} /> Créer une agence
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {agencies.map((agency) => (
              <div
                key={agency._id}
                onClick={() => navigate(`/app/agencies/${agency._id}`)}
                style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${tk.border}`, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 2px 8px rgba(23,22,20,.05)', transition: 'box-shadow .2s,transform .2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(23,22,20,.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(23,22,20,.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {/* Image */}
                <div style={{ height: 180, background: tk.surface, position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={
                      agency.photo
                        ? photoUrl(agency.photo)
                        : agency.image || 'https://images.unsplash.com/photo-1486406146926-c627a392ad40?w=800&q=80'
                    }
                    alt={agency.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(23,22,20,.5) 0%,transparent 50%)' }} />
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <StatusBadge status={agency.status || agency.isActive} />
                  </div>
                  <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, lineHeight: 1.3 }}>{agency.name}</p>
                    {agency.code && <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 11, fontFamily: 'monospace', marginTop: 2 }}>#{agency.code}</p>}
                  </div>
                </div>

                {/* Infos */}
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { Icon: MapPinIcon, val: [agency.address?.city, agency.city, agency.address?.country, agency.country].filter(Boolean).join(', ') || '—' },
                    { Icon: PhoneIcon,  val: agency.phone || '—' },
                    { Icon: EnvelopeIcon, val: agency.email || '—' },
                  ].map(({ Icon, val }, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon style={{ width: 13, height: 13, color: tk.textMut, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: tk.textSec, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{val}</span>
                    </div>
                  ))}

                  {/* Stats agence */}
                  <div style={{ display: 'flex', gap: 16, marginTop: 4, paddingTop: 8, borderTop: `1px solid ${tk.surface}` }}>
                    {[
                      { label: 'Colis', val: agency.packagesCount ?? agency.packages ?? '—' },
                      { label: 'Revenus', val: agency.revenue != null ? formatMoney(agency.revenue, getCurrency(agency.address?.country)?.code) : '—' },
                    ].map(({ label, val }) => (
                      <div key={label}>
                        <p style={{ fontSize: 10, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: tk.ink }}>{val}</p>
                      </div>
                    ))}
                    {agency.manager && (
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(167,123,40,.1)', color: tk.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>
                          {agency.manager.firstName?.[0]}{agency.manager.lastName?.[0]}
                        </div>
                        <span style={{ fontSize: 12, color: tk.textSec }}>{agency.manager.firstName} {agency.manager.lastName}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ padding: '10px 18px 14px', display: 'flex', justifyContent: 'flex-end', gap: 8, borderTop: `1px solid ${tk.border}` }}>
                  <button onClick={e => { e.stopPropagation(); navigate(`/app/agencies/${agency._id}/edit`); }}
                    style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${tk.border}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: tk.accent, transition: 'all .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,123,40,.06)'; e.currentTarget.style.borderColor = tk.accent; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}>
                    <PencilIcon style={{ width: 14, height: 14 }} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); handleDelete(agency._id); }}
                    style={{ width: 34, height: 34, borderRadius: 9, border: `1.5px solid ${tk.border}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: tk.rose, transition: 'all .15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,.06)'; e.currentTarget.style.borderColor = tk.rose; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}>
                    <TrashIcon style={{ width: 14, height: 14 }} />
                  </button>
                </div>
              </div>
            ))}
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

export default AgenciesList;
