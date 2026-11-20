// Section financière de la fiche colis : situation (calculée par le SERVEUR à partir des paiements
// valides), « + Ajouter un paiement », historique, annulation tracée. Données :
//   GET  /shipping-finance/packages/:id/payments            (personnel du périmètre)
//   POST /shipping-finance/packages/:id/transactions         (clé d'idempotence par saisie)
//   POST /shipping-finance/packages/:id/transactions/:key/cancel  (admin / manager, motif)
// Un client voit la situation de son colis (pkg.financialSummary), sans formulaire.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PlusIcon, XMarkIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import axios from '../../api/axios';
import { amountText, moneyDigits } from './FinancialSummary';
import { asHttpError } from '../../types/api';
import type { Package, PaymentSituation, User } from '../../types/models';

/** Auteur d'une saisie ou d'une annulation (tel que renvoyé par le serveur). */
interface Actor { name?: string; role?: string }

/** Paiement enregistré sur le colis. */
interface PackagePaymentEntry {
  key: string;
  kind?: string;
  status?: string;
  amountMinor?: number;
  referenceMinor?: number;
  currency?: string;
  rate?: number | string;
  method?: string;
  reference?: string;
  note?: string;
  paidAt?: string;
  recordedBy?: Actor | null;
  cancelledBy?: Actor | null;
  cancelReason?: string;
}

/** Situation enrichie (devise de destination et taux figé). */
interface PackagePaymentSummary extends PaymentSituation {
  destinationCurrency?: string;
  remainingDestinationMinor?: number | null;
  rate?: number | string;
}

interface PaymentsView {
  summary?: PackagePaymentSummary;
  payments?: PackagePaymentEntry[];
  trackingNumber?: string;
}

interface PaymentForm {
  amount: string;
  currency: string;
  method: string;
  reference: string;
  paidAt: string;
  note: string;
}

interface PackagePaymentsProps {
  pkg: Package;
  user?: User | null;
  onChanged?: (pkg?: Package) => void;
}

