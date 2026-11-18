import React, { useState } from 'react';
import {
  BookOpenIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  SparklesIcon,
  ClockIcon,
  StarIcon,
  BuildingLibraryIcon,
  QuestionMarkCircleIcon,
  ArrowPathIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

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
  orange:     '#ea580c',
  textSec:    '#4b5a6e',
  textMut:    '#8494a9',
};

const inputStyle = {
  width: '100%', padding: '12px 16px 12px 44px', borderRadius: 12,
  background: 'rgba(255,255,255,.15)', color: '#fff', fontSize: 14,
  border: `1px solid rgba(255,255,255,.25)`, outline: 'none',
  fontFamily: "'DM Sans', sans-serif", transition: 'all .18s',
  backdropFilter: 'blur(8px)',
};

// ─── Données ───────────────────────────────────────────────────────────────
const faqs = [
  {
    question: 'Comment créer un nouveau colis ?',
    answer: 'Pour créer un nouveau colis, rendez-vous dans la section "Colis" puis cliquez sur "Nouveau colis". Remplissez les informations requises et validez.',
    category: 'Colis',
  },
  {
    question: 'Comment suivre un colis en temps réel ?',
    answer: 'Vous pouvez suivre un colis en entrant son numéro de suivi dans la barre de recherche ou en accédant à la page du colis et en cliquant sur "Tracking".',
    category: 'Colis',
  },
  {
    question: 'Comment générer une facture ?',
    answer: 'Les factures sont automatiquement générées pour chaque paiement. Vous pouvez les télécharger depuis la page des paiements ou du colis concerné.',
    category: 'Facturation',
  },
  {
    question: 'Comment vendre sur la marketplace ?',
    answer: "Pour vendre un produit, allez dans Marketplace > \"Vendre un produit\" et remplissez le formulaire. Pour vendre des kilos, utilisez l'option \"Vendre des kilos\".",
    category: 'Marketplace',
  },
  {
    question: 'Comment contacter le support ?',
    answer: 'Vous pouvez nous contacter par email à support@cargosphere.com ou par téléphone au +33 1 23 45 67 89.',
    category: 'Support',
  },
  {
    question: 'Comment réinitialiser mon mot de passe ?',
    answer: 'Sur la page de connexion, cliquez sur "Mot de passe oublié" et suivez les instructions envoyées à votre adresse email.',
    category: 'Compte',
  },
  {
    question: 'Quels sont les délais de livraison ?',
    answer: 'Les délais de livraison varient selon la destination. En moyenne, comptez 3 à 7 jours ouvrés pour la France et 5 à 14 jours pour l\'international.',
    category: 'Livraison',
  },
  {
    question: 'Comment annuler une commande ?',
    answer: 'Vous pouvez annuler une commande depuis la page du colis tant que celui-ci n\'a pas été expédié. Contactez le support pour toute annulation urgente.',
    category: 'Commandes',
  },
];

const categories = [...new Set(faqs.map(f => f.category))];

const guides = [
  {
    title: 'Guide de démarrage',
    description: 'Maîtrisez EASY en 10 minutes avec notre guide pas-à-pas.',
    icon: BookOpenIcon,
    color: tk.accent,
    badge: 'Recommandé',
  },
  {
    title: 'Tutoriels vidéo',
    description: 'Apprenez visuellement avec nos vidéos explicatives détaillées.',
    icon: VideoCameraIcon,
    color: tk.rose,
    badge: 'Nouveau',
  },
  {
    title: 'Documentation API',
    description: 'Intégrez EASY dans vos systèmes grâce à notre API REST.',
    icon: DocumentTextIcon,
    color: tk.purple,
    badge: 'Développeurs',
  },
];

const support = [
  {
    title: 'Chat en direct',
    description: 'Notre équipe répond en moins de 2 minutes.',
    icon: ChatBubbleLeftRightIcon,
    action: 'Démarrer un chat',
    color: tk.emerald,
    available: true,
  },
  {
    title: 'Support email',
    description: 'Réponse garantie sous 24h ouvrées.',
    icon: EnvelopeIcon,
    action: 'support@cargosphere.com',
    color: tk.accent,
    available: true,
  },
  {
    title: 'Téléphone',
    description: 'Du lundi au vendredi, 9h–18h.',
    icon: PhoneIcon,
    action: '+33 1 23 45 67 89',
    color: tk.purple,
    available: false,
  },
];

