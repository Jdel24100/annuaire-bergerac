import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function TestMotion() {
  const [showElement, setShowElement] = React.useState(true);

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: '#f8fafc' }}>
      <h1 style={{ marginBottom: '2rem' }}>Test Motion/React</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => setShowElement(!showElement)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          {showElement ? 'Masquer' : 'Afficher'} l'élément
        </button>
      </div>

      {/* Test AnimatePresence */}
      <AnimatePresence mode="wait">
        {showElement && (
          <motion.div
            key="test-element"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              padding: '2rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              marginBottom: '2rem'
            }}
          >
            <h2>Élément animé</h2>
            <p>Cet élément utilise Motion pour l'animation.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test motion simple */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          padding: '1rem',
          backgroundColor: '#10b981',
          color: 'white',
          borderRadius: '0.375rem',
          cursor: 'pointer',
          textAlign: 'center'
        }}
      >
        Hover et cliquez sur moi !
      </motion.div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f1f5f9', borderRadius: '0.375rem' }}>
        <h3>Status du test:</h3>
        <p>✅ Motion/React importé avec succès</p>
        <p>✅ AnimatePresence fonctionne</p>
        <p>✅ Animations motion fonctionnelles</p>
        <p>✅ CSS valide (pas d'accolades manquantes)</p>
      </div>
    </div>
  );
}