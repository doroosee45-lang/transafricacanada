import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { MARKET_OPTIONS } from '../../config/currencies';
import Navbar from '../../components/Layout/Navbar'; 
import Footer from '../../components/Layout/Footer';
import {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    ClockIcon,
    UserIcon,
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

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

const Contact = () => {
    const EMPTY_FORM = { name: '', email: '', phone: '', subject: '', message: '', market: '', website: '' };
    const [formData, setFormData] = useState(EMPTY_FORM);
    // Résultat RÉEL de l'envoi (référence renvoyée par le serveur) — plus de succès simulé.
    const [submitError, setSubmitError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    // Verrou SYNCHRONE : l'état `loading` n'est pas encore à jour lors de soumissions rapprochées
    // (double clic, Entrée répétée) — sans ce verrou, plusieurs messages partaient.
    const submittingRef = useRef(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Mêmes règles que le serveur (le serveur reste l'autorité : ses erreurs sont affichées).
    const validate = (d) => {
        const e = {};
        if (d.name.trim().length < 2) e.name = 'Nom requis (2 caractères minimum).';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = 'Adresse e-mail invalide.';
        if (d.phone && !/^\+?[\d\s.()-]{6,30}$/.test(d.phone.trim())) e.phone = 'Numéro de téléphone invalide.';
        if (d.subject.trim().length < 3) e.subject = 'Sujet requis (3 caractères minimum).';
        if (d.message.trim().length < 10) e.message = 'Message trop court (10 caractères minimum).';
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submittingRef.current) return; // pas de double soumission
        setSubmitError(''); setIsSubmitted(false);
        const errors = validate(formData);
        setFieldErrors(errors);
        if (Object.keys(errors).length) return;
        submittingRef.current = true;
        setLoading(true);
        try {
            const payload = Object.fromEntries(Object.entries(formData).filter(([, v]) => v !== ''));
            const res = await axios.post('/contact', payload);
            setIsSubmitted(res.data?.data?.reference || true);
            setFormData(EMPTY_FORM);
        } catch (err) {
            const status = err.response?.status;
            if (err.response?.data?.errors) setFieldErrors(err.response.data.errors);
            setSubmitError(
                status === 429 ? 'Trop de messages envoyés depuis votre connexion. Réessayez dans quelques minutes.'
                : status === 400 ? (err.response.data?.message || 'Certains champs sont invalides.')
                : !err.response ? "Serveur injoignable : votre message n'a PAS été envoyé. Vérifiez votre connexion."
                : "Votre message n'a pas pu être enregistré. Réessayez plus tard."
            );
        } finally {
            submittingRef.current = false;
            setLoading(false);
        }
    };

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const contactInfo = [
        { icon: EnvelopeIcon, title: 'Email', details: ['contact@cargosphere.com', 'support@cargosphere.com'], action: 'mailto:contact@cargosphere.com', color: 'linear-gradient(135deg, #a77b28, #c7983a)', bgLight: 'rgba(167,123,40,.08)' },
        { icon: PhoneIcon, title: 'Téléphone', details: ['+243 81 23 45 679', '+1 6 98 76 54 32'], action: 'tel:+2438123456789', color: 'linear-gradient(135deg, #059669, #14b8a6)', bgLight: 'rgba(5,150,105,.08)' },
        { icon: MapPinIcon, title: 'Adresse', details: ['123 Rue de la Logistique', '75001 Kinshasa'], color: 'linear-gradient(135deg, #7c3aed, #ec4899)', bgLight: 'rgba(124,58,237,.08)' },
        { icon: ClockIcon, title: 'Horaires', details: ['Lun - Ven: 9h00 - 19h00', 'Sam: 10h00 - 16h00'], color: 'linear-gradient(135deg, #ea580c, #dc2626)', bgLight: 'rgba(234,88,12,.08)' }
    ];

    const faqs = [
        { question: "Comment puis-je suivre mon colis ?", answer: "Suivez votre colis depuis votre tableau de bord ou avec votre numéro de suivi. Nous vous envoyons également des notifications par email et SMS à chaque étape clé de la livraison." },
        { question: "Quels sont les délais de livraison ?", answer: "Livraison express 24-48h en France métropolitaine, 3-5 jours pour l'Europe, et 5-7 jours pour les destinations internationales. Des options accélérées sont disponibles sur demande." },
        { question: "Comment créer un compte professionnel ?", answer: "Inscrivez-vous sur notre page d'inscription et choisissez l'option 'Compte Professionnel'. Notre équipe validera votre compte sous 24h ouvrées." },
        { question: "Proposez-vous une API pour intégrer vos services ?", answer: "Oui ! Notre API REST est disponible pour les forfaits Professionnel et Enterprise. Contactez notre équipe technique pour obtenir votre clé API et la documentation." },
        { question: "Quels sont les modes de paiement acceptés ?", answer: "Nous acceptons les cartes bancaires (Visa, Mastercard), les virements bancaires, PayPal, et le paiement différé pour les comptes Enterprise." },
    ];

    return (
        <div style={{ minHeight: '100vh', background: tk.surface, overflowX: 'hidden' }}>
            <Navbar />

            {/* ─────────────── HERO — identique à ClientsList (hauteur 480px) ─────────────── */}
            <section style={{
                position: 'relative', height: 480,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: "url('/images/easy-public/transport.jpg')",
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        animation: 'zoom-slow 12s ease-in-out infinite alternate',
                    }} />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(110deg, rgba(0,0,0,.74) 0%, rgba(0,0,0,.38) 100%)',
                    }} />
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.04) 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                    }} />
                </div>

                <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#fff', padding: '0 24px', maxWidth: 720 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
                        padding: '6px 20px', marginBottom: 20,
                    }}>
                        <SparklesIcon style={{ width: 14, height: 14, color: '#ecd5a3' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans', Arial, sans-serif" }}>
                            Envoyez un message
                        </span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                        Parlons de vos
                        <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block' }}>
                            projets logistiques
                        </span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 16, lineHeight: 1.6, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
                        Notre équipe est à votre écoute pour répondre à toutes vos questions et vous accompagner dans vos projets.
                    </p>
                </div>

                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 50" style={{ width: '100%', display: 'block' }}>
                        <path fill={tk.surface} d="M0,20L80,24C160,28,320,36,480,35C640,34,800,24,960,21C1120,18,1280,22,1360,24L1440,26L1440,50L0,50Z" />
                    </svg>
                </div>
            </section>

            {/* ========== CONTACT INFO CARDS (flottantes) ========== */}
            <section style={{ padding: '20px 24px 0' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: 20, marginTop: -40, position: 'relative', zIndex: 20,
                    }}>
                        {contactInfo.map((info, idx) => {
                            const Icon = info.icon;
                            return (
                                <div
                                    key={idx}
                                    style={{
                                        background: '#fff', borderRadius: 20, padding: 24,
                                        border: `1.5px solid ${tk.border}`, transition: 'all .3s',
                                        boxShadow: '0 8px 24px rgba(23,22,20,.08)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 20px 40px rgba(23,22,20,.12)';
                                        e.currentTarget.style.borderColor = tk.accent;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(23,22,20,.08)';
                                        e.currentTarget.style.borderColor = tk.border;
                                    }}
                                >
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 14,
                                        background: info.bgLight, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        marginBottom: 16,
                                    }}>
                                        <Icon style={{ width: 22, height: 22, color: tk.accent }} />
                                    </div>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, color: tk.ink, marginBottom: 12, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                                        {info.title}
                                    </h3>
                                    {info.details.map((d, i) => (
                                        <p key={i} style={{ fontSize: 13, color: tk.textSec, marginBottom: 4 }}>
                                            {d}
                                        </p>
                                    ))}
                                    {info.action && (
                                        <a
                                            href={info.action}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                                marginTop: 12, fontSize: 13, fontWeight: 600, color: tk.accent,
                                                textDecoration: 'none',
                                            }}
                                        >
                                            Nous contacter
                                            <ChevronRightIcon style={{ width: 14, height: 14 }} />
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========== CONTACT FORM + FAQ ========== */}
            <section style={{ padding: '64px 24px', background: tk.surface }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: 40, alignItems: 'start',
                    }}>
                        {/* Formulaire */}
                        <div style={{
                            background: '#fff', borderRadius: 24, padding: 32,
                            border: `1.5px solid ${tk.border}`, boxShadow: '0 2px 8px rgba(23,22,20,.04)',
                        }}>
                            <h2 style={{ fontSize: 26, fontWeight: 800, color: tk.ink, marginBottom: 8, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                                Envoyez-nous un message
                            </h2>
                            <p style={{ fontSize: 14, color: tk.textSec, marginBottom: 24 }}>
                                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                            </p>

                            {isSubmitted && (
                                <div style={{
                                    marginBottom: 24, padding: 16, background: 'rgba(5,150,105,.08)',
                                    border: `1px solid ${tk.emerald}20`, borderRadius: 16,
                                    display: 'flex', alignItems: 'center', gap: 12,
                                }}>
                                    <CheckCircleIcon style={{ width: 20, height: 20, color: tk.emerald }} />
                                    <p role="status" style={{ fontSize: 13, color: tk.emerald }}>
                                        Message reçu{typeof isSubmitted === 'string' ? ` (référence ${isSubmitted})` : ''}. Nous vous répondrons par e-mail.
                                    </p>
                                </div>
                            )}
                            {submitError && (
                                <div role="alert" style={{ marginBottom: 24, padding: 16, background: 'rgba(220,38,38,.06)', border: '1px solid rgba(220,38,38,.25)', borderRadius: 16, fontSize: 13, color: '#b91c1c' }}>
                                    {submitError}
                                    {Object.values(fieldErrors).length > 0 && (
                                        <ul style={{ margin: '8px 0 0 18px' }}>{Object.values(fieldErrors).map(m => <li key={m}>{m}</li>)}</ul>
                                    )}
                                </div>
                            )}
                            {!submitError && Object.values(fieldErrors).length > 0 && (
                                <ul role="alert" style={{ marginBottom: 16, paddingLeft: 18, fontSize: 12, color: '#b91c1c' }}>
                                    {Object.values(fieldErrors).map(m => <li key={m}>{m}</li>)}
                                </ul>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6 }}>
                                        Nom complet
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <UserIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: tk.textMut }} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Votre nom"
                                            style={{
                                                width: '100%', padding: '12px 12px 12px 38px',
                                                borderRadius: 12, border: `1.5px solid ${tk.border}`,
                                                fontSize: 13, outline: 'none', transition: 'border .2s',
                                            }}
                                            onFocus={e => e.currentTarget.style.borderColor = tk.accent}
                                            onBlur={e => e.currentTarget.style.borderColor = tk.border}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6 }}>
                                        Email
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <EnvelopeIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: tk.textMut }} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="votre@email.com"
                                            style={{
                                                width: '100%', padding: '12px 12px 12px 38px',
                                                borderRadius: 12, border: `1.5px solid ${tk.border}`,
                                                fontSize: 13, outline: 'none', transition: 'border .2s',
                                            }}
                                            onFocus={e => e.currentTarget.style.borderColor = tk.accent}
                                            onBlur={e => e.currentTarget.style.borderColor = tk.border}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6 }}>
                                        Sujet
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <ChatBubbleLeftRightIcon style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: tk.textMut }} />
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            placeholder="Sujet de votre message"
                                            style={{
                                                width: '100%', padding: '12px 12px 12px 38px',
                                                borderRadius: 12, border: `1.5px solid ${tk.border}`,
                                                fontSize: 13, outline: 'none', transition: 'border .2s',
                                            }}
                                            onFocus={e => e.currentTarget.style.borderColor = tk.accent}
                                            onBlur={e => e.currentTarget.style.borderColor = tk.border}
                                        />
                                    </div>
                                </div>

                                <div className="contact-extra-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <label htmlFor="contact-phone" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6 }}>Téléphone (facultatif)</label>
                                        <input id="contact-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+216 …, +243 …, +971 …, +33 …" maxLength={30}
                                            style={{ width: '100%', padding: '12px', borderRadius: 12, border: `1.5px solid ${fieldErrors.phone ? '#dc2626' : tk.border}`, fontSize: 13, outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label htmlFor="contact-market" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6 }}>Pays concerné (facultatif)</label>
                                        <select id="contact-market" name="market" value={formData.market} onChange={handleChange}
                                            style={{ width: '100%', padding: '12px', borderRadius: 12, border: `1.5px solid ${tk.border}`, fontSize: 13, background: '#fff' }}>
                                            <option value="">— Choisir —</option>
                                            {MARKET_OPTIONS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                                {/* Champ piège anti-robots : invisible et ignoré des lecteurs d'écran. */}
                                <input type="text" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" aria-hidden="true"
                                    style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, opacity: 0 }} />
                                <style>{`@media (max-width: 640px) { .contact-extra-grid { grid-template-columns: 1fr !important; } }`}</style>

                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: tk.textSec, marginBottom: 6 }}>
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        placeholder="Bonjour, j'aimerais des informations sur..."
                                        style={{
                                            width: '100%', padding: '12px', borderRadius: 12,
                                            border: `1.5px solid ${tk.border}`, fontSize: 13,
                                            outline: 'none', resize: 'vertical', fontFamily: 'inherit',
                                            transition: 'border .2s',
                                        }}
                                        onFocus={e => e.currentTarget.style.borderColor = tk.accent}
                                        onBlur={e => e.currentTarget.style.borderColor = tk.border}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        padding: '14px 24px', borderRadius: 12,
                                        background: tk.accent, color: '#fff', border: 'none',
                                        fontSize: 14, fontWeight: 600, fontFamily: "'Open Sans', Arial, sans-serif",
                                        cursor: 'pointer', transition: 'transform .2s, opacity .2s',
                                        opacity: loading ? 0.6 : 1,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    }}
                                    onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'scale(1.02)' }}
                                    onMouseLeave={e => { if (!loading) e.currentTarget.style.transform = 'scale(1)' }}
                                >
                                    {loading ? (
                                        <div style={{ width: 18, height: 18, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                    ) : (
                                        <>
                                            Envoyer le message
                                            <ChevronRightIcon style={{ width: 16, height: 16 }} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* FAQ Section - Harmonisée */}
                        <div>
                            {/* Header avec titre et compteur */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                marginBottom: 24,
                            }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: 14,
                                    background: 'rgba(167,123,40,.08)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <ChatBubbleLeftRightIcon style={{ width: 24, height: 24, color: tk.accent }} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: 22, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                                        Questions fréquentes
                                    </h2>
                                    <p style={{ fontSize: 13, color: tk.textMut }}>
                                        {faqs.length} questions • Réponses rapides
                                    </p>
                                </div>
                            </div>

                            {/* Liste des FAQs en accordéon */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {faqs.map((faq, idx) => {
                                    const isOpen = openFaq === idx;
                                    return (
                                        <div
                                            key={idx}
                                            style={{
                                                background: '#fff', borderRadius: 16,
                                                border: `1.5px solid ${isOpen ? tk.accent : tk.border}`,
                                                overflow: 'hidden',
                                                transition: 'all .2s',
                                                boxShadow: isOpen ? `0 4px 12px ${tk.accent}20` : 'none',
                                            }}
                                        >
                                            <button
                                                onClick={() => toggleFaq(idx)}
                                                style={{
                                                    width: '100%', padding: '18px 20px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                    background: 'transparent', border: 'none', cursor: 'pointer',
                                                    textAlign: 'left',
                                                }}
                                            >
                                                <span style={{
                                                    fontSize: 15, fontWeight: 600,
                                                    color: isOpen ? tk.accent : tk.ink,
                                                    fontFamily: "'Open Sans', Arial, sans-serif",
                                                }}>
                                                    {faq.question}
                                                </span>
                                                <ChevronDownIcon style={{
                                                    width: 18, height: 18,
                                                    color: isOpen ? tk.accent : tk.textMut,
                                                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                                                    transition: 'transform .2s',
                                                }} />
                                            </button>
                                            
                                            {isOpen && (
                                                <div style={{
                                                    padding: '0 20px 20px 20px',
                                                    borderTop: `1px solid ${tk.border}`,
                                                    marginTop: 0,
                                                    animation: 'fadeIn 0.2s ease-out',
                                                }}>
                                                    <p style={{
                                                        fontSize: 13, color: tk.textSec,
                                                        lineHeight: 1.6, marginTop: 16,
                                                    }}>
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Footer FAQ avec lien */}
                            <div style={{
                                marginTop: 24, paddingTop: 20,
                                borderTop: `1px solid ${tk.border}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                                <span style={{ fontSize: 13, color: tk.textMut }}>
                                    Vous avez d'autres questions ?
                                </span>
                                <Link
                                    to="/app/help"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 8,
                                        fontSize: 13, fontWeight: 600, color: tk.accent,
                                        textDecoration: 'none', padding: '8px 16px',
                                        borderRadius: 10, background: 'rgba(167,123,40,.06)',
                                        transition: 'all .2s',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = 'rgba(167,123,40,.12)';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = 'rgba(167,123,40,.06)';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                >
                                    Voir toutes les FAQs
                                    <ChevronRightIcon style={{ width: 14, height: 14 }} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== CTA SUPPORT ========== */}
            <section style={{
                position: 'relative', padding: '72px 24px', textAlign: 'center',
                overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0 }}>
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: "url('/images/easy-public/transport.jpg')",
                        backgroundSize: 'cover', backgroundPosition: 'center',
                    }} />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
                        opacity: 0.85,
                    }} />
                </div>

                <div style={{ position: 'relative', zIndex: 2, maxWidth: 640, margin: '0 auto' }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(12px)',
                        borderRadius: 99, padding: '6px 20px', marginBottom: 24,
                    }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '.1em' }}>
                            🎯 Support prioritaire
                        </span>
                    </div>

                    <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: '#fff', marginBottom: 16, fontFamily: "'Open Sans', Arial, sans-serif", lineHeight: 1.2 }}>
                        Besoin d'aide immédiate ?
                    </h2>

                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,.8)', marginBottom: 32, lineHeight: 1.5 }}>
                        Notre équipe support est disponible 24h/24 et 7j/7 pour vous assister dans vos projets logistiques.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
                        <a
                            href="tel:+33123456789"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '12px 28px', borderRadius: 14, background: '#fff', color: tk.ink,
                                fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: "'Open Sans', Arial, sans-serif",
                            }}
                        >
                            <PhoneIcon style={{ width: 18, height: 18 }} />
                            Appeler maintenant
                        </a>
                        <Link
                            to="/help"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '12px 28px', borderRadius: 14, background: 'transparent', color: '#fff',
                                fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: "'Open Sans', Arial, sans-serif",
                                border: '2px solid rgba(255,255,255,.3)',
                            }}
                        >
                            <ChatBubbleLeftRightIcon style={{ width: 18, height: 18 }} />
                            Chat en direct
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />

            <style>{`
                @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default Contact;