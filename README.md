# Trans Africa Canada Mobile — socle frontend en cours

Application React Native / Expo (Android et iOS). Ce livrable est **incomplet et non prêt pour la production** : il fournit une navigation de présentation des modules et un client HTTP générique, pas les parcours métiers. Aucun backend ni donnée de démonstration n'est inclus.

## Installation et exécution
Prérequis : Node.js 22.23.5 (voir `.nvmrc`), npm et Expo Go compatible SDK 58 sur chaque appareil. Exécuter `npm ci`, puis `npm start` et scanner le QR du serveur avec Expo Go sur Android ou l'appareil photo de l'iPhone. Utiliser le même réseau local et autoriser l'accès réseau si demandé ; en cas de réseau inaccessible, essayer `npx expo start --go --tunnel`. Un Mac ou Xcode n'est pas nécessaire pour utiliser Expo Go sur un iPhone physique ; le simulateur iOS, lui, nécessite macOS et Xcode. `npm run typecheck`, `npm test` et `npm run test:ui` exécutent les contrôles disponibles ; les tests d'interface utilisent des mocks, pas des appareils. Les identifiants de bundle de `app.json` sont provisoires.

## État et dépendances bloquantes
Les écrans indiquent explicitement que les services ne sont pas configurés. Le scanner lit et affiche un QR code, mais ne valide ni ne transmet les données métier. Les permissions serveur, les formulaires métier, les preuves, les notifications, les cartes et les paiements ne sont pas intégrés. Une file SQLite existe mais nécessite SQLCipher et n'est pas utilisable dans Expo Go. Le client HTTP n'est relié à aucun endpoint. Aucun statut métier ne peut être modifié.

Pour poursuivre : obtenir les contrats OpenAPI réels, les configurations publiques Supabase/Auth, les règles de permissions, les flux de fichiers et notifications ainsi que les environnements de test ; installer et configurer les dépendances mobiles nécessaires. Aucun secret serveur ou clé de service ne doit être intégré. Tester ensuite les parcours complets, la sécurité, les interactions hors ligne, et les appareils Android/iOS avant publication.

## Compilation et publication
Les builds de production ne sont pas configurés ni vérifiés. Après implémentation et validation des services, configurer EAS Build, les identifiants applicatifs, les environnements, les certificats et profils de signature hors dépôt ; exécuter des builds de préproduction puis de production et suivre les procédures App Store / Play Store. Ne pas publier ce socle en l'état.

## Authentification — travail en cours
Le code inclut les formulaires Supabase de connexion et d'inscription, la restauration de session et son stockage dans Expo SecureStore. Copier `.env.example` vers `.env` et renseigner les valeurs publiques HTTPS du projet Supabase et sa clé publique anon ; ne jamais y mettre une clé de service. Ces valeurs sont intégrées à l'application et ne sont pas secrètes. La connexion réelle, la confirmation email, la déconnexion et le renouvellement de session doivent être testés avec un projet Supabase configuré. La récupération et la confirmation utilisent des liens profonds PKCE : voir ci-dessous. Ces parcours ne sont pas considérés comme validés avant les tests sur appareils et serveur réels. Les autorisations métier ne sont pas intégrées. Les écrans de modules restent indisponibles ; l'identité ne confère aucun droit opérationnel.

## File locale et synchronisation : socle non branché
Une file SQLite et un moteur de synchronisation séparé existent dans `src/sync`. Les éléments sont partitionnés par identifiant utilisateur et disposent de clés d'idempotence stables ; les refus et conflits restent consultables. Les tests couvrent l'isolation, l'arrêt en cas de panne ou de session périmée, et les appels concurrents. L'écran de file est en lecture seule. Aucun formulaire métier ne crée encore d'opération et aucun transport ne transmet la file : les routes, permissions, schémas et réponses doivent être validés avec le Core API. Les tests en mémoire ne valident pas SQLite sur appareil.

La file utilise une base distincte configurée pour SQLCipher et une clé générée sur l'appareil, stockée dans SecureStore. Elle refuse l'ouverture si SQLCipher n'est pas disponible ; un build natif personnalisé est nécessaire. Cette protection n'a pas encore été vérifiée sur appareils et ne rend pas la file prête pour la production. Les politiques de minimisation, durée de conservation, suppression et pièces jointes restent à définir et tester. L'ancienne base non chiffrée du socle précédent n'est ni migrée ni supprimée automatiquement : inspecter sa présence et établir un plan de migration/destruction avant tout usage réel. L'horodatage local est indicatif et ne remplace pas une date serveur.

## Transport API
`src/api.ts` contient une infrastructure générique testée, non reliée à des routes métier. Elle impose HTTPS et l'origine configurée, réclame par défaut une session, gère les délais, l'annulation, les erreurs HTTP, une clé d'idempotence optionnelle et la validation des réponses par un parseur fourni par chaque service. Elle ne répète pas automatiquement les écritures. Le nom de l'en-tête d'idempotence, les schémas et les routes doivent être confirmés dans OpenAPI avant utilisation. Les éventuelles redirections doivent être interdites sur le serveur et le comportement natif vérifié sur Android et iOS : les implémentations de fetch mobiles peuvent différer. Les tests automatisés utilisent un transport simulé et ne valident pas une API réelle.

