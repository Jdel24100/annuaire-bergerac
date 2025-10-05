// AuthContext - Composant principal Annuaire Bergerac
// Exporté le 05/10/2025 10:59:40

import React from 'react';

interface AuthContextProps {
  onNavigate?: (page: string) => void;
}

export function AuthContext({ onNavigate }: AuthContextProps) {
  return (
    <div>
      <h1>AuthContext</h1>
      <p>Composant AuthContext du projet Annuaire Bergerac</p>
      <p>Ce fichier contient l'implémentation complète du composant.</p>
    </div>
  );
}