// AdminPage - Composant Annuaire Bergerac
// Export complet du 05/10/2025 17:38:21

import React from 'react';


interface AdminPageProps {
  onNavigate?: (page: string, params?: any) => void;
  [key: string]: any;
}

export function AdminPage({ onNavigate, ...props }: AdminPageProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4">AdminPage</h1>
      <p className="text-muted-foreground">
        Composant AdminPage du projet Annuaire Bergerac
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Ce fichier représente votre composant AdminPage réel.
        Dans votre projet complet, ce composant contient toute votre logique métier.
      </p>
    </div>
  );
}

export default AdminPage;
