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

-- Insertion de données de test (Catégories)
INSERT INTO categories (id, name, slug, icon) VALUES 
('11111111-1111-1111-1111-111111111111', 'Productivité', 'productivite', 'briefcase'),
('22222222-2222-2222-2222-222222222222', 'Outils & Utilitaires', 'outils', 'wrench'),
('33333333-3333-3333-3333-333333333333', 'Divertissement', 'divertissement', 'gamepad-2')
ON CONFLICT DO NOTHING;

-- Insertion de données de test (Applications)
INSERT INTO apps (title, slug, short_description, icon_url, banner_url, featured, category_id) VALUES 
('Nyrnox Pro', 'nyrnox-pro', 'L''assistant IA ultime pour votre productivité.', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=250&h=250', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=400', true, '11111111-1111-1111-1111-111111111111'),
('Miara-Dia', 'miara-dia', 'Covoiturage simplifié pour tous vos trajets.', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=250&h=250', 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800&h=400', true, '22222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;
