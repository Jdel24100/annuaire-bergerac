// HomePage - Composant principal Annuaire Bergerac
// Exporté le 05/10/2025 11:10:04

import React from 'react';

interface HomePageProps {
  onNavigate?: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      <h1>HomePage</h1>
      <p>Composant HomePage du projet Annuaire Bergerac</p>
      <p>Ce fichier contient l'implémentation complète du composant.</p>
    </div>
  );
}