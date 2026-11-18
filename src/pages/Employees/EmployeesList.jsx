import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon, PencilIcon, TrashIcon, SparklesIcon,
  UserGroupIcon, MagnifyingGlassIcon, FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import DataTable from '../../components/Common/DataTable';

/* ─────────────────────────────────────────────
   DESIGN TOKENS — identiques à ClientsList
───────────────────────────────────────────── */
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
  textSec: '#4b5a6e',
  textMut: '#8494a9',
};

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  background: '#fff', color: tk.ink, fontSize: 14,
  border: `1.5px solid ${tk.border}`, outline: 'none',
  fontFamily: "'DM Sans', sans-serif", transition: 'border .18s',
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', department: '', status: '', agency: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
    fetchStats();
  }, [filters]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([, v]) => v))
      ).toString();
      const res = await axios.get(`/employees${params ? `?${params}` : ''}`);
      setEmployees(res.data?.data || []);
    } catch {
      toast.error('Erreur lors du chargement des employés');
    } finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/employees/stats');
      setStats(res.data?.data || res.data || {});
    } catch {
      console.error('Error fetching stats');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer cet employé ? Son compte de connexion sera désactivé (réactivable par un administrateur).')) {
      try {
        const res = await axios.delete(`/employees/${id}`);
        toast.success(res.data?.message || 'Employé supprimé avec succès');
        fetchEmployees();
        fetchStats();
      } catch (err) { toast.error(err.response?.data?.message || 'Erreur lors de la suppression'); }
    }
  };

  const getRoleBadgeStyle = (role) => {
    const roles = {
      admin: { bg: 'rgba(167,123,40,.1)', color: tk.accent },
      manager: { bg: 'rgba(217,119,6,.1)', color: tk.amber },
      agent: { bg: 'rgba(5,150,105,.1)', color: tk.emerald },
      driver: { bg: 'rgba(167,123,40,.1)', color: tk.accent },
    };
    return roles[role] || { bg: 'rgba(100,116,139,.1)', color: tk.textSec };
  };

  const columns = [
    {
      key: 'name', label: 'Employé', sortable: true,
      render: (_, row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 99,
            background: `linear-gradient(135deg, ${tk.accent}20, ${tk.accent}08)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `1.5px solid ${tk.border}`,
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: tk.accent }}>
              {row.firstName?.[0]}{row.lastName?.[0]}
            </span>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: tk.ink }}>
              {row.firstName} {row.lastName}
            </div>
            <div style={{ fontSize: 12, color: tk.textMut }}>{row.email}</div>
          </div>
        </div>
      ),
    },
    { key: 'position', label: 'Poste', render: (val) => val || '-' },
    { key: 'department', label: 'Département', render: (val) => val || '-' },
    { key: 'agency', label: 'Agence', render: (val) => val?.name || '-' },
    {
      key: 'role', label: 'Rôle',
      render: (val) => {
        const style = getRoleBadgeStyle(val);
        return (
          <span style={{
            display: 'inline-flex', padding: '4px 12px', borderRadius: 99,
            background: style.bg, color: style.color,
            fontSize: 12, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
          }}>{val}</span>
        );
      }
    },
    {
      key: 'status', label: 'Statut',
      render: (val) => {
        const statusStyles = {
          actif: { bg: 'rgba(5,150,105,.1)', color: tk.emerald, label: 'Actif' },
          congé: { bg: 'rgba(217,119,6,.1)', color: tk.amber, label: 'En congé' },
          inactif: { bg: 'rgba(220,38,38,.1)', color: tk.rose, label: 'Inactif' },
        };
        const s = statusStyles[val] || statusStyles.inactif;
        return (
          <span style={{
            display: 'inline-flex', padding: '4px 12px', borderRadius: 99,
            background: s.bg, color: s.color,
            fontSize: 12, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
          }}>{s.label}</span>
        );
      }
    },
    {
      key: 'hireDate', label: "Date d'embauche", sortable: true,
      render: (val) => val ? new Date(val).toLocaleDateString('fr-FR') : '-',
    },
    {
      key: 'actions', label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={(e) => { e.stopPropagation(); navigate(`/employees/edit/${row._id}`); }}
            style={{
              width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${tk.border}`,
              background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: tk.accent, transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,123,40,.06)'; e.currentTarget.style.borderColor = tk.accent; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
          >
            <PencilIcon style={{ width: 14, height: 14 }} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); handleDelete(row._id); }}
            style={{
              width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${tk.border}`,
              background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: tk.rose, transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,.06)'; e.currentTarget.style.borderColor = tk.rose; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
          >
            <TrashIcon style={{ width: 14, height: 14 }} />
          </button>
        </div>
      ),
    },
  ];

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
              Gestion des employés
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Gérez vos{' '}
            <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              employés
            </span>{' '}facilement
          </h1>
          <p style={{ color: '#37312a', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Consultez, ajoutez, modifiez ou supprimez les membres de votre équipe.
          </p>

          <button
            onClick={() => navigate('/app/employees/add')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 24px', borderRadius: 12,
              background: tk.accent, color: '#fff', border: 'none',
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
              fontFamily: "'Open Sans',Arial,sans-serif",
              boxShadow: '0 4px 20px rgba(167,123,40,.4)',
            }}
          >
            <PlusIcon style={{ width: 16, height: 16 }} /> Nouvel employé
          </button>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─────────────── CONTENU ─────────────── */}
      <div className="page-content" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 48px' }}>

        {/* ── Cartes statistiques ── */}
        <div className="grid-kpi-4" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16, marginBottom: 24,
        }}>
          {[
            { label: 'Total employés', value: stats.total || 0, icon: UserGroupIcon },
            { label: 'Actifs', value: stats.active || 0, icon: UserGroupIcon, color: tk.emerald },
            { label: 'En congé', value: stats.onLeave || 0, icon: UserGroupIcon, color: tk.amber },
            { label: 'Départements', value: stats.departments || 0, icon: UserGroupIcon, color: tk.accent },
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: '#fff', borderRadius: 16, padding: '16px 20px',
              border: `1.5px solid ${tk.border}`, boxShadow: '0 2px 8px rgba(23,22,20,.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{
                  width: 36, height: 36, borderRadius: 12,
                  background: stat.color ? `${stat.color}10` : `${tk.accent}10`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <stat.icon style={{ width: 18, height: 18, color: stat.color || tk.accent }} />
                </span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, fontWeight: 500, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '.03em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Filtres ── */}
        <div style={{
          background: '#fff', borderRadius: 20,
          border: `1.5px solid ${tk.border}`,
          boxShadow: '0 2px 8px rgba(23,22,20,.05)',
          overflow: 'hidden', marginBottom: 24,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
          }}>
            <span style={{
              width: 30, height: 30, borderRadius: 8, background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,.08)',
            }}>
              <FunnelIcon style={{ width: 14, height: 14, color: tk.accent }} />
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
              Filtres
            </span>
            {(filters.search || filters.department || filters.status || filters.agency) && (
              <button onClick={() => setFilters({ search: '', department: '', status: '', agency: '' })} style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 8,
                background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.15)',
                color: tk.rose, cursor: 'pointer', fontSize: 12, fontWeight: 500,
              }}>
                <XMarkIcon style={{ width: 12, height: 12 }} /> Réinitialiser
              </button>
            )}
          </div>

          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <MagnifyingGlassIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
              <input
                type="text"
                placeholder="Rechercher (nom, email...)"
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                style={{ ...inputStyle, paddingLeft: 38 }}
              />
            </div>
            <select
              value={filters.department}
              onChange={e => setFilters({ ...filters, department: e.target.value })}
              style={inputStyle}
            >
              <option value="">Tous départements</option>
              <option value="logistique">Logistique</option>
              <option value="administration">Administration</option>
              <option value="commercial">Commercial</option>
              <option value="livraison">Livraison</option>
            </select>
            <select
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
              style={inputStyle}
            >
              <option value="">Tous statuts</option>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="congé">En congé</option>
            </select>
            <select
              value={filters.agency}
              onChange={e => setFilters({ ...filters, agency: e.target.value })}
              style={inputStyle}
            >
              <option value="">Toutes agences</option>
            </select>
          </div>
        </div>

        {/* ── Tableau ── */}
        <div style={{
          background: '#fff', borderRadius: 20,
          border: `1.5px solid ${tk.border}`,
          boxShadow: '0 2px 8px rgba(23,22,20,.05)',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 30, height: 30, borderRadius: 8, background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,.08)',
              }}>
                <UserGroupIcon style={{ width: 14, height: 14, color: tk.accent }} />
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                Liste des employés
              </span>
              <span style={{
                padding: '3px 10px', borderRadius: 99,
                background: 'rgba(167,123,40,.08)', color: tk.accent,
                fontSize: 11, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif",
              }}>
                {employees.length} employé{employees.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={() => navigate('/employees/add')}
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
                borderRadius: 10, background: tk.accent, color: '#fff', border: 'none',
                cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
                boxShadow: '0 3px 14px rgba(167,123,40,.25)',
              }}
            >
              <PlusIcon style={{ width: 14, height: 14 }} /> Nouvel employé
            </button>
          </div>

          <div style={{ padding: '0' }}>
            <DataTable
              columns={columns}
              data={employees}
              onRowClick={row => navigate(`/employees/${row._id}`)}
              loading={loading}
            />
          </div>
        </div>
      </div>


      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
      `}</style>
    </div>
  );
};

export default EmployeesList;