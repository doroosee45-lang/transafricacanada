import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ShoppingCartIcon,
  StarIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  ShoppingBagIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  TagIcon,
  CubeIcon,
  XMarkIcon,
  SparklesIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { formatMoney, productCurrency } from '../../config/currencies';
import { useCart } from '../../context/CartContext';

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const tk = {
  ink:        '#171614',
  ink80:      '#26231e',
  surface:    '#faf8f5',
  surf2:      '#f5efe6',
  border:     '#e9e1d5',
  accent:     '#a77b28',
  accentDark: '#8a6520',
  emerald:    '#059669',
  amber:      '#d97706',
  rose:       '#dc2626',
  textSec:    '#4b5a6e',
  textMut:    '#8494a9',
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

/* ── Responsive CSS ── */
const DETAIL_STYLES = `
  @keyframes spin    { to { transform: rotate(360deg); } }
  @keyframes fadeIn  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }

  .pd-content  { max-width:1280px; margin:0 auto; padding:24px 20px 56px; }
  @media(max-width:639px){ .pd-content { padding:14px 12px 40px; } }

  /* Main 2-col → 1-col */
  .pd-main-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 36px;
    align-items: start;
  }
  @media(max-width:767px){
    .pd-main-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  /* Thumbnails */
  .pd-thumbs {
    display: grid;
    gap: 10px;
  }

  /* Trust badges */
  .pd-trust {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 10px;
    margin-top: 18px;
  }
  @media(max-width:359px){ .pd-trust { grid-template-columns: 1fr 1fr; } }

  /* Action buttons */
  .pd-actions { display: flex; gap: 10px; }
  @media(max-width:479px){
    .pd-actions { flex-direction: column; }
    .pd-actions button { width:100%; }
  }

  /* Chips row */
  .pd-chips { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }

  /* Seller grid */
  .pd-seller-products {
    display: grid;
    gap: 16px;
  }
  @media(max-width:767px)  { .pd-seller-products { grid-template-columns: repeat(2, 1fr) !important; gap: 12px; } }
  @media(max-width:479px)  { .pd-seller-products { grid-template-columns: repeat(2, 1fr) !important; gap: 10px; padding: 14px 12px !important; } }

  /* Price */
  .pd-price { font-size:36px; }
  @media(max-width:479px){ .pd-price { font-size:28px; } }

  /* Title */
  .pd-title { font-size:26px; }
  @media(max-width:479px){ .pd-title { font-size:21px; } }
`;

/* ── Status badge config ── */
const STATUS_CONFIG = {
  available: { bg: 'rgba(5,150,105,.1)',  color: '#059669', label: 'Disponible' },
  reserved:  { bg: 'rgba(217,119,6,.1)',  color: '#d97706', label: 'Réservé' },
  sold:      { bg: 'rgba(220,38,38,.1)',  color: '#dc2626', label: 'Vendu' },
  shipped:   { bg: 'rgba(124,58,237,.1)', color: '#7c3aed', label: 'Expédié' },
  delivered: { bg: 'rgba(5,150,105,.1)',  color: '#059669', label: 'Livré' },
  cancelled: { bg: 'rgba(107,114,128,.1)',color: '#6b7280', label: 'Annulé' },
};

/* ── Buy Confirmation Modal ── */
const BuyModal = ({ product, quantity, onConfirm, onCancel, loading }) => (
  <>
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(23,22,20,.6)',
        zIndex: 1000, backdropFilter: 'blur(4px)',
      }}
    />
    <div style={{
      position: 'fixed', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%)',
      width: 440, maxWidth: '92vw',
      background: '#fff', borderRadius: 20,
      boxShadow: '0 24px 64px rgba(23,22,20,.25)',
      zIndex: 1001, overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${tk.accent}, #77551c)`,
        padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <ShieldCheckIcon style={{ width: 24, height: 24, color: '#fff' }} />
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Confirmer l'achat
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.75)' }}>
            Vérifiez les détails avant de valider
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: 24 }}>
        {/* Product summary */}
        <div style={{
          display: 'flex', gap: 14, padding: 14,
          background: tk.surface, borderRadius: 14,
          border: `1.5px solid ${tk.border}`, marginBottom: 20,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 10, overflow: 'hidden',
            background: '#fff', border: `1px solid ${tk.border}`, flexShrink: 0,
          }}>
            {imgSrc(product.images?.[0]) ? (
              <img src={imgSrc(product.images[0])} alt={product.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBagIcon style={{ width: 24, height: 24, color: tk.textMut }} />
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: tk.ink, marginBottom: 4, lineHeight: 1.4 }}>
              {product.title}
            </div>
            <div style={{ fontSize: 12, color: tk.textMut, marginBottom: 6 }}>
              Qté : {quantity}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: tk.accent, fontFamily: "'Open Sans',Arial,sans-serif" }}>
              {formatMoney((product.price || 0) * quantity, productCurrency(product))}
            </div>
          </div>
        </div>

        {/* Info */}
        <div style={{
          fontSize: 13, color: tk.textSec, lineHeight: 1.6,
          padding: '12px 14px', background: 'rgba(167,123,40,.05)',
          borderRadius: 10, border: '1px solid rgba(167,123,40,.15)',
          marginBottom: 20,
        }}>
          En cliquant sur <strong>Confirmer</strong>, vous achetez ce produit et le vendeur sera notifié.
          Cette action est <strong>irréversible</strong>.
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1, padding: '11px', borderRadius: 10,
              border: `1.5px solid ${tk.border}`, background: '#fff',
              fontSize: 13, fontWeight: 500, color: tk.textSec,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? .6 : 1,
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 2, padding: '11px', borderRadius: 10,
              background: `linear-gradient(135deg, ${tk.accent}, #77551c)`,
              color: '#fff', border: 'none',
              fontSize: 14, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? .7 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 16px rgba(167,123,40,.3)',
            }}
          >
            {loading ? (
              <>
                <ArrowPathIcon style={{ width: 15, height: 15, animation: 'spin .8s linear infinite' }} />
                Traitement…
              </>
            ) : (
              <>
                <CheckCircleIcon style={{ width: 16, height: 16 }} />
                Confirmer l'achat
              </>
            )}
          </button>
        </div>
      </div>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();

  const [product, setProduct]             = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity]           = useState(1);
  const [loading, setLoading]             = useState(true);
  const [buying, setBuying]               = useState(false);
  const [showBuyModal, setShowBuyModal]   = useState(false);
  const [bought, setBought]               = useState(false);

  useEffect(() => {
    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductData = async () => {
    setLoading(true);
    setBought(false);
    try {
      const res = await axios.get(`/marketplace/products/${id}`);
      const data = res.data?.data || res.data;
      setProduct(data);

      if (data?.seller?._id) {
        const sellerRes = await axios.get(
          `/marketplace/products?seller=${data.seller._id}&limit=5`
        );
        const others = (sellerRes.data?.data?.data || sellerRes.data?.data || sellerRes.data || [])
          .filter(p => p._id !== id)
          .slice(0, 4);
        setSellerProducts(others);
      }
    } catch {
      toast.error('Produit introuvable ou erreur de chargement');
      navigate('/app/marketplace/products');
    } finally {
      setLoading(false);
    }
  };

  /* ── Add to cart ── */
  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`"${product.title}" ajouté au panier`);
    openCart();
  };

  /* ── Buy now — show confirmation modal ── */
  const handleBuyNow = () => {
    if (product?.status !== 'available') {
      toast.error('Ce produit n\'est plus disponible');
      return;
    }
    setShowBuyModal(true);
  };

  /* ── Confirm purchase via API ── */
  const handleConfirmBuy = async () => {
    setBuying(true);
    try {
      await axios.put(`/marketplace/products/${id}/buy`);
      setBought(true);
      setShowBuyModal(false);
      setProduct(prev => prev ? { ...prev, status: 'sold' } : prev);
      toast.success('🎉 Achat effectué avec succès !');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Erreur lors de l\'achat';
      toast.error(msg);
      setShowBuyModal(false);
    } finally {
      setBuying(false);
    }
  };

  /* ════════════════ LOADING ════════════════ */
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: tk.surface }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: '100vh', flexDirection: 'column', gap: 16,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            border: `3px solid ${tk.border}`, borderTopColor: tk.accent,
            animation: 'spin .8s linear infinite',
          }} />
          <span style={{ fontSize: 13, color: tk.textMut }}>Chargement du produit…</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: tk.surface }}>
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <ShoppingBagIcon style={{ width: 64, height: 64, color: tk.textMut, margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 20, fontWeight: 600, color: tk.ink }}>Produit introuvable</h2>
        </div>
      </div>
    );
  }

  const images      = Array.isArray(product.images) ? product.images : [];
  const currentImg  = imgSrc(images[selectedImage]) || null;
  const statusCfg   = STATUS_CONFIG[product.status] || STATUS_CONFIG.available;
  const isAvailable = product.status === 'available' && !bought;
  const discount    = product.originalPrice && product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', background: tk.surface }}>
      <style>{DETAIL_STYLES}</style>

      {/* ── Buy Confirmation Modal ── */}
      {showBuyModal && (
        <BuyModal
          product={product}
          quantity={quantity}
          onConfirm={handleConfirmBuy}
          onCancel={() => setShowBuyModal(false)}
          loading={buying}
        />
      )}

      <div className="pd-content">

        {/* Back button */}
        <button
          onClick={() => navigate('/app/marketplace/products')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            marginBottom: 24, padding: '7px 14px', borderRadius: 10,
            background: '#fff', border: `1.5px solid ${tk.border}`,
            fontSize: 13, fontWeight: 500, color: tk.textSec,
            cursor: 'pointer', transition: 'all .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = tk.surface; e.currentTarget.style.borderColor = tk.accent; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
        >
          <ArrowLeftIcon style={{ width: 14, height: 14 }} />
          Retour à la marketplace
        </button>

        {/* ════════ MAIN GRID ════════ */}
        <div className="pd-main-grid">

          {/* ── LEFT: Images ── */}
          <div>
            {/* Main image */}
            <div style={{
              position: 'relative', aspectRatio: '1/1',
              background: '#fff', borderRadius: 20,
              border: `1.5px solid ${tk.border}`,
              overflow: 'hidden', marginBottom: 14,
              boxShadow: '0 4px 24px rgba(23,22,20,.07)',
            }}>
              {currentImg ? (
                <img
                  src={currentImg}
                  alt={product.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity .2s' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 12, color: tk.textMut,
                }}>
                  <ShoppingBagIcon style={{ width: 72, height: 72 }} />
                  <span style={{ fontSize: 13 }}>Aucune image</span>
                </div>
              )}

              {/* Status badge overlay */}
              <div style={{
                position: 'absolute', top: 14, left: 14,
                padding: '5px 14px', borderRadius: 99,
                background: statusCfg.bg, color: statusCfg.color,
                fontSize: 12, fontWeight: 700,
                backdropFilter: 'blur(8px)',
              }}>
                {statusCfg.label}
              </div>

              {/* Discount badge */}
              {discount > 0 && (
                <div style={{
                  position: 'absolute', top: 14, right: 14,
                  background: tk.rose, color: '#fff',
                  padding: '5px 12px', borderRadius: 99,
                  fontSize: 12, fontWeight: 800,
                }}>
                  -{discount}%
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="pd-thumbs" style={{ gridTemplateColumns: `repeat(${Math.min(images.length, 5)}, 1fr)` }}>
                {images.map((img, idx) => {
                  const src = imgSrc(img);
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      style={{
                        aspectRatio: '1/1', borderRadius: 12, overflow: 'hidden',
                        border: selectedImage === idx
                          ? `2px solid ${tk.accent}`
                          : `1.5px solid ${tk.border}`,
                        cursor: 'pointer', padding: 0, background: tk.surface,
                        transition: 'all .15s',
                        boxShadow: selectedImage === idx ? '0 0 0 3px rgba(167,123,40,.2)' : 'none',
                      }}
                    >
                      {src ? (
                        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShoppingBagIcon style={{ width: 20, height: 20, color: tk.textMut }} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Trust badges */}
            <div className="pd-trust">
              {[
                { icon: ShieldCheckIcon, label: 'Achat sécurisé' },
                { icon: TruckIcon, label: 'Livraison rapide' },
                { icon: ArrowPathIcon, label: 'Service fiable' },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: 14, background: '#fff', borderRadius: 12,
                  border: `1px solid ${tk.border}`,
                  fontSize: 11, color: tk.textSec, fontWeight: 500, textAlign: 'center',
                }}>
                  <Icon style={{ width: 20, height: 20, color: tk.accent }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Info ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Category + condition chips */}
            <div className="pd-chips">
              {product.category && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 12px', borderRadius: 99,
                  background: `${tk.accent}10`, color: tk.accent,
                  fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
                }}>
                  <TagIcon style={{ width: 11, height: 11 }} />
                  {product.category}
                </span>
              )}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 12px', borderRadius: 99,
                background: `${tk.emerald}10`, color: tk.emerald,
                fontSize: 11, fontWeight: 600, textTransform: 'capitalize',
              }}>
                <SparklesIcon style={{ width: 11, height: 11 }} />
                {product.condition || 'Neuf'}
              </span>
              {product.stock !== undefined && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 12px', borderRadius: 99,
                  background: `${tk.amber}10`, color: tk.amber,
                  fontSize: 11, fontWeight: 600,
                }}>
                  <CubeIcon style={{ width: 11, height: 11 }} />
                  {product.stock} en stock
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="pd-title" style={{
              fontWeight: 800, color: tk.ink,
              lineHeight: 1.25, margin: 0,
              fontFamily: "'Open Sans',Arial,sans-serif",
            }}>
              {product.title}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {[...Array(5)].map((_, i) => (
                  i < Math.floor(product.rating || 0)
                    ? <StarIconSolid key={i} style={{ width: 16, height: 16, color: '#fbbf24' }} />
                    : <StarIcon key={i} style={{ width: 16, height: 16, color: tk.border }} />
                ))}
              </div>
              <span style={{ fontSize: 13, color: tk.textSec, fontWeight: 500 }}>
                {(product.rating || 0).toFixed(1)}
              </span>
              <span style={{ fontSize: 12, color: tk.textMut }}>
                ({product.reviewsCount || 0} avis)
              </span>
            </div>

            {/* Price */}
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 12,
              padding: '16px 20px',
              background: `linear-gradient(135deg, rgba(167,123,40,.06), rgba(167,123,40,.02))`,
              borderRadius: 16, border: `1.5px solid rgba(167,123,40,.15)`,
            }}>
              <span className="pd-price" style={{ fontWeight: 900, color: tk.accent, fontFamily: "'Open Sans',Arial,sans-serif", lineHeight: 1 }}>
                {formatMoney(product.price, productCurrency(product))}
              </span>
              {product.originalPrice && (
                <span style={{ fontSize: 18, color: tk.textMut, textDecoration: 'line-through' }}>
                  {formatMoney(product.originalPrice, productCurrency(product))}
                </span>
              )}
              {discount > 0 && (
                <span style={{
                  fontSize: 13, color: tk.rose, fontWeight: 700,
                  background: 'rgba(220,38,38,.1)', padding: '3px 10px', borderRadius: 99,
                }}>
                  Économisez {formatMoney(product.originalPrice - product.price, productCurrency(product))}
                </span>
              )}
            </div>

            {/* Description */}
            <div style={{
              background: '#fff', borderRadius: 16, padding: 18,
              border: `1.5px solid ${tk.border}`,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>
                Description
              </div>
              <p style={{ fontSize: 14, color: tk.textSec, lineHeight: 1.7, margin: 0 }}>
                {product.description || 'Aucune description disponible.'}
              </p>
            </div>

            {/* Meta info */}
            <div style={{
              background: '#fff', borderRadius: 16,
              border: `1.5px solid ${tk.border}`, overflow: 'hidden',
            }}>
              {[
                { icon: MapPinIcon, label: 'Localisation', value: product.location || 'Non spécifiée' },
                { icon: CalendarIcon, label: 'Publié le', value: product.createdAt ? new Date(product.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
              ].map(({ icon: Icon, label, value }, i, arr) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  borderBottom: i < arr.length - 1 ? `1px solid ${tk.border}` : 'none',
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `${tk.accent}10`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <Icon style={{ width: 15, height: 15, color: tk.accent }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: tk.textMut, fontWeight: 500, marginBottom: 1 }}>{label}</div>
                    <div style={{ fontSize: 13, color: tk.ink, fontWeight: 600 }}>{value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity & Actions */}
            {isAvailable ? (
              <div style={{
                background: '#fff', borderRadius: 16,
                border: `1.5px solid ${tk.border}`, padding: 18,
              }}>
                {/* Qty selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: tk.textSec }}>Quantité :</span>
                  <select
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    style={{
                      padding: '8px 14px', borderRadius: 10,
                      border: `1.5px solid ${tk.border}`, background: tk.surface,
                      fontSize: 13, color: tk.ink, outline: 'none', cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {[...Array(Math.min(product.stock || 10, 10))].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <span style={{ fontSize: 12, color: tk.emerald, fontWeight: 600 }}>
                    ✓ {product.stock || 0} disponible{(product.stock || 0) > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="pd-actions">
                  <button
                    onClick={handleAddToCart}
                    style={{
                      flex: 1, padding: '12px 16px', borderRadius: 12,
                      border: `1.5px solid ${tk.accent}`, background: '#fff',
                      fontSize: 13, fontWeight: 600, color: tk.accent,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'all .15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${tk.accent}08`; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                  >
                    <ShoppingCartIcon style={{ width: 16, height: 16 }} />
                    Ajouter au panier
                  </button>
                  <button
                    onClick={handleBuyNow}
                    style={{
                      flex: 1, padding: '12px 16px', borderRadius: 12,
                      background: `linear-gradient(135deg, ${tk.accent}, #77551c)`,
                      color: '#fff', border: 'none',
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'opacity .15s',
                      boxShadow: '0 4px 16px rgba(167,123,40,.3)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '.88'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <CheckCircleIcon style={{ width: 16, height: 16 }} />
                    Acheter maintenant
                  </button>
                </div>
              </div>
            ) : bought ? (
              /* ── Purchase success banner ── */
              <div style={{
                padding: 20, borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(5,150,105,.08), rgba(5,150,105,.04))',
                border: `1.5px solid rgba(5,150,105,.3)`,
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${tk.emerald}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <CheckCircleIcon style={{ width: 24, height: 24, color: tk.emerald }} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: tk.emerald, marginBottom: 3 }}>
                    Achat confirmé ! 🎉
                  </div>
                  <div style={{ fontSize: 13, color: tk.textSec }}>
                    Le vendeur a été notifié. Vous serez contacté prochainement.
                  </div>
                </div>
              </div>
            ) : (
              /* ── Not available ── */
              <div style={{
                padding: 20, borderRadius: 16,
                background: 'rgba(220,38,38,.05)',
                border: `1.5px solid rgba(220,38,38,.2)`,
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <XMarkIcon style={{ width: 22, height: 22, color: tk.rose, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: tk.rose, marginBottom: 2 }}>
                    Produit indisponible
                  </div>
                  <div style={{ fontSize: 13, color: tk.textSec }}>
                    Ce produit a été {product.status === 'sold' ? 'vendu' : 'retiré'} et n'est plus disponible.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ════════ SELLER CARD ════════ */}
        {product.seller && (
          <div style={{
            marginTop: 40, background: '#fff', borderRadius: 20,
            border: `1.5px solid ${tk.border}`,
            boxShadow: '0 2px 12px rgba(23,22,20,.05)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 24px',
              background: tk.surface, borderBottom: `1px solid ${tk.border}`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <UserIcon style={{ width: 16, height: 16, color: tk.textMut }} />
              <h2 style={{ fontSize: 13, fontWeight: 700, color: tk.ink, textTransform: 'uppercase', letterSpacing: '.1em', margin: 0 }}>
                À propos du vendeur
              </h2>
            </div>
            <div style={{ padding: 24, display: 'flex', alignItems: 'flex-start', gap: 20 }}>
              {/* Avatar */}
              <div style={{
                width: 60, height: 60, borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg, ${tk.accent}, #77551c)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, fontWeight: 800, color: '#fff',
                boxShadow: '0 4px 16px rgba(167,123,40,.25)',
              }}>
                {(product.seller.firstName || '?').charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: tk.ink, marginBottom: 4, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                  {product.seller.firstName} {product.seller.lastName}
                </div>
                {product.seller.agency && (
                  <div style={{ fontSize: 13, color: tk.accent, fontWeight: 600, marginBottom: 12 }}>
                    {product.seller.agency?.name || product.seller.agency}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {product.seller.email && (
                    <a
                      href={`mailto:${product.seller.email}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '7px 14px', borderRadius: 10,
                        border: `1.5px solid ${tk.border}`, background: tk.surface,
                        fontSize: 12, fontWeight: 500, color: tk.textSec,
                        textDecoration: 'none', transition: 'all .15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = tk.accent; e.currentTarget.style.color = tk.accent; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.color = tk.textSec; }}
                    >
                      <EnvelopeIcon style={{ width: 13, height: 13 }} />
                      {product.seller.email}
                    </a>
                  )}
                  {product.seller.phone && (
                    <a
                      href={`tel:${product.seller.phone}`}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '7px 14px', borderRadius: 10,
                        border: `1.5px solid ${tk.border}`, background: tk.surface,
                        fontSize: 12, fontWeight: 500, color: tk.textSec,
                        textDecoration: 'none', transition: 'all .15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = tk.emerald; e.currentTarget.style.color = tk.emerald; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.color = tk.textSec; }}
                    >
                      <PhoneIcon style={{ width: 13, height: 13 }} />
                      {product.seller.phone}
                    </a>
                  )}
                </div>
              </div>

              {/* Stats / CTA */}
              {sellerProducts.length > 0 && (
                <div style={{
                  padding: '10px 16px', background: `${tk.accent}08`,
                  border: `1px solid ${tk.accent}20`, borderRadius: 12,
                  textAlign: 'center', flexShrink: 0,
                }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: tk.accent, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                    {sellerProducts.length + 1}
                  </div>
                  <div style={{ fontSize: 11, color: tk.textMut, fontWeight: 500 }}>
                    annonces
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════════ OTHER SELLER PRODUCTS ════════ */}
        {sellerProducts.length > 0 && (
          <div style={{
            marginTop: 32, background: '#fff', borderRadius: 20,
            border: `1.5px solid ${tk.border}`,
            boxShadow: '0 2px 12px rgba(23,22,20,.05)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 24px',
              background: tk.surface, borderBottom: `1px solid ${tk.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: tk.ink, textTransform: 'uppercase', letterSpacing: '.1em', margin: 0 }}>
                Autres annonces du vendeur
              </h2>
              <button
                onClick={() => navigate('/app/marketplace/products')}
                style={{
                  fontSize: 12, color: tk.accent, background: 'none', border: 'none',
                  cursor: 'pointer', fontWeight: 600, padding: '4px 8px',
                }}
              >
                Voir tout →
              </button>
            </div>
            <div className="pd-seller-products" style={{
              padding: '20px 18px',
              gridTemplateColumns: `repeat(${Math.min(sellerProducts.length, 4)}, 1fr)`,
            }}>
              {sellerProducts.map((item) => {
                const thumb = imgSrc(item.images?.[0]);
                return (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/app/marketplace/products/${item._id}`)}
                    style={{
                      cursor: 'pointer', borderRadius: 14,
                      border: `1.5px solid ${tk.border}`,
                      background: tk.surface, overflow: 'hidden',
                      transition: 'all .2s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(23,22,20,.1)';
                      e.currentTarget.style.borderColor = '#c7d2e8';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = tk.border;
                    }}
                  >
                    <div style={{ aspectRatio: '1/1', background: '#fff', overflow: 'hidden' }}>
                      {thumb ? (
                        <img src={thumb} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShoppingBagIcon style={{ width: 32, height: 32, color: tk.textMut }} />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{
                        fontSize: 13, fontWeight: 600, color: tk.ink,
                        marginBottom: 6, lineHeight: 1.4,
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: tk.accent, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                        {formatMoney(item.price, productCurrency(item))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default ProductDetail;
