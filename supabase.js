// Configuración pública de Supabase.
const SUPABASE_URL = 'https://pgfgmxeqisrwkrwtvbum.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_6al9XSM0nTc6-RlkX2UUrw_SLaQdwEh';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
