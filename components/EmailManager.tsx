// EmailManager - Composant Annuaire Bergerac
// Export complet du 05/10/2025 17:43:55

import React from 'react';


interface EmailManagerProps {
  onNavigate?: (page: string, params?: any) => void;
  [key: string]: any;
}

export function EmailManager({ onNavigate, ...props }: EmailManagerProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4">EmailManager</h1>
      <p className="text-muted-foreground">
        Composant EmailManager du projet Annuaire Bergerac
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Ce fichier représente votre composant EmailManager réel.
        Dans votre projet complet, ce composant contient toute votre logique métier.
      </p>
    </div>
  );
}

export default EmailManager;
