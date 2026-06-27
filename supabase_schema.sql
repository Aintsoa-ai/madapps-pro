-- Création de la table des catégories
CREATE TABLE IF NOT EXISTS categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Création de la table des applications
CREATE TABLE IF NOT EXISTS apps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  short_description text,
  full_description text,
  icon_url text,
  banner_url text,
  apk_url text,
  developer_name text DEFAULT 'MadApps',
  featured boolean DEFAULT false,
  status text DEFAULT 'published',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Désactivation temporaire de la sécurité RLS pour le démarrage rapide (sera sécurisé à la phase 3)
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE apps DISABLE ROW LEVEL SECURITY;

-- Insertion de données de test (Catégories définitives)
INSERT INTO categories (id, name, slug, icon) VALUES 
('11111111-1111-1111-1111-111111111111', 'Productivité & Professionnel', 'productivite', 'briefcase'),
('22222222-2222-2222-2222-222222222222', 'Outils & Utilitaires', 'outils', 'wrench'),
('33333333-3333-3333-3333-333333333333', 'Divertissement & Jeux', 'divertissement', 'gamepad-2'),
('44444444-4444-4444-4444-444444444444', 'Réseaux Sociaux & Communication', 'communication', 'message-square'),
('55555555-5555-5555-5555-555555555555', 'Éducation & Apprentissage', 'education', 'graduation-cap'),
('66666666-6666-6666-6666-666666666666', 'Finances & Commerce', 'finance', 'credit-card'),
('77777777-7777-7777-7777-777777777777', 'Style de vie & Santé', 'lifestyle', 'heart')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon;

-- Plus aucune application de test insérée par défaut.
