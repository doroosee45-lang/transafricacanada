# Audit technique et fonctionnel — Trans Africa Canada mobile

## 1. Périmètre et couverture

L'intervention concerne uniquement le projet mobile Expo / React Native. Aucun backend, API serveur, base de données serveur ou projet WEB n'a été modifié.

- **49 entrées fonctionnelles** sont enregistrées : 8 de démarrage/authentification, 25 client et 16 agent. Le chiffre de 48 indiqué auparavant dans le code était incorrect. Deux pages publiques supplémentaires portent le total du registre à **51 entrées**.
- Le projet comprend **12 modules de routes Expo** et un layout dans `app`, ainsi que 73 fichiers dans `src`. Une entrée du registre peut rediriger vers une route dédiée ; ces chiffres ne représentent pas 63 écrans différents.
- Le registre, les routes, les composants partagés, les écrans métier, l'authentification, le scanner et la file ont été examinés statiquement. Les 51 entrées du registre ont fait l'objet de tests de montage isolés avec mocks ; pour les entrées de redirection, cela ne teste pas l'écran de destination. Des interactions spécifiques ont également été testées avec mocks.
- Ces contrôles ne prouvent pas que chaque bouton, chaque retour natif et tous les parcours fonctionnent sur appareil. **Les 49 écrans ne sont pas déclarés intégralement testés ou terminés.**
- Contrôle statique : les 43 appels littéraux `go` et `goReplace` relevés pointent vers des entrées enregistrées. Les routes et paramètres construits dynamiquement, les liens profonds et les droits ne sont pas garantis par ce contrôle.

## 2. Anomalies constatées et corrections

Des tests de régression ont reproduit les problèmes avant correction :

1. Une ouverture directe de la confirmation de demande annonçait un envoi sans preuve. Elle affiche désormais « Envoi non confirmé » ; seule la réponse d'un service fournissant une référence non vide produit une confirmation dans le parcours de création. Une réponse sans référence bloque une nouvelle tentative et demande de vérifier l'historique.
2. L'identifiant d'une demande était transmis comme identifiant du devis. Le lien utilise maintenant uniquement l'identifiant de devis distinct communiqué dans le modèle de détail ; sinon il reste désactivé.
3. Une décision de devis absente ou invalide devenait implicitement une acceptation. Une décision explicite est maintenant requise.
4. Le formulaire acceptait notamment `1e2` comme poids. La saisie accepte uniquement un nombre décimal positif fini, avec point ou virgule.
5. Deux actions rapides pouvaient envoyer deux fois la même opération ; un succès ancien ou une localisation précédente pouvait rester visible après modification des champs. Un verrou synchrone et l'invalidation du résultat ont été ajoutés ; une modification pendant l'opération affiche que son résultat doit être vérifié.
6. Dans la file locale, une ancienne lecture pouvait remplacer une actualisation plus récente. Les lectures périmées sont désormais ignorées et l'état est isolé lors du changement de compte.
7. Le contraste mesuré du texte blanc sur l'or principal était de **3,81:1**, inférieur au seuil de 4,5:1 pour les textes concernés. Les jetons d'action utilisent une nuance or foncé déjà présente dans la palette, et le texte secondaire clair a été assombri ; un test mesure le contraste.

Autres corrections : état vide des détails génériques, suppression d'une double lecture du paiement, message d'erreur du rappel d'authentification calculé sans mise à jour synchrone dans l'effet, libellés corrigés pour ne pas annoncer un scanner de codes-barres ou une synchronisation hors ligne opérationnelle. Les animations d'entrée, du logo, des boutons, du menu et du carrousel tiennent désormais compte de la préférence de réduction des animations. Le rendu et les changements de préférence restent à tester sur appareils.

## 3. État écran par écran

**Légende :** `UI` = interface ou route préparée ; `service` = connexion/contrat externe nécessaire ; `natif` = test sur appareil nécessaire. Aucun statut ci-dessous ne certifie un parcours complet.

### Démarrage et authentification — 8

| Entrée | État et limites |
|---|---|
| splash | UI ; temporisation et logo, rendu natif non vérifié. |
| intro | UI ; présentation uniquement, natif. |
| language | UI ; français seul, anglais signalé incomplet ; pays et langue non persistés. |
| welcome | UI ; navigation préparée, retours natifs non vérifiés. |
| login | Redirection vers authentification ; Supabase et session réels à valider. |
| register | Redirection vers inscription ; confirmation et droits réels à valider. |
| forgot | Redirection vers récupération ; liens PKCE réels à valider. |
| verify-code | UI de vérification email ; format, configuration et résultat Supabase à valider. |

### Client — 25

| Entrée | État et limites |
|---|---|
| client-dashboard | UI et liens ; identité et services réels non vérifiés. |
| request-new | Formulaire et validation ; création via port non configuré. |
| request-confirm | Confirmation seulement après réponse du service dans le parcours courant ; vérification réelle absente. |
| requests | Liste générique ; service et pagination réelle absents. |
| request-detail | Détail et devis associé ; service doit fournir un identifiant de devis distinct. |
| quote | Détail et choix préparés ; devis officiel et autorisations absents. |
| quote-decision | Choix explicite préparé ; décision et idempotence serveur non vérifiées. |
| payment-select | Choix indicatifs ; moyens et initiation réels absents. |
| payment-result | Statut lu uniquement du service ; paiement réel non intégré. |
| parcels | Route dédiée, liste et pagination préparées ; service non configuré. |
| parcel-detail | Route dédiée ; données et permissions réelles absentes. |
| parcel-tracking | Présentation des couches de suivi ; position et sources non connectées. |
| shipments | Redirection vers liste dédiée ; service absent. |
| shipment-detail | Redirection vers détail dédié ; service absent. |
| flights | Liste générique ; service absent. |
| flight-detail | Détail générique ; service absent. |
| notifications | Liste dédiée ; service et push absents. |
| support | Liste et accès à la création ; service absent. |
| ticket-new | Formulaire ; envoi non configuré. |
| ticket-detail | Détail générique ; service absent. |
| profile | Données de session uniquement ; profil métier absent. |
| profile-edit | Formulaire ; mise à jour non configurée. |
| addresses | Formulaire et liste ; service non configuré. |
| payments-history | Liste générique ; service financier absent. |
| settings | Préférences non persistées signalées ; déconnexion réelle non vérifiée. |

