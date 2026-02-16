import React from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Loader2 } from "lucide-react";
import BookCard from "@/components/shared/BookCard";

const AuteurDetail: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams();

  const { data: author, isLoading: loadingAuthor } = useQuery({
    queryKey: ["author-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("authors").select("id, first_name, last_name, photo, bio, specialty, created_at").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: authorBooks = [] } = useQuery({
    queryKey: ["author-books", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*, book_authors!inner(author_id, authors(id, first_name, last_name)), awards(name, year)")
        .eq("book_authors.author_id", id!)
        .order("title");
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const authorAwards = authorBooks.flatMap((b) =>
    (b.awards || []).map((a: any) => ({ ...a, bookTitle: b.title, bookId: b.id }))
  );

  if (loadingAuthor) {
    return <div className="container py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!author) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Auteur non trouvé</p>
        <Button asChild variant="outline" className="mt-4"><Link to="/auteurs">{t.authors.title}</Link></Button>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Button asChild variant="ghost" className="mb-6">
        <Link to="/auteurs"><ArrowLeft className="w-4 h-4 mr-1" /> {t.authors.title}</Link>
      </Button>
      <div className="grid md:grid-cols-[280px_1fr] gap-10 mb-12">
        <div className="rounded-xl overflow-hidden shadow-lg aspect-square">
          <img src={author.photo || "/placeholder.svg"} alt={[author.first_name, author.last_name].filter(Boolean).join(" ")} className="w-full h-full object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold mb-1">{[author.first_name, author.last_name].filter(Boolean).join(" ")}</h1>
          <p className="text-primary font-medium mb-4">{author.specialty}</p>
          <p className="text-muted-foreground leading-relaxed">{author.bio}</p>
          {authorAwards.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> {t.awards.title}
              </h2>
              <ul className="space-y-2">
                {authorAwards.map((award: any, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{award.name}</span>
                    <span className="text-muted-foreground">({award.year})</span>
                    <span className="text-muted-foreground">—</span>
                    <Link to={`/livres/${award.bookId}`} className="text-primary hover:underline">{award.bookTitle}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <h2 className="text-2xl font-heading font-bold mb-6">{t.authors.authorBooks}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {authorBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default AuteurDetail;
