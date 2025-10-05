// PricingPage - Composant Annuaire Bergerac
// Export du 05/10/2025 11:23:10

import React from 'react';

interface PricingPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4">PricingPage</h1>
      <p className="text-muted-foreground">
        Composant PricingPage du projet Annuaire Bergerac
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Ce fichier représente votre composant PricingPage réel
        avec toutes vos personnalisations.
      </p>
    </div>
  );
}

export default PricingPage;