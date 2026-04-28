import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PrefetchLink from "@/components/PrefetchLink";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apicLogo from "@/assets/apic-logo.svg";

type Family = { id: string; name: string; position: number };
type Genre = { id: string; name: string; family_id: string | null; position: number; is_hidden: boolean };
type Collection = { id: string; name: string; genre: string | null; position: number };

const Header: React.FC = () => {
  const { t, locale, toggleLocale } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<"catalogue" | "news" | null>(null);
  const [hoveredFamily, setHoveredFamily] = useState<string | null>(null);
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);
  const location = useLocation();

  const { data: families = [] } = useQuery<Family[]>({
    queryKey: ["nav-families"],
    queryFn: async () => {
      const { data } = await supabase.from("families").select("*").order("position");
      return (data as Family[]) || [];
    },
  });

  const { data: genres = [] } = useQuery<Genre[]>({
    queryKey: ["nav-genres-fam"],
    queryFn: async () => {
      const { data } = await supabase
        .from("genres")
        .select("id, name, family_id, position, is_hidden")
        .order("position");
      return ((data as Genre[]) || []).filter((g) => !g.is_hidden);
    },
  });

  const { data: collections = [] } = useQuery<Collection[]>({
    queryKey: ["nav-collections"],
    queryFn: async () => {
      const { data } = await supabase
        .from("collections")
        .select("id, name, genre, position")
        .order("position");
      return (data as Collection[]) || [];
    },
  });

  // Default selected family/genre when opening the mega-menu
  React.useEffect(() => {
    if (openMenu === "catalogue" && !hoveredFamily && families.length > 0) {
      setHoveredFamily(families[0].id);
    }
  }, [openMenu, families, hoveredFamily]);

  React.useEffect(() => {
    if (hoveredFamily) {
      const firstGenre = genres.find((g) => g.family_id === hoveredFamily);
      setHoveredGenre(firstGenre?.id ?? null);
    }
  }, [hoveredFamily, genres]);

  const eventTypes = [
    { value: "salon", label: t.nav.eventSalon },
    { value: "rencontre", label: t.nav.eventRencontre },
    { value: "conference", label: t.nav.eventConference },
    { value: "dedicace", label: t.nav.eventDedicace },
  ];

  const navItems = [
    { to: "/", label: t.nav.home },
    { to: "/livres", label: t.nav.books, mega: "catalogue" as const },
    { to: "/auteurs", label: t.nav.authors },
    { to: "/actualites", label: t.nav.news, mega: "news" as const },
    { to: "/qui-sommes-nous", label: t.nav.about },
    { to: "/contact", label: t.nav.contact },
    { to: "/partenaires", label: t.nav.distributors },
  ];

  const isActive = (path: string) => location.pathname === path;

  const currentFamilyGenres = genres.filter((g) => g.family_id === hoveredFamily);
  const currentGenre = genres.find((g) => g.id === hoveredGenre);
  const currentCollections = currentGenre
    ? collections.filter((c) => c.genre === currentGenre.name)
    : [];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Main nav */}
      <div className="container">
        <nav className="flex items-center justify-between h-14">
          <PrefetchLink to="/" className="flex items-center">
            <img src={apicLogo} alt="APIC Éditions" className="h-8 w-auto" />
          </PrefetchLink>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <li
                key={item.to}
                className="relative"
                onMouseEnter={() => item.mega && setOpenMenu(item.mega)}
                onMouseLeave={() => {
                  if (item.mega) {
                    setOpenMenu(null);
                    setHoveredFamily(null);
                    setHoveredGenre(null);
                  }
                }}
              >
                <PrefetchLink
                  to={item.to}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                    isActive(item.to)
                      ? "text-primary bg-primary/5"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {item.label}
                  {item.mega && <ChevronDown className="w-3 h-3" />}
                </PrefetchLink>

                {/* Mega-menu Catalogue (3 columns: Famille → Genre → Collection) */}
                {item.mega === "catalogue" && openMenu === "catalogue" && (
                  <div className="absolute top-full left-0 bg-background border border-border rounded-lg shadow-xl p-0 min-w-[680px] overflow-hidden">
                    <div className="grid grid-cols-3">
                      {/* Col 1: Familles */}
                      <div className="bg-muted/40 border-r border-border py-2">
                        {families.map((fam) => (
                          <button
                            key={fam.id}
                            type="button"
                            onMouseEnter={() => setHoveredFamily(fam.id)}
                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                              hoveredFamily === fam.id
                                ? "bg-primary/10 text-primary"
                                : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
                            }`}
                          >
                            {fam.name}
                          </button>
                        ))}
                      </div>

                      {/* Col 2: Genres */}
                      <div className="border-r border-border py-2">
                        {currentFamilyGenres.map((g) => (
                          <Link
                            key={g.id}
                            to={`/livres?genre=${encodeURIComponent(g.name)}`}
                            onMouseEnter={() => setHoveredGenre(g.id)}
                            onClick={() => setOpenMenu(null)}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              hoveredGenre === g.id
                                ? "bg-primary/5 text-primary font-medium"
                                : "text-foreground/80 hover:bg-primary/5 hover:text-primary"
                            }`}
                          >
                            {g.name}
                          </Link>
                        ))}
                        {currentFamilyGenres.length === 0 && (
                          <p className="px-4 py-2 text-sm text-muted-foreground italic">—</p>
                        )}
                      </div>

                      {/* Col 3: Collections */}
                      <div className="py-2">
                        {currentCollections.map((c) => (
                          <Link
                            key={c.id}
                            to={`/livres?genre=${encodeURIComponent(currentGenre!.name)}&collection=${encodeURIComponent(c.name)}`}
                            onClick={() => setOpenMenu(null)}
                            className="block px-4 py-2 text-sm text-foreground/80 hover:bg-primary/5 hover:text-primary transition-colors"
                          >
                            {c.name}
                          </Link>
                        ))}
                        {currentCollections.length === 0 && currentGenre && (
                          <p className="px-4 py-2 text-sm text-muted-foreground italic">—</p>
                        )}
                      </div>
                    </div>
                    <Link
                      to="/livres"
                      onClick={() => setOpenMenu(null)}
                      className="block px-4 py-2.5 text-xs font-medium text-center bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity"
                    >
                      {t.nav.viewAllCatalog} →
                    </Link>
                  </div>
                )}

                {/* Sub-menu Actualités */}
                {item.mega === "news" && openMenu === "news" && (
                  <div className="absolute top-full left-0 bg-background border border-border rounded-lg shadow-xl p-2 min-w-[240px]">
                    {eventTypes.map((ev) => (
                      <Link
                        key={ev.value}
                        to={`/actualites?type=${ev.value}`}
                        onClick={() => setOpenMenu(null)}
                        className="block px-3 py-2 text-sm rounded text-foreground/80 hover:bg-primary/5 hover:text-primary transition-colors"
                      >
                        {ev.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Language switch (desktop) */}
          <button
            onClick={toggleLocale}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            aria-label="Toggle language"
          >
            <Globe className="w-4 h-4" />
            <span>{locale === "fr" ? "EN" : "FR"}</span>
          </button>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="container py-4 space-y-1">
              {navItems.map((item) => (
                <PrefetchLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.to)
                      ? "text-primary bg-primary/5"
                      : "text-foreground/70 hover:text-primary"
                  }`}
                >
                  {item.label}
                </PrefetchLink>
              ))}
              <div className="pt-2 mt-2 border-t border-border">
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  {t.nav.news}
                </p>
                {eventTypes.map((ev) => (
                  <Link
                    key={ev.value}
                    to={`/actualites?type=${ev.value}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm text-foreground/70 hover:text-primary"
                  >
                    {ev.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
