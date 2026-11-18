import React, { useState, useEffect } from 'react';
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  CubeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { buildReportCsv } from '../../utils/reportCsv';
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

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [reportType, setReportType] = useState('financial');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = () => {
    // Les rapports sont générés à la demande — pas de liste persistante
    setReports([]);
    setLoading(false);
  };

  const generateReport = async () => {
    setGenerating(true);
    try {
      // Mapping des types frontend → backend
      const typeMap = { financial: 'revenue', packages: 'packages', clients: 'clients', activity: undefined };
      const backendType = typeMap[reportType];
      const params = { startDate: dateRange.startDate, endDate: dateRange.endDate };
      if (backendType) params.type = backendType;

      const response = await axios.get('/analytics/reports', { params });
      const data = response.data?.data || response.data;

      // Créer un enregistrement local pour l'affichage
      const record = {
        _id:         Date.now().toString(),
        name:        `Rapport ${reportType} — ${new Date(dateRange.startDate).toLocaleDateString('fr-FR')} au ${new Date(dateRange.endDate).toLocaleDateString('fr-FR')}`,
        type:        reportType,
        startDate:   dateRange.startDate,
        endDate:     dateRange.endDate,
        generatedAt: new Date().toISOString(),
        size:        'Prêt',
        _rawData:    data,
      };
      setReports((prev) => [record, ...prev]);
      toast.success('Rapport généré avec succès');
    } catch (error) {
      toast.error('Erreur lors de la génération du rapport');
    } finally {
      setGenerating(false);
    }
  };

  const downloadReport = (reportId) => {
    const report = reports.find(r => r._id === reportId);
    if (!report?._rawData) { toast.error('Données du rapport introuvables'); return; }

    // Générer un CSV client-side depuis les données agrégées
    // Construction testée dans utils/reportCsv (colonne Devise, précision ISO, anti-injection).
    const csv = buildReportCsv(report._rawData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rapport-${report.type}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success('CSV téléchargé');
  };

  const reportTypes = [
    { id: 'financial', name: 'Rapport financier', icon: CurrencyDollarIcon, color: tk.accent },
    { id: 'packages', name: 'Rapport colis', icon: CubeIcon, color: tk.emerald },
    { id: 'clients', name: 'Rapport clients', icon: UserGroupIcon, color: tk.accent },
    { id: 'activity', name: "Rapport d'activité", icon: DocumentTextIcon, color: tk.amber },
  ];

  const columns = [
    {
      key: 'name',
      label: 'Nom du rapport',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: tk.ink }}>{val}</div>
          <div style={{ fontSize: 12, color: tk.textMut, textTransform: 'capitalize' }}>{row.type}</div>
        </div>
      ),
    },
    {
      key: 'period',
      label: 'Période',
      render: (_, row) => (
        <div>
          <div style={{ fontSize: 13, color: tk.ink }}>{new Date(row.startDate).toLocaleDateString('fr-FR')}</div>
          <div style={{ fontSize: 11, color: tk.textMut }}>au {new Date(row.endDate).toLocaleDateString('fr-FR')}</div>
        </div>
      ),
    },
    {
      key: 'generatedAt',
      label: 'Généré le',
      render: (val) => new Date(val).toLocaleString('fr-FR'),
    },
    {
      key: 'size',
      label: 'Taille',
      render: (val) => val || '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => downloadReport(row._id)}
          style={{
            width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${tk.border}`,
            background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: tk.accent, transition: 'all .15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,123,40,.06)'; e.currentTarget.style.borderColor = tk.accent; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
          title="Télécharger"
        >
          <ArrowDownTrayIcon style={{ width: 14, height: 14 }} />
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: tk.surface }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: '100vh',
        }}>
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
              RAPPORTS
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Analysez vos données{' '}
            <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              grâce à des rapports détaillés
            </span>
          </h1>
          <p style={{ color: '#37312a', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Générez et téléchargez des rapports financiers, colis, clients ou d'activité.
          </p>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─────────────── CONTENU ─────────────── */}
      <div className="page-content" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 48px' }}>

        {/* ── Carte de génération de rapport ── */}
        <div style={{
          background: '#fff', borderRadius: 20,
          border: `1.5px solid ${tk.border}`,
          boxShadow: '0 2px 8px rgba(23,22,20,.05)',
          overflow: 'hidden', marginBottom: 24,
        }}>
          <div style={{
            padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 30, height: 30, borderRadius: 8, background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,.08)',
              }}>
                <DocumentTextIcon style={{ width: 14, height: 14, color: tk.accent }} />
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                Générer un rapport
              </span>
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            <div className="reports-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Types de rapport */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: tk.textSec, marginBottom: 8, display: 'block' }}>
                  Type de rapport
                </label>
                <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {reportTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setReportType(type.id)}
                      style={{
                        padding: '16px', borderRadius: 12,
                        border: `1.5px solid ${reportType === type.id ? tk.accent : tk.border}`,
                        background: reportType === type.id ? `${type.color}08` : '#fff',
                        textAlign: 'left', cursor: 'pointer', transition: 'all .15s',
                      }}
                    >
                      <type.icon
                        style={{
                          width: 24, height: 24, marginBottom: 12,
                          color: reportType === type.id ? type.color : tk.textMut,
                        }}
                      />
                      <p style={{
                        fontSize: 13, fontWeight: 600,
                        color: reportType === type.id ? type.color : tk.ink,
                      }}>
                        {type.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Période */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: tk.textSec, marginBottom: 8, display: 'block' }}>
                  Période
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 11, color: tk.textMut, marginBottom: 4, display: 'block' }}>
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: tk.textMut, marginBottom: 4, display: 'block' }}>
                      Date de fin
                    </label>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={generateReport}
                    disabled={generating}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '10px 24px', borderRadius: 10,
                      background: tk.accent, color: '#fff', border: 'none',
                      cursor: generating ? 'not-allowed' : 'pointer',
                      fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
                      opacity: generating ? 0.6 : 1,
                    }}
                  >
                    {generating ? (
                      <>
                        <div style={{
                          width: 16, height: 16, border: '2px solid #fff',
                          borderTopColor: 'transparent', borderRadius: '50%',
                          animation: 'spin 0.6s linear infinite',
                        }} />
                        Génération...
                      </>
                    ) : (
                      <>Générer le rapport</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Liste des rapports ── */}
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
                <DocumentTextIcon style={{ width: 14, height: 14, color: tk.accent }} />
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                Rapports générés
              </span>
              <span style={{
                padding: '3px 10px', borderRadius: 99,
                background: 'rgba(167,123,40,.08)', color: tk.accent,
                fontSize: 11, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif",
              }}>
                {reports.length} rapport{reports.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div style={{ padding: '0' }}>
            {!loading && reports.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '48px 24px',
              }}>
                <DocumentTextIcon style={{
                  width: 48, height: 48, color: tk.textMut, margin: '0 auto 16px',
                }} />
                <h3 style={{ fontSize: 16, fontWeight: 600, color: tk.ink, marginBottom: 8 }}>
                  Aucun rapport généré
                </h3>
                <p style={{ fontSize: 13, color: tk.textMut }}>
                  Générez votre premier rapport en utilisant le formulaire ci-dessus.
                </p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={reports}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>

     

      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Reports;