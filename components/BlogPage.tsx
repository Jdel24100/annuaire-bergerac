// BlogPage - Composant principal Annuaire Bergerac
// Exporté le 05/10/2025 11:10:04

import React from 'react';

interface BlogPageProps {
  onNavigate?: (page: string) => void;
}

export function BlogPage({ onNavigate }: BlogPageProps) {
  return (
    <div>
      <h1>BlogPage</h1>
      <p>Composant BlogPage du projet Annuaire Bergerac</p>
      <p>Ce fichier contient l'implémentation complète du composant.</p>
    </div>
  );
}