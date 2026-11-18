import {amountText} from '../../components/Finance/FinancialSummary';



// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   ArrowLeftIcon, PhoneIcon, EnvelopeIcon,
//   MapPinIcon, UserGroupIcon, CubeIcon, PencilIcon,
// } from '@heroicons/react/24/outline';
// import { toast } from 'react-toastify';
// import agencyService   from '../../services/Agencyservice';
// import employeeService from '../../services/Employeeservice';
// import packageService  from '../../services/Packageservice';
// import DataTable from '../../components/Common/DataTable';

// const AgencyDetail = () => {
//   const { id }     = useParams();
//   const navigate   = useNavigate();

//   const [agency,    setAgency]    = useState(null);
//   const [employees, setEmployees] = useState([]);
//   const [packages,  setPackages]  = useState([]);
//   const [loading,   setLoading]   = useState(true);
//   const [activeTab, setActiveTab] = useState('employees');

//   useEffect(() => {
//     fetchAll();
//   }, [id]);

//   const fetchAll = async () => {
//     setLoading(true);
//     try {
//       // On récupère l'agence (inclut ses stats dans res.data.data.stats)
//       const agencyRes = await agencyService.getById(id);
//       setAgency(agencyRes.data.data);

//       // Employés filtrés par agence
//       const empRes = await employeeService.getAll({ agencyId: id, limit: 100 });
//       setEmployees(empRes.data.data || []);

//       // Colis filtrés par agence
//       const pkgRes = await packageService.getAll({ agency: id, limit: 100 });
//       setPackages(pkgRes.data.data || []);

//     } catch (error) {
//       toast.error('Erreur lors du chargement des données');
//       navigate('/app/agencies');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Colonnes employés ──
//   const employeeColumns = [
//     {
//       key: 'user',
//       label: 'Nom',
//       render: (val) => val ? `${val.firstName} ${val.lastName}` : '—',
//     },
//     { key: 'position',   label: 'Poste' },
//     { key: 'department', label: 'Département' },
//     {
//       key: 'user',
//       label: 'Email',
//       render: (val) => <span className="text-sm text-slate-600">{val?.email || '—'}</span>,
//     },
//     {
//       key: 'status',
//       label: 'Statut',
//       render: (val) => (
//         <span className={
//           val === 'actif'
//             ? 'px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200'
//             : 'px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-600 border border-red-200'
//         }>
//           {val}
//         </span>
//       ),
//     },
//   ];

//   // ── Colonnes colis ──
//   const packageColumns = [
//     {
//       key: 'trackingNumber',
//       label: 'N° Suivi',
//       render: (val) => <span className="text-sm font-mono font-medium text-orange-600">{val}</span>,
//     },
//     {
//       key: 'status',
//       label: 'Statut',
//       render: (val) => {
//         const colors = {
//           registered:       'bg-slate-100 text-slate-700 border-slate-200',
//           transit:          'bg-amber-50 text-amber-700 border-amber-200',
//           delivered:        'bg-emerald-50 text-emerald-700 border-emerald-200',
//           arrived:          'bg-blue-50 text-blue-700 border-blue-200',
//           out_for_delivery: 'bg-purple-50 text-purple-700 border-purple-200',
//           returned:         'bg-red-50 text-red-600 border-red-200',
//         };
//         return (
//           <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${colors[val] || colors.registered}`}>
//             {val}
//           </span>
//         );
//       },
//     },
//     {
//       key: 'origin',
//       label: 'Trajet',
//       render: (val, row) => (
//         <span className="text-sm text-slate-600">{val} → {row.destination}</span>
//       ),
//     },
//     {
//       key: 'totalPrice',
//       label: 'Prix',
//       render: (val) => <span className="text-sm font-medium text-slate-800">{val ? `${val} $` : '—'}</span>,
//     },
//     {
//       key: 'createdAt',
//       label: 'Date',
//       render: (val) => <span className="text-sm text-slate-500">{new Date(val).toLocaleDateString('fr-FR')}</span>,
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent" />
//       </div>
//     );
//   }

//   if (!agency) return null;

//   const agencyStats = agency.stats || {};

//   return (
//     <div className="min-h-screen bg-slate-50">

