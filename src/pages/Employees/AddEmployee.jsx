


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../../components/Context/AuthContext';
import {
  ArrowLeftIcon, SparklesIcon, UserIcon,
  MapPinIcon, PhoneIcon, EnvelopeIcon, BriefcaseIcon,
  CheckCircleIcon, UserPlusIcon, ShieldExclamationIcon,
} from '@heroicons/react/24/outline';
import axios from '../../api/axios';

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const tk = {
  ink: '#171614',
  ink80: '#26231e',
  surface: '#faf8f5',
  surf2: '#f5efe6',
  border: '#e9e1d5',
  accent: '#a77b28',
  emerald: '#059669',
  rose: '#dc2626',
  textSec: '#4b5a6e',
  textMut: '#8494a9',
};

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  background: '#fff', color: tk.ink, fontSize: 14,
  border: `1.5px solid ${tk.border}`, outline: 'none',
  fontFamily: "'DM Sans', sans-serif", transition: 'border .18s',
  boxSizing: 'border-box',
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
   STEPS
───────────────────────────────────────────── */
const steps = [
  { id: 0, name: 'Identité', icon: UserIcon },
  { id: 1, name: 'Adresse', icon: MapPinIcon },
  { id: 2, name: 'Professionnel', icon: BriefcaseIcon },
  { id: 3, name: 'Urgence', icon: ShieldExclamationIcon },
];

