# SDK 58 : migration du socle effectuée, validation native en attente

Le projet a été migré sur Expo 58.0.25, React 19.3.0, React Native 0.88.1 et Expo Router 58.0.31 suivant les versions de `bundledNativeModules.json` du SDK. Node 22.23.5 a été utilisé pour les vérifications dans le sandbox et est spécifié dans `.nvmrc`. Les dépendances natives ont été alignées sur le SDK, sans `--force`. TypeScript 6.0.3 est attendu par Expo. Voir `RAPPORT-MIGRATION.md` pour les changements et `RAPPORT-TESTS.md` pour les limites.

L'export JavaScript et Expo Doctor ne valident pas l'exécution native. SecureStore, SQLite/SQLCipher, les liens profonds et les builds Android/iOS restent non vérifiés sur appareils. La migration n'est donc pas validée pour la production.
