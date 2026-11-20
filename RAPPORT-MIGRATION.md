# Rapport de migration — état réel

## Changements
- SDK Expo 52.0.49 → 58.0.25 ; React 18.3.1 → 19.3.0 ; React Native 0.76.9 → 0.88.1 ; Router 4.0.22 → 58.0.31.
- Modules Expo et modules natifs alignés sur les versions fournies par Expo SDK 58 ; expo-dev-client ajouté pour futurs builds natifs.
- React DOM 19.3.0 ajouté pour résoudre un conflit de dépendances pair : son installation automatique en 19.3.1 exigeait React 19.3.1. Aucun `--force` ni `--legacy-peer-deps` utilisé. L'installation à partir de l'ancien verrouillage a échoué ; un nouveau verrouillage a été généré à partir des versions sélectionnées, puis `npm ci` réussi.
- `query-string` direct supprimé : il n'est importé ni par le code applicatif ni par Router 58, contrairement à l'ancien Router qui en nécessitait la présence pour le bundle.
- TypeScript 6.0.3 et types Node explicites pour compiler les tests ; ajout d'une configuration ESLint Expo, d'une `.nvmrc` et d'une configuration EAS initiale.
- `useSQLCipher` est conservé dans le plugin Expo SQLite. Cette configuration seule ne prouve pas que les fichiers sont chiffrés ni qu'un ancien fichier peut être migré.
- Babel et Metro utilisent les valeurs Expo par défaut ; aucune configuration personnalisée ne préexistait. EAS, signatures et profils restent non testés.

## Compatibilité et régressions
`expo install --check`, `expo-doctor`, TypeScript, tests existants et exports des bundles Android/iOS ont réussi. ESLint échoue sur cinq erreurs (voir rapport de tests). L'exécution native, les permissions, la persistence SecureStore et SQLCipher, l'authentification et les liens profonds n'ont pas été validés sur appareils. Aucune preuve de compatibilité native complète ne peut être revendiquée.

## Retour arrière
Avant migration, `package.json` et `package-lock.json` étaient sauvegardés dans l'espace de travail sous `/home/user/canada-sdk52-package.json` et `/home/user/canada-sdk52-lock.json`. Ce ne sont pas des sauvegardes versionnées de tout le projet. Une stratégie de retour arrière reproductible et une migration des données locales doivent être préparées avant déploiement.
