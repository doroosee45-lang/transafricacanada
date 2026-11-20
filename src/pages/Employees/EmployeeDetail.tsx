import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon, EnvelopeIcon, PhoneIcon, CalendarIcon,
  BuildingOfficeIcon, IdentificationIcon, PencilIcon, SparklesIcon,
  UserIcon, BriefcaseIcon, DocumentTextIcon, MapPinIcon,
  ShieldExclamationIcon, CurrencyEuroIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { formatMoney } from '../../config/currencies';
import Navbar from '../../components/Layout/Navbar';
import type { Employee } from '../../types/models';
import type { IconComponent } from '../../types/ui';

interface SectionBlockProps { icon: IconComponent; iconColor?: string; title: React.ReactNode; children: React.ReactNode }
interface InfoRowProps { icon: IconComponent; label?: string; value?: React.ReactNode; href?: string }
interface StatMiniProps { icon: IconComponent; label: string; value: React.ReactNode; color?: string }

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const tk = {
  ink:     '#172F50',
  ink80:   '#172F50',
  surface: '#F7FAFE',
  surf2:   '#EDF5FC',
  border:  '#DCE9F5',
  accent:  '#4D91D9',
  emerald: '#059669',
  rose:    '#dc2626',
  amber:   '#d97706',
  textSec: '#52677D',
  textMut: '#8295A8',
};

const SectionBlock = ({ icon: Icon, iconColor = tk.accent, title, children }: SectionBlockProps) => (
  <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 16, overflow: 'hidden' }}>
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
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
        {title}
      </span>
    </div>
    <div style={{ padding: 20, background: '#fff' }}>
      {children}
    </div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value, href }: InfoRowProps) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: `1px solid ${tk.surface}` }}>
    <div style={{ width: 32, height: 32, borderRadius: 8, background: tk.surf2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon style={{ width: 15, height: 15, color: tk.accent }} />
    </div>
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.textMut, marginBottom: 2, fontFamily: "'Open Sans',Arial,sans-serif" }}>{label}</p>
      {href
        ? <a href={href} style={{ fontSize: 14, color: tk.accent, fontWeight: 500, textDecoration: 'none' }}>{value || 'Non renseigné'}</a>
        : <p style={{ fontSize: 14, color: tk.ink, fontWeight: 500, margin: 0 }}>{value || 'Non renseigné'}</p>
      }
    </div>
  </div>
);

