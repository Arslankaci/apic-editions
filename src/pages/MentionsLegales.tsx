import React from "react";
import PageHeader from "@/components/shared/PageHeader";

const MentionsLegales: React.FC = () => {
  return (
    <div className="container py-12 max-w-3xl">
      <PageHeader title="Mentions légales" />
      <div className="prose prose-sm max-w-none space-y-6 text-foreground/80">
        <section>
          <h2 className="text-xl font-heading font-semibold text-foreground">Éditeur du site</h2>
          <p>
            <strong>APIC Éditions</strong><br />
            9, Rue Ricour Omar, Ben Aknoun<br />
            Téléphone : +213 549 42 37 95<br />
            Email : editionsapic@gmail.com
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-semibold text-foreground">Hébergement</h2>
          <p>Le site est hébergé sur les serveurs de Vercel Inc.</p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-semibold text-foreground">Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus présents sur ce site (textes, images, logos, illustrations) est protégé
            par le droit d'auteur. Toute reproduction, même partielle, est interdite sans l'autorisation
            préalable d'APIC Éditions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-heading font-semibold text-foreground">Données personnelles</h2>
          <p>
            Les informations recueillies via le formulaire de contact sont utilisées uniquement pour
            répondre à vos demandes. Conformément à la loi, vous disposez d'un droit d'accès, de
            rectification et de suppression des données vous concernant.
          </p>
        </section>
      </div>
    </div>
  );
};

export default MentionsLegales;
