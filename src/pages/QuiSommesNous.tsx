import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/shared/PageHeader";
import { Loader2 } from "lucide-react";

const QuiSommesNous: React.FC = () => {
  const { t } = useLanguage();

  const { data: teamMembers = [], isLoading } = useQuery({
    queryKey: ["team-public"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_members").select("*").order("last_name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container py-12">
      <PageHeader title={t.about.title} />

      <section className="mb-12 max-w-3xl">
        <h2 className="text-2xl font-heading font-semibold mb-3">{t.about.history}</h2>
        <p className="text-muted-foreground leading-relaxed">
          Fondée en 2005 à Alger, APIC Éditions est née de la volonté de promouvoir la lecture et la diffusion du savoir en Algérie et dans le monde francophone. Depuis sa création, la maison d'édition a publié plus de 200 ouvrages dans des domaines variés.
        </p>
      </section>

      <section className="mb-12 max-w-3xl">
        <h2 className="text-2xl font-heading font-semibold mb-3">{t.about.mission}</h2>
        <p className="text-muted-foreground leading-relaxed">
          Notre mission est de rendre accessible le savoir et la culture à travers des ouvrages de qualité, en soutenant les auteurs locaux et en favorisant les échanges culturels internationaux.
        </p>
      </section>

      <section className="mb-12 max-w-3xl">
        <h2 className="text-2xl font-heading font-semibold mb-3">{t.about.values}</h2>
        <ul className="text-muted-foreground space-y-2 list-disc list-inside">
          <li>Excellence éditoriale et rigueur intellectuelle</li>
          <li>Promotion des auteurs et talents émergents</li>
          <li>Diversité culturelle et ouverture sur le monde</li>
          <li>Accessibilité du savoir pour tous</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-heading font-semibold mb-6">{t.about.team}</h2>
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {teamMembers.map((m) => (
              <div
                key={m.id}
                className="break-inside-avoid rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {m.photo && (
                  <div className="w-full">
                    <img
                      src={m.photo}
                      alt={[m.first_name, m.last_name].filter(Boolean).join(" ")}
                      className="w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-lg">
                    {[m.first_name, m.last_name].filter(Boolean).join(" ")}
                  </h3>
                  {m.role && (
                    <p className="text-sm font-medium text-primary mt-1">{m.role}</p>
                  )}
                  {m.bio && (
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{m.bio}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default QuiSommesNous;
