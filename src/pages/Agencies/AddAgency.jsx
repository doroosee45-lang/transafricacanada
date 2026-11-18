// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { toast } from 'react-toastify';
// import {
//   ArrowLeftIcon, SparklesIcon, BuildingOfficeIcon,
//   MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon,
//   CheckCircleIcon, TruckIcon,
// } from '@heroicons/react/24/outline';
// import agencyService from '../../services/Agencyservice';

// /* ─────────────────────────────────────────────
//    DESIGN TOKENS — identiques à AddPackage
// ───────────────────────────────────────────── */
// const tk = {
//   ink:     '#171614',
//   ink80:   '#26231e',
//   surface: '#faf8f5',
//   surf2:   '#f5efe6',
//   border:  '#e9e1d5',
//   accent:  '#a77b28',
//   emerald: '#059669',
//   rose:    '#dc2626',
//   textSec: '#4b5a6e',
//   textMut: '#8494a9',
// };

// const inputStyle = {
//   width: '100%', padding: '10px 14px', borderRadius: 10,
//   background: '#fff', color: tk.ink, fontSize: 14,
//   border: `1.5px solid ${tk.border}`, outline: 'none',
//   fontFamily: "'DM Sans', sans-serif", transition: 'border .18s',
// };
// const inputErrStyle = { ...inputStyle, borderColor: tk.rose, background: '#fff5f5' };

// const FieldLabel = ({ children }) => (
//   <label style={{
//     display: 'block', fontSize: 10, fontWeight: 700,
//     letterSpacing: '.12em', textTransform: 'uppercase',
//     color: tk.textMut, marginBottom: 6, fontFamily: "'Open Sans', Arial, sans-serif",
//   }}>
//     {children}
//   </label>
// );

// const SectionBlock = ({ icon: Icon, iconColor = tk.accent, title, children }) => (
//   <div style={{ border: `1.5px solid ${tk.border}`, borderRadius: 16, overflow: 'hidden' }}>
//     <div style={{
//       display: 'flex', alignItems: 'center', gap: 10,
//       padding: '12px 18px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
//     }}>
//       <span style={{
//         width: 30, height: 30, borderRadius: 8, background: '#fff',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         boxShadow: '0 1px 4px rgba(0,0,0,.08)',
//       }}>
//         <Icon style={{ width: 15, height: 15, color: iconColor }} />
//       </span>
//       <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
//         {title}
//       </span>
//     </div>
//     <div style={{ padding: 18, background: '#fff', display: 'flex', flexDirection: 'column', gap: 14 }}>
//       {children}
//     </div>
//   </div>
// );

// /* ─────────────────────────────────────────────
//    JOURS DE LA SEMAINE
// ───────────────────────────────────────────── */
// const DAYS = [
//   { key: 'monday',    label: 'Lundi'    },
//   { key: 'tuesday',   label: 'Mardi'    },
//   { key: 'wednesday', label: 'Mercredi' },
//   { key: 'thursday',  label: 'Jeudi'    },
//   { key: 'friday',    label: 'Vendredi' },
//   { key: 'saturday',  label: 'Samedi'   },
//   { key: 'sunday',    label: 'Dimanche' },
// ];

// const steps = [
//   { id: 0, name: 'Général',  icon: BuildingOfficeIcon },
//   { id: 1, name: 'Adresse',  icon: MapPinIcon         },
//   { id: 2, name: 'Horaires', icon: ClockIcon          },
// ];

// /* ─────────────────────────────────────────────
//    MAIN COMPONENT
// ───────────────────────────────────────────── */
// const AddAgency = () => {
//   const navigate = useNavigate();
//   const { id }   = useParams();
//   const isEdit   = Boolean(id);
//   const [loading,  setLoading]  = useState(false);
//   const [fetching, setFetching] = useState(isEdit);
//   const [currentStep, setCurrentStep] = useState(0);

//   const { register, handleSubmit, reset, trigger, formState: { errors } } = useForm({
//     defaultValues: {
//       name: '', phone: '', email: '', status: 'actif',
//       address: { street: '', city: '', country: 'RDC' },
//       openingHours: {
//         monday: '09:00-18:00', tuesday: '09:00-18:00',
//         wednesday: '09:00-18:00', thursday: '09:00-18:00',
//         friday: '09:00-18:00', saturday: '09:00-12:00', sunday: 'Fermé',
//       },
//     },
//   });

//   useEffect(() => {
//     if (!isEdit) return;
//     (async () => {
//       try {
//         const res = await agencyService.getById(id);
//         reset(res.data.data);
//       } catch {
//         toast.error('Agence introuvable');
//         navigate('/app/agencies');
//       } finally { setFetching(false); }
//     })();
//   }, [id]);

//   const stepFields = [
//     ['name', 'phone', 'email', 'status'],
//     ['address.street', 'address.city', 'address.country'],
//     [],
//   ];

//   const nextStep = async () => {
//     const ok = await trigger(stepFields[currentStep]);
//     if (ok) setCurrentStep(p => Math.min(p + 1, steps.length - 1));
//   };
//   const prevStep = () => setCurrentStep(p => Math.max(p - 1, 0));

