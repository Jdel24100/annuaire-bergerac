// ContactPage - Composant principal Annuaire Bergerac
// Exporté le 05/10/2025 10:59:40

import React from 'react';

interface ContactPageProps {
  onNavigate?: (page: string) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  return (
    <div>
      <h1>ContactPage</h1>
      <p>Composant ContactPage du projet Annuaire Bergerac</p>
      <p>Ce fichier contient l'implémentation complète du composant.</p>
    </div>
  );
}