const StatMini = ({ icon: Icon, label, value, color = tk.accent }: StatMiniProps) => (
  <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 14, padding: '16px 18px', background: '#fff', display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: tk.surf2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon style={{ width: 20, height: 20, color }} />
    </div>
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.textMut, margin: 0, fontFamily: "'Open Sans',Arial,sans-serif" }}>{label}</p>
      <p style={{ fontSize: 15, fontWeight: 700, color: tk.ink, margin: 0 }}>{value || 'Non défini'}</p>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { fetchEmployeeData(); }, [id]);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get(`/employees/${id}`);
      setEmployee(response.data);
    } catch {
      toast.error('Erreur lors du chargement des données');
      navigate('/employees');
    } finally { setLoading(false); }
  };

  const getRoleStyle = (role?: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      admin:   { bg: '#fee2e2', color: '#991b1b' },
      manager: { bg: '#fef3c7', color: '#92400e' },
      agent:   { bg: '#EDF5FC', color: '#172F50' },
      driver:  { bg: '#d1fae5', color: '#065f46' },
    };
    return (role && map[role]) || { bg: tk.surf2, color: tk.textSec };
  };

  const getStatusStyle = (status?: string) => {
    if (status === 'actif')   return { bg: '#d1fae5', color: '#065f46', label: 'Actif'     };
    if (status === 'congé')   return { bg: '#fef3c7', color: '#92400e', label: 'En congé'  };
    return                           { bg: '#fee2e2', color: '#991b1b', label: 'Inactif'   };
  };

  if (loading) return (
    <>
      <Navbar />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
        <div style={{ width: 44, height: 44, border: `3px solid ${tk.surf2}`, borderTop: `3px solid ${tk.accent}`, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </>
  );

  if (!employee) return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p style={{ color: tk.rose, marginBottom: 16 }}>Employé introuvable</p>
        <button onClick={() => navigate('/employees')} style={{ padding: '10px 24px', background: '#347FC5', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>
          Retour à la liste
        </button>
      </div>
    </>
  );

  const roleStyle   = getRoleStyle(employee.role);
  const statusStyle = getStatusStyle(employee.status);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="easy-internal-header" style={{
        position: 'relative', height: 260,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', marginBottom: 28, borderRadius: 24,
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
              FICHE EMPLOYÉ
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 10, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            {employee.firstName} {employee.lastName}
          </h1>
          <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: 18, fontWeight: 600 }}>
            {employee.position}
          </span>
          <p style={{ color: '#172F50', fontSize: 14, lineHeight: 1.7, marginTop: 10 }}>
            {employee.email} • {employee.phone || 'Téléphone non renseigné'}
          </p>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 48px', width: '100%', boxSizing: 'border-box' }}>

        {/* Action bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <button onClick={() => navigate('/employees')} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px',
            borderRadius: 10, background: 'none', border: `1.5px solid ${tk.border}`,
            color: tk.textSec, cursor: 'pointer', fontSize: 13, fontWeight: 500,
          }}>
            <ArrowLeftIcon style={{ width: 15, height: 15 }} />
            Retour à la liste
          </button>
          <button onClick={() => navigate(`/employees/${id}/edit`)} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '11px 24px',
            borderRadius: 11, background: '#347FC5', color: '#fff', border: 'none',
            cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
            boxShadow: '0 4px 18px rgba(77,145,217,.3)',
          }}>
            <PencilIcon style={{ width: 15, height: 15 }} />
            Modifier
          </button>
        </div>

        {/* Stat mini cards */}
        <div className="grid-kpi-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          <StatMini icon={UserIcon}         label="Rôle"        value={employee.role}         color={tk.accent}   />
          <StatMini icon={BriefcaseIcon}    label="Département" value={employee.department}   color={tk.emerald}  />
          <StatMini icon={DocumentTextIcon} label="Contrat"     value={employee.contractType} color={tk.amber}    />
        </div>

        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>

          {/* Left column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Informations personnelles */}
            <SectionBlock icon={UserIcon} title="Informations personnelles">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                <div>
                  <InfoRow icon={EnvelopeIcon}        label="Email"              value={employee.email}       href={`mailto:${employee.email}`} />
                  <InfoRow icon={PhoneIcon}           label="Téléphone"          value={employee.phone}       href={`tel:${employee.phone}`} />
                  <InfoRow icon={CalendarIcon}        label="Date de naissance"  value={employee.birthDate ? new Date(employee.birthDate).toLocaleDateString() : null} />
                </div>
                <div>
                  <InfoRow icon={IdentificationIcon} label="N° Sécurité sociale" value={employee.ssn} />
                  <InfoRow icon={MapPinIcon}          label="Adresse"            value={[employee.address?.street, employee.address?.city, employee.address?.postalCode].filter(Boolean).join(', ') || null} />
                </div>
              </div>
            </SectionBlock>

            {/* Informations professionnelles */}
            <SectionBlock icon={BriefcaseIcon} iconColor={tk.emerald} title="Informations professionnelles">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                <div>
                  <InfoRow icon={BriefcaseIcon}      label="Département"      value={employee.department} />
                  <InfoRow icon={CalendarIcon}        label="Date d'embauche"  value={employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : null} />
                  <InfoRow icon={BuildingOfficeIcon}  label="Agence"           value={employee.agency?.name} />
                </div>
                <div>
                  <InfoRow icon={UserIcon}            label="Superviseur"      value={employee.supervisor ? `${employee.supervisor.firstName} ${employee.supervisor.lastName}` : 'Aucun'} />
                  <InfoRow icon={CurrencyEuroIcon}    label="Salaire annuel"   value={employee.salary ? formatMoney(employee.salary, employee.currency) : null} />
                  <InfoRow icon={DocumentTextIcon}    label="Type de contrat"  value={employee.contractType} />
                </div>
              </div>
            </SectionBlock>
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Statut & Rôle */}
            <SectionBlock icon={UserIcon} iconColor={tk.amber} title="Statut & Rôle">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <span style={{ padding: '6px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600, background: roleStyle.bg, color: roleStyle.color }}>
                  {employee.role}
                </span>
                <span style={{ padding: '6px 14px', borderRadius: 99, fontSize: 13, fontWeight: 600, background: statusStyle.bg, color: statusStyle.color }}>
                  {statusStyle.label}
                </span>
              </div>
            </SectionBlock>

            {/* Contact d'urgence */}
            {employee.emergencyContact?.name && (
              <SectionBlock icon={ShieldExclamationIcon} iconColor={tk.rose} title="Contact d'urgence">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <InfoRow icon={UserIcon}  label="Nom"          value={employee.emergencyContact.name} />
                  <InfoRow icon={UserIcon}  label="Lien"         value={employee.emergencyContact.relationship} />
                  <InfoRow icon={PhoneIcon} label="Téléphone"    value={employee.emergencyContact.phone} href={`tel:${employee.emergencyContact.phone}`} />
                </div>
              </SectionBlock>
            )}

            {/* Documents */}
            <SectionBlock icon={DocumentTextIcon} title="Documents">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['Contrat de travail', 'Fiche de paie (Dernière)', 'CV'].map(doc => (
                  <button key={doc} style={{
                    width: '100%', textAlign: 'left', padding: '10px 14px',
                    borderRadius: 10, background: tk.surface, border: `1px solid ${tk.border}`,
                    fontSize: 13, color: tk.ink, cursor: 'pointer', fontWeight: 500,
                    display: 'flex', alignItems: 'center', gap: 10, transition: 'background .15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = tk.surf2}
                    onMouseLeave={e => e.currentTarget.style.background = tk.surface}
                  >
                    <DocumentTextIcon style={{ width: 15, height: 15, color: tk.accent, flexShrink: 0 }} />
                    {doc}
                  </button>
                ))}
              </div>
            </SectionBlock>
          </div>
        </div>
      </div>


      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
      `}</style>
    </div>
  );
};

export default EmployeeDetail;