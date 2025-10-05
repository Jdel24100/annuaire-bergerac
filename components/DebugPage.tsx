// DebugPage - Composant Annuaire Bergerac
// Export complet du 05/10/2025 17:38:21

import React from 'react';


interface DebugPageProps {
  onNavigate?: (page: string, params?: any) => void;
  [key: string]: any;
}

export function DebugPage({ onNavigate, ...props }: DebugPageProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4">DebugPage</h1>
      <p className="text-muted-foreground">
        Composant DebugPage du projet Annuaire Bergerac
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Ce fichier représente votre composant DebugPage réel.
        Dans votre projet complet, ce composant contient toute votre logique métier.
      </p>
    </div>
  );
}

export default DebugPage;
