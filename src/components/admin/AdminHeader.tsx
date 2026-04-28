import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  BookOpen,
  FolderOpen,
  Users,
  Truck,
  UserCog,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { prefetchRoute } from "@/lib/routePrefetch";
import apicLogo from "@/assets/apic-logo.svg";

const navItems = [
  { to: "/apic-admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/apic-admin/actualites", label: "Actualités", icon: Newspaper },
  { to: "/apic-admin/livres", label: "Catalogue", icon: BookOpen },
  { to: "/apic-admin/collections", label: "Collections", icon: FolderOpen },
  { to: "/apic-admin/auteurs", label: "Auteurs", icon: Users },
  { to: "/apic-admin/distributeurs", label: "Espace Pro", icon: Truck },
  { to: "/apic-admin/equipe", label: "Nous contacter", icon: UserCog },
];

export default function AdminHeader() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Bandeau "Mode Administration" */}
      <div className="bg-secondary text-secondary-foreground">
        <div className="container flex justify-between items-center py-1.5 text-sm">
          <span className="font-heading font-semibold tracking-wide">
            APIC Éditions — Mode Administration
          </span>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="font-medium">Voir le site</span>
            </a>
            <span className="hidden md:inline text-secondary-foreground/80">{user?.email}</span>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nav principale */}
      <div className="container">
        <nav className="flex items-center justify-between h-14">
          <NavLink to="/apic-admin/dashboard" className="flex items-center">
            <img src={apicLogo} alt="APIC Éditions Admin" className="h-8 w-auto" />
          </NavLink>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end
                  onMouseEnter={() => prefetchRoute(item.to)}
                  onFocus={() => prefetchRoute(item.to)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                    isActive(item.to)
                      ? "text-primary bg-primary/5"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
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
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container py-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? "text-primary bg-primary/5"
                    : "text-foreground/70 hover:text-primary"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-secondary"
            >
              <ExternalLink className="w-4 h-4" />
              Voir le site
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
