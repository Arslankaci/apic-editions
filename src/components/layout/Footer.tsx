import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import SocialLinks from "@/components/shared/SocialLinks";
import apicLogo from "@/assets/apic-logo.svg";

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="mt-16">
      <div className="bg-secondary text-secondary-foreground">
        <div className="container py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            <div>
              <img src={apicLogo} alt="APIC Éditions" className="h-9 w-auto mb-3" />
              <p className="text-secondary-foreground/70 text-sm leading-relaxed">
                Découvrir, Apprendre, Partager
              </p>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-3">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/livres" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">{t.nav.books}</Link></li>
                <li><Link to="/auteurs" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">{t.nav.authors}</Link></li>
                <li><Link to="/actualites" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">{t.nav.news}</Link></li>
                <li><Link to="/partenaires" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">{t.nav.distributors}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-3">{t.footer.followUs}</h4>
              <SocialLinks />
            </div>
            <div>
              <h4 className="font-heading font-semibold mb-3">Informations</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/mentions-legales" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">{t.footer.legal}</Link></li>
                <li><Link to="/mentions-legales#cgv" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">Conditions générales de vente</Link></li>
                <li><Link to="/apic-admin" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">{t.footer.proSpace}</Link></li>
                <li><Link to="/contact" className="text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">{t.nav.contact}</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-secondary-foreground/10 text-sm text-secondary-foreground/60 text-center">
            <p>© 2026 APIC Éditions. {t.footer.rights}.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
