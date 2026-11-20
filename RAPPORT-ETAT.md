# État de contrôle — Trans Africa Canada Mobile

> Bilan historique d'une version antérieure, notamment pour les versions et chiffres de tests ci-dessous. Pour l'état actuel, consulter `RAPPORT-AUDIT-MOBILE.md`.

Ce document est un bilan intermédiaire, pas une recette ni une livraison préproduction. L'application est incomplète.

## Modules et parcours
Aucun module métier n'est déclaré terminé. L'authentification Supabase est codée mais **NON VÉRIFIÉE** sur service réel ou appareil. La récupération PKCE, les liens de confirmation et la déconnexion sont **NON VÉRIFIÉS** en conditions réelles. Des écrans de consultation de colis et d'informations existent, mais leurs fournisseurs de services sont à `null` : aucun parcours métier ne peut être exécuté de bout en bout. Les pages d'opérations, scan, preuve, profil, support et supervision restent des présentations non fonctionnelles. La file locale et son chiffrement nécessitent des builds natifs, une intégration serveur et des tests sur appareils ; aucun workflow ne l'alimente actuellement. Cartographie, push, paiements, uploads, rapports, permissions et communication temps réel ne sont pas intégrés. Les parcours Android et iOS, l'accessibilité et les performances réelles sont **NON VÉRIFIÉS**.

## Corrections de cette vérification
La page d'accueil ne masque plus les échecs de déconnexion : elle affiche une erreur, empêche les soumissions concurrentes et présente les erreurs de restauration de session. La vérification de ce parcours contre Supabase reste à faire.

## Contrôles exécutés
- `npm ci --no-audit --no-fund` : succès, avec avertissements de dépendances obsolètes.
- `npx expo install --check` : dépendances Expo attendues à jour.
- `npx --yes expo-doctor@latest` : 18/18 vérifications réussies ; avertissement : Node 20.20.2 non supporté par cette version de Doctor (>=22.13.0 demandé). Résultat à confirmer sous Node compatible.
- `npm run typecheck` : succès.
- `npm test` : 22 tests unitaires/de structure réussis. Ils ne sont pas des tests de parcours mobile ou d'intégration réelle.
- `npm ls expo react-native expo-sqlite expo-secure-store --all` : succès ; versions de ces quatre paquets dédupliquées dans l'arbre examiné. Ce contrôle ne prouve pas l'absence de tous les doublons natifs.
- `npx expo start --clear --host lan --port 8081` : Metro démarré ; manifeste Android répondu HTTP 200. Le cache a été reconstruit ; le serveur a été arrêté après vérification.
- `npx expo export --platform android` et `--platform ios` : bundles JavaScript exportés. Ce ne sont pas des builds natifs ou des tests sur appareil.
- `npm audit --json` : 26 vulnérabilités signalées (1 faible, 17 modérées, 7 élevées, 1 critique). Leur exploitabilité et les correctifs compatibles doivent être examinés. Aucun `audit fix --force` n'a été appliqué ; le dry-run affiche des avertissements de résolution de dépendances et recommande notamment une mise à jour majeure pour certaines chaînes.

## Risques et limites
- Critique : aucune intégration métier/permission au Core API ; les parcours ne sont pas opérationnels.
- Élevé : vulnérabilités de dépendances, notamment `tar` classé critique par npm audit, à analyser et corriger sans rupture de compatibilité.
- Élevé : absence de tests réels sur appareils, builds signés, Supabase, SQLCipher, paiements et notifications.
- Élevé : des écrans sont des présentations et ne remplissent pas les parcours du cahier des charges.
- Moyen : configuration d'identifiants de bundle provisoire et absence de pipeline complet ; Node doit être mis à niveau pour les vérifications modernes.

## Dépendances finales principales
Expo 52.0.49, React 18.3.1, React Native 0.76.9, Expo Router 4.0.22, Expo SQLite 15.1.4, Expo SecureStore 14.0.1. Consulter `package-lock.json` pour l'arbre exact.

## Installation et contrôles locaux
À partir de ce répertoire : `npm ci`, `npm run typecheck`, `npm test`, `npx expo install --check`, puis `npx expo start --clear`. Une version Node compatible avec Expo Doctor est nécessaire pour répéter son contrôle. Pour SQLCipher, utiliser un build natif de développement personnalisé, pas Expo Go. Les valeurs publiques Supabase sont à configurer à partir de `.env.example`. Ne pas diffuser de clé privilégiée. Les contrats OpenAPI, configurations et environnements des services réels sont nécessaires pour finaliser et valider les parcours.
