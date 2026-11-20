// Types partagés par les générateurs de PDF (jsPDF) : facture d'expédition, étiquette colis.

/** Couleur RVB passée à jsPDF (setFillColor, setTextColor…). */
export type RGB = [number, number, number];

/** Options de l'utilitaire d'écriture de texte des générateurs PDF. */
export interface TextOptions {
  sz?: number;
  wt?: string;
  col?: RGB;
  align?: 'left' | 'center' | 'right' | 'justify';
  maxW?: number;
}
