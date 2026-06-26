-- Mises à jour de la table apps pour les statistiques
ALTER TABLE apps ADD COLUMN IF NOT EXISTS views_count integer DEFAULT 0;
ALTER TABLE apps ADD COLUMN IF NOT EXISTS downloads_count integer DEFAULT 0;
ALTER TABLE apps ADD COLUMN IF NOT EXISTS likes_count integer DEFAULT 0;
ALTER TABLE apps ADD COLUMN IF NOT EXISTS dislikes_count integer DEFAULT 0;

-- Création de la table des profils utilisateurs (membres)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username text,
  avatar_url text,
  role text DEFAULT 'member', -- 'member' ou 'admin'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Création de la table des commentaires et notes
CREATE TABLE IF NOT EXISTS comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5), -- Étoiles de 1 à 5
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Création de la table des votes (J'aime / Je n'aime pas)
CREATE TABLE IF NOT EXISTS votes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  app_id uuid REFERENCES apps(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  vote_type text CHECK (vote_type IN ('like', 'dislike')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(app_id, user_id) -- Un seul vote par utilisateur par application
);

-- Création de la table des messages (Contact Admin)
CREATE TABLE IF NOT EXISTS messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  subject text,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Création de la table des visites quotidiennes
CREATE TABLE IF NOT EXISTS daily_visits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  visit_date date DEFAULT CURRENT_DATE UNIQUE,
  visitors_count integer DEFAULT 1
);

-- Désactivation temporaire de la sécurité RLS pour le développement
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_visits DISABLE ROW LEVEL SECURITY;
