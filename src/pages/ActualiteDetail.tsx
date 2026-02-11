import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, Calendar, Tag } from "lucide-react";
import CustomBadge from "@/components/shared/CustomBadge";

const typeLabels: Record<string, string> = {
  actualite: "Actualité",
  evenement: "Événement",
  historique: "Historique",
};

const ActualiteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: article, isLoading } = useQuery({
    queryKey: ["news-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: extraImages = [] } = useQuery({
    queryKey: ["news-detail-images", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_images")
        .select("image_url, position")
        .eq("news_article_id", id!)
        .order("position");
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Article introuvable.</p>
        <Link to="/actualites" className="text-primary hover:underline mt-4 inline-block">
          ← Retour aux actualités
        </Link>
      </div>
    );
  }

  const typeBadge = typeLabels[(article as any).type] || "Actualité";

  return (
    <div className="container py-12 max-w-3xl mx-auto">
      <Link
        to="/actualites"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux actualités
      </Link>

      {article.image && (
        <div className="rounded-xl overflow-hidden mb-8 aspect-video">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <CustomBadge variant="primary">{typeBadge}</CustomBadge>
        {article.date && (
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" /> {article.date}
          </span>
        )}
        {article.category && (
          <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
            <Tag className="h-3.5 w-3.5" /> {article.category}
          </span>
        )}
      </div>

      <h1 className="text-3xl md:text-4xl font-heading font-bold mb-6">{article.title}</h1>

      {article.excerpt && (
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed border-l-4 border-primary pl-4">
          {article.excerpt}
        </p>
      )}

      {(article as any).content && (
        <div className="prose prose-lg max-w-none text-foreground leading-relaxed whitespace-pre-line">
          {(article as any).content}
        </div>
      )}

      {extraImages.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-heading font-semibold mb-4">Galerie</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {extraImages.map((img, i) => (
              <div key={i} className="rounded-lg overflow-hidden aspect-video">
                <img
                  src={img.image_url}
                  alt={`${article.title} – image ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActualiteDetail;
