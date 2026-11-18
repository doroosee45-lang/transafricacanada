import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/24/solid';

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

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'primary',
  description,
  onClick,
  className = '',
}) => {
  const colors = {
    primary: { bg: `${tk.accent}10`, color: tk.accent },
    success: { bg: `${tk.emerald}10`, color: tk.emerald },
    warning: { bg: `${tk.amber}10`, color: tk.amber },
    danger: { bg: `${tk.rose}10`, color: tk.rose },
    info: { bg: `${tk.accent}10`, color: tk.accent },
    purple: { bg: `${tk.purple}10`, color: tk.purple },
    orange: { bg: `${tk.orange}10`, color: tk.orange },
  };

  const selectedColor = colors[color] || colors.primary;

  const getTrendIcon = () => {
    if (trend === 'up') return <ArrowUpIcon style={{ width: 12, height: 12, color: tk.emerald }} />;
    if (trend === 'down') return <ArrowDownIcon style={{ width: 12, height: 12, color: tk.rose }} />;
    return <MinusIcon style={{ width: 12, height: 12, color: tk.textMut }} />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return tk.emerald;
    if (trend === 'down') return tk.rose;
    return tk.textMut;
  };

  const cardContent = (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '16px 20px',
      border: `1.5px solid ${tk.border}`,
      boxShadow: '0 2px 8px rgba(23,22,20,.04)',
      transition: 'all 0.2s ease',
      cursor: onClick ? 'pointer' : 'default',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{
          width: 36, height: 36, borderRadius: 12,
          background: selectedColor.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {Icon && <Icon style={{ width: 18, height: 18, color: selectedColor.color }} />}
        </span>
        
        {trend && trendValue && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 11, fontWeight: 600, color: getTrendColor(),
            background: trend === 'up' ? `${tk.emerald}10` : trend === 'down' ? `${tk.rose}10` : `${tk.textMut}10`,
            padding: '4px 10px', borderRadius: 99,
          }}>
            {getTrendIcon()}
            {trendValue}
          </span>
        )}
      </div>
      
      <div style={{ fontSize: 28, fontWeight: 800, color: tk.ink, fontFamily: "'Open Sans', Arial, sans-serif", marginBottom: 4 }}>
        {value}
      </div>
      
      <div style={{ fontSize: 12, fontWeight: 500, color: tk.textMut, textTransform: 'uppercase', letterSpacing: '.03em' }}>
        {title}
      </div>
      
      {description && (
        <div style={{ fontSize: 11, color: tk.textMut, marginTop: 8 }}>
          {description}
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <div onClick={onClick} style={{ cursor: 'pointer' }}>
        {cardContent}
      </div>
    );
  }

  return cardContent;
};

export default StatCard;