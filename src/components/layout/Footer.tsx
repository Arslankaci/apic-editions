import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import SocialLinks from "@/components/shared/SocialLinks";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-2xl font-bold mb-3">APIC Éditions</h3>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed">
              Découvrir, Apprendre, Partager
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/livres" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">{t.nav.books}</Link></li>
              <li><Link to="/collections" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">{t.nav.collections}</Link></li>
              <li><Link to="/actualites" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">{t.nav.news}</Link></li>
              <li><Link to="/contact" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">{t.nav.contact}</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading font-semibold mb-3">{t.footer.followUs}</h4>
            <SocialLinks />
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-secondary-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-secondary-foreground/60">
          <p>© 2026 APIC Éditions. {t.footer.rights}.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-secondary-foreground transition-colors">{t.footer.legal}</a>
            <a href="#" className="hover:text-secondary-foreground transition-colors">{t.footer.privacy}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
