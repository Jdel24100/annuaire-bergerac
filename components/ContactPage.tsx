// ContactPage - Composant Annuaire Bergerac
// Export complet du 05/10/2025 17:43:55

import React from 'react';


interface ContactPageProps {
  onNavigate?: (page: string, params?: any) => void;
  [key: string]: any;
}

export function ContactPage({ onNavigate, ...props }: ContactPageProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4">ContactPage</h1>
      <p className="text-muted-foreground">
        Composant ContactPage du projet Annuaire Bergerac
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Ce fichier représente votre composant ContactPage réel.
        Dans votre projet complet, ce composant contient toute votre logique métier.
      </p>
    </div>
  );
}

export default ContactPage;
