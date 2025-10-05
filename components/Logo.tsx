// Logo.tsx - Composant Annuaire Bergerac (RÉEL)
// Export du 05/10/2025 18:27:53
// ATTENTION: Contenu de fallback - remplacez par votre code réel

import React from 'react';

interface LogoProps {
  onNavigate?: (page: string, params?: any) => void;
  [key: string]: any;
}

export function Logo({ onNavigate, ...props }: LogoProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Logo</h1>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground mb-4">
            🚀 <strong>Composant RÉEL du projet Annuaire Bergerac</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Ce composant fait partie intégrante de votre application.
            Remplacez ce code par l'implémentation réelle lors de l'importation.
          </p>
          
          {onNavigate && (
            <div className="mt-4">
              <button 
                onClick={() => onNavigate('home')}
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Retour à l'accueil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Logo;