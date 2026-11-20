import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ScaleIcon,
  SparklesIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  UserCircleIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { formatMoney, formatUnitPrice, offerCurrency } from '../../config/currencies';
import { asHttpError } from '../../types/api';
import type { KiloOffer } from '../../types/models';
import type { IconComponent } from '../../types/ui';

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const tk = {
  ink:        '#172F50',
  surface:    '#F7FAFE',
  border:     '#DCE9F5',
  accent:     '#4D91D9',
  accentDark: '#347FC5',
  emerald:    '#059669',
  amber:      '#d97706',
  rose:       '#dc2626',
  textSec:    '#52677D',
  textMut:    '#8295A8',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  background: '#fff', color: tk.ink, fontSize: 14,
  border: `1.5px solid ${tk.border}`, outline: 'none',
  fontFamily: "'DM Sans', sans-serif", transition: 'border .18s',
  boxSizing: 'border-box',
};

const STATUS_CHIP: Record<string, { label: string; bg: string; color: string }> = {
  available: { bg: 'rgba(5,150,105,.1)',   color: '#059669', label: 'Disponible' },
  partial:   { bg: 'rgba(77,145,217,.1)',   color: '#4D91D9', label: 'Partiel' },
  full:      { bg: 'rgba(220,38,38,.1)',   color: '#dc2626', label: 'Complet' },
  expired:   { bg: 'rgba(130,149,168,.1)', color: '#8295A8', label: 'Expiré' },
};

const fmt = (d?: string) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

