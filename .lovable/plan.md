

# Changer la 4eme de couverture : image → texte

## Modifications

### 1. `src/pages/admin/AdminBooks.tsx`
- Ligne 318 : remplacer le composant `ImageUpload` pour le champ `back_cover` par un `Textarea` pour saisir du texte (resume)
- Le label reste "4eme de couverture"

### 2. `src/pages/BookDetail.tsx`
- Lignes 54-58 : remplacer le bloc `<img>` qui affiche `back_cover` comme image par un bloc texte stylise (paragraphe avec fond leger, par exemple un encadre avec le resume)

### Fichiers modifies

| Fichier | Changement |
|---------|-----------|
| `src/pages/admin/AdminBooks.tsx` | `ImageUpload` → `Textarea` pour `back_cover` |
| `src/pages/BookDetail.tsx` | `<img>` → bloc texte pour afficher le resume |

Aucune migration necessaire : la colonne `back_cover` est deja de type `text` en base.

