

# Fix: navigation qui semble "recharger" tout le site

## Diagnostic

Le site n'est PAS rechargé (le routing client React Router fonctionne via `<Link>`). Mais visuellement il *semble* se recharger à cause de **deux problèmes** :

### Problème 1 — Suspense fallback global qui démonte le Layout

Dans `src/App.tsx`, le `<Suspense>` enveloppe **toutes les routes**, et son fallback est un spinner plein écran (`min-h-screen`). Conséquence : à chaque clic vers une page lazy-loaded, le Header + Footer + contenu disparaissent ensemble pendant le téléchargement du chunk JS, et reviennent ensuite. L'utilisateur voit un flash blanc avec roue de chargement → impression de "rechargement complet".

Côté admin, c'est pire : cliquer sur "Livres" depuis "Dashboard" démonte le `AdminLayout` (sidebar comprise) parce que le `<Suspense>` est au-dessus de toutes les routes admin.

### Problème 2 — Pas de prefetch des chunks

Les pages sont chargées paresseusement, donc le premier clic vers une page jamais visitée doit télécharger son JS. C'est rapide en prod mais ajoute une latence visible.

## Correctifs

### 1. Déplacer Suspense pour préserver les layouts persistants

Dans `src/App.tsx`, remplacer le `<Suspense>` global unique par :
- Un `<Suspense>` **à l'intérieur** de chaque `<Layout>` (côté front), avec un fallback léger limité à la zone `<main>` (pas plein écran), pour que Header/Footer restent affichés.
- Un `<Suspense>` **à l'intérieur** de `AdminLayout` (autour de l'`<Outlet />`) pour que la sidebar admin et le header admin restent affichés pendant la navigation entre pages admin.

Concrètement :
- Modifier `src/components/layout/Layout.tsx` pour wrapper `{children}` dans un `<Suspense>` avec fallback compact (spinner centré dans le `<main>`).
- Modifier `src/components/admin/AdminLayout.tsx` pour wrapper `<Outlet />` dans un `<Suspense>` similaire.
- Retirer le `<Suspense>` global de `App.tsx` (ou le garder vide en sécurité).

Résultat : en naviguant, seule la zone de contenu se recharge brièvement. Header, navigation, sidebar restent visibles → sensation d'app fluide, plus de "flash".

### 2. Prefetch des chunks au survol des liens

Créer un composant `PrefetchLink` qui wrap `react-router-dom` `Link` et déclenche le `import()` de la page cible au `onMouseEnter` / `onFocus`. Quand l'utilisateur clique, le chunk est déjà téléchargé → navigation quasi-instantanée.

Mapper chaque route à son `import()` dans un objet partagé (`src/lib/routePrefetch.ts`) et l'utiliser dans :
- `Header.tsx` (nav desktop + mobile)
- `AdminSidebar.tsx`
- Liens internes des cartes (`BookCard`, `NewsCard`, etc.) — optionnel, deuxième passe.

### 3. Ajustement mineur du fallback

Le spinner actuel utilise `min-h-screen` partout. Le réduire à `min-h-[40vh]` pour la zone contenu uniquement, pour éviter le saut de mise en page.

## Fichiers modifiés

- `src/App.tsx` — retirer le `<Suspense>` global
- `src/components/layout/Layout.tsx` — ajouter `<Suspense>` interne
- `src/components/admin/AdminLayout.tsx` — ajouter `<Suspense>` autour de `<Outlet />`
- `src/lib/routePrefetch.ts` — nouveau, table des `import()` par route
- `src/components/PrefetchLink.tsx` — nouveau, Link avec prefetch au hover
- `src/components/layout/Header.tsx` — utiliser `PrefetchLink`
- `src/components/admin/AdminSidebar.tsx` — utiliser `PrefetchLink`

## Impact attendu

- Navigation visuellement instantanée entre pages admin (sidebar ne disparaît plus).
- Plus de flash plein écran sur le site public — Header/Footer persistants.
- Premier clic vers une page non visitée : ~0 ms de latence réseau (chunk déjà préchargé au survol).
- Aucun impact négatif sur la performance initiale (le code-splitting reste actif).

