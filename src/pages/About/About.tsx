import React, { useEffect, useState } from 'react';
import {
  GlobeAltIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';

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

const About = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: 'Colis livrés', value: '150K+', icon: RocketLaunchIcon },
    { label: 'Clients satisfaits', value: '25K+', icon: UsersIcon },
    { label: 'Pays desservis', value: '15', icon: GlobeAltIcon },
    { label: 'Agences', value: '12', icon: ShieldCheckIcon },
  ];

  const features = [
    {
      icon: RocketLaunchIcon,
      title: 'Livraison rapide',
      description: 'Optimisation des itinéraires et réseau de transport efficace',
      color: '#4D91D9',
      bgLight: 'rgba(77,145,217,.08)',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Sécurité garantie',
      description: 'Suivi en temps réel et assurance incluse pour chaque colis',
      color: '#059669',
      bgLight: 'rgba(5,150,105,.08)',
    },
    {
      icon: UsersIcon,
      title: 'Service client',
      description: 'Équipe dédiée disponible 7j/7 pour vous accompagner',
      color: '#7c3aed',
      bgLight: 'rgba(124,58,237,.08)',
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics avancés',
      description: 'Tableaux de bord détaillés pour suivre votre activité',
      color: '#ea580c',
      bgLight: 'rgba(234,88,12,.08)',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Prix compétitifs',
      description: 'Tarifs transparents et adaptés à vos besoins',
      color: '#059669',
      bgLight: 'rgba(5,150,105,.08)',
    },
    {
      icon: GlobeAltIcon,
      title: 'Couverture internationale',
      description: 'Réseau de partenaires dans le monde entier',
      color: '#4D91D9',
      bgLight: 'rgba(77,145,217,.08)',
    },
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
            backgroundImage: "url('/images/easy-public/entrepot.jpg')",
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
              À PROPOS
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16, fontFamily: "'Open Sans', Arial, sans-serif" }}>
            Votre partenaire logistique{' '}
            <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
              de confiance
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 16, lineHeight: 1.6, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
            Trans Africa Canada révolutionne la gestion logistique avec une plateforme intégrée
            offrant suivi en temps réel, marketplace collaborative et analytics avancés.
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
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(23,47,80,.12)';
                e.currentTarget.style.borderColor = tk.accent;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(23,47,80,.08)';
                e.currentTarget.style.borderColor = tk.border;
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

      {/* ========== MAIN CONTENT ========== */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 64px' }}>
        
        {/* ── Mission Card ── */}
        <div style={{
          background: 'linear-gradient(135deg, #EDF5FC 0%, #EDF5FC 100%)',
          borderRadius: 28, padding: '40px 32px', textAlign: 'center',
          marginBottom: 56,
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: tk.ink, marginBottom: 16, fontFamily: "'Open Sans', Arial, sans-serif" }}>
            Notre mission
          </h2>
          <p style={{ fontSize: 17, color: tk.textSec, maxWidth: 720, margin: '0 auto', lineHeight: 1.6 }}>
            Simplifier la logistique pour les entreprises de toutes tailles en offrant
            une plateforme complète, intuitive et fiable qui connecte expéditeurs,
            transporteurs et destinataires.
          </p>
        </div>

        {/* ── Features ── */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: tk.ink, textAlign: 'center', marginBottom: 32, fontFamily: "'Open Sans', Arial, sans-serif" }}>
            Pourquoi choisir Trans Africa Canada ?
          </h2>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 20,
          }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  style={{
                    background: '#fff', borderRadius: 20, padding: 24,
                    border: `1.5px solid ${tk.border}`, transition: 'all .3s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 16px 32px rgba(23,47,80,.1)';
                    e.currentTarget.style.borderColor = feature.color;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = tk.border;
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: feature.bgLight, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    marginBottom: 16, transition: 'transform .2s',
                  }}>
                    <Icon style={{ width: 24, height: 24, color: feature.color }} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: tk.ink, marginBottom: 8, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: 14, color: tk.textSec, lineHeight: 1.5 }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Team ── */}
        
        {/* ── CTA ── */}
        <div style={{
          background: `linear-gradient(135deg, ${tk.ink} 0%, ${tk.ink80} 100%)`,
          borderRadius: 28, padding: '48px 32px', textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12, fontFamily: "'Open Sans', Arial, sans-serif" }}>
            Prêt à commencer ?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.7)', marginBottom: 28 }}>
            Rejoignez des milliers d'entreprises qui nous font confiance
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <button style={{
              padding: '12px 28px', borderRadius: 14, background: '#fff', color: tk.accent,
              fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
              fontFamily: "'Open Sans', Arial, sans-serif", boxShadow: '0 4px 14px rgba(0,0,0,.2)',
              transition: 'transform .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              Créer un compte
            </button>
            <button style={{
              padding: '12px 28px', borderRadius: 14, background: 'transparent', color: '#fff',
              fontSize: 14, fontWeight: 600, border: '2px solid rgba(255,255,255,.3)',
              cursor: 'pointer', fontFamily: "'Open Sans', Arial, sans-serif", transition: 'transform .2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              Contacter les ventes
            </button>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
      `}</style>
    </div>
  );
};

export default About;