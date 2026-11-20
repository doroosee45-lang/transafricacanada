import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer';
import {
  CubeIcon,
  RocketLaunchIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  ChartBarIcon,
  TruckIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckIcon,
  ChevronRightIcon,
  ArrowPathIcon,
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

const Solutions = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState('transport');

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const solutions = [
    {
      id: 'transport',
      title: 'Transport & Logistique',
      description: 'Solution complète de gestion de transport pour optimiser vos flux',
      icon: TruckIcon,
      color: 'from-blue-500 to-cyan-500',
      bgLight: '#EDF5FC',
      textColor: '#4D91D9',
      features: [
        'Suivi en temps réel des colis',
        'Optimisation des itinéraires',
        'Gestion de flotte',
        'Livraison express 24-48h',
        'Transport international',
        'Assurance incluse',
      ],
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      stats: [
        { value: '98%', label: 'Livraisons à temps' },
        { value: '150+', label: 'Véhicules' },
        { value: '50+', label: 'Pays' },
      ]
    },
    {
      id: 'marketplace',
      title: 'Marketplace de Kilos',
      description: 'Achetez et vendez des kilos d\'espace entre expéditeurs',
      icon: GlobeAltIcon,
      color: 'from-purple-500 to-pink-500',
      bgLight: '#f5f3ff',
      textColor: '#7c3aed',
      features: [
        'Mise en relation expéditeurs',
        'Optimisation des coûts',
        'Transactions sécurisées',
        'Tarifs négociables',
        'Espace de stockage partagé',
        'Flexibilité totale',
      ],
      image: 'https://images.unsplash.com/photo-1580674285054-bed31e145f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=987&q=80',
      stats: [
        { value: '-30%', label: 'Réduction moyenne' },
        { value: '5000+', label: 'Transactions' },
        { value: '24/7', label: 'Disponible' },
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics Avancés',
      description: 'Tableaux de bord et rapports détaillés pour piloter votre activité',
      icon: ChartBarIcon,
      color: 'from-emerald-500 to-teal-500',
      bgLight: '#ecfdf5',
      textColor: '#059669',
      features: [
        'Tableaux de bord personnalisés',
        'Indicateurs clés en temps réel',
        'Rapports automatisés',
        'Prévisions intelligentes',
        'Export PDF/Excel',
        'Partage d\'accès',
      ],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      stats: [
        { value: '+45%', label: 'Productivité' },
        { value: '24h', label: 'Mise à jour' },
        { value: '15+', label: 'Métriques' },
      ]
    },
    {
      id: 'gestion',
      title: 'Gestion d\'Entreprise',
      description: 'Gérez vos clients, employés et agences en un seul endroit',
      icon: BuildingOfficeIcon,
      color: 'from-sky-500 to-blue-600',
      bgLight: '#fff7ed',
      textColor: '#ea580c',
      features: [
        'CRM intégré',
        'Gestion des employés',
        'Multi-agences',
        'Facturation automatisée',
        'Gestion des rôles',
        'Historique complet',
      ],
      image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
      stats: [
        { value: '5000+', label: 'Clients' },
        { value: '200+', label: 'Employés' },
        { value: '12', label: 'Agences' },
      ]
    }
  ];

  const industries = [
    {
      name: 'E-commerce',
      icon: CubeIcon,
      description: 'Optimisez vos expéditions et réduisez vos coûts',
      bgColor: '#EDF5FC',
      textColor: '#4D91D9',
    },
    {
      name: 'Industrie',
      icon: BuildingOfficeIcon,
      description: 'Gérez vos flux logistiques complexes',
      bgColor: '#f3e8ff',
      textColor: '#7c3aed',
    },
    {
      name: 'Distribution',
      icon: TruckIcon,
      description: 'Suivez vos livraisons en temps réel',
      bgColor: '#d1fae5',
      textColor: '#059669',
    },
    {
      name: 'International',
      icon: GlobeAltIcon,
      description: 'Simplifiez vos expéditions transfrontalières',
      bgColor: '#ffedd5',
      textColor: '#ea580c',
    },
  ];

  const benefits = [
    {
      icon: RocketLaunchIcon,
      title: 'Rapidité d\'exécution',
      description: 'Traitement instantané de vos demandes et livraisons express',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Sécurité renforcée',
      description: 'Protection optimale de vos données et de vos colis',
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Optimisation des coûts',
      description: 'Réduction significative de vos frais logistiques',
    },
    {
      icon: UserGroupIcon,
      title: 'Support dédié',
      description: 'Équipe d\'experts à votre écoute 24h/24 et 7j/7',
    },
  ];

  const stats = [
    { value: '98%', label: 'Clients satisfaits', icon: ChartBarIcon },
    { value: '24/7', label: 'Support disponible', icon: PhoneIcon },
    { value: '50+', label: 'Pays desservis', icon: GlobeAltIcon },
    { value: '15K+', label: 'Colis par jour', icon: TruckIcon },
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
              Solutions sur mesure
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16, fontFamily: "'Open Sans', Arial, sans-serif" }}>
            Des solutions adaptées à
            <span style={{ background: 'linear-gradient(90deg,#C5DCEF,#DCE9F5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block' }}>
              votre activité
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 16, lineHeight: 1.6, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
            Découvrez comment Trans Africa Canada peut transformer votre logistique
            grâce à des solutions innovantes et personnalisées.
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

      {/* ========== SOLUTIONS DÉTAILLÉES ========== */}
      <section style={{ padding: '56px 24px', background: tk.surface }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: tk.ink, marginBottom: 12, fontFamily: "'Open Sans', Arial, sans-serif" }}>
              Nos solutions principales
            </h2>
            <p style={{ fontSize: 16, color: tk.textSec, maxWidth: 640, margin: '0 auto' }}>
              Une gamme complète d'outils pour optimiser chaque aspect de votre logistique
            </p>
          </div>

          {/* Navigation des solutions */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 40 }}>
            {solutions.map((sol) => {
              const Icon = sol.icon;
              const isActive = activeTab === sol.id;
              return (
                <button
                  key={sol.id}
                  onClick={() => setActiveTab(sol.id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '10px 22px', borderRadius: 40,
                    fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans', Arial, sans-serif",
                    transition: 'all .2s', cursor: 'pointer',
                    background: isActive ? tk.accent : '#fff',
                    color: isActive ? '#fff' : tk.textSec,
                    border: `1.5px solid ${isActive ? tk.accent : tk.border}`,
                    boxShadow: isActive ? '0 4px 12px rgba(77,145,217,.3)' : 'none',
                  }}
                >
                  <Icon style={{ width: 16, height: 16 }} />
                  {sol.title}
                </button>
              );
            })}
          </div>

          {/* Solution active */}
          {solutions.filter(s => s.id === activeTab).map((sol, idx) => {
            const Icon = sol.icon;
            return (
              <div key={idx} style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: 48, alignItems: 'center',
              }}>
                {/* Contenu texte */}
                <div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: sol.bgLight, borderRadius: 99, padding: '6px 16px', marginBottom: 20,
                  }}>
                    <Icon style={{ width: 14, height: 14, color: sol.textColor }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: sol.textColor, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                      {sol.title}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 26, fontWeight: 700, color: tk.ink, marginBottom: 16, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                    {sol.description}
                  </h3>

                  <p style={{ fontSize: 15, color: tk.textSec, marginBottom: 24, lineHeight: 1.6 }}>
                    Une solution complète qui s'adapte à vos besoins spécifiques pour une efficacité maximale.
                  </p>

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                    {sol.stats.map((stat, i) => (
                      <div key={i} style={{
                        flex: 1, textAlign: 'center', padding: '14px 8px',
                        background: sol.bgLight, borderRadius: 16,
                      }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: sol.textColor, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                          {stat.value}
                        </div>
                        <div style={{ fontSize: 11, color: tk.textMut }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <div style={{ marginBottom: 28 }}>
                    {sol.features.map((feature, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 18,
                          background: sol.bgLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <CheckIcon style={{ width: 10, height: 10, color: sol.textColor }} />
                        </div>
                        <span style={{ fontSize: 13, color: tk.textSec }}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Call to Action */}
                  <div style={{ display: 'flex', gap: 12 }}>
                    <Link
                      to="/contact"
                      style={{
                        padding: '11px 24px', borderRadius: 12, background: '#347FC5', color: '#fff',
                        fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: "'Open Sans', Arial, sans-serif",
                      }}
                    >
                      Demander une démo
                    </Link>
                    <Link
                      to="/tarifs"
                      style={{
                        padding: '11px 24px', borderRadius: 12, background: '#fff', color: tk.textSec,
                        fontSize: 13, fontWeight: 600, textDecoration: 'none', fontFamily: "'Open Sans', Arial, sans-serif",
                        border: `1.5px solid ${tk.border}`,
                      }}
                    >
                      Voir les tarifs
                    </Link>
                  </div>
                </div>

                {/* Image */}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', top: -20, left: -20, width: 200, height: 200,
                    background: `radial-gradient(circle, ${tk.accent}20 0%, transparent 70%)`,
                    borderRadius: '50%', filter: 'blur(40px)',
                  }} />
                  <img
                    src={sol.image}
                    alt={sol.title}
                    style={{ width: '100%', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,.1)' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========== SECTEURS D'ACTIVITÉ ========== */}
      <section style={{ position: 'relative', padding: '64px 24px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: "url('/images/easy-public/transport.jpg')",
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #0f172aee 0%, #1e1b4bee 100%)',
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12, fontFamily: "'Open Sans', Arial, sans-serif" }}>
              Solutions par secteur
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.7)' }}>
              Des solutions adaptées aux spécificités de votre industrie
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
          }}>
            {industries.map((industry, idx) => {
              const Icon = industry.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(12px)',
                    borderRadius: 20, padding: 20, textAlign: 'center',
                    border: '1px solid rgba(255,255,255,.15)',
                    transition: 'all .3s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.background = 'rgba(255,255,255,.15)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.background = 'rgba(255,255,255,.1)';
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: industry.bgColor, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    <Icon style={{ width: 24, height: 24, color: industry.textColor }} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 8 }}>
                    {industry.name}
                  </h3>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,.7)' }}>
                    {industry.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== BÉNÉFICES ========== */}
      <section style={{ padding: '64px 24px', background: tk.surface }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: tk.ink, marginBottom: 12, fontFamily: "'Open Sans', Arial, sans-serif" }}>
              Pourquoi choisir Trans Africa Canada ?
            </h2>
            <p style={{ fontSize: 16, color: tk.textSec }}>
              Des avantages concrets pour votre entreprise
            </p>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 24,
          }}>
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#fff', borderRadius: 20, padding: 28, textAlign: 'center',
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
                  <div style={{
                    width: 56, height: 56, borderRadius: 18,
                    background: `linear-gradient(135deg, ${tk.accent} 0%, #DCE9F5 100%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}>
                    <Icon style={{ width: 28, height: 28, color: '#fff' }} />
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: tk.ink, marginBottom: 8, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                    {benefit.title}
                  </h3>
                  <p style={{ fontSize: 13, color: tk.textSec }}>
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== IMAGE SECTION ========== */}
      <section style={{ position: 'relative', padding: '64px 24px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: "url('/images/easy-public/transport.jpg')",
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #172F50 0%, #1a1a4e 100%)',
            opacity: 0.85,
          }} />
        </div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', color: '#fff' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: 48, alignItems: 'center',
          }}>
            {/* Texte */}
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(8px)',
                borderRadius: 99, padding: '6px 16px', marginBottom: 20,
              }}>
                <ArrowPathIcon style={{ width: 14, height: 14, color: '#C5DCEF' }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                  Innovation continue
                </span>
              </div>

              <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                Une plateforme en constante évolution
              </h2>

              <p style={{ fontSize: 15, color: 'rgba(255,255,255,.8)', marginBottom: 24, lineHeight: 1.6 }}>
                Nous améliorons constamment nos solutions pour vous offrir
                les meilleurs outils logistiques du marché. Mises à jour
                régulières, nouvelles fonctionnalités, et à l'écoute de vos besoins.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Mises à jour mensuelles',
                  'Nouvelles fonctionnalités basées sur vos retours',
                  'Roadmap transparente',
                  'Bêta-testeurs privilégiés',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: 18,
                      background: 'rgba(5,150,105,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <CheckIcon style={{ width: 10, height: 10, color: '#34d399' }} />
                    </div>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,.8)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="Équipe Trans Africa Canada"
                style={{ width: '100%', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,.3)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA FINAL ========== */}
      <section style={{
        padding: '72px 24px', background: `linear-gradient(135deg, ${tk.accent} 0%, #7c3aed 100%)`,
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: 48, alignItems: 'center',
          }}>
            {/* Texte */}
            <div style={{ color: '#fff' }}>
              <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 800, marginBottom: 16, fontFamily: "'Open Sans', Arial, sans-serif", lineHeight: 1.2 }}>
                Prêt à transformer votre logistique ?
              </h2>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,.9)', marginBottom: 28, lineHeight: 1.6 }}>
                Rejoignez des milliers d'entreprises qui optimisent déjà leurs opérations avec Trans Africa Canada.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 24 }}>
                <Link
                  to="/register"
                  style={{
                    padding: '12px 28px', borderRadius: 14, background: '#fff', color: tk.accent,
                    fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: "'Open Sans', Arial, sans-serif",
                  }}
                >
                  Commencer gratuitement
                </Link>
                <Link
                  to="/contact"
                  style={{
                    padding: '12px 28px', borderRadius: 14, background: 'transparent', color: '#fff',
                    fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: "'Open Sans', Arial, sans-serif",
                    border: '2px solid rgba(255,255,255,.4)',
                  }}
                >
                  Parler à un expert
                </Link>
              </div>

              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.7)' }}>
                ✅ Sans engagement • 🎯 Démo personnalisée • 🛟 Support 24/7
              </p>
            </div>

            {/* Image */}
            <div style={{ position: 'relative' }}>
              <img
                src="https://cargoavion.com/wp-content/uploads/2020/09/IMG-CARGO-5.jpeg"
                alt="Logistique moderne"
                style={{ width: '100%', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,.2)' }}
              />
            </div>
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

export default Solutions;