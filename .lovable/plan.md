

# Chargement infini au retour sur l'onglet admin

## Diagnostic

Quand on change d'onglet et qu'on revient, Supabase rafraichit automatiquement le token JWT et declenche `onAuthStateChange` avec l'evenement `TOKEN_REFRESHED`. Le listener actuel :

1. Met `adminCheckPending = true` → `ProtectedRoute` affiche le spinner
2. Lance `checkAdminRole()` (appel RPC reseau)
3. Si l'appel est lent ou echoue silencieusement → spinner infini

Le role admin ne change pas entre deux onglets. Il est inutile de le reverifier a chaque rafraichissement de token.

## Solution

Dans `src/contexts/AuthContext.tsx`, filtrer les evenements dans `onAuthStateChange` :

- **`SIGNED_IN`** : mettre a jour user/session ET verifier le role admin
- **`SIGNED_OUT`** : reset user/session/isAdmin
- **`TOKEN_REFRESHED`** : mettre a jour session/user seulement, **ne pas re-verifier le role admin**
- **Autres evenements** (`INITIAL_SESSION`, `PASSWORD_RECOVERY`, etc.) : ignorer ou traiter minimalement

### Modification unique : `src/contexts/AuthContext.tsx`

```typescript
supabase.auth.onAuthStateChange(async (event, session) => {
  if (!initialCheckDone.current) return;

  setSession(session);
  setUser(session?.user ?? null);

  if (event === "SIGNED_IN") {
    setAdminCheckPending(true);
    const admin = await checkAdminRole(session!.user.id);
    setIsAdmin(admin);
    setAdminCheckPending(false);
  } else if (event === "SIGNED_OUT") {
    setIsAdmin(false);
  }
  // TOKEN_REFRESHED : on met a jour session/user mais pas de re-check admin
});
```

Aucun autre fichier a modifier. Le `refetchOnWindowFocus: false` est deja en place pour les queries React Query.

