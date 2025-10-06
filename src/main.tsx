import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

// Vérification de l'environnement et configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// Configuration pour la production
if (isProduction) {
  console.log('📦 Annuaire Bergerac - Production');
  
  // Désactiver les logs console en production (sauf erreurs)
  if (!import.meta.env.VITE_DEBUG) {
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.debug = () => {};
  }
}

// Démarrage silencieux en production

// Gestion d'erreur globale
window.addEventListener('error', (event) => {
  console.error('Erreur globale:', event.error);
  
  // En production, on peut envoyer les erreurs à un service de monitoring
  if (isProduction) {
    // TODO: Intégrer un service comme Sentry ou LogRocket
    console.error('Erreur critique en production:', event.error);
  }
});

// Gestion des promesses rejetées
window.addEventListener('unhandledrejection', (event) => {
  console.error('Promise rejetée:', event.reason);
  
  if (isProduction) {
    // Prévenir l'erreur par défaut et la logger
    event.preventDefault();
    console.error('Promise rejetée en production:', event.reason);
  }
});

// Montage de l'application
const root = document.getElementById('root');

if (!root) {
  throw new Error('Element root non trouvé dans le DOM');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)