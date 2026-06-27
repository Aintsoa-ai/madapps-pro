import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
  { name: 'Outils & Utilitaires', slug: 'outils', icon: 'wrench' },
  { name: 'Productivité & Professionnel', slug: 'productivite', icon: 'briefcase' },
  { name: 'Réseaux Sociaux & Communication', slug: 'communication', icon: 'message-square' },
  { name: 'Divertissement & Jeux', slug: 'divertissement', icon: 'gamepad-2' },
  { name: 'Éducation & Apprentissage', slug: 'education', icon: 'graduation-cap' },
  { name: 'Finances & Commerce', slug: 'finance', icon: 'credit-card' },
  { name: 'Style de vie & Santé', slug: 'lifestyle', icon: 'heart' }
];

async function seed() {
  console.log('Insertion des catégories...');
  
  for (const cat of categories) {
    // Vérifier si elle existe déjà par son slug
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', cat.slug)
      .single();

    if (existing) {
      console.log(`Mise à jour de la catégorie existante: ${cat.name}`);
      const { error } = await supabase
        .from('categories')
        .update({ name: cat.name, icon: cat.icon })
        .eq('id', existing.id);
      if (error) console.error('Erreur:', error.message);
    } else {
      console.log(`Création de la catégorie: ${cat.name}`);
      const { error } = await supabase
        .from('categories')
        .insert([cat]);
      if (error) console.error('Erreur:', error.message);
    }
  }
  console.log('Terminé !');
}

seed();
