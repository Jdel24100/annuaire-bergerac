import React from 'react';
import { NavigationSimpleFixed } from './components/NavigationSimpleFixed';

// Test de navigation simple
export default function NavigationTest() {
  const [currentPage, setCurrentPage] = React.useState('home' as any);
  
  const handleNavigate = (page: any) => {
    setCurrentPage(page);
    console.log('Navigation vers:', page);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Test avec styles inline pour s'assurer que ça marche */}
      <div style={{ 
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '4rem'
          }}>
            
            {/* Logo */}
            <div style={{ fontWeight: 700, fontSize: '1.25rem' }}>
              Annuaire Bergerac
            </div>
            
            {/* Navigation Desktop - toujours visible sur desktop */}
            <nav style={{
              display: window.innerWidth >= 768 ? 'flex' : 'none',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <button style={{
                padding: '0.5rem 1rem',
                border: 'none',
                background: currentPage === 'home' ? '#f1f5f9' : 'transparent',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }} onClick={() => handleNavigate('home')}>
                🏠 Accueil
              </button>
              
              <button style={{
                padding: '0.5rem 1rem',
                border: 'none',
                background: currentPage === 'search' ? '#f1f5f9' : 'transparent',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }} onClick={() => handleNavigate('search')}>
                🔍 Recherche
              </button>
              
              <button style={{
                padding: '0.5rem 1rem',
                border: 'none',
                background: 'transparent',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}>
                📂 Catégories
              </button>
              
              <button style={{
                padding: '0.5rem 1rem',
                border: 'none',
                background: currentPage === 'blog' ? '#f1f5f9' : 'transparent',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }} onClick={() => handleNavigate('blog')}>
                📖 Aide
              </button>
            </nav>
            
            {/* Actions droite */}
            <div style={{
              display: window.innerWidth >= 768 ? 'flex' : 'none',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <button style={{
                padding: '0.5rem 1rem',
                border: '1px solid #e2e8f0',
                background: 'transparent',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}>
                Connexion
              </button>
              
              <button style={{
                padding: '0.5rem 1rem',
                border: 'none',
                background: '#2563eb',
                color: 'white',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}>
                Inscription
              </button>
            </div>
            
            {/* Mobile menu trigger */}
            <div style={{
              display: window.innerWidth >= 768 ? 'none' : 'block'
            }}>
              <button style={{
                padding: '0.5rem',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '1.5rem'
              }}>
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Test avec NavigationSimpleFixed */}
      <NavigationSimpleFixed currentPage={currentPage} onNavigate={handleNavigate} />
      
      {/* Contenu de test */}
      <main style={{ padding: '2rem' }}>
        <h1>Test Navigation - Page: {currentPage}</h1>
        <p>✅ Navigation inline fonctionne</p>
        <p>✅ NavigationSimpleFixed doit fonctionner aussi</p>
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Test Responsive</h2>
          <p>Largeur écran: {window.innerWidth}px</p>
          <p>Desktop: {window.innerWidth >= 768 ? 'OUI' : 'NON'}</p>
        </div>
      </main>
    </div>
  );
}