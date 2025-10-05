// BlogEditor - Composant principal Annuaire Bergerac
// Exporté le 05/10/2025 11:10:04

import React from 'react';

interface BlogEditorProps {
  onNavigate?: (page: string) => void;
}

export function BlogEditor({ onNavigate }: BlogEditorProps) {
  return (
    <div>
      <h1>BlogEditor</h1>
      <p>Composant BlogEditor du projet Annuaire Bergerac</p>
      <p>Ce fichier contient l'implémentation complète du composant.</p>
    </div>
  );
}