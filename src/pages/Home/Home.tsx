import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import {
    ChevronRightIcon, PlayIcon, CheckIcon,
    GlobeAltIcon, RocketLaunchIcon, ShieldCheckIcon,
    ChartBarIcon, CurrencyDollarIcon, UserGroupIcon,
    CubeIcon, TruckIcon, ArrowUpIcon, SparklesIcon,
} from '@heroicons/react/24/outline';
import type { IconComponent } from '../../types/ui';

interface HomeStat { raw: number; suffix: string; label: string; icon: IconComponent; decimal: number }

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
    emerald:    '#4D91D9',
    amber:      '#4D91D9',
    rose:       '#347FC5',
    purple:     '#79B5E8',
    orange:     '#C5DCEF',
    textSec:    '#475569',
    textMut:    '#94a3b8',
};


/* ═══════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════ */
const STATS: HomeStat[] = [
    { raw:150, suffix:'K+', label:'Colis livrés',       icon:CubeIcon,        decimal:0 },
    { raw:25,  suffix:'K+', label:'Clients satisfaits', icon:UserGroupIcon,   decimal:0 },
    { raw:50,  suffix:'+',  label:'Pays desservis',     icon:GlobeAltIcon,    decimal:0 },
    { raw:99.9,suffix:'%',  label:'Taux de livraison',  icon:ShieldCheckIcon, decimal:1 },
];

const FEATURES = [
    { icon:RocketLaunchIcon,   title:'Livraison Express',         desc:'Livraison en 24-48 h dans le monde entier avec suivi en temps réel.',          color:tk.accent },
    { icon:ShieldCheckIcon,    title:'Sécurité Garantie',         desc:'Assurance incluse et protection optimale pour chacun de vos colis.',           color:tk.emerald },
    { icon:ChartBarIcon,       title:'Analytics Avancés',         desc:'Tableaux de bord détaillés pour piloter et optimiser votre logistique.',       color:tk.purple },
    { icon:CurrencyDollarIcon, title:'Prix Compétitifs',          desc:'Tarifs transparents et adaptés à tous les volumes, sans surprise.',            color:tk.amber },
    { icon:GlobeAltIcon,       title:'Couverture Internationale', desc:'Réseau de partenaires fiables dans plus de 50 pays.',                          color:tk.accent },
    { icon:TruckIcon,          title:'Flotte Moderne',            desc:'Véhicules adaptés à tous types de marchandises.',                               color:tk.rose },
];

const TESTIMONIALS = [
    { name:'Meya Osee', role:'Directrice Logistique', avatar:'https://randomuser.me/api/portraits/women/68.jpg', content:'Trans Africa Canada a transformé notre gestion logistique. Le suivi en temps réel nous a fait économiser 30%.', rating:5 },
    { name:'Mille visas', role:'Fondateur', avatar:'https://randomuser.me/api/portraits/men/32.jpg', content:"La plateforme est incroyablement intuitive. L'intégration s'est faite en quelques jours.", rating:5 },
    { name:'Dm services', role:'Responsable Export', avatar:'https://randomuser.me/api/portraits/men/45.jpg', content:'Le service client est exceptionnel et les analytics nous aident à prendre les bonnes décisions.', rating:5 },
];