//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       if (isEdit) {
//         await agencyService.update(id, data);
//         toast.success('Agence mise à jour avec succès');
//       } else {
//         await agencyService.create(data);
//         toast.success('Agence créée avec succès');
//       }
//       navigate('/app/agencies');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde');
//     } finally { setLoading(false); }
//   };

//   if (fetching) return (
//     <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
//       <div style={{ width: 44, height: 44, border: `3px solid ${tk.surf2}`, borderTop: `3px solid ${tk.accent}`, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
//       <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
//     </div>
//   );

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

//       {/* ─────────────── HERO ─────────────── */}
//       <section style={{
//         position: 'relative', height: 260,
//         display: 'flex', flexDirection: 'column',
//         alignItems: 'center', justifyContent: 'center',
//         overflow: 'hidden', marginBottom: 28, borderRadius: 24,
//       }}>
//         <div style={{ position: 'absolute', inset: 0 }}>
//           <div style={{
//             position: 'absolute', inset: 0,
//             backgroundImage: "url('https://topcargointernational.com/assets/plane2.png')",
//             backgroundSize: 'cover', backgroundPosition: 'center',
//             animation: 'zoom-slow 12s ease-in-out infinite alternate',
//           }} />
//           <div style={{
//             position: 'absolute', inset: 0,
//             background: 'linear-gradient(135deg, rgba(23,22,20,.88) 0%, rgba(167,123,40,.55) 60%, rgba(23,22,20,.75) 100%)',
//           }} />
//           <div style={{
//             position: 'absolute', inset: 0,
//             backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px)',
//             backgroundSize: '28px 28px',
//           }} />
//         </div>

//         <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#fff', padding: '0 24px', maxWidth: 640 }}>
//           <div style={{
//             display: 'inline-flex', alignItems: 'center', gap: 8,
//             background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
//             border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
//             padding: '6px 16px', marginBottom: 18,
//           }}>
//             <SparklesIcon style={{ width: 13, height: 13, color: '#ecd5a3' }} />
//             <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
//               {isEdit ? 'Modifier une agence' : 'Nouvelle agence'}
//             </span>
//           </div>

//           <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
//             {isEdit ? 'Modifier l\'agence' : 'Créez votre'}{' '}
//             <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
//               {isEdit ? '' : 'agence'}
//             </span>
//           </h1>
//           <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 14, lineHeight: 1.7 }}>
//             {isEdit ? 'Mettez à jour les informations de votre agence.' : 'Remplissez les informations étape par étape pour créer une nouvelle agence.'}
//           </p>
//         </div>

//         <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
//           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 50" style={{ width: '100%', display: 'block' }}>
//             <path fill={tk.surface} d="M0,20L80,24C160,28,320,36,480,35C640,34,800,24,960,21C1120,18,1280,22,1360,24L1440,26L1440,50L0,50Z" />
//           </svg>
//         </div>
//       </section>

//       {/* ─────────────── FORM CARD ─────────────── */}
//       <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 8px 48px rgba(23,22,20,.08)', border: `1.5px solid ${tk.border}`, overflow: 'hidden' }}>

//         {/* Stepper */}
//         <div style={{ padding: '24px 32px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
//           <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
//             <div style={{ position: 'absolute', top: 20, left: '6%', right: '6%', height: 1, background: tk.border, zIndex: 0 }}>
//               <div style={{ height: '100%', background: tk.accent, width: `${(currentStep / (steps.length - 1)) * 100}%`, transition: 'width .4s ease' }} />
//             </div>
//             {steps.map((step, idx) => {
//               const done = idx < currentStep, active = idx === currentStep;
//               return (
//                 <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
//                   <div style={{
//                     width: 40, height: 40, borderRadius: '50%',
//                     border: `2px solid ${done || active ? tk.accent : tk.border}`,
//                     background: done ? tk.accent : '#fff',
//                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     color: done ? '#fff' : active ? tk.accent : tk.textMut,
//                     boxShadow: active ? `0 0 0 4px rgba(167,123,40,.12), 0 2px 8px rgba(167,123,40,.2)` : 'none',
//                     transition: 'all .3s',
//                   }}>
//                     {done ? <CheckCircleIcon style={{ width: 18, height: 18 }} /> : <step.icon style={{ width: 16, height: 16 }} />}
//                   </div>
//                   <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif", color: active ? tk.accent : done ? tk.ink : tk.textMut }}>
//                     {step.name}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         <div style={{ padding: '40px 40px 32px' }}>
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 40 }}>

