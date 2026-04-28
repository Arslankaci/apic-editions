# Plan — Aligner le site sur la maquette client

## Objectif

Restructurer la navigation publique pour correspondre **exactement** à la maquette : 7 rubriques, mega-menu Catalogue à 3 niveaux (Famille → Genre → Collection), sous-menu Actualités filtrant par type d'événement.

---

## 1. Nouveau menu principal (7 rubriques)

| Ordre | Libellé | Route | Remplace |
|---|---|---|---|
| 1 | Accueil | `/` | — |
| 2 | Catalogue | `/livres` | « Nos livres » + mega-menu refait |
| 3 | Nos auteurs | `/auteurs` | « Auteurs » |
| 4 | Actualités | `/actualites` | + sous-menu (4 types) |
| 5 | La maison | `/qui-sommes-nous` | « Qui sommes-nous » |
| 6 | Contacts | `/contact` | « Contact » |
| 7 | Nos partenaires | `/partenaires` | **Fusion** Distributeurs + Où nous trouver |

**Disparaissent du menu :** « Collections » (intégré au mega-menu Catalogue), « Distributeurs » et « Où nous trouver » (fusionnés en « Nos partenaires »).

---

## 2. Refonte BDD — Taxonomie du catalogue

La taxonomie actuelle (Histoire, Sciences, Jeunesse, Art & Culture…) ne correspond pas à celle du client. Il faut la remplacer par la structure éditoriale : **Familles → Genres → Collections**.

### Nouvelle structure cible

```text
Littératures (famille)
├─ Romans          → Hors Collections, Résonances, Terres solidaires
├─ Nouvelles       → Hors Collections
├─ Poésies         → Hors Collections, Poèmes du monde
├─ Théâtres        → Messrah
└─ Récits          → Hors Collections

Essais (famille)
└─ —               → Hors Collections, Dissonances
```

### Migrations BDD

1. **Créer table `families`** : `id`, `name`, `position` — RLS public read / admin write.
2. **Ajouter `family_id`** à `genres` (FK vers `families`, nullable au départ).
3. **Ajouter `position`** à `genres`, `sub_genres`, `collections` pour contrôler l'ordre dans le menu.
4. **Ajouter `type` à `news_articles`** (enum souple texte) avec valeurs : `salon`, `rencontre`, `conference`, `dedicace`, `autre`. Default `autre`.
5. **Migration de données** : seed des nouvelles familles + genres + collections selon la maquette. Les anciens genres (Histoire, Sciences…) seront **conservés mais marqués masqués** (champ `is_hidden`) pour ne pas casser les livres existants — le client pourra réassigner les livres depuis l'admin.

> Note : aucune donnée existante n'est supprimée. Les livres déjà classés en « Histoire » restent visibles dans l'admin et peuvent être reclassés.

---

## 3. Mega-menu « Catalogue » (3 niveaux)

Au survol de **Catalogue** dans le header :

```text
┌─ Famille (col 1) ─┬─ Genre (col 2) ─┬─ Collection (col 3) ─┐
│ Littératures      │ Romans          │ Hors Collections     │
│ Essais            │ Nouvelles       │ Résonances           │
│                   │ Poésies         │ Terres solidaires    │
│                   │ Théâtres        │                      │
│                   │ Récits          │                      │
└───────────────────┴─────────────────┴──────────────────────┘
```

- Chaque niveau filtre la page `/livres` via URL params (`?family=…&genre=…&collection=…`).
- Le mega-menu actuel (genres + sub_genres) est remplacé par cette version 3 colonnes.
- Lien « Voir tout le catalogue » en bas du panneau.

---

## 4. Sous-menu « Actualités »

Au survol de **Actualités** :

- Salons du livre → `/actualites?type=salon`
- Rencontres littéraires → `/actualites?type=rencontre`
- Conférences → `/actualites?type=conference`
- Séances dédicaces → `/actualites?type=dedicace`

