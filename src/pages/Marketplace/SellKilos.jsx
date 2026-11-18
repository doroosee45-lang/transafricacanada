import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { COUNTRY_OPTIONS } from '../../config/currencies';
import {
  ScaleIcon,
  SparklesIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  MapPinIcon,
  DocumentTextIcon,
  CurrencyEuroIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { formatMoney, formatUnitPrice, getCurrency } from '../../config/currencies';

/* ─────────────────────────────────────────────
   DESIGN TOKENS — identiques à ClientsList
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
  emeraldLight: '#d1fae5',
  amber:      '#d97706',
  rose:       '#dc2626',
  textSec:    '#4b5a6e',
  textMut:    '#8494a9',
};

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  background: '#fff', color: tk.ink, fontSize: 14,
  border: `1.5px solid ${tk.border}`, outline: 'none',
  fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s ease',
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: 100,
};

const SellKilos = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      originCountry:      '',
      destinationCountry: '',
      description:        '',
      availableWeight:    '',
      pricePerKg:         '',
      departureDate:      '',
      arrivalDate:        '',
      terms:              false,
    },
  });

  const availableWeight = watch('availableWeight') || 0;
  const pricePerKg      = watch('pricePerKg')      || 0;
  const totalPrice      = availableWeight * pricePerKg;
  // Devise de l'offre = devise du pays de départ (fixée par le serveur à l'enregistrement).
  const offerCur        = getCurrency(watch('originCountry'))?.code || null;

  const onSubmit = async (data) => {
    if (!data.terms) {
      toast.error('Vous devez accepter les conditions générales');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/marketplace/kilos', {
        originCountry:      data.originCountry,
        destinationCountry: data.destinationCountry,
        description:        data.description,
        availableWeight:    parseFloat(data.availableWeight),
        pricePerKg:         parseFloat(data.pricePerKg),
        departureDate:      data.departureDate,
        arrivalDate:        data.arrivalDate || undefined,
      });

      toast.success('Offre de kilos publiée avec succès !');
      navigate('/app/marketplace/kilos');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la publication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: tk.surface }}>

      {/* ─────────────── HERO — identique à ClientsList ─────────────── */}
      <section className="easy-internal-header" style={{
        position: 'relative', height: 280,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#37312a', padding: '0 24px', maxWidth: 640 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
            padding: '6px 16px', marginBottom: 18,
          }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#ecd5a3' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
              VENTE DE KILOS
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Vendez votre espace de transport{' '}
            <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              et optimisez vos revenus
            </span>
          </h1>
          <p style={{ color: '#37312a', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Proposez vos kilos disponibles aux autres expéditeurs et maximisez l'utilisation de votre capacité.
          </p>

          {/* Boutons style ClientsList */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/app/marketplace/my-kilos-bought')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 24px', borderRadius: 12,
                background: '#fff', color: tk.ink,
                border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.background = tk.surface; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#fff'; }}
            >
              <ShoppingBagIcon style={{ width: 16, height: 16 }} />
              Mes achats
            </button>
            <button
              onClick={() => navigate('/app/marketplace/my-kilos-sold')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 24px', borderRadius: 12,
                background: tk.accent, color: '#fff',
                border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
                boxShadow: '0 4px 12px rgba(167,123,40,.3)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.background = tk.accentDark; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = tk.accent; }}
            >
              <ShoppingBagIcon style={{ width: 16, height: 16 }} />
              Mes ventes
            </button>
          </div>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─────────────── FORMULAIRE ─────────────── */}
      <div className="page-content" style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 48px' }}>
        <div style={{
          background: '#fff', borderRadius: 20,
          border: `1.5px solid ${tk.border}`,
          boxShadow: '0 2px 8px rgba(23,22,20,.05)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 24px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `${tk.emerald}10`, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <ScaleIcon style={{ width: 20, height: 20, color: tk.emerald }} />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: tk.ink }}>Publier une annonce de vente</h2>
                <p style={{ fontSize: 12, color: tk.textMut, marginTop: 2 }}>Remplissez les informations ci-dessous</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 24 }}>

            {/* Section 1 : Trajet */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <MapPinIcon style={{ width: 16, height: 16, color: tk.emerald }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: tk.ink }}>Trajet</span>
              </div>

              <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                    Pays d'origine <span style={{ color: tk.rose }}>*</span>
                  </label>
                  <select
                    {...register('originCountry', { required: "Le pays d'origine est obligatoire" })}
                    style={{ ...inputStyle, borderColor: errors.originCountry ? tk.rose : tk.border }}
                  >
                    <option value="">— Sélectionner —</option>
                    {COUNTRY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  {errors.originCountry && <p style={{ marginTop: 4, fontSize: 11, color: tk.rose }}>{errors.originCountry.message}</p>}
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                    Pays de destination <span style={{ color: tk.rose }}>*</span>
                  </label>
                  <select
                    {...register('destinationCountry', { required: 'Le pays de destination est obligatoire' })}
                    style={{ ...inputStyle, borderColor: errors.destinationCountry ? tk.rose : tk.border }}
                  >
                    <option value="">— Sélectionner —</option>
                    {COUNTRY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  {errors.destinationCountry && <p style={{ marginTop: 4, fontSize: 11, color: tk.rose }}>{errors.destinationCountry.message}</p>}
                </div>
              </div>
            </div>

            {/* Section 2 : Détails techniques */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <ScaleIcon style={{ width: 16, height: 16, color: tk.emerald }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: tk.ink }}>Détails techniques</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                    Poids disponible (kg) <span style={{ color: tk.rose }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('availableWeight', {
                      required: 'Le poids est obligatoire',
                      min: { value: 1, message: 'Minimum 1 kg' },
                    })}
                    style={{ ...inputStyle, borderColor: errors.availableWeight ? tk.rose : tk.border }}
                    placeholder="Ex: 50"
                  />
                  {errors.availableWeight && <p style={{ marginTop: 4, fontSize: 11, color: tk.rose }}>{errors.availableWeight.message}</p>}
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                    <CurrencyEuroIcon style={{ width: 14, height: 14, display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                    Prix par kg ({offerCur || 'devise du pays de départ'}) <span style={{ color: tk.rose }}>*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('pricePerKg', {
                      required: 'Le prix est obligatoire',
                      min: { value: 0.01, message: 'Le prix doit être positif' },
                    })}
                    style={{ ...inputStyle, borderColor: errors.pricePerKg ? tk.rose : tk.border }}
                    placeholder="Ex: 2.50"
                  />
                  {errors.pricePerKg && <p style={{ marginTop: 4, fontSize: 11, color: tk.rose }}>{errors.pricePerKg.message}</p>}
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                    <CalendarIcon style={{ width: 14, height: 14, display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                    Date de départ <span style={{ color: tk.rose }}>*</span>
                  </label>
                  <input
                    type="date"
                    {...register('departureDate', { required: 'La date de départ est obligatoire' })}
                    style={{ ...inputStyle, borderColor: errors.departureDate ? tk.rose : tk.border }}
                  />
                  {errors.departureDate && <p style={{ marginTop: 4, fontSize: 11, color: tk.rose }}>{errors.departureDate.message}</p>}
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                    <CalendarIcon style={{ width: 14, height: 14, display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
                    Date d'arrivée estimée
                  </label>
                  <input
                    type="date"
                    {...register('arrivalDate')}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Section 3 : Description */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <DocumentTextIcon style={{ width: 16, height: 16, color: tk.emerald }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: tk.ink }}>Description (optionnelle)</span>
              </div>
              <textarea
                {...register('description')}
                rows={4}
                style={textareaStyle}
                placeholder="Conditions, type de marchandise acceptée, restrictions…"
              />
            </div>

            {/* Section 4 : Récapitulatif */}
            <div style={{
              background: `${tk.emerald}04`, borderRadius: 16, padding: 20,
              border: `1px solid ${tk.emerald}20`, marginBottom: 28,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <CurrencyEuroIcon style={{ width: 16, height: 16, color: tk.emerald }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: tk.emerald }}>Récapitulatif de l'offre</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ fontSize: 13, color: tk.textSec }}>Poids proposé :</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: tk.ink }}>{availableWeight} kg</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ fontSize: 13, color: tk.textSec }}>Prix unitaire :</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: tk.ink }}>{formatUnitPrice(pricePerKg, offerCur)}</span>
                </div>
                <div style={{ height: 1, background: `${tk.emerald}20`, margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 4px' }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: tk.ink }}>Total estimé :</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: tk.emerald }}>{formatMoney(totalPrice, offerCur)}</span>
                </div>
              </div>
            </div>

            {/* Section 5 : Conditions */}
            <div style={{
              background: tk.surface, borderRadius: 12, padding: 16,
              border: `1px solid ${tk.border}`, marginBottom: 24,
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  {...register('terms')}
                  style={{ width: 16, height: 16, marginTop: 2, accentColor: tk.emerald }}
                />
                <span style={{ fontSize: 13, color: tk.textSec }}>
                  J'accepte les{' '}
                  <button type="button" style={{ color: tk.emerald, background: 'none', border: 'none', cursor: 'pointer' }}>
                    conditions générales de la marketplace
                  </button>{' '}
                  et certifie que les informations fournies sont exactes.
                </span>
              </label>
            </div>

            {/* Boutons d'action */}
            <div className="form-actions" style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
              <button
                type="button"
                onClick={() => navigate('/app/marketplace/kilos')}
                style={{
                  flex: 1, padding: '12px 16px', borderRadius: 10,
                  border: `1.5px solid ${tk.border}`, background: '#fff',
                  fontSize: 14, fontWeight: 500, color: tk.textSec,
                  cursor: 'pointer', transition: 'all .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = tk.surface; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1, padding: '12px 16px', borderRadius: 10,
                  background: tk.emerald, color: '#fff', border: 'none',
                  fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: loading ? 0.6 : 1, transition: 'all .15s',
                }}
              >
                {loading ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                    Publication en cours...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon style={{ width: 18, height: 18 }} />
                    Publier l'annonce
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>


      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default SellKilos;