### Agent — 16

| Entrée | État et limites |
|---|---|
| agent-dashboard | UI de navigation ; droits effectifs non vérifiés. |
| tasks | Liste générique ; affectation et service absents. |
| task-detail | Détail générique et accès au scan ; service absent. |
| scan | Route caméra QR ; permissions et lecture natives non testées. |
| scan-result | Code affiché ; identification et actions nécessitent le service. |
| receive | Formulaire ; réception physique et autorisation non connectées. |
| warehouse | Recherche préparée ; localisation réelle non connectée. |
| transfer | Formulaire ; transfert réel non connecté. |
| deliveries | Liste générique ; service absent. |
| delivery-detail | Détail et accès à la preuve ; service absent. |
| proof | Signature et photo préparées ; caméra native, stockage et transmission non vérifiés. |
| incident-new | Formulaire ; déclaration non configurée. |
| incidents | Liste générique ; service absent. |
| incident-detail | Détail générique ; service absent. |
| offline-queue | Route de file locale ; SQLCipher indisponible dans Expo Go et synchronisation non branchée. |
| agent-profile | UI ; rôle, agence et permissions non fournis. |

Les pages publiques `about` et `solutions` sont des présentations ; les images sont identifiées comme illustrations. La route `section` présente certains modules indisponibles, elle ne remplace pas un parcours métier.

## 4. Backend et intégrations attendus

Les services colis et informations sont initialisés à `null` dans `app/_layout.tsx` ; les hooks et ports de `src/data/index.ts` ne fournissent aucune donnée métier et refusent les écritures. Il reste à obtenir les contrats officiels et à brancher les adaptateurs, l'identité, les rôles et permissions, les demandes, devis, paiements, suivis, scan, médias/preuves, incidents, support, notifications et synchronisation. Les rôles affichés ne constituent pas une autorisation serveur.

La file chiffrée nécessite SQLCipher et un build natif compatible : Expo Go ne permet pas de vérifier cette configuration. Le moteur, les migrations de l'ancienne base, la sécurité de la clé, la conservation et l'idempotence serveur restent à valider. Aucune opération locale ne prouve une réception ou une livraison.

## 5. Vérifications et erreurs restantes

Les tests UI utilisent React Native Testing Library et des mocks ; aucun service réel ou appareil n'est utilisé.

| Contrôle | Résultat et portée |
|---|---|
| `npm run typecheck` | Réussi. |
| `npm test` | 27 tests de modèles et structure réussis. |
| `npm run test:ui` | 5 suites, 74 tests réussis, avec mocks. |
| `npx expo install --check` | Réussi : versions attendues à jour, sans validation native. |
| `npm run lint` | **Échec : 4 erreurs, 0 avertissement** `react-hooks/set-state-in-effect` dans `app/parcels.tsx`, `app/parcel-detail.tsx`, `app/records.tsx` et `app/record-detail.tsx`. Cinq erreurs étaient présentes au début ; celle du rappel d'authentification a été corrigée. |
| `npx expo export --platform android` | Réussi : bundle JavaScript et ressources, pas un APK. |
| `npx expo export --platform ios` | Réussi : bundle JavaScript et ressources, pas une application installable. |
| `npx expo start --go --localhost` | Démarré temporairement en mode CI ; manifestes Android et iOS répondant HTTP 200 en local. Serveur arrêté après le contrôle ; aucun appareil Expo Go connecté. |

Une première tentative Expo avec `--offline --localhost` a été refusée car ces options sont incompatibles ; la tentative suivante hors ligne n'a pas répondu dans le délai de contrôle. Le démarrage local non interactif ci-dessus a ensuite réussi. Les premiers tests de régression ont échoué avant les corrections, puis les suites finales sont passées.

Le relevé historique des vulnérabilités concernait une ancienne version des dépendances ; il ne décrit pas nécessairement l'état actuel. Aucun audit de sécurité actuel des dépendances n'a été exécuté. L'installation des outils de test a émis des avertissements de dépendances obsolètes, à examiner avant livraison.

## 6. Interventions restantes

1. Tester chaque parcours et chaque retour natif sur Android et iPhone, avec petits écrans, clavier, zones de sécurité, lecteurs d'écran et réduction des animations.
2. Tester dans Expo Go les permissions caméra, refus et réglages, lecture QR, changement d'application et reprise. Le traitement métier du QR attend un format et un service validés. Tester la capture photo et la signature séparément.
3. Vérifier la restauration de session, les liens profonds PKCE, la déconnexion et les changements de compte avec une configuration Supabase de test.
4. Corriger les erreurs de lint restantes et approfondir les changements de compte, de service et de paramètres dans les listes et détails ; aucun test sur service réel n'a encore établi leur robustesse.
5. Compléter les parcours et états manquants, notamment formulaires, persistance des préférences, traitement des médias, push et gestion des erreurs ; harmoniser et vérifier l'accessibilité de tous les composants.
6. Faire les tests SQLCipher et builds natifs lorsque requis, puis valider les contrats, permissions, idempotence et services intégrés. Exécuter un audit de dépendances actuel avant livraison.
