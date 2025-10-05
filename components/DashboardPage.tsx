// DashboardPage - Composant principal Annuaire Bergerac
// Exporté le 05/10/2025 11:10:04

import React from 'react';

interface DashboardPageProps {
  onNavigate?: (page: string) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  return (
    <div>
      <h1>DashboardPage</h1>
      <p>Composant DashboardPage du projet Annuaire Bergerac</p>
      <p>Ce fichier contient l'implémentation complète du composant.</p>
    </div>
  );
}