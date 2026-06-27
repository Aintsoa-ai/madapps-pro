# Audit Technique — AintStore

## État Actuel de l'Architecture
- **Stack** : React 19, Vite, Tailwind CSS, Supabase, TypeScript, React Router.
- **Règles Strictes de Clean Architecture Imposées** :
  1. Séparation des préoccupations (Custom Hooks).
  2. Composants Modulaires (Max 150-200 lignes).
  3. Gestion propre des Styles (Tailwind / .module.css).
  4. Typage strict (TypeScript sans `any`).
  5. Refactorisation continue (Boy Scout Rule).

## Base de données (Supabase)
- `apps` : Table principale des applications (inclus views_count, downloads_count, likes_count, dislikes_count, et le tableau `screenshots`).
- `categories` : Classification des apps.
- `profiles` : Informations des membres liés à `auth.users`.
- `comments` : Avis et notes sur les applications.
- `votes` : Suivi des J'aime / Je n'aime pas pour éviter les doublons.
- `messages` : Formulaire de contact admin.
- `daily_visits` : Suivi journalier des visiteurs.

## Audit de Conformité "Clean Architecture"
1. **Séparation des préoccupations (Custom Hooks)** :
   - ✅ Respecté pour `useApps.ts`, `useAuth.ts`, `useCategories.ts`, `useCreateApp.ts`, `useEditApp.ts`.
   - ⚠️ Amélioration en cours, mais certaines logiques de mise à jour de profils et de recherche sont encore trop imbriquées dans les composants UI (`Profile.tsx`, `Home.tsx`).

2. **Composants Modulaires (Max 150-200 lignes)** :
   - ✅ Respecté globalement sur l'application (`Navbar`, `AppCard`).
   - ❌ **Violation critique** : `AppDetails.tsx` dépasse les 430 lignes.
   - ❌ **Violation critique** : `Dashboard.tsx` (Admin) dépasse les 470 lignes. Un découpage en `<AppBanner />`, `<ScreenshotGallery />`, `<CommentSection />`, `<ChartSection />`, et `<UserList />` est impératif en vertu de la Règle 5.

3. **Gestion propre des Styles** :
   - ✅ TailwindCSS est utilisé de manière propre avec des classes utilitaires (Glassmorphism, animations).
   - ✅ Pas de styles inline volumineux.

4. **Typage strict (TypeScript)** :
   - ✅ Les types sont bien centralisés dans `src/types/database.types.ts`.
   - ✅ Correction stricte aujourd'hui des erreurs d'Upsert Supabase (`updated_at`, `full_name`) causées par des écarts entre le code React et le schéma SQL.
   - ⚠️ Quelques `any` subsistent dans les blocs `catch (err: any)`.

5. **Refactorisation continue (Boy Scout Rule)** :
   - ⚠️ Nous avons accumulé de la dette technique aujourd'hui en ajoutant de nombreuses fonctionnalités (Barre de recherche, pastilles en ligne, avatars) sans découper préalablement les fichiers. La prochaine étape obligatoire avant toute nouvelle *feature* sera la refactorisation de `AppDetails.tsx` et `Dashboard.tsx`.

## Sécurité
- Authentification requise pour télécharger, noter et commenter (OAuth Google & Facebook intégrés et corrigés).
- Row Level Security (RLS) : Actuellement désactivée sur les nouvelles tables pour le développement de la V1. **Doit être activée avant la mise en production officielle.**
