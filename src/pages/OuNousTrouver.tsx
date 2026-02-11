import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Truck, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";


const OuNousTrouver: React.FC = () => {
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
    <div className="container py-12">
      <PageHeader title={t.findUs.title} />
      <section>
        <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-primary" /> Distributeurs
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
                <h3 className="font-semibold text-sm flex items-center gap-2"><Truck className="w-4 h-4 text-primary" />{d.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {[d.street, d.street_complement, d.postal_code && d.city ? `${d.postal_code} ${d.city}` : d.city, d.country].filter(Boolean).join(" — ")}
                </p>
                {d.website && (
                  <a href={d.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 inline-block">{d.website}</a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OuNousTrouver;
