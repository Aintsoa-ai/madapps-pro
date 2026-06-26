# Audit Technique — MadApps Pro

## État Actuel de l'Architecture
- **Stack** : React 19, Vite, Tailwind CSS, Supabase, TypeScript, React Router.
- **Base de données (Supabase)** :
  - `apps` : Table principale des applications (inclus désormais views_count, downloads_count, likes_count, dislikes_count).
  - `categories` : Classification des apps.
  - `profiles` : Informations des membres liés à `auth.users`.
  - `comments` : Avis et notes sur les applications.
  - `votes` : Suivi des J'aime / Je n'aime pas pour éviter les doublons.
  - `messages` : Formulaire de contact admin.
  - `daily_visits` : Suivi journalier des visiteurs.

## Audit de Conformité "Clean Architecture"
1. **Séparation des préoccupations (Custom Hooks)** :
   - ✅ Respecté pour `useApps.ts`, `useAuth.ts`, `useCategories.ts`.
   - ❌ **Violation critique** dans `AppDetails.tsx` : La logique d'insertion (Commentaires, Messages, Votes) est codée directement dans le composant au lieu d'utiliser des hooks dédiés.

2. **Composants Modulaires (Max 150-200 lignes)** :
   - ✅ Respecté globalement sur l'application.
   - ❌ `AppDetails.tsx` dépasse les 200 lignes. Un découpage en `<AppBanner />`, `<AppStats />`, et `<CommentSection />` est impératif pour la prochaine itération.

3. **Gestion propre des Styles** :
   - ✅ TailwindCSS est utilisé de manière propre avec des classes utilitaires.
   - ✅ Pas de styles inline volumineux.

4. **Typage strict (TypeScript)** :
   - ✅ Les types sont bien centralisés dans `src/types/database.types.ts`.
   - ✅ Les compteurs ajoutés récemment ont été correctement typés (évitant les erreurs `Property does not exist on type 'App'`).
   - ⚠️ Quelques `any` subsistent dans les blocs `catch (err: any)` ou lors du bypass temporaire des types dans les mappings complexes. À raffiner.

5. **Refactorisation continue (Boy Scout Rule)** :
   - ⚠️ Nous avons accumulé de la dette technique aujourd'hui en ajoutant massivement des fonctionnalités dans un seul fichier (`AppDetails.tsx`). La prochaine étape obligatoire avant toute nouvelle *feature* sera de refactoriser ce composant.

## Sécurité
- Row Level Security (RLS) : Actuellement désactivée sur les nouvelles tables pour le développement de la V1. **Doit être activée avant la mise en production.**
- Authentification requise pour télécharger, noter et commenter.
