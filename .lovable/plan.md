

# Corriger les erreurs de chargement des Livres et Auteurs

## Probleme identifie

L'erreur `"column authors.name does not exist"` (code 42703) vient du fait que certaines pages utilisent encore l'ancienne relation directe `books.author_id -> authors` au lieu de la table de jointure `book_authors`. De plus, la version publiee du site contient du code obsolete qui n'a pas ete mis a jour.

La table `authors` a les colonnes `first_name` et `last_name` (pas de colonne `name`), et la relation Livres-Auteurs passe par la table `book_authors` (Many-to-Many).

## Fichiers a corriger

### 1. `src/pages/Index.tsx` (page d'accueil - nouveautes)
- Remplacer `authors(first_name, last_name)` par `book_authors(author_id, authors(id, first_name, last_name))`
- Adapter le rendu des noms d'auteurs dans le composant

### 2. `src/pages/AuteurDetail.tsx` (detail d'un auteur)
- Remplacer la requete `books` qui utilise `.eq("author_id", id!)` par une requete passant par `book_authors`
- Approche : requeter `book_authors` pour obtenir les `book_id` de l'auteur, puis charger les livres correspondants, OU utiliser la jointure `book_authors` dans la requete books

### 3. `src/pages/Prix.tsx` (page des prix)
- Remplacer `books(id, title, cover, author_id, authors(first_name, last_name))` par une jointure via `book_authors`

### 4. `src/pages/Auteurs.tsx` (liste des auteurs)
- Remplacer `books(id)` par `book_authors(book_id)` pour compter les livres de chaque auteur

### 5. Republier le site
- Apres les corrections, il faudra **republier** le site pour que la version en ligne soit a jour

## Details techniques

Toutes les requetes seront alignees sur le pattern deja utilise dans `Livres.tsx` et `BookDetail.tsx` :
```text
books -> book_authors(author_id, authors(id, first_name, last_name))
```

Pour `AuteurDetail.tsx`, la requete deviendra :
```text
supabase
  .from("book_authors")
  .select("books(*, book_authors(author_id, authors(id, first_name, last_name)), collections(id, name), awards(name, year))")
  .eq("author_id", id)
```
Ou alternativement, garder la requete depuis `books` avec un filtre via `book_authors` :
```text
supabase
  .from("books")
  .select("*, book_authors!inner(author_id, authors(id, first_name, last_name)), awards(name, year)")
  .eq("book_authors.author_id", id)
```

Pour `Prix.tsx`, la jointure depuis `awards` vers `books` puis `book_authors` sera adaptee.

## Resultat attendu

- Plus d'erreur 42703 "column authors.name does not exist"
- Les livres et auteurs se chargent correctement sur toutes les pages
- Le comptage des livres par auteur fonctionne
- La version publiee sera a jour apres republication
