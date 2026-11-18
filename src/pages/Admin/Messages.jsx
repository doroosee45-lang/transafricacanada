import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { countryOf } from '../../config/currencies';
import WebSocketService from '../../services/websocket';

/* Boîte de réception des messages du formulaire de contact (administrateurs).
   Toutes les actions passent par l'API ; l'interface n'affiche que les résultats réels. */

const tk = {
  ink: '#171614', surface: '#faf8f5', border: '#e9e1d5', accent: '#a77b28',
  textSec: '#4b5a6e', textMut: '#8494a9', emerald: '#059669', rose: '#dc2626', amber: '#d97706',
};

const STATUS = {
  new:         { label: 'Nouveau',  color: tk.accent },
  read:        { label: 'Lu',       color: tk.textSec },
  in_progress: { label: 'En cours', color: tk.amber },
  answered:    { label: 'Répondu',  color: tk.emerald },
  closed:      { label: 'Clôturé',  color: tk.textMut },
};
const DELIVERY = {
  sent:      { label: 'E-mail envoyé', color: tk.emerald },
  simulated: { label: 'Non envoyé (serveur e-mail non configuré)', color: tk.amber },
  failed:    { label: "Échec de l'envoi", color: tk.rose },
};
const HISTORY = { created: 'Reçu', read: 'Lu', status: 'Statut modifié', reply: 'Réponse' };
// Libellés français des statuts et résultats d'envoi dans l'historique (au lieu des codes bruts).
const label = (code) => STATUS[code]?.label || DELIVERY[code]?.label || code;

const Badge = ({ cfg }) => (
  <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, color: cfg.color, background: `${cfg.color}14`, border: `1px solid ${cfg.color}33` }}>{cfg.label}</span>
);

const fmtDate = (d) => (d ? new Date(d).toLocaleString('fr-FR') : '—');
const errMsg = (e, fallback) => e.response?.data?.message || (!e.response ? 'Serveur injoignable.' : fallback);

