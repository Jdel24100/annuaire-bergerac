// DashboardPage - Composant Annuaire Bergerac
// Export du 05/10/2025 11:23:10

import React from 'react';

interface DashboardPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function DashboardPage({ onNavigate }: DashboardPageProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4">DashboardPage</h1>
      <p className="text-muted-foreground">
        Composant DashboardPage du projet Annuaire Bergerac
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Ce fichier représente votre composant DashboardPage réel
        avec toutes vos personnalisations.
      </p>
    </div>
  );
}

export default DashboardPage;