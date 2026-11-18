// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   PlusIcon,
//   ShoppingBagIcon,
//   StarIcon,
//   SparklesIcon,
//   MagnifyingGlassIcon,
//   FunnelIcon,
//   XMarkIcon,
//   AdjustmentsHorizontalIcon,
//   ExclamationTriangleIcon,
//   ArrowPathIcon,
// } from '@heroicons/react/24/outline';
// import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
// import axios from '../../api/axios';
// import Footer from '../../components/Layout/Footer';

// /* ─────────────────────────────────────────────
//    DESIGN TOKENS
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

// /* Image helper — gère base64, http, URL relative */
// const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
// const imgSrc = (img) => {
//   if (!img) return null;
//   if (typeof img === 'string') {
//     if (img.startsWith('data:') || img.startsWith('http') || img.startsWith('blob:')) return img;
//     return `${API_BASE}${img}`;
//   }
//   if (img?.url) {
//     if (img.url.startsWith('data:') || img.url.startsWith('http') || img.url.startsWith('blob:')) return img.url;
//     return `${API_BASE}${img.url}`;
//   }
//   return null;
// };

// /* ── Responsive CSS ── */
// const STYLES = `
//   @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
//   @keyframes spin       { to   { transform: rotate(360deg); } }
//   @keyframes fadeUp     { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

//   /* ── Hero ── */
//   .mkt-hero { height: 300px; }
//   @media (max-width: 639px) { .mkt-hero { height: 220px; } }

//   /* ── Content padding ── */
//   .mkt-content { max-width: 1280px; margin: 0 auto; padding: 28px 20px 48px; }
//   @media (max-width: 639px) { .mkt-content { padding: 16px 12px 40px; } }

//   /* ── Filters grid ── */
//   .mkt-filters-grid {
//     padding: 14px 16px;
//     display: grid;
//     grid-template-columns: 1fr 1fr 1fr;
//     gap: 10px;
//   }
//   .mkt-filters-search { grid-column: 1 / -1; }
//   @media (max-width: 767px) {
//     .mkt-filters-grid {
//       grid-template-columns: 1fr 1fr;
//     }
//     .mkt-filters-search { grid-column: 1 / -1; }
//     .mkt-filters-price  { display: none; }
//   }
//   @media (max-width: 479px) {
//     .mkt-filters-grid {
//       grid-template-columns: 1fr;
//       gap: 8px;
//     }
//     .mkt-filters-hide-xs { display: none; }
//   }

//   /* ── Filters toggle btn (mobile) ── */
//   .mkt-filter-toggle {
//     display: none;
//     align-items: center; gap: 6px;
//     padding: 7px 14px; border-radius: 8px;
//     background: rgba(167,123,40,.08); border: 1.5px solid rgba(167,123,40,.18);
//     font-size: 12px; font-weight: 600; color: #a77b28;
//     cursor: pointer; margin-left: auto;
//   }
//   @media (max-width: 639px) { .mkt-filter-toggle { display: flex; } }

//   /* ── Filters panel (mobile collapse) ── */
//   .mkt-filters-panel { display: block; }
//   .mkt-filters-panel.hidden { display: none; }

//   /* ══ PRODUCTS GRID ══ */
//   .mkt-grid {
//     display: grid;
//     grid-template-columns: repeat(4, 1fr);
//     gap: 18px;
//   }
//   @media (max-width: 1023px) { .mkt-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; } }
//   @media (max-width: 767px)  { .mkt-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
//   /* ▼ Mobile : 1 colonne, cartes horizontales */
//   @media (max-width: 599px)  { .mkt-grid { grid-template-columns: 1fr; gap: 10px; } }

//   /* ══ CARD — layout vertical (desktop/tablet) ══ */
//   .mkt-card {
//     background: #fff;
//     border-radius: 16px;
//     border: 1.5px solid #e9e1d5;
//     overflow: hidden;
//     cursor: pointer;
//     transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
//     animation: fadeUp .3s ease both;
//     display: flex;
//     flex-direction: column;
//   }
//   .mkt-card:hover {
//     transform: translateY(-4px);
//     box-shadow: 0 12px 28px rgba(0,0,0,.09);
//     border-color: #a77b28;
//   }

//   /* ▼ Mobile : carte horizontale (image gauche + infos droite) */
//   @media (max-width: 599px) {
//     .mkt-card {
//       flex-direction: row;
//       align-items: stretch;
//       border-radius: 14px;
//     }
//     .mkt-card:hover { transform: none; box-shadow: 0 4px 16px rgba(0,0,0,.07); }

//     /* Image container — carré fixe à gauche */
//     .mkt-card-img {
//       width: 110px !important;
//       min-width: 110px !important;
//       aspect-ratio: auto !important;
//       height: auto !important;
//       align-self: stretch;
//       flex-shrink: 0;
//     }
//     .mkt-card-img > img,
//     .mkt-card-img > div {
//       width: 100% !important;
//       height: 100% !important;
//       border-radius: 0 !important;
//     }

//     /* Badges repositionnés */
//     .mkt-badge-featured { top: 8px !important; left: 8px !important; font-size: 8px !important; padding: 2px 7px !important; }
//     .mkt-badge-discount  { top: 8px !important; right: 8px !important; font-size: 8px !important; padding: 2px 6px !important; }

//     /* Body — prend le reste */
//     .mkt-card-body {
//       flex: 1;
//       padding: 12px 14px !important;
//       display: flex;
//       flex-direction: column;
//       justify-content: center;
//       min-width: 0;
//     }
//   }

