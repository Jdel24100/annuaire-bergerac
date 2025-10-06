import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Client Supabase singleton - une seule instance pour toute l'application
let supabaseInstance: ReturnType<typeof createClient> | null = null;

// Nettoyage des instances existantes au chargement
if (typeof window !== 'undefined') {
  // Nettoyer le localStorage de toute session conflictuelle si nécessaire
  const storageKey = 'annuaire-bergerac-auth';
  
  // Vérifier s'il y a des clés de session conflictuelles
  const existingKeys = Object.keys(localStorage).filter(key => 
    key.startsWith('sb-') && key !== `sb-${storageKey}`
  );
  
  // Optionnel: nettoyer les anciennes sessions (à activer uniquement si nécessaire)
  // existingKeys.forEach(key => localStorage.removeItem(key));
}

export function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey,
      {
        auth: {
          // Utiliser le même storage key pour éviter les conflicts d'instances multiples
          storageKey: 'annuaire-bergerac-auth',
          // Optimiser les paramètres pour éviter les instances multiples
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          // Éviter les avertissements d'instances multiples
          debug: false,
          // Autorefresh optimisé
          autoRefreshToken: true
        },
        // Configuration globale pour éviter les conflits
        global: {
          headers: {
            'X-Client-Info': 'annuaire-bergerac@1.0.0'
          }
        },
        // Réduire les logs pour éviter les warnings
        db: {
          schema: 'public'
        }
      }
    );
  }
  return supabaseInstance;
}

// Export du client singleton
export const supabase = getSupabaseClient();

// Fonction de nettoyage (optionnelle, pour le développement)
export function cleanupSupabaseClient() {
  if (supabaseInstance) {
    // Fermer les connexions et nettoyer les listeners
    supabaseInstance.removeAllChannels();
    supabaseInstance = null;
  }
}

// Nettoyage automatique lors du rechargement de page (développement uniquement)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.addEventListener('beforeunload', cleanupSupabaseClient);
}

// Export des constantes pour compatibilité
export { projectId, publicAnonKey } from './info';