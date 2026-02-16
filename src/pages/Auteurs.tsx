import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/shared/PageHeader";
import { Input } from "@/components/ui/input";
import { BookOpen, Loader2, Search } from "lucide-react";

const Auteurs: React.FC = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  const { data: authors = [], isLoading } = useQuery({
    queryKey: ["authors-with-counts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("id, first_name, last_name, photo, specialty, book_authors(book_id)")
        .order("last_name");
      if (error) throw error;
      return data;
    },
  });

  const filteredAuthors = useMemo(() => {
    if (!search.trim()) return authors;
    const s = search.toLowerCase();
    return authors.filter((a) =>
      [a.first_name, a.last_name, a.specialty]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(s))
    );
  }, [authors, search]);

  if (isLoading) {
    return <div className="container py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="container py-12">
      <PageHeader title={t.authors.title} subtitle={t.authors.subtitle} />
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t.authors.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      {filteredAuthors.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">{t.authors.noResults}</p>
      ) : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAuthors.map((author) => (
          <Link
            key={author.id}
            to={`/auteurs/${author.id}`}
            className="group rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img src={author.photo || "/placeholder.svg"} alt={[author.first_name, author.last_name].filter(Boolean).join(" ")}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            </div>
            <div className="p-5">
              <h3 className="font-heading font-semibold text-lg group-hover:text-primary transition-colors">{[author.first_name, author.last_name].filter(Boolean).join(" ")}</h3>
              <p className="text-sm text-muted-foreground mt-1">{author.specialty}</p>
              <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{author.book_authors?.length ?? 0} {t.authors.booksPublished}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      )}
    </div>
  );
};

export default Auteurs;
