import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  BellIcon,
  LockClosedIcon,
  GlobeAltIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  ServerIcon,
  LanguageIcon,
  ClockIcon,
  CurrencyDollarIcon,
  EyeIcon,
  CheckCircleIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from '../../api/axios';
import { COUNTRIES, CURRENCIES } from '../../config/currencies';
import { validatePassword } from '../../utils/passwordPolicy';

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const tk = {
  ink:          '#0a0c10',
  ink80:        '#1a1f2e',
  surface:      '#f8fafc',
  surfaceHover: '#f1f5f9',
  border:       '#e2e8f0',
  accent:       '#c7983a',
  accentDark:   '#a77b28',
  accentLight:  '#fff8ee',
  emerald:      '#10b981',
  amber:        '#f59e0b',
  rose:         '#ef4444',
  text:         '#1e293b',
  textLight:    '#64748b',
  textMuted:    '#94a3b8',
};

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  background: '#fff', color: tk.text, fontSize: 14,
  border: `1.5px solid ${tk.border}`, outline: 'none',
  fontFamily: "'Inter', system-ui, sans-serif", transition: 'all 0.15s ease',
  boxSizing: 'border-box',
};

const cardStyle = {
  background: '#fff', borderRadius: 20,
  border: `1px solid ${tk.border}`,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden',
};

const cardHeaderStyle = {
  padding: '18px 24px', background: tk.surface,
  borderBottom: `1px solid ${tk.border}`,
};

/* ── Toggle switch ── */
const Toggle = ({ name, defaultChecked, register: reg }) => (
  <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}>
    <input
      type="checkbox"
      {...reg(name)}
      defaultChecked={defaultChecked}
      style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
      className="peer"
    />
    <div
      className="peer-checked:bg-blue-500"
      style={{
        width: 44, height: 24, borderRadius: 99,
        background: tk.border, position: 'relative', transition: 'background .2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: 3,
        width: 18, height: 18, borderRadius: '50%',
        background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
        transition: 'transform .2s',
      }} className="peer-checked:translate-x-5" />
    </div>
  </label>
);

/* ── Row de notification (toggle + label) ── */
const NotifRow = ({ title, desc, name, defaultChecked, reg }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 0', borderBottom: `1px solid ${tk.border}`, gap: 16,
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: 14, fontWeight: 500, color: tk.text, marginBottom: 2 }}>{title}</p>
      <p style={{ fontSize: 12, color: tk.textLight }}>{desc}</p>
    </div>
    <Toggle name={name} defaultChecked={defaultChecked} register={reg} />
  </div>
);

/* ── Section card header ── */
const SectionHeader = ({ icon: Icon, title, desc, color = tk.accent }) => (
  <div style={cardHeaderStyle}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: `${color}12`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon style={{ width: 20, height: 20, color }} />
      </div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: tk.text, letterSpacing: '-.01em' }}>{title}</h3>
        <p style={{ fontSize: 12, color: tk.textLight, marginTop: 2 }}>{desc}</p>
      </div>
    </div>
  </div>
);

