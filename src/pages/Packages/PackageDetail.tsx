import FinancialSummary from '../../components/Finance/FinancialSummary';
import PackagePayments from '../../components/Finance/PackagePayments';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon, PrinterIcon, TruckIcon, MapPinIcon,
  CubeIcon, UserIcon, CurrencyEuroIcon, CalendarIcon,
  CheckCircleIcon, SparklesIcon,
  ShareIcon, BanknotesIcon, PlusCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { formatMoney, packageCurrency } from '../../config/currencies';
import { useAuth } from '../../components/Context/AuthContext';
import Timeline from '../../components/Common/Timeline';
import Modal from '../../components/Common/Modal';
import type { Package, Payment, TrackingEvent } from '../../types/models';
import type { IconComponent } from '../../types/ui';

interface StatusConfig { bg: string; color: string; border: string; dot: string; label: string }

/* ─────────────────────────────────────────────
   DESIGN TOKENS — identiques à AddPackage
───────────────────────────────────────────── */
const tk = {
  ink:     '#172F50',
  ink80:   '#172F50',
  surface: '#F7FAFE',
  surf2:   '#EDF5FC',
  border:  '#DCE9F5',
  accent:  '#4D91D9',
  emerald: '#059669',
  amber:   '#d97706',
  rose:    '#dc2626',
  textSec: '#52677D',
  textMut: '#8295A8',
};

/* ─────────────────────────────────────────────
   MICRO COMPONENTS (même style qu'AddPackage)
───────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  background: '#fff', color: tk.ink, fontSize: 14,
  border: `1.5px solid ${tk.border}`, outline: 'none',
  fontFamily: "'DM Sans', sans-serif", transition: 'border .18s, box-shadow .18s',
};

/* Section block identique à AddPackage */
const SectionBlock = ({ icon: Icon, iconColor = tk.accent, title, children }: { icon: IconComponent; iconColor?: string; title: React.ReactNode; children: React.ReactNode }) => (
  <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(23,47,80,.05)' }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 18px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
    }}>
      <span style={{
        width: 30, height: 30, borderRadius: 8, background: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,.08)',
      }}>
        <Icon style={{ width: 15, height: 15, color: iconColor }} />
      </span>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
        textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif",
      }}>
        {title}
      </span>
    </div>
    <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {children}
    </div>
  </div>
);

const RecapRow = ({ label, value }: { label: React.ReactNode; value: React.ReactNode }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '7px 0', borderBottom: `1px solid ${tk.surface}`,
  }}>
    <span style={{ fontSize: 13, color: tk.textMut }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: 500, color: tk.ink, textAlign: 'right', maxWidth: '60%' }}>{value || '—'}</span>
  </div>
);

