import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/shared/PageHeader";
import NewsCard from "@/components/shared/NewsCard";
import { Loader2 } from "lucide-react";

const eventLabels: Record<string, string> = {
  salon: "Salons du livre",
  rencontre: "Rencontres littéraires",
  conference: "Conférences",
  dedicace: "Séances dédicaces",
};

const Actualites: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const typeFilter = searchParams.get("type");

  const { data: newsArticles = [], isLoading } = useQuery({
    queryKey: ["news-public"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news_articles").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(() => {
    if (!typeFilter) return newsArticles;
    return newsArticles.filter((a: any) => a.event_type === typeFilter);
  }, [newsArticles, typeFilter]);

  if (isLoading) {
    return <div className="container py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  const heading = typeFilter && eventLabels[typeFilter] ? eventLabels[typeFilter] : t.news.title;

  return (
    <div className="container py-12">
      <PageHeader title={heading} />
      <div className="space-y-6">
        {filtered.map((article) => (
          <NewsCard key={article.id} article={article} variant="horizontal" badgeLabel={t.news.badge} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Aucun contenu pour cette catégorie.</p>
        )}
      </div>
    </div>
  );
};

export default Actualites;