const tk = { ink: '#172F50', surface: '#F7FAFE', border: '#DCE9F5', accent: '#4D91D9', emerald: '#059669', amber: '#d97706', red: '#dc2626', textSec: '#52677D', textMut: '#8295A8' };
const STAFF: string[] = ['superadmin', 'admin', 'manager', 'agent'];
const STATUS: Record<string, { label: string; bg: string; fg: string }> = {
  unpaid:  { label: 'NON PAYÉ',            bg: '#fef3c7', fg: '#92400e' },
  partial: { label: 'PARTIELLEMENT PAYÉ',  bg: '#EDF5FC', fg: '#172F50' },
  paid:    { label: 'PAYÉ',                bg: '#d1fae5', fg: '#065f46' },
};
const METHODS = [['cash', 'Espèces'], ['mobile_money', 'Mobile Money'], ['bank_transfer', 'Virement bancaire'], ['card', 'Carte bancaire'], ['cheque', 'Chèque'], ['other', 'Autre']];
const methodLabel = (m?: string) => METHODS.find(([v]) => v === m)?.[1] || m;
const ROLE: Record<string, string> = { superadmin: 'Super-admin', admin: 'Admin', manager: 'Manager', agent: 'Agent' };
const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: 10, border: `1.5px solid ${tk.border}`, fontSize: 14, boxSizing: 'border-box', background: '#fff', color: tk.ink };
const ro: React.CSSProperties = { ...inp, background: '#f8fafc', color: tk.textSec };
const today = () => new Date().toISOString().slice(0, 10);
const newKey = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`);

const Badge = ({ status }: { status?: string }) => {
  const s = (status && STATUS[status]) || STATUS.unpaid;
  return <span data-testid="payment-status" style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 800, letterSpacing: '.04em', background: s.bg, color: s.fg }}>{s.label}</span>;
};
const Cell = ({ label, children, strong }: { label: string; children: React.ReactNode; strong?: boolean }) => (
  <div style={{ background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 12, padding: '12px 14px', minWidth: 0 }}>
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.textMut, marginBottom: 4 }}>{label}</p>
    <div style={{ fontSize: strong ? 17 : 15, fontWeight: 800, color: tk.ink, overflowWrap: 'anywhere' }}>{children}</div>
  </div>
);

export default function PackagePayments({ pkg, user, onChanged }: PackagePaymentsProps) {
  const isStaff = !!user?.role && STAFF.includes(user.role);
  const [view, setView] = useState<PaymentsView | null>(null);         // { summary, payments, trackingNumber }
  const [perm, setPerm] = useState<{ canPay?: boolean; canCancel?: boolean }>({ canPay: false, canCancel: false });
  const [loadError, setLoadError] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<PaymentForm | null>(null);
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const keyRef = useRef<string | null>(null);

  const load = useCallback(async () => {
    if (!isStaff) return;
    try {
      const r = await axios.get(`/shipping-finance/packages/${pkg._id}/payments`);
      setView(r.data.data); setPerm(r.data.permissions || {}); setLoadError('');
    } catch (caught) { const e = asHttpError(caught); setLoadError(e.response?.data?.message || 'Situation financière indisponible.'); }
  }, [isStaff, pkg._id]);
  useEffect(() => { load(); }, [load]);

  const summary: PackagePaymentSummary | null | undefined = view?.summary || pkg.financialSummary;
  if (!pkg.financial || !summary) return null;
  const cur = summary.currency, dest = summary.destinationCurrency;
  const canAdd = isStaff && perm.canPay && summary.status !== 'paid';

  const openForm = () => {
    keyRef.current = newKey(); // une clé par saisie : un double clic ne crée jamais deux paiements
    setForm({ amount: '', currency: cur ?? '', method: 'cash', reference: '', paidAt: today(), note: '' });
    setFormError(''); setOpen(true);
  };
  const remainingFor = (c: string) => (c === cur ? summary.remainingMinor : summary.remainingDestinationMinor) as number;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy || !form) return;
    const d = moneyDigits[form.currency] ?? 2;
    const amount = Number(form.amount);
    if (!(amount > 0)) { setFormError('Le montant doit être strictement supérieur à zéro.'); return; }
    if (Math.round(amount * 10 ** d) > remainingFor(form.currency)) { setFormError(`Le montant dépasse le reste à payer (${amountText(remainingFor(form.currency), form.currency)}).`); return; }
    setBusy(true); setFormError('');
    try {
      const r = await axios.post(`/shipping-finance/packages/${pkg._id}/transactions`, {
        key: keyRef.current, amount: form.amount, currency: form.currency, method: form.method,
        reference: form.reference || undefined, note: form.note || undefined,
        paidAt: form.paidAt ? new Date(`${form.paidAt}T12:00:00`).toISOString() : undefined,
      });
      setView(r.data.payments); setOpen(false); keyRef.current = null;
      onChanged?.(r.data.data);
    } catch (caught) {
      const err = asHttpError(caught);
      // Erreur de validation : nouvelle clé pour la prochaine tentative ; erreur réseau : même clé (rejeu sûr).
      if (err.response && (err.response.status ?? 0) < 500) keyRef.current = newKey();
      setFormError(err.response?.data?.message || 'Paiement non confirmé. Réessayez : il ne sera pas enregistré deux fois.');
    } finally { setBusy(false); }
  };

  const cancel = async (p: PackagePaymentEntry) => {
    const reason = window.prompt(`Annuler le paiement de ${amountText(p.amountMinor, p.currency)} ?\nMotif obligatoire (il sera conservé dans l'historique) :`);
    if (reason === null) return;
    try {
      const r = await axios.post(`/shipping-finance/packages/${pkg._id}/transactions/${encodeURIComponent(p.key)}/cancel`, { reason });
      setView(r.data.payments); onChanged?.(r.data.data);
    } catch (caught) { const err = asHttpError(caught); window.alert(err.response?.data?.message || 'Annulation impossible.'); }
  };

  return (
    <section aria-label="Paiements du colis" data-testid="package-payments" style={{ background: '#fff', border: `1.5px solid ${tk.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(23,47,80,.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: '14px 18px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BanknotesIcon style={{ width: 18, height: 18, color: tk.accent }} />
          <h2 style={{ fontSize: 15, fontWeight: 800, color: tk.ink }}>Paiements du colis</h2>
          <Badge status={summary.status} />
        </div>
        {isStaff && (
          <button type="button" onClick={openForm} disabled={!canAdd}
            title={summary.status === 'paid' ? 'Colis entièrement payé' : !perm.canPay ? 'Non autorisé' : ''}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, border: 'none', background: canAdd ? '#347FC5' : '#cbd5e1', color: '#fff', fontWeight: 700, fontSize: 13, cursor: canAdd ? 'pointer' : 'not-allowed' }}>
            <PlusIcon style={{ width: 15, height: 15 }} /> Ajouter un paiement
          </button>
        )}
      </div>

      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loadError && <p role="alert" style={{ color: tk.red, fontSize: 13 }}>{loadError}</p>}
        <div className="pp-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
          <Cell label="N° de suivi">{pkg.trackingNumber}</Cell>
          <Cell label="Montant total" strong>{amountText(summary.totalMinor, cur)}</Cell>
          <Cell label="Déjà payé">{amountText(summary.paidMinor, cur)}</Cell>
          <Cell label="Reste à payer" strong>
            <span data-testid="remaining">{amountText(summary.remainingMinor, cur)}</span>
            {dest !== cur && (summary.remainingMinor ?? 0) > 0 && <span style={{ display: 'block', fontSize: 11, fontWeight: 600, color: tk.textMut }}>soit {amountText(summary.remainingDestinationMinor, dest)} au taux figé</span>}
          </Cell>
        </div>
        {dest !== cur && <p style={{ fontSize: 12, color: tk.textMut }}>Taux figé au contrat : 1 {cur} = {summary.rate} {dest}. Paiement possible en {cur} ou en {dest}.</p>}

        {isStaff && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 640 }}>
              <thead>
                <tr style={{ background: tk.surface, color: tk.textMut, textAlign: 'left' }}>
                  {['Date', 'Référence', 'Montant', 'Mode', 'Enregistré par', 'Statut', ''].map((h) => <th key={h} style={{ padding: '8px 10px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', textAlign: h === 'Montant' ? 'right' : 'left' }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {!view?.payments?.length && (
                  <tr><td colSpan={7} style={{ padding: 14, color: tk.textMut, textAlign: 'center' }}>Aucun paiement enregistré pour ce colis.</td></tr>
                )}
                {view?.payments?.map((p) => {
                  const cancelled = p.status === 'cancelled';
                  return (
                    <tr key={p.key} data-testid="payment-row" style={{ borderTop: `1px solid ${tk.border}`, opacity: cancelled ? .6 : 1 }}>
                      <td style={{ padding: '9px 10px', whiteSpace: 'nowrap' }}>{new Date(p.paidAt as string).toLocaleDateString('fr-FR')}</td>
                      <td style={{ padding: '9px 10px' }}>{p.reference || (p.kind === 'advance' ? 'Avance au départ' : '—')}{p.note && <span style={{ display: 'block', fontSize: 11, color: tk.textMut }}>{p.note}</span>}</td>
                      <td style={{ padding: '9px 10px', textAlign: 'right', fontWeight: 700, whiteSpace: 'nowrap', textDecoration: cancelled ? 'line-through' : 'none' }}>
                        {amountText(p.amountMinor, p.currency)}
                        {p.currency !== cur && <span style={{ display: 'block', fontSize: 11, fontWeight: 500, color: tk.textMut }}>= {amountText(p.referenceMinor, cur)} (taux {p.rate})</span>}
                      </td>
                      <td style={{ padding: '9px 10px' }}>{methodLabel(p.method)}</td>
                      <td style={{ padding: '9px 10px' }}>{p.recordedBy ? `${p.recordedBy.name}${p.recordedBy.role ? ` (${ROLE[p.recordedBy.role] || p.recordedBy.role})` : ''}` : '—'}</td>
                      <td style={{ padding: '9px 10px' }}>
                        {cancelled
                          ? <span title={`${p.cancelReason || ''}`} style={{ color: tk.red, fontWeight: 700 }}>Annulé{p.cancelledBy ? ` par ${p.cancelledBy.name}` : ''}<span style={{ display: 'block', fontSize: 11, fontWeight: 500 }}>{p.cancelReason}</span></span>
                          : <span style={{ color: tk.emerald, fontWeight: 700 }}>Validé</span>}
                      </td>
                      <td style={{ padding: '9px 10px', textAlign: 'right' }}>
                        {!cancelled && perm.canCancel && <button type="button" onClick={() => cancel(p)} style={{ fontSize: 12, color: tk.red, background: 'none', border: `1px solid ${tk.red}55`, borderRadius: 8, padding: '4px 10px', cursor: 'pointer' }}>Annuler</button>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open && form && (
        <div role="dialog" aria-modal="true" aria-label="Ajouter un paiement" style={{ position: 'fixed', inset: 0, background: 'rgba(23,47,80,.55)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <form onSubmit={submit} style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: tk.ink, color: '#fff', borderTop: `4px solid ${tk.accent}`, borderRadius: '16px 16px 0 0' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800 }}>Ajouter un paiement</h3>
              <button type="button" aria-label="Fermer" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><XMarkIcon style={{ width: 20, height: 20 }} /></button>
            </div>
            <div style={{ padding: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label style={{ gridColumn: '1 / -1', fontSize: 12, color: tk.textSec }}>N° de suivi<input value={pkg.trackingNumber} readOnly style={ro} /></label>
              <label style={{ fontSize: 12, color: tk.textSec }}>Montant total<input value={amountText(summary.totalMinor, cur)} readOnly style={ro} /></label>
              <label style={{ fontSize: 12, color: tk.textSec }}>Reste à payer<input value={amountText(remainingFor(form.currency), form.currency)} readOnly style={ro} data-testid="form-remaining" /></label>
              <label style={{ fontSize: 12, color: tk.textSec }}>Montant du paiement *
                <input id="pay-amount" type="number" min="0" step={String(10 ** -(moneyDigits[form.currency] ?? 2))} required value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} style={inp} />
              </label>
              <label style={{ fontSize: 12, color: tk.textSec }}>Devise
                <select id="pay-currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} style={inp}>
                  <option value={cur}>{cur} — devise du colis</option>
                  {dest !== cur && <option value={dest}>{dest} — au taux figé {summary.rate}</option>}
                </select>
              </label>
              <label style={{ fontSize: 12, color: tk.textSec }}>Mode de paiement *
                <select id="pay-method" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} style={inp}>
                  {METHODS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
              <label style={{ fontSize: 12, color: tk.textSec }}>Date du paiement
                <input id="pay-date" type="date" max={today()} value={form.paidAt} onChange={(e) => setForm({ ...form, paidAt: e.target.value })} style={inp} />
              </label>
              <label style={{ gridColumn: '1 / -1', fontSize: 12, color: tk.textSec }}>Référence de transaction
                <input id="pay-reference" maxLength={100} placeholder="N° de reçu, de virement, de transaction mobile…" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} style={inp} />
              </label>
              <label style={{ gridColumn: '1 / -1', fontSize: 12, color: tk.textSec }}>Observation
                <textarea id="pay-note" rows={2} maxLength={500} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} style={{ ...inp, resize: 'vertical' }} />
              </label>
              {formError && <p role="alert" style={{ gridColumn: '1 / -1', color: tk.red, fontSize: 13 }}>{formError}</p>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, padding: '0 18px 18px' }}>
              <button type="button" onClick={() => setOpen(false)} style={{ padding: '10px 16px', borderRadius: 10, border: `1.5px solid ${tk.border}`, background: '#fff', cursor: 'pointer' }}>Annuler</button>
              <button type="submit" disabled={busy} style={{ padding: '10px 18px', borderRadius: 10, border: 'none', background: tk.emerald, color: '#fff', fontWeight: 700, cursor: busy ? 'wait' : 'pointer', opacity: busy ? .7 : 1 }}>
                {busy ? 'Enregistrement…' : 'Enregistrer le paiement'}
              </button>
            </div>
          </form>
        </div>
      )}
      <style>{`@media (max-width: 560px) { [aria-label="Ajouter un paiement"] form > div:nth-child(2) { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}
