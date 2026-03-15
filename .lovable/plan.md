

# Fix: chargement infini persistant au retour sur l'onglet admin

## Diagnostic

Le correctif precedent filtre sur `event === "SIGNED_IN"`, mais Supabase peut emettre un evenement `SIGNED_IN` lors du retour sur l'onglet (pas seulement `TOKEN_REFRESHED`), notamment quand le token a expire et est re-etabli. Cela declenche a nouveau `setAdminCheckPending(true)` et l'appel RPC, causant le spinner.

## Solution

Dans `src/contexts/AuthContext.tsx`, ne re-verifier le role admin que si on ne l'a pas deja verifie (c'est-a-dire si `isAdmin` est `false` ET que l'utilisateur vient de se connecter pour la premiere fois). Concretement, ajouter un ref `adminChecked` qui indique si le role a deja ete verifie pour la session courante.

### Modification : `src/contexts/AuthContext.tsx`

1. Ajouter `const adminChecked = useRef(false);`
2. Dans `onAuthStateChange`, pour `SIGNED_IN` : ne verifier le role que si `!adminChecked.current`
3. Apres la verification initiale et dans le listener, mettre `adminChecked.current = true`
4. Sur `SIGNED_OUT`, reset `adminChecked.current = false`

```typescript
const adminChecked = useRef(false);

// Dans onAuthStateChange:
if (event === "SIGNED_IN" && !adminChecked.current) {
  setAdminCheckPending(true);
  const admin = await checkAdminRole(session!.user.id);
  setIsAdmin(admin);
  setAdminCheckPending(false);
  adminChecked.current = true;
} else if (event === "SIGNED_OUT") {
  setIsAdmin(false);
  adminChecked.current = false;
}

// Dans getSession initial:
if (session?.user) {
  const admin = await checkAdminRole(session.user.id);
  setIsAdmin(admin);
  adminChecked.current = true;
}
```

Fichier unique a modifier : `src/contexts/AuthContext.tsx`.