La page `/actualites` lit le param `type` et filtre les articles. L'admin Actualités gagne un select « Type d'événement ».

---

## 5. Page « Nos partenaires » (fusion)

Nouvelle page `/partenaires` qui regroupe :
- **Section haute** : logos + descriptions des distributeurs (contenu actuel de `/distributeurs`).
- **Section basse** : carte / liste « Où nous trouver » avec adresses (contenu de `/ou-nous-trouver`).

Les anciennes routes `/distributeurs` et `/ou-nous-trouver` redirigent vers `/partenaires` (ancres `#distributeurs` et `#points-de-vente`) pour ne pas casser les liens existants.

---

## 6. Adaptation de l'admin

Le header admin (créé précédemment) est mis à jour pour refléter la nouvelle structure :

| Rubrique admin | Gère |
|---|---|
| Tableau de bord | inchangé |
| Actualités | + champ Type d'événement |
| Catalogue | + sélecteur Famille → Genre → Collection à 3 niveaux dans le formulaire livre |
| **Taxonomie** *(nouveau)* | CRUD Familles + Genres + Collections (page unique avec onglets) |
| Auteurs | inchangé |
| Partenaires | unifie l'ancien « Distributeurs » (déjà le cas) |
| Nous contacter | inchangé |

L'écran « Collections » seul disparaît, intégré dans « Taxonomie ».

---

## 7. Footer

Aligné sur la maquette : **Mentions légales** · **Espace Pro** · **Contact** sur fond coloré.
- « Mentions légales » → nouvelle page statique simple `/mentions-legales`.
- « Espace Pro » → lien vers `/apic-admin/login` (accès admin).
- « Contact » → `/contact`.

---

## Fichiers impactés (résumé technique)

**Créations**
- `supabase/migrations/…_taxonomy_overhaul.sql` (table families, colonnes family_id/position/is_hidden, type sur news_articles, seed)
- `src/pages/Partenaires.tsx` (page fusionnée)
- `src/pages/MentionsLegales.tsx`
- `src/pages/admin/AdminTaxonomy.tsx` (CRUD familles/genres/collections unifié)
- `src/components/layout/MegaMenuCatalogue.tsx` (nouveau composant 3 colonnes)
- `src/components/layout/SubMenuActualites.tsx`

**Modifications**
- `src/components/layout/Header.tsx` — nouveau navItems (7 entrées), nouveau mega-menu, sous-menu Actualités
- `src/components/layout/Footer.tsx` — refonte 3 liens
- `src/components/admin/AdminHeader.tsx` — Catalogue/Taxonomie séparés, Collections retiré
- `src/pages/Livres.tsx` — lecture du param `family`, filtres 3 niveaux
- `src/pages/Actualites.tsx` — lecture du param `type`, filtre
- `src/pages/admin/AdminNews.tsx` — sélecteur Type d'événement
- `src/pages/admin/AdminBooks.tsx` — sélecteur Famille → Genre → Collection cascadé
- `src/App.tsx` — nouvelles routes (`/partenaires`, `/mentions-legales`, `/apic-admin/taxonomie`) + redirections
- `src/lib/routePrefetch.ts` — prefetch des nouvelles routes
- `src/i18n/translations.ts` — libellés FR/EN (La maison, Nos partenaires, types d'événements…)

**Suppressions**
- `src/pages/admin/AdminCollections.tsx` (fusionné dans AdminTaxonomy)

---

## Points de vigilance

- **Données livres existantes** : aucun livre n'est perdu. Ceux classés sous les anciens genres (Histoire, Sciences…) restent visibles dans l'admin avec un badge « À reclasser » pour inviter le client à les rattacher à la nouvelle taxonomie.
- **Liens externes** : les redirections `/distributeurs` et `/ou-nous-trouver` → `/partenaires` préservent le SEO et les liens partagés.
- **i18n** : tous les nouveaux libellés ajoutés en FR + EN.

---

Une fois le plan approuvé, je lance la migration BDD puis j'enchaîne avec les modifications front et admin.