//       {/* ── Header ── */}
//       <div className="bg-white border-b border-slate-200 px-6 py-5">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate('/app/agencies')}
//               className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
//             >
//               <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
//             </button>
//             <div className="w-11 h-11 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-center">
//               <CubeIcon className="w-5 h-5 text-orange-500" />
//             </div>
//             <div>
//               <div className="flex items-center gap-2">
//                 <h1 className="text-xl font-semibold text-slate-800">{agency.name}</h1>
//                 <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
//                   {agency.code}
//                 </span>
//                 <span className={
//                   agency.status === 'actif'
//                     ? 'px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200'
//                     : 'px-2.5 py-1 text-xs font-medium rounded-full bg-red-50 text-red-600 border border-red-200'
//                 }>
//                   {agency.status}
//                 </span>
//               </div>
//               <p className="text-sm text-slate-500">{agency.address?.city}, {agency.address?.country}</p>
//             </div>
//           </div>
//           <button
//             onClick={() => navigate(`/app/agencies/${id}/edit`)}
//             className="inline-flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5"
//           >
//             <PencilIcon className="w-4 h-4" />
//             Modifier
//           </button>
//         </div>
//       </div>

//       <div className="p-6 space-y-6">

//         {/* ── Stat Cards ── */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
//             <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
//               <UserGroupIcon className="w-5 h-5 text-blue-500" />
//             </div>
//             <div>
//               <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Employés</p>
//               <p className="text-2xl font-bold text-slate-800 mt-0.5">{employees.length}</p>
//             </div>
//           </div>
//           <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
//             <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
//               <CubeIcon className="w-5 h-5 text-emerald-500" />
//             </div>
//             <div>
//               <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Colis traités</p>
//               <p className="text-2xl font-bold text-slate-800 mt-0.5">{agencyStats.packagesCount || packages.length}</p>
//             </div>
//           </div>
//           <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
//             <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
//               <CubeIcon className="w-5 h-5 text-orange-500" />
//             </div>
//             <div>
//               <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Revenu total</p>
//               <p className="text-2xl font-bold text-slate-800 mt-0.5">{agencyStats.totalRevenue || 0} $</p>
//             </div>
//           </div>
//         </div>

//         {/* ── Infos ── */}
//         <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
//           <h3 className="text-base font-semibold text-slate-800 mb-5">Informations</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-4">
//               <div className="flex items-start gap-3">
//                 <MapPinIcon className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
//                 <div>
//                   <p className="text-xs text-slate-500 mb-1">Adresse</p>
//                   <p className="text-sm text-slate-800">{agency.address?.street}</p>
//                   <p className="text-sm text-slate-600">{agency.address?.city}, {agency.address?.country}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3">
//                 <PhoneIcon className="w-5 h-5 text-slate-400 shrink-0" />
//                 <div>
//                   <p className="text-xs text-slate-500 mb-1">Téléphone</p>
//                   <a href={`tel:${agency.phone}`} className="text-sm text-slate-800 hover:text-orange-500 transition-colors">
//                     {agency.phone || '—'}
//                   </a>
//                 </div>
//               </div>
//             </div>
//             <div className="space-y-4">
//               <div className="flex items-center gap-3">
//                 <EnvelopeIcon className="w-5 h-5 text-slate-400 shrink-0" />
//                 <div>
//                   <p className="text-xs text-slate-500 mb-1">Email</p>
//                   <a href={`mailto:${agency.email}`} className="text-sm text-slate-800 hover:text-orange-500 transition-colors">
//                     {agency.email || '—'}
//                   </a>
//                 </div>
//               </div>
//               {agency.manager && (
//                 <div className="flex items-center gap-3">
//                   <UserGroupIcon className="w-5 h-5 text-slate-400 shrink-0" />
//                   <div>
//                     <p className="text-xs text-slate-500 mb-1">Responsable</p>
//                     <p className="text-sm text-slate-800">
//                       {agency.manager.firstName} {agency.manager.lastName}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* ── Tabs ── */}
//         <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
//           <div className="flex border-b border-slate-200">
//             {[
//               { key: 'employees', label: `Employés (${employees.length})` },
//               { key: 'packages',  label: `Colis (${packages.length})` },
//             ].map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setActiveTab(tab.key)}
//                 className={`px-6 py-3.5 text-sm font-medium transition-colors border-b-2 ${
//                   activeTab === tab.key
//                     ? 'border-orange-500 text-orange-600 bg-orange-50/50'
//                     : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>
//           <div>
//             {activeTab === 'employees' && (
//               <DataTable
//                 columns={employeeColumns}
//                 data={employees}
//                 onRowClick={(row) => navigate(`/app/employees/${row._id}`)}
//                 loading={false}
//               />
//             )}
//             {activeTab === 'packages' && (
//               <DataTable
//                 columns={packageColumns}
//                 data={packages}
//                 onRowClick={(row) => navigate(`/app/packages/${row._id}`)}
//                 loading={false}
//               />
//             )}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AgencyDetail;


























