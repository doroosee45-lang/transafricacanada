import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  BanknotesIcon,
  XMarkIcon,
  HomeIcon,
  UsersIcon,
  CubeIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CreditCardIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  TruckIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  UserCircleIcon,
  ScaleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../Context/AuthContext';

/* ─────────────────────────────────────────────
   DESIGN TOKENS — harmonisé avec ClientsList
───────────────────────────────────────────── */
const tk = {
  bgSidebar:   '#171614',
  bgSidebarHover: '#111827',
  border:      'rgba(255,255,255,0.06)',
  accent:      '#c7983a',
  accentLight: '#d9b465',
  emerald:     '#10b981',
  textDim:     'rgba(255,255,255,0.35)',
  textMuted:   'rgba(255,255,255,0.55)',
  textBright:  '#fff',
};

/* ─── Navigation ADMIN ─────────────────────────────────────────── */
const adminNav = [
  { name: 'TABLEAU DE BORD', to: '/app',                icon: HomeIcon },
  { name: 'CLIENTS & USERS', to: '/app/users-clients',  icon: UsersIcon },
  { name: 'COLIS',           to: '/app/packages',       icon: CubeIcon },
  { name: 'AGENCES',         to: '/app/agencies',       icon: BuildingOfficeIcon },
  { name: 'EMPLOYÉS',        to: '/app/employees',      icon: UserGroupIcon },
  { name: 'PAIEMENTS',       to: '/app/payments',       icon: CreditCardIcon },
  {
    name: 'MARKETPLACE',
    icon: ShoppingBagIcon,
    to: '/app/marketplace',
    children: [
      { name: 'Vendre vos Produits', to: '/app/marketplace/products' },
      { name: 'Acheter un kilo', to: '/app/marketplace/kilos' },
      { name: 'Mes ventes',      to: '/app/marketplace/my-sales' },
      { name: 'Mes achats kilo', to: '/app/marketplace/my-kilos-bought' },
    ],
  },
  { name: 'ANALYTICS',       to: '/app/analytics',      icon: ChartBarIcon },
  { name: 'RAPPORTS',        to: '/app/reports',        icon: DocumentTextIcon },
  { name: 'TARIFS & TAUX', to: '/app/shipping-pricing', icon: BanknotesIcon },
  { name: 'MESSAGES',        to: '/app/messages',       icon: BellIcon },
  { name: 'PARAMÈTRES',      to: '/app/settings',       icon: Cog6ToothIcon },
];

/* ─── Navigation CLIENT ────────────────────────────────────────── */
const clientNav = [
  { name: 'TABLEAU DE BORD', to: '/app',                              icon: HomeIcon },
  { name: 'MES COLIS',       to: '/app/packages',                    icon: CubeIcon },
  { name: 'SUIVI COLIS',     to: '/app/packages/tracking',              icon: TruckIcon },
  {
    name: 'MARKETPLACE',
    icon: ShoppingBagIcon,
    to: '/app/marketplace',
    children: [
      { name: 'Vendre un colis', to: '/app/marketplace/products' },
      { name: 'Acheter un kilo', to: '/app/marketplace/kilos' },
      { name: 'Mes achats',      to: '/app/marketplace/my-kilos-bought' },
    ],
  },
  { name: 'MES PAIEMENTS',   to: '/app/payments',                    icon: CreditCardIcon },
  { name: 'NOTIFICATIONS',   to: '/app/notifications',               icon: BellIcon },
  { name: 'MON PROFIL',      to: '/app/profile',                     icon: UserCircleIcon },
  { name: 'AIDE',            to: '/app/help',                        icon: QuestionMarkCircleIcon },
  { name: 'PARAMÈTRES',      to: '/app/settings',                    icon: Cog6ToothIcon },
];

