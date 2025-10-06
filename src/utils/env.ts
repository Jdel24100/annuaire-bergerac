// Utilitaires pour gérer les variables d'environnement de manière sécurisée

// Valeurs par défaut pour le développement
const DEFAULT_VALUES = {
  VITE_SUPABASE_URL: 'https://demo-project.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
  VITE_RECAPTCHA_SITE_KEY: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
  VITE_GOOGLE_CLIENT_ID: ''
} as const;

export function getEnvVar(key: keyof ImportMetaEnv, fallback?: string): string {
  try {
    // En environnement serveur, retourner la valeur par défaut
    if (typeof window === 'undefined') {
      return fallback || DEFAULT_VALUES[key] || '';
    }
    
    // Vérifier si import.meta.env est disponible
    if (typeof import.meta === 'undefined' || !import.meta.env) {
      const defaultValue = fallback || DEFAULT_VALUES[key] || '';
      if (!defaultValue) {
        console.warn(`Variables d'environnement non disponibles pour ${key}`);
      }
      return defaultValue;
    }
    
    const value = import.meta.env[key];
    
    // Retourner la valeur si elle existe et n'est pas vide
    if (value && typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }
    
    // Si pas de valeur, utiliser le fallback ou la valeur par défaut
    const defaultValue = fallback || DEFAULT_VALUES[key] || '';
    if (!defaultValue) {
      console.warn(`Variable d'environnement ${key} non définie`);
    }
    return defaultValue;
    
  } catch (error) {
    console.warn(`Erreur lors de l'accès à la variable d'environnement ${key}:`, error);
    return fallback || DEFAULT_VALUES[key] || '';
  }
}

export function getSupabaseConfig() {
  const url = getEnvVar('VITE_SUPABASE_URL');
  const anonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');
  
  // Extraire l'ID du projet de l'URL Supabase
  let projectId = '';
  if (url) {
    try {
      const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
      projectId = match ? match[1] : '';
    } catch (error) {
      console.warn('Erreur lors de l\'extraction du project ID:', error);
    }
  }
  
  const isConfigured = !!(url && anonKey && projectId);
  const isDemoMode = url === DEFAULT_VALUES.VITE_SUPABASE_URL;
  
  if (isDemoMode) {
    console.info('🔧 Mode démo Supabase activé - utilisez vos vraies valeurs pour la production');
  }
  
  return {
    url,
    anonKey,
    projectId,
    isConfigured,
    isDemoMode
  };
}

export function getRecaptchaConfig() {
  const siteKey = getEnvVar('VITE_RECAPTCHA_SITE_KEY');
  const isTest = siteKey === '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
  
  if (isTest) {
    console.info('🔧 Mode test reCAPTCHA activé - clé de test Google (localhost uniquement)');
  }
  
  return {
    siteKey,
    isTest,
    isConfigured: !!siteKey
  };
}