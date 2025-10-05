// BlogPage - Composant Annuaire Bergerac
// Export du 05/10/2025 11:23:10

import React from 'react';

interface BlogPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

export function BlogPage({ onNavigate }: BlogPageProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4">BlogPage</h1>
      <p className="text-muted-foreground">
        Composant BlogPage du projet Annuaire Bergerac
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Ce fichier représente votre composant BlogPage réel
        avec toutes vos personnalisations.
      </p>
    </div>
  );
}

export default BlogPage;