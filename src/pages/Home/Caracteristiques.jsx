import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import Footer from '../../components/Layout/Footer'
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
    SparklesIcon,
    MagnifyingGlassIcon,
    DocumentTextIcon,
    BellIcon,
    CreditCardIcon,
    CameraIcon,
    ArrowPathIcon,
    ClockIcon,
    XMarkIcon
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

const Caracteristiques = () => {
    const [scrollY, setScrollY] = useState(0);
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Empêcher le scroll quand le modal est ouvert
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    const categories = [
        { id: 'all', name: 'Toutes', icon: SparklesIcon },
        { id: 'gestion', name: 'Gestion', icon: BuildingOfficeIcon },
        { id: 'suivi', name: 'Suivi & Tracking', icon: MagnifyingGlassIcon },
        { id: 'marketplace', name: 'Marketplace', icon: GlobeAltIcon },
        { id: 'paiements', name: 'Paiements', icon: CreditCardIcon },
        { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
    ];

    const features = [
        {
            id: 1,
            category: 'gestion',
            title: 'Gestion des clients',
            description: 'CRM intégré pour gérer tous vos clients et leur historique',
            icon: UserGroupIcon,
            color: 'from-blue-500 to-cyan-500',
            bgLight: 'bg-blue-50',
            textColor: 'text-blue-600',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            details: [
                'Fiches clients détaillées',
                'Historique des colis',
                'Gestion des contacts',
                'Import/Export CSV',
                'Segmentation clients',
                'Tags personnalisés',
            ],
            stats: { value: '5000+', label: 'Clients gérés' },
            link: '/clients',
            longDescription: 'Notre CRM intégré vous permet de gérer l\'intégralité de vos relations clients. Accédez à l\'historique complet des colis, gérez les contacts, et segmentez votre clientèle pour un suivi personnalisé.'
        },
        {
            id: 2,
            category: 'gestion',
            title: 'Gestion des employés',
            description: 'Administrez vos équipes et leurs permissions',
            icon: UserGroupIcon,
            color: 'from-purple-500 to-pink-500',
            bgLight: 'bg-purple-50',
            textColor: 'text-purple-600',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            details: [
                'Gestion des rôles',
                'Permissions granulaires',
                'Planning des équipes',
                'Suivi des performances',
                'Feuilles de temps',
                'Congés & absences',
            ],
            stats: { value: '200+', label: 'Employés max' },
            link: '/employees',
            longDescription: 'Une gestion complète de vos équipes avec des permissions granulaires, un planning intégré et un suivi des performances en temps réel.'
        },
        {
            id: 3,
            category: 'gestion',
            title: 'Multi-agences',
            description: 'Gérez plusieurs agences depuis une seule interface',
            icon: BuildingOfficeIcon,
            color: 'from-emerald-500 to-teal-500',
            bgLight: 'bg-emerald-50',
            textColor: 'text-emerald-600',
            image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80',
            details: [
                'Vue consolidée',
                'Reporting par agence',
                'Transferts entre agences',
                'Stock centralisé',
                'Indicateurs locaux',
                'Hiérarchie flexible',
            ],
            stats: { value: '50+', label: 'Agences' },
            link: '/agencies',
            longDescription: 'Centralisez la gestion de toutes vos agences avec une vue consolidée, des rapports détaillés et une hiérarchie flexible.'
        },
        {
            id: 4,
            category: 'suivi',
            title: 'Tracking en temps réel',
            description: 'Suivez vos colis minute par minute',
            icon: TruckIcon,
            color: 'from-orange-500 to-red-500',
            bgLight: 'bg-orange-50',
            textColor: 'text-orange-600',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzzfJynllNrFuW_0aZ90cgqyHW0mJQaltPjw&s',
            details: [
                'Géolocalisation GPS',
                'Notifications push',
                'Historique complet',
                'Photos des étapes',
                'Signature électronique',
                'Preuve de livraison',
            ],
            stats: { value: '99.9%', label: 'Fiabilité' },
            link: '/tracking',
            longDescription: 'Un suivi ultra-précis de vos colis avec géolocalisation en temps réel, notifications automatiques et preuves de livraison électroniques.'
        },
        {
            id: 5,
            category: 'suivi',
            title: 'Gestion des colis',
            description: 'Interface complète pour gérer tous vos envois',
            icon: CubeIcon,
            color: 'from-amber-500 to-yellow-500',
            bgLight: 'bg-amber-50',
            textColor: 'text-amber-600',
            image: 'https://files.sbcdnsb.com/images/yEyu8Abt6u7tVG7AjOD8ig/content/1753025242/1279728/image4.png',
            details: [
                'Création rapide',
                'Étiquettes automatiques',
                'Calcul des tarifs',
                'Colis groupés',
                'Colis fragiles',
                'Assurance incluse',
            ],
            stats: { value: '10K+', label: 'Colis/jour' },
            link: '/packages',
            longDescription: 'Une interface intuitive pour créer et gérer tous vos colis avec calcul automatique des tarifs, génération d\'étiquettes et options pour colis spéciaux.'
        },
        {
            id: 6,
            category: 'marketplace',
            title: 'Marketplace produits',
            description: 'Achetez et vendez des produits entre professionnels',
            icon: GlobeAltIcon,
            color: 'from-indigo-500 to-blue-500',
            bgLight: 'bg-indigo-50',
            textColor: 'text-indigo-600',
            image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            details: [
                'Catalogue produits',
                'Upload images',
                'Recherche avancée',
                'Filtres par catégorie',
                'Gestion des stocks',
                'Commandes groupées',
            ],
            stats: { value: '5000+', label: 'Produits' },
            link: '/marketplace/products',
            longDescription: 'Une marketplace B2B complète pour acheter et vendre des produits avec gestion des stocks, upload d\'images et recherche avancée.'
        },
        {
            id: 7,
            category: 'marketplace',
            title: 'Marketplace de kilos',
            description: 'Optimisez vos coûts en partageant l\'espace',
            icon: CurrencyDollarIcon,
            color: 'from-rose-500 to-pink-500',
            bgLight: 'bg-rose-50',
            textColor: 'text-rose-600',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            details: [
                'Achat/vente de kilos',
                'Négociation prix',
                'Contrats sécurisés',
                'Paiements intégrés',
                'Évaluation vendeurs',
                'Litiges gérés',
            ],
            stats: { value: '-30%', label: 'Économies' },
            link: '/marketplace/kilos',
            longDescription: 'Optimisez vos coûts en achetant ou vendant des kilos d\'espace avec d\'autres expéditeurs. Transactions sécurisées et évaluations transparentes.'
        },
        {
            id: 8,
            category: 'paiements',
            title: 'Paiements intégrés',
            description: 'Solutions de paiement multiples et sécurisées',
            icon: CreditCardIcon,
            color: 'from-cyan-500 to-blue-500',
            bgLight: 'bg-cyan-50',
            textColor: 'text-cyan-600',
            image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            details: [
                'Carte bancaire',
                'Virement',
                'PayPal',
                'Paiement différé',
                'Facturation auto',
                'Rapprochement',
            ],
            stats: { value: '100%', label: 'Sécurisé' },
            link: '/payments',
            longDescription: 'Des solutions de paiement multiples et entièrement sécurisées avec facturation automatique et rapprochement bancaire intégré.'
        },
        {
            id: 9,
            category: 'paiements',
            title: 'Génération PDF facture',
            description: 'Factures professionnelles automatiques',
            icon: DocumentTextIcon,
            color: 'from-teal-500 to-emerald-500',
            bgLight: 'bg-teal-50',
            textColor: 'text-teal-600',
            image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            details: [
                'Factures personnalisées',
                'Envoi automatique',
                'Format PDF/A',
                'Archivage légal',
                'Duplicata instantané',
                'TVA gérée',
            ],
            stats: { value: 'Auto', label: 'Génération' },
            link: '/payments/invoice',
            longDescription: 'Générez automatiquement des factures professionnelles au format PDF, avec envoi automatique et archivage légal conforme.'
        },
        {
            id: 10,
            category: 'notifications',
            title: 'Notifications email/SMS',
            description: 'Tenez vos clients informés à chaque étape',
            icon: BellIcon,
            color: 'from-violet-500 to-purple-500',
            bgLight: 'bg-violet-50',
            textColor: 'text-violet-600',
            image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80',
            details: [
                'Templates personnalisables',
                'SMS automatiques',
                'Emails transactionnels',
                'Notifications push',
                'Calendrier d\'envoi',
                'Statistiques ouvertures',
            ],
            stats: { value: '24/7', label: 'Notifications' },
            link: '/notifications',
            longDescription: 'Un système de notification multicanal (email, SMS, push) pour tenir vos clients informés à chaque étape du processus.'
        },
        {
            id: 11,
            category: 'upload',
            title: 'Upload images produits',
            description: 'Gérez facilement les photos de vos produits',
            icon: CameraIcon,
            color: 'from-fuchsia-500 to-pink-500',
            bgLight: 'bg-fuchsia-50',
            textColor: 'text-fuchsia-600',
            image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            details: [
                'Upload multiple',
                'Compression auto',
                'Recadrage intégré',
                'Galerie produits',
                'Zoom HD',
                'Marque blanche',
            ],
            stats: { value: '4K', label: 'Max pixels' },
            link: '/marketplace/products/add',
            longDescription: 'Une interface d\'upload d\'images intuitive avec compression automatique, recadrage intégré et galerie produits.'
        },
        {
            id: 12,
            category: 'analytics',
            title: 'Dashboard analytics',
            description: 'Visualisez vos performances en temps réel',
            icon: ChartBarIcon,
            color: 'from-sky-500 to-blue-500',
            bgLight: 'bg-sky-50',
            textColor: 'text-sky-600',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            details: [
                'Graphiques interactifs',
                'Indicateurs clés',
                'Rapports exportables',
                'Prévisions IA',
                'Comparaisons',
                'Partage d\'accès',
            ],
            stats: { value: '+45%', label: 'Performance' },
            link: '/analytics',
            longDescription: 'Un dashboard analytics complet avec graphiques interactifs, indicateurs clés en temps réel et rapports exportables.'
        },
    ];

    const filteredFeatures = activeCategory === 'all'
        ? features
        : features.filter(f => f.category === activeCategory);

    const openModal = (feature) => {
        setSelectedFeature(feature);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFeature(null);
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <div style={{ minHeight: '100vh', background: tk.surface, overflowX: 'hidden' }}>
            <Navbar />

            {/* ─────────────── HERO — identique à ClientsList ─────────────── */}
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
                        <SparklesIcon style={{ width: 14, height: 14, color: '#ecd5a3' }} />
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', fontFamily: "'Open Sans', Arial, sans-serif" }}>
                            Fonctionnalités avancées
                        </span>
                    </div>

                    <h1 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                        Tout ce dont vous avez besoin{' '}
                        <span style={{ background: 'linear-gradient(90deg,#ecd5a3,#f0dbb3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
                            en un seul endroit
                        </span>
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 16, lineHeight: 1.6, marginBottom: 32, maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
                        Découvrez l'ensemble des fonctionnalités qui font de EASY
                        la plateforme logistique préférée des professionnels.
                    </p>
                </div>

                {/* Wave bottom */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 50" style={{ width: '100%', display: 'block' }}>
                        <path fill={tk.surface} d="M0,20L80,24C160,28,320,36,480,35C640,34,800,24,960,21C1120,18,1280,22,1360,24L1440,26L1440,50L0,50Z" />
                    </svg>
                </div>
            </section>

            {/* ========== STATS CARD (optionnelle, style moderne) ========== */}
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 0' }}>
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 16, marginTop: -40, position: 'relative', zIndex: 20,
                }}>
                    {[
                        { value: '98%', label: 'Clients satisfaits', icon: ChartBarIcon },
                        { value: '24/7', label: 'Support disponible', icon: PhoneIcon },
                        { value: '50+', label: 'Pays desservis', icon: GlobeAltIcon },
                        { value: '15K+', label: 'Colis par jour', icon: TruckIcon },
                    ].map((stat, idx) => {
                        const Icon = stat.icon;
                        return (
                            <div key={idx} style={{
                                background: '#fff', borderRadius: 20, padding: '18px 16px',
                                textAlign: 'center', border: `1.5px solid ${tk.border}`,
                                boxShadow: '0 8px 24px rgba(23,22,20,.08)',
                                transition: 'all .2s',
                            }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 14,
                                    background: 'rgba(167,123,40,.08)', display: 'flex',
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

            {/* ========== FILTRES PAR CATÉGORIE ========== */}
            <section style={{ padding: '48px 24px 0' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = activeCategory === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 8,
                                        padding: '8px 20px', borderRadius: 40,
                                        fontSize: 13, fontWeight: 600, fontFamily: "'Open Sans', Arial, sans-serif",
                                        transition: 'all .2s',
                                        cursor: 'pointer',
                                        background: isActive ? tk.accent : '#fff',
                                        color: isActive ? '#fff' : tk.textSec,
                                        border: `1.5px solid ${isActive ? tk.accent : tk.border}`,
                                        boxShadow: isActive ? '0 4px 12px rgba(167,123,40,.3)' : 'none',
                                    }}
                                >
                                    <Icon style={{ width: 16, height: 16 }} />
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========== GRILLE DES FONCTIONNALITÉS ========== */}
            <section style={{ padding: '48px 24px 64px' }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                        gap: 24,
                    }}>
                        {filteredFeatures.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.id}
                                    style={{
                                        background: '#fff', borderRadius: 24,
                                        border: `1.5px solid ${tk.border}`,
                                        overflow: 'hidden',
                                        transition: 'all .3s cubic-bezier(0.2, 0, 0, 1)',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(23,22,20,.04)',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 16px 32px rgba(23,22,20,.12)';
                                        e.currentTarget.style.borderColor = tk.accent;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(23,22,20,.04)';
                                        e.currentTarget.style.borderColor = tk.border;
                                    }}
                                >
                                    {/* Image d'en-tête */}
                                    <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: `linear-gradient(135deg, ${feature.color.split(' ')[1]} 0%, ${feature.color.split(' ')[3]} 100%)`,
                                            opacity: 0.85, zIndex: 1,
                                        }} />
                                        <img
                                            src={feature.image}
                                            alt={feature.title}
                                            style={{
                                                width: '100%', height: '100%', objectFit: 'cover',
                                                transition: 'transform .5s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                        <div style={{
                                            position: 'absolute', top: 12, right: 12,
                                            background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(8px)',
                                            borderRadius: 99, padding: '4px 12px', zIndex: 2,
                                        }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
                                                {feature.stats.value}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Contenu */}
                                    <div style={{ padding: 20 }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                                            <div style={{
                                                width: 48, height: 48, borderRadius: 14,
                                                background: feature.bgLight,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                flexShrink: 0,
                                            }}>
                                                <Icon style={{ width: 24, height: 24, color: feature.textColor.replace('text-', '').replace('-600', ''), strokeWidth: 1.5 }} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: 17, fontWeight: 700, color: tk.ink, marginBottom: 4, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                                                    {feature.title}
                                                </h3>
                                                <p style={{ fontSize: 13, color: tk.textSec, lineHeight: 1.4 }}>
                                                    {feature.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: 16 }}>
                                            {feature.details.slice(0, 4).map((detail, i) => (
                                                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                                                    <CheckIcon style={{ width: 14, height: 14, color: tk.accent, flexShrink: 0, marginTop: 2 }} />
                                                    <span style={{ fontSize: 12, color: tk.textSec }}>{detail}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            paddingTop: 12, borderTop: `1px solid ${tk.border}`,
                                        }}>
                                            <span style={{ fontSize: 11, color: tk.textMut }}>{feature.stats.label}</span>
                                            <div style={{ display: 'flex', gap: 12 }}>
                                                <button
                                                    onClick={() => openModal(feature)}
                                                    style={{
                                                        fontSize: 12, fontWeight: 600, color: tk.accent,
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', gap: 4,
                                                    }}
                                                >
                                                    Détails
                                                    <ChevronRightIcon style={{ width: 14, height: 14 }} />
                                                </button>
                                                <button
                                                    onClick={() => handleNavigation(feature.link)}
                                                    style={{
                                                        fontSize: 12, fontWeight: 600, color: tk.textMut,
                                                        background: 'none', border: 'none', cursor: 'pointer',
                                                    }}
                                                    title="Accéder à la page"
                                                >
                                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: tk.textMut, display: 'inline-block' }} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ========== MODAL ========== */}
            {isModalOpen && selectedFeature && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 16,
                }}>
                    <div
                        style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(4px)',
                        }}
                        onClick={closeModal}
                    />
                    <div style={{
                        position: 'relative', background: '#fff', borderRadius: 28,
                        maxWidth: 600, width: '100%', maxHeight: '90vh', overflow: 'auto',
                        boxShadow: '0 24px 48px rgba(0,0,0,.25)',
                    }}>
                        {/* Header avec image */}
                        <div style={{ position: 'relative', height: 200, overflow: 'hidden', borderRadius: '28px 28px 0 0' }}>
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: `linear-gradient(135deg, ${selectedFeature.color.split(' ')[1]} 0%, ${selectedFeature.color.split(' ')[3]} 100%)`,
                                opacity: 0.85, zIndex: 1,
                            }} />
                            <img
                                src={selectedFeature.image}
                                alt={selectedFeature.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <button
                                onClick={closeModal}
                                style={{
                                    position: 'absolute', top: 16, right: 16, zIndex: 2,
                                    width: 36, height: 36, borderRadius: 99,
                                    background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(8px)',
                                    border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: '#fff',
                                }}
                            >
                                <XMarkIcon style={{ width: 18, height: 18 }} />
                            </button>
                        </div>

                        <div style={{ padding: 28 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                                <div style={{
                                    width: 56, height: 56, borderRadius: 16,
                                    background: selectedFeature.bgLight,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <selectedFeature.icon style={{ width: 28, height: 28, color: selectedFeature.textColor.replace('text-', '').replace('-600', '') }} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: 22, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans', Arial, sans-serif", marginBottom: 4 }}>
                                        {selectedFeature.title}
                                    </h2>
                                    <p style={{ fontSize: 12, color: tk.textMut, textTransform: 'capitalize' }}>{selectedFeature.category}</p>
                                </div>
                            </div>

                            <p style={{ fontSize: 14, color: tk.textSec, lineHeight: 1.6, marginBottom: 24 }}>
                                {selectedFeature.longDescription}
                            </p>

                            <div style={{ marginBottom: 24 }}>
                                <h3 style={{ fontSize: 13, fontWeight: 700, color: tk.ink, marginBottom: 12 }}>
                                    Fonctionnalités détaillées :
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    {selectedFeature.details.map((detail, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                            <CheckIcon style={{ width: 14, height: 14, color: tk.accent, flexShrink: 0, marginTop: 2 }} />
                                            <span style={{ fontSize: 13, color: tk.textSec }}>{detail}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{
                                background: tk.surface, borderRadius: 16, padding: 16, marginBottom: 24,
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <span style={{ fontSize: 13, color: tk.textSec }}>Statistique clé :</span>
                                <span style={{ fontSize: 20, fontWeight: 800, color: tk.accent, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                                    {selectedFeature.stats.value}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: 12 }}>
                                <Link
                                    to={selectedFeature.link}
                                    onClick={closeModal}
                                    style={{
                                        flex: 1, padding: '12px 20px', borderRadius: 14,
                                        background: tk.accent, color: '#fff', border: 'none',
                                        fontSize: 14, fontWeight: 600, fontFamily: "'Open Sans', Arial, sans-serif",
                                        textAlign: 'center', textDecoration: 'none',
                                        cursor: 'pointer', boxShadow: '0 4px 14px rgba(167,123,40,.3)',
                                    }}
                                >
                                    Accéder à la fonctionnalité
                                </Link>
                                <button
                                    onClick={closeModal}
                                    style={{
                                        padding: '12px 24px', borderRadius: 14,
                                        background: '#fff', border: `1.5px solid ${tk.border}`,
                                        fontSize: 14, fontWeight: 500, color: tk.textSec,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== SECTION AVANTAGES ========== */}
            <section style={{ padding: '64px 24px 80px', background: tk.surface }}>
                <div style={{ maxWidth: 1280, margin: '0 auto' }}>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                        gap: 48, alignItems: 'center',
                    }}>
                        {/* LEFT CONTENT */}
                        <div>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 10,
                                background: 'rgba(167,123,40,.08)', borderRadius: 99,
                                padding: '6px 16px', marginBottom: 20,
                            }}>
                                <ClockIcon style={{ width: 14, height: 14, color: tk.accent }} />
                                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tk.accent, fontFamily: "'Open Sans', Arial, sans-serif" }}>
                                    Mise à jour continue
                                </span>
                            </div>

                            <h2 style={{ fontSize: 'clamp(28px,3vw,40px)', fontWeight: 800, color: tk.ink, marginBottom: 20, fontFamily: "'Open Sans', Arial, sans-serif", lineHeight: 1.2 }}>
                                Des fonctionnalités qui évoluent
                                <span style={{
                                    display: 'block', background: `linear-gradient(90deg, ${tk.accent}, #f0dbb3)`,
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                }}>
                                    avec votre entreprise
                                </span>
                            </h2>

                            <p style={{ fontSize: 15, color: tk.textSec, lineHeight: 1.6, marginBottom: 28 }}>
                                Notre équipe développe constamment de nouvelles fonctionnalités
                                pour répondre à vos besoins. Chaque mois, des améliorations sont
                                déployées pour vous offrir une expérience toujours plus performante.
                            </p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                {[
                                    'Mises à jour mensuelles',
                                    'Fonctionnalités votées par les clients',
                                    'Roadmap transparente',
                                    'Accès bêta exclusif',
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{
                                            width: 22, height: 22, borderRadius: 22,
                                            background: 'rgba(5,150,105,.12)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <CheckIcon style={{ width: 12, height: 12, color: tk.emerald }} />
                                        </div>
                                        <span style={{ fontSize: 14, color: tk.ink, fontWeight: 500 }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT IMAGE */}
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                position: 'absolute', top: -20, left: -20, width: 200, height: 200,
                                background: `radial-gradient(circle, ${tk.accent}10 0%, transparent 70%)`,
                                borderRadius: '50%', filter: 'blur(40px)',
                            }} />
                            <img
                                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                                alt="Équipe EASY"
                                style={{
                                    width: '100%', borderRadius: 28, boxShadow: '0 20px 40px rgba(0,0,0,.1)',
                                    transition: 'transform .4s',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== CTA FINAL ========== */}
            <section style={{
                position: 'relative', padding: '80px 24px', textAlign: 'center',
                overflow: 'hidden', background: tk.ink,
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: "url('/images/easy-public/entrepot.jpg')",
                    backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3,
                }} />
                <div style={{ position: 'relative', zIndex: 2, maxWidth: 720, margin: '0 auto' }}>
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
                        Prêt à tester toutes ces fonctionnalités ?
                    </h2>

                    <p style={{ fontSize: 18, color: 'rgba(255,255,255,.7)', marginBottom: 32, lineHeight: 1.5 }}>
                        Rejoignez des milliers d'entreprises qui utilisent déjà EASY au quotidien
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
                        <Link
                            to="/register"
                            style={{
                                padding: '12px 28px', borderRadius: 14, background: '#fff', color: tk.accent,
                                fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: "'Open Sans', Arial, sans-serif",
                                boxShadow: '0 8px 24px rgba(0,0,0,.2)', transition: 'transform .2s',
                            }}
                        >
                            Commencer gratuitement
                        </Link>
                        <Link
                            to="/contact"
                            style={{
                                padding: '12px 28px', borderRadius: 14, background: 'transparent', color: '#fff',
                                fontSize: 14, fontWeight: 600, textDecoration: 'none', fontFamily: "'Open Sans', Arial, sans-serif",
                                border: '2px solid rgba(255,255,255,.3)',
                                transition: 'transform .2s',
                            }}
                        >
                            Demander une démo
                        </Link>
                    </div>

                    <div style={{
                        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12,
                        marginTop: 32, fontSize: 13, color: 'rgba(255,255,255,.6)',
                    }}>
                        <span>✅ Sans engagement</span>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,.4)', margin: 'auto 0' }} />
                        <span>🎁 Essai gratuit 14 jours</span>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,.4)', margin: 'auto 0' }} />
                        <span>🛟 Support 24/7</span>
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

export default Caracteristiques;