const PARTNERS = [
    { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png', alt:'Google' },
    { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1024px-Microsoft_logo.svg.png', alt:'Microsoft' },
    { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/2560px-Logo_NIKE.svg.png', alt:'Nike' },
    { src:'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Amazon_icon.svg/1024px-Amazon_icon.svg.png', alt:'Amazon' },
];

const CHECKS = [
    'Suivi en temps réel de tous vos colis',
    'Marketplace collaborative pour acheter/vendre des kilos',
    'Génération automatique de factures PDF',
    'Notifications SMS et e-mail automatiques',
    'Tableaux de bord analytics personnalisables',
];

/* ═══════════════════════════════════════════════════════
   HOOK — animated counter
═══════════════════════════════════════════════════════ */
function useCounter(target: number, { decimal = 0, duration = 1800 } = {}): [number, React.RefObject<HTMLDivElement>] {
    const [val, setVal] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const t0 = performance.now();
                const tick = (now: number) => {
                    const p = Math.min((now - t0) / duration, 1);
                    const ease = 1 - Math.pow(1 - p, 3);
                    setVal(parseFloat((ease * target).toFixed(decimal)));
                    if (p < 1) requestAnimationFrame(tick);
                    else setVal(target);
                };
                requestAnimationFrame(tick);
            }
        }, { threshold: 0.5 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [target, duration, decimal]);

    return [val, ref];
}

/* ═══════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════ */
function StatCard({ stat, delay }: { stat: HomeStat; delay: number }) {
    const [val, ref] = useCounter(stat.raw, { decimal: stat.decimal, duration: 1700 });
    const display = stat.decimal > 0 ? `${val.toFixed(stat.decimal)}${stat.suffix}` : `${Math.floor(val)}${stat.suffix}`;

    return (
        <div ref={ref} style={{
            background: '#fff', borderRadius: 20, padding: '1.75rem 1.25rem', textAlign: 'center',
            border: `1.5px solid ${tk.border}`, transition: 'all .3s',
            boxShadow: '0 2px 8px rgba(23,47,80,.04)',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(23,47,80,.12)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(23,47,80,.04)';
        }}>
            <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 50, height: 50, borderRadius: 14, marginBottom: '1rem',
                background: `linear-gradient(135deg, ${tk.accent}, #6280ab)`,
                boxShadow: '0 6px 18px rgba(77,145,217,.25)',
            }}>
                <stat.icon style={{ width: 24, height: 24, color: '#fff' }} />
            </div>
            <div style={{ fontSize: 'clamp(1.6rem,4vw,2rem)', fontWeight: 800, color: tk.ink, lineHeight: 1, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                {display}
            </div>
            <div style={{ fontSize: '.8rem', color: tk.textSec, marginTop: '.3rem' }}>{stat.label}</div>
            <div style={{ height: 3, borderRadius: 3, marginTop: '.85rem', background: `linear-gradient(90deg, ${tk.accent} 25%, #79B5E8 50%, ${tk.accent} 75%)`, backgroundSize: '200% 100%', animation: 'shimmer 2.5s infinite linear' }} />
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   HOME
═══════════════════════════════════════════════════════ */
export default function Home() {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const els = document.querySelectorAll('.reveal');
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
        }, { threshold: 0.12 });
        els.forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        const fn = () => { setShowScrollTop(window.scrollY > 400); setScrollY(window.scrollY); };
        window.addEventListener('scroll', fn, { passive: true });
        return () => window.removeEventListener('scroll', fn);
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: '#fff', overflowX: 'hidden', fontFamily: "'Open Sans', Arial, sans-serif" }}>
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
                        backgroundImage: "url('/images/easy-public/entrepot.jpg')",
                        backgroundSize: 'cover', backgroundPosition: 'center',
                        animation: 'zoom-slow 12s ease-in-out infinite alternate',
                        transform: `translateY(${scrollY * 0.2}px)`,
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

                <div className="home-hero-content" style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: '#fff', padding: '0 24px', maxWidth: 720, width: '100%' }}>
                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,.2)', borderRadius: 99,
                        padding: '6px 20px', marginBottom: 20,
                        animation: 'float 3s ease-in-out infinite',
                    }}>
                        
                    </div>

                    <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                        Trans Africa Canada
                        <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block' }}>
                            Votre partenaire logistique
                        </span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 16, lineHeight: 1.6, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto', marginBottom: 32 }}>
                        La plateforme tout-en-un pour gérer vos expéditions, suivre vos colis
                        et optimiser votre chaîne logistique en temps réel.
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.8rem', justifyContent: 'center' }}>
                        <Link to="/app/agencies" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '12px 28px', borderRadius: 12, background: `linear-gradient(135deg, ${tk.accent}, #9d5fda)`,
                            color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none',
                            fontFamily: "'Open Sans', Arial, sans-serif", boxShadow: '0 4px 20px rgba(77,145,217,.4)',
                        }}>
                            Commencer maintenant <ChevronRightIcon style={{ width: 16, height: 16 }} />
                        </Link>
                        <Link to="/app/packages/add" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '12px 28px', borderRadius: 12, background: `linear-gradient(135deg, ${tk.accent}, #6a8abb)`,
                            color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none',
                            fontFamily: "'Open Sans', Arial, sans-serif", boxShadow: '0 4px 20px rgba(77,145,217,.4)',
                        }}>
                            Expédier un colis <ChevronRightIcon style={{ width: 16, height: 16 }} />
                        </Link>
                        <Link to="/app/help" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '12px 28px', borderRadius: 12, background: 'rgba(255,255,255,.12)',
                            backdropFilter: 'blur(10px)', color: '#fff', fontSize: 14, fontWeight: 600,
                            textDecoration: 'none', fontFamily: "'Open Sans', Arial, sans-serif",
                            border: '1px solid rgba(255,255,255,.25)',
                        }}>
                            <div style={{ width: 28, height: 28, background: 'rgba(255,255,255,.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <PlayIcon style={{ width: 13, height: 13 }} />
                            </div>
                            Voir la démo
                        </Link>
                    </div>
                </div>

                {/* Wave bottom */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 50" style={{ width: '100%', display: 'block' }}>
                        <path fill={tk.surface} d="M0,20L80,24C160,28,320,36,480,35C640,34,800,24,960,21C1120,18,1280,22,1360,24L1440,26L1440,50L0,50Z" />
                    </svg>
                </div>
            </section>

            {/* ========== STATS CARDS (flottantes) ========== */}
            <section style={{ padding: '32px 24px 0', background: tk.surface }}>
                <div style={{ maxWidth: 1120, margin: '0 auto' }}>
                    <div className="home-stats-grid" style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: 20, marginTop: -40, position: 'relative', zIndex: 20,
                    }}>
                        {STATS.map((s, i) => <StatCard key={i} stat={s} delay={i * 100} />)}
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section style={{ padding: '64px 24px', background: tk.surface }}>
                <div style={{ maxWidth: 1120, margin: '0 auto' }}>
                    <div className="reveal up" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <span style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: tk.accent, display: 'block', marginBottom: '.5rem' }}>
                            Fonctionnalités
                        </span>
                        <h2 style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: tk.ink, margin: '0 0 .5rem' }}>
                            Une solution complète pour votre logistique
                        </h2>
                        <p style={{ fontSize: '1rem', color: tk.textSec, maxWidth: 540, margin: '0 auto' }}>
                            Découvrez toutes les fonctionnalités qui font de Trans Africa Canada le choix n°1 des professionnels.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {FEATURES.map((f, i) => (
                            <div key={i} style={{
                                background: '#fff', borderRadius: 20, padding: '1.5rem',
                                border: `1.5px solid ${tk.border}`, transition: 'all .3s',
                                boxShadow: '0 2px 8px rgba(23,47,80,.04)',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(23,47,80,.12)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 8px rgba(23,47,80,.04)';
                            }}>
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    width: 48, height: 48, borderRadius: 12, marginBottom: '1rem',
                                    background: `${f.color}15`, transition: 'transform .4s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'rotate(8deg) scale(1.1)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0) scale(1)'}>
                                    <f.icon style={{ width: 22, height: 22, color: f.color }} />
                                </div>
                                <h3 style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontSize: '1rem', fontWeight: 700, color: tk.ink, margin: '0 0 .4rem' }}>{f.title}</h3>
                                <p style={{ fontSize: '.85rem', color: tk.textSec, lineHeight: 1.6, margin: '0 0 1rem' }}>{f.desc}</p>
                                <Link to="/app/solutions" style={{ fontSize: '.8rem', fontWeight: 600, color: f.color, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    En savoir plus <ChevronRightIcon style={{ width: 12, height: 12 }} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PLATFORM SHOWCASE ── */}
            <section style={{ padding: '64px 24px', background: '#fff' }}>
                <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
                    <div className="reveal left">
                        <span style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: tk.accent, display: 'block', marginBottom: '.5rem' }}>
                            Interface intuitive
                        </span>
                        <h2 style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontSize: 'clamp(1.4rem,3vw,1.8rem)', fontWeight: 800, color: tk.ink, margin: '0 0 1rem' }}>
                            Une plateforme puissante,<br />simple à prendre en main
                        </h2>
                        <p style={{ fontSize: '.95rem', color: tk.textSec, lineHeight: 1.7, marginBottom: '1.5rem' }}>
                            Gérez l'intégralité de votre chaîne logistique depuis un seul endroit. De la création d'expédition à la livraison finale.
                        </p>
                        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '.7rem' }}>
                            {CHECKS.map((item, i) => (
                                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '.75rem', fontSize: '.9rem', color: tk.ink, transition: 'transform .25s' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(5px)'; e.currentTarget.style.color = tk.accent; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.color = tk.ink; }}>
                                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: tk.emerald, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <CheckIcon style={{ width: 12, height: 12, color: '#fff' }} />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.8rem' }}>
                            <Link to="/app/marketplace/products" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '12px 24px', borderRadius: 12, background: '#347FC5',
                                color: '#fff', fontSize: '.9rem', fontWeight: 600, textDecoration: 'none',
                                fontFamily: "'Open Sans', Arial, sans-serif",
                            }}>
                                Commencer gratuitement <ChevronRightIcon style={{ width: 14, height: 14 }} />
                            </Link>
                            <Link to="/app/marketplace/kilos/sell" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '12px 24px', borderRadius: 12, background: 'transparent',
                                color: tk.ink, fontSize: '.9rem', fontWeight: 600, textDecoration: 'none',
                                border: `1.5px solid ${tk.border}`,
                            }}>
                                Vendre mes kilos <ChevronRightIcon style={{ width: 14, height: 14 }} />
                            </Link>
                        </div>
                    </div>
                    <div className="reveal right">
                        <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" alt="Dashboard" style={{ width: '100%', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,.1)' }} />
                    </div>
                </div>
            </section>

            {/* ── MARKETPLACE KILOS ── */}
            <section style={{ position: 'relative', padding: '64px 24px', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/easy-public/entrepot.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.25)' }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${tk.ink}E0, ${tk.accent}80)` }} />
                <div className="reveal scale" style={{ position: 'relative', zIndex: 10, maxWidth: 800, margin: '0 auto', textAlign: 'center', color: '#fff' }}>
                    <div style={{
                        display: 'inline-block', background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(104, 168, 214, 0.2)', borderRadius: 99, padding: '.3rem 1rem',
                        fontSize: '.7rem', fontWeight: 600, marginBottom: '1rem',
                    }}>
                        ✨ Nous achetons vos kilos
                    </div>
                    <h2 style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 800, margin: '0 0 .8rem' }}>Marketplace de Kilos</h2>
                    <p style={{ fontSize: 'clamp(.9rem,2vw,1rem)', color: 'rgba(255,255,255,.85)', maxWidth: 500, margin: '0 auto 2rem', lineHeight: 1.6 }}>
                        Achetez et vendez des kilos d'espace de transport entre expéditeurs. Optimisez vos coûts et maximisez vos profits.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                        <div style={{ background: 'rgba(255,255,255,.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 16, padding: '1.25rem 2rem', minWidth: 140 }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: tk.emerald }}>-30%</div>
                            <div style={{ fontSize: '.8rem' }}>Réduction moyenne</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,.15)', borderRadius: 16, padding: '1.25rem 2rem', minWidth: 140 }}>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: tk.accent }}>+45%</div>
                            <div style={{ fontSize: '.8rem' }}>Optimisation fret</div>
                        </div>
                    </div>
                    <Link to="/app/marketplace/kilos" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '12px 28px', borderRadius: 12, background: '#347FC5',
                        color: '#fff', fontSize: '.9rem', fontWeight: 600, textDecoration: 'none',
                        fontFamily: "'Open Sans', Arial, sans-serif",
                    }}>
                        Découvrir la marketplace <ChevronRightIcon style={{ width: 16, height: 16 }} />
                    </Link>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section style={{ padding: '64px 24px', background: '#fff' }}>
                <div style={{ maxWidth: 1120, margin: '0 auto' }}>
                    <div className="reveal up" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <span style={{ fontSize: '.7rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: tk.accent, display: 'block', marginBottom: '.5rem' }}>
                            Témoignages
                        </span>
                        <h2 style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontSize: 'clamp(1.5rem,3vw,2rem)', fontWeight: 800, color: tk.ink, margin: '0 0 .3rem' }}>
                            Ils nous font confiance
                        </h2>
                        <p style={{ fontSize: '.9rem', color: tk.textSec }}>Rejoignez les milliers d'entreprises qui optimisent leur logistique avec Trans Africa Canada.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} style={{
                                position: 'relative', background: '#fff', borderRadius: 20, padding: '1.5rem',
                                border: `1.5px solid ${tk.border}`, transition: 'all .3s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-6px)';
                                e.currentTarget.style.boxShadow = '0 20px 40px rgba(23,47,80,.12)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                                <div style={{ display: 'flex', gap: 3, marginBottom: '.7rem' }}>
                                    {[...Array(t.rating)].map((_, s) => (
                                        <svg key={s} style={{ width: 14, height: 14, fill: '#5353d5' }} viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p style={{ fontSize: '.85rem', color: tk.textSec, lineHeight: 1.65, fontStyle: 'italic', marginBottom: '1rem' }}>"{t.content}"</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem' }}>
                                    <img src={t.avatar} alt={t.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${tk.border}` }} />
                                    <div>
                                        <div style={{ fontSize: '.85rem', fontWeight: 700, color: tk.ink }}>{t.name}</div>
                                        <div style={{ fontSize: '.7rem', color: tk.textSec }}>{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── PARTENAIRES ── */}
            <section style={{ padding: '2.5rem 24px', background: tk.surface, borderTop: `1px solid ${tk.border}` }}>
                <div style={{ maxWidth: 1120, margin: '0 auto' }}>
                    <p style={{ textAlign: 'center', fontSize: '.65rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: tk.textSec, marginBottom: '1.5rem' }}>
                        Partenaires de confiance
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
                        {PARTNERS.map((p, i) => (
                            <img key={i} src={p.src} alt={p.alt} style={{ filter: 'grayscale(1)', opacity: 0.5, height: 32, objectFit: 'contain', transition: 'all .3s' }}
                                onMouseEnter={e => { e.currentTarget.style.filter = 'grayscale(0)'; e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.filter = 'grayscale(1)'; e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.transform = 'none'; }} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA FINAL ── */}
            <section style={{ position: 'relative', padding: '64px 24px', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: "url('/images/easy-public/entrepot.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.25)' }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${tk.ink}E8, ${tk.ink}D0)` }} />
                <div className="reveal scale" style={{ position: 'relative', zIndex: 10, maxWidth: 700, margin: '0 auto', textAlign: 'center', color: '#fff' }}>
                    <div style={{
                        display: 'inline-block', background: 'rgba(255,255,255,.12)', backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,.2)', borderRadius: 99, padding: '.3rem 1rem',
                        fontSize: '.7rem', fontWeight: 600, marginBottom: '1rem',
                    }}>
                        🚀 Plus de 150 000 entreprises nous font confiance
                    </div>
                    <h2 style={{ fontFamily: "'Open Sans', Arial, sans-serif", fontSize: 'clamp(1.6rem,4vw,2.5rem)', fontWeight: 800, margin: '0 0 .8rem' }}>
                        Prêt à révolutionner
                        <span style={{ background: 'linear-gradient(270deg, #3d28a7, #79B5E8, #8b5cf6, #4D91D9)', backgroundSize: '300% 300%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block', animation: 'gradShift 5s ease infinite' }}>
                            votre logistique ?
                        </span>
                    </h2>
                    <p style={{ fontSize: 'clamp(.9rem,2vw,1rem)', color: 'rgba(255,255,255,.8)', margin: '0 auto 2rem', maxWidth: 460, lineHeight: 1.6 }}>
                        Rejoignez des milliers d'entreprises qui optimisent leurs expéditions avec Trans Africa Canada.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.8rem', justifyContent: 'center', marginBottom: '2rem' }}>
                        <Link to="/register" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '12px 28px', borderRadius: 12, background: '#347FC5',
                            color: '#fff', fontSize: '.9rem', fontWeight: 600, textDecoration: 'none',
                            fontFamily: "'Open Sans', Arial, sans-serif",
                        }}>
                            Créer un compte gratuit <ChevronRightIcon style={{ width: 16, height: 16 }} />
                        </Link>
                        <Link to="/contact" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '12px 28px', borderRadius: 12, background: 'rgba(255,255,255,.12)',
                            backdropFilter: 'blur(10px)', color: '#fff', fontSize: '.9rem', fontWeight: 600,
                            textDecoration: 'none', fontFamily: "'Open Sans', Arial, sans-serif",
                            border: '1px solid rgba(255,255,255,.25)',
                        }}>
                            Contacter les ventes <ChevronRightIcon style={{ width: 16, height: 16 }} />
                        </Link>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', justifyContent: 'center' }}>
                        {['Sans engagement', 'Annulation à tout moment', 'Support 24/7'].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.8rem', color: 'rgba(255,255,255,.75)' }}>
                                <span style={{ width: 16, height: 16, background: tk.emerald, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CheckIcon style={{ width: 10, height: 10, color: '#fff' }} />
                                </span>
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scroll top */}
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{
                position: 'fixed', bottom: 28, right: 28, zIndex: 50, width: 44, height: 44, borderRadius: 12,
                border: 'none', cursor: 'pointer', background: '#347FC5',
                color: '#fff', boxShadow: '0 4px 20px rgba(77,145,217,.4)', transition: 'opacity .3s, transform .3s',
                opacity: showScrollTop ? 1 : 0, transform: showScrollTop ? 'translateY(0)' : 'translateY(16px)',
                pointerEvents: showScrollTop ? 'auto' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = showScrollTop ? 'translateY(0)' : 'translateY(16px)'; }}>
                <ArrowUpIcon style={{ width: 18, height: 18 }} />
            </button>

            <Footer />

            <style>{`
                @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
                @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
                @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
                @keyframes gradShift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
                .reveal { opacity: 0; transition: opacity .65s, transform .65s; }
                .reveal.up { transform: translateY(36px); }
                .reveal.left { transform: translateX(-36px); }
                .reveal.right { transform: translateX(36px); }
                .reveal.scale { transform: scale(.92); }
                .reveal.visible { opacity: 1 !important; transform: none !important; }

                /* ── Mobile (≤639px) ── */
                @media(max-width:639px){
                  .home-stats-grid {
                    grid-template-columns: repeat(2, 1fr) !important;
                    gap: 12px !important;
                    margin-top: -20px !important;
                  }
                  .home-hero-content {
                    padding: 0 16px !important;
                  }
                  .home-hero-content h1 {
                    font-size: clamp(24px, 7vw, 36px) !important;
                    margin-bottom: 12px !important;
                  }
                  .home-hero-content p {
                    font-size: 14px !important;
                    margin-bottom: 20px !important;
                  }
                }
            `}</style>
        </div>
    );
}