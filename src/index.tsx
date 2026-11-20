import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './easy-theme.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { loadMarketConfig } from './config/currencies';

const container = document.getElementById('root');
if (!container) throw new Error('Élément #root introuvable dans index.html');
const root = ReactDOM.createRoot(container);

// La configuration des marchés/devises (source : API) est chargée AVANT le premier rendu pour
// que tous les sélecteurs et formats l'utilisent. En cas d'échec, l'application démarre quand
// même ; les sélecteurs signalent l'indisponibilité au lieu d'afficher une liste inventée.
loadMarketConfig().finally(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
