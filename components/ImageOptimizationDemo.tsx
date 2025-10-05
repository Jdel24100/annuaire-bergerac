// ImageOptimizationDemo - Composant Annuaire Bergerac
// Export complet du 05/10/2025 11:37:58

import React from 'react';


interface ImageOptimizationDemoProps {
  onNavigate?: (page: string, params?: any) => void;
  [key: string]: any;
}

export function ImageOptimizationDemo({ onNavigate, ...props }: ImageOptimizationDemoProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4">ImageOptimizationDemo</h1>
      <p className="text-muted-foreground">
        Composant ImageOptimizationDemo du projet Annuaire Bergerac
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Ce fichier représente votre composant ImageOptimizationDemo réel.
        Dans votre projet complet, ce composant contient toute votre logique métier.
      </p>
    </div>
  );
}

export default ImageOptimizationDemo;