/* ══════════════════════════════════════════
   PAGE : Détail d'une offre de kilos + réservation
══════════════════════════════════════════ */
const BuyKilos = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [offer, setOffer]         = useState<KiloOffer | null>(null);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reserved, setReserved]   = useState(false);

  /* Formulaire */
  const [weight, setWeight] = useState('');
  const [notes, setNotes]   = useState('');

  /* Calculs */
  const remaining    = offer ? (offer.availableWeight || 0) - (offer.reservedWeight || 0) : 0;
  const totalPrice   = weight && offer ? parseFloat(weight) * (offer.pricePerKg as number) : null;
  const offerCur     = offerCurrency(offer); // devise de l'offre (pays de départ)
  const weightNum    = parseFloat(weight) || 0;
  const weightError  = weightNum > 0 && weightNum > remaining;

  /* ── Fetch offre ── */
  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/marketplace/kilos/${id}`);
        const data = res.data?.data || res.data;
        setOffer(data);
      } catch {
        toast.error('Offre introuvable');
        navigate('/app/marketplace/kilos');
      } finally {
        setLoading(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ── Soumettre la réservation ── */
  const handleReserve = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!weight || weightNum <= 0) { toast.error('Indiquez un poids à réserver'); return; }
    if (weightNum > remaining)     { toast.error(`Maximum disponible : ${remaining} kg`); return; }
    if (!offer || offer.status === 'full') { toast.error('Cette offre est complète'); return; }

    setSubmitting(true);
    try {
      await axios.post(`/marketplace/kilos/${id}/reserve`, {
        reservedWeight: weightNum,
        notes: notes.trim() || undefined,
      });
      setReserved(true);
      toast.success('🎉 Réservation effectuée avec succès !');
    } catch (caught) {
      const err = asHttpError(caught);
      toast.error(err?.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Chargement ─── */
  if (loading) return (
    <div style={{ minHeight: '100vh', background: tk.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', border: `3px solid ${tk.border}`, borderTopColor: tk.accent, animation: 'spin .8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!offer) return null;

  const chip = STATUS_CHIP[offer.status ?? ''] || STATUS_CHIP.available;
  const pct  = offer.availableWeight ? Math.round(((offer.reservedWeight as number) / offer.availableWeight) * 100) : 0;
  const canReserve = ['available', 'partial'].includes(offer.status ?? '') && remaining > 0;

  /* ─── Succès ─── */
  if (reserved) return (
    <div style={{ minHeight: '100vh', background: tk.surface, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'rgba(5,150,105,.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
      }}>
        <CheckCircleIcon style={{ width: 44, height: 44, color: tk.emerald }} />
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 12 }}>
        Réservation confirmée !
      </h2>
      <p style={{ fontSize: 15, color: tk.textSec, lineHeight: 1.6, maxWidth: 460, marginBottom: 32 }}>
        Vous avez réservé <strong style={{ color: tk.ink }}>{weight} kg</strong> pour un total de{' '}
        <strong style={{ color: tk.emerald }}>{formatMoney(totalPrice, offerCur)}</strong>.
        Retrouvez votre commande dans "Mes réservations".
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={() => navigate('/app/marketplace/my-kilos-bought')}
          style={{
            padding: '12px 28px', borderRadius: 10, background: '#347FC5',
            color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Voir mes réservations
        </button>
        <button
          onClick={() => navigate('/app/marketplace/kilos')}
          style={{
            padding: '12px 28px', borderRadius: 10,
            border: `1.5px solid ${tk.border}`, background: '#fff',
            fontSize: 14, fontWeight: 500, color: tk.textSec, cursor: 'pointer',
          }}
        >
          Retour aux offres
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: tk.surface }}>

      {/* ─────────────── HERO ─────────────── */}
      <section className="easy-internal-header" style={{
        position: 'relative', height: 220,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}

        {/* Back button */}
        <button
          onClick={() => navigate('/app/marketplace/kilos')}
          style={{
            position: 'absolute', top: 20, left: 24, zIndex: 20,
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,.25)', borderRadius: 10,
            color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            padding: '7px 14px',
          }}
        >
          <ArrowLeftIcon style={{ width: 14, height: 14 }} />
          Retour
        </button>

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#172F50', padding: '0 24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
            padding: '6px 16px', marginBottom: 16,
          }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#6ee7b7' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
              RÉSERVER DES KILOS
            </span>
          </div>
          <div style={{ fontSize: 'clamp(20px,3vw,30px)', fontWeight: 800, fontFamily: "'Open Sans',Arial,sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            {offer.originCountry}
            <ArrowRightIcon style={{ width: 20, height: 20, opacity: .7 }} />
            {offer.destinationCountry}
          </div>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─────────────── CONTENU ─────────────── */}
      <div className="kilo-detail-grid page-content" style={{ maxWidth: 900, margin: '0 auto', padding: '28px 20px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── Colonne gauche : détails de l'offre ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Carte principale */}
          <div style={{ background: '#fff', borderRadius: 18, border: `1.5px solid ${tk.border}`, overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${tk.border}`, background: tk.surface }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                  background: chip.bg, color: chip.color, letterSpacing: '.04em',
                }}>
                  {chip.label}
                </span>
                <span style={{ fontSize: 28, fontWeight: 800, color: tk.emerald, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                  {formatMoney(offer.pricePerKg, offerCur)} <span style={{ fontSize: 14, fontWeight: 600 }}>/kg</span>
                </span>
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              {/* Progression */}
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: tk.textSec }}>Disponible</span>
                  <span style={{ fontWeight: 700, color: tk.ink }}>{remaining} kg / {offer.availableWeight} kg</span>
                </div>
                <div style={{ height: 8, borderRadius: 99, background: tk.border }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    background: pct >= 90 ? tk.rose : pct >= 60 ? tk.amber : tk.emerald,
                    width: `${pct}%`, transition: 'width .4s',
                  }} />
                </div>
                <div style={{ fontSize: 11, color: tk.textMut, marginTop: 4 }}>{pct}% réservé</div>
              </div>

              {/* Infos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <InfoRow icon={CalendarDaysIcon} label="Date de départ" value={fmt(offer.departureDate)} />
                {offer.arrivalDate && <InfoRow icon={CalendarDaysIcon} label="Arrivée estimée" value={fmt(offer.arrivalDate)} />}
                {offer.description && (
                  <div style={{ paddingTop: 10, borderTop: `1px solid ${tk.border}` }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Description</div>
                    <p style={{ fontSize: 13, color: tk.textSec, lineHeight: 1.6 }}>{offer.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Carte vendeur */}
          {offer.seller && (
            <div style={{ background: '#fff', borderRadius: 18, border: `1.5px solid ${tk.border}`, padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <UserCircleIcon style={{ width: 16, height: 16, color: tk.accent }} />
                <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', color: tk.textMut }}>Vendeur</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: `${tk.accent}15`, color: tk.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, fontWeight: 700,
                }}>
                  {offer.seller.firstName?.[0]}{offer.seller.lastName?.[0]}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: tk.ink }}>
                    {offer.seller.firstName} {offer.seller.lastName}
                  </div>
                  {offer.seller.email && (
                    <a href={`mailto:${offer.seller.email}`} style={{ fontSize: 12, color: tk.accent, textDecoration: 'none' }}>
                      {offer.seller.email}
                    </a>
                  )}
                </div>
              </div>
              {offer.agency && (
                <div style={{ marginTop: 12, padding: '8px 12px', background: tk.surface, borderRadius: 10, fontSize: 12, color: tk.textSec }}>
                  🏢 {offer.agency.name}{offer.agency.code ? ` (${offer.agency.code})` : ''}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Colonne droite : formulaire de réservation ── */}
        <div>
          <div style={{ background: '#fff', borderRadius: 18, border: `1.5px solid ${tk.border}`, overflow: 'hidden' }}>
            <div style={{
              padding: '16px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${tk.emerald}12`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ScaleIcon style={{ width: 18, height: 18, color: tk.emerald }} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: tk.ink }}>Réserver des kilos</div>
                <div style={{ fontSize: 11, color: tk.textMut }}>Maximum disponible : {remaining} kg</div>
              </div>
            </div>

            {!canReserve ? (
              <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                <ExclamationTriangleIcon style={{ width: 48, height: 48, color: tk.amber, margin: '0 auto 12px' }} />
                <div style={{ fontSize: 15, fontWeight: 600, color: tk.ink, marginBottom: 6 }}>
                  {offer.status === 'full' ? 'Cette offre est complète' : 'Offre non disponible'}
                </div>
                <div style={{ fontSize: 13, color: tk.textSec }}>
                  Il ne reste plus de place disponible sur cette offre.
                </div>
              </div>
            ) : (
              <form onSubmit={handleReserve} style={{ padding: '20px' }}>

                {/* Poids */}
                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, display: 'block', marginBottom: 6 }}>
                    <ScaleIcon style={{ width: 14, height: 14, display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                    Poids à réserver (kg) <span style={{ color: tk.rose }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max={remaining}
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    style={{ ...inputStyle, borderColor: weightError ? tk.rose : weight ? tk.emerald : tk.border }}
                    placeholder={`Max : ${remaining} kg`}
                    required
                  />
                  {weightError && (
                    <p style={{ marginTop: 4, fontSize: 11, color: tk.rose }}>
                      Maximum disponible : {remaining} kg
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, display: 'block', marginBottom: 6 }}>
                    <DocumentTextIcon style={{ width: 14, height: 14, display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                    Notes / Instructions (optionnel)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                    placeholder="Type de marchandise, instructions de livraison…"
                  />
                </div>

                {/* Récapitulatif prix */}
                {totalPrice && !weightError && (
                  <div style={{
                    background: 'rgba(5,150,105,.06)', borderRadius: 12, padding: 16,
                    border: '1px solid rgba(5,150,105,.2)', marginBottom: 20,
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: tk.textSec }}>
                        <span>{weight} kg × {formatUnitPrice(offer.pricePerKg, offerCur)}</span>
                      </div>
                      <div style={{ height: 1, background: 'rgba(5,150,105,.15)' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: tk.ink }}>Total à payer</span>
                        <span style={{ fontSize: 24, fontWeight: 800, color: tk.emerald, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                          {formatMoney(totalPrice, offerCur)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Boutons */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => navigate('/app/marketplace/kilos')}
                    style={{
                      flex: 1, padding: '11px 16px', borderRadius: 10,
                      border: `1.5px solid ${tk.border}`, background: '#fff',
                      fontSize: 13, fontWeight: 500, color: tk.textSec, cursor: 'pointer',
                    }}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || weightError || !weight}
                    style={{
                      flex: 2, padding: '11px 16px', borderRadius: 10,
                      background: tk.emerald, color: '#fff', border: 'none',
                      fontSize: 14, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer',
                      opacity: (submitting || weightError || !weight) ? 0.65 : 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'all .15s',
                    }}
                  >
                    {submitting ? (
                      <>
                        <div style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .6s linear infinite' }} />
                        Réservation…
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon style={{ width: 18, height: 18 }} />
                        Confirmer la réservation
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>


      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 767px) {
          .kilo-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

/* ── Helper row ── */
const InfoRow = ({ icon: Icon, label, value }: { icon: IconComponent; label: string; value?: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
    <Icon style={{ width: 15, height: 15, color: tk.textMut, flexShrink: 0, marginTop: 1 }} />
    <div>
      <span style={{ color: tk.textSec }}>{label} : </span>
      <strong style={{ color: tk.ink }}>{value}</strong>
    </div>
  </div>
);

export default BuyKilos;
