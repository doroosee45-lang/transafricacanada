import React, { useState, useEffect } from 'react';
import { formatMoney, formatUnitPrice } from '../../config/currencies';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import {
    CheckIcon,
    XMarkIcon,
    ChevronRightIcon,
    CubeIcon,
    RocketLaunchIcon,
    BuildingOfficeIcon,
    GlobeAltIcon,
    PhoneIcon,
    EnvelopeIcon,
    ArrowPathIcon,
    ShieldCheckIcon,
    ChartBarIcon,
    ChatBubbleLeftRightIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

/* ─────────────────────────────────────────────
   DESIGN TOKENS — identiques à ClientsList
───────────────────────────────────────────── */
const tk = {
  ink:     '#172F50',
  ink80:   '#172F50',
  surface: '#F7FAFE',
  surf2:   '#EDF5FC',
  border:  '#DCE9F5',
  accent:  '#4D91D9',
  emerald: '#059669',
  amber:   '#d97706',
  rose:    '#dc2626',
  textSec: '#52677D',
  textMut: '#8295A8',
};

const Tarifs = () => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const plans = [
        {
            name: 'Essentiel',
            description: 'Pour les petites entreprises qui débutent',
            price: { monthly: 29, yearly: 290 },
            features: [
                { name: 'Jusqu\'à 100 colis/mois', included: true },
                { name: 'Suivi en temps réel', included: true },
                { name: 'Gestion clients', included: true },
                { name: 'Support email', included: true },
                { name: 'Marketplace produits', included: false },
                { name: 'Marketplace kilos', included: false },
                { name: 'Analytics avancés', included: false },
                { name: 'API access', included: false },
            ],
            icon: CubeIcon,
            color: '#4D91D9',
            gradient: '#347FC5',
            bgLight: 'rgba(77,145,217,.08)',
            borderColor: '#DCE9F5',
            popular: false,
        },
        {
            name: 'Professionnel',
            description: 'Pour les entreprises en croissance',
            price: { monthly: 79, yearly: 790 },
            features: [
                { name: 'Jusqu\'à 500 colis/mois', included: true },
                { name: 'Suivi en temps réel', included: true },
                { name: 'Gestion clients', included: true },
                { name: 'Support prioritaire', included: true },
                { name: 'Marketplace produits', included: true },
                { name: 'Marketplace kilos', included: true },
                { name: 'Analytics avancés', included: false },
                { name: 'API access', included: false },
            ],
            icon: RocketLaunchIcon,
            color: '#7c3aed',
            gradient: 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)',
            bgLight: 'rgba(124,58,237,.08)',
            borderColor: '#ddd6fe',
            popular: true,
        },
        {
            name: 'Enterprise',
            description: 'Pour les grandes entreprises',
            price: { monthly: 199, yearly: 1990 },
            features: [
                { name: 'Colis illimités', included: true },
                { name: 'Suivi en temps réel', included: true },
                { name: 'Gestion clients', included: true },
                { name: 'Support dédié 24/7', included: true },
                { name: 'Marketplace produits', included: true },
                { name: 'Marketplace kilos', included: true },
                { name: 'Analytics avancés', included: true },
                { name: 'API access', included: true },
            ],
            icon: BuildingOfficeIcon,
            color: '#059669',
            gradient: 'linear-gradient(135deg, #059669 0%, #14b8a6 100%)',
            bgLight: 'rgba(5,150,105,.08)',
            borderColor: '#a7f3d0',
            popular: false,
        },
    ];

    const addons = [
        { name: 'Kilos supplémentaires', price: formatUnitPrice(0.5, 'EUR'), description: 'Achetez des kilos en plus de votre forfait' },
        { name: 'Support prioritaire', price: `${formatMoney(49, 'EUR')}/mois`, description: 'Réponse garantie sous 1 heure' },
        { name: 'API Entreprise', price: `${formatMoney(99, 'EUR')}/mois`, description: 'Intégration complète avec vos systèmes' },
        { name: 'Formation équipe', price: formatMoney(590, 'EUR'), description: 'Session de formation de 2 jours' },
    ];

    const stats = [
        { value: '98%', label: 'Clients satisfaits', icon: ChartBarIcon },
        { value: '24/7', label: 'Support disponible', icon: PhoneIcon },
        { value: '99.9%', label: 'Taux de disponibilité', icon: ShieldCheckIcon },
        { value: '15+', label: 'Pays desservis', icon: GlobeAltIcon },
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
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
                        padding: '6px 20px', marginBottom: 20,
                    }}>
                        <SparklesIcon style={{ width: 14, height: 14, color: '#C5DCEF' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans', Arial, sans-serif" }}>
                            💰 Tarifs transparents
                        </span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                        Des tarifs adaptés à
                        <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block' }}>
                            votre croissance
                        </span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 16, lineHeight: 1.6, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
                        Choisissez le forfait qui correspond à vos besoins. Pas de frais cachés, résiliation sans engagement.
                    </p>
                </div>

                {/* Wave bottom */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 50" style={{ width: '100%', display: 'block' }}>
                        <path fill={tk.surface} d="M0,20L80,24C160,28,320,36,480,35C640,34,800,24,960,21C1120,18,1280,22,1360,24L1440,26L1440,50L0,50Z" />
                    </svg>
                </div>
            </section>

            {/* ========== STATS CARD ========== */}
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 0' }}>
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 16, marginTop: -40, position: 'relative', zIndex: 20,
                }}>
                    {stats.map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div key={idx} style={{
                                background: '#fff', borderRadius: 20, padding: '18px 16px',
                                textAlign: 'center', border: `1.5px solid ${tk.border}`,
                                boxShadow: '0 8px 24px rgba(23,47,80,.08)',
                                transition: 'all .2s',
                            }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 14,
                                    background: 'rgba(77,145,217,.08)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 12px',
                                }}>
                                    <Icon style={{ width: 22, height: 22, color: tk.accent }} />
                                </div>
                                <div style={{ fontSize: 26, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans', Arial, sans-serif", marginBottom: 6 }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: 13, color: tk.textSec, fontWeight: 500 }}>
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ========== TOGGLE MENSUEL/ANNUEL ========== */}
            <section style={{ padding: '40px 24px 0', background: tk.surface }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16 }}>
                        <span style={{
                            fontSize: 14, fontWeight: 500,
                            color: billingCycle === 'monthly' ? tk.accent : tk.textMut,
                        }}>
                            Mensuel
                        </span>

                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            style={{
                                position: 'relative', width: 64, height: 32,
                                background: billingCycle === 'yearly' ? tk.accent : '#cbd5e1',
                                borderRadius: 99, padding: '2px', cursor: 'pointer',
                                transition: 'background .2s', border: 'none',
                            }}
                        >
                            <div style={{
                                width: 28, height: 28, background: '#fff', borderRadius: '50%',
                                transform: billingCycle === 'yearly' ? 'translateX(32px)' : 'translateX(0)',
                                transition: 'transform .2s',
                            }} />
                        </button>

                        <span style={{
                            fontSize: 14, fontWeight: 500,
                            color: billingCycle === 'yearly' ? tk.accent : tk.textMut,
                        }}>
                            Annuel
                            <span style={{
                                marginLeft: 8, fontSize: 11, background: 'rgba(5,150,105,.12)',
                                color: tk.emerald, padding: '2px 8px', borderRadius: 99,
                            }}>
                                -17%
                            </span>
                        </span>
                    </div>
                </div>
            </section>

            {/* ========== PLANS PRINCIPAUX ========== */}
            <section style={{ padding: '40px 24px 64px', background: tk.surface }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: 24,
                    }}>
                        {plans.map((plan, idx) => {
                            const Icon = plan.icon;
                            const price = plan.price[billingCycle];
                            const isYearly = billingCycle === 'yearly';

                            return (
                                <div
                                    key={idx}
                                    style={{
                                        position: 'relative', background: '#fff', borderRadius: 24,
                                        border: `1.5px solid ${plan.popular ? tk.accent : tk.border}`,
                                        boxShadow: plan.popular ? `0 8px 24px ${tk.accent}20` : '0 2px 8px rgba(23,47,80,.04)',
                                        transition: 'all .3s',
                                        overflow: 'hidden',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-6px)';
                                        e.currentTarget.style.boxShadow = '0 24px 48px rgba(23,47,80,.12)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = plan.popular ? `0 8px 24px ${tk.accent}20` : '0 2px 8px rgba(23,47,80,.04)';
                                    }}
                                >
                                    {plan.popular && (
                                        <div style={{
                                            position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                                            background: tk.accent, color: '#fff', fontSize: 11, fontWeight: 700,
                                            padding: '6px 16px', borderRadius: 99, whiteSpace: 'nowrap',
                                        }}>
                                            🌟 Plus populaire
                                        </div>
                                    )}

                                    <div style={{ padding: 32 }}>
                                        {/* En-tête */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                            <div style={{
                                                width: 48, height: 48, borderRadius: 14,
                                                background: plan.bgLight, display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Icon style={{ width: 24, height: 24, color: plan.color }} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: 18, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                                                    {plan.name}
                                                </h3>
                                                <p style={{ fontSize: 12, color: tk.textMut }}>{plan.description}</p>
                                            </div>
                                        </div>

                                        {/* Prix */}
                                        <div style={{ marginBottom: 24 }}>
                                            <span style={{ fontSize: 36, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                                                {formatMoney(price, 'EUR')}
                                            </span>
                                            <span style={{ fontSize: 14, color: tk.textMut, marginLeft: 4 }}>
                                                /{billingCycle === 'monthly' ? 'mois' : 'an'}
                                            </span>
                                            {isYearly && (
                                                <div style={{ marginTop: 4, fontSize: 12, color: tk.emerald }}>
                                                    Économisez {formatMoney(plan.price.monthly * 12 - price, 'EUR')}
                                                </div>
                                            )}
                                        </div>

                                        {/* Bouton CTA */}
                                        <Link
                                            to="/register"
                                            style={{
                                                display: 'block', width: '100%', padding: '12px 20px',
                                                borderRadius: 12, textAlign: 'center',
                                                background: plan.gradient, color: '#fff',
                                                fontSize: 14, fontWeight: 600, textDecoration: 'none',
                                                marginBottom: 24, fontFamily: "'Open Sans', Arial, sans-serif",
                                                transition: 'transform .2s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                        >
                                            Commencer
                                        </Link>

                                        {/* Caractéristiques */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                            {plan.features.map((feature, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    {feature.included ? (
                                                        <CheckIcon style={{ width: 16, height: 16, color: plan.color, flexShrink: 0 }} />
                                                    ) : (
                                                        <XMarkIcon style={{ width: 16, height: 16, color: tk.textMut, flexShrink: 0 }} />
                                                    )}
                                                    <span style={{
                                                        fontSize: 13,
                                                        color: feature.included ? tk.textSec : tk.textMut,
                                                    }}>
                                                        {feature.name}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========== IMAGE SECTION ========== */}
            <section style={{
                position: 'relative', height: 400,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
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
                        opacity: 0.7,
                    }} />
                </div>

                <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff', maxWidth: 640, padding: '0 24px' }}>
                    <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, marginBottom: 16, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                        Des tarifs qui évoluent avec vous
                    </h2>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,.8)', marginBottom: 28, lineHeight: 1.6 }}>
                        Changez de forfait à tout moment, résiliez quand vous voulez.
                        Nous croyons en la transparence et la flexibilité pour accompagner votre croissance.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                        <Link
                            to="/contact"
                            style={{
                                padding: '12px 28px', borderRadius: 14, background: '#fff', color: tk.ink,
                                fontSize: 14, fontWeight: 600, textDecoration: 'none',
                            }}
                        >
                            Contacter les ventes
                        </Link>
                        <Link
                            to="/faq"
                            style={{
                                padding: '12px 28px', borderRadius: 14, background: 'transparent', color: '#fff',
                                fontSize: 14, fontWeight: 600, textDecoration: 'none',
                                border: '2px solid rgba(255,255,255,.3)',
                            }}
                        >
                            Voir la FAQ
                        </Link>
                    </div>
                </div>
            </section>

            {/* ========== ADDONS ========== */}
            <section style={{ padding: '64px 24px', background: tk.surface }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 48 }}>
                        <h2 style={{ fontSize: 28, fontWeight: 800, color: tk.ink, marginBottom: 12, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                            Options complémentaires
                        </h2>
                        <p style={{ fontSize: 16, color: tk.textSec, maxWidth: 640, margin: '0 auto' }}>
                            Personnalisez votre forfait avec nos options à la carte pour maximiser vos performances logistiques.
                        </p>
                    </div>

                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: 24,
                    }}>
                        {addons.map((addon, idx) => (
                            <div
                                key={idx}
                                style={{
                                    background: '#fff', borderRadius: 20, padding: 24,
                                    border: `1.5px solid ${tk.border}`, transition: 'all .3s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 16px 32px rgba(23,47,80,.08)';
                                    e.currentTarget.style.borderColor = tk.accent;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = tk.border;
                                }}
                            >
                                <h3 style={{ fontSize: 17, fontWeight: 700, color: tk.ink, marginBottom: 8, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                                    {addon.name}
                                </h3>
                                <p style={{ fontSize: 24, fontWeight: 800, color: tk.accent, marginBottom: 8, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                                    {addon.price}
                                </p>
                                <p style={{ fontSize: 13, color: tk.textSec }}>
                                    {addon.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========== CTA FINAL ========== */}
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
                            href="mailto:contact@transafricacanada.com"
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '12px 28px', borderRadius: 14, background: '#fff', color: tk.ink,
                                fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: "'Open Sans', Arial, sans-serif",
                            }}
                        >
                            <EnvelopeIcon style={{ width: 18, height: 18 }} />
                            Nous écrire
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
            `}</style>
        </div>
    );
};

export default Tarifs;