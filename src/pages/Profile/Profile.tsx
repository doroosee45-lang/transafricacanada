import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  CameraIcon,
  PencilIcon,
  CheckIcon,
  ShieldCheckIcon,
  CalendarDaysIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import type { User } from '../../types/models';
import type { IconComponent } from '../../types/ui';

/** Champs modifiables du profil. */
interface ProfileFormValues {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

/* ─────────────────────────────────────────────
   DESIGN TOKENS — identiques à ClientsList
───────────────────────────────────────────── */
const tk = {
  ink:        '#172F50',
  ink80:      '#172F50',
  surface:    '#F7FAFE',
  surf2:      '#EDF5FC',
  border:     '#DCE9F5',
  accent:     '#4D91D9',
  accentDark: '#347FC5',
  emerald:    '#059669',
  amber:      '#d97706',
  rose:       '#dc2626',
  purple:     '#7c3aed',
  orange:     '#ea580c',
  textSec:    '#52677D',
  textMut:    '#8295A8',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  background: '#fff', color: tk.ink, fontSize: 14,
  border: `1.5px solid ${tk.border}`, outline: 'none',
  fontFamily: "'DM Sans', sans-serif", transition: 'border .18s',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
};

/* ── helpers ─────────────────────────────────────────────────────── */
const roleBadgeMap: Record<string, { label: string; color: string; bg: string; border: string }> = {
  superadmin: { label: 'Super Admin', color: tk.purple, bg: `${tk.purple}10`, border: `${tk.purple}30` },
  admin:      { label: 'Administrateur', color: tk.accent, bg: `${tk.accent}10`, border: `${tk.accent}30` },
  manager:    { label: 'Manager',  color: tk.amber, bg: `${tk.amber}10`, border: `${tk.amber}30` },
  agent:      { label: 'Agent',    color: tk.emerald, bg: `${tk.emerald}10`, border: `${tk.emerald}30` },
  client:     { label: 'Client',   color: tk.textMut, bg: `${tk.textMut}10`, border: `${tk.textMut}30` },
};

const fmt = (date?: string) =>
  date ? new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

const fmtTime = (date?: string) =>
  date ? new Date(date).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

/* ── Field (read mode) ───────────────────────────────────────────── */
const Field = ({ label, value, icon: Icon }: { label: string; value?: React.ReactNode; icon: IconComponent }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '12px 0', borderBottom: `1px solid ${tk.border}`,
  }}>
    {Icon && <Icon style={{ width: 16, height: 16, color: tk.textMut, flexShrink: 0 }} />}
    <div style={{ flex: 1 }}>
      <span style={{ fontSize: 11, fontWeight: 500, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <p style={{ fontSize: 14, color: tk.ink, marginTop: 2, fontWeight: 500 }}>
        {value || '—'}
      </p>
    </div>
  </div>
);

/* ── Component ───────────────────────────────────────────────────── */
const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/profile');
      setUser(response.data);
      reset(response.data);
    } catch {
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = (e.target.files as FileList)[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
    setUploading(true);
    try {
      const response = await axios.post('/profile/avatar', formData);
      setUser(prev => ({ ...prev, avatar: response.data.data?.avatar }) as User);
      toast.success('Photo de profil mise à jour');
    } catch {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await axios.put('/profile', data);
      setUser(prev => ({ ...prev, ...data }) as User);
      setEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const badge = roleBadgeMap[user?.role ?? ''] ?? { label: user?.role || 'Utilisateur', color: tk.textMut, bg: `${tk.textMut}10`, border: `${tk.textMut}30` };
  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : '?';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: tk.surface }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
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

      {/* ─────────────── HERO ─────────────── */}
      <section className="easy-internal-header" style={{
        position: 'relative', height: 200,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Fond decoratif retire : en-tete interne neutre. */}

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#172F50', padding: '0 24px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
            padding: '6px 16px', marginBottom: 12,
          }}>
            <SparklesIcon style={{ width: 13, height: 13, color: '#C5DCEF' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans',Arial,sans-serif" }}>
              MON PROFIL
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(24px,3.5vw,32px)', fontWeight: 800, lineHeight: 1.2, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            {user?.firstName} {user?.lastName}
          </h1>
          <p style={{ color: '#172F50', fontSize: 13, marginTop: 8 }}>
            Gérez vos informations personnelles et les paramètres de votre compte
          </p>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─────────────── CONTENU ─────────────── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px 48px' }}>

        {/* Carte principale */}
        <div style={{
          background: '#fff', borderRadius: 24,
          border: `1.5px solid ${tk.border}`,
          boxShadow: '0 2px 8px rgba(23,47,80,.05)',
          overflow: 'hidden',
        }}>

          {/* En-tête avec avatar */}
          <div style={{
            padding: '24px 28px',
            background: tk.surface,
            borderBottom: `1px solid ${tk.border}`,
            display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap',
          }}>
            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 88, height: 88, borderRadius: '50%',
                border: `3px solid #fff`, boxShadow: `0 0 0 2px ${tk.accent}30`,
                overflow: 'hidden',
              }}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    width: '100%', height: '100%',
                    background: `linear-gradient(135deg, ${tk.accent}, ${tk.accentDark})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, fontWeight: 700, color: '#fff',
                  }}>
                    {initials}
                  </div>
                )}
              </div>
              <label style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 28, height: 28, borderRadius: '50%',
                background: '#fff', border: `2px solid ${tk.surface}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: `0 2px 6px rgba(0,0,0,.1)`,
              }}>
                {uploading ? (
                  <div style={{ width: 12, height: 12, border: `2px solid ${tk.accent}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                ) : (
                  <CameraIcon style={{ width: 14, height: 14, color: tk.accent }} />
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
              </label>
            </div>

            {/* Infos utilisateur */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: tk.ink }}>
                  {user?.firstName} {user?.lastName}
                </h2>
                <span style={{
                  padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                  background: badge.bg, color: badge.color, border: `1px solid ${badge.border}`,
                }}>
                  {badge.label}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: tk.textSec, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <EnvelopeIcon style={{ width: 14, height: 14 }} />
                  {user?.email}
                </span>
                {user?.phone && (
                  <span style={{ fontSize: 13, color: tk.textSec, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <PhoneIcon style={{ width: 14, height: 14 }} />
                    {user?.phone}
                  </span>
                )}
              </div>
            </div>

            {/* Bouton modifier */}
            <button
              onClick={() => { setEditing(!editing); reset(user ?? undefined); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '8px 20px', borderRadius: 10,
                background: editing ? tk.surface : tk.accent,
                color: editing ? tk.textSec : '#fff',
                border: editing ? `1.5px solid ${tk.border}` : 'none',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all .15s',
              }}
            >
              <PencilIcon style={{ width: 14, height: 14 }} />
              {editing ? 'Annuler' : 'Modifier'}
            </button>
          </div>

          {/* Corps du formulaire */}
          <div style={{ padding: '28px' }}>

            {/* Informations personnelles */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{
                fontSize: 13, fontWeight: 600, color: tk.textMut,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <UserIcon style={{ width: 14, height: 14 }} />
                Informations personnelles
              </h3>

              {editing ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                        Prénom <span style={{ color: tk.rose }}>*</span>
                      </label>
                      <input
                        className="pf-input"
                        style={{ ...inputStyle, borderColor: errors.firstName ? tk.rose : tk.border }}
                        {...register('firstName', { required: 'Le prénom est requis' })}
                      />
                      {errors.firstName && <p style={{ marginTop: 4, fontSize: 11, color: tk.rose }}>{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                        Nom <span style={{ color: tk.rose }}>*</span>
                      </label>
                      <input
                        style={{ ...inputStyle, borderColor: errors.lastName ? tk.rose : tk.border }}
                        {...register('lastName', { required: 'Le nom est requis' })}
                      />
                      {errors.lastName && <p style={{ marginTop: 4, fontSize: 11, color: tk.rose }}>{errors.lastName.message}</p>}
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                        Email <span style={{ color: tk.rose }}>*</span>
                      </label>
                      <input
                        type="email"
                        style={{ ...inputStyle, borderColor: errors.email ? tk.rose : tk.border }}
                        {...register('email', {
                          required: "L'email est requis",
                          pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email invalide' },
                        })}
                      />
                      {errors.email && <p style={{ marginTop: 4, fontSize: 11, color: tk.rose }}>{errors.email.message}</p>}
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                        Téléphone
                      </label>
                      <input type="tel" style={inputStyle} {...register('phone')} />
                    </div>
                    <div className="md:col-span-2">
                      <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                        Adresse
                      </label>
                      <input style={inputStyle} {...register('address')} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                        Ville
                      </label>
                      <input style={inputStyle} {...register('city')} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                        Code postal
                      </label>
                      <input style={inputStyle} {...register('postalCode')} />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6, display: 'block' }}>
                        Pays
                      </label>
                      <select style={selectStyle} {...register('country')}>
                        <option value="CA">Canada</option>
                        <option value="CD">RDC</option>
                        <option value="CG">Congo-Brazzaville</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28, paddingTop: 16, borderTop: `1px solid ${tk.border}` }}>
                    <button
                      type="button"
                      onClick={() => { setEditing(false); reset(user ?? undefined); }}
                      style={{
                        padding: '10px 24px', borderRadius: 10,
                        border: `1.5px solid ${tk.border}`, background: '#fff',
                        fontSize: 13, fontWeight: 500, color: tk.textSec,
                        cursor: 'pointer', transition: 'all .15s',
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '10px 24px', borderRadius: 10,
                        background: '#347FC5', color: '#fff', border: 'none',
                        fontSize: 13, fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.6 : 1,
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <div style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <CheckIcon style={{ width: 14, height: 14 }} />
                          Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Field label="Prénom" value={user?.firstName} icon={UserIcon} />
                  <Field label="Nom" value={user?.lastName} icon={UserIcon} />
                  <Field label="Email" value={user?.email} icon={EnvelopeIcon} />
                  <Field label="Téléphone" value={user?.phone} icon={PhoneIcon} />
                  <Field 
                    label="Adresse complète" 
                    value={[user?.address, user?.city, user?.postalCode, user?.country].filter(Boolean).join(', ') || null} 
                    icon={MapPinIcon} 
                  />
                </div>
              )}
            </div>

            {/* Informations du compte */}
            <div>
              <h3 style={{
                fontSize: 13, fontWeight: 600, color: tk.textMut,
                textTransform: 'uppercase', letterSpacing: '0.05em',
                marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <ShieldCheckIcon style={{ width: 14, height: 14 }} />
                Informations du compte
              </h3>

              <div className="grid-kpi-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <div style={{
                  background: tk.surface, borderRadius: 12, padding: 16,
                  border: `1px solid ${tk.border}`,
                }}>
                  <ShieldCheckIcon style={{ width: 18, height: 18, color: tk.accent, marginBottom: 10 }} />
                  <div style={{ fontSize: 11, color: tk.textMut, marginBottom: 4 }}>Rôle</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: badge.color }}>{badge.label}</div>
                </div>
                <div style={{
                  background: tk.surface, borderRadius: 12, padding: 16,
                  border: `1px solid ${tk.border}`,
                }}>
                  <CalendarDaysIcon style={{ width: 18, height: 18, color: tk.accent, marginBottom: 10 }} />
                  <div style={{ fontSize: 11, color: tk.textMut, marginBottom: 4 }}>Membre depuis</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: tk.ink }}>{fmt(user?.createdAt)}</div>
                </div>
                <div style={{
                  background: tk.surface, borderRadius: 12, padding: 16,
                  border: `1px solid ${tk.border}`,
                }}>
                  <ClockIcon style={{ width: 18, height: 18, color: tk.accent, marginBottom: 10 }} />
                  <div style={{ fontSize: 11, color: tk.textMut, marginBottom: 4 }}>Dernière connexion</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: tk.ink }}>{fmtTime(user?.lastLogin)}</div>
                </div>
              </div>
            </div>
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

export default Profile;