//             {/* Sidebar */}
//             <div>
//               <div style={{ position: 'sticky', top: 24, borderRadius: 18, overflow: 'hidden', border: `1.5px solid ${tk.border}` }}>
//                 <div style={{ background: `linear-gradient(145deg, ${tk.ink} 0%, ${tk.ink80} 100%)`, padding: '28px 20px', textAlign: 'center' }}>
//                   <div style={{ width: 80, height: 80, margin: '0 auto 16px', background: 'rgba(255,255,255,.1)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                     <BuildingOfficeIcon style={{ width: 40, height: 40, color: 'rgba(255,255,255,.7)' }} />
//                   </div>
//                   <p style={{ color: '#fff', fontWeight: 700, fontSize: 13, fontFamily: "'Open Sans',Arial,sans-serif" }}>
//                     Étape {currentStep + 1} / {steps.length}
//                   </p>
//                   <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 12, marginTop: 2 }}>{steps[currentStep].name}</p>
//                 </div>
//                 <div style={{ background: '#fff', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
//                   {steps.map((s, i) => (
//                     <div key={s.id} style={{
//                       display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
//                       background: i === currentStep ? 'rgba(167,123,40,.06)' : 'transparent',
//                       border: i === currentStep ? `1px solid rgba(167,123,40,.15)` : '1px solid transparent',
//                       transition: 'all .2s',
//                     }}>
//                       <div style={{
//                         width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         fontSize: 10, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif",
//                         background: i < currentStep ? tk.emerald : i === currentStep ? tk.accent : tk.surf2,
//                         color: i <= currentStep ? '#fff' : tk.textMut,
//                       }}>
//                         {i < currentStep ? '✓' : i + 1}
//                       </div>
//                       <span style={{ fontSize: 12, fontWeight: 500, color: i === currentStep ? tk.accent : i < currentStep ? tk.ink : tk.textMut }}>
//                         {s.name}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Formulaire */}
//             <form onSubmit={handleSubmit(onSubmit)}>

//               {/* STEP 0 — Général */}
//               {currentStep === 0 && (
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
//                   <div>
//                     <h2 style={{ fontSize: 22, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 6 }}>Informations générales</h2>
//                     <p style={{ fontSize: 14, color: tk.textSec }}>Renseignez les informations de base de l'agence.</p>
//                   </div>

//                   <SectionBlock icon={BuildingOfficeIcon} title="Identité de l'agence">
//                     <div>
//                       <FieldLabel>Nom de l'agence *</FieldLabel>
//                       <input type="text" placeholder="Ex : EASY Kinshasa"
//                         {...register('name', { required: 'Le nom est requis' })}
//                         style={errors.name ? inputErrStyle : inputStyle} />
//                       {errors.name && <p style={{ fontSize: 11, color: tk.rose, marginTop: 4 }}>{errors.name.message}</p>}
//                     </div>

//                     <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
//                       <div>
//                         <FieldLabel>Téléphone</FieldLabel>
//                         <div style={{ position: 'relative' }}>
//                           <PhoneIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
//                           <input type="tel" placeholder="+243 81 000 0000"
//                             {...register('phone')}
//                             style={{ ...inputStyle, paddingLeft: 38 }} />
//                         </div>
//                       </div>
//                       <div>
//                         <FieldLabel>Email</FieldLabel>
//                         <div style={{ position: 'relative' }}>
//                           <EnvelopeIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
//                           <input type="email" placeholder="agence@example.com"
//                             {...register('email', { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' } })}
//                             style={{ ...(errors.email ? inputErrStyle : inputStyle), paddingLeft: 38 }} />
//                         </div>
//                         {errors.email && <p style={{ fontSize: 11, color: tk.rose, marginTop: 4 }}>{errors.email.message}</p>}
//                       </div>
//                     </div>

//                     <div>
//                       <FieldLabel>Statut</FieldLabel>
//                       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
//                         {[
//                           { value: 'actif',   label: 'Actif',   color: tk.emerald },
//                           { value: 'inactif', label: 'Inactif', color: tk.rose    },
//                         ].map(opt => (
//                           <label key={opt.value} style={{
//                             cursor: 'pointer', borderRadius: 12, padding: '12px 16px', textAlign: 'center',
//                             border: `2px solid ${tk.border}`, background: '#fff',
//                             fontSize: 13, fontWeight: 600, color: tk.textSec, transition: 'all .2s',
//                             display: 'block',
//                           }}>
//                             <input type="radio" value={opt.value} {...register('status')} style={{ display: 'none' }} />
//                             {opt.label}
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   </SectionBlock>
//                 </div>
//               )}

//               {/* STEP 1 — Adresse */}
//               {currentStep === 1 && (
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
//                   <div>
//                     <h2 style={{ fontSize: 22, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 6 }}>Adresse de l'agence</h2>
//                     <p style={{ fontSize: 14, color: tk.textSec }}>Renseignez la localisation précise de l'agence.</p>
//                   </div>

//                   <SectionBlock icon={MapPinIcon} title="Localisation">
//                     <div>
//                       <FieldLabel>Rue / Adresse complète *</FieldLabel>
//                       <input type="text" placeholder="123 Avenue Principale"
//                         {...register('address.street', { required: "L'adresse est requise" })}
//                         style={errors.address?.street ? inputErrStyle : inputStyle} />
//                       {errors.address?.street && <p style={{ fontSize: 11, color: tk.rose, marginTop: 4 }}>{errors.address.street.message}</p>}
//                     </div>

//                     <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
//                       <div>
//                         <FieldLabel>Ville *</FieldLabel>
//                         <input type="text" placeholder="Kinshasa"
//                           {...register('address.city', { required: 'La ville est requise' })}
//                           style={errors.address?.city ? inputErrStyle : inputStyle} />
//                         {errors.address?.city && <p style={{ fontSize: 11, color: tk.rose, marginTop: 4 }}>{errors.address.city.message}</p>}
//                       </div>
//                       <div>
//                         <FieldLabel>Pays *</FieldLabel>
//                         <select {...register('address.country', { required: 'Le pays est requis' })} style={inputStyle}>
//                           <option value="RDC">RDC</option>
//                           <option value="Canada">Canada</option>
//                           <option value="Cameroun">Cameroun</option>
//                           <option value="Benin">Bénin</option>
//                           <option value="Brazzaville">Brazzaville</option>
//                         </select>
//                       </div>
//                     </div>
//                   </SectionBlock>
//                 </div>
//               )}

