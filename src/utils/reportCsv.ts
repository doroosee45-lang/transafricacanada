// Export CSV des rapports — une ligne financière = UNE devise (jamais de total mélangé).
// Montants à la précision ISO de leur devise (TND : 3 décimales), séparateur « ; » (Excel FR),
// BOM UTF-8, cellules commençant par = + - @ neutralisées (injection de formules).
import { digitsOf } from '../config/currencies';

type CsvValue = string | number | null | undefined;

/** Ligne agrégée renvoyée par l'API des rapports. */
export interface ReportItem {
  _id?: { month?: number | string; year?: number | string } | null;
  total?: number;
  count?: number | null;
  currency?: string | null;
  digits?: number;
}

export interface ReportData {
  packages?: ReportItem[] | null;
  revenue?: ReportItem[] | null;
  clients?: ReportItem[] | null;
}

const cell = (v: CsvValue): string => {
  const s = String(v ?? '');
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return /[;"\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export function buildReportRows(data: ReportData = {}): CsvValue[][] {
  const rows: CsvValue[][] = [['Type', 'Mois', 'Année', 'Total', 'Devise', 'Détail']];
  const push = (type: string, arr: ReportItem[] | null | undefined, valueKey: 'total' | 'count' = 'total') => (arr || []).forEach((item) => {
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

export const buildReportCsv = (data?: ReportData): string => '﻿' + buildReportRows(data).map((r) => r.map(cell).join(';')).join('\n');
