import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UsersIcon, UserCircleIcon, SparklesIcon,
  MagnifyingGlassIcon, FunnelIcon, XMarkIcon,
  TrashIcon, PencilIcon, PlusIcon, EyeIcon,
  ShieldCheckIcon, CheckCircleIcon, XCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';

const tk = {
  ink:     '#171614',
  ink80:   '#26231e',
  surface: '#faf8f5',
  surf2:   '#f5efe6',
  border:  '#e9e1d5',
  accent:  '#a77b28',
  emerald: '#059669',
  amber:   '#d97706',
  rose:    '#dc2626',
  violet:  '#7c3aed',
  textSec: '#4b5a6e',
  textMut: '#8494a9',
};

const inputStyle = {
  padding: '9px 13px', borderRadius: 10, fontSize: 13,
  border: `1.5px solid ${tk.border}`, background: '#fff',
  color: tk.ink, outline: 'none', fontFamily: "'DM Sans',sans-serif",
};

/* ── Badges ── */
const RoleBadge = ({ role }) => {
  const map = {
    superadmin: { bg: '#fdf4ff', color: '#7c3aed', label: 'Super Admin' },
    admin:      { bg: '#fff8ee', color: '#a77b28', label: 'Admin' },
    manager:    { bg: '#f0fdf4', color: '#059669', label: 'Manager' },
    agent:      { bg: '#fffbeb', color: '#d97706', label: 'Agent' },
    driver:     { bg: '#fff7ed', color: '#ea580c', label: 'Chauffeur' },
    client:     { bg: '#f8fafc', color: '#64748b', label: 'Client' },
  };
  const s = map[role] || { bg: '#f8fafc', color: '#64748b', label: role };
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
      background: s.bg, color: s.color, letterSpacing: '.04em',
    }}>{s.label}</span>
  );
};

const ActiveBadge = ({ active }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99,
    background: active ? 'rgba(5,150,105,.1)' : 'rgba(220,38,38,.08)',
    color: active ? tk.emerald : tk.rose,
  }}>
    {active
      ? <CheckCircleIcon style={{ width: 12, height: 12 }} />
      : <XCircleIcon     style={{ width: 12, height: 12 }} />}
    {active ? 'Actif' : 'Inactif'}
  </span>
);

/* ── Stat Card ── */
const StatCard = ({ label, value, color, icon: Icon }) => (
  <div style={{
    background: '#fff', borderRadius: 16, border: `1.5px solid ${tk.border}`,
    padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16,
    boxShadow: '0 2px 12px rgba(23,22,20,.05)',
  }}>
    <div style={{
      width: 46, height: 46, borderRadius: 13, flexShrink: 0,
      background: `${color}15`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon style={{ width: 22, height: 22, color }} />
    </div>
    <div>
      <div style={{ fontSize: 24, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", lineHeight: 1 }}>{value ?? '—'}</div>
      <div style={{ fontSize: 12, color: tk.textMut, marginTop: 3 }}>{label}</div>
    </div>
  </div>
);

/* ── Pagination ── */
const Pagination = ({ pagination, onPage }) => {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages } = pagination;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 20 }}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onPage(p)} style={{
          width: 34, height: 34, borderRadius: 8, border: `1.5px solid ${p === page ? tk.accent : tk.border}`,
          background: p === page ? tk.accent : '#fff', color: p === page ? '#fff' : tk.textSec,
          fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .15s',
        }}>{p}</button>
      ))}
    </div>
  );
};