//   /* ══ CARD IMAGE container ══ */
//   .mkt-card-img {
//     aspect-ratio: 1/1;
//     background: #f5efe6;
//     position: relative;
//     overflow: hidden;
//     flex-shrink: 0;
//   }

//   /* ══ CARD BODY ══ */
//   .mkt-card-body { padding: 14px; }

//   /* ══ CARD TITLE ══ */
//   .mkt-card-title {
//     font-size: 14px; font-weight: 600; color: #171614;
//     margin-bottom: 6px; line-height: 1.4;
//     display: -webkit-box; -webkit-line-clamp: 2;
//     -webkit-box-orient: vertical; overflow: hidden;
//   }
//   @media (max-width: 599px) {
//     .mkt-card-title { font-size: 13px; -webkit-line-clamp: 2; margin-bottom: 4px; min-height: unset; }
//   }

//   /* ══ CARD PRICE ══ */
//   .mkt-card-price { font-size: 20px; font-weight: 800; color: #a77b28; }
//   @media (max-width: 599px) { .mkt-card-price { font-size: 18px; } }

//   /* ══ Stars ══ */
//   .mkt-stars { display: flex; align-items: center; gap: 3px; margin-bottom: 7px; }
//   @media (max-width: 599px) { .mkt-stars { margin-bottom: 5px; } }

//   /* ══ Meta row ══ */
//   .mkt-meta { display: flex; justify-content: space-between; font-size: 11px; color: #8494a9; }
//   @media (max-width: 599px) { .mkt-meta { font-size: 10px; } }

//   /* ══ Seller ══ */
//   .mkt-seller { font-size: 11px; color: #8494a9; margin-top: 5px; }
//   @media (max-width: 599px) { .mkt-seller { display: none; } }

//   /* ══ Condition badge (mobile only) ══ */
//   .mkt-condition-badge { display: none; }
//   @media (max-width: 599px) {
//     .mkt-condition-badge {
//       display: inline-flex; align-items: center;
//       margin-top: 6px;
//       padding: 3px 9px; border-radius: 99px;
//       background: rgba(5,150,105,.08); color: #059669;
//       font-size: 10px; font-weight: 600;
//       text-transform: capitalize;
//     }
//   }

//   /* ══ Section label ══ */
//   .mkt-section-label {
//     font-size: 10px; font-weight: 700; letter-spacing: .12em;
//     text-transform: uppercase; color: #8494a9; font-family: 'Open Sans',Arial,sans-serif;
//   }

//   /* ══ Badge count ══ */
//   .mkt-badge-count {
//     padding: 3px 10px; border-radius: 99px;
//     background: rgba(167,123,40,.08); color: #a77b28;
//     font-size: 11px; font-weight: 700; font-family: 'Open Sans',Arial,sans-serif;
//   }

//   /* ══ Input ══ */
//   .mkt-input {
//     width: 100%; padding: 9px 13px; border-radius: 10px;
//     background: #fff; color: #171614; font-size: 13px;
//     border: 1.5px solid #e9e1d5; outline: none;
//     font-family: 'DM Sans', sans-serif; transition: border .18s;
//     box-sizing: border-box;
//   }
//   .mkt-input:focus { border-color: #a77b28; }
// `;

// const ProductsList = () => {
//   const [products, setProducts]       = useState([]);
//   const [categories, setCategories]   = useState([]);
//   const [loading, setLoading]         = useState(true);
//   const [loadError, setLoadError]     = useState(false);
//   const [retryKey, setRetryKey]       = useState(0);
//   const [showFilters, setShowFilters] = useState(false);

//   /* ── Champ texte séparé pour le debounce ── */
//   const [searchInput, setSearchInput] = useState('');

//   /* ── Filtres actifs (envoyés à l'API) ── */
//   const [filters, setFilters] = useState({
//     search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest',
//   });

//   const navigate = useNavigate();
//   const isMounted = React.useRef(false);
//   const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.sort !== 'newest';

//   useEffect(() => { isMounted.current = true; }, []);

//   /* ── 1. Debounce : synchronise searchInput → filters.search après 400 ms ── */
//   useEffect(() => {
//     if (!isMounted.current) return;
//     const t = setTimeout(() => {
//       setFilters(prev => ({ ...prev, search: searchInput }));
//     }, 400);
//     return () => clearTimeout(t);
//   }, [searchInput]);

//   /* ── 2. Fetch produits avec AbortController (annule si re-rendu rapide) ── */
//   useEffect(() => {
//     const controller = new AbortController();

//     const load = async () => {
//       setLoading(true);
//       setLoadError(false);
//       try {
//         const params = new URLSearchParams({
//           ...(filters.search   && { search:   filters.search }),
//           ...(filters.category && { category: filters.category }),
//         }).toString();

//         const response = await axios.get(
//           `/marketplace/products${params ? `?${params}` : ''}`,
//           { signal: controller.signal }
//         );
//         const data = response.data?.data || response.data || [];
//         setProducts(Array.isArray(data) ? data : []);
//         setLoadError(false);
//       } catch (err) {
//         // Ignorer annulations et redirections auth (l'intercepteur gère le redirect)
//         if (
//           controller.signal.aborted ||
//           err?.code === 'ERR_CANCELED' ||
//           err?.name === 'CanceledError' ||
//           err?.name === 'AbortError' ||
//           err?.message === 'canceled' ||
//           err?.response?.status === 401
//         ) return;
//         setLoadError(true);
//         setProducts([]);
//       } finally {
//         if (!controller.signal.aborted) setLoading(false);
//       }
//     };

//     load();
//     return () => controller.abort();
//   }, [filters, retryKey]);

