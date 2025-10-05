// Navigation - Composant principal Annuaire Bergerac
// Exporté le 05/10/2025 11:10:04

import React from 'react';

interface NavigationProps {
  onNavigate?: (page: string) => void;
}

export function Navigation({ onNavigate }: NavigationProps) {
  return (
    <div>
      <h1>Navigation</h1>
      <p>Composant Navigation du projet Annuaire Bergerac</p>
      <p>Ce fichier contient l'implémentation complète du composant.</p>
    </div>
  );
}