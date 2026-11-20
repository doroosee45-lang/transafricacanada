**MISSION : HARMONISATION DES COULEURS — TRANS AFRICA CANADA**

Je souhaite que tu effectues une harmonisation complète de l'identité visuelle de l'application web Trans Africa Canada.

**RÈGLE ABSOLUE : MODIFIER UNIQUEMENT LES COULEURS.**

Tu dois respecter strictement les consignes suivantes :

1. Remplacer uniquement les anciennes couleurs par la nouvelle palette officielle de Trans Africa Canada.
2. Harmoniser les couleurs des boutons, liens, icônes, textes, titres, arrière-plans, cartes, bordures, menus, formulaires et éléments interactifs.
3. Utiliser une palette cohérente composée de bleu doux, bleu ciel, bleu royal adouci, bleu nuit, blanc et nuances très claires de bleu.
4. Éviter les bleus trop saturés, trop foncés ou agressifs.
5. Conserver une excellente lisibilité et un contraste accessible.
6. Respecter les couleurs fonctionnelles existantes lorsqu'elles sont nécessaires à la compréhension des états (erreurs, succès, avertissements).

**Palette officielle à appliquer :**

```typescript
export const colors = {
  blue: '#4D91D9',
  blueLight: '#79B5E8',
  blueDark: '#347FC5',
  blueDeep: '#172F50',

  white: '#FFFFFF',
  background: '#F7FAFE',
  surface: '#EDF5FC',
  surfaceHover: '#E1EFFB',

  ink: '#172F50',
  muted: '#52677D',
  textLight: '#8295A8',

  border: '#DCE9F5',
  borderStrong: '#C5DCEF',

  green: '#4D91D9',
  yellow: '#79B5E8',
  gold: '#4D91D9',
  goldSoft: '#EDF5FC',
} as const;
```

**ÉLÉMENTS STRICTEMENT INTERDITS À MODIFIER :**

- Aucune modification des animations existantes.
- Aucun changement des transitions ou effets de mouvement.
- Ne pas modifier les durées, vitesses ou délais des animations.
- Ne pas modifier les effets de survol, sauf leurs couleurs.
- Ne pas modifier les effets de défilement.
- Ne pas modifier les composants React.
- Ne pas modifier les fonctionnalités, la logique métier ou les API.
- Ne pas modifier les routes, la navigation ou les comportements.
- Ne pas modifier les dimensions, espacements, marges, paddings ou dispositions.
- Ne pas refaire le design et ne pas reconstruire les pages.
- Ne pas supprimer de contenu ou de composants.

**MÉTHODE DE TRAVAIL :**

1. Examiner les fichiers CSS, Tailwind, thèmes, variables et styles inline.
2. Identifier toutes les anciennes couleurs utilisées dans le projet.
3. Remplacer uniquement les valeurs de couleurs concernées.
4. Vérifier que les couleurs sont cohérentes sur toutes les pages publiques et privées, sur ordinateur et mobile.
5. Vérifier les boutons, menus, cartes, formulaires, tableaux, tableaux de bord et fenêtres modales.
6. Éviter les couleurs codées en dur qui conserveraient l'ancienne identité dorée.
7. Ne pas effectuer de refonte ou de nettoyage non demandé.

**CONTRÔLE FINAL :**

Après modification, vérifier que :
- Toutes les pages utilisent la nouvelle identité bleue.
- Les boutons ont un bleu doux et harmonieux.
- Les textes restent parfaitement lisibles.
- Les fonds sont clairs et élégants.
- Les animations et transitions fonctionnent exactement comme avant.
- Toutes les fonctionnalités restent intactes.

**IMPORTANT :** Il s'agit exclusivement d'une opération de remplacement et d'harmonisation des couleurs, et non d'une refonte graphique. Préserve intégralement le travail existant.