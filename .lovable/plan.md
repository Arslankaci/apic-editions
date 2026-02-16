

# Correction des problemes de securite

## Problemes detectes

1. **Validation faible dans la fonction create-admin** - Le mot de passe et l'email ne sont pas valides cote serveur (n'importe quel mot de passe faible est accepte)
2. **Dates de naissance des auteurs accessibles publiquement** - Information personnelle sensible exposee via les requetes publiques
3. **Log de routes dans la console sur la page 404** - Expose les chemins tentes dans la console du navigateur
4. **Protection contre les mots de passe compromis desactivee** - Parametre Supabase a activer manuellement

---

## Corrections prevues

### 1. Edge function `create-admin` : validation renforcee

Ajouter une validation serveur stricte pour :
- Format email valide (regex)
- Mot de passe de 12 caracteres minimum avec majuscules, minuscules et chiffres

### 2. Requetes publiques : exclure `birth_date`

Les pages publiques (Auteurs, detail auteur) ne demandent pas `birth_date` dans leurs requetes SELECT. Seule la page admin l'utilise, ce qui est correct car elle est protegee par authentification. Ce probleme peut etre marque comme non applicable si les requetes publiques n'incluent pas ce champ.

Verification : les requetes publiques selectionnent `*` ou des champs specifiques. Il faudra verifier les pages `Auteurs.tsx` et `AuteurDetail.tsx` et s'assurer qu'elles ne demandent pas `birth_date` (ou ne selectionnent pas `*`).

### 3. Page 404 : supprimer le console.error

Remplacer le `console.error` qui expose les chemins URL par un simple commentaire ou le supprimer completement.

### 4. Protection mots de passe compromis (action manuelle)

Ce parametre doit etre active manuellement dans le dashboard Supabase :
- Aller dans **Authentication > Settings > Password Security**
- Activer **"Leaked password protection"**

---

## Details techniques

### Fichiers modifies

| Fichier | Modification |
|---------|-------------|
| `supabase/functions/create-admin/index.ts` | Ajout validation email + mot de passe fort |
| `src/pages/NotFound.tsx` | Suppression du `console.error` avec le pathname |
| Pages publiques auteurs (`Auteurs.tsx`, `AuteurDetail.tsx`) | Verifier/corriger les SELECT pour exclure `birth_date` |

### Edge function : exemple de validation ajoutee

```text
- Email : regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/
- Password : min 12 caracteres, au moins 1 majuscule, 1 minuscule, 1 chiffre
- Messages d'erreur en francais
```

### Action manuelle requise

Apres l'approbation du plan, tu devras aller activer la protection contre les mots de passe compromis dans le dashboard Supabase : **Authentication > Settings > Password Security**.

