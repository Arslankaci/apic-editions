import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Truck, MapPin, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

const Partenaires: React.FC = () => {
  const { t } = useLanguage();

  const { data: distributors = [], isLoading } = useQuery({
    queryKey: ["distributors-public"],
    queryFn: async () => {
      const { data, error } = await supabase.from("distributors").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="container py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="container py-12 space-y-16">
      <PageHeader title={t.distributors.title} />

      {/* Section Distributeurs (logos) */}
      <section id="distributeurs" className="scroll-mt-24">
        <h2 className="text-2xl font-heading font-semibold mb-6 flex items-center gap-2">
          <Truck className="w-6 h-6 text-primary" /> Nos distributeurs
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {distributors.map((d) => (
            <Card key={d.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-full h-20 mb-4 flex items-center justify-center bg-muted rounded overflow-hidden">
                  <img src={d.logo || "/placeholder.svg"} alt={d.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{d.name}</h3>
                {d.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{d.description}</p>}
                {d.website && (
                  <a href={d.website} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    {t.distributors.visitSite} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Section Points de vente */}
      <section id="points-de-vente" className="scroll-mt-24">
        <h2 className="text-2xl font-heading font-semibold mb-6 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" /> Où nous trouver
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {distributors.map((d) => (
            <div key={d.id} className="flex gap-4 p-4 border rounded-lg">
              {d.logo && (
                <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center bg-muted rounded overflow-hidden">
                  <img src={d.logo} alt={d.name} className="max-h-full max-w-full object-contain" loading="lazy" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />{d.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {[d.street, d.street_complement, d.postal_code && d.city ? `${d.postal_code} ${d.city}` : d.city, d.country].filter(Boolean).join(" — ")}
                </p>
                {d.website && (
                  <a href={d.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">
                    {d.website}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Partenaires;
