import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

const Collections: React.FC = () => {
  const { t } = useLanguage();

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["collections-public"],
    queryFn: async () => {
      const { data, error } = await supabase.from("collections").select("*, books(id)").order("name");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="container py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="container py-12">
      <PageHeader title={t.collections.title} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <Card key={col.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            <div
              className={`h-3 ${col.color && !col.color.startsWith('#') ? col.color : 'bg-primary'}`}
              style={col.color?.startsWith('#') ? { backgroundColor: col.color } : undefined}
            />
            <CardContent className="p-6">
              <h2 className="text-xl font-heading font-semibold mb-2">{col.name}</h2>
              <p className="text-sm text-muted-foreground mb-1">{col.genre}</p>
              <p className="text-muted-foreground text-sm mb-4">{col.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{col.books?.length ?? 0} {t.collections.booksCount}</span>
                <Button size="sm" variant="outline" asChild>
                  <Link to={`/livres?genre=${encodeURIComponent(col.genre || "")}`}>{t.collections.discover}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Collections;