//   /* ── 3. Fetch catégories — une seule fois au montage ── */
//   useEffect(() => {
//     axios.get('/marketplace/categories')
//       .then(res => setCategories(res.data?.data || res.data || []))
//       .catch(() => setCategories([]));
//   }, []);                                   // ← [] = montage uniquement

//   const resetFilters = () => {
//     setSearchInput('');
//     setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest' });
//   };

//   /* ── Product card ── */
//   const ProductCard = ({ product, idx }) => {
//     const thumb = imgSrc(product.images?.[0]);
//     const discount = product.originalPrice && product.price
//       ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

//     return (
//       <div
//         className="mkt-card"
//         onClick={() => navigate(`/app/marketplace/products/${product._id}`)}
//         style={{ animationDelay: `${Math.min(idx * 40, 300)}ms` }}
//       >
//         {/* ── Image ── */}
//         <div className="mkt-card-img">
//           {thumb ? (
//             <img
//               src={thumb}
//               alt={product.title}
//               style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }}
//               onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
//               onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
//             />
//           ) : (
//             <div style={{
//               width: '100%', height: '100%',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               background: tk.surf2,
//             }}>
//               <ShoppingBagIcon style={{ width: 36, height: 36, color: tk.textMut }} />
//             </div>
//           )}

//           {/* Badges */}
//           {product.featured && (
//             <span className="mkt-badge-featured" style={{
//               position: 'absolute', top: 8, left: 8,
//               background: tk.amber, color: '#fff',
//               fontSize: 9, padding: '3px 9px', borderRadius: 99,
//               fontWeight: 700, textTransform: 'uppercase',
//             }}>
//               Vedette
//             </span>
//           )}
//           {discount > 0 && (
//             <span className="mkt-badge-discount" style={{
//               position: 'absolute', top: 8, right: 8,
//               background: tk.rose, color: '#fff',
//               fontSize: 9, padding: '3px 8px', borderRadius: 99, fontWeight: 700,
//             }}>
//               -{discount}%
//             </span>
//           )}
//         </div>

//         {/* ── Body ── */}
//         <div className="mkt-card-body">
//           <h3 className="mkt-card-title">{product.title}</h3>

//           {/* Étoiles */}
//           <div className="mkt-stars">
//             {[...Array(5)].map((_, i) =>
//               i < Math.floor(product.rating || 0)
//                 ? <StarIconSolid key={i} style={{ width: 12, height: 12, color: '#fbbf24' }} />
//                 : <StarIcon      key={i} style={{ width: 12, height: 12, color: tk.border }} />
//             )}
//             <span style={{ fontSize: 10, color: tk.textMut, marginLeft: 3 }}>
//               ({product.reviewsCount || 0})
//             </span>
//           </div>

//           {/* Prix */}
//           <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 8 }}>
//             <span className="mkt-card-price">
//               {product.price?.toLocaleString('fr-FR')} €
//             </span>
//             {product.originalPrice && (
//               <span style={{ fontSize: 11, color: tk.textMut, textDecoration: 'line-through' }}>
//                 {product.originalPrice.toLocaleString('fr-FR')} €
//               </span>
//             )}
//           </div>

//           {/* Meta desktop */}
//           <div className="mkt-meta">
//             <span style={{ textTransform: 'capitalize' }}>{product.condition || 'Neuf'}</span>
//             <span>{product.location || ''}</span>
//           </div>

//           {/* Vendeur desktop */}
//           <div className="mkt-seller">
//             Vendu par {product.seller?.firstName} {product.seller?.lastName}
//           </div>

//           {/* Condition badge mobile only */}
//           <span className="mkt-condition-badge">
//             {product.condition || 'Neuf'} · {product.location || ''}
//           </span>
//         </div>
//       </div>
//     );
//   };

//   /* ── Render ── */
//   return (
//     <div style={{ minHeight: '100vh', background: tk.surface }}>
//       <style>{STYLES}</style>

//       {/* ─── HERO ─── */}
//       <section className="mkt-hero" style={{
//         position: 'relative',
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

//         <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#fff', padding: '0 16px', maxWidth: 580 }}>
//           <div style={{
//             display: 'inline-flex', alignItems: 'center', gap: 7,
//             background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
//             border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
//             padding: '5px 14px', marginBottom: 14,
//           }}>
//             <SparklesIcon style={{ width: 12, height: 12, color: '#ecd5a3' }} />
//             <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
//               MARKETPLACE
//             </span>
//           </div>

//           <h1 style={{ fontSize: 'clamp(20px,4vw,36px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 10, fontFamily: "'Open Sans',Arial,sans-serif" }}>
//             Achetez et vendez{' '}
//             <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
//               en toute confiance
//             </span>
//           </h1>
//           <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>
//             Découvrez des produits de qualité vendus par notre communauté.
//           </p>

//           <button
//             onClick={() => navigate('/app/marketplace/products/add')}
//             style={{
//               display: 'inline-flex', alignItems: 'center', gap: 7,
//               padding: '10px 22px', borderRadius: 12,
//               background: tk.accent, color: '#fff', border: 'none',
//               cursor: 'pointer', fontSize: 13, fontWeight: 600,
//               fontFamily: "'Open Sans',Arial,sans-serif",
//               boxShadow: '0 4px 20px rgba(167,123,40,.4)',
//             }}
//           >
//             <PlusIcon style={{ width: 15, height: 15 }} /> Vendre un produit
//           </button>
//         </div>

//         {/* Wave */}
//         <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 50" style={{ width: '100%', display: 'block' }}>
//             <path fill={tk.surface} d="M0,20L80,24C160,28,320,36,480,35C640,34,800,24,960,21C1120,18,1280,22,1360,24L1440,26L1440,50L0,50Z" />
//           </svg>
//         </div>
//       </section>

