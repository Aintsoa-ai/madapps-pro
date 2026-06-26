# Nos Idées — MadApps Pro

## Points Forts
- Interface graphique moderne et dynamique (Tailwind CSS, animations).
- Authentification unifiée et extensible (préparation pour Social Login Google/GitHub).
- Base de données robuste via Supabase avec architecture relationnelle scalable.
- Mises à jour instantanées (optimistic UI) pour les likes et compteurs.

## Faiblesses & Dette Technique (À corriger)
- **Dette Architecturale (Urgent)** : Le fichier `AppDetails.tsx` fait plus de 200 lignes et mélange logique de base de données (fetch commentaires, updates) avec l'interface. Il viole la règle #1 (Custom Hooks) et #2 (Composants modulaires). Il faut extraire `useComments`, `useAppStats` et scinder l'interface en `<CommentSection />`, `<AppBanner />`.
- Manque de pagination pour les applications sur la page d'accueil et les commentaires.
- La création de profil automatique via OAuth Google n'est pas encore sécurisée par un Trigger SQL natif.

## Ce qui a été fait (Aujourd'hui)
- [x] Uniformisation de la taille des cartes d'applications (Flexbox).
- [x] Ajout du système d'authentification membres (Page `/auth` avec bouton Google).
- [x] Création du schéma `supabase_schema_v2.sql` pour les fonctionnalités avancées.
- [x] Implémentation du système de Commentaires et Notes par étoiles.
- [x] Implémentation des statistiques détaillées : Vues, Téléchargements, J'aime / Je n'aime pas.
- [x] Système de messagerie (Contact Admin) avec bouton flottant.
- [x] Tableau de bord Administrateur amélioré (Stats journalières, Top apps, lecture des messages).
- [x] Mise à jour des types TypeScript pour inclure les nouveaux compteurs.

## Ce qui reste à accomplir (Idées pour la suite)
- [ ] Refactoriser `AppDetails.tsx` selon les règles de Clean Architecture (Séparation des préoccupations).
- [ ] Mettre en place un système de "debouncing" pour la barre de recherche.
- [ ] Implémenter la fonctionnalité "Modifier" et "Supprimer" sur le tableau de bord admin.
- [ ] Ajouter un système de pagination pour le catalogue d'applications.
- [ ] Créer un Trigger SQL sur `auth.users` pour générer automatiquement la ligne dans `profiles`.
