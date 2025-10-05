// useDatabase - Hook personnalisé Annuaire Bergerac
import { useState, useEffect } from 'react';

export function useDatabase() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  
  // Implémentation de votre hook useDatabase
  
  return {
    data,
    isLoading,
  };
}