import React, { useState, useEffect } from 'react';
import { formatByCurrency, listToCurrencyMap, formatMoney, packageCurrency } from '../../config/currencies';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon, PhoneIcon, EnvelopeIcon, MapPinIcon,
  UserGroupIcon, CubeIcon, PencilIcon, SparklesIcon,
  CurrencyDollarIcon, BuildingOfficeIcon, ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import agencyService, { photoUrl } from '../../services/Agencyservice';
import employeeService from '../../services/Employeeservice';
import packageService  from '../../services/Packageservice';
import DataTable from '../../components/Common/DataTable';

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

/* ─────────────────────────────────────────────
   MICRO COMPONENTS
───────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const active = status === 'actif';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 12px', borderRadius: 99,
      background: active ? '#d1fae5' : '#fee2e2',
      color: active ? '#065f46' : '#991b1b',
      border: `1px solid ${active ? '#a7f3d0' : '#fecaca'}`,
      fontSize: 12, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? '#10b981' : '#ef4444' }} />
      {active ? 'Actif' : 'Inactif'}
    </span>
  );
};

const SectionBlock = ({ icon: Icon, iconColor = tk.accent, title, badge, action, children }) => (
  <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(23,22,20,.05)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
      <span style={{ width: 30, height: 30, borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.08)' }}>
        <Icon style={{ width: 15, height: 15, color: iconColor }} />
      </span>
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", flex: 1 }}>
        {title}
      </span>
      {badge}
      {action}
    </div>
    <div style={{ padding: 18 }}>{children}</div>
  </div>
);

const InfoRow = ({ icon: Icon, label, value, href }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: `1px solid ${tk.surface}` }}>
    <div style={{ width: 32, height: 32, borderRadius: 8, background: tk.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon style={{ width: 14, height: 14, color: tk.accent }} />
    </div>
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 3 }}>{label}</p>
      {href
        ? <a href={href} style={{ fontSize: 14, color: tk.accent, fontWeight: 500, textDecoration: 'none' }}>{value || '—'}</a>
        : <p style={{ fontSize: 14, color: tk.ink, fontWeight: 500 }}>{value || '—'}</p>
      }
    </div>
  </div>
);

/* Colonnes status badges inline */
const EmpStatusBadge = ({ status }) => {
  const active = status === 'actif';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 99,
      background: active ? '#d1fae5' : '#fee2e2',
      color: active ? '#065f46' : '#991b1b',
      border: `1px solid ${active ? '#a7f3d0' : '#fecaca'}`,
      fontSize: 11, fontWeight: 600,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: active ? '#10b981' : '#ef4444' }} />
      {status}
    </span>
  );
};

