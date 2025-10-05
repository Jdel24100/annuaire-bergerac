// TrashPage - Composant Annuaire Bergerac
// Export complet du 05/10/2025 17:38:21

import React from 'react';


interface TrashPageProps {
  onNavigate?: (page: string, params?: any) => void;
  [key: string]: any;
}

export function TrashPage({ onNavigate, ...props }: TrashPageProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4">TrashPage</h1>
      <p className="text-muted-foreground">
        Composant TrashPage du projet Annuaire Bergerac
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Ce fichier représente votre composant TrashPage réel.
        Dans votre projet complet, ce composant contient toute votre logique métier.
      </p>
    </div>
  );
}

export default TrashPage;
