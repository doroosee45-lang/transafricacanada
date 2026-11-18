import React from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  BuildingOfficeIcon,
  HomeIcon,
  MapPinIcon,
  XCircleIcon,
  CubeIcon,
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

const Timeline = ({ items, title, showConnector = true }) => {
  const getStatusIcon = (status) => {
    const icons = {
      success: <CheckCircleIcon style={{ width: 16, height: 16, color: tk.emerald }} />,
      warning: <ClockIcon style={{ width: 16, height: 16, color: tk.amber }} />,
      info: <TruckIcon style={{ width: 16, height: 16, color: tk.accent }} />,
      delivered: <HomeIcon style={{ width: 16, height: 16, color: tk.emerald }} />,
      hub: <BuildingOfficeIcon style={{ width: 16, height: 16, color: tk.purple }} />,
      error: <XCircleIcon style={{ width: 16, height: 16, color: tk.rose }} />,
      package: <CubeIcon style={{ width: 16, height: 16, color: tk.accent }} />,
    };
    return icons[status] || <ClockIcon style={{ width: 16, height: 16, color: tk.textMut }} />;
  };

  const getStatusBg = (status) => {
    const backgrounds = {
      success: `${tk.emerald}10`,
      delivered: `${tk.emerald}10`,
      warning: `${tk.amber}10`,
      info: `${tk.accent}10`,
      hub: `${tk.purple}10`,
      error: `${tk.rose}10`,
      package: `${tk.accent}10`,
    };
    return backgrounds[status] || `${tk.textMut}10`;
  };

  const getStatusBorder = (status) => {
    const borders = {
      success: `${tk.emerald}20`,
      delivered: `${tk.emerald}20`,
      warning: `${tk.amber}20`,
      info: `${tk.accent}20`,
      hub: `${tk.purple}20`,
      error: `${tk.rose}20`,
      package: `${tk.accent}20`,
    };
    return borders[status] || `${tk.textMut}20`;
  };

  const getStatusText = (status) => {
    const texts = {
      success: 'Succès',
      warning: 'En attente',
      info: 'En transit',
      delivered: 'Livré',
      hub: 'Arrivé au hub',
      error: 'Échec',
      package: 'Colis créé',
    };
    return texts[status] || status || 'Information';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!items || items.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '48px 24px',
        background: '#fff', borderRadius: 16,
        border: `1.5px solid ${tk.border}`,
      }}>
        <ClockIcon style={{ width: 48, height: 48, color: tk.textMut, margin: '0 auto 12px' }} />
        <p style={{ fontSize: 14, color: tk.textSec }}>Aucun historique disponible</p>
      </div>
    );
  }

  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      border: `1.5px solid ${tk.border}`,
      overflow: 'hidden',
    }}>
      {title && (
        <div style={{
          padding: '14px 20px', background: tk.surface, borderBottom: `1px solid ${tk.border}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, background: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,.08)',
            }}>
              <ClockIcon style={{ width: 14, height: 14, color: tk.accent }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: tk.textMut, fontFamily: "'Open Sans',Arial,sans-serif" }}>
              {title}
            </span>
          </div>
        </div>
      )}

      <div style={{ padding: 20 }}>
        <div style={{ position: 'relative' }}>
          {items.map((item, index) => (
            <div key={index} style={{ position: 'relative', paddingBottom: index < items.length - 1 ? 20 : 0 }}>
              {/* Ligne de connexion */}
              {showConnector && index < items.length - 1 && (
                <div style={{
                  position: 'absolute', left: 11, top: 32,
                  width: 2, height: 'calc(100% - 20px)',
                  background: `linear-gradient(to bottom, ${tk.border}, ${tk.border}80)`,
                }} />
              )}

              <div style={{ display: 'flex', gap: 14 }}>
                {/* Icône */}
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 99,
                    background: getStatusBg(item.status),
                    border: `2px solid ${getStatusBorder(item.status)}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {getStatusIcon(item.status)}
                  </div>
                </div>

                {/* Contenu */}
                <div style={{ flex: 1, paddingBottom: index < items.length - 1 ? 0 : 0 }}>
                  <div style={{
                    display: 'flex', flexWrap: 'wrap',
                    alignItems: 'flex-start', justifyContent: 'space-between',
                    gap: 12,
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: 14, fontWeight: 600, color: tk.ink,
                        marginBottom: 4,
                      }}>
                        {item.title || getStatusText(item.status)}
                      </p>
                      {item.description && (
                        <p style={{ fontSize: 13, color: tk.textSec, lineHeight: 1.5 }}>
                          {item.description}
                        </p>
                      )}
                      {item.location && (
                        <p style={{
                          fontSize: 12, color: tk.textMut, marginTop: 6,
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                          <MapPinIcon style={{ width: 12, height: 12 }} />
                          {item.location}
                        </p>
                      )}
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <time style={{ fontSize: 12, color: tk.textMut, whiteSpace: 'nowrap' }}>
                        {formatDate(item.date)}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;