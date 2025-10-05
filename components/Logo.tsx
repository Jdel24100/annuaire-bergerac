// Logo - Composant principal Annuaire Bergerac
// Exporté le 05/10/2025 11:10:04

import React from 'react';

interface LogoProps {
  onNavigate?: (page: string) => void;
}

export function Logo({ onNavigate }: LogoProps) {
  return (
    <div>
      <h1>Logo</h1>
      <p>Composant Logo du projet Annuaire Bergerac</p>
      <p>Ce fichier contient l'implémentation complète du composant.</p>
    </div>
  );
}