//       {/* ─── CONTENU ─── */}
//       <div className="mkt-content">

//         {/* ── Filtres ── */}
//         <div style={{
//           background: '#fff', borderRadius: 16,
//           border: `1.5px solid ${tk.border}`,
//           boxShadow: '0 2px 8px rgba(23,22,20,.05)',
//           overflow: 'hidden', marginBottom: 20,
//         }}>
//           {/* Header filtres */}
//           <div style={{
//             display: 'flex', alignItems: 'center', gap: 10,
//             padding: '11px 16px', background: tk.surface,
//             borderBottom: showFilters || window.innerWidth > 639 ? `1px solid ${tk.border}` : 'none',
//           }}>
//             <span style={{
//               width: 28, height: 28, borderRadius: 8, background: '#fff',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               boxShadow: '0 1px 4px rgba(0,0,0,.08)', flexShrink: 0,
//             }}>
//               <FunnelIcon style={{ width: 13, height: 13, color: tk.accent }} />
//             </span>
//             <span className="mkt-section-label">Filtres</span>

//             {/* Badge filtre actif */}
//             {hasActiveFilters && (
//               <span style={{
//                 padding: '2px 8px', borderRadius: 99,
//                 background: `${tk.accent}12`, color: tk.accent,
//                 fontSize: 10, fontWeight: 700,
//               }}>
//                 Actifs
//               </span>
//             )}

//             {/* Reset */}
//             {hasActiveFilters && (
//               <button onClick={resetFilters} style={{
//                 display: 'flex', alignItems: 'center', gap: 5,
//                 padding: '4px 10px', borderRadius: 8,
//                 background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.15)',
//                 color: tk.rose, cursor: 'pointer', fontSize: 11, fontWeight: 500,
//               }}>
//                 <XMarkIcon style={{ width: 11, height: 11 }} /> Effacer
//               </button>
//             )}

//             {/* Toggle mobile */}
//             <button
//               className="mkt-filter-toggle"
//               onClick={() => setShowFilters(v => !v)}
//             >
//               <AdjustmentsHorizontalIcon style={{ width: 14, height: 14 }} />
//               {showFilters ? 'Masquer' : 'Filtrer'}
//             </button>
//           </div>

//           {/* Corps des filtres */}
//           <div className={`mkt-filters-panel${showFilters ? '' : ' hidden'}`}
//             style={{ borderTop: `1px solid ${tk.border}` }}
//             id="mkt-filters-panel"
//           >
//             <div className="mkt-filters-grid">
//               {/* Recherche — pleine largeur */}
//               <div className="mkt-filters-search" style={{ position: 'relative' }}>
//                 <MagnifyingGlassIcon style={{
//                   position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)',
//                   width: 14, height: 14, color: tk.textMut, pointerEvents: 'none',
//                 }} />
//                 <input
//                   type="text"
//                   className="mkt-input"
//                   placeholder="Rechercher un produit..."
//                   value={searchInput}
//                   onChange={e => setSearchInput(e.target.value)}
//                   style={{ paddingLeft: 34 }}
//                 />
//               </div>

//               {/* Catégorie */}
//               <select
//                 className="mkt-input"
//                 value={filters.category}
//                 onChange={e => setFilters({ ...filters, category: e.target.value })}
//               >
//                 <option value="">Toutes catégories</option>
//                 {categories.map((cat, i) => {
//                   const val   = typeof cat === 'object' ? (cat._id || cat.name) : cat;
//                   const label = typeof cat === 'object' ? cat.name : (String(cat).charAt(0).toUpperCase() + String(cat).slice(1));
//                   return <option key={val || i} value={val}>{label}</option>;
//                 })}
//               </select>

//               {/* Tri */}
//               <select
//                 className="mkt-input"
//                 value={filters.sort}
//                 onChange={e => setFilters({ ...filters, sort: e.target.value })}
//               >
//                 <option value="newest">Plus récents</option>
//                 <option value="price_asc">Prix ↑</option>
//                 <option value="price_desc">Prix ↓</option>
//                 <option value="popular">Populaires</option>
//               </select>

//               {/* Prix min */}
//               <input
//                 type="number"
//                 className="mkt-input mkt-filters-price"
//                 placeholder="Prix min €"
//                 value={filters.minPrice}
//                 onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
//               />

//               {/* Prix max */}
//               <input
//                 type="number"
//                 className="mkt-input mkt-filters-price"
//                 placeholder="Prix max €"
//                 value={filters.maxPrice}
//                 onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
//               />
//             </div>
//           </div>

//           {/* Sur desktop — toujours visible */}
//           <style>{`
//             @media (min-width: 640px) {
//               #mkt-filters-panel { display: block !important; border-top: none; }
//               .mkt-filters-price { display: block !important; }
//               .mkt-filters-grid { grid-template-columns: 2fr 1fr 1fr 0.8fr 0.8fr !important; }
//               .mkt-filters-search { grid-column: auto !important; }
//             }
//           `}</style>
//         </div>

