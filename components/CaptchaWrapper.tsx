// CaptchaWrapper - Composant Annuaire Bergerac
// Export complet du 05/10/2025 11:37:58

import React from 'react';


interface CaptchaWrapperProps {
  onNavigate?: (page: string, params?: any) => void;
  [key: string]: any;
}

export function CaptchaWrapper({ onNavigate, ...props }: CaptchaWrapperProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4">CaptchaWrapper</h1>
      <p className="text-muted-foreground">
        Composant CaptchaWrapper du projet Annuaire Bergerac
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Ce fichier représente votre composant CaptchaWrapper réel.
        Dans votre projet complet, ce composant contient toute votre logique métier.
      </p>
    </div>
  );
}

export default CaptchaWrapper;
