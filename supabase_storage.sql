-- Confirmer manuellement l'email de l'administrateur
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email = 'admin@madapps.com';

-- Créer les buckets de stockage (S'ils n'existent pas déjà)
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('apps', 'apps', true), 
  ('media', 'media', true) 
ON CONFLICT (id) DO NOTHING;

-- Autoriser la lecture publique
CREATE POLICY "Public Access Media" ON storage.objects FOR SELECT USING ( bucket_id = 'media' );
CREATE POLICY "Public Access Apps" ON storage.objects FOR SELECT USING ( bucket_id = 'apps' );

-- Autoriser l'insertion pour les utilisateurs authentifiés
CREATE POLICY "Auth Insert Media" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'media' AND auth.role() = 'authenticated' );
CREATE POLICY "Auth Insert Apps" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'apps' AND auth.role() = 'authenticated' );

-- Autoriser la mise à jour pour les utilisateurs authentifiés
CREATE POLICY "Auth Update Media" ON storage.objects FOR UPDATE USING ( bucket_id = 'media' AND auth.role() = 'authenticated' );
CREATE POLICY "Auth Update Apps" ON storage.objects FOR UPDATE USING ( bucket_id = 'apps' AND auth.role() = 'authenticated' );
