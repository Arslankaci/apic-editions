import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

const Distributeurs: React.FC = () => {
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
      <PageHeader title={t.distributors.title} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {distributors.map((d) => (
          <Card key={d.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-full h-20 mb-4 flex items-center justify-center bg-muted rounded overflow-hidden">
                <img src={d.logo || "/placeholder.svg"} alt={d.name} className="max-h-full max-w-full object-contain" loading="lazy" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{d.name}</h3>
              <p className="text-xs text-muted-foreground mb-1">
                {[d.street, d.street_complement, d.postal_code && d.city ? `${d.postal_code} ${d.city}` : d.city, d.country].filter(Boolean).join(", ")}
              </p>
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
    </div>
  );
};

export default Distributeurs;
