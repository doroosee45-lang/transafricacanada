// Modèles de domaine partagés (formes renvoyées par l'API backend).
// Les champs sont optionnels lorsque l'API ne les renvoie pas systématiquement
// (documents peuplés partiellement, anciennes données).

import type { CurrencyAmount } from '../config/currencies';

export type Role = 'superadmin' | 'admin' | 'manager' | 'agent' | 'client';

/** Référence peuplée minimale (agence, client…) ou simple identifiant. */
export interface NamedRef {
  _id?: string;
  name?: string;
}

export interface User {
  _id?: string;
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: Role;
  avatar?: string;
  /** Agence peuplée, ou simple identifiant selon la route qui a renvoyé l'utilisateur. */
  agency?: NamedRef | string | null;
  country?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt?: string;
}

/** Notification utilisateur (cloche du Header, page Notifications). */
export interface AppNotification {
  _id: string;
  title?: string;
  message?: string;
  type?: string;
  read?: boolean;
  actionUrl?: string;
  createdAt?: string;
}

/** Personne référencée (client, expéditeur, destinataire, vendeur, responsable…). */
export interface Person {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  agency?: NamedRef | null;
  role?: string;
}

/** Client (fiche client ou utilisateur de rôle client). */
export interface Client extends Person {
  _id: string;
  company?: string;
  notes?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  packagesCount?: number;
  totalSpent?: number;
}

/** Agence. */
export interface Agency {
  _id: string;
  name?: string;
  nom?: string;
  code?: string;
  email?: string;
  phone?: string;
  address?: { street?: string; city?: string; country?: string; postalCode?: string } | null;
  city?: string;
  ville?: string;
  country?: string;
  status?: string;
  isActive?: boolean;
  photo?: string;
  image?: string;
  latitude?: number | string;
  longitude?: number | string;
  location?: string;
  manager?: Person | null;
  responsable?: string;
  /** Horaires par jour (clé : monday…sunday ; valeur : « 08:00 - 18:00 » ou « Fermé »). */
  openingHours?: Record<string, string>;
  stats?: { packagesCount?: number; employeesCount?: number; revenueByCurrency?: CurrencyAmount[] };
  packagesCount?: number;
  employeesCount?: number;
  /** Nombre de colis (certaines routes renvoient le compteur sous ce nom). */
  packages?: number;
  employees?: unknown[];
  revenue?: number;
  totalRevenue?: number;
  totalPackages?: number;
  createdAt?: string;
}

/** Encaissement enregistré sur le contrat financier d'un colis. */
export interface FinancialTransaction {
  key?: string;
  status?: 'valid' | 'cancelled' | string;
  paidAt?: string;
  recordedAt?: string;
  referenceMinor?: number;
  kind?: string;
  amountMinor?: number;
  currency?: string;
  rate?: number | string;
  method?: string;
}

/**
 * Contrat financier d'un colis (montants en unités mineures : centimes, millimes…).
 * Calculé par le serveur ; la devise de référence est celle du départ.
 */
export interface PackageFinancial {
  service?: string;
  weight?: number;
  status?: 'unpaid' | 'partial' | 'paid' | string;
  referenceCurrency?: string;
  destinationCurrency?: string;
  rate?: number | string;
  lockedAt?: string | null;
  totalMinor?: number;
  baseMinor?: number;
  flatMinor?: number;
  insuranceMinor?: number;
  minimumAdjustmentMinor?: number;
  advanceMinor?: number;
  remainingReferenceMinor?: number;
  destinationDueMinor?: number;
  destinationPaidMinor?: number;
  remainingDestinationMinor?: number;
  paidMinor?: number;
  remainingMinor?: number;
  transactions?: FinancialTransaction[];
}

/** Situation des paiements d'un colis calculée par le serveur (paiements valides uniquement). */
export interface PaymentSituation {
  currency?: string;
  status?: 'unpaid' | 'partial' | 'paid' | string;
  totalMinor?: number;
  paidMinor?: number;
  remainingMinor?: number;
  validCount?: number;
  cancelledCount?: number;
}

