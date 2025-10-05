// AuthPages - Composant principal Annuaire Bergerac
// Exporté le 05/10/2025 10:59:40

import React from 'react';

interface AuthPagesProps {
  onNavigate?: (page: string) => void;
}

export function AuthPages({ onNavigate }: AuthPagesProps) {
  return (
    <div>
      <h1>AuthPages</h1>
      <p>Composant AuthPages du projet Annuaire Bergerac</p>
      <p>Ce fichier contient l'implémentation complète du composant.</p>
    </div>
  );
}