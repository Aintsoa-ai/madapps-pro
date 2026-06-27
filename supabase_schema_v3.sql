-- Ajout de la colonne pour stocker jusqu'à 5 captures d'écran
ALTER TABLE apps ADD COLUMN screenshots text[] DEFAULT '{}';
