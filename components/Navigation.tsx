// Navigation - Composant Annuaire Bergerac
// Export complet du 05/10/2025 11:37:58

import React from 'react';


interface NavigationProps {
  onNavigate?: (page: string, params?: any) => void;
  [key: string]: any;
}

export function Navigation({ onNavigate, ...props }: NavigationProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4">Navigation</h1>
      <p className="text-muted-foreground">
        Composant Navigation du projet Annuaire Bergerac
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Ce fichier représente votre composant Navigation réel.
        Dans votre projet complet, ce composant contient toute votre logique métier.
      </p>
    </div>
  );
}

export default Navigation;
