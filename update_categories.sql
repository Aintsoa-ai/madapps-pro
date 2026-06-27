-- 1. Nettoyage des anciennes catégories de test (Optionnel)
-- Si vous voulez supprimer les anciennes, décommentez la ligne suivante (Attention, cela mettra à NULL les category_id des apps existantes)
-- DELETE FROM categories;

-- 2. Insertion des nouvelles catégories officielles de MadaStack
INSERT INTO categories (id, name, slug, icon) VALUES 
('11111111-1111-1111-1111-111111111111', 'Outils & Utilitaires', 'outils', 'wrench'),
('22222222-2222-2222-2222-222222222222', 'Productivité & Professionnel', 'productivite', 'briefcase'),
('33333333-3333-3333-3333-333333333333', 'Réseaux Sociaux & Communication', 'communication', 'message-square'),
('44444444-4444-4444-4444-444444444444', 'Divertissement & Jeux', 'divertissement', 'gamepad-2'),
('55555555-5555-5555-5555-555555555555', 'Éducation & Apprentissage', 'education', 'graduation-cap'),
('66666666-6666-6666-6666-666666666666', 'Finances & Commerce', 'finance', 'credit-card'),
('77777777-7777-7777-7777-777777777777', 'Style de vie & Santé', 'lifestyle', 'heart')
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, icon = EXCLUDED.icon;