/* ── Field label ── */
const FieldLabel = ({ icon: Icon, children }) => (
  <label style={{ fontSize: 13, fontWeight: 500, color: tk.text, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
    {Icon && <Icon style={{ width: 13, height: 13, color: tk.textMuted }} />}
    {children}
  </label>
);

/* ═══════════════════════════════
   MAIN COMPONENT
═══════════════════════════════ */
const Settings = () => {
  const [activeTab, setActiveTab]   = useState('general');
  const [settings, setSettings]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [themeColor, setThemeColor] = useState('#c7983a');

  const { register, handleSubmit, reset, watch, formState: { isSubmitting } } = useForm();
  const savedTimezone = watch('timezone');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('/settings');
      // L'API renvoie { success, data } : les réglages sont dans `data` (avant : l'enveloppe
      // entière était chargée dans le formulaire, qui ne retrouvait jamais les valeurs enregistrées).
      const saved = response.data?.data ?? {};
      setSettings(saved);
      reset({ ...saved, currentPassword: '', newPassword: '', confirmPassword: '' });
      if (saved.themeColor) setThemeColor(saved.themeColor);
    } catch {
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    const { currentPassword, newPassword, confirmPassword, ...prefs } = data;

    // Changement de mot de passe : traité par l'API d'authentification (avant : envoyé à
    // /settings, qui l'ignorait, avec un message de succès — le mot de passe ne changeait pas).
    if (currentPassword || newPassword || confirmPassword) {
      const problem =
        (!currentPassword && 'Saisissez votre mot de passe actuel.') ||
        validatePassword(newPassword) ||
        (newPassword !== confirmPassword && 'La confirmation ne correspond pas au nouveau mot de passe.');
      if (problem) { toast.error(problem); return; }
      try {
        const res = await axios.put('/auth/change-password', { currentPassword, newPassword });
        // Les autres sessions sont révoquées par le serveur ; celle-ci continue avec le nouveau jeton.
        if (res.data?.token) localStorage.setItem('token', res.data.token);
        toast.success('Mot de passe modifié. Vos autres sessions ont été fermées.');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Le mot de passe n\'a pas pu être modifié.');
        return; // rien d'autre n'est enregistré : pas de succès partiel trompeur
      }
    }

    try {
      await axios.put('/settings', { ...prefs, themeColor });
      toast.success('Paramètres mis à jour avec succès');
      fetchSettings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const tabs = [
    { id: 'general',       name: 'Général',       icon: GlobeAltIcon,   desc: 'Langue & devise' },
    { id: 'notifications', name: 'Notifications',  icon: BellIcon,       desc: 'Alertes & emails' },
    { id: 'security',      name: 'Sécurité',       icon: LockClosedIcon, desc: 'Mot de passe & 2FA' },
    { id: 'appearance',    name: 'Apparence',       icon: PaintBrushIcon, desc: 'Thème & couleurs' },
    { id: 'integrations',  name: 'Intégrations',   icon: ServerIcon,     desc: 'API & services' },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', background: tk.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${tk.border}`, borderTopColor: tk.accent, animation: 'spin .8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: tk.surface }}>
      <div className="page-content" style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px 56px' }}>

        {/* ── Page header ── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            fontSize: 26, fontWeight: 800, color: tk.ink,
            fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: '-.02em', marginBottom: 6,
          }}>
            Paramètres
          </h1>
          <p style={{ fontSize: 14, color: tk.textLight }}>
            Gérez vos préférences et personnalisez votre expérience
          </p>
        </div>

        {/* ── Layout : sidebar + contenu ── */}
        <div className="settings-layout" style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>

          {/* ── Sidebar Navigation ── */}
          <div className="settings-sidebar" style={{ width: 260, flexShrink: 0 }}>
            <div className="settings-sidebar-card" style={{ ...cardStyle, position: 'sticky', top: 20 }}>
              <nav className="settings-nav" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {tabs.map((tab) => {
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      className="settings-nav-btn"
                      onClick={() => setActiveTab(tab.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '11px 14px', borderRadius: 12,
                        textAlign: 'left', border: 'none', cursor: 'pointer',
                        background: active ? tk.accentLight : 'transparent',
                        transition: 'all .15s',
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = tk.surfaceHover; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{
                        width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                        background: active ? `${tk.accent}18` : tk.surface,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all .15s',
                      }}>
                        <tab.icon style={{ width: 16, height: 16, color: active ? tk.accent : tk.textLight }} />
                      </div>
                      <div className="settings-nav-desc" style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: active ? 600 : 500, color: active ? tk.accent : tk.text }}>
                          {tab.name}
                        </div>
                        <div style={{ fontSize: 11, color: tk.textMuted, marginTop: 1 }}>
                          {tab.desc}
                        </div>
                      </div>
                      {/* Mobile : juste le nom */}
                      <div className="settings-nav-name-mobile" style={{ display: 'none', fontSize: 12, fontWeight: active ? 600 : 500, color: active ? tk.accent : tk.text }}>
                        {tab.name}
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* ── Contenu principal ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <form onSubmit={handleSubmit(onSubmit)}>

              {/* ──────── GÉNÉRAL ──────── */}
              {activeTab === 'general' && (
                <div style={cardStyle}>
                  <SectionHeader icon={GlobeAltIcon} title="Paramètres généraux" desc="Configurez la langue, la devise et les préférences régionales" />
                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                      <div>
                        <FieldLabel icon={LanguageIcon}>Langue</FieldLabel>
                        <select {...register('language')} style={inputStyle}>
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="de">Deutsch</option>
                        </select>
                      </div>
                      <div>
                        <FieldLabel icon={ClockIcon}>Fuseau horaire</FieldLabel>
                        {/* Fuseaux des pays configurés (Tunis, Kinshasa, Lubumbashi, Dubaï, Paris…), regroupés par pays.
                            Une valeur déjà enregistrée hors liste reste affichée pour ne pas être perdue. */}
                        <select {...register('timezone')} style={inputStyle}>
                          {COUNTRIES.filter(c => c.market).concat(COUNTRIES.filter(c => !c.market)).map(c => (
                            <optgroup key={c.key} label={c.name}>
                              {c.timezones.map(tz => <option key={`${c.key}-${tz}`} value={tz}>{tz}</option>)}
                            </optgroup>
                          ))}
                          {savedTimezone && !COUNTRIES.some(c => c.timezones.includes(savedTimezone)) && <option value={savedTimezone}>{savedTimezone}</option>}
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                      <div>
                        <FieldLabel>Format de date</FieldLabel>
                        <select {...register('dateFormat')} style={inputStyle}>
                          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                        </select>
                      </div>
                      <div>
                        <FieldLabel icon={CurrencyDollarIcon}>Devise d'affichage préférée</FieldLabel>
                        {/* Préférence d'affichage uniquement : chaque opération garde SA devise (aucune conversion). */}
                        <select {...register('currency')} style={inputStyle}>
                          <option value="">Devise de chaque opération</option>
                          {CURRENCIES.filter(c => !c.legacyOnly).map(c => <option key={c.code} value={c.code}>{c.name} ({c.code})</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Infos société */}
                    <div style={{ paddingTop: 4, borderTop: `1px solid ${tk.border}` }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: tk.text, marginBottom: 14, marginTop: 16 }}>Informations de l'entreprise</p>
                      <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                        <div>
                          <FieldLabel>Nom de la société</FieldLabel>
                          <input type="text" {...register('companyName')} style={inputStyle} placeholder="EASY" />
                        </div>
                        <div>
                          <FieldLabel>Email de contact</FieldLabel>
                          <input type="email" {...register('contactEmail')} style={inputStyle} placeholder="contact@canadatrans.com" />
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Adresse</FieldLabel>
                        <input type="text" {...register('address')} style={inputStyle} placeholder="123 rue de la Logistique, Kinshasa" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────── NOTIFICATIONS ──────── */}
              {activeTab === 'notifications' && (
                <div style={cardStyle}>
                  <SectionHeader icon={BellIcon} title="Notifications" desc="Gérez comment vous souhaitez être notifié" />
                  <div style={{ padding: 24 }}>

                    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: tk.textMuted, marginBottom: 12 }}>Canaux</p>

                    <NotifRow
                      title="Notifications email" desc="Recevez les alertes et résumés par email"
                      name="emailNotifications" defaultChecked={settings?.emailNotifications} reg={register}
                    />
                    <NotifRow
                      title="Notifications SMS" desc="Alertes instantanées par SMS"
                      name="smsNotifications" defaultChecked={settings?.smsNotifications} reg={register}
                    />
                    <NotifRow
                      title="Notifications push" desc="Alertes dans le navigateur ou l'application"
                      name="pushNotifications" defaultChecked={settings?.pushNotifications} reg={register}
                    />

                    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: tk.textMuted, marginBottom: 12, marginTop: 24 }}>Événements à notifier</p>

                    {[
                      { name: 'notifyNewPackage',   label: 'Nouveau colis créé' },
                      { name: 'notifyStatusUpdate', label: 'Mise à jour de statut colis' },
                      { name: 'notifyPayment',      label: 'Paiement reçu ou en attente' },
                      { name: 'notifyNewClient',    label: 'Nouveau client inscrit' },
                    ].map(({ name, label }) => (
                      <label key={name} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                        marginBottom: 6, transition: 'background .12s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = tk.surfaceHover; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <input type="checkbox" {...register(name)}
                          style={{ width: 16, height: 16, accentColor: tk.accent, cursor: 'pointer' }} />
                        <span style={{ fontSize: 13, color: tk.text }}>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ──────── SÉCURITÉ ──────── */}
              {activeTab === 'security' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Mot de passe */}
                  <div style={cardStyle}>
                    <SectionHeader icon={LockClosedIcon} title="Changer le mot de passe" desc="Mettez à jour votre mot de passe régulièrement" color={tk.rose} />
                    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div>
                        <FieldLabel icon={KeyIcon}>Mot de passe actuel</FieldLabel>
                        <input type="password" {...register('currentPassword')} style={inputStyle} placeholder="••••••••" />
                      </div>
                      <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                        <div>
                          <FieldLabel>Nouveau mot de passe</FieldLabel>
                          <input type="password" {...register('newPassword')} style={inputStyle} placeholder="••••••••" />
                        </div>
                        <div>
                          <FieldLabel>Confirmer le mot de passe</FieldLabel>
                          <input type="password" {...register('confirmPassword')} style={inputStyle} placeholder="••••••••" />
                        </div>
                      </div>
                      <div style={{
                        padding: '12px 16px', borderRadius: 10, background: 'rgba(16,185,129,.06)',
                        border: '1px solid rgba(16,185,129,.2)', display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <CheckCircleIcon style={{ width: 16, height: 16, color: tk.emerald, flexShrink: 0 }} />
                        <p style={{ fontSize: 12, color: '#065f46' }}>Utilisez au moins 8 caractères, une majuscule et un chiffre.</p>
                      </div>
                    </div>
                  </div>

                  {/* 2FA */}
                  <div style={cardStyle}>
                    <SectionHeader icon={ShieldCheckIcon} title="Authentification à deux facteurs" desc="Couche de protection supplémentaire pour votre compte" color={tk.accent} />
                    <div style={{ padding: 24 }}>
                      <div className="settings-security-2fa" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 14, color: tk.text, marginBottom: 4 }}>
                            Sécurisez votre connexion avec un code temporaire envoyé sur votre téléphone à chaque connexion.
                          </p>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99,
                            background: 'rgba(245,158,11,.1)', color: tk.amber,
                          }}>
                            ● Non activé
                          </span>
                        </div>
                        {/* Aucune 2FA n'existe côté serveur : le bouton est explicitement indisponible
                            (avant : bouton actif sans aucune action). Décision métier en attente. */}
                        <button type="button" disabled aria-disabled="true" title="Fonctionnalité non disponible pour le moment" style={{
                          padding: '10px 20px', borderRadius: 10, flexShrink: 0,
                          border: `1.5px solid ${tk.border}`, background: tk.surface,
                          fontSize: 13, fontWeight: 600, color: tk.textMuted, cursor: 'not-allowed',
                        }}>
                          Bientôt disponible
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sessions */}
                  <div style={cardStyle}>
                    <SectionHeader icon={ServerIcon} title="Sessions actives" desc="Gérez vos connexions en cours" color={tk.textLight} />
                    <div style={{ padding: 24 }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 16px', borderRadius: 12, background: tk.surface,
                        border: `1px solid ${tk.border}`, gap: 12,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: `${tk.emerald}12`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <CheckCircleIcon style={{ width: 18, height: 18, color: tk.emerald }} />
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: tk.text }}>Session actuelle</p>
                            <p style={{ fontSize: 11, color: tk.textMuted }}>Navigateur • Connecté maintenant</p>
                          </div>
                        </div>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99,
                          background: 'rgba(16,185,129,.1)', color: tk.emerald,
                        }}>Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────── APPARENCE ──────── */}
              {activeTab === 'appearance' && (
                <div style={cardStyle}>
                  <SectionHeader icon={PaintBrushIcon} title="Apparence" desc="Personnalisez l'affichage de l'application" />
                  <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>

                    <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                      <div>
                        <FieldLabel icon={EyeIcon}>Thème</FieldLabel>
                        <select {...register('theme')} style={inputStyle}>
                          <option value="light">Clair</option>
                          <option value="dark">Sombre</option>
                          <option value="system">Système</option>
                        </select>
                      </div>
                      <div>
                        <FieldLabel>Taille de police</FieldLabel>
                        <select {...register('fontSize')} style={inputStyle}>
                          <option value="small">Petite (13px)</option>
                          <option value="medium">Moyenne (14px)</option>
                          <option value="large">Grande (16px)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <FieldLabel>Couleur principale</FieldLabel>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 6 }}>
                        {[
                          { color: '#c7983a', label: 'Bleu'   },
                          { color: '#10b981', label: 'Vert'   },
                          { color: '#f59e0b', label: 'Orange' },
                          { color: '#ef4444', label: 'Rouge'  },
                          { color: '#8b5cf6', label: 'Violet' },
                          { color: '#c7983a', label: 'Cyan'   },
                        ].map((c) => (
                          <button
                            key={c.color}
                            type="button"
                            title={c.label}
                            onClick={() => setThemeColor(c.color)}
                            style={{
                              width: 40, height: 40, borderRadius: 12,
                              backgroundColor: c.color, border: 'none', cursor: 'pointer',
                              outline: themeColor === c.color ? `3px solid ${c.color}` : '2px solid transparent',
                              outlineOffset: 2, transition: 'all .15s',
                              transform: themeColor === c.color ? 'scale(1.1)' : 'scale(1)',
                            }}
                          />
                        ))}
                      </div>
                      <p style={{ fontSize: 11, color: tk.textMuted, marginTop: 10 }}>
                        Couleur sélectionnée : <strong style={{ color: themeColor }}>■</strong> {themeColor}
                      </p>
                    </div>

                    <div style={{
                      padding: '14px 18px', borderRadius: 12,
                      background: tk.surface, border: `1px solid ${tk.border}`,
                    }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: tk.text, marginBottom: 8 }}>Aperçu</p>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <div style={{
                          padding: '8px 18px', borderRadius: 8,
                          background: themeColor, color: '#fff',
                          fontSize: 13, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6,
                        }}>
                          <CheckCircleIcon style={{ width: 14, height: 14 }} />
                          Bouton principal
                        </div>
                        <div style={{
                          padding: '8px 18px', borderRadius: 8,
                          border: `1.5px solid ${themeColor}`,
                          color: themeColor, background: `${themeColor}10`,
                          fontSize: 13, fontWeight: 600,
                        }}>
                          Bouton secondaire
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────── INTÉGRATIONS ──────── */}
              {activeTab === 'integrations' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div style={cardStyle}>
                    <SectionHeader icon={ServerIcon} title="Intégrations API" desc="Gérez les clés API et les services externes" />
                    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

                      {/* Clé publique */}
                      <div style={{ borderRadius: 14, border: `1px solid ${tk.border}`, overflow: 'hidden' }}>
                        <div style={{ padding: '14px 18px', background: tk.surface, borderBottom: `1px solid ${tk.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: tk.text }}>Clé API publique</p>
                            <p style={{ fontSize: 12, color: tk.textLight, marginTop: 2 }}>Pour les intégrations tierces en lecture seule</p>
                          </div>
                          <button type="button" style={{
                            padding: '7px 14px', borderRadius: 8, background: tk.accent, color: '#fff',
                            border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                          }}>
                            Régénérer
                          </button>
                        </div>
                        <div style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <code style={{
                            flex: 1, padding: '9px 12px', borderRadius: 9,
                            border: `1.5px solid ${tk.border}`, fontSize: 12,
                            color: tk.textLight, fontFamily: "'SF Mono', 'Fira Code', monospace",
                            background: tk.surface, wordBreak: 'break-all',
                          }}>
                            pk_live_••••••••••••••••••••••••••••••
                          </code>
                          <button type="button" style={{
                            padding: '8px 14px', borderRadius: 9, flexShrink: 0,
                            border: `1.5px solid ${tk.border}`, background: '#fff',
                            fontSize: 12, fontWeight: 500, color: tk.text, cursor: 'pointer',
                          }}>
                            Copier
                          </button>
                        </div>
                      </div>

                      {/* Clé secrète */}
                      <div style={{ borderRadius: 14, border: `1px solid ${tk.border}`, overflow: 'hidden' }}>
                        <div style={{ padding: '14px 18px', background: tk.surface, borderBottom: `1px solid ${tk.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 600, color: tk.text }}>Clé API secrète</p>
                            <p style={{ fontSize: 12, color: tk.textLight, marginTop: 2 }}>Ne partagez jamais cette clé. Utilisée côté serveur uniquement.</p>
                          </div>
                          <span style={{
                            padding: '4px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                            background: 'rgba(239,68,68,.08)', color: tk.rose, flexShrink: 0,
                          }}>Confidentielle</span>
                        </div>
                        <div style={{ padding: '12px 18px' }}>
                          <code style={{
                            display: 'block', padding: '9px 12px', borderRadius: 9,
                            border: `1.5px solid ${tk.border}`, fontSize: 12,
                            color: tk.textMuted, fontFamily: "'SF Mono', 'Fira Code', monospace",
                            background: tk.surface,
                          }}>
                            sk_live_••••••••••••••••••••••••••••••
                          </code>
                        </div>
                      </div>

                      {/* Webhook */}
                      <div style={{ borderRadius: 14, border: `1px solid ${tk.border}`, overflow: 'hidden' }}>
                        <div style={{ padding: '14px 18px', background: tk.surface, borderBottom: `1px solid ${tk.border}` }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: tk.text }}>URL Webhook</p>
                          <p style={{ fontSize: 12, color: tk.textLight, marginTop: 2 }}>Recevez des événements en temps réel sur cette URL</p>
                        </div>
                        <div style={{ padding: '14px 18px' }}>
                          <input type="url" {...register('webhookUrl')} style={inputStyle} placeholder="https://votre-app.com/api/webhook" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Bouton Sauvegarder ── */}
              <div className="settings-save" style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => { fetchSettings(); toast.info('Modifications annulées'); }}
                  style={{
                    padding: '10px 20px', borderRadius: 10,
                    border: `1.5px solid ${tk.border}`, background: '#fff',
                    fontSize: 14, fontWeight: 500, color: tk.textLight,
                    cursor: 'pointer', transition: 'all .15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = tk.surfaceHover; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    padding: '10px 28px', borderRadius: 10,
                    background: tk.accent, color: '#fff',
                    border: 'none', fontSize: 14, fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting ? 0.7 : 1, transition: 'all .15s',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}
                  onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.background = tk.accentDark; }}
                  onMouseLeave={e => { e.currentTarget.style.background = tk.accent; }}
                >
                  {isSubmitting ? (
                    <>
                      <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin .7s linear infinite', display: 'inline-block' }} />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon style={{ width: 16, height: 16 }} />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Desktop/tablette : boutons nav pleine largeur (mode vertical) ── */
        @media (min-width: 769px) {
          .settings-nav-btn { width: 100%; }
        }

        /* ── Tablette (769-1023px) ── */
        @media (max-width: 1023px) {
          .settings-sidebar     { width: 200px !important; }
          .settings-nav-desc    { display: none !important; }
          .settings-nav-name-mobile { display: block !important; }
        }
        @media (min-width: 1024px) {
          .settings-nav-name-mobile { display: none !important; }
        }

        /* ── Mobile (≤ 768px) ── */
        @media (max-width: 768px) {

          /* Page */
          .page-content { padding: 16px 12px 40px !important; }

          /* Layout : sidebar au-dessus, contenu en-dessous */
          .settings-layout        { flex-direction: column !important; gap: 12px !important; }
          .settings-sidebar       { width: 100% !important; flex-shrink: 0 !important; }
          .settings-sidebar-card  { position: static !important; }

          /* Nav : onglets horizontaux scrollables */
          .settings-nav {
            flex-direction: row !important;
            overflow-x: auto !important;
            gap: 4px !important;
            padding: 8px !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          .settings-nav::-webkit-scrollbar { display: none; }

          /* Boutons nav : compacts, taille automatique */
          .settings-nav-btn {
            width: auto !important;
            flex-shrink: 0 !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 8px 10px !important;
            gap: 3px !important;
            border-radius: 10px !important;
            min-width: 64px !important;
          }
          .settings-nav-desc          { display: none !important; }
          .settings-nav-name-mobile   { display: block !important; font-size: 10px !important; white-space: nowrap; }

          /* Grilles 2 colonnes → 1 colonne */
          .form-grid-2 { grid-template-columns: 1fr !important; gap: 12px !important; }

          /* Section 2FA */
          .settings-security-2fa               { flex-direction: column !important; align-items: stretch !important; }
          .settings-security-2fa > button      { width: 100% !important; margin-top: 10px; }

          /* Boutons Sauvegarder */
          .settings-save                { flex-direction: column-reverse !important; gap: 8px !important; }
          .settings-save > button       { width: 100% !important; justify-content: center !important; }

          /* Évite tout débordement horizontal */
          .settings-layout *  { max-width: 100%; box-sizing: border-box; }
        }
      `}</style>
    </div>
  );
};

export default Settings;
