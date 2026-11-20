import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import {
  ArrowLeftIcon, PrinterIcon, EnvelopeIcon, SparklesIcon,
  TruckIcon, PhoneIcon, CheckCircleIcon, ClockIcon, XCircleIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { invoiceAmounts, invoiceCurrencyNotice } from '../../utils/invoiceMoney';
import type { Package, Payment } from '../../types/models';

const tk = {
  ink: '#172F50', ink80: '#172F50',
  surface: '#F7FAFE', surf2: '#EDF5FC',
  border: '#DCE9F5',
  accent: '#4D91D9', accentDark: '#347FC5',
  emerald: '#059669', amber: '#d97706', rose: '#dc2626',
  textSec: '#52677D', textMut: '#8295A8',
};

const METHOD_LABELS: Record<string, string> = {
  cash: '💵 Espèces', card: '💳 Carte bancaire',
  bank_transfer: '🏦 Virement bancaire',
  mobile_money: '📱 Mobile Money', cheque: '📝 Chèque',
};
const STATUS_LABELS: Record<string, string> = {
  paid: 'PAYÉ ✅', pending: 'EN ATTENTE ⏳',
  partial: 'PARTIEL 🔄', refunded: 'REMBOURSÉ ↩️', cancelled: 'ANNULÉ ❌',
};
const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  paid:      { bg: `${tk.emerald}10`, color: tk.emerald, label: 'Payée' },
  pending:   { bg: `${tk.amber}10`,   color: tk.amber,   label: 'En attente' },
  partial:   { bg: `${tk.accent}10`,  color: tk.accent,  label: 'Partiel' },
  refunded:  { bg: `${tk.accent}10`,  color: tk.accent,  label: 'Remboursé' },
  cancelled: { bg: `${tk.rose}10`,    color: tk.rose,    label: 'Annulé' },
};

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const componentRef = useRef<HTMLDivElement>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoiceData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchInvoiceData = async () => {
    try {
      const response = await axios.get(`/payments/${id}`);
      setPayment(response.data?.data || response.data);
    } catch {
      toast.error('Erreur lors du chargement de la facture');
      navigate('/app/payments');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Facture-${payment?.invoiceNumber || id}`,
  });

  const handleSendEmail = () => {
    if (!payment) return;
    const clientEmail = payment.client?.email || '';
    const subject = encodeURIComponent(`Facture ${payment.invoiceNumber || ''} – Trans Africa Canada`);
    const body = encodeURIComponent([
      `Bonjour ${payment.client?.firstName || ''} ${payment.client?.lastName || ''},`,
      '',
      'Veuillez trouver ci-dessous le détail de votre paiement :',
      '',
      `📋 Facture N° : ${payment.invoiceNumber || '—'}`,
      `💰 Montant    : ${invoiceAmounts(payment).total}`,
      `📅 Date       : ${new Date(payment.createdAt as string).toLocaleDateString('fr-FR')}`,
      `💳 Méthode    : ${METHOD_LABELS[payment.method ?? '']?.replace(/^\S+\s/, '') || payment.method}`,
      `✅ Statut     : ${STATUS_COLORS[payment.status ?? '']?.label || payment.status}`,
      '',
      'Merci pour votre confiance.',
      'Trans Africa Canada',
    ].join('\n'));
    window.open(`mailto:${clientEmail}?subject=${subject}&body=${body}`);
    toast.info('Client email ouvert — imprimez la page pour joindre la facture');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: tk.surface }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${tk.border}`, borderTopColor: tk.accent, animation: 'spin 0.8s linear infinite' }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!payment) {
    return (
      <div style={{ minHeight: '100vh', background: tk.surface }}>
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <BanknotesIcon style={{ width: 64, height: 64, color: tk.textMut, margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 20, fontWeight: 600, color: tk.ink, marginBottom: 12 }}>Facture introuvable</h2>
          <button onClick={() => navigate('/app/payments')} style={{ padding: '10px 24px', borderRadius: 10, background: '#347FC5', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Retour aux paiements
          </button>
        </div>
      </div>
    );
  }

  const money = invoiceAmounts(payment); const fmt = money.format;
  const isPaid = payment.status === 'paid';
  const isPartial = payment.status === 'partial';
  const bannerBg = isPaid ? tk.emerald : isPartial ? tk.accent : tk.amber;
  const statusCfg = STATUS_COLORS[payment.status ?? ''] || STATUS_COLORS['pending'];
  const dateStr = new Date(payment.createdAt || Date.now()).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  // Références peuplées (objets) ; une référence non peuplée (identifiant) n'affiche que des tirets.
  const refId = (r: Package | string) => (typeof r === 'string' ? r : r._id);
  const pkgList = [
    ...(Array.isArray(payment.packages) ? payment.packages : []),
    ...(payment.package && !payment.packages?.find(p => refId(p) === refId(payment.package as Package | string)) ? [payment.package] : []),
  ] as Package[];

  const qrData = pkgList[0]?.trackingNumber
    ? `${window.location.origin}/tracking/${pkgList[0].trackingNumber}`
    : payment.invoiceNumber || payment._id;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrData)}&bgcolor=ffffff&color=0d1117&margin=6&ecc=H`;

  return (
    <div style={{ minHeight: '100vh', background: tk.surface }}>

      {/* ── HERO ── */}
      <section className="easy-internal-header" style={{ position: 'relative', height: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#172F50', padding: '0 24px', maxWidth: 640 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.2)', borderRadius: 99, padding: '6px 16px', marginBottom: 18 }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#C5DCEF' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>FACTURE</span>
          </div>
          <h1 style={{ fontSize: 'clamp(20px,3.5vw,32px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 8, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Facture{' '}
            <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {payment.invoiceNumber}
            </span>
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(8px)', borderRadius: 99, padding: '8px 20px', marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#C5DCEF' }}>{money.total}</span>
            <span style={{ fontSize: 12, color: '#172F50' }}>• {dateStr}</span>
          </div>
        </div>
        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ── CONTENU ── */}
      <div className="iv-content" style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px 48px' }}>

        {/* Barre actions */}
        <div className="iv-action-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/app/payments')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, background: '#fff', border: `1.5px solid ${tk.border}`, fontSize: 13, fontWeight: 500, color: tk.textSec, cursor: 'pointer' }}>
              <ArrowLeftIcon style={{ width: 14, height: 14 }} /> Retour
            </button>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 99, background: statusCfg.bg, color: statusCfg.color, fontSize: 12, fontWeight: 600 }}>
              {isPaid ? <CheckCircleIcon style={{ width: 12, height: 12 }} /> : payment.status === 'cancelled' ? <XCircleIcon style={{ width: 12, height: 12 }} /> : <ClockIcon style={{ width: 12, height: 12 }} />}
              {statusCfg.label}
            </span>
          </div>
          <div className="iv-btns" style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleSendEmail} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 10, border: `1.5px solid ${tk.border}`, background: '#fff', fontSize: 13, fontWeight: 500, color: tk.textSec, cursor: 'pointer' }}>
              <EnvelopeIcon style={{ width: 14, height: 14 }} /> Envoyer
            </button>
            <button onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 10, background: '#347FC5', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(77,145,217,.3)' }}>
              <PrinterIcon style={{ width: 14, height: 14 }} /> Imprimer / PDF
            </button>
          </div>
        </div>

        {/* ── FACTURE IMPRIMABLE ── */}
        <div ref={componentRef} style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${tk.border}`, boxShadow: '0 4px 24px rgba(23,47,80,.08)', overflow: 'hidden', fontFamily: "'DM Sans',sans-serif" }}>

          {/* Header dégradé sombre */}
          <div style={{ background: 'linear-gradient(135deg,#172F50 0%,#172F50 60%,#4D91D9 100%)', padding: '28px 32px' }}>
            <div className="iv-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TruckIcon style={{ width: 22, height: 22, color: '#C5DCEF' }} />
                </div>
                <div>
                  <p style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: "'Open Sans',Arial,sans-serif", margin: 0 }}>Trans Africa Canada</p>
                  <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', margin: 0 }}>Agence de colis international</p>
                </div>
              </div>
              {/* Infos facture */}
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', margin: '0 0 4px' }}>Facture de paiement</p>
                <p style={{ color: '#C5DCEF', fontFamily: 'monospace', fontSize: 20, fontWeight: 800, letterSpacing: '.1em', margin: '0 0 4px' }}>{payment.invoiceNumber || '—'}</p>
                <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 12, margin: 0 }}>{dateStr}</p>
              </div>
            </div>
          </div>

          {/* Bannière statut */}
          <div style={{ background: bannerBg, padding: '8px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase' }}>{STATUS_LABELS[payment.status ?? ''] || payment.status}</span>
            <span style={{ color: 'rgba(255,255,255,.85)', fontSize: 11 }}>{METHOD_LABELS[payment.method ?? ''] || payment.method}</span>
          </div>

          <div className="iv-invoice-body" style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* CLIENT + AGENCE */}
            <div className="iv-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: '#EDF5FC', border: '1.5px solid #DCE9F5', borderRadius: 12, padding: '16px 18px' }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: tk.accent, marginBottom: 10, fontFamily: "'Open Sans',Arial,sans-serif" }}>CLIENT</p>
                <p style={{ fontSize: 16, fontWeight: 800, color: tk.ink, marginBottom: 6, fontFamily: "'Open Sans',Arial,sans-serif" }}>{payment.client?.firstName} {payment.client?.lastName}</p>
                {payment.client?.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <PhoneIcon style={{ width: 12, height: 12, color: tk.accent, flexShrink: 0 }} />
                    <p style={{ fontSize: 13, color: tk.textSec, margin: 0 }}>{payment.client.phone}</p>
                  </div>
                )}
                {payment.client?.email && <p style={{ fontSize: 12, color: tk.textMut, marginBottom: 3 }}>{payment.client.email}</p>}
                {payment.client?.country && (
                  <div style={{ display: 'inline-block', marginTop: 6, padding: '3px 10px', borderRadius: 6, background: tk.accent, color: '#fff', fontSize: 11, fontWeight: 700 }}>
                    {payment.client.country}
                  </div>
                )}
              </div>
              <div style={{ background: tk.surface, border: `1.5px solid ${tk.border}`, borderRadius: 12, padding: '16px 18px' }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: tk.textMut, marginBottom: 10, fontFamily: "'Open Sans',Arial,sans-serif" }}>AGENCE</p>
                <p style={{ fontSize: 15, fontWeight: 800, color: tk.ink, marginBottom: 4, fontFamily: "'Open Sans',Arial,sans-serif" }}>{payment.agency?.name || 'Trans Africa Canada'}</p>
                {payment.agency?.code && <p style={{ fontSize: 12, color: tk.textMut, marginBottom: 3 }}>Code : {payment.agency.code}</p>}
                {payment.agency?.phone && <p style={{ fontSize: 12, color: tk.textSec, marginBottom: 3 }}>{payment.agency.phone}</p>}
                <div style={{ marginTop: 8, padding: '6px 12px', background: isPaid ? '#d1fae5' : '#fef3c7', borderRadius: 8, display: 'inline-block' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: isPaid ? '#065f46' : '#92400e', margin: 0 }}>
                    {isPaid ? `✓ Payé le ${payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('fr-FR') : dateStr}` : `Échéance : ${payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('fr-FR') : '—'}`}
                  </p>
                </div>
              </div>
            </div>

            {/* COLIS LIÉS */}
            {pkgList.length > 0 && (
              <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ background: tk.surface, padding: '10px 18px', borderBottom: `1px solid ${tk.border}` }}>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", margin: 0 }}>COLIS CONCERNÉS</p>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                    <thead>
                      <tr style={{ background: '#f8fafc' }}>
                        {['N° Suivi', 'Trajet', 'Poids', 'Statut'].map(h => (
                          <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: tk.textMut, letterSpacing: '.1em', textTransform: 'uppercase', borderBottom: `1px solid ${tk.border}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pkgList.map((pkg, i) => {
                        const tn = pkg.trackingNumber || '—';
                        const route = (pkg.origin && pkg.destination) ? `${pkg.origin} → ${pkg.destination}` : '—';
                        const sColors = { registered:'#79B5E8', preparing:'#f59e0b', transit:'#79B5E8', customs:'#a855f7', arrived:'#10b981', out_for_delivery:'#4D91D9', delivered:'#059669', returned:'#ef4444', lost:'#94a3b8' };
                        const sLabels = { registered:'Enregistré', preparing:'En prép.', transit:'En transit', customs:'Douane', arrived:'Arrivé', out_for_delivery:'Livraison', delivered:'Livré', returned:'Retourné', lost:'Perdu' };
                        const dot = (sColors as Record<string, string>)[pkg.status ?? ''] || '#94a3b8';
                        const slabel = (sLabels as Record<string, string>)[pkg.status ?? ''] || pkg.status || '—';
                        return (
                          <tr key={i}>
                            <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: tk.accent, borderBottom: i < pkgList.length-1 ? `1px solid ${tk.border}` : 'none' }}>{tn}</td>
                            <td style={{ padding: '10px 14px', fontSize: 12, color: tk.textSec, borderBottom: i < pkgList.length-1 ? `1px solid ${tk.border}` : 'none' }}>{route}</td>
                            <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: tk.ink, borderBottom: i < pkgList.length-1 ? `1px solid ${tk.border}` : 'none' }}>{pkg.weight ? `${pkg.weight} kg` : '—'}</td>
                            <td style={{ padding: '10px 14px', borderBottom: i < pkgList.length-1 ? `1px solid ${tk.border}` : 'none' }}>
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 99, background: `${dot}18`, color: dot, fontSize: 11, fontWeight: 600 }}>
                                <span style={{ width: 5, height: 5, borderRadius: '50%', background: dot }} />{slabel}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* DÉTAILS PAIEMENT + MONTANT */}
            <div className="iv-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
              {/* Détails */}
              <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ background: tk.surface, padding: '10px 18px', borderBottom: `1px solid ${tk.border}` }}>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", margin: 0 }}>DÉTAILS DU PAIEMENT</p>
                </div>
                <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { l: 'Méthode',         v: METHOD_LABELS[payment.method ?? ''] || payment.method || '—' },
                    { l: 'Date de paiement', v: dateStr },
                    { l: 'Référence',        v: payment.invoiceNumber || '—' },
                    ...(payment.notes ? [{ l: 'Notes', v: payment.notes }] : []),
                  ].map(({ l, v }, i, arr) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < arr.length-1 ? 10 : 0, borderBottom: i < arr.length-1 ? `1px solid ${tk.border}` : 'none', gap: 8 }}>
                      <span style={{ fontSize: 12, color: tk.textMut, flexShrink: 0 }}>{l}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: tk.ink, textAlign: 'right' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Montant */}
              <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ background: tk.surface, padding: '10px 18px', borderBottom: `1px solid ${tk.border}` }}>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", margin: 0 }}>MONTANT</p>
                </div>
                <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { l: 'Montant total', v: `${money.total}` },
                    { l: 'Déjà réglé',   v: `${money.paid}` },
                    { l: 'Reste dû',     v: `${money.due}` },
                  ].map(({ l, v }, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: tk.textMut }}>{l}</span>
                      <span style={{ fontSize: 12, color: tk.ink }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: `2px solid ${tk.border}`, marginTop: 6, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif" }}>TOTAL PAYÉ</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: isPaid ? tk.emerald : tk.amber, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                      {money.headline}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SIGNATURES + QR */}
            <div className="iv-qr-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
              <div className="iv-sig-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {['Signature client', 'Signature agent'].map(s => (
                  <div key={s} style={{ border: `1.5px dashed ${tk.border}`, borderRadius: 10, padding: '28px 16px 14px', textAlign: 'center' }}>
                    <p style={{ fontSize: 11, color: tk.textMut }}>{s}</p>
                  </div>
                ))}
              </div>
              {/* QR code */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 170 }}>
                <div style={{ padding: 10, background: '#fff', borderRadius: 14, border: `2px solid ${tk.border}`, boxShadow: '0 2px 10px rgba(0,0,0,.06)' }}>
                  <img src={qrSrc} alt="QR" style={{ display: 'block', width: 130, height: 130, borderRadius: 6 }}
                    onError={e => { (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${payment.invoiceNumber||'Trans Africa Canada'}&bgcolor=ffffff&color=0d1117&margin=6`; }}
                  />
                </div>
                <p style={{ fontSize: 10, fontWeight: 700, color: tk.textMut, textAlign: 'center', maxWidth: 170, margin: '4px 0 2px' }}>📱 Scanner pour suivre</p>
                <p style={{ fontSize: 10, fontFamily: 'monospace', color: tk.accent, fontWeight: 800, letterSpacing: '.1em', textAlign: 'center' }}>{payment.invoiceNumber}</p>
              </div>
            </div>

            {/* FOOTER FACTURE */}
            <div style={{ borderTop: `1.5px solid ${tk.border}`, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <p style={{ fontSize: 11, color: tk.textMut, maxWidth: 420 }}>
                Cette facture fait foi du paiement enregistré. Conservez-la pour tout litige ou remboursement.
                Trans Africa Canada — conditions générales disponibles sur www.transafricacanada.com
              </p>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: tk.accent, letterSpacing: '.1em', marginBottom: 2 }}>Trans Africa Canada</p>
                <p style={{ fontSize: 10, color: tk.textMut }}>www.transafricacanada.com</p>
              </div>
            </div>

          </div>
        </div>

        {/* Voir profil client */}
        {payment.client && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button onClick={() => navigate(`/app/clients/${payment.client?._id}`)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 10, border: `1.5px solid ${tk.border}`, background: '#fff', fontSize: 13, fontWeight: 500, color: tk.textSec, cursor: 'pointer' }}>
              Voir profil client →
            </button>
          </div>
        )}
      </div>


      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Responsive InvoiceView ──────────────────────── */
        @media (max-width: 640px) {
          .iv-content { padding: 20px 16px 40px !important; }
          .iv-action-bar { flex-direction: column !important; align-items: stretch !important; }
          .iv-btns { width: 100% !important; }
          .iv-btns button { flex: 1; justify-content: center; }

          .iv-2col { grid-template-columns: 1fr !important; }
          .iv-qr-row { grid-template-columns: 1fr !important; }
          .iv-sig-grid { grid-template-columns: 1fr !important; }

          .iv-invoice-body { padding: 16px !important; gap: 16px !important; }
          .iv-header-row { flex-direction: column !important; gap: 12px !important; }
          .iv-header-row > div:last-child { text-align: left !important; }
        }

        @media (max-width: 420px) {
          .iv-sig-grid { display: none; }
        }

        @media print {
          .iv-action-bar { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default InvoiceView;
