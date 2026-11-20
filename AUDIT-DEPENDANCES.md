# Audit des dépendances après migration Expo 58

Résumé npm audit : {"info":0,"low":0,"moderate":3,"high":0,"critical":0,"total":3}

Les 26 anciennes alertes sont remplacées par les résultats du nouvel arbre ; aucun `npm audit fix --force` n’a été utilisé. Les trois alertes suivantes sont trois paquets affectés, pas nécessairement trois défauts distincts.

## @expo/fingerprint — moderate

Nœuds : node_modules/@expo/fingerprint. Proposition npm : {"name":"expo","version":"52.0.49","isSemVerMajor":true}.

- Propagation via minimatch.

## expo — moderate

Nœuds : node_modules/expo. Proposition npm : {"name":"expo","version":"52.0.49","isSemVerMajor":true}.

- Propagation via @expo/fingerprint.

## minimatch — moderate

Nœuds : node_modules/minimatch. Proposition npm : {"name":"expo","version":"52.0.49","isSemVerMajor":true}.

- minimatch has potential denial of service via globparts amplification : https://github.com/advisories/GHSA-g3hv-75wg-m249; plage >=7.0.0 <11.0.1.

## Analyse

La dépendance `@expo/fingerprint` demande minimatch ^10.2.6 ; la correction npm disponible pour cet avis commence en 11.0.1, hors de cette plage. Forcer un override majeur sans tests de compatibilité n’est pas considéré sûr. La suggestion npm de revenir à Expo 52 ne doit pas être appliquée aveuglément. Réévaluer après une mise à jour compatible d’Expo/fingerprint. L’exploitabilité dépend des entrées traitées ; elle n’a pas été vérifiée. ESLint 9 est également signalé hors support par npm, sans alerte correspondante ici.