//         {/* ── Grille produits ── */}
//         <div style={{
//           background: '#fff', borderRadius: 16,
//           border: `1.5px solid ${tk.border}`,
//           boxShadow: '0 2px 8px rgba(23,22,20,.05)',
//           overflow: 'hidden',
//         }}>
//           {/* Header */}
//           <div style={{
//             display: 'flex', alignItems: 'center',
//             padding: '12px 16px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
//           }}>
//             <span style={{
//               width: 28, height: 28, borderRadius: 8, background: '#fff',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               boxShadow: '0 1px 4px rgba(0,0,0,.08)', flexShrink: 0, marginRight: 10,
//             }}>
//               <ShoppingBagIcon style={{ width: 13, height: 13, color: tk.accent }} />
//             </span>
//             <span className="mkt-section-label">Produits disponibles</span>
//             <span className="mkt-badge-count" style={{ marginLeft: 8 }}>
//               {products.length} produit{products.length !== 1 ? 's' : ''}
//             </span>
//             {/* Sur mobile, montrer le nombre directement */}
//             <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 700, color: tk.ink }}>
//               <style>{`@media (min-width: 480px) { .mkt-count-mobile { display: none; } }`}</style>
//               <span className="mkt-count-mobile">
//                 {products.length} produit{products.length !== 1 ? 's' : ''}
//               </span>
//             </span>
//           </div>

//           <div style={{ padding: 16 }}>
//             {loading ? (
//               /* ── Chargement ── */
//               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0', gap: 14 }}>
//                 <div style={{
//                   width: 40, height: 40, borderRadius: '50%',
//                   border: `3px solid ${tk.border}`, borderTopColor: tk.accent,
//                   animation: 'spin .8s linear infinite',
//                 }} />
//                 <span style={{ fontSize: 13, color: tk.textMut }}>Chargement des produits…</span>
//               </div>

//             ) : loadError ? (
//               /* ── Erreur persistante (remplace le toast qui disparaît) ── */
//               <div style={{
//                 display: 'flex', flexDirection: 'column', alignItems: 'center',
//                 padding: '48px 16px', textAlign: 'center',
//               }}>
//                 <div style={{
//                   width: 72, height: 72, borderRadius: '50%',
//                   background: 'rgba(220,38,38,.08)',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   marginBottom: 18,
//                 }}>
//                   <ExclamationTriangleIcon style={{ width: 36, height: 36, color: tk.rose }} />
//                 </div>
//                 <h3 style={{ fontSize: 16, fontWeight: 700, color: tk.ink, marginBottom: 8 }}>
//                   Erreur lors du chargement des produits
//                 </h3>
//                 <p style={{ fontSize: 13, color: tk.textSec, lineHeight: 1.6, maxWidth: 380, marginBottom: 22 }}>
//                   Impossible de récupérer les produits depuis le serveur.
//                   Vérifiez votre connexion ou réessayez dans quelques instants.
//                 </p>
//                 <button
//                   onClick={() => setRetryKey(k => k + 1)}
//                   style={{
//                     display: 'flex', alignItems: 'center', gap: 8,
//                     padding: '10px 24px', borderRadius: 10,
//                     background: tk.accent, color: '#fff', border: 'none',
//                     fontSize: 13, fontWeight: 600, cursor: 'pointer',
//                     transition: 'background .15s',
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.background = '#8a6520'}
//                   onMouseLeave={e => e.currentTarget.style.background = tk.accent}
//                 >
//                   <ArrowPathIcon style={{ width: 15, height: 15 }} />
//                   Réessayer
//                 </button>
//               </div>

//             ) : products.length === 0 ? (
//               /* ── Aucun résultat ── */
//               <div style={{ textAlign: 'center', padding: '40px 16px' }}>
//                 <ShoppingBagIcon style={{ width: 52, height: 52, color: tk.textMut, margin: '0 auto 14px' }} />
//                 <h3 style={{ fontSize: 15, fontWeight: 600, color: tk.ink, marginBottom: 6 }}>
//                   Aucun produit trouvé
//                 </h3>
//                 <p style={{ fontSize: 13, color: tk.textMut, marginBottom: 16 }}>
//                   Essayez de modifier vos filtres
//                 </p>
//                 {hasActiveFilters && (
//                   <button
//                     onClick={resetFilters}
//                     style={{
//                       padding: '8px 20px', borderRadius: 10,
//                       background: tk.accent, color: '#fff', border: 'none',
//                       fontSize: 13, fontWeight: 600, cursor: 'pointer',
//                     }}
//                   >
//                     Réinitialiser les filtres
//                   </button>
//                 )}
//               </div>

//             ) : (
//               <div className="mkt-grid">
//                 {products.map((product, idx) => (
//                   <ProductCard key={product._id} product={product} idx={idx} />
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

////     </div>
//   );
// };

// export default ProductsList;






import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon, ShoppingBagIcon, StarIcon, SparklesIcon,
  MagnifyingGlassIcon, FunnelIcon, XMarkIcon,
  AdjustmentsHorizontalIcon, ExclamationTriangleIcon, ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import axios from '../../api/axios';
import { formatMoney, productCurrency } from '../../config/currencies';

