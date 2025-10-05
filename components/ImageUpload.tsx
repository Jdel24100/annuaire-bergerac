// ImageUpload - Composant Annuaire Bergerac
// Export complet du 05/10/2025 17:43:55

import React from 'react';


interface ImageUploadProps {
  onNavigate?: (page: string, params?: any) => void;
  [key: string]: any;
}

export function ImageUpload({ onNavigate, ...props }: ImageUploadProps) {
  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-2xl font-bold mb-4">ImageUpload</h1>
      <p className="text-muted-foreground">
        Composant ImageUpload du projet Annuaire Bergerac
      </p>
      <p className="text-sm text-muted-foreground mt-4">
        Ce fichier représente votre composant ImageUpload réel.
        Dans votre projet complet, ce composant contient toute votre logique métier.
      </p>
    </div>
  );
}

export default ImageUpload;
