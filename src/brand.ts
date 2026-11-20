/**
 * Identité et coordonnées de l'entreprise.
 * Les coordonnées ne sont affichées que si elles sont renseignées : aucune donnée fictive n'est présentée.
 */
export const brand = {
  name: 'Trans Africa Canada',
  tagline: 'Fret, colis et suivi entre le Canada et l’Afrique',
  logo: require('../Assets/images/logo.png') as number,
  images: {
    entrepot: require('../Assets/images/entrepot.jpg') as number,
    avion: require('../Assets/images/avion.jpg') as number,
    transport: require('../Assets/images/transport.jpg') as number,
  },
  contact: {
    email: '',
    phone: '',
    address: '',
    website: '',
  },
} as const;
