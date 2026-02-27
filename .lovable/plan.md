

# Correction du bug de connexion admin (double tentative)

## Diagnostic

Le probleme est une **race condition** dans le flux d'authentification :

1. `signIn()` declenche `onAuthStateChange` dans `AuthContext`
2. Le listener met a jour `user` **immediatement**, puis attend (`await`) la verification admin
3. React re-render avec `user = present` mais `isAdmin = false` (pas encore verifie)
4. Le `useEffect` dans `AdminLogin` detecte `user && !isAdmin` → affiche "Acces refuse" et deconnecte

La deuxieme tentative fonctionne car la session est deja en cache.

## Solution

Ajouter un etat `adminCheckPending` dans `AuthContext` qui empeche les composants de reagir tant que la verification admin n'est pas terminee.

### Modifications

**Fichier : `src/contexts/AuthContext.tsx`**
- Ajouter un state `adminCheckPending` (boolean)
- Dans `onAuthStateChange` : mettre `adminCheckPending = true` avant de verifier le role, puis `false` apres
- Exposer `adminCheckPending` dans le contexte

**Fichier : `src/pages/admin/AdminLogin.tsx`**
- Utiliser `adminCheckPending` du contexte
- Modifier le useEffect "not admin" pour ne reagir que quand `!adminCheckPending` :
  ```
  if (!loading && !adminCheckPending && user && !isAdmin)
  ```
- Modifier le useEffect "redirect" de la meme facon :
  ```
  if (!loading && !adminCheckPending && user && isAdmin)
  ```

**Fichier : `src/components/admin/ProtectedRoute.tsx`**
- Inclure `adminCheckPending` dans la condition de chargement

