# Rapport des contrôles

- Node 22.23.5, installation propre `npm ci` : succès ; npm signale que la version ESLint 9.39.5 est hors support.
- `npm ls --all` : succès après résolution du conflit React/React DOM.
- `npx expo install --check` : conforme.
- Expo Doctor 20/20 : succès dans l'environnement avec Node 22.
- `npm run typecheck` : succès.
- `npm test` : 22 tests de structure et unitaires réussis ; pas de tests de parcours réels ni d'intégration backend.
- `npm run lint` : ÉCHEC, cinq erreurs `react-hooks/set-state-in-effect` dans `auth-callback.tsx`, `parcel-detail.tsx`, `parcels.tsx`, `record-detail.tsx`, `records.tsx`. Ces erreurs ne sont pas désactivées et nécessitent un refactoring réel des états de chargement/effets.
- Démarrage Metro avec cache nettoyé : succès ; arrêté après contrôle.
- Export des bundles JS Android et iOS : succès avant ajout du dev-client. Ces exports ne constituent pas des builds natifs ni des tests d'exécution.
- `npm audit` : 3 alertes modérées au dernier contrôle, voir audit. Aucune vulnérabilité élevée ou critique signalée par cet audit.

## NON VÉRIFIÉ
Build Android, build iOS, émulateur et appareil physique (adb et Xcode indisponibles), tests de navigation réelle, SQLCipher natif et chiffrement des journaux, SecureStore natif, authentification/confirmation/récupération Supabase, permissions métier, appels et réponses API réels, uploads, push, paiements, preuves, GPS, fonctionnement et synchronisation hors ligne de bout en bout. Les cinq erreurs ESLint et les parcours incomplets empêchent une qualification de préproduction.
