import React from 'react';
import { useForm } from 'react-hook-form';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { MARKET_OPTIONS, countryOf } from '../../config/currencies';

/* ─────────────────────────────────────────────
   DESIGN TOKENS — identiques à ClientsList
───────────────────────────────────────────── */
const tk = {
  ink:        '#171614',
  ink80:      '#26231e',
  surface:    '#faf8f5',
  surf2:      '#f5efe6',
  border:     '#e9e1d5',
  accent:     '#a77b28',
  accentDark: '#8a6520',
  emerald:    '#059669',
  amber:      '#d97706',
  rose:       '#dc2626',
  purple:     '#7c3aed',
  textSec:    '#4b5a6e',
  textMut:    '#8494a9',
};

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  background: '#fff', color: tk.ink, fontSize: 14,
  border: `1.5px solid ${tk.border}`, outline: 'none',
  fontFamily: "'DM Sans', sans-serif", transition: 'border .18s',
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
};

const labelStyle = {
  display: 'flex', alignItems: 'center', gap: 6,
  fontSize: 13, fontWeight: 500, color: tk.textSec,
  marginBottom: 6,
};

const ClientForm = ({ initialData, onSubmit, onCancel }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      company: '',
      taxId: '',
    },
  });

  const isEditing = !!initialData;

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Prénom */}
        <div>
          <label style={labelStyle}>
            <UserIcon style={{ width: 14, height: 14, color: tk.textMut }} />
            Prénom <span style={{ color: tk.rose }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Jean"
            {...register('firstName', { required: 'Le prénom est requis' })}
            style={{ ...inputStyle, borderColor: errors.firstName ? tk.rose : tk.border }}
          />
          {errors.firstName && (
            <p style={{ marginTop: 4, fontSize: 11, color: tk.rose }}>{errors.firstName.message}</p>
          )}
        </div>

        {/* Nom */}
        <div>
          <label style={labelStyle}>
            <UserIcon style={{ width: 14, height: 14, color: tk.textMut }} />
            Nom <span style={{ color: tk.rose }}>*</span>
          </label>
          <input
            type="text"
            placeholder="Dupont"
            {...register('lastName', { required: 'Le nom est requis' })}
            style={{ ...inputStyle, borderColor: errors.lastName ? tk.rose : tk.border }}
          />
          {errors.lastName && (
            <p style={{ marginTop: 4, fontSize: 11, color: tk.rose }}>{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label style={labelStyle}>
            <EnvelopeIcon style={{ width: 14, height: 14, color: tk.textMut }} />
            Email <span style={{ color: tk.rose }}>*</span>
          </label>
          <input
            type="email"
            placeholder="jean.dupont@exemple.com"
            {...register('email', {
              required: 'L\'email est requis',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email invalide',
              },
            })}
            style={{ ...inputStyle, borderColor: errors.email ? tk.rose : tk.border }}
          />
          {errors.email && (
            <p style={{ marginTop: 4, fontSize: 11, color: tk.rose }}>{errors.email.message}</p>
          )}
        </div>

        {/* Téléphone */}
        <div>
          <label style={labelStyle}>
            <PhoneIcon style={{ width: 14, height: 14, color: tk.textMut }} />
            Téléphone
          </label>
          <input
            type="tel"
            placeholder="+33 6 12 34 56 78"
            {...register('phone')}
            style={inputStyle}
          />
        </div>

        {/* Adresse */}
        <div style={{ gridColumn: 'span 2' }}>
          <label style={labelStyle}>
            <MapPinIcon style={{ width: 14, height: 14, color: tk.textMut }} />
            Adresse
          </label>
          <input
            type="text"
            placeholder="123 rue de la Paix"
            {...register('address')}
            style={inputStyle}
          />
        </div>

        {/* Ville */}
        <div>
          <label style={labelStyle}>
            <MapPinIcon style={{ width: 14, height: 14, color: tk.textMut }} />
            Ville
          </label>
          <input
            type="text"
            placeholder="Paris"
            {...register('city')}
            style={inputStyle}
          />
        </div>

        {/* Pays */}
        <div>
          <label style={labelStyle}>
            <GlobeAltIcon style={{ width: 14, height: 14, color: tk.textMut }} />
            Pays
          </label>
          <select {...register('country')} style={selectStyle}>
            <option value="">Sélectionner un pays</option>
            {/* Règle métier : 4 pays autorisés. Une fiche HISTORIQUE garde son pays (données préservées). */}
            {MARKET_OPTIONS.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
            {initialData?.country && !MARKET_OPTIONS.some(c => c.value === initialData.country) && (
              <option value={initialData.country}>{countryOf(initialData.country)?.name || initialData.country} (historique)</option>
            )}
          </select>
        </div>

        {/* Entreprise */}
        <div>
          <label style={labelStyle}>
            <BuildingOfficeIcon style={{ width: 14, height: 14, color: tk.textMut }} />
            Entreprise
          </label>
          <input
            type="text"
            placeholder="Société XYZ"
            {...register('company')}
            style={inputStyle}
          />
        </div>

        {/* N° TVA */}
        <div>
          <label style={labelStyle}>
            <IdentificationIcon style={{ width: 14, height: 14, color: tk.textMut }} />
            N° TVA
          </label>
          <input
            type="text"
            placeholder="FR12345678901"
            {...register('taxId')}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Boutons d'action */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '10px 24px', borderRadius: 10,
            border: `1.5px solid ${tk.border}`, background: '#fff',
            fontSize: 13, fontWeight: 500, color: tk.textSec,
            cursor: 'pointer', transition: 'all .15s',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = tk.surface; e.currentTarget.style.borderColor = tk.accent; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = tk.border; }}
        >
          <XMarkIcon style={{ width: 14, height: 14 }} />
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '10px 24px', borderRadius: 10,
            background: tk.accent, color: '#fff', border: 'none',
            fontSize: 13, fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.6 : 1, transition: 'all .15s',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}
        >
          {isSubmitting ? (
            <>
              <div style={{ width: 14, height: 14, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
              Enregistrement...
            </>
          ) : (
            <>
              <CheckCircleIcon style={{ width: 14, height: 14 }} />
              {isEditing ? 'Mettre à jour' : 'Créer le client'}
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </form>
  );
};

export default ClientForm;