export default function Messages() {
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('id');
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState(null);
  const [detailError, setDetailError] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

  const loadList = useCallback(async () => {
    setError('');
    try {
      const res = await axios.get('/contact/messages', { params: { limit: 50, ...(filters.status === 'unread' ? { unread: 'true' } : filters.status ? { status: filters.status } : {}), ...(filters.search ? { search: filters.search } : {}) } });
      setItems(res.data.data || []);
      setUnreadCount(res.data.unreadCount ?? 0);
    } catch (e) {
      setError(errMsg(e, 'Impossible de charger les messages.'));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadDetail = useCallback(async (id) => {
    setDetailError('');
    try {
      const res = await axios.get(`/contact/messages/${id}`);
      setDetail(res.data.data);
      loadList(); // la consultation marque le message comme lu : compteur à jour
    } catch (e) {
      setDetail(null);
      setDetailError(errMsg(e, 'Message introuvable.'));
    }
  }, [loadList]);

  useEffect(() => { const t = setTimeout(loadList, 250); return () => clearTimeout(t); }, [loadList]);
  useEffect(() => { if (selectedId) loadDetail(selectedId); else setDetail(null); }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Nouveau message : la notification temps réel (catégorie contact) rafraîchit la liste.
  useEffect(() => {
    const onNotification = (n) => { if (n?.category === 'contact') loadList(); };
    WebSocketService.connect();
    WebSocketService.on('notification', onNotification);
    return () => WebSocketService.off('notification', onNotification);
  }, [loadList]);

  const changeStatus = async (status) => {
    try {
      const res = await axios.patch(`/contact/messages/${detail._id}/status`, { status });
      setDetail((d) => ({ ...d, ...res.data.data }));
      toast.success('Statut mis à jour.');
      loadDetail(detail._id);
    } catch (e) {
      toast.error(errMsg(e, 'Statut non modifié.'));
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (sending || reply.trim().length < 2) return;
    setSending(true);
    try {
      const res = await axios.post(`/contact/messages/${detail._id}/replies`, { body: reply.trim() });
      // 201 : envoyé ; 202 : enregistré mais NON envoyé (SMTP absent) — affiché tel quel.
      if (res.status === 201) toast.success(res.data.message); else toast.warn(res.data.message);
      setReply('');
      loadDetail(detail._id);
    } catch (e) {
      toast.error(errMsg(e, "La réponse n'a pas été enregistrée."));
      if (e.response?.status === 502) { setReply(''); loadDetail(detail._id); } // enregistrée, envoi échoué
    } finally {
      setSending(false);
    }
  };

  const open = (id) => setParams(id ? { id } : {});

  return (
    <div style={{ padding: '24px 16px', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: tk.ink, margin: 0 }}>Messages de contact</h1>
        <span aria-live="polite" style={{ fontSize: 13, color: unreadCount ? tk.accent : tk.textMut, fontWeight: 600 }}>
          {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
        </span>
      </div>

      <div className="msg-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 380px) minmax(0, 1fr)', gap: 20 }}>
        <section aria-label="Liste des messages" style={{ background: '#fff', border: `1.5px solid ${tk.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 8, padding: 12, borderBottom: `1px solid ${tk.border}`, background: tk.surface }}>
            <input aria-label="Rechercher" placeholder="Rechercher (réf., nom, e-mail, sujet)" value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              style={{ flex: 1, minWidth: 0, padding: '8px 10px', borderRadius: 8, border: `1px solid ${tk.border}`, fontSize: 13 }} />
            <select aria-label="Filtrer par statut" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              style={{ padding: '8px', borderRadius: 8, border: `1px solid ${tk.border}`, fontSize: 13 }}>
              <option value="">Tous</option>
              <option value="unread">Non lus</option>
              {Object.entries(STATUS).filter(([k]) => k !== 'new').map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          {loading ? <p style={{ padding: 20, color: tk.textMut }}>Chargement…</p>
            : error ? <p role="alert" style={{ padding: 20, color: tk.rose }}>{error}</p>
            : items.length === 0 ? <p style={{ padding: 20, color: tk.textMut }}>Aucun message.</p>
            : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, maxHeight: '70vh', overflowY: 'auto' }}>
                {items.map((m) => (
                  <li key={m._id}>
                    <button type="button" onClick={() => open(m._id)} aria-current={selectedId === m._id}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 14px', border: 'none', borderBottom: `1px solid ${tk.border}`, cursor: 'pointer',
                        background: selectedId === m._id ? `${tk.accent}12` : '#fff', fontWeight: m.status === 'new' ? 700 : 400 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ fontSize: 13, color: tk.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.status === 'new' && '● '}{m.subject}</span>
                        <Badge cfg={STATUS[m.status] || STATUS.read} />
                      </div>
                      <div style={{ fontSize: 12, color: tk.textSec, marginTop: 4 }}>{m.name} · {m.reference}</div>
                      <div style={{ fontSize: 11, color: tk.textMut, marginTop: 2 }}>{fmtDate(m.createdAt)}{m.market ? ` · ${countryOf(m.market)?.name || m.market}` : ''}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
        </section>

        <section aria-label="Détail du message" style={{ background: '#fff', border: `1.5px solid ${tk.border}`, borderRadius: 16, padding: 20, minHeight: 300 }}>
          {detailError ? <p role="alert" style={{ color: tk.rose }}>{detailError}</p>
            : !detail ? <p style={{ color: tk.textMut }}>Sélectionnez un message.</p>
            : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: 18, color: tk.ink }}>{detail.subject}</h2>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: tk.textSec }}>
                      {detail.name} — <a href={`mailto:${detail.email}`}>{detail.email}</a>{detail.phone ? ` — ${detail.phone}` : ''}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, color: tk.textMut }}>
                      {detail.reference} · reçu le {fmtDate(detail.createdAt)}{detail.market ? ` · ${countryOf(detail.market)?.name || detail.market}` : ''}
                    </p>
                  </div>
                  <label style={{ fontSize: 12, color: tk.textSec }}>
                    Statut{' '}
                    <select value={detail.status} onChange={(e) => changeStatus(e.target.value)} style={{ padding: 6, borderRadius: 8, border: `1px solid ${tk.border}` }}>
                      {detail.status === 'new' && <option value="new">Nouveau</option>}
                      {Object.entries(STATUS).filter(([k]) => k !== 'new').map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </label>
                </div>
                <p style={{ whiteSpace: 'pre-wrap', fontSize: 14, color: tk.ink, background: tk.surface, border: `1px solid ${tk.border}`, borderRadius: 12, padding: 14, marginTop: 16 }}>{detail.message}</p>

                <h3 style={{ fontSize: 14, marginTop: 20 }}>Réponses ({detail.replies?.length || 0})</h3>
                {(detail.replies || []).map((r) => (
                  <div key={r._id} style={{ borderLeft: `3px solid ${(DELIVERY[r.delivery] || DELIVERY.failed).color}`, padding: '8px 12px', margin: '8px 0', background: tk.surface, borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', fontSize: 12, color: tk.textSec }}>
                      <span>{r.author ? `${r.author.firstName} ${r.author.lastName}` : '—'} · {fmtDate(r.sentAt)}</span>
                      <Badge cfg={DELIVERY[r.delivery] || DELIVERY.failed} />
                    </div>
                    <p style={{ whiteSpace: 'pre-wrap', fontSize: 13, margin: '6px 0 0' }}>{r.body}</p>
                  </div>
                ))}

                <form onSubmit={sendReply} style={{ marginTop: 12 }}>
                  <label htmlFor="reply-body" style={{ fontSize: 13, fontWeight: 600, color: tk.textSec }}>Répondre par e-mail à {detail.email}</label>
                  <textarea id="reply-body" value={reply} onChange={(e) => setReply(e.target.value)} rows={4} maxLength={5000}
                    style={{ display: 'block', width: '100%', marginTop: 6, padding: 10, borderRadius: 10, border: `1px solid ${tk.border}`, fontFamily: 'inherit', fontSize: 13 }} />
                  <button type="submit" disabled={sending || reply.trim().length < 2}
                    style={{ marginTop: 8, padding: '9px 18px', borderRadius: 10, border: 'none', background: tk.accent, color: '#fff', fontWeight: 600, cursor: sending ? 'wait' : 'pointer', opacity: sending || reply.trim().length < 2 ? 0.6 : 1 }}>
                    {sending ? 'Envoi…' : 'Envoyer la réponse'}
                  </button>
                </form>

                <h3 style={{ fontSize: 14, marginTop: 20 }}>Historique</h3>
                <ol style={{ fontSize: 12, color: tk.textSec, paddingLeft: 18 }}>
                  {(detail.history || []).map((h, i) => (
                    <li key={i}>{fmtDate(h.at)} — {HISTORY[h.action] || h.action}{h.from || h.to ? ` (${[h.from, h.to].filter(Boolean).map(label).join(' → ')})` : ''}{h.by ? ` par ${h.by.firstName} ${h.by.lastName}` : ''}</li>
                  ))}
                </ol>
              </>
            )}
        </section>
      </div>
      <style>{`@media (max-width: 900px) { .msg-grid { grid-template-columns: minmax(0, 1fr) !important; } }`}</style>
    </div>
  );
}