/* ══════════════════════════════
   ONGLET CLIENTS
══════════════════════════════ */
const ClientsTab = () => {
  const navigate = useNavigate();
  const [clients, setClients]       = useState([]);
  const [stats, setStats]           = useState({});
  const [loading, setLoading]       = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage]             = useState(1);
  const [filters, setFilters] = useState({ search: '', country: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filters.search)  params.append('search',  filters.search);
      if (filters.country) params.append('country', filters.country);

      const [cRes, sRes] = await Promise.all([
        axios.get(`/clients?${params}`),
        axios.get('/clients/stats'),
      ]);
      setClients(cRes.data?.data || cRes.data || []);
      setPagination(cRes.data?.pagination || null);
      setStats(sRes.data?.data || sRes.data || {});
    } catch {
      toast.error('Erreur lors du chargement des clients');
    } finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce client ?')) return;
    try {
      await axios.delete(`/clients/${id}`);
      toast.success('Client supprimé');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur suppression');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Stats */}
      <div className="grid-kpi-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        <StatCard label="Total clients"       value={stats.total}        color={tk.accent}  icon={UsersIcon} />
        <StatCard label="Nouveaux ce mois"    value={stats.newThisMonth} color={tk.emerald} icon={PlusIcon} />
        <StatCard label="Pays représentés"    value={stats.byCountry?.length} color={tk.violet} icon={SparklesIcon} />
      </div>

      {/* Filtres */}
      <div style={{
        background: '#fff', borderRadius: 16, border: `1.5px solid ${tk.border}`,
        padding: '14px 18px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <MagnifyingGlassIcon style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
          <input
            placeholder="Rechercher nom, email, téléphone…"
            value={filters.search}
            onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1); }}
            style={{ ...inputStyle, paddingLeft: 34, width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <input
          placeholder="Filtrer par pays"
          value={filters.country}
          onChange={e => { setFilters(f => ({ ...f, country: e.target.value })); setPage(1); }}
          style={{ ...inputStyle, width: 160 }}
        />
        {(filters.search || filters.country) && (
          <button onClick={() => { setFilters({ search: '', country: '' }); setPage(1); }} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 9,
            background: tk.surf2, border: 'none', color: tk.textSec, fontSize: 12, cursor: 'pointer',
          }}>
            <XMarkIcon style={{ width: 13, height: 13 }} /> Effacer
          </button>
        )}
        <button onClick={() => navigate('/app/clients')} style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6,
          padding: '9px 18px', borderRadius: 10, background: tk.accent, color: '#fff',
          border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 3px 10px rgba(167,123,40,.25)',
        }}>
          <PlusIcon style={{ width: 15, height: 15 }} /> Nouveau client
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, border: `1.5px solid ${tk.border}`, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${tk.surf2}`, borderTop: `3px solid ${tk.accent}`, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
          </div>
        ) : clients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 24px', color: tk.textMut }}>
            <UsersIcon style={{ width: 48, height: 48, margin: '0 auto 12px', opacity: .3 }} />
            <p style={{ fontSize: 15, fontWeight: 600 }}>Aucun client trouvé</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
                {['Client', 'Contact', 'Pays', 'Agence', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((c, i) => (
                <tr key={c._id} style={{ borderBottom: `1px solid ${tk.border}`, background: i % 2 === 0 ? '#fff' : tk.surface }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${tk.accent}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: tk.accent, flexShrink: 0 }}>
                        {c.firstName?.[0]}{c.lastName?.[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: tk.ink }}>{c.firstName} {c.lastName}</div>
                        <div style={{ fontSize: 11, color: tk.textMut }}>{c.email || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: tk.textSec }}>{c.phone || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: tk.textSec }}>{c.country || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: tk.textMut }}>{c.agency?.name || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: tk.textMut }}>{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <ActionBtn icon={EyeIcon}    color={tk.accent} title="Voir"       onClick={() => navigate(`/app/clients/${c._id}`)} />
                      <ActionBtn icon={TrashIcon}  color={tk.rose}   title="Supprimer"  onClick={() => handleDelete(c._id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Pagination pagination={pagination} onPage={setPage} />
    </div>
  );
};

/* ══════════════════════════════
   ONGLET UTILISATEURS
══════════════════════════════ */
const UsersTab = () => {
  const [users, setUsers]           = useState([]);
  const [stats, setStats]           = useState({});
  const [loading, setLoading]       = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage]             = useState(1);
  const [filters, setFilters] = useState({ search: '', role: '', isActive: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (filters.search)   params.append('search',   filters.search);
      if (filters.role)     params.append('role',     filters.role);
      if (filters.isActive) params.append('isActive', filters.isActive);

      const [uRes, sRes] = await Promise.all([
        axios.get(`/users?${params}`),
        axios.get('/users/stats'),
      ]);
      setUsers(uRes.data?.data || []);
      setPagination(uRes.data?.pagination || null);
      setStats(sRes.data?.data || {});
    } catch {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally { setLoading(false); }
  }, [page, filters]);

  useEffect(() => { load(); }, [load]);

  const handleToggle = async (user) => {
    try {
      await axios.put(`/users/${user._id}`, { isActive: !user.isActive });
      toast.success(`Compte ${!user.isActive ? 'activé' : 'désactivé'}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await axios.delete(`/users/${id}`);
      toast.success('Utilisateur supprimé');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur suppression');
    }
  };

  const ROLES = ['superadmin', 'admin', 'manager', 'agent', 'driver', 'client'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Stats */}
      <div className="grid-kpi-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        <StatCard label="Total utilisateurs" value={stats.total}    color={tk.violet}  icon={UsersIcon} />
        <StatCard label="Comptes actifs"      value={stats.active}   color={tk.emerald} icon={CheckCircleIcon} />
        <StatCard label="Comptes inactifs"    value={stats.inactive} color={tk.rose}    icon={XCircleIcon} />
      </div>

      {/* Filtres */}
      <div style={{
        background: '#fff', borderRadius: 16, border: `1.5px solid ${tk.border}`,
        padding: '14px 18px', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <MagnifyingGlassIcon style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
          <input
            placeholder="Rechercher nom, email…"
            value={filters.search}
            onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1); }}
            style={{ ...inputStyle, paddingLeft: 34, width: '100%', boxSizing: 'border-box' }}
          />
        </div>
        <select
          value={filters.role}
          onChange={e => { setFilters(f => ({ ...f, role: e.target.value })); setPage(1); }}
          style={{ ...inputStyle, width: 150 }}
        >
          <option value="">Tous les rôles</option>
          {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
        </select>
        <select
          value={filters.isActive}
          onChange={e => { setFilters(f => ({ ...f, isActive: e.target.value })); setPage(1); }}
          style={{ ...inputStyle, width: 140 }}
        >
          <option value="">Tous statuts</option>
          <option value="true">Actifs</option>
          <option value="false">Inactifs</option>
        </select>
        {(filters.search || filters.role || filters.isActive) && (
          <button onClick={() => { setFilters({ search: '', role: '', isActive: '' }); setPage(1); }} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 9,
            background: tk.surf2, border: 'none', color: tk.textSec, fontSize: 12, cursor: 'pointer',
          }}>
            <XMarkIcon style={{ width: 13, height: 13 }} /> Effacer
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, border: `1.5px solid ${tk.border}`, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <div style={{ width: 36, height: 36, border: `3px solid ${tk.surf2}`, borderTop: `3px solid ${tk.violet}`, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '56px 24px', color: tk.textMut }}>
            <UserCircleIcon style={{ width: 48, height: 48, margin: '0 auto 12px', opacity: .3 }} />
            <p style={{ fontSize: 15, fontWeight: 600 }}>Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
                {['Utilisateur', 'Email', 'Rôle', 'Agence', 'Statut', 'Inscription', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id} style={{ borderBottom: `1px solid ${tk.border}`, background: i % 2 === 0 ? '#fff' : tk.surface }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${tk.violet}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: tk.violet, flexShrink: 0 }}>
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: tk.ink }}>{u.firstName} {u.lastName}</div>
                        <div style={{ fontSize: 11, color: tk.textMut }}>{u.phone || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: tk.textSec }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}><RoleBadge role={u.role} /></td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: tk.textMut }}>{u.agency?.name || '—'}</td>
                  <td style={{ padding: '12px 16px' }}><ActiveBadge active={u.isActive} /></td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: tk.textMut }}>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <ActionBtn
                        icon={u.isActive ? XCircleIcon : CheckCircleIcon}
                        color={u.isActive ? tk.amber : tk.emerald}
                        title={u.isActive ? 'Désactiver' : 'Activer'}
                        onClick={() => handleToggle(u)}
                      />
                      <ActionBtn icon={TrashIcon} color={tk.rose} title="Supprimer" onClick={() => handleDelete(u._id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Pagination pagination={pagination} onPage={setPage} />
    </div>
  );
};

