import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/shared/PageHeader";
import NewsCard from "@/components/shared/NewsCard";
import { Loader2 } from "lucide-react";

const Actualites: React.FC = () => {
  const { t } = useLanguage();

  const { data: newsArticles = [], isLoading } = useQuery({
    queryKey: ["news-public"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news_articles").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="container py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="container py-12">
      <PageHeader title={t.news.title} />
      <div className="space-y-6">
        {newsArticles.map((article) => (
          <NewsCard key={article.id} article={article} variant="horizontal" badgeLabel={t.news.badge} />
        ))}
      </div>
    </div>
  );
};

export default Actualites;
