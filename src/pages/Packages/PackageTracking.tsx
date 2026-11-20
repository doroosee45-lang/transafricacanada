import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapPinIcon, ClockIcon, ArrowLeftIcon, ShareIcon,
  TruckIcon, SparklesIcon, CheckCircleIcon, CalendarIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import WebSocketService from '../../services/websocket';
import type { HttpError } from '../../types/api';
import type { Package, TrackingEvent } from '../../types/models';
import type { IconComponent } from '../../types/ui';

interface StatusTone { bg: string; color: string; border: string; dot: string }
interface StatusConfig extends StatusTone { label: string; emoji: string }

/** Mise à jour temps réel émise par le serveur (room tracking_<id> ou tracking_<numéro>). */
interface TrackingUpdate {
  packageId?: string;
  trackingNumber?: string;
  status?: string;
  location?: string;
  description?: string;
  timestamp?: string;
}

/* ─────────────────────────────────────────────
   DESIGN TOKENS — identiques à ClientsList
───────────────────────────────────────────── */
const tk = {
  ink:        '#172F50',
  ink80:      '#172F50',
  surface:    '#F7FAFE',
  surf2:      '#EDF5FC',
  border:     '#DCE9F5',
  accent:     '#4D91D9',
  accentDark: '#347FC5',
  emerald:    '#059669',
  amber:      '#d97706',
  rose:       '#dc2626',
  purple:     '#7c3aed',
  orange:     '#ea580c',
  textSec:    '#52677D',
  textMut:    '#8295A8',
};

/* ─────────────────────────────────────────────
   CONFIG STATUTS & ÉTAPES
───────────────────────────────────────────── */
/* Les statuts stockés par l'API sont les valeurs de l'enum Package.status (anglais).
   Les libellés français historiques sont acceptés en repli pour d'anciens événements. */
const tone = (c: string): StatusTone => ({ bg: `${c}10`, color: c, border: `${c}20`, dot: c });

const STATUS_CONFIG: Record<string, StatusConfig> = {
  registered:       { label: 'Enregistré',            emoji: '📦', ...tone(tk.accent) },
  preparing:        { label: 'En préparation',        emoji: '🗃️', ...tone(tk.accent) },
  transit:          { label: 'En transit',            emoji: '🚚', ...tone(tk.accent) },
  customs:          { label: 'En douane',             emoji: '🛃', ...tone(tk.purple) },
  arrived:          { label: 'Arrivé',                emoji: '🏢', ...tone(tk.purple) },
  out_for_delivery: { label: 'En cours de livraison', emoji: '🛵', ...tone(tk.amber) },
  delivered:        { label: 'Livré',                 emoji: '✅', ...tone(tk.emerald) },
  returned:         { label: 'Retourné',              emoji: '↩️', ...tone(tk.orange) },
  lost:             { label: 'Perdu',                 emoji: '⚠️', ...tone(tk.rose) },
};

const LEGACY_STATUS: Record<string, string> = {
  'pris en charge': 'registered',
  'en transit':     'transit',
  'arrivé au hub':  'arrived',
  'en livraison':   'out_for_delivery',
  'livré':          'delivered',
};

const normalizeStatus = (status?: string) => {
  const s = String(status || '').trim();
  return STATUS_CONFIG[s] ? s : (LEGACY_STATUS[s.toLowerCase()] || s);
};

const getStatusConfig = (status?: string): StatusConfig =>
  STATUS_CONFIG[normalizeStatus(status)] || { label: status || 'Inconnu', emoji: '📍', ...tone(tk.textMut) };

// Parcours nominal affiché dans la barre de progression (returned/lost sont des issues hors parcours).
const STEP_MAP = ['registered', 'preparing', 'transit', 'customs', 'arrived', 'out_for_delivery', 'delivered']
  .map((key) => ({ key, label: STATUS_CONFIG[key].label, emoji: STATUS_CONFIG[key].emoji }));

const stepIndex = (status?: string) => STEP_MAP.findIndex((s) => s.key === normalizeStatus(status));

// Étape atteinte : statut actuel du colis s'il fait partie du parcours, sinon la plus avancée de l'historique.
const getProgressIndex = (currentStatus: string | undefined, tracking: TrackingEvent[]) => {
  const current = stepIndex(currentStatus);
  if (current >= 0) return current;
  return tracking.reduce((max, t) => Math.max(max, stepIndex(t.status)), -1);
};

