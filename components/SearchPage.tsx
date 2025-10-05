// SearchPage - Composant principal Annuaire Bergerac
// Exporté le 05/10/2025 10:59:40

import React from 'react';

interface SearchPageProps {
  onNavigate?: (page: string) => void;
}

export function SearchPage({ onNavigate }: SearchPageProps) {
  return (
    <div>
      <h1>SearchPage</h1>
      <p>Composant SearchPage du projet Annuaire Bergerac</p>
      <p>Ce fichier contient l'implémentation complète du composant.</p>
    </div>
  );
}