//               {/* STEP 2 — Horaires */}
//               {currentStep === 2 && (
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
//                   <div>
//                     <h2 style={{ fontSize: 22, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 6 }}>Horaires d'ouverture</h2>
//                     <p style={{ fontSize: 14, color: tk.textSec }}>Définissez les horaires pour chaque jour de la semaine.</p>
//                   </div>

//                   <SectionBlock icon={ClockIcon} title="Planning hebdomadaire">
//                     {DAYS.map(({ key, label }, i) => (
//                       <div key={key} style={{
//                         display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: 14,
//                         padding: '10px 0', borderBottom: i < DAYS.length - 1 ? `1px solid ${tk.surface}` : 'none',
//                       }}>
//                         <span style={{ fontSize: 13, fontWeight: 600, color: tk.ink }}>{label}</span>
//                         <input type="text" placeholder="09:00-18:00 ou Fermé"
//                           {...register(`openingHours.${key}`)}
//                           style={{ ...inputStyle, padding: '8px 12px' }} />
//                       </div>
//                     ))}
//                   </SectionBlock>
//                 </div>
//               )}

//               {/* Navigation */}
//               <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 36, paddingTop: 24, borderTop: `1px solid ${tk.border}` }}>
//                 <button type="button" onClick={currentStep === 0 ? () => navigate('/app/agencies') : prevStep} style={{
//                   display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
//                   borderRadius: 10, background: 'none', border: `1.5px solid ${tk.border}`,
//                   color: tk.textSec, cursor: 'pointer', fontSize: 13, fontWeight: 500,
//                 }}>
//                   <ArrowLeftIcon style={{ width: 15, height: 15 }} />
//                   {currentStep === 0 ? 'Annuler' : 'Précédent'}
//                 </button>

//                 {currentStep < steps.length - 1 ? (
//                   <button type="button" onClick={nextStep} style={{
//                     display: 'flex', alignItems: 'center', gap: 7, padding: '11px 28px',
//                     borderRadius: 11, background: tk.accent, color: '#fff', border: 'none',
//                     cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
//                     boxShadow: '0 4px 18px rgba(167,123,40,.3)',
//                   }}>
//                     Suivant <ArrowLeftIcon style={{ width: 15, height: 15, transform: 'rotate(180deg)' }} />
//                   </button>
//                 ) : (
//                   <button type="submit" disabled={loading} style={{
//                     display: 'flex', alignItems: 'center', gap: 7, padding: '11px 32px',
//                     borderRadius: 11, background: tk.emerald, color: '#fff', border: 'none',
//                     cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .65 : 1,
//                     fontSize: 14, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
//                     boxShadow: '0 4px 18px rgba(5,150,105,.28)',
//                   }}>
//                     {loading
//                       ? <><span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin .8s linear infinite', display: 'inline-block' }} /> {isEdit ? 'Mise à jour...' : 'Création...'}</>
//                       : <><TruckIcon style={{ width: 15, height: 15 }} /> {isEdit ? 'Enregistrer les modifications' : "Créer l'agence"}</>
//                     }
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}</style>
//     </div>
//   );
// };

// export default AddAgency;






















