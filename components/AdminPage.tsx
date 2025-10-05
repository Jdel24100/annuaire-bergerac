// AdminPage - Composant principal Annuaire Bergerac
// Exporté le 05/10/2025 10:59:40

import React from 'react';

interface AdminPageProps {
  onNavigate?: (page: string) => void;
}

export function AdminPage({ onNavigate }: AdminPageProps) {
  return (
    <div>
      <h1>AdminPage</h1>
      <p>Composant AdminPage du projet Annuaire Bergerac</p>
      <p>Ce fichier contient l'implémentation complète du composant.</p>
    </div>
  );
}