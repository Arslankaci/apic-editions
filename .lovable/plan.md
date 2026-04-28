## Carrousel Nouveautés en défilé automatique

Actuellement la section "Nouveautés" sur la page d'accueil est un simple scroll horizontal avec deux flèches. On va la transformer en **carrousel défilant automatiquement** (effet "marquee"), façon bandeau d'actualités, qui glisse en continu de droite à gauche.

### Comportement
- Les couvertures défilent **lentement et en boucle infinie**, sans fin visible (les livres se répètent en seamless loop).
- **Pause au survol** : quand l'utilisateur passe la souris sur la rangée, le défilement s'arrête pour qu'il puisse lire les titres / cliquer.
- **Réactivité** : on garde les flèches gauche/droite pour permettre une navigation manuelle, qui reprend automatiquement après quelques secondes d'inactivité.
- Cliquer sur une couverture ouvre la fiche du livre comme aujourd'hui.
- Sur mobile, le défilement reste fluide et un swipe manuel reste possible.

### Détails visuels
- Léger **fondu sur les bords gauche/droit** (mask gradient) pour donner l'impression que les livres entrent et sortent du cadre, plus élégant qu'une coupure nette.
- Vitesse douce (~30-40s pour un cycle complet) pour rester lisible et non agressive.
- Respect de `prefers-reduced-motion` : si l'utilisateur a désactivé les animations dans son OS, le défilement automatique est coupé et on retombe sur le scroll manuel actuel.

### Détails techniques
- Modification d'un seul fichier : `src/pages/Index.tsx` (section Nouveautés, lignes 76-94).
- Implémentation CSS pure avec `@keyframes` (translateX -50%) et duplication de la liste des livres pour créer la boucle seamless. Pas de nouvelle dépendance.
- Ajout des keyframes dans `src/index.css` (animation `marquee`) et utilitaire Tailwind `animate-marquee` dans `tailwind.config.ts`.
- Mask CSS via `mask-image: linear-gradient(...)` sur le conteneur pour le fondu des bords.

Une fois validé, je passe à l'implémentation.