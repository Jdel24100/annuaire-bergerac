// Point d'entrée centralisé pour Supabase
export { supabase, getSupabaseClient, projectId, publicAnonKey } from './client';

// Types utiles
export type { User, Session } from '@supabase/supabase-js';