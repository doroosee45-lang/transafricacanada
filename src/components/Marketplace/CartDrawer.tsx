import React, { useEffect } from 'react';
import { formatMoney, formatByCurrency, sumByCurrency, productCurrency } from '../../config/currencies';
import { useNavigate } from 'react-router-dom';
import {
  XMarkIcon,
  TrashIcon,
  ShoppingBagIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import { useCart } from '../../context/CartContext';
import type { ProductImage } from '../../types/models';

const tk = {
  ink:        '#172F50',
  surface:    '#F7FAFE',
  border:     '#DCE9F5',
  accent:     '#4D91D9',
  accentDark: '#347FC5',
  emerald:    '#059669',
  rose:       '#dc2626',
  textSec:    '#52677D',
  textMut:    '#8295A8',
};

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

const CartDrawer = () => {
  const { cartItems, cartCount, cartTotal, removeFromCart, updateQuantity, clearCart, isOpen, closeCart } = useCart();
  const navigate = useNavigate();

  /* Lock body scroll when open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeCart]);

  return (
    <>
      <style>{`
        @keyframes slideInCart { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={closeCart}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(23,47,80,.45)',
            zIndex: 998, animation: 'fadeInOverlay .2s ease',
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 400, maxWidth: '95vw',
        background: '#fff', zIndex: 999,
        boxShadow: '-4px 0 32px rgba(23,47,80,.18)',
        display: 'flex', flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
      }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px',
          borderBottom: `1px solid ${tk.border}`,
          background: tk.surface,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: `${tk.accent}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingCartIcon style={{ width: 18, height: 18, color: tk.accent }} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                Mon Panier
              </div>
              <div style={{ fontSize: 11, color: tk.textMut }}>
                {cartCount} article{cartCount !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                style={{
                  fontSize: 11, color: tk.rose, background: 'none', border: 'none',
                  cursor: 'pointer', fontWeight: 500, padding: '4px 8px',
                  borderRadius: 6, transition: 'background .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,.07)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                Vider
              </button>
            )}
            <button
              onClick={closeCart}
              style={{
                width: 32, height: 32, borderRadius: 8, border: `1px solid ${tk.border}`,
                background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: tk.textSec, transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = tk.surface; e.currentTarget.style.borderColor = tk.accent; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
            >
              <XMarkIcon style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>

        {/* ── Items ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: cartItems.length ? '12px 20px' : 0 }}>
          {cartItems.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: '100%', padding: '48px 24px', textAlign: 'center',
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: tk.surface, border: `1.5px dashed ${tk.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <ShoppingBagIcon style={{ width: 36, height: 36, color: tk.textMut }} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: tk.ink, marginBottom: 8 }}>Panier vide</div>
              <div style={{ fontSize: 13, color: tk.textMut, lineHeight: 1.6, marginBottom: 24 }}>
                Parcourez la marketplace et ajoutez des produits à votre panier.
              </div>
              <button
                onClick={() => { closeCart(); navigate('/app/marketplace/products'); }}
                style={{
                  padding: '10px 24px', borderRadius: 10, background: '#347FC5',
                  color: '#fff', border: 'none', fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'background .15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#172F50'}
                onMouseLeave={e => e.currentTarget.style.background = '#347FC5'}
              >
                Voir les produits
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cartItems.map((item) => {
                const thumb = imgSrc(item.product.images?.[0]);
                return (
                  <div key={item.product._id} style={{
                    display: 'flex', gap: 14, padding: 14,
                    background: '#fff', borderRadius: 14,
                    border: `1.5px solid ${tk.border}`,
                    transition: 'border-color .15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#c7d2e8'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = tk.border}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: 72, height: 72, borderRadius: 10, overflow: 'hidden',
                      background: tk.surface, border: `1px solid ${tk.border}`,
                      flexShrink: 0,
                    }}>
                      {thumb ? (
                        <img src={thumb} alt={item.product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ShoppingBagIcon style={{ width: 24, height: 24, color: tk.textMut }} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 600, color: tk.ink, lineHeight: 1.4, marginBottom: 4,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {item.product.title}
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: tk.accent, marginBottom: 10 }}>
                        {formatMoney((item.product.price || 0) * item.quantity, productCurrency(item.product))}
                      </div>

                      {/* Qty + remove */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 0,
                          border: `1.5px solid ${tk.border}`, borderRadius: 8, overflow: 'hidden',
                        }}>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                            style={{
                              width: 28, height: 28, border: 'none', background: 'none',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: tk.textSec, transition: 'background .1s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = tk.surface}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            <MinusIcon style={{ width: 12, height: 12 }} />
                          </button>
                          <span style={{
                            minWidth: 28, textAlign: 'center', fontSize: 13,
                            fontWeight: 700, color: tk.ink, padding: '0 4px',
                          }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                            style={{
                              width: 28, height: 28, border: 'none', background: 'none',
                              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: tk.textSec, transition: 'background .1s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = tk.surface}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            <PlusIcon style={{ width: 12, height: 12 }} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          style={{
                            width: 28, height: 28, borderRadius: 8,
                            border: `1.5px solid rgba(220,38,38,.25)`,
                            background: 'rgba(220,38,38,.05)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: tk.rose, transition: 'all .15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,.1)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,.4)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,.05)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,.25)'; }}
                          title="Retirer"
                        >
                          <TrashIcon style={{ width: 13, height: 13 }} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '16px 20px 20px',
            borderTop: `1px solid ${tk.border}`,
            background: tk.surface,
            flexShrink: 0,
          }}>
            {/* Total */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 14,
            }}>
              <span style={{ fontSize: 13, color: tk.textSec, fontWeight: 500 }}>Total ({cartCount} article{cartCount !== 1 ? 's' : ''})</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                {formatByCurrency(sumByCurrency(cartItems, (i) => (i.product.price || 0) * i.quantity, (i) => productCurrency(i.product)))}
              </span>
            </div>

            {/* Continue shopping */}
            <button
              onClick={closeCart}
              style={{
                width: '100%', padding: '10px', borderRadius: 10, marginBottom: 8,
                border: `1.5px solid ${tk.border}`, background: '#fff',
                fontSize: 13, fontWeight: 500, color: tk.textSec,
                cursor: 'pointer', transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F7FAFE'; e.currentTarget.style.borderColor = tk.accent; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
            >
              Continuer les achats
            </button>

            {/* Checkout — placeholder */}
            <button
              onClick={() => { closeCart(); navigate('/app/marketplace/products'); }}
              style={{
                width: '100%', padding: '12px', borderRadius: 10,
                background: `linear-gradient(135deg, ${tk.accent}, #172F50)`,
                color: '#fff', border: 'none',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                transition: 'opacity .15s',
                boxShadow: '0 4px 16px rgba(77,145,217,.3)',
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '.88'}
              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Passer la commande →
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
