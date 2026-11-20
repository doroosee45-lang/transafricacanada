# Branchement au Core API et dépendances restantes

## Branché (20/11/2026)

Le mobile est connecté au **Core API Trans Afrique** (`/api/v1`, contrat : `core-api/docs/openapi.json`) par `src/backend/` :

| Module mobile | Route Core API |
|---|---|
| Inscription | `POST /auth/register` (crée l'identité Supabase **et** le profil, l'accès Canada et la fiche client — Spéc. identité §7.1) |
| Connexion, récupération | Supabase Auth (jeton vérifié par le Core API) |
| Mes colis, suivi | `GET /me/parcels`, `GET /me/parcels/:id/tracking` (vol distinct du statut ; dernière position = scan, jamais de GPS) |
| Expéditions, vols associés | `GET /me/shipments` |
| Devis, décision | `GET /me/quotes`, `GET /me/quotes/:id`, `POST …/versions/:version/accept|reject` (version courante lue à l'instant) |
| Paiements | `GET /me/payments` |
| Notifications | `GET /me/notifications`, `POST /me/notifications/:id/read` |
| Demandes | `GET/POST /me/requests` (pays : codes ISO ou noms des 5 pays ; « Congo » seul refusé car ambigu) |
| Assistance | `GET/POST /me/support-tickets`, `GET /me/support-tickets/:id` |
| Adresses, profil | `GET/POST /me/addresses`, `PATCH /identity/me` (nom affiché), `PATCH /me/client` (téléphone) |
| Terrain : consultation, réception | `GET /canada/parcels/by-reference/:reference`, `POST /canada/parcels/:id/transitions` |

Configuration : `EXPO_PUBLIC_CORE_API_URL` = **origine HTTPS seule** (ex. `https://api.exemple.com`), en plus de `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Le client HTTP refuse toute URL non HTTPS : pour tester sur un appareil contre un Core API local, exposer celui-ci en HTTPS (tunnel).

Preuves :
- `tests/core-backend.test.ts` (12 tests, transport simulé) ;
- **`core-api/tests/mobile-contract.test.ts`** : l'adaptateur mobile réel exécuté contre le Core API réel et PostgreSQL 18 (inscription, colis et suivi, rubriques, actions client, réception terrain, refus hors périmètre).

## Non branché (aucune donnée simulée ; les écrans affichent « service non configuré »)

| Fonction | Raison |
|---|---|
| Paiement en ligne | Prestataires par pays non choisis (Core API D-05) |
| Tâches, livraisons, incidents terrain | Aucun modèle correspondant dans le Core API |
| Transfert vers une cible libre, preuve de livraison signée | Contrat Core API absent (preuve : documents + transition `delivered` à spécifier) |
| Agences (rubrique client) | Le Core API n'expose pas la liste des agences aux clients |
| Push | Fournisseur non choisi ; l'enregistrement d'appareil existe (`POST /me/devices`) mais n'est pas encore appelé |

## Non vérifié

Aucun parcours n'a été exécuté sur appareil ou émulateur, ni contre un projet Supabase réel. Ne jamais intégrer ou transmettre une clé `service_role` au mobile.
