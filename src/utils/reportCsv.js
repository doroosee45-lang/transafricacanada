// Export CSV des rapports — une ligne financière = UNE devise (jamais de total mélangé).
// Montants à la précision ISO de leur devise (TND : 3 décimales), séparateur « ; » (Excel FR),
// BOM UTF-8, cellules commençant par = + - @ neutralisées (injection de formules).
import { digitsOf } from '../config/currencies';

const cell = (v) => {
  const s = String(v ?? '');
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return /[;"\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export function buildReportRows(data = {}) {
  const rows = [['Type', 'Mois', 'Année', 'Total', 'Devise', 'Détail']];
  const push = (type, arr, valueKey = 'total') => (arr || []).forEach((item) => {
    const value = item[valueKey] || 0;
    const amount = item.currency ? Number(value).toFixed(item.digits ?? digitsOf(item.currency)) : value;
    rows.push([type, item._id?.month || '', item._id?.year || '', amount, item.currency || '',
      item.count != null && item.currency ? `${item.count} opération(s)` : '']);
  });
  push('Colis', data.packages, 'total');
  push('Revenus', data.revenue, 'total');
  push('Clients', data.clients, 'count');
  return rows;
}

export const buildReportCsv = (data) => '﻿' + buildReportRows(data).map((r) => r.map(cell).join(';')).join('\n');
