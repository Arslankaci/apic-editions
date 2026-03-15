import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apicLogo from "@/assets/apic-logo.svg";

const Header: React.FC = () => {
  const { t, locale, toggleLocale } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);
  const [booksMenuOpen, setBooksMenuOpen] = useState(false);
  const location = useLocation();

  const { data: genres = [] } = useQuery({
    queryKey: ["nav-genres"],
    queryFn: async () => {
      const { data } = await supabase.from("genres").select("*, sub_genres(*)").order("name");
      return data || [];
    },
  });

  const navItems = [
    { to: "/", label: t.nav.home },
    { to: "/actualites", label: t.nav.news },
    { to: "/livres", label: t.nav.books, hasMegaMenu: true },
    { to: "/collections", label: t.nav.collections },
    { to: "/auteurs", label: t.nav.authors },
    { to: "/prix", label: t.nav.awards },
    { to: "/ou-nous-trouver", label: t.nav.findUs },
    { to: "/qui-sommes-nous", label: t.nav.about },
    { to: "/contact", label: t.nav.contact },
    { to: "/distributeurs", label: t.nav.distributors },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Top bar */}
      <div className="bg-secondary text-secondary-foreground">
        <div className="container flex justify-between items-center py-1.5 text-sm">
          <img src={apicLogo} alt="APIC Éditions" className="h-5 w-auto" />
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="font-medium">{locale === "fr" ? "EN" : "FR"}</span>
          </button>
        </div>
      </div>

      {/* Main nav */}
      <div className="container">
        <nav className="flex items-center justify-between h-14">
          <Link to="/" className="font-heading text-xl font-bold text-primary">
            APIC
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <li
                key={item.to}
                className="relative"
                onMouseEnter={() => item.hasMegaMenu && setBooksMenuOpen(true)}
                onMouseLeave={() => {
                  item.hasMegaMenu && setBooksMenuOpen(false);
                  setHoveredGenre(null);
                }}
              >
                <Link
                  to={item.to}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 ${
                    isActive(item.to)
                      ? "text-primary bg-primary/5"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {item.label}
                  {item.hasMegaMenu && <ChevronDown className="w-3 h-3" />}
                </Link>

                {/* Mega menu for books */}
                {item.hasMegaMenu && booksMenuOpen && (
                  <div className="absolute top-full left-0 bg-background border border-border rounded-lg shadow-lg p-4 min-w-[500px]">
                    <div className="grid grid-cols-2 gap-2">
                      {genres.map((genre) => (
                        <div
                          key={genre.id}
                          className="relative"
                          onMouseEnter={() => setHoveredGenre(genre.id)}
                        >
                          <Link
                            to={`/livres?genre=${encodeURIComponent(genre.name)}`}
                            className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/5 hover:text-primary transition-colors"
                          >
                            {genre.name}
                          </Link>
                          {hoveredGenre === genre.id && genre.sub_genres?.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="absolute left-full top-0 z-10 bg-background border border-border rounded-lg shadow-lg p-2 min-w-[180px] ml-1"
                            >
                              {genre.sub_genres.map((sub: { id: string; name: string }) => (
                                <Link
                                  key={sub.id}
                                  to={`/livres?genre=${encodeURIComponent(genre.name)}&sub=${encodeURIComponent(sub.name)}`}
                                  className="block px-3 py-1.5 text-sm rounded hover:bg-primary/5 hover:text-primary transition-colors"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

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
                <Link
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
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