import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { MARKET_OPTIONS, timezonesOf, countryOf } from '../../config/currencies';
import {
  ArrowLeftIcon, SparklesIcon, BuildingOfficeIcon,
  MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon,
  CheckCircleIcon, TruckIcon, PhotoIcon, XMarkIcon,
  MagnifyingGlassIcon, ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import agencyService, { photoUrl } from '../../services/Agencyservice';

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
const inputErrStyle = { ...inputStyle, borderColor: tk.rose, background: '#fff5f5' };

const FieldLabel = ({ children }) => (
  <label style={{
    display: 'block', fontSize: 10, fontWeight: 700,
    letterSpacing: '.12em', textTransform: 'uppercase',
    color: tk.textMut, marginBottom: 6, fontFamily: "'Open Sans', Arial, sans-serif",
  }}>
    {children}
  </label>
);

const SectionBlock = ({ icon: Icon, iconColor = tk.accent, title, children }) => (
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
    <div style={{ padding: 18, background: '#fff', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {children}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   JOURS DE LA SEMAINE
───────────────────────────────────────────── */
const DAYS = [
  { key: 'monday',    label: 'Lundi'    },
  { key: 'tuesday',   label: 'Mardi'    },
  { key: 'wednesday', label: 'Mercredi' },
  { key: 'thursday',  label: 'Jeudi'    },
  { key: 'friday',    label: 'Vendredi' },
  { key: 'saturday',  label: 'Samedi'   },
  { key: 'sunday',    label: 'Dimanche' },
];

const steps = [
  { id: 0, name: 'Général',  icon: BuildingOfficeIcon },
  { id: 1, name: 'Adresse',  icon: MapPinIcon         },
  { id: 2, name: 'Horaires', icon: ClockIcon          },
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const AddAgency = () => {
  const navigate = useNavigate();
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const [loading,   setLoading]   = useState(false);
  const [fetching,  setFetching]  = useState(isEdit);
  const [currentStep, setCurrentStep] = useState(0);

  /* ── Photo ── */
  const [photoFile,    setPhotoFile]    = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const fileRef = useRef(null);

  /* ── Coordonnées GPS ── */
  const [lat,       setLat]       = useState('');
  const [lng,       setLng]       = useState('');
  const [geocoding, setGeocoding] = useState(false);

  const { register, handleSubmit, reset, trigger, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '', phone: '', email: '', status: 'actif',
      address: { street: '', city: '', country: 'RDC' },
      openingHours: {
        monday: '09:00-18:00', tuesday: '09:00-18:00',
        wednesday: '09:00-18:00', thursday: '09:00-18:00',
        friday: '09:00-18:00', saturday: '09:00-12:00', sunday: 'Fermé',
      },
    },
  });

  const watchedAddress = watch('address');
  const [legacyCountry, setLegacyCountry] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const res = await agencyService.getById(id);
        const ag  = res.data.data;
        // Agence historique hors des 4 marchés (ex. Canada) : son pays reste affiché et conservé.
        if (ag.address?.country && !MARKET_OPTIONS.some(m => m.value === ag.address.country)) setLegacyCountry(ag.address.country);
        reset(ag);
        if (ag.photo)     setPhotoPreview(photoUrl(ag.photo));
        if (ag.latitude)  setLat(String(ag.latitude));
        if (ag.longitude) setLng(String(ag.longitude));
      } catch {
        toast.error('Agence introuvable');
        navigate('/app/agencies');
      } finally { setFetching(false); }
    })();
  }, [id]); // eslint-disable-line

  /* ── Upload photo ── */
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Format image invalide'); return; }
    if (file.size > 5 * 1024 * 1024)    { toast.error('Image trop lourde (max 5 Mo)'); return; }
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  /* ── Mapping code pays → nom Nominatim (anglais) ── */
  const NOMINATIM_COUNTRY = {
    RDC:         'Democratic Republic of the Congo',
    Tunisie:     'Tunisia',
    EAU:         'United Arab Emirates',
    France:      'France',
    Canada:      'Canada',
    Brazzaville: 'Republic of the Congo',
    Cameroun:    'Cameroon',
    Benin:       'Benin',
  };

  /* ── Géocodage Nominatim ── */
  const geocodeAddress = async () => {
    const { street = '', city = '', country = '' } = watchedAddress || {};
    const countryName = NOMINATIM_COUNTRY[country] || country;
    // Essaie d'abord avec ville + pays, puis élargit si rien trouvé
    const queries = [
      [city, countryName].filter(Boolean).join(', '),
      [street, city, countryName].filter(Boolean).join(', '),
      [city].filter(Boolean).join(', '),
    ].filter(q => q.trim());

    if (!queries.length) { toast.error("Renseignez au moins la ville"); return; }
    setGeocoding(true);
    try {
      let found = null;
      for (const q of queries) {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&accept-language=fr`,
          { headers: { 'User-Agent': 'EASYApp/1.0' } }
        );
        const data = await res.json();
        if (data[0]) { found = data[0]; break; }
      }
      if (found) {
        setLat(parseFloat(found.lat).toFixed(6));
        setLng(parseFloat(found.lon).toFixed(6));
        toast.success(`📍 ${found.display_name.split(',').slice(0, 3).join(',')}`, { autoClose: 4000 });
      } else {
        toast.warning('Ville non trouvée automatiquement — entrez lat/lng manuellement');
      }
    } catch {
      toast.error('Erreur réseau lors de la géolocalisation');
    } finally { setGeocoding(false); }
  };

  const stepFields = [
    ['name', 'phone', 'email', 'status'],
    ['address.street', 'address.city', 'address.country'],
    [],
  ];

  const nextStep = async () => {
    const ok = await trigger(stepFields[currentStep]);
    if (ok) setCurrentStep(p => Math.min(p + 1, steps.length - 1));
  };
  const prevStep = () => setCurrentStep(p => Math.max(p - 1, 0));

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const { photo: _photo, ...rest } = data;
      const payload = {
        ...rest,
        latitude:  lat  || undefined,
        longitude: lng  || undefined,
      };
      const file = photoFile instanceof File ? photoFile : undefined;
      if (isEdit) {
        await agencyService.update(id, payload, file);
        toast.success('Agence mise à jour avec succès');
      } else {
        await agencyService.create(payload, file);
        toast.success('Agence créée avec succès');
      }
      navigate('/app/agencies');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally { setLoading(false); }
  };

  if (fetching) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 240 }}>
      <div style={{ width: 44, height: 44, border: `3px solid ${tk.surf2}`, borderTop: `3px solid ${tk.accent}`, borderRadius: '50%', animation: 'spin .8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ─────────────── HERO ─────────────── */}
      <section className="easy-internal-header" style={{
        position: 'relative', height: 260,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', marginBottom: 28, borderRadius: 24,
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
              {isEdit ? 'Modifier une agence' : 'Nouvelle agence'}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            {isEdit ? 'Modifier l\'agence' : 'Créez votre'}{' '}
            <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {isEdit ? '' : 'agence'}
            </span>
          </h1>
          <p style={{ color: '#37312a', fontSize: 14, lineHeight: 1.7 }}>
            {isEdit ? 'Mettez à jour les informations de votre agence.' : 'Remplissez les informations étape par étape pour créer une nouvelle agence.'}
          </p>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─────────────── FORM CARD ─────────────── */}
      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 8px 48px rgba(23,22,20,.08)', border: `1.5px solid ${tk.border}`, overflow: 'hidden' }}>

        {/* Stepper */}
        <div className="form-stepper-header" style={{ padding: '24px 32px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ position: 'absolute', top: 20, left: '6%', right: '6%', height: 1, background: tk.border, zIndex: 0 }}>
              <div style={{ height: '100%', background: tk.accent, width: `${(currentStep / (steps.length - 1)) * 100}%`, transition: 'width .4s ease' }} />
            </div>
            {steps.map((step, idx) => {
              const done = idx < currentStep, active = idx === currentStep;
              return (
                <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    border: `2px solid ${done || active ? tk.accent : tk.border}`,
                    background: done ? tk.accent : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: done ? '#fff' : active ? tk.accent : tk.textMut,
                    boxShadow: active ? `0 0 0 4px rgba(167,123,40,.12), 0 2px 8px rgba(167,123,40,.2)` : 'none',
                    transition: 'all .3s',
                  }}>
                    {done ? <CheckCircleIcon style={{ width: 18, height: 18 }} /> : <step.icon style={{ width: 16, height: 16 }} />}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif", color: active ? tk.accent : done ? tk.ink : tk.textMut }}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-card-body" style={{ padding: '40px 40px 32px' }}>
          <div className="form-layout-sidebar" style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 40 }}>

            {/* Sidebar */}
            <div className="form-sidebar">
              <div style={{ position: 'sticky', top: 24, borderRadius: 18, overflow: 'hidden', border: `1.5px solid ${tk.border}` }}>
                <div style={{ background: `linear-gradient(145deg, ${tk.ink} 0%, ${tk.ink80} 100%)`, padding: '28px 20px', textAlign: 'center' }}>
                  <div style={{ width: 80, height: 80, margin: '0 auto 16px', borderRadius: 16, overflow: 'hidden', border: '3px solid rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.1)' }}>
                    {photoPreview
                      ? <img src={photoPreview} alt="Agence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <BuildingOfficeIcon style={{ width: 40, height: 40, color: 'rgba(255,255,255,.7)' }} />
                    }
                  </div>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 13, fontFamily: "'Open Sans',Arial,sans-serif" }}>
                    Étape {currentStep + 1} / {steps.length}
                  </p>
                  <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 12, marginTop: 2 }}>{steps[currentStep].name}</p>
                </div>
                <div style={{ background: '#fff', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {steps.map((s, i) => (
                    <div key={s.id} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
                      background: i === currentStep ? 'rgba(167,123,40,.06)' : 'transparent',
                      border: i === currentStep ? `1px solid rgba(167,123,40,.15)` : '1px solid transparent',
                      transition: 'all .2s',
                    }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 700, fontFamily: "'Open Sans',Arial,sans-serif",
                        background: i < currentStep ? tk.emerald : i === currentStep ? tk.accent : tk.surf2,
                        color: i <= currentStep ? '#fff' : tk.textMut,
                      }}>
                        {i < currentStep ? '✓' : i + 1}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: i === currentStep ? tk.accent : i < currentStep ? tk.ink : tk.textMut }}>
                        {s.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* STEP 0 — Général */}
              {currentStep === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 6 }}>Informations générales</h2>
                    <p style={{ fontSize: 14, color: tk.textSec }}>Renseignez les informations de base de l'agence.</p>
                  </div>

                  {/* ── Photo de l'agence ── */}
                  <SectionBlock icon={PhotoIcon} iconColor={tk.accent} title="Photo de l'agence">
                    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      {/* Preview */}
                      <div style={{ width: 110, height: 110, borderRadius: 14, overflow: 'hidden', border: `2px dashed ${photoPreview ? tk.accent : tk.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: tk.surface, flexShrink: 0, position: 'relative', cursor: 'pointer' }}
                        onClick={() => fileRef.current?.click()}>
                        {photoPreview
                          ? <>
                              <img src={photoPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button type="button" onClick={e => { e.stopPropagation(); setPhotoFile(null); setPhotoPreview(''); }}
                                style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,.55)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                <XMarkIcon style={{ width: 12, height: 12 }} />
                              </button>
                            </>
                          : <div style={{ textAlign: 'center' }}>
                              <PhotoIcon style={{ width: 28, height: 28, color: tk.textMut, margin: '0 auto 6px' }} />
                              <p style={{ fontSize: 9, color: tk.textMut, fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>Cliquer</p>
                            </div>
                        }
                      </div>
                      {/* Infos */}
                      <div style={{ flex: 1, minWidth: 160 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: tk.ink, marginBottom: 6 }}>Photo ou logo de l'agence</p>
                        <p style={{ fontSize: 12, color: tk.textSec, lineHeight: 1.6, marginBottom: 10 }}>Format JPG ou PNG, max 5 Mo. Cette photo sera affichée sur la fiche agence.</p>
                        <button type="button" onClick={() => fileRef.current?.click()}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 9, border: `1.5px solid ${tk.accent}`, background: `${tk.accent}08`, color: tk.accent, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          <PhotoIcon style={{ width: 14, height: 14 }} />
                          {photoPreview ? 'Changer la photo' : 'Choisir une photo'}
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
                      </div>
                    </div>
                  </SectionBlock>

                  <SectionBlock icon={BuildingOfficeIcon} title="Identité de l'agence">
                    <div>
                      <FieldLabel>Nom de l'agence *</FieldLabel>
                      <input type="text" placeholder="Ex : EASY Kinshasa"
                        {...register('name', { required: 'Le nom est requis' })}
                        style={errors.name ? inputErrStyle : inputStyle} />
                      {errors.name && <p style={{ fontSize: 11, color: tk.rose, marginTop: 4 }}>{errors.name.message}</p>}
                    </div>

                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <FieldLabel>Téléphone</FieldLabel>
                        <div style={{ position: 'relative' }}>
                          <PhoneIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
                          <input type="tel" placeholder="+243 81 000 0000"
                            {...register('phone')}
                            style={{ ...inputStyle, paddingLeft: 38 }} />
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Email</FieldLabel>
                        <div style={{ position: 'relative' }}>
                          <EnvelopeIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
                          <input type="email" placeholder="agence@example.com"
                            {...register('email', { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' } })}
                            style={{ ...(errors.email ? inputErrStyle : inputStyle), paddingLeft: 38 }} />
                        </div>
                        {errors.email && <p style={{ fontSize: 11, color: tk.rose, marginTop: 4 }}>{errors.email.message}</p>}
                      </div>
                    </div>

                    <div>
                      <FieldLabel>Statut</FieldLabel>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {[
                          { value: 'actif',   label: 'Actif',   color: tk.emerald },
                          { value: 'inactif', label: 'Inactif', color: tk.rose    },
                        ].map(opt => (
                          <label key={opt.value} style={{
                            cursor: 'pointer', borderRadius: 12, padding: '12px 16px', textAlign: 'center',
                            border: `2px solid ${tk.border}`, background: '#fff',
                            fontSize: 13, fontWeight: 600, color: tk.textSec, transition: 'all .2s',
                            display: 'block',
                          }}>
                            <input type="radio" value={opt.value} {...register('status')} style={{ display: 'none' }} />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </SectionBlock>
                </div>
              )}

              {/* STEP 1 — Adresse */}
              {currentStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 6 }}>Adresse de l'agence</h2>
                    <p style={{ fontSize: 14, color: tk.textSec }}>Renseignez la localisation précise de l'agence.</p>
                  </div>

                  <SectionBlock icon={MapPinIcon} title="Adresse">
                    <div>
                      <FieldLabel>Rue / Adresse complète *</FieldLabel>
                      <input type="text" placeholder="123 Avenue Principale"
                        {...register('address.street', { required: "L'adresse est requise" })}
                        style={errors.address?.street ? inputErrStyle : inputStyle} />
                      {errors.address?.street && <p style={{ fontSize: 11, color: tk.rose, marginTop: 4 }}>{errors.address.street.message}</p>}
                    </div>

                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <FieldLabel>Ville *</FieldLabel>
                        <input type="text" placeholder="Kinshasa"
                          {...register('address.city', { required: 'La ville est requise' })}
                          style={errors.address?.city ? inputErrStyle : inputStyle} />
                        {errors.address?.city && <p style={{ fontSize: 11, color: tk.rose, marginTop: 4 }}>{errors.address.city.message}</p>}
                      </div>
                      <div>
                        <FieldLabel>Pays (marché d'activité) *</FieldLabel>
                        {/* Une agence appartient à l'un des 4 marchés (Dubaï : pays « Émirats arabes unis »). */}
                        <select {...register('address.country', { required: 'Le pays est requis' })} style={inputStyle}>
                          <option value="">— Sélectionner —</option>
                          {MARKET_OPTIONS.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                          {legacyCountry && <option value={legacyCountry}>{countryOf(legacyCountry)?.name || legacyCountry} (corridor historique)</option>}
                        </select>
                        {MARKET_OPTIONS.length === 0 && <p role="alert" style={{ fontSize: 11, color: tk.rose, marginTop: 4 }}>Liste des marchés indisponible (serveur injoignable).</p>}
                      </div>
                      <div>
                        <FieldLabel>Fuseau horaire</FieldLabel>
                        <select {...register('timezone')} style={inputStyle} disabled={timezonesOf(watchedAddress?.country).length < 2}>
                          {timezonesOf(watchedAddress?.country).map(tz => <option key={tz} value={tz}>{tz.replace('_', ' ')}</option>)}
                        </select>
                        {watchedAddress?.country === 'EAU' && <p style={{ fontSize: 11, color: tk.textMut, marginTop: 4 }}>Ville / émirat par défaut : {countryOf('EAU')?.defaultCity || 'Dubaï'}.</p>}
                      </div>
                    </div>
                  </SectionBlock>

                  {/* ── Coordonnées GPS + Carte ── */}
                  <SectionBlock icon={MapPinIcon} iconColor={tk.emerald} title="Localisation GPS & Itinéraire">
                    {/* Bouton géocodage automatique */}
                    <button type="button" onClick={geocodeAddress} disabled={geocoding}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 10, background: geocoding ? tk.surf2 : `${tk.emerald}10`, border: `1.5px solid ${geocoding ? tk.border : tk.emerald}`, color: geocoding ? tk.textMut : tk.emerald, fontSize: 12, fontWeight: 600, cursor: geocoding ? 'not-allowed' : 'pointer', transition: 'all .15s' }}>
                      {geocoding
                        ? <><span style={{ width: 13, height: 13, border: `2px solid ${tk.emerald}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />Géolocalisation...</>
                        : <><MagnifyingGlassIcon style={{ width: 14, height: 14 }} />Localiser depuis l'adresse</>
                      }
                    </button>

                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <FieldLabel>Latitude</FieldLabel>
                        <input type="number" step="any" placeholder="-4.3225" value={lat} onChange={e => setLat(e.target.value)}
                          style={inputStyle} />
                      </div>
                      <div>
                        <FieldLabel>Longitude</FieldLabel>
                        <input type="number" step="any" placeholder="15.3222" value={lng} onChange={e => setLng(e.target.value)}
                          style={inputStyle} />
                      </div>
                    </div>

                    {/* Carte OpenStreetMap */}
                    {lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng)) && (
                      <div style={{ marginTop: 4 }}>
                        <div style={{ borderRadius: 12, overflow: 'hidden', border: `1.5px solid ${tk.border}`, position: 'relative' }}>
                          <iframe
                            title="Localisation agence"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lng) - 0.015},${parseFloat(lat) - 0.015},${parseFloat(lng) + 0.015},${parseFloat(lat) + 0.015}&layer=mapnik&marker=${lat},${lng}`}
                            style={{ width: '100%', height: 260, border: 0, display: 'block' }}
                          />
                        </div>
                        <a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: 11, color: tk.accent, textDecoration: 'none', fontWeight: 500 }}>
                          <ArrowTopRightOnSquareIcon style={{ width: 12, height: 12 }} />
                          Voir en grand sur OpenStreetMap
                        </a>
                      </div>
                    )}

                    {!lat && !lng && (
                      <div style={{ borderRadius: 12, border: `1.5px dashed ${tk.border}`, padding: '28px 20px', textAlign: 'center', background: tk.surf2 }}>
                        <MapPinIcon style={{ width: 32, height: 32, color: tk.textMut, margin: '0 auto 8px' }} />
                        <p style={{ fontSize: 13, color: tk.textMut }}>Entrez des coordonnées ou cliquez sur "Localiser depuis l'adresse" pour afficher la carte</p>
                      </div>
                    )}
                  </SectionBlock>
                </div>
              )}

              {/* STEP 2 — Horaires */}
              {currentStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 6 }}>Horaires d'ouverture</h2>
                    <p style={{ fontSize: 14, color: tk.textSec }}>Définissez les horaires pour chaque jour de la semaine.</p>
                  </div>

                  <SectionBlock icon={ClockIcon} title="Planning hebdomadaire">
                    {DAYS.map(({ key, label }, i) => (
                      <div key={key} style={{
                        display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: 14,
                        padding: '10px 0', borderBottom: i < DAYS.length - 1 ? `1px solid ${tk.surface}` : 'none',
                      }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: tk.ink }}>{label}</span>
                        <input type="text" placeholder="09:00-18:00 ou Fermé"
                          {...register(`openingHours.${key}`)}
                          style={{ ...inputStyle, padding: '8px 12px' }} />
                      </div>
                    ))}
                  </SectionBlock>
                </div>
              )}

              {/* Navigation */}
              <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 36, paddingTop: 24, borderTop: `1px solid ${tk.border}` }}>
                <button type="button" onClick={currentStep === 0 ? () => navigate('/app/agencies') : prevStep} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                  borderRadius: 10, background: 'none', border: `1.5px solid ${tk.border}`,
                  color: tk.textSec, cursor: 'pointer', fontSize: 13, fontWeight: 500,
                }}>
                  <ArrowLeftIcon style={{ width: 15, height: 15 }} />
                  {currentStep === 0 ? 'Annuler' : 'Précédent'}
                </button>

                {currentStep < steps.length - 1 ? (
                  <button type="button" onClick={nextStep} style={{
                    display: 'flex', alignItems: 'center', gap: 7, padding: '11px 28px',
                    borderRadius: 11, background: tk.accent, color: '#fff', border: 'none',
                    cursor: 'pointer', fontSize: 14, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
                    boxShadow: '0 4px 18px rgba(167,123,40,.3)',
                  }}>
                    Suivant <ArrowLeftIcon style={{ width: 15, height: 15, transform: 'rotate(180deg)' }} />
                  </button>
                ) : (
                  <button type="submit" disabled={loading} style={{
                    display: 'flex', alignItems: 'center', gap: 7, padding: '11px 32px',
                    borderRadius: 11, background: tk.emerald, color: '#fff', border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? .65 : 1,
                    fontSize: 14, fontWeight: 600, fontFamily: "'Open Sans',Arial,sans-serif",
                    boxShadow: '0 4px 18px rgba(5,150,105,.28)',
                  }}>
                    {loading
                      ? <><span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin .8s linear infinite', display: 'inline-block' }} /> {isEdit ? 'Mise à jour...' : 'Création...'}</>
                      : <><TruckIcon style={{ width: 15, height: 15 }} /> {isEdit ? 'Enregistrer les modifications' : "Créer l'agence"}</>
                    }
                  </button>
                )}
              </div>
            </form>
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

export default AddAgency;