/** Étape de l'historique de suivi d'un colis. */
export interface TrackingEvent {
  _id?: string;
  status?: string;
  location?: string;
  description?: string;
  date?: string;
  timestamp?: string;
  createdAt?: string;
}

/** Colis. */
export interface Package {
  _id: string;
  /** Colis supprimé, référencé par une facture (placeholder renvoyé par l'API). */
  missing?: boolean;
  trackingNumber?: string;
  reference?: string;
  status?: string;
  origin?: string;
  destination?: string;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
  numberOfItems?: number;
  packageType?: string;
  service?: string;
  description?: string;
  value?: number;
  price?: number;
  pricePerKg?: number;
  totalPrice?: number;
  amount?: number;
  currency?: string;
  isPaid?: boolean;
  paymentMethod?: string;
  declaredValue?: number;
  extraFees?: number;
  insuranceFee?: number;
  packageImageUrl?: string | null;
  estimatedArrival?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  fragile?: boolean;
  insurance?: boolean;
  specialInstructions?: string;
  notes?: string;
  expeditionDate?: string;
  client?: Person | null;
  sender?: Person | null;
  receiver?: Person | null;
  senderData?: Person | null;
  receiverData?: Person | null;
  /** Champs hérités d'anciennes versions de l'API (lus en repli par la liste des colis). */
  recipient?: Person | null;
  destinationCity?: string;
  agency?: Agency | null;
  createdBy?: Person | null;
  recordedBy?: Person | null;
  cancelledBy?: Person | null;
  cancelReason?: string;
  financial?: PackageFinancial | null;
  financialSummary?: PaymentSituation & { remainingDestinationMinor?: number | null; destinationCurrency?: string; rate?: number | string } | null;
  trackingHistory?: TrackingEvent[];
  createdAt?: string;
  updatedAt?: string;
}

/** Employé. */
export interface Employee {
  _id: string;
  user?: Person | null;
  firstName?: string;
  lastName?: string;
  role?: string;
  position?: string;
  department?: string;
  email?: string;
  phone?: string;
  address?: { street?: string; city?: string; postalCode?: string; country?: string } | null;
  ssn?: string;
  salary?: number;
  currency?: string;
  hireDate?: string;
  birthDate?: string;
  contractType?: string;
  status?: string;
  isActive?: boolean;
  agency?: Agency | null;
  supervisor?: Person | null;
  emergencyContact?: { name?: string; phone?: string; relationship?: string } | null;
  createdAt?: string;
}

/** Paiement / facture. */
export interface Payment {
  _id: string;
  invoiceNumber?: string;
  reference?: string;
  trackingNumber?: string;
  amount?: number;
  amountPaid?: number;
  currency?: string;
  status?: string;
  method?: string;
  notes?: string;
  dueDate?: string;
  paidAt?: string;
  client?: Person | null;
  /** Ancien champ : utilisateur payeur (avant la référence client). */
  user?: Person | null;
  agency?: Agency | null;
  package?: Package | string | null;
  packages?: Array<Package | string>;
  createdAt?: string;
  updatedAt?: string;
}

/** Image produit : chemin/URL brut ou objet { url } selon l'ancienneté de l'annonce. */
export type ProductImage = string | { url?: string };

/** Produit de la marketplace. */
export interface Product {
  _id: string;
  title?: string;
  titre?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  currency?: string;
  images?: ProductImage[];
  category?: string;
  condition?: string;
  stock?: number;
  status?: string;
  location?: string;
  rating?: number;
  reviewsCount?: number;
  featured?: boolean;
  seller?: Person | null;
  vendor?: Person | null;
  buyer?: Person | null;
  createdAt?: string;
}

/** Offre de kilos disponibles (marketplace). */
export interface KiloOffer {
  _id: string;
  seller?: Person | null;
  agency?: Agency | null;
  originCountry?: string;
  destinationCountry?: string;
  departureDate?: string;
  arrivalDate?: string;
  availableWeight?: number;
  reservedWeight?: number;
  pricePerKg?: number;
  currency?: string;
  description?: string;
  status?: string;
  createdAt?: string;
}
