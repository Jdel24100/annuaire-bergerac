// useAdminSettings - Hook personnalisé Annuaire Bergerac
import { useState, useEffect } from 'react';

export function useAdminSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  
  // Implémentation de votre hook useAdminSettings
  
  return {
    data,
    isLoading,
  };
}