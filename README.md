# MadApps Pro

## 1. Informations générales
**Nom du projet :** MadApps Pro.
**Type de produit :** Application web/mobile de distribution d’applications conçues par l’éditeur.
**Plateforme cible principale :** Web (React) et Mobile (Android via PWA/Capacitor ou React Native dans le futur).
**Backend :** Supabase (Postgres, Auth, Storage, Realtime).

MadApps Pro a pour objectif de permettre à tout utilisateur de consulter et télécharger les applications créées par l'éditeur, depuis une interface proche d’un store grand public. 

## 2. Objectifs fonctionnels
- Présenter le catalogue d’applications de manière claire et attractive.
- Faciliter la découverte par recherche, catégories et mises en avant.
- Permettre le téléchargement direct des applications.
- Gérer les versions, les médias et les descriptions depuis un back-office.
- Sécuriser les accès et les données via Supabase.

## 3. Périmètre du MVP
- Accueil avec applications mises en avant.
- Catalogue complet.
- Recherche et filtres.
- Fiche application détaillée (icône, description, captures d'écran, changelog, etc.).
- Téléchargement des fichiers (via Supabase Storage).
- Authentification (via Supabase Auth).
- Connexion administrateur et back-office de gestion du catalogue.

## 4. Parcours utilisateur
1. **Consultation :** Accueil > Recherche/Catégorie > Fiche application.
2. **Téléchargement :** Clic sur télécharger > URL depuis Supabase Storage > Téléchargement > Enregistrement de l'action.
3. **Publication (Admin) :** Connexion > Création de fiche > Ajout fichiers/médias > Publication.

## 5. Fonctionnalités (Côté Public)
- **Accueil :** Bannière, vedettes, nouveautés, catégories, top téléchargements.
- **Recherche :** Par nom, mot-clé, catégorie, suggestions, filtres.
- **Fiche :** Détails complets, médias (images/vidéos), versions, téléchargement, apps similaires.
- **Utilisateurs connectés :** Favoris, Notifications (nouvelles apps/versions).

## 6. Fonctionnalités (Côté Admin)
- **Catalogue :** Créer, modifier, masquer, mettre en avant, catégoriser.
- **Versions :** Créer des versions, upload APK, changelog, version active.
- **Médias :** Gestion des icônes, screenshots, vidéos.
- **Statistiques :** Téléchargements, vues, favoris, utilisateurs, logs audit.

## 7. Règles d'Architecture Strictes (Clean Architecture)
1. **Séparation des préoccupations (Custom Hooks) :** Ne jamais mélanger la logique BDD avec l'UI.
2. **Composants Modulaires :** Max 150-200 lignes par composant.
3. **Gestion propre des Styles :** Utilisation de Tailwind CSS ou Modules CSS.
4. **Typage strict (TypeScript) :** Dossier `src/types/`, pas de `any`.
5. **Refactorisation continue :** Boy Scout Rule appliquée à chaque modification.