/* Status badge */
const STATUS_CONFIG: Record<string, StatusConfig> = {
  registered:       { bg: '#fef3c7', color: '#92400e', border: '#fde68a', dot: '#f59e0b',  label: 'Enregistré' },
  preparing:        { bg: '#EDF5FC', color: '#172F50', border: '#DCE9F5', dot: '#79B5E8',  label: 'En préparation' },
  transit:          { bg: '#EDF5FC', color: '#172F50', border: '#DCE9F5', dot: '#79B5E8',  label: 'En transit' },
  customs:          { bg: '#fef3c7', color: '#92400e', border: '#fde68a', dot: '#f59e0b',  label: 'En douane' },
  arrived:          { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0', dot: '#10b981',  label: 'Arrivé' },
  out_for_delivery: { bg: '#EDF5FC', color: '#172F50', border: '#DCE9F5', dot: '#79B5E8',  label: 'En livraison' },
  delivered:        { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0', dot: '#10b981',  label: 'Livré' },
  returned:         { bg: '#fee2e2', color: '#991b1b', border: '#fecaca', dot: '#ef4444',  label: 'Retourné' },
  lost:             { bg: '#fee2e2', color: '#991b1b', border: '#fecaca', dot: '#ef4444',  label: 'Perdu' },
};

const StatusBadge = ({ status }: { status?: string }) => {
  const cfg = STATUS_CONFIG[status ?? ''] || STATUS_CONFIG['transit'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 12px', borderRadius: 99,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      fontSize: 12, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif", letterSpacing: '.02em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
      {cfg.label || status}
    </span>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const PackageDetail = () => {
  // Fiches clients : écran réservé à admin / superadmin / manager (routes App.jsx).
  const { user: authUser } = useAuth();
  const canOpenClients = !!authUser?.role && ['admin', 'superadmin', 'manager'].includes(authUser.role);
  const { id } = useParams();
  const navigate = useNavigate();
  const [package_, setPackage] = useState<Package | null>(null);
  const [tracking, setTracking] = useState<TrackingEvent[]>([]);
  const [clientPackages, setClientPackages] = useState<Package[]>([]);
  const [linkedPayment,  setLinkedPayment]  = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState({ status: '', location: '', description: '' });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchPackageData(); }, [id]);

  const fetchPackageData = async () => {
    try {
      const [pkgRes, trackRes] = await Promise.all([
        axios.get(`/packages/${id}`),
        axios.get(`/packages/${id}/tracking`),
      ]);
      const pkg = pkgRes.data?.data || pkgRes.data;
      setPackage(pkg);
      setTracking(Array.isArray(trackRes.data) ? trackRes.data : []);

      // Fetch autres colis du même expéditeur
      if (pkg?.sender?._id) {
        try {
          const clientRes = await axios.get(`/clients/${pkg.sender._id}/packages?limit=11`);
          const all = Array.isArray(clientRes.data?.data) ? clientRes.data.data : [];
          setClientPackages(all.filter((p: Package) => p._id?.toString() !== id));
        } catch {}
      }

      // Fetch paiement lié au colis
      try {
        const payRes = await axios.get(`/payments?packageId=${id}&limit=1`);
        const pays = Array.isArray(payRes.data?.data) ? payRes.data.data : [];
        // Chercher dans pays[] ceux qui ont package === id OU packages contient id
        const linked = pays.find((p: Payment) =>
          (typeof p.package === 'string' ? p.package === id : p.package?._id === id) ||
          p.packages?.some(pk => (typeof pk === 'string' ? pk : pk._id) === id)
        );
        setLinkedPayment(linked || null);
      } catch {}
    } catch {
      toast.error('Erreur lors du chargement');
      navigate('/app/packages');
    } finally { setLoading(false); }
  };

  const handleStatusUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`/packages/${id}/status`, newStatus);
      toast.success('Statut mis à jour');
      setShowStatusModal(false);
      fetchPackageData();
      setNewStatus({ status: '', location: '', description: '' });
    } catch { toast.error('Erreur lors de la mise à jour'); }
  };

  // Étiquette Trans Africa Canada (100 × 150 mm, QR code de suivi réel) — pages/Packages/packageLabelPdf.js.
  const handleGenerateLabel = async () => {
    if (!package_) return;
    try {
      const { buildPackageLabelPdf } = await import('./packageLabelPdf');
      const doc = await buildPackageLabelPdf(package_, { statusLabel: STATUS_CONFIG[package_.status ?? '']?.label });
      doc.save(`etiquette-${package_.trackingNumber}.pdf`);
      toast.success('Étiquette PDF générée !');
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la génération de l'étiquette");
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/tracking/${package_?.trackingNumber}`;
    if (navigator.share) navigator.share({ title: 'Suivi colis', url }).catch(() => {});
    else { navigator.clipboard.writeText(url); toast.success('Lien copié !'); }
  };

  /* ── Loading ── */
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{
        width: 44, height: 44,
        border: `3px solid ${tk.surf2}`,
        borderTop: `3px solid ${tk.accent}`,
        borderRadius: '50%', animation: 'spin .8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!package_) return (
    <div style={{ textAlign: 'center', padding: '48px 0' }}>
      <p style={{ color: tk.rose, marginBottom: 16 }}>Colis non trouvé</p>
      <button onClick={() => navigate('/app/packages')} style={{
        padding: '10px 22px', borderRadius: 10, background: '#347FC5',
        color: '#fff', border: 'none', cursor: 'pointer',
        fontFamily: "'Open Sans',Arial,sans-serif", fontWeight: 600,
      }}>
        Retour à la liste
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ─────────────── HERO — même structure qu'AddPackage ─────────────── */}
      <section className="easy-internal-header" style={{
        position: 'relative', height: 260,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', marginBottom: 28, borderRadius: 24,
      }}>
        {/* Background avec overlay gradient */}
        {/* Fond decoratif retire : en-tete interne neutre. */}

        {/* Contenu hero */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#172F50', padding: '0 24px', maxWidth: 640 }}>
          {/* Badge status */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
            padding: '6px 16px', marginBottom: 18,
          }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#C5DCEF' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
              Détail du colis
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(22px,3vw,34px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 10, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Suivi{' '}
            <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              #{package_.trackingNumber}
            </span>
          </h1>

          {/* Status + date pill */}
          <div className="pd-hero-pill" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,.2)', borderRadius: 12,
            padding: '8px 20px', marginBottom: 18, flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <StatusBadge status={package_.status} />
            <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,.25)' }} />
            <span style={{ fontSize: 12, color: '#172F50', fontFamily: "'DM Sans',sans-serif" }}>
              Créé le {new Date(package_.createdAt as string).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>

            {/* Actions share + print */}
            <div style={{ display: 'flex', gap: 6, marginLeft: 4 }}>
              {[
                { icon: ShareIcon, fn: handleShare },
                { icon: PrinterIcon, fn: handleGenerateLabel },
              ].map(({ icon: Ic, fn }, i) => (
                <button key={i} onClick={fn} style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                  <Ic style={{ width: 13, height: 13, color: '#fff' }} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wave bottom identique */}
        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─────────────── BODY CARD — même wrapper qu'AddPackage ─────────────── */}
      <div style={{
        background: '#fff', borderRadius: 24,
        boxShadow: '0 8px 48px rgba(23,47,80,.08)',
        border: `1.5px solid ${tk.border}`, overflow: 'hidden',
      }}>

        {/* Header actions (dans la card, sous le hero) */}
        <div className="pd-header" style={{
          padding: '20px 32px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <button onClick={() => navigate('/app/packages')} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 18px', borderRadius: 10, background: '#fff',
            border: `1.5px solid ${tk.border}`, color: tk.textSec, cursor: 'pointer',
            fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans',sans-serif",
            boxShadow: '0 1px 4px rgba(0,0,0,.05)', transition: 'all .18s',
          }}>
            <ArrowLeftIcon style={{ width: 14, height: 14 }} /> Retour à la liste
          </button>

          <div className="pd-header-actions" style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleGenerateLabel} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #ffffff 0%, #EDF5FC 100%)',
              border: '1.5px solid #DCE9F5',
              color: '#172F50', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              fontFamily: "'Open Sans',Arial,sans-serif",
              boxShadow: '0 2px 8px rgba(77,145,217,.12)',
              transition: 'all .18s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#EDF5FC,#EDF5FC)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(77,145,217,.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg,#ffffff,#EDF5FC)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(77,145,217,.12)'; }}>
              <span style={{
                width: 22, height: 22, borderRadius: 6, background: '#4D91D9',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <PrinterIcon style={{ width: 12, height: 12, color: '#fff' }} />
              </span>
              Étiquette PDF
            </button>
            <button onClick={() => setShowStatusModal(true)} style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px',
              borderRadius: 10, background: '#347FC5', color: '#fff', border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
              boxShadow: '0 4px 18px rgba(77,145,217,.3)',
            }}>
              <TruckIcon style={{ width: 15, height: 15 }} /> Mettre à jour statut
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="pd-body" style={{ padding: '40px 40px 32px' }}>
          <div className="pd-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 40 }}>

            {/* ── Sidebar sticky (même style qu'AddPackage) ── */}
            <div>
              <div style={{ position: 'sticky', top: 24, borderRadius: 18, overflow: 'hidden', border: `1.5px solid ${tk.border}` }}>
                {/* Dark header */}
                <div style={{
                  background: `linear-gradient(145deg, ${tk.ink} 0%, ${tk.ink80} 100%)`,
                  padding: '28px 20px', textAlign: 'center',
                }}>
                  <div style={{
                    width: 80, height: 80, margin: '0 auto 16px',
                    background: 'rgba(255,255,255,.1)', borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <img src="https://cdn-icons-png.flaticon.com/512/2942/2942709.png" alt="" style={{ width: 56, height: 56, objectFit: 'contain' }} />
                  </div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 8,
                  }}>
                    <StatusBadge status={package_.status} />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, marginTop: 6, fontFamily: "'Open Sans',Arial,sans-serif", letterSpacing: '.06em' }}>
                    {package_.trackingNumber}
                  </p>
                </div>

                {/* Infos rapides dans la sidebar */}
                <div style={{ background: '#fff', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { label: 'Poids', value: `${package_.weight} kg`, icon: CubeIcon },
                    { label: 'Service', value: package_.service || 'Standard', icon: TruckIcon },
                    { label: 'Date expéd.', value: package_.expeditionDate ? new Date(package_.expeditionDate).toLocaleDateString('fr-FR') : '—', icon: CalendarIcon },
                    { label: 'Arrivée est.', value: package_.estimatedArrival || '—', icon: CheckCircleIcon, color: tk.emerald },
                  ].map(({ label, value, icon: Ic, color }, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                      borderRadius: 10, background: tk.surface,
                      border: `1px solid ${tk.border}`, marginBottom: 6,
                    }}>
                      <Ic style={{ width: 14, height: 14, color: color || tk.accent, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>{label}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: color || tk.ink }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Contenu principal (grille de cards) ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Photo colis si présente */}
              {package_.packageImageUrl && (
                <div style={{
                  border: `1.5px solid ${tk.border}`, borderRadius: 16, overflow: 'hidden',
                  background: '#fff', boxShadow: '0 2px 8px rgba(23,47,80,.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
                    <span style={{ width: 30, height: 30, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
                      <CubeIcon style={{ width: 15, height: 15, color: tk.accent }} />
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>Photo du colis</span>
                  </div>
                  <div style={{ padding: 18, display: 'flex', justifyContent: 'center' }}>
                    <img src={package_.packageImageUrl} alt="Colis" style={{ maxHeight: 200, borderRadius: 12, objectFit: 'contain', boxShadow: '0 2px 12px rgba(0,0,0,.1)' }} />
                  </div>
                </div>
              )}

              {/* Grille 2 colonnes : Colis + Expéditeur */}
              <div className="pd-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Détails colis */}
                <SectionBlock icon={CubeIcon} title="Détails du colis">
                  <RecapRow label="Poids" value={`${package_.weight} kg`} />
                  <RecapRow label="Type" value={package_.packageType || '—'} />
                  {(package_.length || package_.width || package_.height) && (
                    <RecapRow label="Dimensions" value={`${package_.length||'?'}×${package_.width||'?'}×${package_.height||'?'} cm`} />
                  )}
                  <RecapRow label="Nbre articles" value={package_.numberOfItems || 1} />
                  <RecapRow label="Valeur déclarée" value={package_.declaredValue ? formatMoney(package_.declaredValue, packageCurrency(package_)) : '—'} />
                  <RecapRow label="Description" value={package_.description || 'Aucune description'} />
                  {/* Traçabilité : utilisateur ayant enregistré le colis (distinct du propriétaire/expéditeur). */}
                  <RecapRow label="Enregistré par" value={package_.createdBy
                    ? `${package_.createdBy.firstName || ''} ${package_.createdBy.lastName || ''}`.trim() + (package_.createdBy.role ? ` (${({ superadmin: 'Super-admin', admin: 'Administrateur', manager: 'Manager', agent: 'Agent', client: 'Client', driver: 'Livreur' })[package_.createdBy.role] || package_.createdBy.role})` : '')
                    : '—'} />
                  {package_.createdAt && <RecapRow label="Enregistré le" value={new Date(package_.createdAt).toLocaleString('fr-FR')} />}
                  {package_.fragile && (
                    <div style={{ marginTop: 4, padding: '6px 12px', background: 'rgba(234,88,12,.06)', borderRadius: 8, border: '1px solid rgba(234,88,12,.15)' }}>
                      <span style={{ fontSize: 12, color: '#ea580c', fontWeight: 600 }}>⚠️ Colis fragile</span>
                    </div>
                  )}
                  {package_.insurance && (
                    <div style={{ marginTop: 4, padding: '6px 12px', background: 'rgba(5,150,105,.06)', borderRadius: 8, border: '1px solid rgba(5,150,105,.15)' }}>
                      <span style={{ fontSize: 12, color: tk.emerald, fontWeight: 600 }}>✓ Assurance incluse</span>
                    </div>
                  )}
                </SectionBlock>

                {/* Expéditeur */}
                {package_.sender ? (
                  <SectionBlock icon={UserIcon} title="Expéditeur">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(77,145,217,.1)', color: tk.accent,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 15, fontFamily: "'Open Sans',Arial,sans-serif",
                      }}>
                        {package_.sender.firstName?.[0]}{package_.sender.lastName?.[0]}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 14, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                          {package_.sender.firstName} {package_.sender.lastName}
                        </p>
                        <p style={{ fontSize: 12, color: tk.textMut }}>{package_.sender.country}</p>
                      </div>
                    </div>
                    <RecapRow label="Téléphone" value={package_.sender.phone || '—'} />
                    {package_.sender.email && <RecapRow label="E-mail" value={package_.sender.email} />}
                    {(package_.sender.city || package_.sender.address) && <RecapRow label="Adresse" value={[package_.sender.address, package_.sender.city].filter(Boolean).join(', ')} />}
                    {canOpenClients && (<button onClick={() => navigate(`/app/clients/${package_.sender?._id}`)} style={{
                      marginTop: 8, width: '100%', padding: '9px 0', borderRadius: 10,
                      background: '#fff', border: `1.5px solid ${tk.border}`,
                      color: tk.accent, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      fontFamily: "'Open Sans',Arial,sans-serif",
                    }}>
                      Voir profil →
                    </button>)}
                  </SectionBlock>
                ) : (
                  <SectionBlock icon={UserIcon} title="Expéditeur">
                    <p style={{ fontSize: 13, color: tk.textMut, textAlign: 'center', padding: '12px 0' }}>Aucun expéditeur</p>
                  </SectionBlock>
                )}
              </div>

              {/* Destinataire + Trajet */}
              <div className="pd-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* Destinataire */}
                {package_.receiver ? (
                  <SectionBlock icon={TruckIcon} iconColor={tk.emerald} title="Destinataire">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(5,150,105,.1)', color: tk.emerald,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 15, fontFamily: "'Open Sans',Arial,sans-serif",
                      }}>
                        {package_.receiver.firstName?.[0]}{package_.receiver.lastName?.[0]}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 14, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                          {package_.receiver.firstName} {package_.receiver.lastName}
                        </p>
                        <p style={{ fontSize: 12, color: tk.textMut }}>{package_.receiver.country}</p>
                      </div>
                    </div>
                    <RecapRow label="Téléphone" value={package_.receiver.phone || '—'} />
                    {package_.receiver.email && <RecapRow label="E-mail" value={package_.receiver.email} />}
                    {(package_.receiver.city || package_.receiver.address) && <RecapRow label="Adresse de livraison" value={[package_.receiver.address, package_.receiver.city].filter(Boolean).join(', ')} />}
                    {canOpenClients && (<button onClick={() => navigate(`/app/clients/${package_.receiver?._id}`)} style={{
                      marginTop: 8, width: '100%', padding: '9px 0', borderRadius: 10,
                      background: '#fff', border: `1.5px solid ${tk.border}`,
                      color: tk.emerald, cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      fontFamily: "'Open Sans',Arial,sans-serif",
                    }}>
                      Voir profil →
                    </button>)}
                  </SectionBlock>
                ) : (
                  <SectionBlock icon={TruckIcon} iconColor={tk.emerald} title="Destinataire">
                    <p style={{ fontSize: 13, color: tk.textMut, textAlign: 'center', padding: '12px 0' }}>Aucun destinataire</p>
                  </SectionBlock>
                )}

                {/* Trajet */}
                <SectionBlock icon={MapPinIcon} title="Trajet">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: tk.surface, borderRadius: 10, border: `1px solid ${tk.border}` }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: tk.accent, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 10, color: tk.textMut, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Origine</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color: tk.ink }}>{package_.origin}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', fontSize: 18 }}>↓</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: `${tk.emerald}08`, borderRadius: 10, border: `1px solid ${tk.emerald}20` }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: tk.emerald, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 10, color: tk.emerald, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>Destination</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color: tk.emerald }}>{package_.destination}</p>
                      </div>
                    </div>
                  </div>
                </SectionBlock>
              </div>

              {/* Paiement & Expédition — pleine largeur */}
              {package_.financial ? (
                <>
                  <FinancialSummary financial={package_.financial} pkg={package_} />
                  {/* Paiements liés à CE colis (solde, « + Ajouter un paiement », historique). */}
                  <PackagePayments pkg={package_} user={authUser} onChanged={() => fetchPackageData()} />
                </>
              ) : (
              <SectionBlock icon={CurrencyEuroIcon} title="Tarification & Paiement">
                <div className="pd-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <RecapRow label="Prix/kg" value={package_.pricePerKg != null ? formatMoney(package_.pricePerKg, packageCurrency(package_)) : '—'} />
                    <RecapRow label="Frais supplémentaires" value={package_.extraFees != null ? formatMoney(package_.extraFees, packageCurrency(package_)) : '—'} />
                    <RecapRow label="Assurance" value={package_.insuranceFee != null ? formatMoney(package_.insuranceFee, packageCurrency(package_)) : '—'} />
                    <RecapRow label="Total" value={<span style={{ color: tk.accent, fontWeight: 700, fontSize: 15 }}>{package_.totalPrice != null ? formatMoney(package_.totalPrice, packageCurrency(package_)) : '—'}</span>} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <RecapRow label="Mode de paiement" value={package_.paymentMethod || '—'} />
                    <RecapRow label="Statut paiement" value={
                      <span style={{ color: package_.isPaid ? tk.emerald : tk.amber, fontWeight: 600 }}>
                        {package_.isPaid ? '✓ Payé' : '⏳ En attente'}
                      </span>
                    } />
                    <RecapRow label="Livraison estimée" value={package_.estimatedDelivery ? new Date(package_.estimatedDelivery).toLocaleDateString('fr-FR') : '—'} />
                    {package_.deliveredAt && (
                      <RecapRow label="Livré le" value={<span style={{ color: tk.emerald, fontWeight: 600 }}>{new Date(package_.deliveredAt).toLocaleDateString('fr-FR')}</span>} />
                    )}
                  </div>
                </div>
              </SectionBlock>)}


              {/* ── Section Paiement ── */}
              <div hidden={!!package_.financial} style={{ border: `1.5px solid ${tk.border}`, borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(23,47,80,.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
                    <BanknotesIcon style={{ width: 15, height: 15, color: tk.emerald }} />
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                    Paiement
                  </span>
                  <span style={{ marginLeft: 'auto' }}>
                    {package_.isPaid
                      ? <span style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(5,150,105,.1)', color: tk.emerald, fontSize: 11, fontWeight: 700, border: '1px solid rgba(5,150,105,.2)' }}>✓ Payé</span>
                      : <span style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(217,119,6,.1)', color: tk.amber, fontSize: 11, fontWeight: 700, border: '1px solid rgba(217,119,6,.2)' }}>⏳ Non payé</span>
                    }
                  </span>
                </div>
                <div style={{ padding: 18 }}>
                  {linkedPayment ? (
                    <div>
                      <div className="pd-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                        <div style={{ padding: '10px 14px', background: tk.surface, borderRadius: 10, border: `1px solid ${tk.border}` }}>
                          <p style={{ fontSize: 10, color: tk.textMut, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Facture</p>
                          <p style={{ fontSize: 13, fontWeight: 700, color: tk.accent, fontFamily: 'monospace' }}>{linkedPayment.invoiceNumber}</p>
                        </div>
                        <div style={{ padding: '10px 14px', background: tk.surface, borderRadius: 10, border: `1px solid ${tk.border}` }}>
                          <p style={{ fontSize: 10, color: tk.textMut, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Montant</p>
                          <p style={{ fontSize: 13, fontWeight: 700, color: tk.emerald }}>{formatMoney(linkedPayment.amount, linkedPayment.currency)}</p>
                        </div>
                        <div style={{ padding: '10px 14px', background: tk.surface, borderRadius: 10, border: `1px solid ${tk.border}` }}>
                          <p style={{ fontSize: 10, color: tk.textMut, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Méthode</p>
                          <p style={{ fontSize: 12, color: tk.ink }}>{({ cash:'💵 Espèces', card:'💳 Carte', bank_transfer:'🏦 Virement', mobile_money:'📱 Mobile Money', cheque:'📝 Chèque' } as Record<string, string>)[linkedPayment.method ?? ''] || linkedPayment.method}</p>
                        </div>
                        <div style={{ padding: '10px 14px', background: tk.surface, borderRadius: 10, border: `1px solid ${tk.border}` }}>
                          <p style={{ fontSize: 10, color: tk.textMut, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Date</p>
                          <p style={{ fontSize: 12, color: tk.ink }}>{new Date(linkedPayment.createdAt as string).toLocaleDateString('fr-FR')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/app/payments/${linkedPayment._id}`)}
                        style={{
                          width: '100%', padding: '10px 0', borderRadius: 10,
                          background: 'linear-gradient(135deg,#EDF5FC,#EDF5FC)',
                          border: '1.5px solid #DCE9F5',
                          color: '#172F50', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                          fontFamily: "'Open Sans',Arial,sans-serif",
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          boxShadow: '0 2px 8px rgba(77,145,217,.1)',
                          transition: 'all .18s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(77,145,217,.2)'}
                        onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(77,145,217,.1)'}
                      >
                        <BanknotesIcon style={{ width: 14, height: 14 }} />
                        Voir le détail du paiement →
                      </button>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '12px 0' }}>
                      <p style={{ fontSize: 13, color: tk.textMut, marginBottom: 14 }}>
                        {package_.isPaid ? 'Colis marqué payé — aucune facture liée.' : 'Aucun paiement enregistré pour ce colis.'}
                      </p>
                      {!package_.isPaid && (
                        <button
                          onClick={() => navigate('/app/payments/add', {
                            state: {
                              packageId: package_._id,
                              clientId:  package_.sender?._id,
                              amount:    package_.totalPrice,
                            }
                          })}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '11px 26px', borderRadius: 12,
                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                            color: '#fff', border: 'none', cursor: 'pointer',
                            fontSize: 13, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif",
                            boxShadow: '0 6px 20px rgba(5,150,105,.35)',
                            transition: 'all .18s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 26px rgba(5,150,105,.45)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(5,150,105,.35)'; }}
                        >
                          <span style={{
                            width: 22, height: 22, borderRadius: 6, background: 'rgba(255,255,255,.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            <PlusCircleIcon style={{ width: 13, height: 13 }} />
                          </span>
                          Enregistrer le paiement
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline tracking */}
              <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(23,47,80,.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
                  <span style={{ width: 30, height: 30, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
                    <TruckIcon style={{ width: 15, height: 15, color: tk.accent }} />
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                    Historique de suivi
                  </span>
                  <span style={{
                    marginLeft: 'auto', padding: '3px 10px', borderRadius: 99,
                    background: 'rgba(77,145,217,.08)', color: tk.accent,
                    fontSize: 11, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif",
                  }}>
                    {tracking.length} événement{tracking.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ padding: 18 }}>
                  {tracking.length > 0 ? (
                    <Timeline items={tracking.map(t => ({
                      title: STATUS_CONFIG[t.status ?? '']?.label || t.status,
                      description: t.description,
                      location: t.location,
                      date: t.timestamp || t.date,
                      status: t.status === 'delivered' ? 'success' : ['transit','preparing','customs','arrived','out_for_delivery'].includes(t.status ?? '') ? 'info' : 'default',
                    }))} />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: tk.textMut, fontSize: 14 }}>
                      Aucun événement de suivi enregistré
                    </div>
                  )}
                </div>
              </div>

              {/* ── Autres colis du même expéditeur ── */}
              {clientPackages.length > 0 && package_.sender && (
                <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(23,47,80,.05)' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
                    <span style={{ width: 30, height: 30, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
                      <UserIcon style={{ width: 15, height: 15, color: tk.accent }} />
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                      Autres colis de {package_.sender.firstName} {package_.sender.lastName}
                    </span>
                    <span style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 99, background: 'rgba(77,145,217,.08)', color: tk.accent, fontSize: 11, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                      {clientPackages.length}
                    </span>
                  </div>

                  {/* Table */}
                  <div style={{ padding: '14px 18px' }}>
                    {/* En-têtes — cachés sur mobile, remplacés par cartes */}
                    <div className="pd-table-header" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.8fr 0.6fr 0.9fr 1.1fr 0.9fr', gap: 8, padding: '8px 12px', background: tk.surface, borderRadius: 8, marginBottom: 6 }}>
                      {['N° Suivi', 'Trajet', 'Poids', 'Type', 'Statut', 'Date'].map(h => (
                        <span key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>{h}</span>
                      ))}
                    </div>

                    {/* Lignes (table sur grand écran, cartes sur mobile) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {clientPackages.map(p => (
                        <div
                          key={p._id}
                          onClick={() => navigate(`/app/packages/${p._id}`)}
                          className="pd-table-row"
                          style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.8fr 0.6fr 0.9fr 1.1fr 0.9fr', gap: 8, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', alignItems: 'center', transition: 'background .15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = tk.surface}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span className="pd-col-tracking" style={{ fontSize: 12, fontWeight: 600, color: tk.accent, fontFamily: "'DM Mono',monospace" }}>{p.trackingNumber}</span>
                          <span className="pd-col-route" style={{ fontSize: 12, color: tk.textSec, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.origin} → {p.destination}</span>
                          <span className="pd-col-weight" style={{ fontSize: 12, fontWeight: 500, color: tk.ink }}>{p.weight} kg</span>
                          <span className="pd-col-type" style={{ fontSize: 12, color: tk.textSec }}>{p.packageType || '—'}</span>
                          <StatusBadge status={p.status} />
                          <span style={{ fontSize: 11, color: tk.textMut }}>{new Date(p.createdAt as string).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' })}</span>
                        </div>
                      ))}
                    </div>

                    {canOpenClients && (<button
                      onClick={() => navigate(`/app/clients/${package_.sender?._id}`)}
                      style={{ marginTop: 12, width: '100%', padding: '9px 0', borderRadius: 10, background: '#fff', border: `1.5px solid ${tk.border}`, color: tk.accent, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif" }}
                    >
                      Voir le profil complet de l'expéditeur →
                    </button>)}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* ─────────────── MODAL mise à jour statut ─────────────── */}
      <Modal isOpen={showStatusModal} onClose={() => setShowStatusModal(false)} title="Mettre à jour le statut">
        <form onSubmit={handleStatusUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            {
              label: 'Nouveau statut',
              content: (
                <select value={newStatus.status}
                  onChange={e => setNewStatus({ ...newStatus, status: e.target.value })}
                  style={inputStyle} required>
                  <option value="">Sélectionner...</option>
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </select>
              ),
            },
            {
              label: 'Localisation',
              content: (
                <div style={{ position: 'relative' }}>
                  <MapPinIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
                  <input type="text" placeholder="Ville, pays" value={newStatus.location}
                    onChange={e => setNewStatus({ ...newStatus, location: e.target.value })}
                    style={{ ...inputStyle, paddingLeft: 38 }} required />
                </div>
              ),
            },
            {
              label: 'Description',
              content: (
                <textarea rows={3} placeholder="Détails de la mise à jour..." value={newStatus.description}
                  onChange={e => setNewStatus({ ...newStatus, description: e.target.value })}
                  style={{ ...inputStyle, resize: 'none' }} />
              ),
            },
          ].map(({ label, content }, i) => (
            <div key={i}>
              <label style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase',
                color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", display: 'block', marginBottom: 6,
              }}>{label}</label>
              {content}
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8, borderTop: `1px solid ${tk.border}` }}>
            <button type="button" onClick={() => setShowStatusModal(false)} style={{
              padding: '9px 20px', borderRadius: 10, background: '#fff',
              border: `1.5px solid ${tk.border}`, color: tk.textSec,
              cursor: 'pointer', fontSize: 13, fontWeight: 500,
            }}>Annuler</button>
            <button type="submit" style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '9px 22px', borderRadius: 10, background: '#347FC5', color: '#fff',
              border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              fontFamily: "'Open Sans',Arial,sans-serif", boxShadow: '0 4px 18px rgba(77,145,217,.25)',
            }}>
              <TruckIcon style={{ width: 14, height: 14 }} /> Mettre à jour
            </button>
          </div>
        </form>
      </Modal>

      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Responsive PackageDetail ────────────────── */
        @media (max-width: 768px) {
          /* Header actions */
          .pd-header {
            padding: 12px 16px !important;
          }
          .pd-header-actions {
            width: 100%;
            justify-content: stretch;
          }
          .pd-header-actions button {
            flex: 1;
            justify-content: center;
            padding: 9px 10px !important;
            font-size: 12px !important;
          }

          /* Corps principal */
          .pd-body {
            padding: 16px 16px 24px !important;
          }

          /* Sidebar + contenu : empiler verticalement */
          .pd-layout {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }

          /* Sidebar : ne plus être sticky, layout horizontal */
          .pd-layout > div:first-child > div {
            position: static !important;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }
          .pd-layout > div:first-child > div > div:first-child {
            flex: 1;
            min-width: 140px;
            padding: 16px !important;
          }
          .pd-layout > div:first-child > div > div:last-child {
            flex: 2;
            min-width: 200px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            padding: 12px !important;
          }

          /* Toutes les grilles 2 colonnes → 1 colonne */
          .pd-grid-2 {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }

          /* Table autres colis → cartes empilées */
          .pd-table-header {
            display: none !important;
          }
          .pd-table-row {
            grid-template-columns: 1fr 1fr !important;
            gap: 6px !important;
            padding: 12px !important;
            border: 1px solid #DCE9F5;
            border-radius: 10px;
            margin-bottom: 4px;
          }
          .pd-col-weight, .pd-col-type {
            display: none;
          }
          .pd-col-tracking {
            font-size: 11px !important;
          }
          .pd-col-route {
            font-size: 11px !important;
            grid-column: 1 / -1;
          }

          /* Hero pill */
          .pd-hero-pill {
            gap: 6px !important;
            padding: 8px 12px !important;
          }
        }

        @media (max-width: 480px) {
          .pd-layout > div:first-child > div {
            flex-direction: column;
          }
          .pd-layout > div:first-child > div > div:last-child {
            grid-template-columns: 1fr 1fr;
          }
          .pd-header-actions button span {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default PackageDetail;