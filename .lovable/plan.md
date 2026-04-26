## 🎯 Objectif
Rendre l'admin **visuellement familier** au client en reprenant les codes du site public (header, couleurs, typographies, mise en page) — afin qu'il retrouve instantanément la rubrique sur laquelle il veut intervenir.

## 🧠 Principe directeur — UX
Le client connaît le site public. S'il voit dans l'admin **les mêmes rubriques, dans le même ordre, avec les mêmes icônes/couleurs**, il fait le lien immédiatement entre "ce que je vois en ligne" et "ce que je modifie en coulisse".

---

## 📋 Plan en 4 axes

### 1. Adopter le **Header public** dans l'admin (à la place de la sidebar verticale)

**Avant** : sidebar verticale gauche (peu intuitive pour un non-tech).
**Après** : barre de navigation horizontale **identique** à celle du site public, avec les **mêmes libellés** et **dans le même ordre**.

| Site public | Admin (nouveau) | Route |
|---|---|---|
| Accueil | 🏠 Tableau de bord | `/apic-admin/dashboard` |
| Actualités | 📰 Actualités | `/apic-admin/actualites` |
| Catalogue | 📚 Catalogue | `/apic-admin/livres` |
| Collections | 📁 Collections | `/apic-admin/collections` |
| Auteurs | ✍️ Auteurs | `/apic-admin/auteurs` |
| Où nous trouver | 🚚 Partenaires | `/apic-admin/distributeurs` |
| Nous contacter | 👥 Nous contacter | `/apic-admin/equipe` |

**Différenciation claire** : barre supérieure rouge bordeaux portant la mention **« Mode Administration »** + bouton **« Voir le site »** (ouvre le front dans un nouvel onglet) + email + déconnexion. Impossible de confondre les deux espaces.

### 2. Reprendre l'**identité visuelle** du front
- **Mêmes typographies** : Playfair Display (titres) + Source Sans 3 (corps) — déjà partagées via `index.css`, à appliquer systématiquement aux titres de pages admin.
- **Mêmes couleurs** : blanc / rouge / bordeaux (tokens existants : `primary`, `secondary`, `bordeaux`).
- **Logo APIC** identique en haut à gauche, cliquable → renvoie au dashboard admin.

### 3. Restructurer chaque page admin sur le **modèle des pages publiques**

Chaque page admin reprend la structure visuelle d'une page front :
- **`PageHeader`** (composant déjà partagé) en haut avec titre + sous-titre explicatif (ex : « Catalogue — Gérez les livres affichés sur le site »).
- **`SectionWrapper`** pour structurer le contenu.
- Le bouton **« + Ajouter »** stylisé comme les CTA du front (rouge primary).
- Les listes de livres/auteurs en admin reprennent les **mêmes `BookCard` / `NewsCard`** que le front (en mode édition avec icônes ✏️/🗑️ en overlay) → le client voit *exactement* ce que voit le visiteur.

### 4. Ajouts de confort pour client non-tech
- **Lien « 👁 Voir sur le site »** sur chaque ligne (livre, auteur, actualité) → ouvre la page publique correspondante dans un nouvel onglet. Le client vérifie immédiatement le rendu.
- **Messages d'aide contextuels** sous chaque titre de page (1 phrase, ton humain).
- **Breadcrumb** « Admin › Catalogue › Modifier *Le Petit Prince* » pour toujours savoir où on est.

---

## 🛠 Fichiers impactés

**Nouveaux composants**
- `src/components/admin/AdminHeader.tsx` — header horizontal calqué sur `Header.tsx` public, avec bandeau « Mode Administration ».

**Refonte**
- `src/components/admin/AdminLayout.tsx` — remplace `SidebarProvider` + `AdminSidebar` par `<AdminHeader />` + `<main>` pleine largeur.
- Toutes les pages `src/pages/admin/Admin*.tsx` — uniformisation : `PageHeader` + `SectionWrapper` + boutons stylés front + lien « Voir sur le site ».

**Suppression / archivage**
- `src/components/admin/AdminSidebar.tsx` — supprimé (remplacé par le header).

**Conservé tel quel**
- Toute la logique métier (mutations Supabase, formulaires, validation, upload images, RLS, auth).
- Les routes (`/apic-admin/*`) — aucun changement d'URL.
- `ProtectedRoute`, `AuthContext`, `useAuth`.

---

## ✅ Résultat attendu
Le client ouvre l'admin → il **reconnaît immédiatement** la barre de navigation du site → il clique sur « Catalogue » comme il le ferait sur le site public → il voit les livres affichés **comme sur le site**, avec un crayon pour modifier. Aucune courbe d'apprentissage technique.

## ❓ Avant de lancer
Une seule question : préfères-tu que la barre **« Mode Administration »** (bandeau rouge bordeaux différenciant) soit **fine et discrète** en haut, ou **bien visible** avec un fond coloré marqué ? Je pars sur **bien visible** par défaut pour éviter toute confusion entre admin et site public.