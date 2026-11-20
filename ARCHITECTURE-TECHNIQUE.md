# Architecture du frontend Canada

Expo / React Native / TypeScript ; navigation Expo Router dans `app/`. `src/auth` contient l'accès Supabase Auth et SecureStore. `src/api.ts` fournit un transport HTTPS générique sans contrats métier. `src/features/parcels` et `src/features/records` contiennent des modèles et interfaces de services d'affichage ; leurs fournisseurs sont à `null` dans `app/_layout.tsx`, faute de contrat backend validé. `src/sync` prépare une file SQLite/SQLCipher et un moteur idempotent injectable, non relié à un service réel. `src/theme.ts` centralise la palette.

Le Core API doit vérifier toutes les permissions et fournir les statuts officiels ; le mobile n'est jamais une source de vérité pour un paiement ou une livraison. Aucun accès direct aux tables métier. La session est distincte des autorisations métier. Le profil et les opérations ne sont pas encore implémentés de bout en bout. Les services à null expriment explicitement leur indisponibilité plutôt que produire des résultats fictifs.

L'architecture cible doit encore intégrer gestion des permissions, cache par utilisateur, services validés par schéma OpenAPI, observabilité sans données sensibles, mode hors ligne et réconciliation, notifications, médias et géolocalisation, avec tests natifs et de sécurité. `eas.json` est un point de départ non validé, pas une preuve de build.