const stepFields = [
  ['firstName', 'lastName', 'email', 'phone', 'birthDate', 'ssn'],
  ['address.street', 'address.city', 'address.postalCode', 'address.country'],
  ['position', 'role', 'hireDate'],
  [],
];

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
const AddEmployee = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userAgencyId = user?.agency?._id || user?.agency || '';

  const { register, handleSubmit, watch, trigger, setValue, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '', lastName: '', email: '', phone: '',
      birthDate: '', ssn: '',
      address: { street: '', city: '', postalCode: '', country: 'FR' },
      position: '', department: '', role: 'agent',
      agency: userAgencyId, supervisor: '',
      hireDate: new Date().toISOString().split('T')[0],
      contractType: 'CDI', salary: '', status: 'actif',
      emergencyContact: { name: '', relationship: '', phone: '' },
    },
  });

  const [agencies, setAgencies] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const selectedAgency = watch('agency');

  useEffect(() => { fetchAgencies(); }, []);

  useEffect(() => {
    if (userAgencyId && !watch('agency')) {
      setValue('agency', userAgencyId);
    }
  }, [userAgencyId]);

  useEffect(() => {
    if (selectedAgency) fetchSupervisors(selectedAgency);
    else setSupervisors([]);
  }, [selectedAgency]);

  const fetchAgencies = async () => {
    try {
      const res = await axios.get('/agencies?status=actif');
      const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
      setAgencies(data);
    } catch { toast.error('Erreur lors du chargement des agences'); setAgencies([]); }
  };

  const fetchSupervisors = async (agencyId) => {
    try {
      const res = await axios.get(`/agencies/${agencyId}/supervisors`);
      const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
      setSupervisors(data);
    } catch { setSupervisors([]); }
  };

  const nextStep = async () => {
    const ok = await trigger(stepFields[currentStep]);
    if (ok) setCurrentStep(p => Math.min(p + 1, steps.length - 1));
  };
  const prevStep = () => setCurrentStep(p => Math.max(p - 1, 0));

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post('/employees', data);
      // Le serveur indique si l'e-mail d'activation est réellement parti (sinon : avertissement).
      if (res.data?.invitation === 'simulated' || res.data?.invitation === 'failed') toast.warning(res.data.message, { autoClose: 12000 });
      else toast.success(res.data?.message || 'Employé créé avec succès');
      navigate('/app/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── HERO ── */}
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
              GESTION DES EMPLOYÉS
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Ajouter un employé{' '}
            <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              à votre équipe
            </span>
          </h1>
          <p style={{ color: '#37312a', fontSize: 14, lineHeight: 1.7 }}>
            Remplissez les informations étape par étape pour intégrer un nouveau membre.
          </p>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ── FORM CARD ── */}
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
                  <div style={{ width: 80, height: 80, margin: '0 auto 16px', background: 'rgba(255,255,255,.1)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UserIcon style={{ width: 40, height: 40, color: 'rgba(255,255,255,.7)' }} />
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

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* ── STEP 0 : Identité ── */}
              {currentStep === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 6 }}>Informations personnelles</h2>
                    <p style={{ fontSize: 14, color: tk.textSec }}>Renseignez l'identité du nouvel employé.</p>
                  </div>

                  <SectionBlock icon={UserIcon} title="Identité">
                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <FieldLabel>Prénom *</FieldLabel>
                        <input type="text" placeholder="Jean"
                          {...register('firstName', { required: 'Le prénom est requis' })}
                          style={errors.firstName ? inputErrStyle : inputStyle} />
                        {errors.firstName && <p style={{ fontSize: 11, color: tk.rose, marginTop: 4 }}>{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <FieldLabel>Nom *</FieldLabel>
                        <input type="text" placeholder="Dupont"
                          {...register('lastName', { required: 'Le nom est requis' })}
                          style={errors.lastName ? inputErrStyle : inputStyle} />
                        {errors.lastName && <p style={{ fontSize: 11, color: tk.rose, marginTop: 4 }}>{errors.lastName.message}</p>}
                      </div>
                    </div>

                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <FieldLabel>Email *</FieldLabel>
                        <div style={{ position: 'relative' }}>
                          <EnvelopeIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
                          <input type="email" placeholder="jean@example.com"
                            {...register('email', {
                              required: "L'email est requis",
                              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' },
                            })}
                            style={{ ...(errors.email ? inputErrStyle : inputStyle), paddingLeft: 38 }} />
                        </div>
                        {errors.email && <p style={{ fontSize: 11, color: tk.rose, marginTop: 4 }}>{errors.email.message}</p>}
                      </div>
                      <div>
                        <FieldLabel>Téléphone</FieldLabel>
                        <div style={{ position: 'relative' }}>
                          <PhoneIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
                          <input type="tel" placeholder="+33 6 00 00 00 00"
                            {...register('phone')}
                            style={{ ...inputStyle, paddingLeft: 38 }} />
                        </div>
                      </div>
                    </div>

                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <FieldLabel>Date de naissance</FieldLabel>
                        <input type="date" {...register('birthDate')} style={inputStyle} />
                      </div>
                      <div>
                        <FieldLabel>N° Sécurité sociale</FieldLabel>
                        <input type="text" placeholder="1 85 06 75 …"
                          {...register('ssn')} style={inputStyle} />
                      </div>
                    </div>
                  </SectionBlock>
                </div>
              )}

              {/* ── STEP 1 : Adresse ── */}
              {currentStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 6 }}>Adresse</h2>
                    <p style={{ fontSize: 14, color: tk.textSec }}>Renseignez le domicile de l'employé.</p>
                  </div>

                  <SectionBlock icon={MapPinIcon} title="Localisation">
                    <div>
                      <FieldLabel>Rue / Adresse complète</FieldLabel>
                      <input type="text" placeholder="123 rue de la Paix"
                        {...register('address.street')} style={inputStyle} />
                    </div>
                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <FieldLabel>Ville</FieldLabel>
                        <input type="text" placeholder="Paris"
                          {...register('address.city')} style={inputStyle} />
                      </div>
                      <div>
                        <FieldLabel>Code postal</FieldLabel>
                        <input type="text" placeholder="75001"
                          {...register('address.postalCode')} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Pays</FieldLabel>
                      <select {...register('address.country')} style={inputStyle}>
                        <option value="FR">France</option>
                        <option value="BE">Belgique</option>
                        <option value="CH">Suisse</option>
                        <option value="LU">Luxembourg</option>
                        <option value="CA">Canada</option>
                      </select>
                    </div>
                  </SectionBlock>
                </div>
              )}

              {/* ── STEP 2 : Professionnel ── */}
              {currentStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 6 }}>Informations professionnelles</h2>
                    <p style={{ fontSize: 14, color: tk.textSec }}>Poste, contrat et affectation dans l'organisation.</p>
                  </div>

                  <SectionBlock icon={BriefcaseIcon} title="Poste & Contrat">
                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <FieldLabel>Poste *</FieldLabel>
                        <input type="text" placeholder="Ex : Agent logistique"
                          {...register('position', { required: 'Le poste est requis' })}
                          style={errors.position ? inputErrStyle : inputStyle} />
                        {errors.position && <p style={{ fontSize: 11, color: tk.rose, marginTop: 4 }}>{errors.position.message}</p>}
                      </div>
                      <div>
                        <FieldLabel>Département</FieldLabel>
                        <select {...register('department')} style={inputStyle}>
                          <option value="">Sélectionner...</option>
                         <option value="logistique">Logistique / Opérations</option>
                          <option value="administration">Administration</option>
                          <option value="commercial">Commercial</option>
                          <option value="livraison">Livraison</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <FieldLabel>Rôle *</FieldLabel>
                        <select {...register('role', { required: 'Le rôle est requis' })} style={inputStyle}>
                          <option value="agent">Agent</option>
                          <option value="driver">Chauffeur</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Administrateur</option>
                        </select>
                      </div>
                      <div>
                        <FieldLabel>Type de contrat</FieldLabel>
                        <select {...register('contractType')} style={inputStyle}>
                          <option value="CDI">CDI</option>
                          <option value="CDD">CDD</option>
                          <option value="Stage">Stage</option>
                          <option value="Alternance">Alternance</option>
                          <option value="Freelance">Freelance</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <FieldLabel>Date d'embauche *</FieldLabel>
                        <input type="date"
                          {...register('hireDate', { required: "La date d'embauche est requise" })}
                          style={errors.hireDate ? inputErrStyle : inputStyle} />
                        {errors.hireDate && <p style={{ fontSize: 11, color: tk.rose, marginTop: 4 }}>{errors.hireDate.message}</p>}
                      </div>
                      <div>
                        <FieldLabel>Salaire annuel (devise du pays de l'agence)</FieldLabel>
                        <input type="number" placeholder="35000"
                          {...register('salary')} style={inputStyle} />
                      </div>
                    </div>

                    <div>
                      <FieldLabel>Statut</FieldLabel>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                        {[
                          { value: 'actif', label: 'Actif', color: tk.emerald },
                          { value: 'inactif', label: 'Inactif', color: tk.rose },
                         { value: 'conge', label: 'En conge', color: '#d97706' },
                        ].map(opt => (
                          <label key={opt.value} style={{
                            cursor: 'pointer', borderRadius: 12, padding: '12px 10px', textAlign: 'center',
                            border: `2px solid ${tk.border}`, background: '#fff',
                            fontSize: 12, fontWeight: 600, color: tk.textSec, transition: 'all .2s', display: 'block',
                          }}>
                            <input type="radio" value={opt.value} {...register('status')} style={{ display: 'none' }} />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </SectionBlock>

                  <SectionBlock icon={UserPlusIcon} iconColor={tk.emerald} title="Affectation">
                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <FieldLabel>Agence</FieldLabel>
                        <select
                          {...register('agency')}
                          style={{ ...inputStyle, ...(userAgencyId && user?.role === 'manager' ? { background: '#faf8f5', color: '#4b5a6e' } : {}) }}
                          disabled={!!(userAgencyId && user?.role === 'manager')}
                        >
                          <option value="">Sélectionner...</option>
                          {agencies.map(a => (
                            <option key={a._id} value={a._id}>{a.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <FieldLabel>Superviseur</FieldLabel>
                        <select {...register('supervisor')} style={inputStyle} disabled={!selectedAgency}>
                          <option value="">Sélectionner...</option>
                          {supervisors.map(s => (
                            <option key={s._id} value={s._id}>{s.firstName} {s.lastName}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </SectionBlock>
                </div>
              )}

              {/* ── STEP 3 : Contact d'urgence ── */}
              {currentStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 6 }}>Contact d'urgence</h2>
                    <p style={{ fontSize: 14, color: tk.textSec }}>Personne à contacter en cas d'urgence.</p>
                  </div>

                  <SectionBlock icon={ShieldExclamationIcon} iconColor={tk.rose} title="Contact d'urgence">
                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <FieldLabel>Nom complet</FieldLabel>
                        <input type="text" placeholder="Marie Dupont"
                          {...register('emergencyContact.name')} style={inputStyle} />
                      </div>
                      <div>
                        <FieldLabel>Lien de parenté</FieldLabel>
                        <input type="text" placeholder="Conjoint(e), Parent…"
                          {...register('emergencyContact.relationship')} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Téléphone</FieldLabel>
                      <div style={{ position: 'relative' }}>
                        <PhoneIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: tk.textMut }} />
                        <input type="tel" placeholder="+33 6 00 00 00 00"
                          {...register('emergencyContact.phone')}
                          style={{ ...inputStyle, paddingLeft: 38 }} />
                      </div>
                    </div>
                  </SectionBlock>
                </div>
              )}

              {/* ── Navigation ── */}
              <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 36, paddingTop: 24, borderTop: `1px solid ${tk.border}` }}>
                <button type="button" onClick={currentStep === 0 ? () => navigate('/app/employees') : prevStep} style={{
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
                      ? <><span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin .8s linear infinite', display: 'inline-block' }} /> Création...</>
                      : <><UserPlusIcon style={{ width: 15, height: 15 }} /> Créer l'employé</>
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

export default AddEmployee;