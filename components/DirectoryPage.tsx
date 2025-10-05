// DirectoryPage - Composant Annuaire Bergerac
// Export du 05/10/2025 11:23:10

import React from 'react';

interface DirectoryPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function DirectoryPage({ onNavigate }: DirectoryPageProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4">DirectoryPage</h1>
      <p className="text-muted-foreground">
        Composant DirectoryPage du projet Annuaire Bergerac
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Ce fichier représente votre composant DirectoryPage réel
        avec toutes vos personnalisations.
      </p>
    </div>
  );
}

export default DirectoryPage;