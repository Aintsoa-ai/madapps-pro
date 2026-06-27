# Nos Idées — AintStore

## Points Forts (Ce qui marche très bien)
- Interface graphique moderne, premium et dynamique (Tailwind CSS, animations).
- Personnalisation complète des scrollbars (barres de défilement) rendues ultra-fines et "discrètes" pour un aspect professionnel.
- Possibilité d'ajouter jusqu'à 5 captures d'écran par application (Upload complet et galerie).
- Authentification unifiée et extensible (préparation pour Social Login Google/GitHub).
- Base de données robuste via Supabase avec architecture relationnelle scalable.
- Mises à jour instantanées (optimistic UI) pour les likes et compteurs.

## Faiblesses & Dette Technique (À corriger)
- **Dette Architecturale (Urgent)** : Le fichier `AppDetails.tsx` fait plus de 200 lignes et mélange logique de base de données (fetch commentaires, updates) avec l'interface. Il viole la règle #1 (Custom Hooks) et #2 (Composants modulaires). Il faut extraire `useComments`, `useAppStats` et scinder l'interface en `<CommentSection />`, `<AppBanner />`.
- Manque de pagination pour les applications sur la page d'accueil et les commentaires.
- La création de profil automatique via OAuth Google n'est pas encore sécurisée par un Trigger SQL natif.

## Ce qui a été fait (Aujourd'hui)
- [x] Renommage complet de la plateforme en **AintStore**.
- [x] Ajout de l'œil sur les mots de passe (visibilité toggle).
- [x] Ajout de la règle de Clean Architecture (Séparation stricte UI/Logique, 150-200 lignes max).
- [x] Ajout du script SQL (`supabase_schema_v3.sql`) pour ajouter le support de plusieurs captures d'écran (`text[]`).
- [x] Implémentation complète de l'upload multiple (Max 5 images) dans le Dashboard Admin (`CreateApp.tsx` et `EditApp.tsx`).
- [x] Affichage dynamique de la galerie de captures d'écran dans `AppDetails.tsx`.
- [x] Masquage complet de la scrollbar horizontale native pour la galerie d'images.
- [x] Personnalisation de la scrollbar globale (fine, foncée, discrète).
- [x] Correction de l'erreur TypeScript liée aux accolades dans le ternaire.

## Ce qui reste à accomplir (Idées pour la suite)
- [ ] **Règle du Boy Scout** : Refactoriser `AppDetails.tsx` (actuellement plus de 430 lignes) en sous-composants (`<AppBanner />`, `<AppStats />`, `<ScreenshotGallery />`, `<CommentSection />`) AVANT d'y ajouter la moindre nouvelle fonctionnalité.
- [ ] Extraire les appels Supabase de `AppDetails.tsx` dans un nouveau hook `useAppInteractions.ts`.
- [ ] Mettre en place un système de "debouncing" pour la barre de recherche.
- [ ] Implémenter la fonctionnalité "Modifier" et "Supprimer" sur le tableau de bord admin.
- [ ] Ajouter un système de pagination pour le catalogue d'applications.
- [ ] Créer un Trigger SQL sur `auth.users` pour générer automatiquement la ligne dans `profiles`.
