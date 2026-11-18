import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon, PencilIcon, TrashIcon, SparklesIcon,
  UserIcon, MagnifyingGlassIcon, FunnelIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import DataTable from '../../components/Common/DataTable';
import Modal from '../../components/Common/Modal';
import ClientForm from '../../components/Forms/ClientForm';

/* ─────────────────────────────────────────────
   DESIGN TOKENS — identiques à AddPackage
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
const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [filters, setFilters] = useState({ search: '', country: '' });
  const navigate = useNavigate();

  const debounceRef = useRef(null);
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { fetchClients(); }, 400);
    return () => clearTimeout(debounceRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search)  params.append('search',  filters.search);
      if (filters.country) params.append('country', filters.country);
      const res = await axios.get(`/clients?${params}`);
      setClients(res.data?.data || res.data?.data?.data || []);
    } catch {
      toast.error('Erreur lors du chargement des clients');
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      try {
        await axios.delete(`/clients/${id}`);
        toast.success('Client supprimé avec succès');
        fetchClients();
      } catch (err) {
        // 409 : fiche liée à des colis/factures (historique protégé) — message du serveur.
        toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedClient) {
        await axios.put(`/clients/${selectedClient._id}`, data);
        toast.success('Client mis à jour avec succès');
      } else {
        await axios.post('/clients', data);
        toast.success('Client créé avec succès');
      }
      setShowModal(false);
      setSelectedClient(null);
      fetchClients();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'enregistrement");
    }
  };

  const columns = [
    { key: 'firstName', label: 'Prénom', sortable: true },
    { key: 'lastName',  label: 'Nom',    sortable: true },
    { key: 'email',     label: 'Email',  sortable: true },
    { key: 'phone',     label: 'Téléphone' },
    { key: 'company',   label: 'Entreprise' },
    { key: 'country',   label: 'Pays', sortable: true },
    { key: 'totalPackages', label: 'Colis', render: (val) => (
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: 24, height: 24, borderRadius: 99,
        background: 'rgba(167,123,40,.08)', color: tk.accent,
        fontSize: 12, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif",
        padding: '0 8px',
      }}>{val || 0}</span>
    )},
    { key: 'createdAt', label: 'Inscrit le', sortable: true,
      render: (val) => new Date(val).toLocaleDateString('fr-FR'),
    },
    {
      key: 'actions', label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={(e) => { e.stopPropagation(); setSelectedClient(row); setShowModal(true); }}
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
  

      {/* ─────────────── HERO — identique à AddPackage ─────────────── */}
      <section className="easy-internal-header" style={{
        position: 'relative', height: 280,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#37312a', padding: '0 24px', maxWidth: 640 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
            padding: '6px 16px', marginBottom: 18,
          }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#ecd5a3' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
              Gestion des clients
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Gérez vos{' '}
            <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              clients
            </span>{' '}facilement
          </h1>
          <p style={{ color: '#37312a', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Consultez, ajoutez, modifiez ou supprimez vos clients en quelques clics.
          </p>

          {/* CTA bouton dans le hero */}
          <button
            onClick={() => { setSelectedClient(null); setShowModal(true); }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 24px', borderRadius: 12,
              background: tk.accent, color: '#fff', border: 'none',
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
              fontFamily: "'Open Sans',Arial,sans-serif",
              boxShadow: '0 4px 20px rgba(167,123,40,.4)',
            }}
          >
            <PlusIcon style={{ width: 16, height: 16 }} /> Nouveau client
          </button>
        </div>

        {/* Wave bottom */}
        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─────────────── CONTENU ─────────────── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 48px' }}>

        {/* ── Filtres — même card que les autres pages ── */}
        <div style={{
          background: '#fff', borderRadius: 20,
          border: `1.5px solid ${tk.border}`,
          boxShadow: '0 2px 8px rgba(23,22,20,.05)',
          overflow: 'hidden', marginBottom: 24,
        }}>
          {/* Header filtres */}
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
            {(filters.search || filters.country) && (
              <button onClick={() => setFilters({ search: '', country: '' })} style={{
                marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 8,
                background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.15)',
                color: tk.rose, cursor: 'pointer', fontSize: 12, fontWeight: 500,
              }}>
                <XMarkIcon style={{ width: 12, height: 12 }} /> Réinitialiser
              </button>
            )}
          </div>

          {/* Corps filtres */}
          <div style={{ padding: '16px 20px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <MagnifyingGlassIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
              <input
                type="text"
                placeholder="Rechercher par nom, email..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                style={{ ...inputStyle, paddingLeft: 38 }}
              />
            </div>
            <input
              type="text"
              placeholder="Filtrer par pays (ex: TN, CA, FR…)"
              value={filters.country}
              onChange={e => setFilters({ ...filters, country: e.target.value })}
              style={inputStyle}
            />
          </div>
        </div>

        {/* ── Tableau — dans une card ── */}
        <div style={{
          background: '#fff', borderRadius: 20,
          border: `1.5px solid ${tk.border}`,
          boxShadow: '0 2px 8px rgba(23,22,20,.05)',
          overflow: 'hidden',
        }}>
          {/* Header tableau */}
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
                <UserIcon style={{ width: 14, height: 14, color: tk.accent }} />
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                Liste des clients
              </span>
              <span style={{
                padding: '3px 10px', borderRadius: 99,
                background: 'rgba(167,123,40,.08)', color: tk.accent,
                fontSize: 11, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif",
              }}>
                {clients.length} client{clients.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={() => { setSelectedClient(null); setShowModal(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px',
                borderRadius: 10, background: tk.accent, color: '#fff', border: 'none',
                cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
                boxShadow: '0 3px 14px rgba(167,123,40,.25)',
              }}
            >
              <PlusIcon style={{ width: 14, height: 14 }} /> Nouveau
            </button>
          </div>

          <div style={{ padding: '0' }}>
            <DataTable
              columns={columns}
              data={clients}
              onRowClick={row => navigate(`/app/clients/${row._id}`)}
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedClient(null); }}
        title={selectedClient ? 'Modifier le client' : 'Nouveau client'}
        size="lg"
      >
        <ClientForm
          initialData={selectedClient}
          onSubmit={handleSubmit}
          onCancel={() => { setShowModal(false); setSelectedClient(null); }}
        />
      </Modal>


      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
      `}</style>
    </div>
  );
};

export default ClientsList;