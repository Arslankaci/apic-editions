
# Ajouter une barre de recherche sur la page Auteurs

## Contexte
La page Livres (`/livres`) dispose deja d'une barre de recherche qui filtre par titre et auteur. La page Auteurs (`/auteurs`) n'en a pas. Il faut ajouter une recherche similaire qui filtre sur tous les attributs visibles d'un auteur.

## Modifications

### 1. Page Auteurs (`src/pages/Auteurs.tsx`)
- Ajouter un state `search` et un champ `Input` avec icone de recherche (meme pattern que Livres)
- Filtrer les auteurs affichees selon la saisie, en cherchant dans :
  - Prenom (`first_name`)
  - Nom (`last_name`)
  - Specialite (`specialty`)
- Utiliser `useMemo` pour le filtrage
- Afficher un message "Aucun resultat" si la liste filtree est vide

### 2. Traductions (`src/i18n/translations.ts`)
- Ajouter une cle `search` dans la section `authors` pour les deux langues :
  - FR : `"Rechercher un auteur..."`
  - EN : `"Search for an author..."`

## Details techniques

**Fichiers modifies :**
- `src/pages/Auteurs.tsx` -- ajout state, input, filtrage useMemo
- `src/i18n/translations.ts` -- ajout cle `authors.search`

**Pattern reutilise** : identique a la barre de recherche de `Livres.tsx` (icone Search positionnee en absolue, Input avec `pl-9`, `max-w-md mb-8`).
