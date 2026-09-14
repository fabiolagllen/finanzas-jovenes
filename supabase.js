// Configuración pública de Supabase.
// Reemplaza SUPABASE_PUBLISHABLE_KEY con la clave publishable/anon de tu proyecto.
const SUPABASE_URL = 'https://pgfgmxeqisrwkrwtvbum.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'PEGA_AQUI_TU_CLAVE_PUBLICA_DE_SUPABASE';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
