// Module Finance — registre des colis à contrat financier : total, payé, reste et statut calculés
// par le SERVEUR (mêmes règles que la fiche colis : paiements valides uniquement), recherche par
// numéro de suivi, lien direct vers la fiche du colis. Aucune somme entre devises différentes.
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { amountText } from './FinancialSummary';

const tk = { ink: '#171614', surface: '#faf8f5', border: '#e9e1d5', accent: '#a77b28', textMut: '#8494a9', red: '#b91c1c' };
const STATUS = {
  unpaid:  { label: 'Non payé',            bg: '#fef3c7', fg: '#92400e' },
  partial: { label: 'Partiellement payé',  bg: '#fdf0e2', fg: '#77551c' },
  paid:    { label: 'Payé',                bg: '#d1fae5', fg: '#065f46' },
};

export default function FinancialLedger() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let current = true;
    const t = setTimeout(() => {
      setLoading(true);
      axios.get('/shipping-finance/ledger', { params: q.trim() ? { q: q.trim() } : {} })
        .then((r) => { if (current) { setRows(r.data.data || []); setError(''); } })
        .catch((e) => { if (current) setError(e.response?.data?.message || e.message); })
        .finally(() => current && setLoading(false));
    }, 250);
    return () => { current = false; clearTimeout(t); };
  }, [q]);

  return (
    <section data-testid="finance-ledger" style={{ padding: 20, margin: 16, border: `1px solid ${tk.border}`, borderTop: `4px solid ${tk.accent}`, borderRadius: 14, background: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
        <div>
          <h2 style={{ fontWeight: 800, fontSize: 19, color: tk.ink }}>Colis & paiements</h2>
          <p style={{ fontSize: 12, color: tk.textMut }}>Montants dans la devise de chaque colis ; paiements annulés exclus. Derniers 500 colis de votre périmètre.</p>
        </div>
        <input aria-label="Rechercher un numéro de suivi" placeholder="N° de suivi (ex. LGT-FE4A3084)" value={q} onChange={(e) => setQ(e.target.value)}
          style={{ padding: '9px 12px', borderRadius: 10, border: `1.5px solid ${tk.border}`, minWidth: 240, fontSize: 13 }} />
      </div>
      {error && <p role="alert" style={{ color: tk.red }}>{error}</p>}
      {!loading && !rows.length && !error && <p style={{ color: tk.textMut, padding: '10px 0' }}>{q ? 'Aucun colis pour ce numéro de suivi.' : 'Aucun colis à contrat financier.'}</p>}
      {!!rows.length && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 720 }}>
            <thead>
              <tr style={{ background: tk.surface, color: tk.textMut }}>
                {['N° de suivi', 'Trajet', 'Montant total', 'Payé', 'Reste à payer', 'Paiements', 'Statut'].map((h, i) => (
                  <th key={h} style={{ padding: '8px 10px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', textAlign: i >= 2 && i <= 5 ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => {
                const s = p.summary || {};
                const st = STATUS[s.status] || STATUS.unpaid;
                return (
                  <tr key={p._id} data-testid="ledger-row" style={{ borderTop: `1px solid ${tk.border}` }}>
                    <td style={{ padding: '9px 10px', fontWeight: 700 }}><Link to={`/app/packages/${p._id}`} style={{ color: tk.accent }}>{p.trackingNumber}</Link></td>
                    <td style={{ padding: '9px 10px' }}>{p.origin} → {p.destination}</td>
                    <td style={{ padding: '9px 10px', textAlign: 'right', whiteSpace: 'nowrap' }}>{amountText(s.totalMinor, s.currency)}</td>
                    <td style={{ padding: '9px 10px', textAlign: 'right', whiteSpace: 'nowrap' }}>{amountText(s.paidMinor, s.currency)}</td>
                    <td style={{ padding: '9px 10px', textAlign: 'right', whiteSpace: 'nowrap', fontWeight: 700 }}>{amountText(s.remainingMinor, s.currency)}</td>
                    <td style={{ padding: '9px 10px', textAlign: 'right' }}>{s.validCount ?? 0}{s.cancelledCount ? <span style={{ color: tk.textMut }}> (+{s.cancelledCount} annulé{s.cancelledCount > 1 ? 's' : ''})</span> : ''}</td>
                    <td style={{ padding: '9px 10px' }}><span style={{ padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700, background: st.bg, color: st.fg }}>{st.label}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