const eventDate = (event?: TrackingEvent | null) => event?.date || event?.timestamp || event?.createdAt || null;

const sortByDateDesc = (events: TrackingEvent[]) =>
  [...events].sort((a, b) => new Date(eventDate(b) || 0).getTime() - new Date(eventDate(a) || 0).getTime());

// Même normalisation que l'API : espaces retirés, majuscules.
const normalizeNumber = (value?: string | null) => String(value || '').replace(/\s+/g, '').toUpperCase();

const publicTrackingUrl = (number?: string) =>
  `${window.location.origin}/tracking/${encodeURIComponent(number || '')}`;

// ── Status Badge ──
const StatusBadge = ({ status }: { status?: string }) => {
  const cfg = getStatusConfig(status);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 12px', borderRadius: 99,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      fontSize: 11, fontWeight: 600, fontFamily: "'Open Sans', Arial, sans-serif",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot }} />
      {cfg.label}
    </span>
  );
};

// ── Section Block ──
const SectionBlock = ({ icon: Icon, iconColor = tk.accent, title, badge, children }: { icon: IconComponent; iconColor?: string; title: React.ReactNode; badge?: React.ReactNode; children: React.ReactNode }) => (
  <div style={{
    background: '#fff', borderRadius: 20,
    border: `1.5px solid ${tk.border}`,
    boxShadow: '0 2px 8px rgba(23,47,80,.05)',
    overflow: 'hidden', marginBottom: 24,
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
    }}>
      <span style={{
        width: 30, height: 30, borderRadius: 8, background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,.08)',
      }}>
        <Icon style={{ width: 14, height: 14, color: iconColor }} />
      </span>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
        textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans', Arial, sans-serif",
        flex: 1,
      }}>
        {title}
      </span>
      {badge}
    </div>
    <div style={{ padding: 20 }}>{children}</div>
  </div>
);

