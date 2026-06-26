import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function signUpAdmin() {
  const { data, error } = await supabase.auth.signUp({
    email: 'admin@madapps.com',
    password: 'MadAppsAdmin2026!',
  });
  if (error) {
    console.error('Erreur:', error.message);
  } else {
    console.log('Utilisateur créé avec succès !');
  }
}

signUpAdmin();
