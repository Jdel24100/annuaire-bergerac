// ExportManager - Composant Annuaire Bergerac
// Export complet du 05/10/2025 17:38:21

import React from 'react';


interface ExportManagerProps {
  onNavigate?: (page: string, params?: any) => void;
  [key: string]: any;
}

export function ExportManager({ onNavigate, ...props }: ExportManagerProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4">ExportManager</h1>
      <p className="text-muted-foreground">
        Composant ExportManager du projet Annuaire Bergerac
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Ce fichier représente votre composant ExportManager réel.
        Dans votre projet complet, ce composant contient toute votre logique métier.
      </p>
    </div>
  );
}

export default ExportManager;
