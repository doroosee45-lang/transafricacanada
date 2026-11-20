// Types partagés par les composants d'interface.
import type React from 'react';

/** Composant d'icône (heroicons, lucide-react…) accepté par les composants communs. */
export type IconComponent = React.ComponentType<{
  className?: string;
  style?: React.CSSProperties;
  size?: number | string;
  strokeWidth?: number | string;
}>;

/** Ligne affichable dans un DataTable : un objet avec un identifiant éventuel. */
export interface TableRow {
  _id?: string;
  id?: string | number;
}

/** Définition d'une colonne de DataTable. */
export interface DataTableColumn<T> {
  key: string;
  label: React.ReactNode;
  sortable?: boolean;
  // La valeur dépend de la colonne (row[key]) : elle n'est pas typable statiquement ici.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: T) => React.ReactNode;
}

export type SortDirection = 'asc' | 'desc';

/** Événement de survol dont on modifie le style inline (pattern très utilisé dans l'app). */
export type HoverEvent = React.MouseEvent<HTMLElement>;
