# Fonctionnalités : état réel

Aucun parcours complet n'est déclaré validé pour la préproduction.

- Authentification : formulaires, Supabase Auth, SecureStore, liens PKCE codés ; configuration et tests réels manquants.
- Colis : écrans de liste et détail, modèle de chronologie et séparation vol/colis codés ; service réel absent.
- Expéditions, devis, paiements, notifications, agences : écrans de consultation génériques et interfaces de service ; service absent et fonctionnalités spécifiques incomplètes.
- Synchronisation : modèles, moteur et file locale configurée pour SQLCipher ; aucun flux métier ni service de synchronisation réel, pas de validation native.
- Opérations agent, scan, preuves, supervision, profil et support : écrans de présentation uniquement ; non implémentés.
- Push, cartographie, GPS, téléversement, paiements, permissions métier, documents et rapports : non implémentés.

Les tests existants couvrent surtout des fonctions pures et la structure. Ils ne démontrent pas que les parcours sont fonctionnels. `RAPPORT-TESTS.md` fait foi pour les contrôles réellement effectués.