## Liens de confirmation et récupération
Supabase Auth utilise PKCE et le stockage sécurisé du vérificateur. Le rappel est construit avec `expo-linking` : en build natif, autoriser `transafricacanada:///auth-callback?flow=confirmation` et `transafricacanada:///auth-callback?flow=recovery` dans Supabase. Dans Expo Go, l'URL commence généralement par `exp://` et contient l'adresse courante du serveur et `/--/auth-callback` ; autoriser les URL de développement correspondantes dans Supabase, sans utiliser de joker trop large. L'adresse peut changer et les liens `exp://` peuvent ne pas être reconnus par certains clients email ou navigateurs, notamment sur iOS : Expo Go ne fournit pas de lien de rappel stable. Les modèles email doivent conserver le paramètre redirect ; ouvrir le lien sur l'appareil ayant initié la demande PKCE. Les liens expirés ou déjà utilisés sont refusés. Ces parcours restent à valider avec Supabase et sur appareils.

## Vérification du scanner sur appareils
Sur Android et iPhone physiques, installer la version d'Expo Go compatible avec le SDK 58, lancer `npm start` et ouvrir **Scanner un colis**. Autoriser la caméra, lire un QR contenant du texte, vérifier le résultat puis scanner un second code. Tester aussi le refus, l'ouverture des réglages d'Expo Go, la réautorisation, le passage en arrière-plan et le retour à l'écran. L'autorisation et son message appartiennent à Expo Go ; la configuration native de `app.json` ne modifie pas l'application Expo Go installée. Le résultat est affiché tel quel, sans ouvrir de lien, accès API ou modification de colis ; un format et un contrat serveur restent nécessaires pour le traitement métier. Les tests automatisés ne vérifient pas la caméra native.

### Vérification du stockage chiffré
Le plugin Expo SQLite active `useSQLCipher` pour les futures compilations natives. Une base séparée évite de réutiliser silencieusement l’ancienne base en clair. La clé est conservée dans SecureStore ; sa perte rend la base illisible. Il faut tester sur Android et iOS l’ouverture, les pannes et la restauration, vérifier le chiffrement réel des fichiers et du journal WAL, ainsi que définir la gestion des clés, la migration et la suppression. Expo Go ne suffit pas pour valider cette configuration.

## Parcours colis
Les écrans de liste paginée et de suivi individuel utilisent le contrat d'affichage interne `ParcelsService`. Il est volontairement non configuré dans le fournisseur : il faut implémenter un adaptateur à partir des contrats Core API validés, avec validation de schéma et autorisations serveur. Les écrans gèrent l'absence de session, le chargement, les erreurs, l'état vide et la pagination. Le statut du vol et celui du colis restent distincts ; aucune position n'est inférée. Les tests portent sur les transformations pures, non sur une API ni sur des appareils. Cartographie, documents et opérations terrain restent à réaliser.

## Écrans de consultation complémentaires
Les écrans de liste et de détail des expéditions, documents, paiements, notifications et agences utilisent `RecordsService`, un contrat de présentation interne distinct des contrats API. Le fournisseur reste volontairement non configuré. Les listes sont paginées, les erreurs et états vides sont traités, et la lecture d'une notification n'est affichée qu'après confirmation du service. Ces écrans ne constituent pas encore l'ensemble des parcours : téléchargement, paiement, actions métier, validation serveur et tests sur appareils restent à réaliser. Les données autorisées et le mappage doivent être définis avec le Core API ; les permissions ne sont pas déduites du rôle affiché.

## Écrans et branchement de l'API

Le registre `src/screens/index.tsx` contient 49 entrées fonctionnelles (8 démarrage/authentification, 25 client, 16 agent) et deux pages publiques. Elles sont ouvertes par `app/s/[name].tsx` ; certaines redirigent vers des routes dédiées. Aucune donnée métier n'est simulée. Les hooks et ports de `src/data/index.ts`, ainsi que les fournisseurs de colis et d'informations de `app/_layout.tsx`, nécessitent des adaptateurs distincts fondés sur les contrats validés. Tant qu'ils ne sont pas branchés, les écrans indiquent que les services sont indisponibles. L'inventaire ne signifie pas que les parcours sont terminés ; voir `RAPPORT-AUDIT-MOBILE.md`.

Non inclus : géolocalisation, notifications push (limitées dans Expo Go), persistance de la langue et du pays.

## Identité visuelle et design system

- Palette et jetons (or, encre, crème) repris de la version WEB : `src/theme.ts`. Animations (reveal au défilement, effet « hover » tactile, float, zoom lent) : `src/motion.tsx`, 100 % `Animated` natif, compatible Expo Go, désactivées si « réduire les animations » est actif.
- Composants communs : `src/ui.tsx` (Page, Button, Card, Row, Tiles, Field…) et `src/public.tsx` (Navbar, Hero, Carousel, Footer). Icônes : Ionicons (`@expo/vector-icons`).
- Logo officiel : `Assets/logo.jpeg` (source), `Assets/images/logo.png` (navbar, pied de page), `Assets/icon.png`, `adaptive-icon.png`, `splash-icon.png`, `favicon.png` (déclarés dans `app.json`).
- L'icône et le splash personnalisés n'apparaissent **pas dans Expo Go** (qui affiche sa propre icône) ; ils sont visibles dans un build (EAS Build ou `expo prebuild`).
- Coordonnées du pied de page : à renseigner dans `src/brand.ts` (`contact`) ; rien n'est affiché tant qu'elles sont vides. Images du carrousel : illustrations (Unsplash).

## Migration Expo 58
Le socle utilise Expo SDK 58 / React 19.3.0 / React Native 0.88.1. Les rapports de migration antérieurs sont historiques. Les builds natifs, la sécurité SQLCipher sur appareil et les parcours connectés restent non vérifiés. `npm run lint` signale actuellement quatre erreurs React Hooks dans les listes et détails colis/informations ; ne pas considérer cette version prête pour la préproduction.
