# Suppression complète de la rubrique "Prix"

## Portée
Tout supprimer : page publique, entrée menu, page admin, sidebar admin, badges trophée sur cartes livres, mentions sur fiches livre/auteur, filtre catalogue, table BDD `awards`, traductions et clés de routing.

## Modifications fichier par fichier

### Fichiers supprimés
- `src/pages/Prix.tsx`
- `src/pages/admin/AdminAwards.tsx`

### Front public
- **`src/components/layout/Header.tsx`** — retirer l'entrée `{ to: "/prix", label: t.nav.awards }` du menu.
- **`src/pages/Index.tsx`** — retirer `awards(name)` de la requête books home.
- **`src/pages/BookDetail.tsx`** — retirer `awards(name, year)` de la requête, supprimer le bloc d'affichage des prix (lignes ~84-95) et l'icône `Trophy` de l'import.
- **`src/pages/AuteurDetail.tsx`** — retirer `awards(name, year)` de la requête, supprimer `authorAwards` et son bloc d'affichage, retirer l'import `Trophy`.
- **`src/pages/Livres.tsx`** — retirer `awards(name)` de la requête, le state `selectedAward`, la query `awards-names`, `awardFilterOptions`, le filtre `matchAward`, la prop `selectedAward`/`onAwardChange`, et le reset associé.
- **`src/components/shared/FilterSidebar.tsx`** — retirer les props `selectedAward`, `onAwardChange`, `awardOptions` et le `<FilterSelect>` correspondant.
- **`src/components/shared/BookCard.tsx`** — retirer `awards` de l'interface, le bloc badge trophée (lignes ~39-43) et l'import `Trophy`.

### Admin
- **`src/components/admin/AdminSidebar.tsx`** — retirer l'entrée `{ title: "Prix", url: "/apic-admin/prix", icon: Award }` et l'import `Award`.
- **`src/pages/admin/AdminDashboard.tsx`** — retirer `{ key: "awards", label: "Prix", icon: Award }` du tableau de stats et l'import `Award`.

### Routing & lazy
- **`src/App.tsx`** — retirer `const Prix = ...`, `const AdminAwards = ...`, et les deux routes `/prix` et `prix` (admin).
- **`src/lib/routePrefetch.ts`** — retirer `"/prix"` et `"/apic-admin/prix"`.

### i18n
- **`src/i18n/translations.ts`** — retirer les clés `nav.awards`, `awards.title/subtitle`, `books.filterAward`, `books.allAwards` (FR + EN).

### Base de données
Migration SQL à exécuter :
```sql
DROP TABLE IF EXISTS public.awards;
```
Cela supprime la table, ses RLS policies et toutes les données awards.

## Vérifications post-suppression
- `rg -i "award|prix|trophy" src/` doit ne plus rien retourner (hors prix monétaire dans `AdminBooks.tsx` ligne 334 qui parle du **prix de vente** — à conserver).
- `src/integrations/supabase/types.ts` se régénérera automatiquement après la migration.
- L'utilisateur étant actuellement sur `/apic-admin/prix`, sera automatiquement redirigé vers la 404 (puis devra naviguer ailleurs).

## Risques & garanties
- **Aucun impact** sur livres, auteurs, collections, distributeurs, équipe, news.
- **Aucune dépendance** externe à `awards` hors des fichiers listés (vérifié par grep).
- Les fichiers mémoire (`mem://features/awards`) seront mis à jour pour refléter la suppression.