const PkgStatusBadge = ({ status }) => {
  const cfg = {
    registered:       { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' },
    transit:          { bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
    delivered:        { bg: '#d1fae5', color: '#065f46', border: '#a7f3d0' },
    arrived:          { bg: '#fdf0e2', color: '#77551c', border: '#f0dbb3' },
    out_for_delivery: { bg: '#ede9fe', color: '#5b21b6', border: '#ddd6fe' },
    returned:         { bg: '#fee2e2', color: '#991b1b', border: '#fecaca' },
  }[status] || { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
  return (
    <span style={{
      display: 'inline-flex', padding: '3px 10px', borderRadius: 99,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      fontSize: 11, fontWeight: 600,
    }}>
      {status}
    </span>
  );
};

/* ── Carte photo agence — toujours visible ── */
const AgencyPhotoCard = ({ agency }) => {
  const url = photoUrl(agency.photo);
  const tk2 = { border: '#e9e1d5', surface: '#faf8f5', ink: '#171614' };
  return (
    <div style={{
      borderRadius: 16, overflow: 'hidden',
      border: `1.5px solid ${tk2.border}`,
      boxShadow: '0 2px 8px rgba(23,22,20,.06)',
      position: 'relative', aspectRatio: '16/6',
      background: tk2.surface,
    }}>
      <img
        src={url}
        alt={agency.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        onError={e => { e.currentTarget.parentElement.style.display = 'none'; }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(23,22,20,.7) 0%, transparent 50%)',
        display: 'flex', alignItems: 'flex-end', padding: '16px 20px',
      }}>
        <div>
          <p style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 4 }}>
            {agency.name}
          </p>
          {agency.address?.city && (
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 12 }}>
              📍 {[agency.address.city, agency.address.country].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const AgencyDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [agency,    setAgency]    = useState(null);
  const [employees, setEmployees] = useState([]);
  const [packages,  setPackages]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState('employees');

  useEffect(() => { fetchAll(); }, [id]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const agencyRes = await agencyService.getById(id);
      setAgency(agencyRes.data.data);

      const empRes = await employeeService.getAll({ agencyId: id, limit: 100 });
      setEmployees(empRes.data.data || []);

      const pkgRes = await packageService.getAll({ agency: id, limit: 100 });
      setPackages(pkgRes.data.data || []);
    } catch {
      toast.error('Erreur lors du chargement des données');
      navigate('/app/agencies');
    } finally { setLoading(false); }
  };

  /* ── Colonnes employés ── */
  const employeeColumns = [
    { key: 'user', label: 'Nom',
      render: val => <span style={{ fontWeight: 600, color: tk.ink, fontSize: 13 }}>{val ? `${val.firstName} ${val.lastName}` : '—'}</span>,
    },
    { key: 'position',   label: 'Poste',
      render: val => <span style={{ fontSize: 13, color: tk.textSec }}>{val || '—'}</span>,
    },
    { key: 'department', label: 'Département',
      render: val => <span style={{ fontSize: 13, color: tk.textSec }}>{val || '—'}</span>,
    },
    { key: 'user_email', label: 'Email',
      render: (_, row) => <span style={{ fontSize: 13, color: tk.textMut }}>{row.user?.email || '—'}</span>,
    },
    { key: 'status', label: 'Statut', render: val => <EmpStatusBadge status={val} /> },
  ];

  /* ── Colonnes colis ── */
  const packageColumns = [
    { key: 'trackingNumber', label: 'N° Suivi',
      render: val => <span style={{ fontFamily: 'monospace', fontSize: 13, color: tk.accent, fontWeight: 600 }}>{val}</span>,
    },
    { key: 'status', label: 'Statut', render: val => <PkgStatusBadge status={val} /> },
    { key: 'origin', label: 'Trajet',
      render: (val, row) => <span style={{ fontSize: 13, color: tk.textSec }}>{val} → {row.destination}</span>,
    },
    { key: 'totalPrice', label: 'Prix',
      render: (val,row) => <span style={{ fontSize: 13, fontWeight: 600, color: tk.emerald }}>{row.financial ? amountText(row.financial.totalMinor,row.financial.referenceCurrency) : val != null ? formatMoney(val, packageCurrency(row)) : '—'}</span>,
    },
    { key: 'createdAt', label: 'Date',
      render: val => <span style={{ fontSize: 12, color: tk.textMut }}>{new Date(val).toLocaleDateString('fr-FR')}</span>,
    },
  ];

  /* ── Loading ── */
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{ width: 44, height: 44, border: `3px solid ${tk.surf2}`, borderTop: `3px solid ${tk.accent}`, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!agency) return null;

  const agencyStats = agency.stats || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, overflowX: 'hidden' }}>

      {/* ─────────────── HERO ─────────────── */}
      <section className="agency-hero easy-internal-header" style={{
        position: 'relative', height: 260,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', marginBottom: 20, borderRadius: 20,
      }}>
        {/* Background : photo agence si disponible, sinon image générique */}
        {/* Fond decoratif retire : en-tete interne neutre. */}

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#37312a', padding: '0 16px', maxWidth: 600, width: '100%' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
            padding: '5px 14px', marginBottom: 14,
          }}>
            <SparklesIcon style={{ width: 12, height: 12, color: '#ecd5a3' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
              Détail agence
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(20px,4vw,32px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 10, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {agency.name}
            </span>
          </h1>

          {/* Info pills — flex wrap sur mobile */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexWrap: 'wrap', gap: 8,
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,.2)', borderRadius: 10,
              padding: '6px 14px',
            }}>
              <StatusBadge status={agency.status} />
            </div>
            {agency.code && (
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,.2)', borderRadius: 10,
                padding: '6px 14px',
              }}>
                <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#37312a', letterSpacing: '.1em' }}>#{agency.code}</span>
              </div>
            )}
            {(agency.address?.city || agency.address?.country) && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,.2)', borderRadius: 10,
                padding: '6px 14px',
              }}>
                <MapPinIcon style={{ width: 12, height: 12, color: '#37312a' }} />
                <span style={{ fontSize: 12, color: '#37312a' }}>
                  {[agency.address?.city, agency.address?.country].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Wave bottom */}
        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─────────────── BODY CARD ─────────────── */}
      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 8px 48px rgba(23,22,20,.08)', border: `1.5px solid ${tk.border}`, overflow: 'hidden' }}>

        {/* Header actions */}
        <div className="agency-actions" style={{ padding: '16px 24px', background: tk.surface, borderBottom: `1px solid ${tk.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <button onClick={() => navigate('/app/agencies')} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 18px', borderRadius: 10, background: '#fff',
            border: `1.5px solid ${tk.border}`, color: tk.textSec, cursor: 'pointer',
            fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans',sans-serif",
            boxShadow: '0 1px 4px rgba(0,0,0,.05)',
          }}>
            <ArrowLeftIcon style={{ width: 14, height: 14 }} /> Retour aux agences
          </button>

          <button onClick={() => navigate(`/app/agencies/${id}/edit`)} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '9px 18px',
            borderRadius: 10, background: tk.accent, color: '#fff', border: 'none',
            cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
            boxShadow: '0 4px 18px rgba(167,123,40,.3)',
          }}>
            <PencilIcon style={{ width: 15, height: 15 }} /> Modifier
          </button>
        </div>

        {/* Contenu principal */}
        <div className="agency-body" style={{ padding: '32px 32px 28px' }}>
          <div className="agency-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32 }}>

            {/* ── Sidebar sticky ── */}
            <div className="agency-sidebar">
              <div style={{ position: 'sticky', top: 24, borderRadius: 18, overflow: 'hidden', border: `1.5px solid ${tk.border}` }}>
                {/* Dark header */}
                <div style={{ background: `linear-gradient(145deg, ${tk.ink} 0%, ${tk.ink80} 100%)`, padding: '28px 20px', textAlign: 'center' }}>
                  <div style={{
                    width: 84, height: 84, margin: '0 auto 14px',
                    borderRadius: 18, overflow: 'hidden',
                    border: '3px solid rgba(255,255,255,.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: agency.photo ? 'transparent' : 'rgba(167,123,40,.25)',
                  }}>
                    {agency.photo
                      ? <img src={photoUrl(agency.photo)} alt={agency.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <BuildingOfficeIcon style={{ width: 36, height: 36, color: '#ecd5a3' }} />
                    }
                  </div>
                  <div style={{ display: 'inline-flex', justifyContent: 'center', marginBottom: 8 }}>
                    <StatusBadge status={agency.status} />
                  </div>
                  <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 11, marginTop: 6, fontFamily: "'Open Sans',Arial,sans-serif", letterSpacing: '.06em' }}>
                    {agency.code ? `#${agency.code}` : agency.name}
                  </p>
                </div>

                {/* Stats rapides */}
                <div style={{ background: '#fff', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { icon: UserGroupIcon, label: 'Employés',      value: employees.length,                         color: tk.accent },
                    { icon: CubeIcon,      label: 'Colis traités', value: agencyStats.packagesCount || packages.length, color: tk.emerald },
                    { icon: CurrencyDollarIcon, label: 'Revenu total', value: formatByCurrency(listToCurrencyMap(agencyStats.revenueByCurrency)), color: tk.amber },
                  ].map(({ icon: Ic, label, value, color }, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: tk.surface, border: `1px solid ${tk.border}` }}>
                      <Ic style={{ width: 14, height: 14, color, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>{label}</p>
                        <p style={{ fontSize: 14, fontWeight: 700, color }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Contenu principal ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* ── Photo de l'agence (visible sur tous les écrans) ── */}
              {agency.photo ? (
                <AgencyPhotoCard agency={agency} />
              ) : null}

              {/* Stat cards */}
              <div className="grid-kpi-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                {[
                  { label: 'Employés',      value: employees.length,                             icon: UserGroupIcon,      color: tk.accent,  bg: 'rgba(167,123,40,.08)' },
                  { label: 'Colis traités', value: agencyStats.packagesCount || packages.length, icon: CubeIcon,           color: tk.emerald, bg: 'rgba(5,150,105,.08)' },
                  { label: 'Revenu total',  value: formatByCurrency(listToCurrencyMap(agencyStats.revenueByCurrency)),         icon: CurrencyDollarIcon, color: tk.amber,   bg: 'rgba(217,119,6,.08)' },
                ].map(({ label, value, icon: Ic, color, bg }, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 14, border: `1.5px solid ${tk.border}`, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 2px 8px rgba(23,22,20,.04)' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Ic style={{ width: 20, height: 20, color }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 3 }}>{label}</p>
                      <p style={{ fontSize: 22, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", lineHeight: 1 }}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Informations */}
              <SectionBlock icon={BuildingOfficeIcon} title="Informations de l'agence">
                <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
                  <InfoRow icon={MapPinIcon}    label="Adresse"     value={`${agency.address?.street || '—'}, ${agency.address?.city || ''}`} />
                  <InfoRow icon={PhoneIcon}     label="Téléphone"   value={agency.phone}  href={agency.phone ? `tel:${agency.phone}` : null} />
                  <InfoRow icon={EnvelopeIcon}  label="Email"       value={agency.email}  href={agency.email ? `mailto:${agency.email}` : null} />
                  {agency.manager && (
                    <InfoRow icon={UserGroupIcon} label="Responsable" value={`${agency.manager.firstName} ${agency.manager.lastName}`} />
                  )}
                </div>
              </SectionBlock>

              {/* ── Localisation & Carte ── */}
              {(agency.latitude && agency.longitude) ? (
                <SectionBlock icon={MapPinIcon} title="Localisation & Itinéraire">
                  {/* Infos coordonnées */}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 99, background: 'rgba(5,150,105,.08)', border: '1px solid rgba(5,150,105,.2)', fontSize: 12, fontWeight: 600, color: tk.emerald }}>
                      📍 {parseFloat(agency.latitude).toFixed(4)}, {parseFloat(agency.longitude).toFixed(4)}
                    </span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${agency.latitude},${agency.longitude}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 99, background: 'rgba(167,123,40,.08)', border: '1px solid rgba(167,123,40,.2)', fontSize: 12, fontWeight: 600, color: tk.accent, textDecoration: 'none' }}>
                      🗺️ Itinéraire Google Maps
                    </a>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${agency.latitude}&mlon=${agency.longitude}#map=16/${agency.latitude}/${agency.longitude}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 99, background: tk.surf2, border: `1px solid ${tk.border}`, fontSize: 12, fontWeight: 600, color: tk.textSec, textDecoration: 'none' }}>
                      🌐 OpenStreetMap
                    </a>
                  </div>

                  {/* Carte OpenStreetMap embarquée */}
                  <div style={{ borderRadius: 14, overflow: 'hidden', border: `1.5px solid ${tk.border}` }}>
                    <iframe
                      title={`Localisation ${agency.name}`}
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(agency.longitude) - 0.015},${parseFloat(agency.latitude) - 0.015},${parseFloat(agency.longitude) + 0.015},${parseFloat(agency.latitude) + 0.015}&layer=mapnik&marker=${agency.latitude},${agency.longitude}`}
                      style={{ width: '100%', height: 320, border: 0, display: 'block' }}
                    />
                  </div>
                </SectionBlock>
              ) : (
                <SectionBlock icon={MapPinIcon} title="Localisation & Itinéraire">
                  <div style={{ padding: '20px 0', textAlign: 'center' }}>
                    <MapPinIcon style={{ width: 36, height: 36, color: tk.textMut, margin: '0 auto 8px' }} />
                    <p style={{ fontSize: 13, color: tk.textMut, marginBottom: 12 }}>Aucune coordonnée GPS renseignée pour cette agence.</p>
                    <a href={`https://www.google.com/maps/search/${encodeURIComponent([agency.address?.street, agency.address?.city, agency.address?.country].filter(Boolean).join(', '))}`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '8px 16px', borderRadius: 9, background: 'rgba(167,123,40,.08)', border: `1px solid ${tk.accent}`, fontSize: 12, fontWeight: 600, color: tk.accent, textDecoration: 'none' }}>
                      🗺️ Rechercher sur Google Maps
                    </a>
                  </div>
                </SectionBlock>
              )}

              {/* Horaires si disponibles */}
              {agency.openingHours && (
                <SectionBlock icon={ClockIcon} title="Horaires d'ouverture">
                  <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 32px' }}>
                    {[
                      { key: 'monday',    label: 'Lundi'    },
                      { key: 'tuesday',   label: 'Mardi'    },
                      { key: 'wednesday', label: 'Mercredi' },
                      { key: 'thursday',  label: 'Jeudi'    },
                      { key: 'friday',    label: 'Vendredi' },
                      { key: 'saturday',  label: 'Samedi'   },
                      { key: 'sunday',    label: 'Dimanche' },
                    ].map(({ key, label }) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${tk.surface}` }}>
                        <span style={{ fontSize: 13, color: tk.textMut }}>{label}</span>
                        <span style={{
                          fontSize: 13, fontWeight: 600,
                          color: agency.openingHours[key] === 'Fermé' ? tk.rose : tk.emerald,
                        }}>
                          {agency.openingHours[key] || '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </SectionBlock>
              )}

              {/* Tabs Employés / Colis */}
              <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(23,22,20,.05)' }}>
                {/* Tab bar */}
                <div style={{ display: 'flex', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
                  {[
                    { key: 'employees', label: `Employés (${employees.length})`, icon: UserGroupIcon },
                    { key: 'packages',  label: `Colis (${packages.length})`,     icon: CubeIcon      },
                  ].map(({ key, label, icon: Ic }) => {
                    const active = activeTab === key;
                    return (
                      <button key={key} onClick={() => setActiveTab(key)} style={{
                        display: 'flex', alignItems: 'center', gap: 7, padding: '13px 20px',
                        background: 'none', border: 'none', cursor: 'pointer',
                        borderBottom: `2px solid ${active ? tk.accent : 'transparent'}`,
                        color: active ? tk.accent : tk.textMut,
                        fontSize: 13, fontWeight: active ? 700 : 500,
                        fontFamily: "'Open Sans',Arial,sans-serif", transition: 'all .15s',
                      }}>
                        <Ic style={{ width: 14, height: 14 }} />
                        {label}
                      </button>
                    );
                  })}
                </div>

                {/* Contenu onglet */}
                <div>
                  {activeTab === 'employees' && (
                    <DataTable
                      columns={employeeColumns}
                      data={employees}
                      onRowClick={row => navigate(`/app/employees/${row._id}`)}
                      loading={false}
                    />
                  )}
                  {activeTab === 'packages' && (
                    <DataTable
                      columns={packageColumns}
                      data={packages}
                      onRowClick={row => navigate(`/app/packages/${row._id}`)}
                      loading={false}
                    />
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Tablette ≤1023px ── */
        @media (max-width: 1023px) {
          .agency-hero    { height: 220px !important; margin-bottom: 16px !important; border-radius: 16px !important; }
          .agency-actions { padding: 12px 16px !important; }
          .agency-body    { padding: 20px 16px 24px !important; }
          .agency-grid    { grid-template-columns: 1fr !important; gap: 20px !important; }
          .agency-sidebar { display: none !important; }
        }

        /* ── Mobile XR ≤639px ── */
        @media (max-width: 639px) {
          .agency-hero    { height: 190px !important; }
          .agency-actions { padding: 10px 12px !important; }
          .agency-body    { padding: 14px 12px 20px !important; }
          .agency-actions button { padding: 8px 12px !important; font-size: 12px !important; }
        }
      `}</style>
    </div>
  );
};

export default AgencyDetail;