const tk = {
  ink: '#171614', ink80: '#26231e', surface: '#faf8f5', surf2: '#f5efe6',
  border: '#e9e1d5', accent: '#a77b28', emerald: '#059669',
  amber: '#d97706', rose: '#dc2626', textSec: '#4b5a6e', textMut: '#8494a9',
};

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const imgSrc = (img) => {
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

/* ─── Extraction universelle ── */
const extractProducts = (responseData) => {
  if (!responseData) return [];
  if (Array.isArray(responseData)) return responseData;

  const d = responseData;
  if (Array.isArray(d.data)) return d.data;

  if (d.data && typeof d.data === 'object') {
    for (const k of ['products', 'produits', 'items', 'docs', 'results', 'list']) {
      if (Array.isArray(d.data[k])) return d.data[k];
    }
  }
  for (const k of ['products', 'produits', 'items', 'docs', 'results', 'list']) {
    if (Array.isArray(d[k])) return d[k];
  }
  return [];
};

const STYLES = `
  @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
  @keyframes spin       { to   { transform: rotate(360deg); } }
  @keyframes fadeUp     { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

  .mkt-hero { height: 300px; }
  @media (max-width: 639px) { .mkt-hero { height: 220px; } }

  .mkt-content { max-width: 1280px; margin: 0 auto; padding: 28px 20px 48px; }
  @media (max-width: 639px) { .mkt-content { padding: 16px 12px 40px; } }

  .mkt-filters-grid {
    padding: 14px 16px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
  }
  .mkt-filters-search { grid-column: 1 / -1; }
  @media (max-width: 767px) {
    .mkt-filters-grid { grid-template-columns: 1fr 1fr; }
    .mkt-filters-search { grid-column: 1 / -1; }
    .mkt-filters-price  { display: none; }
  }
  @media (max-width: 479px) {
    .mkt-filters-grid { grid-template-columns: 1fr; gap: 8px; }
    .mkt-filters-hide-xs { display: none; }
  }

  .mkt-filter-toggle {
    display: none; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    background: rgba(167,123,40,.08); border: 1.5px solid rgba(167,123,40,.18);
    font-size: 12px; font-weight: 600; color: #a77b28; cursor: pointer; margin-left: auto;
  }
  @media (max-width: 639px) { .mkt-filter-toggle { display: flex; } }

  .mkt-filters-panel { display: block; }
  .mkt-filters-panel.hidden { display: none; }

  .mkt-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px;
  }
  @media (max-width: 1023px) { .mkt-grid { grid-template-columns: repeat(3, 1fr); gap: 14px; } }
  @media (max-width: 767px)  { .mkt-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
  @media (max-width: 599px)  { .mkt-grid { grid-template-columns: 1fr; gap: 10px; } }

  .mkt-card {
    background: #fff; border-radius: 16px; border: 1.5px solid #e9e1d5;
    overflow: hidden; cursor: pointer;
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
    animation: fadeUp .3s ease both; display: flex; flex-direction: column;
  }
  .mkt-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,.09); border-color: #a77b28; }

  @media (max-width: 599px) {
    .mkt-card { flex-direction: row; align-items: stretch; border-radius: 14px; }
    .mkt-card:hover { transform: none; box-shadow: 0 4px 16px rgba(0,0,0,.07); }
    .mkt-card-img { width: 110px !important; min-width: 110px !important; aspect-ratio: auto !important; height: auto !important; align-self: stretch; flex-shrink: 0; }
    .mkt-card-img > img, .mkt-card-img > div { width: 100% !important; height: 100% !important; border-radius: 0 !important; }
    .mkt-badge-featured { top: 8px !important; left: 8px !important; font-size: 8px !important; padding: 2px 7px !important; }
    .mkt-badge-discount  { top: 8px !important; right: 8px !important; font-size: 8px !important; padding: 2px 6px !important; }
    .mkt-card-body { flex: 1; padding: 12px 14px !important; display: flex; flex-direction: column; justify-content: center; min-width: 0; }
  }

  .mkt-card-img { aspect-ratio: 1/1; background: #f5efe6; position: relative; overflow: hidden; flex-shrink: 0; }
  .mkt-card-body { padding: 14px; }
  .mkt-card-title {
    font-size: 14px; font-weight: 600; color: #171614; margin-bottom: 6px; line-height: 1.4;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  }
  @media (max-width: 599px) { .mkt-card-title { font-size: 13px; margin-bottom: 4px; } }
  .mkt-card-price { font-size: 20px; font-weight: 800; color: #a77b28; }
  @media (max-width: 599px) { .mkt-card-price { font-size: 18px; } }
  .mkt-stars { display: flex; align-items: center; gap: 3px; margin-bottom: 7px; }
  @media (max-width: 599px) { .mkt-stars { margin-bottom: 5px; } }
  .mkt-meta { display: flex; justify-content: space-between; font-size: 11px; color: #8494a9; }
  @media (max-width: 599px) { .mkt-meta { font-size: 10px; } }
  .mkt-seller { font-size: 11px; color: #8494a9; margin-top: 5px; }
  @media (max-width: 599px) { .mkt-seller { display: none; } }
  .mkt-condition-badge { display: none; }
  @media (max-width: 599px) {
    .mkt-condition-badge {
      display: inline-flex; align-items: center; margin-top: 6px;
      padding: 3px 9px; border-radius: 99px;
      background: rgba(5,150,105,.08); color: #059669;
      font-size: 10px; font-weight: 600; text-transform: capitalize;
    }
  }
  .mkt-section-label { font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: #8494a9; font-family: 'Open Sans',Arial,sans-serif; }
  .mkt-badge-count { padding: 3px 10px; border-radius: 99px; background: rgba(167,123,40,.08); color: #a77b28; font-size: 11px; font-weight: 700; font-family: 'Open Sans',Arial,sans-serif; }
  .mkt-input {
    width: 100%; padding: 9px 13px; border-radius: 10px;
    background: #fff; color: #171614; font-size: 13px;
    border: 1.5px solid #e9e1d5; outline: none;
    font-family: 'DM Sans', sans-serif; transition: border .18s; box-sizing: border-box;
  }
  .mkt-input:focus { border-color: #a77b28; }
  @media (min-width: 640px) {
    #mkt-filters-panel { display: block !important; border-top: none; }
    .mkt-filters-price { display: block !important; }
    .mkt-filters-grid { grid-template-columns: 2fr 1fr 1fr 0.8fr 0.8fr !important; }
    .mkt-filters-search { grid-column: auto !important; }
  }
`;

const ProductsList = () => {
  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [loadError,   setLoadError]   = useState(false);
  const [retryKey,    setRetryKey]    = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filters,     setFilters]     = useState({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest' });

  const navigate = useNavigate();
  const hasActiveFilters = filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.sort !== 'newest';

  /* Debounce search */
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  /* Fetch produits */
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true); setLoadError(false);
      try {
        const params = {};
        if (filters.search)   params.search   = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.sort)     params.sort     = filters.sort;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;

        const response = await axios.get('/marketplace/products', { params, signal: controller.signal });
        const list = extractProducts(response.data);
        setProducts(list);
        setLoadError(false);
      } catch (err) {
        if (controller.signal.aborted || err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError' || err?.name === 'AbortError' || err?.message === 'canceled' || err?.response?.status === 401) return;
        setLoadError(true);
        setProducts([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [filters, retryKey]);

  /* Fetch catégories */
  useEffect(() => {
    axios.get('/marketplace/categories')
      .then(res => {
        const list = extractProducts(res.data);
        setCategories(list);
      })
      .catch(() => setCategories([]));
  }, []);

  const resetFilters = () => {
    setSearchInput('');
    setFilters({ search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest' });
  };

  /* ── Product card ── */
  const ProductCard = ({ product, idx }) => {
    const thumb = imgSrc(product.images?.[0] ?? product.image ?? product.photo ?? product.thumbnail);
    const discount = product.originalPrice && product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
    const rating = product.rating ?? product.note ?? product.stars ?? 0;
    const reviews = product.reviewsCount ?? product.reviews ?? product.avis ?? 0;
    const price = product.price ?? product.prix ?? 0;
    const originalPrice = product.originalPrice ?? product.prixOriginal ?? null;
    const condition = product.condition ?? product.etat ?? 'Neuf';
    const location = product.location ?? product.ville ?? product.city ?? '';
    const sellerFn = product.seller?.firstName ?? product.vendor?.firstName ?? '';
    const sellerLn = product.seller?.lastName  ?? product.vendor?.lastName  ?? '';
    const sellerName = `${sellerFn} ${sellerLn}`.trim() || product.sellerName || '';

    return (
      <div
        className="mkt-card"
        onClick={() => navigate(`/app/marketplace/products/${product._id}`)}
        style={{ animationDelay: `${Math.min(idx * 40, 300)}ms` }}
      >
        {/* Image */}
        <div className="mkt-card-img">
          {thumb ? (
            <img
              src={thumb}
              alt={product.title || product.titre || 'Produit'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.06)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tk.surf2 }}>
              <ShoppingBagIcon style={{ width: 36, height: 36, color: tk.textMut }} />
            </div>
          )}
          {product.featured && (
            <span className="mkt-badge-featured" style={{ position: 'absolute', top: 8, left: 8, background: tk.amber, color: '#fff', fontSize: 9, padding: '3px 9px', borderRadius: 99, fontWeight: 700, textTransform: 'uppercase' }}>
              Vedette
            </span>
          )}
          {discount > 0 && (
            <span className="mkt-badge-discount" style={{ position: 'absolute', top: 8, right: 8, background: tk.rose, color: '#fff', fontSize: 9, padding: '3px 8px', borderRadius: 99, fontWeight: 700 }}>
              -{discount}%
            </span>
          )}
        </div>

        {/* Body */}
        <div className="mkt-card-body">
          <h3 className="mkt-card-title">{product.title || product.titre || 'Produit sans nom'}</h3>

          <div className="mkt-stars">
            {[...Array(5)].map((_, i) =>
              i < Math.floor(rating)
                ? <StarIconSolid key={i} style={{ width: 12, height: 12, color: '#fbbf24' }} />
                : <StarIcon      key={i} style={{ width: 12, height: 12, color: tk.border }} />
            )}
            <span style={{ fontSize: 10, color: tk.textMut, marginLeft: 3 }}>({reviews})</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginBottom: 8 }}>
            <span className="mkt-card-price">{formatMoney(Number(price), productCurrency(product))}</span>
            {originalPrice && (
              <span style={{ fontSize: 11, color: tk.textMut, textDecoration: 'line-through' }}>
                {formatMoney(Number(originalPrice), productCurrency(product))}
              </span>
            )}
          </div>

          <div className="mkt-meta">
            <span style={{ textTransform: 'capitalize' }}>{condition}</span>
            <span>{location}</span>
          </div>

          {sellerName && (
            <div className="mkt-seller">Vendu par {sellerName}</div>
          )}

          <span className="mkt-condition-badge">{condition}{location ? ` · ${location}` : ''}</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: tk.surface }}>
      <style>{STYLES}</style>

      {/* ── Hero ── */}
      <section className="mkt-hero easy-internal-header" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#37312a', padding: '0 16px', maxWidth: 580 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
            padding: '5px 14px', marginBottom: 14,
          }}>
            <SparklesIcon style={{ width: 12, height: 12, color: '#ecd5a3' }} />
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>MARKETPLACE</span>
          </div>

          <h1 style={{ fontSize: 'clamp(20px,4vw,36px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 10, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Achetez et vendez{' '}
            <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              en toute confiance
            </span>
          </h1>
          <p style={{ color: '#37312a', fontSize: 13, lineHeight: 1.6, marginBottom: 18 }}>
            Découvrez des produits de qualité vendus par notre communauté.
          </p>

          <button
            onClick={() => navigate('/app/marketplace/products/add')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '10px 22px', borderRadius: 12,
              background: tk.accent, color: '#fff', border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
              fontFamily: "'Open Sans',Arial,sans-serif", boxShadow: '0 4px 20px rgba(167,123,40,.4)',
            }}
          >
            <PlusIcon style={{ width: 15, height: 15 }} /> Vendre un produit
          </button>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ── Contenu ── */}
      <div className="mkt-content">

        {/* Filtres */}
        <div style={{ background: '#fff', borderRadius: 16, border: `1.5px solid ${tk.border}`, boxShadow: '0 2px 8px rgba(23,22,20,.05)', overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.08)', flexShrink: 0 }}>
              <FunnelIcon style={{ width: 13, height: 13, color: tk.accent }} />
            </span>
            <span className="mkt-section-label">Filtres</span>
            {hasActiveFilters && (
              <span style={{ padding: '2px 8px', borderRadius: 99, background: `${tk.accent}12`, color: tk.accent, fontSize: 10, fontWeight: 700 }}>Actifs</span>
            )}
            {hasActiveFilters && (
              <button onClick={resetFilters} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 8, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.15)', color: tk.rose, cursor: 'pointer', fontSize: 11, fontWeight: 500 }}>
                <XMarkIcon style={{ width: 11, height: 11 }} /> Effacer
              </button>
            )}
            <button className="mkt-filter-toggle" onClick={() => setShowFilters(v => !v)}>
              <AdjustmentsHorizontalIcon style={{ width: 14, height: 14 }} />
              {showFilters ? 'Masquer' : 'Filtrer'}
            </button>
          </div>

          <div className={`mkt-filters-panel${showFilters ? '' : ' hidden'}`} style={{ borderTop: `1px solid ${tk.border}` }} id="mkt-filters-panel">
            <div className="mkt-filters-grid">
              <div className="mkt-filters-search" style={{ position: 'relative' }}>
                <MagnifyingGlassIcon style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: tk.textMut, pointerEvents: 'none' }} />
                <input type="text" className="mkt-input" placeholder="Rechercher un produit..." value={searchInput} onChange={e => setSearchInput(e.target.value)} style={{ paddingLeft: 34 }} />
              </div>
              <select className="mkt-input" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })}>
                <option value="">Toutes catégories</option>
                {categories.map((cat, i) => {
                  const val   = typeof cat === 'object' ? (cat._id || cat.name) : cat;
                  const label = typeof cat === 'object' ? cat.name : (String(cat).charAt(0).toUpperCase() + String(cat).slice(1));
                  return <option key={val || i} value={val}>{label}</option>;
                })}
              </select>
              <select className="mkt-input" value={filters.sort} onChange={e => setFilters({ ...filters, sort: e.target.value })}>
                <option value="newest">Plus récents</option>
                <option value="price_asc">Prix ↑</option>
                <option value="price_desc">Prix ↓</option>
                <option value="popular">Populaires</option>
              </select>
              <input type="number" className="mkt-input mkt-filters-price" placeholder="Prix min" title="Dans la devise de chaque annonce (aucune conversion)" value={filters.minPrice} onChange={e => setFilters({ ...filters, minPrice: e.target.value })} />
              <input type="number" className="mkt-input mkt-filters-price" placeholder="Prix max" title="Dans la devise de chaque annonce (aucune conversion)" value={filters.maxPrice} onChange={e => setFilters({ ...filters, maxPrice: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Grille produits */}
        <div style={{ background: '#fff', borderRadius: 16, border: `1.5px solid ${tk.border}`, boxShadow: '0 2px 8px rgba(23,22,20,.05)', overflow: 'hidden' }}>
          {/* ── Header avec compteur (UNE SEULE fois, propre) ── */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.08)', flexShrink: 0, marginRight: 10 }}>
              <ShoppingBagIcon style={{ width: 13, height: 13, color: tk.accent }} />
            </span>
            <span className="mkt-section-label">Produits disponibles</span>
            {/* Compteur — affiché UNE SEULE fois, toujours visible */}
            <span className="mkt-badge-count" style={{ marginLeft: 8 }}>
              {loading ? '…' : `${products.length} produit${products.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          <div style={{ padding: 16 }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${tk.border}`, borderTopColor: tk.accent, animation: 'spin .8s linear infinite' }} />
                <span style={{ fontSize: 13, color: tk.textMut }}>Chargement des produits…</span>
              </div>

            ) : loadError ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 16px', textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(220,38,38,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <ExclamationTriangleIcon style={{ width: 36, height: 36, color: tk.rose }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: tk.ink, marginBottom: 8 }}>Erreur lors du chargement</h3>
                <p style={{ fontSize: 13, color: tk.textSec, lineHeight: 1.6, maxWidth: 380, marginBottom: 22 }}>
                  Impossible de récupérer les produits. Vérifiez votre connexion ou réessayez.
                </p>
                <button
                  onClick={() => setRetryKey(k => k + 1)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 10, background: tk.accent, color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  <ArrowPathIcon style={{ width: 15, height: 15 }} />
                  Réessayer
                </button>
              </div>

            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                <ShoppingBagIcon style={{ width: 52, height: 52, color: tk.textMut, margin: '0 auto 14px' }} />
                <h3 style={{ fontSize: 15, fontWeight: 600, color: tk.ink, marginBottom: 6 }}>Aucun produit trouvé</h3>
                <p style={{ fontSize: 13, color: tk.textMut, marginBottom: 16 }}>Essayez de modifier vos filtres</p>
                {hasActiveFilters && (
                  <button onClick={resetFilters} style={{ padding: '8px 20px', borderRadius: 10, background: tk.accent, color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                    Réinitialiser les filtres
                  </button>
                )}
              </div>

            ) : (
              <div className="mkt-grid">
                {products.map((product, idx) => (
                  <ProductCard key={product._id || idx} product={product} idx={idx} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ProductsList;
