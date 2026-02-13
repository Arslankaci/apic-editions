
# Corriger l'ecran blanc de l'admin (/apic-admin/livres)

## Cause identifiee

Le fichier `src/components/admin/AdminLayout.tsx` contient une requete de prefetch qui utilise une colonne inexistante :

```
supabase.from("authors").select("id, name").order("name")
```

La table `authors` n'a PAS de colonne `name` -- elle a `first_name` et `last_name`. Cette requete echoue avec l'erreur `"column authors.name does not exist"` (confirmee dans les logs Supabase). Comme cette requete s'execute dans le layout admin (qui enveloppe toutes les pages admin), elle peut provoquer un crash silencieux et un ecran blanc des que l'on se connecte.

## Corrections a appliquer

### 1. Corriger le prefetch dans AdminLayout.tsx (ligne 12)

Remplacer :
```
supabase.from("authors").select("id, name").order("name")
```
Par :
```
supabase.from("authors").select("id, first_name, last_name").order("last_name")
```

### 2. Ajouter un Error Boundary global pour l'admin

Creer un composant `AdminErrorBoundary` qui capture les erreurs React et affiche un message utile au lieu d'un ecran blanc. Cela evitera que ce type de probleme se reproduise a l'avenir.

Le Error Boundary sera place autour du contenu admin dans `App.tsx` pour proteger toutes les pages d'administration.

### 3. Republier le site

Apres les corrections, une republication sera necessaire pour que le site en ligne soit a jour.

## Resultat attendu

- Plus d'ecran blanc sur `/apic-admin/livres` ni aucune autre page admin
- Les erreurs futures afficheront un message explicite au lieu d'un ecran blanc
- Le prefetch des auteurs fonctionnera correctement avec les bons noms de colonnes