/* ── Bouton action icône ── */
const ActionBtn = ({ icon: Icon, color, title, onClick }) => (
  <button onClick={onClick} title={title} style={{
    width: 30, height: 30, borderRadius: 8, border: `1px solid ${color}22`,
    background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all .15s',
  }}
    onMouseEnter={e => { e.currentTarget.style.background = `${color}22`; }}
    onMouseLeave={e => { e.currentTarget.style.background = `${color}10`; }}
  >
    <Icon style={{ width: 14, height: 14, color }} />
  </button>
);

/* ══════════════════════════════
   PAGE PRINCIPALE
══════════════════════════════ */
const TABS = [
  { id: 'clients',      label: 'Clients',       icon: UsersIcon,       color: tk.accent },
  { id: 'utilisateurs', label: 'Utilisateurs',  icon: ShieldCheckIcon, color: tk.violet },
];

const UsersClients = () => {
  const [activeTab, setActiveTab] = useState('clients');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── HERO ── */}
      <section className="easy-internal-header" style={{
        position: 'relative', height: 220,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', marginBottom: 28, borderRadius: 24,
      }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#37312a', padding: '0 24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.10)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,.18)', borderRadius: 99,
            padding: '6px 18px', marginBottom: 18,
          }}>
            <ShieldCheckIcon style={{ width: 13, height: 13, color: '#c4b5fd' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
              ADMINISTRATION
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 800, lineHeight: 1.2, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Clients &{' '}
            <span style={{ background: 'linear-gradient(90deg,#c4b5fd,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Utilisateurs
            </span>
          </h1>
          <p style={{ color: '#37312a', fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>
            Gérez l'ensemble des comptes clients et utilisateurs du système.
          </p>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ── TABS ── */}
      <div style={{
        background: '#fff', borderRadius: 16, border: `1.5px solid ${tk.border}`,
        padding: '6px 8px', display: 'inline-flex', gap: 4, marginBottom: 24,
        alignSelf: 'flex-start', boxShadow: '0 2px 8px rgba(23,22,20,.06)',
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 22px', borderRadius: 11, border: 'none',
                background: active ? tab.color : 'transparent',
                color: active ? '#fff' : tk.textSec,
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all .2s',
                boxShadow: active ? `0 3px 12px ${tab.color}40` : 'none',
              }}
            >
              <tab.icon style={{ width: 16, height: 16 }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── CONTENU ── */}
      {activeTab === 'clients'      && <ClientsTab />}
      {activeTab === 'utilisateurs' && <UsersTab />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default UsersClients;
