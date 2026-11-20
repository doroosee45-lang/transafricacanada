// Garder le code existant mais ajouter "export" devant
type Id = string | number;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh-token',
  // Utilisé par AuthContext.refreshUser (non défini auparavant : l'appel partait sur `undefined`).
  ME: '/auth/me',

  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
  DASHBOARD_ANALYTICS: '/dashboard/analytics',

  // Clients
  CLIENTS: '/clients',
  CLIENT_DETAIL: (id: Id) => `/clients/${id}`,
  CLIENT_STATS: (id: Id) => `/clients/${id}/stats`,

  // Colis
  PACKAGES: '/packages',
  PACKAGE_DETAIL: (id: Id) => `/packages/${id}`,
  PACKAGE_TRACKING: (id: Id) => `/packages/${id}/tracking`,
  PACKAGE_STATUS: (id: Id) => `/packages/${id}/status`,

  // Agences
  AGENCIES: '/agencies',
  AGENCY_DETAIL: (id: Id) => `/agencies/${id}`,

  // Employés
  EMPLOYEES: '/employees',
  EMPLOYEE_DETAIL: (id: Id) => `/employees/${id}`,

  // Paiements
  PAYMENTS: '/payments',
  PAYMENT_DETAIL: (id: Id) => `/payments/${id}`,
  PAYMENT_INVOICE: (id: Id) => `/payments/${id}/invoice`,

  // Marketplace - Produits
  PRODUCTS: '/marketplace/products',
  PRODUCT_DETAIL: (id: Id) => `/marketplace/products/${id}`,
  PRODUCT_UPLOAD_IMAGE: '/marketplace/products/upload',
  MY_PRODUCTS: '/marketplace/my-products',
  MY_SALES: '/marketplace/my-sales',

  // Marketplace - Kilos
  KILOS_LISTINGS: '/marketplace/kilos',
  KILOS_DETAIL: (id: Id) => `/marketplace/kilos/${id}`,
  BUY_KILOS: (id: Id) => `/marketplace/kilos/${id}/buy`,
  MY_KILOS_SOLD: '/marketplace/my-kilos-sold',
  MY_KILOS_BOUGHT: '/marketplace/my-kilos-bought',

  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_READ: (id: Id) => `/notifications/${id}/read`,
  NOTIFICATIONS_READ_ALL: '/notifications/read-all',

  // Profil
  PROFILE: '/profile',
  UPDATE_PROFILE: '/profile/update',
  CHANGE_PASSWORD: '/auth/change-password',
} as const;
