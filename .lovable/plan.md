

# Remplacement du logo texte par le SVG APIC

## Approche

Copier le fichier SVG uploadé dans `src/assets/apic-logo.svg`, puis l'importer comme composant/image dans le Header et le Footer pour remplacer les textes "APIC" et "APIC Éditions".

## Modifications

### 1. Copier le fichier
- `user-uploads://apic.svg` → `src/assets/apic-logo.svg`

### 2. `src/components/layout/Header.tsx`
- Remplacer le texte "APIC" du lien logo par une balise `<img>` importée depuis `@/assets/apic-logo.svg`
- Hauteur adaptée (~32px dans la nav principale, ~20px dans la top bar)
- Le logo SVG est rouge (`#cd1719`), il ressortira bien sur fond clair

### 3. `src/components/layout/Footer.tsx`
- Remplacer le texte "APIC Éditions" par le même logo SVG avec une hauteur adaptée au footer (~36px)

