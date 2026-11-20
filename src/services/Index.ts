// ─────────────────────────────────────────────────────
//  Point d'entrée unique — importer depuis ce fichier
//
//  Exemple d'utilisation :
//    import { agencyService, packageService } from "../services/Index";
//    import api from "../services/axios";   ← instance brute si besoin
//
//  Les chemins respectent la casse exacte des fichiers (obligatoire sous Linux).
// ─────────────────────────────────────────────────────

export { default as api }               from "./axios";
export { default as authService }       from "./Authservice";
export { default as agencyService }     from "./Agencyservice";
export { default as packageService }    from "./Packageservice";
export { default as paymentService }    from "./Paymentservice";
export { default as employeeService }   from "./Employeeservice";
export { default as marketplaceService }from "./Marketplaceservice";
export { default as analyticsService }  from "./Analyticsservice";
