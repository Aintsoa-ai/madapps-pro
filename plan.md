# Plan de conception — MadApps Pro

## Phase 1 : Conception et Initialisation (EN COURS)
- [x] Définition des documents de suivi (README, plan, nos_idees, audit).
- [ ] Initialisation du projet web (React + TypeScript).
- [ ] Configuration de Tailwind CSS et des outils de qualité (ESLint, Prettier).
- [ ] Validation du modèle de données détaillé (Supabase).
- [ ] Définition des règles RLS initiales.

## Phase 2 : Développement du MVP
- **Frontend :**
  - [x] Configuration du router (React Router).
  - [x] Création des layouts principaux (Public et Admin).
  - [x] Catalogue public et système de recherche.
  - [x] Page de fiche d'application détaillée.
- **Backend (Supabase) :**
  - [ ] Mise en place de Supabase Auth.
  - [x] Déploiement des tables (apps, categories, versions, etc.).
  - [ ] Configuration de Supabase Storage pour les APK et médias.
- **Intégration BDD/UI :**
  - [ ] Implémentation des actions de téléchargement.
  - [x] Custom hooks pour chaque entité (`useApps`, `useAuth`, etc.).

## Phase 3 : Admin et Sécurité
- Développement du Back-office.
- Formulaires de création et modification d'applications.
- Upload de fichiers (APK, vidéos, images).
- Mise en place stricte des règles RLS.
- Journalisation des actions sensibles (Audit logs).

## Phase 4 : Tests et Mise en production
- Tests de bout en bout des parcours utilisateurs.
- Vérifications de sécurité (accès fichiers, permissions Admin).
- Ajustements UI/UX pour un rendu "Premium".
- Déploiement du MVP.

## Rappel des conventions (Clean Architecture)
- Tout appel réseau / BDD est isolé dans des Custom Hooks.
- Aucun composant au-dessus de 150-200 lignes.
- Typage strict avec TypeScript.
- Stylisation via Tailwind CSS.