// ── Timeline Event ──
const TimelineEvent = ({ event, isFirst }: { event: TrackingEvent; isFirst: boolean }) => {
  const cfg = getStatusConfig(event.status);
  const when = eventDate(event);
  return (
    <div style={{ position: 'relative', paddingLeft: 56, paddingBottom: 24 }}>
      {/* Ligne verticale */}
      {!isFirst && (
        <div style={{
          position: 'absolute', left: 19, top: -20, bottom: 28,
          width: 2, background: tk.border,
        }} />
      )}
      
      {/* Cercle icône */}
      <div style={{
        position: 'absolute', left: 0, top: 0,
        width: 40, height: 40, borderRadius: '50%',
        background: isFirst ? cfg.bg : '#fff',
        border: `2px solid ${isFirst ? cfg.border : tk.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18,
        zIndex: 2,
      }}>
        {cfg.emoji}
      </div>

      {/* Contenu */}
      <div style={{
        background: isFirst ? cfg.bg : '#fff',
        border: `1.5px solid ${isFirst ? cfg.border : tk.border}`,
        borderRadius: 14, padding: '14px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: event.description ? 8 : 0 }}>
          <h4 style={{
            fontSize: 14, fontWeight: 600,
            color: isFirst ? cfg.color : tk.ink,
            fontFamily: "'Open Sans', Arial, sans-serif",
          }}>
            {cfg.label}
          </h4>
          {isFirst && (
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '.1em',
              textTransform: 'uppercase', color: cfg.color,
              background: '#fff', padding: '2px 8px', borderRadius: 99,
              border: `1px solid ${cfg.border}`,
            }}>
              Actuel
            </span>
          )}
        </div>

        {event.description && (
          <p style={{ fontSize: 13, color: tk.textSec, marginBottom: 10, lineHeight: 1.5 }}>
            {event.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {event.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <MapPinIcon style={{ width: 12, height: 12, color: tk.textMut }} />
              <span style={{ fontSize: 11, color: tk.textMut }}>{event.location}</span>
            </div>
          )}
          {when && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <ClockIcon style={{ width: 12, height: 12, color: tk.textMut }} />
              <span style={{ fontSize: 11, color: tk.textMut }}>
                {new Date(when).toLocaleString('fr-FR')}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
// Message affiché selon la réponse réelle de l'API (pas de succès ni d'échec simulé).
const loadErrorMessage = (caught: unknown) => {
  const err = caught as HttpError | null;
  const status = err?.response?.status;
  if (!err?.response) return 'Serveur injoignable. Vérifiez votre connexion puis réessayez.';
  if (status === 404) return 'Aucun colis ne correspond à ce numéro de suivi.';
  if (status === 400) return err.response.data?.message || 'Format de numéro de suivi invalide.';
  if (status === 403) return "Vous n'avez pas accès à ce colis.";
  if (status === 429) return 'Trop de recherches successives. Patientez quelques minutes avant de réessayer.';
  return 'Impossible de charger le suivi pour le moment. Réessayez plus tard.';
};

/**
 * Suivi d'un colis.
 * - /app/packages/:id/tracking      → par identifiant (utilisateur connecté)
 * - /app/packages/tracking?number=X → par numéro de suivi (utilisateur connecté)
 * - /tracking/:trackingNumber       → page publique (publicMode), lien partagé aux clients
 */
const PackageTracking = ({ publicMode = false }: { publicMode?: boolean }) => {
  const { id, trackingNumber: numberParam } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const trackingNumber = normalizeNumber(numberParam || searchParams.get('number')) || null;

  const searchBasePath = publicMode ? '/tracking' : '/app/packages/tracking';
  const searchUrlFor = (number: string) => (publicMode
    ? `/tracking/${encodeURIComponent(number)}`
    : `/app/packages/tracking?number=${encodeURIComponent(number)}`);

  const [package_, setPackage] = useState<Package | null>(null);
  const [tracking, setTracking] = useState<TrackingEvent[]>([]);
  const [loading, setLoading] = useState(Boolean(id || trackingNumber));
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [searchInput, setSearchInput] = useState(trackingNumber || '');

  useEffect(() => { setSearchInput(trackingNumber || ''); }, [trackingNumber]);

  /* ── Chargement : les réponses obsolètes (recherches successives) sont ignorées ── */
  useEffect(() => {
    let cancelled = false;

    if (!id && !trackingNumber) {
      setPackage(null); setTracking([]); setError(null); setLoading(false);
      return undefined;
    }

    const load = async () => {
      setLoading(true); setError(null);
      try {
        if (id) {
          const [pkgRes, trackRes] = await Promise.all([
            axios.get(`/packages/${id}`),
            axios.get(`/packages/${id}/tracking`),
          ]);
          if (cancelled) return;
          setPackage(pkgRes.data?.data || null);
          setTracking(sortByDateDesc(Array.isArray(trackRes.data) ? trackRes.data : []));
        } else {
          const res = await axios.get(`/packages/track/${encodeURIComponent(trackingNumber as string)}`);
          if (cancelled) return;
          const pkg = res.data?.data || null;
          setPackage(pkg);
          setTracking(sortByDateDesc(Array.isArray(pkg?.trackingHistory) ? pkg.trackingHistory : []));
        }
      } catch (err) {
        if (cancelled) return;
        setPackage(null); setTracking([]);
        setError(loadErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id, trackingNumber, reloadKey]);

  /* ── Temps réel : mise à jour de l'historique ET du statut affiché ── */
  const handleTrackingUpdate = useCallback((data: TrackingUpdate) => {
    const sameId     = id && String(data?.packageId) === String(id);
    const sameNumber = trackingNumber && normalizeNumber(data?.trackingNumber) === trackingNumber;
    if (!sameId && !sameNumber) return;

    const event: TrackingEvent = {
      status:      data.status,
      location:    data.location || '',
      description: data.description || '',
      date:        data.timestamp || new Date().toISOString(),
    };
    setTracking(prev => {
      // Le serveur émet vers deux rooms : on ignore un éventuel doublon du même événement.
      const duplicate = prev.some(e => e.status === event.status && String(eventDate(e)) === String(event.date));
      return duplicate ? prev : sortByDateDesc([event, ...prev]);
    });
    setPackage(prev => (prev ? { ...prev, status: data.status } : prev));
    toast.info('Mise à jour du suivi en temps réel');
  }, [id, trackingNumber]);

  useEffect(() => {
    if (!id && !trackingNumber) return undefined;
    WebSocketService.connect();
    if (id) WebSocketService.joinRoom(`tracking_${id}`);
    if (trackingNumber) WebSocketService.joinRoom(`tracking_${trackingNumber}`);
    WebSocketService.on('tracking_update', handleTrackingUpdate);
    return () => {
      WebSocketService.off('tracking_update', handleTrackingUpdate);
      if (id) WebSocketService.leaveRoom(`tracking_${id}`);
      if (trackingNumber) WebSocketService.leaveRoom(`tracking_${trackingNumber}`);
    };
  }, [id, trackingNumber, handleTrackingUpdate]);

  const submitSearch = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    const number = normalizeNumber(searchInput);
    if (!number) return;
    if (number === trackingNumber && !id) {
      setReloadKey(k => k + 1); // même numéro : relancer réellement la requête
    } else {
      navigate(searchUrlFor(number));
    }
  };

  const copyTrackingLink = async () => {
    try {
      await navigator.clipboard.writeText(publicTrackingUrl(package_?.trackingNumber));
      toast.success('Lien de suivi copié !');
    } catch {
      toast.error('Copie impossible : sélectionnez le lien et copiez-le manuellement.');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: tk.surface }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: `3px solid ${tk.border}`,
            borderTopColor: tk.accent,
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── Formulaire de recherche : aucun colis chargé (pas de numéro, ou numéro introuvable) ── */
  if (!package_) {
    return (
      <div style={{ minHeight: '100vh', background: tk.surface }}>
        <div style={{ maxWidth: 540, margin: '0 auto', padding: '64px 16px' }}>
          {publicMode && (
            <button type="button" onClick={() => navigate('/')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16, background: 'none', border: 'none', color: tk.textSec, fontSize: 13, cursor: 'pointer' }}>
              <ArrowLeftIcon style={{ width: 14, height: 14 }} /> Accueil Trans Africa Canada
            </button>
          )}
          <div className="trk-search-card" style={{
            background: '#fff', borderRadius: 24, padding: 40,
            border: `1.5px solid ${tk.border}`, boxShadow: '0 8px 32px rgba(23,47,80,.08)',
            textAlign: 'center',
          }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: `${tk.accent}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              {error ? <CubeIcon style={{ width: 32, height: 32, color: tk.textMut }} /> : <TruckIcon style={{ width: 32, height: 32, color: tk.accent }} />}
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 8 }}>Suivi de colis</h1>
            <p style={{ fontSize: 14, color: tk.textSec, marginBottom: 28 }}>Entrez le numéro de suivi inscrit sur votre bordereau.</p>
            <form onSubmit={submitSearch} className="trk-search-form" style={{ display: 'flex', gap: 10 }}>
              <label htmlFor="tracking-number" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                Numéro de suivi
              </label>
              <input
                id="tracking-number"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Ex : LGT-A1B2C3D4"
                autoComplete="off"
                maxLength={60}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'tracking-error' : undefined}
                style={{
                  flex: 1, minWidth: 0, padding: '12px 16px', borderRadius: 12,
                  border: `1.5px solid ${error ? tk.rose : tk.border}`, outline: 'none', fontSize: 14,
                  fontFamily: 'monospace', color: tk.ink, background: tk.surface, textTransform: 'uppercase',
                }}
              />
              <button
                type="submit"
                disabled={!normalizeNumber(searchInput)}
                style={{
                  padding: '12px 22px', borderRadius: 12, background: '#347FC5',
                  color: '#fff', border: 'none', fontWeight: 600, fontSize: 14,
                  cursor: normalizeNumber(searchInput) ? 'pointer' : 'not-allowed',
                  opacity: normalizeNumber(searchInput) ? 1 : 0.6,
                  fontFamily: "'Open Sans',Arial,sans-serif",
                }}
              >
                Suivre
              </button>
            </form>
            {error && (
              <p id="tracking-error" role="alert" style={{ color: tk.rose, fontSize: 13, marginTop: 14 }}>
                ⚠️ {error}{trackingNumber ? ` (${trackingNumber})` : ''}
              </p>
            )}
          </div>
        </div>
        <style>{`
          @media (max-width: 480px) {
            .trk-search-card { padding: 24px 16px !important; }
            .trk-search-form { flex-direction: column; }
          }
        `}</style>
      </div>
    );
  }

  const progressIdx = getProgressIndex(package_.status, tracking);
  const currentStepLabel = progressIdx >= 0 ? STEP_MAP[progressIdx].label : getStatusConfig(package_.status).label;
  const offRoute = ['returned', 'lost'].includes(normalizeStatus(package_.status));

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

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#172F50', padding: '0 24px', maxWidth: 640 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
            padding: '6px 16px', marginBottom: 16,
          }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#C5DCEF' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans', Arial, sans-serif" }}>
              SUIVI EN TEMPS RÉEL
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 8, fontFamily: "'Open Sans', Arial, sans-serif" }}>
            Colis{' '}
            <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              #{package_.trackingNumber}
            </span>
          </h1>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <StatusBadge status={package_.status} />
            <span style={{ fontSize: 12, color: '#172F50' }}>
              {tracking.length} événement{tracking.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─────────────── CONTENU ─────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 48px' }}>

        {/* Header actions */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16, marginBottom: 24,
        }}>
          <button
            type="button"
            onClick={() => {
              if (id) navigate(`/app/packages/${id}`);
              else if (publicMode) navigate('/');
              else navigate(searchBasePath);
            }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 20px', borderRadius: 10,
              background: '#fff', border: `1.5px solid ${tk.border}`,
              fontSize: 13, fontWeight: 500, color: tk.textSec,
              cursor: 'pointer', transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = tk.surface; e.currentTarget.style.borderColor = tk.accent; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
          >
            <ArrowLeftIcon style={{ width: 14, height: 14 }} />
            {id ? 'Retour aux détails' : publicMode ? 'Accueil' : 'Nouvelle recherche'}
          </button>

          <button
            type="button"
            onClick={copyTrackingLink}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 20px', borderRadius: 10,
              background: '#347FC5', color: '#fff', border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(77,145,217,.25)',
            }}
          >
            <ShareIcon style={{ width: 14, height: 14 }} />
            Partager le lien
          </button>
        </div>

        {/* Grille principale */}
        <div className="trk-grid" style={{ display: 'grid', gridTemplateColumns: '320px minmax(0, 1fr)', gap: 28 }}>

          {/* Sidebar */}
          <div>
            <div style={{
              background: '#fff', borderRadius: 20,
              border: `1.5px solid ${tk.border}`,
              overflow: 'hidden', position: 'sticky', top: 24,
            }}>
              {/* Header coloré */}
              <div style={{
                background: `linear-gradient(135deg, ${tk.ink} 0%, ${tk.ink80} 100%)`,
                padding: '24px 20px', textAlign: 'center',
              }}>
                <div style={{
                  width: 72, height: 72, margin: '0 auto 12px',
                  background: 'rgba(255,255,255,.1)', borderRadius: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 36,
                }}>
                  {getStatusConfig(package_.status).emoji}
                </div>
                <StatusBadge status={package_.status} />
                <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 11, marginTop: 10, fontFamily: 'monospace' }}>
                  {package_.trackingNumber}
                </p>
              </div>

              {/* Infos rapides */}
              <div style={{ padding: 16 }}>
                <div style={{
                  background: tk.surface, borderRadius: 12, padding: 12,
                  border: `1px solid ${tk.border}`, marginBottom: 12,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <CheckCircleIcon style={{ width: 14, height: 14, color: tk.emerald }} />
                    <span style={{ fontSize: 11, fontWeight: 500, color: tk.textSec }}>Progression</span>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: tk.ink }}>
                    {offRoute
                      ? getStatusConfig(package_.status).label
                      : `${currentStepLabel} • ${Math.max(0, progressIdx + 1)}/${STEP_MAP.length}`}
                  </p>
                  {package_.origin && package_.destination && (
                    <p style={{ fontSize: 12, color: tk.textSec, marginTop: 6 }}>
                      {package_.origin} → {package_.destination}
                    </p>
                  )}
                </div>

                <div style={{
                  background: tk.surface, borderRadius: 12, padding: 12,
                  border: `1px solid ${tk.border}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <ClockIcon style={{ width: 14, height: 14, color: tk.accent }} />
                    <span style={{ fontSize: 11, fontWeight: 500, color: tk.textSec }}>Événements</span>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 700, color: tk.ink }}>
                    {tracking.length} enregistré{tracking.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {package_.estimatedDelivery && (
                  <div style={{
                    marginTop: 12, background: `${tk.emerald}08`, borderRadius: 12, padding: 12,
                    border: `1px solid ${tk.emerald}20`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <CalendarIcon style={{ width: 14, height: 14, color: tk.emerald }} />
                      <span style={{ fontSize: 11, fontWeight: 500, color: tk.emerald }}>Livraison estimée</span>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: tk.emerald }}>
                      {new Date(package_.estimatedDelivery).toLocaleDateString('fr-FR', {
                        weekday: 'long', day: 'numeric', month: 'long',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div>

            {/* Progress steps */}
            <SectionBlock icon={TruckIcon} title="Progression du colis">
              <div style={{ position: 'relative', padding: '8px 0 20px' }}>
                {/* Barre de progression */}
                <div style={{
                  position: 'absolute', top: 28, left: '5%', right: '5%',
                  height: 3, background: tk.border, borderRadius: 99, zIndex: 0,
                }}>
                  <div style={{
                    height: '100%', borderRadius: 99,
                    background: `linear-gradient(90deg, ${tk.accent}, ${tk.emerald})`,
                    width: progressIdx < 0 ? '0%' : `${(progressIdx / (STEP_MAP.length - 1)) * 100}%`,
                    transition: 'width 0.6s ease',
                  }} />
                </div>

                {/* Étapes */}
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                  {STEP_MAP.map((step, i) => {
                    const done = i < progressIdx;
                    const active = i === progressIdx;
                    return (
                      <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%',
                          background: done ? tk.emerald : active ? tk.accent : '#fff',
                          border: `2px solid ${done ? tk.emerald : active ? tk.accent : tk.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: done ? 14 : 18,
                          color: done || active ? '#fff' : tk.textMut,
                          boxShadow: active ? `0 0 0 4px ${tk.accent}15` : 'none',
                          transition: 'all 0.3s',
                        }}>
                          {done ? '✓' : step.emoji}
                        </div>
                        <span className="trk-step-label" style={{
                          fontSize: 10, fontWeight: active || done ? 600 : 400,
                          color: active ? tk.accent : done ? tk.emerald : tk.textMut,
                          textAlign: 'center',
                        }}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </SectionBlock>

            {/* Timeline historique */}
            <SectionBlock
              icon={ClockIcon}
              title="Historique de suivi"
              badge={
                <span style={{
                  padding: '3px 10px', borderRadius: 99,
                  background: 'rgba(77,145,217,.08)', color: tk.accent,
                  fontSize: 11, fontWeight: 700, fontFamily: "'Open Sans', Arial, sans-serif",
                }}>
                  {tracking.length} événement{tracking.length !== 1 ? 's' : ''}
                </span>
              }
            >
              {tracking.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px', color: tk.textMut }}>
                  <ClockIcon style={{ width: 48, height: 48, margin: '0 auto 12px', opacity: 0.5 }} />
                  <p>Aucune information de suivi disponible</p>
                </div>
              ) : (
                <div>
                  {tracking.map((event, index) => (
                    <TimelineEvent
                      key={event._id || index}
                      event={event}
                      isFirst={index === 0}
                    />
                  ))}
                </div>
              )}
            </SectionBlock>

            {/* Partager le lien */}
            <SectionBlock icon={ShareIcon} title="Partager le suivi">
              <p style={{ fontSize: 13, color: tk.textSec, marginBottom: 16 }}>
                Vos clients peuvent suivre leur colis en temps réel via ce lien.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <input
                  type="text"
                  readOnly
                  value={publicTrackingUrl(package_.trackingNumber)}
                  aria-label="Lien public de suivi"
                  onFocus={e => e.target.select()}
                  style={{
                    flex: 1, minWidth: 0, padding: '10px 14px', borderRadius: 10,
                    background: tk.surface, border: `1.5px solid ${tk.border}`,
                    fontSize: 12, color: tk.textSec, fontFamily: 'monospace',
                    outline: 'none',
                  }}
                />
                <button
                  onClick={copyTrackingLink}
                  style={{
                    padding: '10px 24px', borderRadius: 10,
                    background: '#347FC5', color: '#fff', border: 'none',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Copier
                </button>
              </div>
            </SectionBlock>
          </div>
        </div>
      </div>


      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .trk-grid { grid-template-columns: minmax(0, 1fr) !important; }
          .trk-grid > div:first-child > div { position: static !important; }
        }
        @media (max-width: 560px) {
          .trk-step-label { display: none; }
        }
      `}</style>
    </div>
  );
};

export default PackageTracking;