/* ─── Sidebar ──────────────────────────────────────────────────── */
const Sidebar = ({ isOpen, setIsOpen }) => {
  const [expanded, setExpanded] = useState([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef(null);
  useEffect(() => { setIsOpen(false); }, [location.key, setIsOpen]);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement;
    const panel = panelRef.current;
    const items = () => Array.from(panel.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')).filter(el => el.getClientRects().length > 0);
    const focusTimer = window.setTimeout(() => items()[0]?.focus(), 60);
    const onKey = e => {
      if (e.key === 'Escape') { e.preventDefault(); setIsOpen(false); }
      if (e.key === 'Tab') {
        const list = items(), first = list[0], last = list[list.length - 1];
        if (!first) { e.preventDefault(); panel.focus(); return; }
        if (e.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { window.clearTimeout(focusTimer); document.removeEventListener('keydown', onKey); if (previous?.isConnected) previous.focus(); };
  }, [isOpen, setIsOpen]);

  const isAdmin = ['admin', 'superadmin', 'manager'].includes(user?.role);
  // Tarifs et messages de contact : administrateurs uniquement (contrôlé aussi côté serveur).
  const ADMIN_ONLY = ['/app/shipping-pricing', '/app/messages'];
  const navigation = (isAdmin ? adminNav : clientNav).filter(item => !ADMIN_ONLY.includes(item.to) || ['admin','superadmin'].includes(user?.role));

  const toggle = (name) =>
    setExpanded(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = () => {
    if (!user) return '?';
    const first = user.firstName?.[0] ?? '';
    const last  = user.lastName?.[0]  ?? '';
    return first || last
      ? (first + last).toUpperCase()
      : (user.name || 'U').slice(0, 2).toUpperCase();
  };

  const roleBadge = {
    superadmin: 'Super Admin',
    admin:      'Administrateur',
    manager:    'Manager',
    agent:      'Agent',
    client:     'Client',
  }[user?.role] ?? (user?.role || '');

  const roleColor = {
    superadmin: tk.accentLight,
    admin:      tk.accent,
    manager:    tk.emerald,
    agent:      '#f59e0b',
    client:     tk.textMuted,
  }[user?.role] ?? tk.textMuted;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .sb {
          font-family: 'Open Sans', Arial, sans-serif;
          width: 260px; min-width: 260px; max-width: 260px;
          height: 100vh;
          background: ${tk.bgSidebar};
          display: flex; flex-direction: column;
          overflow: hidden; flex-shrink: 0;
          position: fixed; top: 0; left: 0; z-index: 60;
          max-width: calc(100vw - 32px); height: 100dvh;
          transform: translateX(-100%); visibility: hidden; pointer-events: none;
          transition: transform .25s ease, visibility .25s;
        }

        /* ── Brand ── */
        .sb-brand {
          padding: 24px 20px 16px;
          border-bottom: 1px solid ${tk.border};
          flex-shrink: 0;
          display: flex; align-items: center; gap: 10px;
        }
        .sb-brand-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, ${tk.accent}, ${tk.accentLight});
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .sb-brand-icon svg { width: 18px; height: 18px; color: #fff; }
        .sb-brand-name {
          font-size: 1rem; font-weight: 800; color: #fff; letter-spacing: -0.01em;
        }
        .sb-brand-name span { color: ${tk.accentLight}; }
        .sb-brand-tagline {
          font-size: 0.58rem; color: ${tk.textDim};
          font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
        }

        /* ── Avatar ── */
        .sb-avatar-wrap {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 16px;
          border-bottom: 1px solid ${tk.border};
          flex-shrink: 0;
        }
        .sb-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          background: linear-gradient(135deg, ${tk.accent}, ${tk.accentLight});
          display: flex; align-items: center; justify-content: center;
          font-size: 0.9rem; font-weight: 700; color: #fff;
          flex-shrink: 0;
          box-shadow: 0 0 0 2px rgba(199,152,58,0.3);
          position: relative;
        }
        .sb-avatar-dot {
          position: absolute; bottom: 2px; right: 2px;
          width: 9px; height: 9px; border-radius: 50%;
          background: ${tk.emerald}; border: 2px solid ${tk.bgSidebar};
        }
        .sb-avatar-info { flex: 1; min-width: 0; }
        .sb-avatar-name {
          font-size: 0.8rem; font-weight: 600; color: #fff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          margin-bottom: 4px;
        }
        .sb-avatar-badge {
          display: inline-flex; align-items: center;
          font-size: 0.6rem; font-weight: 600;
          color: ${roleColor};
          background: rgba(199,152,58,0.12);
          border: 1px solid rgba(199,152,58,0.25);
          border-radius: 20px; padding: 2px 10px;
        }

        /* ── Nav ── */
        .sb-nav {
          flex: 1; overflow-y: auto;
          padding: 16px 12px;
          scrollbar-width: thin;
        }
        .sb-nav::-webkit-scrollbar {
          width: 4px;
          background: transparent;
        }
        .sb-nav::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
        }

        .sb-section-label {
          font-size: 0.6rem; font-weight: 700;
          color: ${tk.textDim};
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 12px 12px 8px;
        }

        .sb-link {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px;
          font-size: 0.75rem; font-weight: 500;
          color: ${tk.textMuted};
          cursor: pointer; transition: all 0.2s ease;
          margin-bottom: 2px; text-decoration: none;
          border: none; background: none; width: 100%; text-align: left;
        }
        .sb-link:hover {
          color: #fff;
          background: ${tk.bgSidebarHover};
        }
        .sb-link.active {
          color: ${tk.accentLight};
          background: rgba(199,152,58,0.12);
          border-left: 3px solid ${tk.accentLight};
          padding-left: 9px;
        }
        .sb-ico {
          width: 18px; height: 18px; flex-shrink: 0;
          opacity: 0.6; transition: opacity 0.2s;
        }
        .sb-link:hover .sb-ico { opacity: 1; }
        .sb-link.active .sb-ico { opacity: 1; color: ${tk.accentLight}; }

        .sb-chevron {
          width: 12px; height: 12px; margin-left: auto;
          opacity: 0.4; transition: transform 0.2s, opacity 0.2s; flex-shrink: 0;
        }
        .sb-chevron.open { transform: rotate(90deg); opacity: 0.8; }

        /* sub-menu */
        .sb-sub {
          margin: 4px 0 6px 36px;
          border-left: 1px solid ${tk.border};
          padding-left: 12px;
        }
        .sb-sub-link {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 10px; border-radius: 8px;
          font-size: 0.7rem; color: ${tk.textMuted};
          text-decoration: none; transition: all 0.15s; margin-bottom: 1px;
        }
        .sb-sub-link::before {
          content: ''; width: 4px; height: 4px; border-radius: 50%;
          background: ${tk.textDim}; flex-shrink: 0;
          transition: background 0.15s;
        }
        .sb-sub-link:hover { color: #fff; background: ${tk.bgSidebarHover}; }
        .sb-sub-link:hover::before { background: ${tk.accentLight}; }
        .sb-sub-link.active { color: ${tk.accentLight}; }
        .sb-sub-link.active::before { background: ${tk.accentLight}; }

        /* ── Logout ── */
        .sb-logout-wrap {
          border-top: 1px solid ${tk.border};
          padding: 12px;
          flex-shrink: 0;
        }
        .sb-logout-btn {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 10px 12px; border-radius: 10px;
          font-size: 0.75rem; font-weight: 500;
          color: ${tk.textMuted};
          cursor: pointer; transition: all 0.2s;
          border: none; background: none; text-align: left;
        }
        .sb-logout-btn:hover { color: #ef4444; background: rgba(239,68,68,0.08); }
        .sb-logout-btn:hover .sb-ico { opacity: 1; color: #ef4444; }

        /* Hamburger sur toutes les tailles, sans espace reserve. */
        .sb.open { transform: translateX(0); visibility: visible; pointer-events: auto; box-shadow: 8px 0 32px rgba(0,0,0,.18); }
        .sb-backdrop { position: fixed; inset: 0; z-index: 50; background: rgba(23,22,20,.3); }
        .sb-close { margin-left: auto; flex-shrink: 0; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,.2); border-radius: 10px; background: transparent; color: white; cursor: pointer; }
        .sb-close:hover { background: rgba(255,255,255,.12); }
        .sb-close svg { width: 20px; height: 20px; }
        @media (prefers-reduced-motion: reduce) { .sb { transition: none; } }
      `}</style>

      {/* Backdrop mobile */}
      {isOpen && (
        <div className="sb-backdrop" aria-hidden="true" onClick={() => setIsOpen(false)} />
      )}

      <aside id="easy-navigation" ref={panelRef} role="dialog" aria-modal={isOpen ? 'true' : undefined}
        aria-label="Menu de navigation EASY" aria-hidden={!isOpen} tabIndex={-1}
        inert={isOpen ? undefined : ''} className={`sb${isOpen ? ' open' : ''}`}>

        {/* ── Brand ── */}
        <div className="sb-brand">
          <div className="sb-brand-icon">
            <TruckIcon />
          </div>
          <div>
            <div className="sb-brand-name">EASY</div>
            <div className="sb-brand-tagline">Gestion logistique</div>
          </div>
          <button type="button" className="sb-close" aria-label="Fermer le menu" onClick={() => setIsOpen(false)}><XMarkIcon /></button>
        </div>

        {/* ── Avatar ── */}
        <div className="sb-avatar-wrap">
          <div className="sb-avatar">
            {initials()}
            <div className="sb-avatar-dot" />
          </div>
          <div className="sb-avatar-info">
            <div className="sb-avatar-name">
              {user?.firstName
                ? `${user.firstName} ${user.lastName ?? ''}`
                : user?.name || 'Utilisateur'}
            </div>
            <div className="sb-avatar-badge">{roleBadge}</div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="sb-nav">
          <div className="sb-section-label">
            {isAdmin ? 'Administration' : 'Mon espace'}
          </div>

          {navigation.map(item => (
            <div key={item.name}>
              {item.children ? (
                <>
                  <button
                    onClick={() => { toggle(item.name); if (item.to) navigate(item.to); }}
                    className="sb-link"
                  >
                    <item.icon className="sb-ico" />
                    {item.name}
                    <ChevronRightIcon
                      className={`sb-chevron${expanded.includes(item.name) ? ' open' : ''}`}
                    />
                  </button>

                  {expanded.includes(item.name) && (
                    <div className="sb-sub">
                      {item.children.map(c => (
                        <NavLink
                          key={c.name}
                          to={c.to}
                          className={({ isActive }) =>
                            `sb-sub-link${isActive ? ' active' : ''}`
                          }
                          onClick={() => setIsOpen(false)}
                        >
                          {c.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <NavLink
                  to={item.to}
                  end={item.to === '/app'}
                  className={({ isActive }) =>
                    `sb-link${isActive ? ' active' : ''}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="sb-ico" />
                  {item.name}
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        {/* ── Déconnexion ── */}
        <div className="sb-logout-wrap">
          <button className="sb-logout-btn" onClick={handleLogout}>
            <ArrowRightOnRectangleIcon className="sb-ico" />
            DÉCONNEXION
          </button>
        </div>

      </aside>
    </>
  );
};

export default Sidebar;