const stats = [
  { value: '5 min', label: 'Temps de réponse moyen', icon: ClockIcon, color: tk.accent },
  { value: '98%', label: 'Taux de satisfaction', icon: StarIcon, color: tk.emerald },
  { value: '24/7', label: 'Disponibilité email', icon: EnvelopeIcon, color: tk.amber },
  { value: '50+', label: "Articles d'aide", icon: BuildingLibraryIcon, color: tk.purple },
];

// ─── FAQ Item Élégant ──────────────────────────────────────────────────────
const FaqItem = ({ faq, isOpen, onToggle, index }) => (
  <div style={{
    borderBottom: `1px solid ${tk.border}`,
    transition: 'all 0.3s ease',
  }}>
    <button
      onClick={onToggle}
      style={{
        width: '100%', padding: '20px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16, background: isOpen ? tk.surface : '#fff',
        cursor: 'pointer', transition: 'all 0.2s ease',
        border: 'none',
      }}
      onMouseEnter={e => {
        if (!isOpen) e.currentTarget.style.background = tk.surface;
      }}
      onMouseLeave={e => {
        if (!isOpen) e.currentTarget.style.background = '#fff';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: isOpen ? `${tk.accent}15` : `${tk.accent}08`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}>
          <QuestionMarkCircleIcon style={{
            width: 16, height: 16,
            color: isOpen ? tk.accent : tk.textMut,
          }} />
        </div>
        <span style={{
          fontWeight: isOpen ? 600 : 500,
          fontSize: 15, color: isOpen ? tk.accent : tk.ink,
          lineHeight: 1.4, transition: 'all 0.2s ease',
        }}>
          {faq.question}
        </span>
      </div>
      <div style={{
        width: 28, height: 28, borderRadius: 8,
        background: isOpen ? `${tk.accent}10` : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s ease',
      }}>
        <ChevronDownIcon style={{
          width: 16, height: 16, color: isOpen ? tk.accent : tk.textMut,
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }} />
      </div>
    </button>
    
    {isOpen && (
      <div style={{
        padding: '4px 24px 20px 70px',
        fontSize: 14, color: tk.textSec, lineHeight: 1.65,
        background: tk.surface,
        borderTop: `1px solid ${tk.border}`,
      }}>
        <div style={{
          position: 'relative',
          paddingLeft: 16,
          borderLeft: `3px solid ${tk.accent}30`,
        }}>
          {faq.answer}
        </div>
      </div>
    )}
  </div>
);

// ─── Help Page ─────────────────────────────────────────────────────────────
const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Toutes');

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Toutes' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ minHeight: '100vh', background: tk.surface }}>

      {/* ─────────────── HERO — identique à ClientsList ─────────────── */}
      <section className="easy-internal-header" style={{
        position: 'relative', height: 320,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
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
              CENTRE D'AIDE
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Comment pouvons-nous{' '}
            <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              vous aider ?
            </span>
          </h1>
          <p style={{ color: '#37312a', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
            Trouvez des réponses dans notre FAQ, consultez les guides ou contactez directement notre équipe support.
          </p>

          {/* Recherche */}
          <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
            <MagnifyingGlassIcon style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              width: 18, height: 18, color: '#37312a', zIndex: 1,
            }} />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={inputStyle}
              onFocus={e => { e.currentTarget.style.background = 'rgba(255,255,255,.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.4)'; }}
              onBlur={e => { e.currentTarget.style.background = 'rgba(255,255,255,.15)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.25)'; }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'rgba(255,255,255,.6)',
                  fontSize: 18, cursor: 'pointer', zIndex: 1,
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Fond decoratif retire : en-tete interne neutre. */}
      </section>

      {/* ─────────────── CONTENU ─────────────── */}
      <div className="page-content" style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 48px' }}>

        {/* Stats rapides */}
        <div className="grid-kpi-4" style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 16, marginBottom: 48,
        }}>
          {stats.map((stat, idx) => (
            <div key={idx} style={{
              background: '#fff', borderRadius: 16, padding: '20px 16px',
              border: `1.5px solid ${tk.border}`, textAlign: 'center',
              boxShadow: '0 2px 8px rgba(23,22,20,.04)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(23,22,20,.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(23,22,20,.04)'; }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: `${stat.color}10`, margin: '0 auto 12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <stat.icon style={{ width: 24, height: 24, color: stat.color }} />
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: stat.color, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: tk.textMut }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Guides */}
        <div style={{ marginBottom: 56 }}>
          <h2 style={{
            fontSize: 24, fontWeight: 700, color: tk.ink, textAlign: 'center',
            marginBottom: 12, fontFamily: "'Open Sans',Arial,sans-serif",
          }}>
            Guides & Ressources
          </h2>
          <p style={{ textAlign: 'center', color: tk.textSec, fontSize: 14, marginBottom: 40 }}>
            Tout ce dont vous avez besoin pour maîtriser EASY
          </p>
          <div className="grid-kpi-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {guides.map((guide, i) => {
              const Icon = guide.icon;
              return (
                <div key={i} style={{
                  background: '#fff', borderRadius: 20, padding: 28,
                  border: `1.5px solid ${tk.border}`, cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.borderColor = guide.color; e.currentTarget.style.boxShadow = `0 20px 40px ${guide.color}15`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = tk.border; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 16,
                      background: `${guide.color}10`, display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon style={{ width: 28, height: 28, color: guide.color }} />
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '4px 12px',
                      borderRadius: 99, background: `${guide.color}10`,
                      color: guide.color,
                    }}>
                      {guide.badge}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: tk.ink, marginBottom: 10 }}>{guide.title}</h3>
                  <p style={{ fontSize: 14, color: tk.textSec, lineHeight: 1.5 }}>{guide.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section Élégante */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: `${tk.accent}08`, padding: '6px 16px',
              borderRadius: 99, marginBottom: 16,
            }}>
              <UserGroupIcon style={{ width: 14, height: 14, color: tk.accent }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: tk.accent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                FAQ
              </span>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 12 }}>
              Questions fréquentes
            </h2>
            <p style={{ fontSize: 14, color: tk.textSec, maxWidth: 500, margin: '0 auto' }}>
              Les réponses aux questions les plus courantes
            </p>
          </div>

          {/* Categories tabs */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 12,
            marginBottom: 32, flexWrap: 'wrap',
          }}>
            {['Toutes', ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 20px', borderRadius: 99,
                  background: activeCategory === cat ? tk.accent : 'transparent',
                  color: activeCategory === cat ? '#fff' : tk.textSec,
                  border: activeCategory === cat ? 'none' : `1.5px solid ${tk.border}`,
                  fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = tk.accent;
                    e.currentTarget.style.color = tk.accent;
                  }
                }}
                onMouseLeave={e => {
                  if (activeCategory !== cat) {
                    e.currentTarget.style.borderColor = tk.border;
                    e.currentTarget.style.color = tk.textSec;
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          {filteredFaqs.length > 0 ? (
            <div style={{
              background: '#fff', borderRadius: 24,
              border: `1.5px solid ${tk.border}`,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(23,22,20,.04)',
            }}>
              {filteredFaqs.map((faq, i) => (
                <FaqItem
                  key={i}
                  faq={faq}
                  index={i}
                  isOpen={activeFaq === i}
                  onToggle={() => setActiveFaq(activeFaq === i ? null : i)}
                />
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center', padding: '64px 24px',
              background: '#fff', borderRadius: 24, border: `1.5px solid ${tk.border}`,
            }}>
              <MagnifyingGlassIcon style={{ width: 56, height: 56, color: tk.textMut, margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 600, color: tk.ink, marginBottom: 8 }}>Aucun résultat trouvé</h3>
              <p style={{ fontSize: 14, color: tk.textSec, marginBottom: 20 }}>Aucune question ne correspond à votre recherche.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('Toutes'); }}
                style={{
                  padding: '8px 24px', borderRadius: 10,
                  background: tk.accent, color: '#fff', border: 'none',
                  fontSize: 13, fontWeight: 500, cursor: 'pointer',
                }}
              >
                Effacer les filtres
              </button>
            </div>
          )}
        </div>

            {/* Support */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${tk.accent}08`, padding: '6px 16px',
            borderRadius: 99, marginBottom: 16,
          }}>
            <ChatBubbleLeftRightIcon style={{ width: 14, height: 14, color: tk.accent }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: tk.accent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Assistance
            </span>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: tk.ink, fontFamily: "'Open Sans',Arial,sans-serif", marginBottom: 12 }}>
            Contacter le support
          </h2>
          <p style={{ fontSize: 14, color: tk.textSec, maxWidth: 500, margin: '0 auto' }}>
            Une question spécifique ? Notre équipe est là pour vous aider
          </p>
        </div>

        <div className="grid-kpi-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {/* Chat en direct */}
          <div style={{
            background: '#fff', borderRadius: 20, padding: 28, textAlign: 'center',
            border: `1.5px solid ${tk.border}`, transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(23,22,20,.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: `${tk.emerald}10`, margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ChatBubbleLeftRightIcon style={{ width: 32, height: 32, color: tk.emerald }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: tk.ink }}>Chat en direct</h3>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: tk.emerald }} />
            </div>
            <p style={{ fontSize: 13, color: tk.textSec, marginBottom: 16 }}>Notre équipe répond en moins de 2 minutes</p>
            <button 
              onClick={() => window.open('https://wa.me/1234567890', '_blank')}
              style={{
                fontSize: 14, fontWeight: 500, color: tk.emerald,
                background: 'none', border: 'none', cursor: 'pointer',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = tk.accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = tk.emerald; }}>
              Démarrer un chat →
            </button>
          </div>

          {/* WhatsApp */}
          <div style={{
            background: '#fff', borderRadius: 20, padding: 28, textAlign: 'center',
            border: `1.5px solid ${tk.border}`, transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(23,22,20,.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: '#25D36610', margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.032 2.00195C6.282 2.00195 1.659 6.62495 1.659 12.375C1.659 14.106 2.096 15.757 2.878 17.227L1.561 21.696C1.478 21.992 1.711 22.286 2.016 22.286L6.885 20.933C8.301 21.616 9.882 22.023 11.551 22.023C17.851 22.023 22.405 16.986 22.405 10.686C22.405 4.386 17.832 2.00195 12.032 2.00195Z" fill="#25D366"/>
                <path d="M12.032 4.00195C16.832 4.00195 20.405 7.27495 20.405 11.975C20.405 16.675 16.832 19.975 11.551 19.975C10.182 19.975 8.882 19.675 7.682 19.175L6.882 18.875L4.282 19.675L5.082 17.375C4.432 16.275 4.082 15.075 4.082 13.775C4.082 8.97495 7.232 4.00195 12.032 4.00195Z" fill="white"/>
                <path d="M9.5 8.5C9.3 8.5 9.1 8.6 8.9 8.8C8.7 9 8.5 9.3 8.5 9.6C8.5 10.1 8.7 10.9 9.1 11.7C9.5 12.5 10.1 13.3 10.9 14.1C11.7 14.9 12.5 15.4 13.3 15.8C13.8 16 14.2 16.1 14.6 16.1C14.9 16.1 15.1 16 15.3 15.8C15.5 15.6 15.7 15.3 15.7 15C15.7 14.7 15.6 14.5 15.4 14.3L14.2 13.5C14 13.4 13.7 13.3 13.5 13.2C13.3 13.1 13.1 13.2 13 13.4L12.6 14C12.5 14.1 12.4 14.2 12.2 14.2C12.1 14.2 11.9 14.1 11.7 14C11.3 13.8 10.8 13.4 10.4 13C10 12.6 9.7 12.1 9.5 11.7C9.4 11.5 9.4 11.3 9.5 11.2L9.9 10.7C10 10.5 10.1 10.3 10 10.1C9.9 9.9 9.8 9.6 9.6 9.4L9.1 8.9C8.9 8.7 8.7 8.6 8.5 8.6C8.4 8.5 8.4 8.5 8.5 8.5H9.5Z" fill="#25D366"/>
              </svg>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: tk.ink }}>WhatsApp</h3>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: tk.emerald }} />
            </div>
            <p style={{ fontSize: 13, color: tk.textSec, marginBottom: 16 }}>Réponse instantanée 7j/7</p>
            <a 
              href="https://wa.me/243123456789?text=Bonjour%2C%20j%27ai%20besoin%20d%27aide%20sur%20EASY"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 14, fontWeight: 500, color: '#25D366',
                background: 'none', border: 'none', cursor: 'pointer',
                textDecoration: 'none', display: 'inline-block',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = tk.accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#25D366'; }}>
              Écrire sur WhatsApp →
            </a>
          </div>

          {/* Support email */}
          <div style={{
            background: '#fff', borderRadius: 20, padding: 28, textAlign: 'center',
            border: `1.5px solid ${tk.border}`, transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(23,22,20,.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: `${tk.accent}10`, margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <EnvelopeIcon style={{ width: 32, height: 32, color: tk.accent }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: tk.ink }}>Support email</h3>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: tk.emerald }} />
            </div>
            <p style={{ fontSize: 13, color: tk.textSec, marginBottom: 16 }}>Réponse garantie sous 24h ouvrées</p>
            <a 
              href="mailto:support@cargosphere.com?subject=Demande d'aide - EASY&body=Bonjour,%0D%0A%0D%0AJe contacte le support concernant :"
              style={{
                fontSize: 14, fontWeight: 500, color: tk.accent,
                background: 'none', border: 'none', cursor: 'pointer',
                textDecoration: 'none', display: 'inline-block',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = tk.accentDark; }}
              onMouseLeave={e => { e.currentTarget.style.color = tk.accent; }}>
              support@cargosphere.com →
            </a>
          </div>

          {/* Téléphone */}
          <div style={{
            background: '#fff', borderRadius: 20, padding: 28, textAlign: 'center',
            border: `1.5px solid ${tk.border}`, transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(23,22,20,.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: `${tk.purple}10`, margin: '0 auto 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <PhoneIcon style={{ width: 32, height: 32, color: tk.purple }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: tk.ink }}>Téléphone</h3>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: tk.amber }} />
            </div>
            <p style={{ fontSize: 13, color: tk.textSec, marginBottom: 16 }}>Du lundi au vendredi, 9h–18h</p>
            <a 
              href="tel:+33123456789"
              style={{
                fontSize: 14, fontWeight: 500, color: tk.purple,
                background: 'none', border: 'none', cursor: 'pointer',
                textDecoration: 'none', display: 'inline-block',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = tk.accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = tk.purple; }}>
              +33 1 23 45 67 89 →
            </a>
          </div>
        </div>
      </div>
        {/* CTA */}
        <div style={{
          background: `linear-gradient(135deg, ${tk.ink} 0%, ${tk.ink80} 100%)`,
          borderRadius: 28, padding: '56px 32px', textAlign: 'center',
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 16, fontFamily: "'Open Sans',Arial,sans-serif" }}>
            Vous n'avez pas trouvé de réponse ?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,.7)', marginBottom: 32, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Notre équipe support est disponible pour répondre à toutes vos questions personnalisées.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            <a
              href="mailto:support@cargosphere.com"
              style={{
                padding: '14px 32px', borderRadius: 14,
                background: '#fff', color: tk.ink, border: 'none',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10,
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <EnvelopeIcon style={{ width: 18, height: 18 }} />
              Envoyer un email
            </a>
            <button style={{
              padding: '14px 32px', borderRadius: 14,
              background: 'transparent', color: '#fff', border: `2px solid rgba(255,255,255,.3)`,
              fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 10,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.3)'; e.currentTarget.style.background = 'transparent'; }}>
              <ChatBubbleLeftRightIcon style={{ width: 18, height: 18 }} />
              Démarrer un chat
            </button>
          </div>
        </div>

      </div>


      <style>{`
        @keyframes zoom-slow { from { transform: scale(1); } to { transform: scale(1.06); } }
      `}</style>
    </div>
  );
};

export default Help;