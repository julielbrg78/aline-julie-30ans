import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/* Si les variables d'environnement Supabase sont renseignées, on active le mode
   "partagé" (toutes les réponses sont visibles par tout le monde). Sinon, le site
   bascule automatiquement sur un stockage local (localStorage) par appareil. */
export const supabase = url && key ? createClient(url, key) : null;
export const hasBackend = !!supabase;
