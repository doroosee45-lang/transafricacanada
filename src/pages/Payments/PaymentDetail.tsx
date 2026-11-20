import {invoicePackages,drawInvoicePackages} from '../../utils/invoicePackages';
﻿import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon, PrinterIcon, EnvelopeIcon, SparklesIcon,
  TruckIcon, PhoneIcon, CheckCircleIcon, ClockIcon, XCircleIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { invoiceAmounts, invoiceCurrencyNotice } from '../../utils/invoiceMoney';
import type { Package, Payment } from '../../types/models';
import type { RGB, TextOptions } from '../../types/pdf';
import type { IconComponent } from '../../types/ui';

/* ── Tokens ── */
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

/* ══════════════════════════════════════════════════════════
   COMPOSANT FACTURE — même style que le bordereau AddPackage
══════════════════════════════════════════════════════════ */
export const PaymentInvoice = React.forwardRef<HTMLDivElement, { payment: Payment | null }>(({ payment }, ref) => {
  if (!payment) return null;

  const money = invoiceAmounts(payment); const fmt = money.format;
  const date = new Date(payment.createdAt || Date.now())
    .toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  const isPaid   = payment.status === 'paid';
  const isPartial = payment.status === 'partial';
  const bannerBg = isPaid ? '#059669' : isPartial ? '#4D91D9' : '#d97706';

  const pkgList = invoicePackages(payment);
  const currencyNotice = invoiceCurrencyNotice(payment, [...(Array.isArray(payment.packages) ? payment.packages : []), payment.package].filter((p): p is Package => !!p && typeof p === 'object' && !p.missing));

  // QR : lien vers le premier colis ou vers la page de suivi
  const firstTracking = pkgList[0]?.trackingNumber;
  const qrData  = firstTracking
    ? `${window.location.origin}/tracking/${firstTracking}`
    : payment.invoiceNumber || payment._id;
  const qrSrc   = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrData)}&bgcolor=ffffff&color=0d1117&margin=6&ecc=H`;

  return (
    <div ref={ref} style={{ fontFamily: "'DM Sans',sans-serif", color: '#172F50', background: '#fff', maxWidth: 820, margin: '0 auto' }}>

      {/* ── HEADER ── */}
      <div style={{ background: 'linear-gradient(135deg,#172F50 0%,#172F50 60%,#4D91D9 100%)', padding: '28px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TruckIcon style={{ width: 22, height: 22, color: '#C5DCEF' }} />
          </div>
          <div>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: "'Open Sans',Arial,sans-serif", letterSpacing: '.02em', margin: 0 }}>Trans Africa Canada</p>
            <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', margin: 0 }}>Agence de colis international</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', margin: '0 0 4px' }}>Facture de paiement</p>
          <p style={{ color: '#C5DCEF', fontFamily: 'monospace', fontSize: 20, fontWeight: 800, letterSpacing: '.1em', margin: '0 0 4px' }}>{payment.invoiceNumber || '—'}</p>
          <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 12, margin: 0 }}>{date}</p>
        </div>
      </div>

      {/* ── STATUS BANNER ── */}
      <div style={{ background: bannerBg, padding: '8px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase' }}>
          {STATUS_LABELS[payment.status ?? ''] || payment.status}
        </span>
        <span style={{ color: 'rgba(255,255,255,.85)', fontSize: 11 }}>
          {METHOD_LABELS[payment.method ?? ''] || payment.method}
        </span>
      </div>

      <div className="pi-invoice-body" style={{ padding: '24px 36px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── CLIENT ── */}
        <div className="pi-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: '#EDF5FC', border: '1.5px solid #DCE9F5', borderRadius: 12, padding: '14px 18px' }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#4D91D9', fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 10 }}>CLIENT</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#172F50', marginBottom: 4, fontFamily: "'Open Sans',Arial,sans-serif" }}>
              {payment.client?.firstName} {payment.client?.lastName}
            </p>
            {payment.client?.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <PhoneIcon style={{ width: 12, height: 12, color: '#4D91D9', flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: '#52677D', margin: 0 }}>{payment.client.phone}</p>
              </div>
            )}
            {payment.client?.email && <p style={{ fontSize: 12, color: '#8295A8', marginBottom: 3 }}>{payment.client.email}</p>}
            {payment.client?.country && (
              <div style={{ display: 'inline-block', marginTop: 6, padding: '3px 10px', borderRadius: 6, background: '#4D91D9', color: '#fff', fontSize: 11, fontWeight: 700 }}>
                {payment.client.country}
              </div>
            )}
          </div>
          <div style={{ background: tk.surface, border: `1.5px solid ${tk.border}`, borderRadius: 12, padding: '14px 18px' }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 10 }}>AGENCE</p>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#172F50', marginBottom: 4, fontFamily: "'Open Sans',Arial,sans-serif" }}>
              {payment.agency?.name || 'Trans Africa Canada'}
            </p>
            {payment.agency?.code && <p style={{ fontSize: 12, color: tk.textMut, marginBottom: 3 }}>Code : {payment.agency.code}</p>}
            {payment.agency?.phone && <p style={{ fontSize: 12, color: tk.textSec, marginBottom: 3 }}>{payment.agency.phone}</p>}
            <div style={{ marginTop: 8, padding: '6px 12px', background: isPaid ? '#d1fae5' : '#fef3c7', borderRadius: 8, display: 'inline-block' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: isPaid ? '#065f46' : '#92400e', margin: 0 }}>
                {isPaid ? `✓ Payé le ${payment.paidAt ? new Date(payment.paidAt).toLocaleDateString('fr-FR') : date}` : `Échéance : ${payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('fr-FR') : '—'}`}
              </p>
            </div>
          </div>
        </div>

        {/* ── COLIS LIÉS ── */}
        {pkgList.length > 0 && (
          <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ background: tk.surface, padding: '10px 18px', borderBottom: `1px solid ${tk.border}` }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", margin: 0 }}>COLIS CONCERNÉS</p>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  {['N° Suivi', 'Trajet', 'Poids', 'Statut', 'Service'].map(h => (
                    <th key={h} style={{ padding: '8px 14px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: tk.textMut, letterSpacing: '.1em', textTransform: 'uppercase', borderBottom: `1px solid ${tk.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pkgList.map((pkg, i) => {
                  const tn=pkg.tracking, route=pkg.route, slabel=pkg.status, dot='#4D91D9';
                  return (
                    <tr key={i}>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#4D91D9', borderBottom: i < pkgList.length-1 ? `1px solid ${tk.border}` : 'none' }}>{tn}</td>
                      <td style={{ padding: '10px 14px', fontSize: 12, color: tk.textSec, borderBottom: i < pkgList.length-1 ? `1px solid ${tk.border}` : 'none' }}>{route}</td>
                      <td style={{ padding: '10px 14px', fontSize: 13, fontWeight: 600, color: tk.ink, borderBottom: i < pkgList.length-1 ? `1px solid ${tk.border}` : 'none' }}>{pkg.weight}</td>
                      <td style={{ padding: '10px 14px', borderBottom: i < pkgList.length-1 ? `1px solid ${tk.border}` : 'none' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 99, background: `${dot}18`, color: dot, fontSize: 11, fontWeight: 600 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: dot }} />{slabel}
                        </span>
                      </td>
                      <td style={{padding:'10px 14px',fontSize:11}}>{pkg.service}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!pkgList.length && <p>Aucun colis associé à cette facture.</p>}
        {/* ── TARIFICATION ── */}
        <div className="pi-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>

          {/* Détails paiement */}
          <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ background: tk.surface, padding: '10px 18px', borderBottom: `1px solid ${tk.border}` }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", margin: 0 }}>DÉTAILS DU PAIEMENT</p>
            </div>
            <div style={{ padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { l: 'Méthode',         v: METHOD_LABELS[payment.method ?? ''] || payment.method || '—' },
                { l: 'Date de paiement',v: date },
                { l: 'Référence',       v: payment.invoiceNumber || '—' },
                ...(payment.notes ? [{ l: 'Notes', v: payment.notes }] : []),
              ].map(({ l, v }, i, arr) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < arr.length-1 ? 10 : 0, borderBottom: i < arr.length-1 ? `1px solid ${tk.border}` : 'none' }}>
                  <span style={{ fontSize: 12, color: tk.textMut }}>{l}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: tk.ink, textAlign: 'right', maxWidth: '60%' }}>{v}</span>
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
                { l: 'Montant total',   v: `${money.total}` },
                { l: 'Déjà réglé',      v: `${money.paid}` },
                { l: 'Reste dû',        v: `${money.due}` },
              ].map(({ l, v }, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: tk.textMut }}>{l}</span>
                  <span style={{ fontSize: 12, color: tk.ink }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: `2px solid ${tk.border}`, marginTop: 6, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif" }}>TOTAL PAYÉ</span>
                <span style={{ fontSize: 22, fontWeight: 800, color: isPaid ? '#059669' : '#d97706', fontFamily: "'Open Sans',Arial,sans-serif" }}>{money.headline}</span>
              </div>
              {/* Ancienne facture dont la devise enregistrée diffère de celle des colis : signalée, jamais convertie. */}
              {currencyNotice && <p role="note" style={{ fontSize: 9, color: '#b45309', marginTop: 6 }}>{currencyNotice}</p>}
            </div>
          </div>
        </div>

        {/* ── QR + NOTES ── */}
        <div className="pi-qr-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
          <div>
            {/* Zone signature */}
            <div className="pi-sig-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
              {['Signature client', 'Signature agent'].map(s => (
                <div key={s} style={{ border: `1.5px dashed ${tk.border}`, borderRadius: 10, padding: '24px 16px 12px', textAlign: 'center' }}>
                  <p style={{ fontSize: 11, color: tk.textMut }}>{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* QR code */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 180 }}>
            <div style={{ padding: 10, background: '#fff', borderRadius: 14, border: `2px solid ${tk.border}`, boxShadow: '0 2px 10px rgba(0,0,0,.06)' }}>
              <img src={qrSrc} alt="QR" style={{ display: 'block', width: 140, height: 140, borderRadius: 6 }}
                onError={e => { (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${payment.invoiceNumber || 'Trans Africa Canada'}&bgcolor=ffffff&color=0d1117&margin=6`; }}
              />
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: tk.textMut, textAlign: 'center', maxWidth: 180, margin: '4px 0 2px' }}>📱 Scanner pour suivre</p>
            <p style={{ fontSize: 10, fontFamily: 'monospace', color: tk.accent, fontWeight: 800, letterSpacing: '.1em', textAlign: 'center' }}>{payment.invoiceNumber}</p>
            <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 8, padding: '4px 8px', maxWidth: 180 }}>
              <p style={{ fontSize: 8, color: tk.textMut, textAlign: 'center' }}>
                Montant : <span style={{ fontWeight: 700, color: isPaid ? '#059669' : '#d97706' }}>{money.total}</span>
              </p>
              <p style={{ fontSize: 8, color: tk.textMut, textAlign: 'center' }}>
                {payment.client?.firstName} {payment.client?.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ borderTop: `1.5px solid ${tk.border}`, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 11, color: tk.textMut, maxWidth: 400 }}>
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
  );
});

const PaymentDetail = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const invoiceRef   = useRef<HTMLDivElement>(null);
  const [payment,    setPayment]    = useState<Payment | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => { fetchPaymentData(); }, [id]); // eslint-disable-line

  const fetchPaymentData = async () => {
    try {
      const response = await axios.get(`/payments/${id}`);
      // sendResponse wrappe sous data.data
      setPayment(response.data?.data || response.data || null);
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors du chargement des données');
      navigate('/app/payments');
    } finally {
      setLoading(false);
    }
  };

  /* ── Génération PDF pure jsPDF (A4 vectoriel, sans html2canvas) ── */
  const generatePDF = async () => {
    if (!payment) return null;
    setPdfLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W = 210, H = 297, m = 18;

      /* helpers */
      const fill = (x: number,y: number,w: number,h: number,...rgb: RGB) => { doc.setFillColor(...rgb); doc.rect(x,y,w,h,'F'); };
      const rbox = (x: number,y: number,w: number,h: number,rgb: RGB,stroke=true) => {
        doc.setFillColor(...rgb);
        if(stroke) doc.setDrawColor(233,225,213);
        doc.roundedRect(x,y,w,h,3,3,stroke?'FD':'F');
      };
      const t = (s: unknown,x: number,y: number,{sz=10,wt='normal',col=[23,22,20],align='left'}: TextOptions={}) => {
        doc.setFontSize(sz); doc.setFont('helvetica',wt);
        doc.setTextColor(...col); doc.text(String(s||''),x,y,{align});
      };
      const hline = (x1: number,yy: number,x2: number) => { doc.setDrawColor(233,225,213); doc.setLineWidth(0.3); doc.line(x1,yy,x2,yy); };
      const money = invoiceAmounts(payment); const fmt = money.format;

      const INK: RGB=[23,22,20],BLUE: RGB=[167,123,40],GRAY: RGB=[75,90,110],
            LT: RGB=[250,248,245],WHITE: RGB=[255,255,255],
            GREEN: RGB=[5,150,105],AMBER: RGB=[217,119,6];
      const isPaid=payment.status==='paid', isPart=payment.status==='partial';
      const SC=isPaid?GREEN:isPart?BLUE:AMBER;
      const SLBL: Record<string, string>={paid:'PAYE',pending:'EN ATTENTE',partial:'PARTIEL',refunded:'REMBOURSE',cancelled:'ANNULE'};
      const MLBL: Record<string, string>={cash:'Especes',card:'Carte bancaire',bank_transfer:'Virement bancaire',mobile_money:'Mobile Money',cheque:'Cheque'};

      /* ── HEADER ── */
      fill(0,0,W,52,...INK);
      fill(0,0,W,5,...BLUE);
      t('Trans Africa Canada',m,22,{sz:18,wt:'bold',col:WHITE});
      t('Agence de colis international',m,31,{sz:9,col:[224,215,199]});
      t('FACTURE DE PAIEMENT',W-m,16,{sz:8,wt:'bold',col:[217,180,101],align:'right'});
      t(payment.invoiceNumber||'—',W-m,28,{sz:17,wt:'bold',col:WHITE,align:'right'});
      const dateStr=new Date(payment.createdAt||Date.now()).toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
      t(dateStr,W-m,38,{sz:9,col:[224,215,199],align:'right'});

      /* ── STATUS BANNER ── */
      fill(0,52,W,13,...SC);
      t(SLBL[payment.status ?? '']||payment.status?.toUpperCase()||'—',m,60,{sz:9,wt:'bold',col:WHITE});
      t(MLBL[payment.method ?? '']||payment.method||'—',W-m,60,{sz:9,wt:'bold',col:WHITE,align:'right'});

      let y=73;
      const hw=(W-m*2-8)/2, rx=m+hw+8;

      /* ── CLIENT + AGENCE ── */
      rbox(m,y,hw,54,[255,248,238]);
      t('CLIENT',m+10,y+9,{sz:8,wt:'bold',col:BLUE});
      const cN=payment.client?`${payment.client.firstName||''} ${payment.client.lastName||''}`:'—';
      t(cN,m+10,y+19,{sz:13,wt:'bold',col:INK});
      if(payment.client?.phone) t(payment.client.phone,m+10,y+28,{sz:9,col:GRAY});
      if(payment.client?.email) t(payment.client.email,m+10,y+37,{sz:8,col:GRAY});
      if(payment.client?.country){
        fill(m+10,y+42,32,6,...BLUE);
        t(payment.client.country,m+10+16,y+46.2,{sz:8,wt:'bold',col:WHITE,align:'center'});
      }

      rbox(rx,y,hw,54,LT);
      t('AGENCE',rx+10,y+9,{sz:8,wt:'bold',col:GRAY});
      t(payment.agency?.name||'Trans Africa Canada',rx+10,y+19,{sz:13,wt:'bold',col:INK});
      if(payment.agency?.code) t(`Code: ${payment.agency.code}`,rx+10,y+28,{sz:9,col:GRAY});
      if(payment.agency?.phone) t(payment.agency.phone,rx+10,y+37,{sz:9,col:GRAY});
      const pBg: RGB=isPaid?[209,250,229]:[254,243,199], pFg: RGB=isPaid?[6,95,70]:[146,64,14];
      const pTx=isPaid
        ?`Paye le ${payment.paidAt?new Date(payment.paidAt).toLocaleDateString('fr-FR'):dateStr}`
        :`Echeance: ${payment.dueDate?new Date(payment.dueDate).toLocaleDateString('fr-FR'):'Non definie'}`;
      fill(rx+10,y+42,hw-20,6,...pBg);
      t(pTx,rx+10+(hw-20)/2,y+46.2,{sz:8,wt:'bold',col:pFg,align:'center'});
      y+=62;

      /* ── COLIS TABLE ── */
      const pkgList=invoicePackages(payment);
      if(pkgList.length)y=drawInvoicePackages(doc,pkgList,{y,m,W,H});
      else {t('Aucun colis associé à cette facture.',m,y+6,{sz:9,col:GRAY});y+=15;}
      if(y+125>H-18){doc.addPage();y=22;}

      /* ── DETAILS PAIEMENT + MONTANT ── */
      const BH=58;
      rbox(m,y,hw,BH,LT);
      t('DETAILS DU PAIEMENT',m+10,y+10,{sz:8,wt:'bold',col:GRAY});
      const PR=[
        ['Methode',MLBL[payment.method ?? '']||payment.method||'—'],
        ['Date du paiement',dateStr],
        ['Reference',payment.invoiceNumber||'—'],
        ...(payment.notes?[['Notes',payment.notes.substring(0,25)]]:[] ),
      ];
      let py=y+18;
      PR.forEach(([l,v],i)=>{
        t(l,m+10,py,{sz:9,col:GRAY});
        t(v,m+hw-10,py,{sz:9,wt:'bold',col:INK,align:'right'});
        if(i<PR.length-1) hline(m+10,py+3,m+hw-10);
        py+=10;
      });

      rbox(rx,y,hw,BH,LT);
      t('MONTANT',rx+10,y+10,{sz:8,wt:'bold',col:GRAY});
      const AR=[
        ['Montant total',`${money.total}`],
        ['Deja regle',   `${money.paid}`],
        ['Reste du',     `${money.due}`],
      ];
      let ay=y+18;
      AR.forEach(([l,v])=>{ t(l,rx+10,ay,{sz:9,col:GRAY}); t(v,rx+hw-10,ay,{sz:9,col:INK,align:'right'}); ay+=8; });
      doc.setDrawColor(233,225,213); doc.setLineWidth(0.5);
      doc.line(rx+10,ay,rx+hw-10,ay); ay+=7;
      t('TOTAL PAYE',rx+10,ay,{sz:11,wt:'bold',col:INK});
      t(money.headline,rx+hw-10,ay+1,{sz:18,wt:'bold',col:SC,align:'right'});
      y+=BH+8;

      /* ── SIGNATURES + QR ── */
      const SH=38, SW=(hw-6)/2;
      ['Signature client','Signature agent'].forEach((label,i)=>{
        const sx=m+i*(SW+6);
        rbox(sx,y,SW,SH,WHITE);
        t(label,sx+SW/2,y+SH-7,{sz:9,col:GRAY,align:'center'});
      });
      rbox(rx,y,hw,SH,LT);
      let qrAdded=false;
      try{
        const qrUrl=`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payment.invoiceNumber||payment._id)}&bgcolor=f6f8fc&color=0d1117&margin=4`;
        const qrRes=await fetch(qrUrl,{mode:'cors'});
        const blob=await qrRes.blob();
        const dataUrl=await new Promise<string>(resolve=>{const r=new FileReader();r.onload=e=>resolve((e.target as FileReader).result as string);r.readAsDataURL(blob);});
        const qs=SH-10;
        doc.addImage(dataUrl,'PNG',rx+(hw-qs)/2,y+3,qs,qs);
        t('Scanner pour suivre',rx+hw/2,y+SH-5,{sz:7,col:GRAY,align:'center'});
        qrAdded=true;
      }catch{}
      if(!qrAdded){
        t('REFERENCE',rx+hw/2,y+10,{sz:8,wt:'bold',col:GRAY,align:'center'});
        t(payment.invoiceNumber||'—',rx+hw/2,y+21,{sz:14,wt:'bold',col:BLUE,align:'center'});
        t(`${payment.client?.firstName||''} ${payment.client?.lastName||''} | ${money.total}`,rx+hw/2,y+30,{sz:8,col:GRAY,align:'center'});
      }
      y+=SH+8;

      /* ── FOOTER ── */
      fill(0,H-22,W,22,...INK);
      t('Cette facture fait foi du paiement enregistre. Conservez-la pour tout litige ou remboursement.',W/2,H-14,{sz:8,col:[224,215,199],align:'center'});
      doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.setTextColor(236,213,163);
      doc.text('Trans Africa Canada | www.transafricacanada.com',W/2,H-7,{align:'center'});

      return doc;
    } catch(err){ console.error('PDF error:',err); return null; }
    finally{ setPdfLoading(false); }
  };

  const handleDownloadInvoice = async () => {
    if (!payment) return;
    const pdf = await generatePDF();
    if (!pdf) { toast.error('Erreur de génération PDF'); return; }
    pdf.save(`Facture-${payment.invoiceNumber || id}.pdf`);
    toast.success('Facture téléchargée !');
  };

  /* ── Envoi par email (mailto — pas de backend email requis) ── */
  const handleSendInvoice = async () => {
    if (!payment) return;
    const clientEmail = payment.client?.email || '';
    const subject = encodeURIComponent(`Facture ${payment.invoiceNumber || ''} – Trans Africa Canada`);
    const body = encodeURIComponent([
      `Bonjour ${payment.client?.firstName || ''} ${payment.client?.lastName || ''},`,
      '',
      `Veuillez trouver ci-dessous le détail de votre paiement :`,
      '',
      `📋 Facture N° : ${payment.invoiceNumber || '—'}`,
      `💰 Montant    : ${invoiceAmounts(payment).total}`,
      `📅 Date       : ${new Date(payment.createdAt as string).toLocaleDateString('fr-FR')}`,
      `💳 Méthode    : ${({ cash:'Espèces', card:'Carte bancaire', bank_transfer:'Virement', mobile_money:'Mobile Money', cheque:'Chèque' } as Record<string, string>)[payment.method ?? ''] || payment.method}`,
      `✅ Statut     : ${({ paid:'Payé', pending:'En attente', partial:'Partiel', refunded:'Remboursé', cancelled:'Annulé' } as Record<string, string>)[payment.status ?? ''] || payment.status}`,
      '',
      'Merci pour votre confiance.',
      'Trans Africa Canada',
    ].join('\n'));

    // Essayer d'abord le partage natif avec PDF
    try {
      const pdf  = await generatePDF();
      if (pdf) {
        const blob = pdf.output('blob');
        const file = new File([blob], `Facture-${payment.invoiceNumber || id}.pdf`, { type: 'application/pdf' });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: `Facture ${payment.invoiceNumber}`, text: 'Votre facture Trans Africa Canada' });
          return;
        }
      }
    } catch {}

    // Fallback : mailto
    window.open(`mailto:${clientEmail}?subject=${subject}&body=${body}`);
    toast.info('Client email ouvert — téléchargez le PDF pour le joindre');
  };

  const getStatusConfig = (status?: string) => {
    const configs: Record<string, { icon: IconComponent; color: string; label: string; bg: string }> = {
      'paid':      { icon: CheckCircleIcon, color: tk.emerald, label: 'Payé',        bg: `${tk.emerald}10` },
      'pending':   { icon: ClockIcon,       color: tk.amber,   label: 'En attente',  bg: `${tk.amber}10`   },
      'partial':   { icon: ClockIcon,       color: tk.accent,  label: 'Partiel',     bg: `${tk.accent}10`  },
      'refunded':  { icon: CheckCircleIcon, color: tk.accent,  label: 'Remboursé',   bg: `${tk.accent}10`  },
      'cancelled': { icon: XCircleIcon,     color: tk.rose,    label: 'Annulé',      bg: `${tk.rose}10`    },
    };
    return configs[status ?? ''] || configs['pending'];
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

  if (!payment) {
    return (
      <div style={{ minHeight: '100vh', background: tk.surface }}>
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <BanknotesIcon style={{ width: 64, height: 64, color: tk.textMut, margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 20, fontWeight: 600, color: tk.ink, marginBottom: 12 }}>Paiement introuvable</h2>
          <button
            onClick={() => navigate('/app/payments')}
            style={{
              padding: '10px 24px', borderRadius: 10,
              background: '#347FC5', color: '#fff', border: 'none',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(payment.status);

  return (
    <div style={{ minHeight: '100vh', background: tk.surface }}>

      {/* ─────────────── HERO — identique à ClientsList ─────────────── */}
      <section className="easy-internal-header" style={{
        position: 'relative', height: 240,
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
            padding: '6px 16px', marginBottom: 18,
          }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#C5DCEF' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
              DÉTAIL DU PAIEMENT
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 8, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Facture{' '}
            <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {payment.invoiceNumber || `#${(id ?? '').slice(-6).toUpperCase()}`}
            </span>
          </h1>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(8px)',
            borderRadius: 99, padding: '8px 20px', marginTop: 8,
          }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#C5DCEF' }}>
              {invoiceAmounts(payment).total}
            </span>
            <span style={{ fontSize: 12, color: '#172F50' }}>
              • {new Date(payment.createdAt as string).toLocaleDateString('fr-FR')}
            </span>
          </div>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─────────────── CONTENU ─────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 48px' }}>

        {/* Header avec bouton retour et actions */}
        <div className="pd-action-bar" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 24, flexWrap: 'wrap', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/app/payments')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 10,
                background: '#fff', border: `1.5px solid ${tk.border}`,
                fontSize: 13, fontWeight: 500, color: tk.textSec,
                cursor: 'pointer', transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = tk.surface; e.currentTarget.style.borderColor = tk.accent; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
            >
              <ArrowLeftIcon style={{ width: 14, height: 14 }} />
              Retour
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 99,
                background: statusConfig.bg, color: statusConfig.color,
                fontSize: 12, fontWeight: 600,
              }}>
                {statusConfig.icon && <statusConfig.icon style={{ width: 12, height: 12 }} />}
                {statusConfig.label}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={handleSendInvoice}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 20px', borderRadius: 10,
                border: `1.5px solid ${tk.border}`, background: '#fff',
                fontSize: 13, fontWeight: 500, color: tk.textSec,
                cursor: 'pointer', transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = tk.surface; e.currentTarget.style.borderColor = tk.accent; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
            >
              <EnvelopeIcon style={{ width: 14, height: 14 }} />
              Envoyer facture
            </button>
            <button
              onClick={handleDownloadInvoice}
              disabled={pdfLoading}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 20px', borderRadius: 10,
                background: '#347FC5', color: '#fff', border: 'none',
                fontSize: 13, fontWeight: 600,
                cursor: pdfLoading ? 'not-allowed' : 'pointer',
                opacity: pdfLoading ? 0.7 : 1,
                transition: 'all .15s',
              }}
              onMouseEnter={e => { if (!pdfLoading) e.currentTarget.style.background = '#172F50'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#347FC5'; }}
            >
              {pdfLoading
                ? <><span style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin .7s linear infinite' }} /> Génération…</>
                : <><PrinterIcon style={{ width: 14, height: 14 }} /> Télécharger PDF</>
              }
            </button>
          </div>
        </div>

        {/* ─── Facture — même style que le bordereau AddPackage ─── */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          border: `1.5px solid ${tk.border}`,
          boxShadow: '0 4px 24px rgba(23,47,80,.08)',
          overflow: 'hidden',
        }}>
          <PaymentInvoice ref={invoiceRef} payment={payment} />
        </div>

        {/* ─── Bouton "Voir profil client" sous la facture ─── */}
        {payment.client && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button
              onClick={() => navigate(`/app/clients/${payment.client?._id}`)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 10,
                border: `1.5px solid ${tk.border}`, background: '#fff',
                fontSize: 13, fontWeight: 500, color: tk.textSec,
                cursor: 'pointer', transition: 'all .15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = tk.surface; e.currentTarget.style.borderColor = tk.accent; e.currentTarget.style.color = tk.accent; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.color = tk.textSec; }}
            >
              Voir profil client →
            </button>
          </div>
        )}
      </div>


      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Responsive PaymentDetail ───────────────────── */

        /* Boutons d'action : empiler sur mobile */
        @media (max-width: 600px) {
          .pd-action-bar {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .pd-action-bar > div:first-child,
          .pd-action-bar > div:last-child {
            width: 100%;
            justify-content: center;
          }
          .pd-action-bar button {
            flex: 1;
            justify-content: center;
          }
        }

        /* Facture interne : rendre les grilles 2→1 colonne */
        @media (max-width: 680px) {
          .pi-2col {
            grid-template-columns: 1fr !important;
          }
          .pi-qr-row {
            grid-template-columns: 1fr !important;
          }
          .pi-sig-grid {
            grid-template-columns: 1fr !important;
          }
          /* QR code : centrer sous les signatures */
          .pi-qr-row > div:last-child {
            min-width: unset !important;
            align-items: flex-start !important;
          }
        }

        /* Padding de la facture sur petit écran */
        @media (max-width: 520px) {
          .pi-invoice-body {
            padding: 16px !important;
          }
          .pi-header-row {
            flex-direction: column !important;
            gap: 12px !important;
          }
          .pi-header-row > div:last-child {
            text-align: left !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentDetail;