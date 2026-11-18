# EASY — React + Vite

Frontend React 18, Vite 6, Tailwind 3, React Router 7.

Voir ../DEMARRAGE-EASY.md et ../RAPPORT-MIGRATION-VITE.md.

- Installation : npm ci
- Developpement : npm run dev (port 3000)
- Alias compatible : npm start
- Tests : npm test
- Production : npm run build → dist/
- Apercu : npm run preview (port 4173)

Copier .env.example vers .env.local ; les variables publiques utilisent le prefixe VITE_. Le backend Express/MongoDB reste dans ../backend et se lance separement.

Les fichiers dans migration/ sont des archives textuelles CRA, non executes. Aucun besoin de react-scripts, aucun script eject.
