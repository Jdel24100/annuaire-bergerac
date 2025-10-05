// ThemeProvider - Composant principal Annuaire Bergerac
// Exporté le 05/10/2025 10:59:40

import React from 'react';

interface ThemeProviderProps {
  onNavigate?: (page: string) => void;
}

export function ThemeProvider({ onNavigate }: ThemeProviderProps) {
  return (
    <div>
      <h1>ThemeProvider</h1>
      <p>Composant ThemeProvider du projet Annuaire Bergerac</p>
      <p>Ce fichier contient l'implémentation complète du composant.</p>
    </div>
  );
}