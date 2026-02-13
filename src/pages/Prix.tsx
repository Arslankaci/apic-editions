import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/shared/PageHeader";
import { Trophy, Loader2 } from "lucide-react";

const Prix: React.FC = () => {
  const { t } = useLanguage();

  const { data: awards = [], isLoading } = useQuery({
    queryKey: ["awards-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("awards")
        .select("*, books(id, title, cover, book_authors(author_id, authors(id, first_name, last_name)))")
        .order("year", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="container py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="container py-12">
      <PageHeader title={t.awards.title} subtitle={t.awards.subtitle} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {awards.map((award) => {
          const book = award.books;
          if (!book) return null;
          return (
            <Link key={award.id} to={`/livres/${book.id}`}
              className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex gap-4 p-5">
                <div className="w-20 h-28 rounded-md overflow-hidden shrink-0 shadow-sm">
                  <img src={book.cover || "/placeholder.svg"} alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                </div>
                <div className="flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Trophy className="w-4 h-4 text-yellow-500 shrink-0" />
                      <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400 truncate">{award.name}</span>
                    </div>
                    <h3 className="font-medium text-sm leading-tight group-hover:text-primary transition-colors truncate">{book.title}</h3>
                    {book.book_authors?.[0]?.authors && (
                      <Link to={`/auteurs/${book.book_authors[0].author_id}`}
                        className="text-xs text-muted-foreground mt-0.5 hover:text-primary transition-colors block"
                        onClick={(e) => e.stopPropagation()}>
                        {[book.book_authors[0].authors.first_name, book.book_authors[0].authors.last_name].filter(Boolean).join(" ")}
                      </Link>
                    )}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground mt-2">{award.year}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Prix;
