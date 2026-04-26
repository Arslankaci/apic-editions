// Map of route paths to their dynamic import functions.
// Used by PrefetchLink to warm up route chunks on hover/focus,
// so navigation feels instant once the user clicks.

type Importer = () => Promise<unknown>;

export const routeImporters: Record<string, Importer> = {
  // Public
  "/": () => import("@/pages/Index"),
  "/actualites": () => import("@/pages/Actualites"),
  "/actualites/:id": () => import("@/pages/ActualiteDetail"),
  "/livres": () => import("@/pages/Livres"),
  "/livres/:id": () => import("@/pages/BookDetail"),
  "/collections": () => import("@/pages/Collections"),
  "/auteurs": () => import("@/pages/Auteurs"),
  "/auteurs/:id": () => import("@/pages/AuteurDetail"),
  "/ou-nous-trouver": () => import("@/pages/OuNousTrouver"),
  "/qui-sommes-nous": () => import("@/pages/QuiSommesNous"),
  "/contact": () => import("@/pages/Contact"),
  "/distributeurs": () => import("@/pages/Distributeurs"),

  // Admin
  "/apic-admin/dashboard": () => import("@/pages/admin/AdminDashboard"),
  "/apic-admin/livres": () => import("@/pages/admin/AdminBooks"),
  "/apic-admin/auteurs": () => import("@/pages/admin/AdminAuthors"),
  "/apic-admin/actualites": () => import("@/pages/admin/AdminNews"),
  "/apic-admin/collections": () => import("@/pages/admin/AdminCollections"),
  "/apic-admin/distributeurs": () => import("@/pages/admin/AdminDistributors"),
  "/apic-admin/equipe": () => import("@/pages/admin/AdminTeam"),
};

const prefetched = new Set<string>();

export function prefetchRoute(path: string) {
  // Strip query string / hash for matching
  const clean = path.split("?")[0].split("#")[0];
  if (prefetched.has(clean)) return;

  const importer = routeImporters[clean];
  if (!importer) return;

  prefetched.add(clean);
  // Fire and forget; ignore errors (will retry on real navigation)
  importer().catch(() => prefetched.delete(clean));
}
