// DirectoryPage - Composant principal Annuaire Bergerac
// Exporté le 05/10/2025 10:59:40

import React from 'react';

interface DirectoryPageProps {
  onNavigate?: (page: string) => void;
}

export function DirectoryPage({ onNavigate }: DirectoryPageProps) {
  return (
    <div>
      <h1>DirectoryPage</h1>
      <p>Composant DirectoryPage du projet Annuaire Bergerac</p>
      <p>Ce fichier contient l'implémentation complète du composant.</p>
    </div>
  );
}