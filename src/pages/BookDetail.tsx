import React from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Loader2 } from "lucide-react";

const BookDetail: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams();

  const { data: book, isLoading } = useQuery({
    queryKey: ["book-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*, book_authors(author_id, authors(id, first_name, last_name)), collections(name), awards(name, year)")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="container py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!book) {
    return (
      <div className="container py-12 text-center">
        <p className="text-muted-foreground">Livre non trouvé</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/livres">{t.books.backToCatalog}</Link>
        </Button>
      </div>
    );
  }

  const bookAuthors = (book as any).book_authors ?? [];

  return (
    <div className="container py-12">
      <Button asChild variant="ghost" className="mb-6">
        <Link to="/livres"><ArrowLeft className="w-4 h-4 mr-1" /> {t.books.backToCatalog}</Link>
      </Button>
      <div className="grid md:grid-cols-[300px_1fr] gap-10">
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden shadow-lg aspect-[3/4]">
            <img src={book.cover || "/placeholder.svg"} alt={book.title} className="w-full h-full object-cover" />
          </div>
          {(book as any).back_cover && (
            <div className="rounded-lg border border-border bg-muted/50 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">4ème de couverture</h3>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">{(book as any).back_cover}</p>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">{book.title}</h1>
          {bookAuthors.length > 0 && (
            <div className="flex flex-wrap gap-x-2 gap-y-1 mb-4">
              {bookAuthors.map((ba: any) => (
                <Link key={ba.author_id} to={`/auteurs/${ba.author_id}`} className="text-lg text-primary font-medium hover:underline">
                  {[ba.authors?.first_name, ba.authors?.last_name].filter(Boolean).join(" ")}
                </Link>
              ))}
            </div>
          )}
          <p className="text-muted-foreground leading-relaxed mb-6">{book.description}</p>
          {book.price != null && (
            <p className="text-2xl font-bold text-primary mb-4">
              {Number(book.price).toFixed(2)} {book.currency || "EUR"}
            </p>
          )}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">{t.books.isbn}:</span> <span className="font-medium">{book.isbn}</span></div>
            <div><span className="text-muted-foreground">{t.books.pages}:</span> <span className="font-medium">{book.pages}</span></div>
            <div><span className="text-muted-foreground">{t.books.publishedOn}:</span> <span className="font-medium">{book.published_date}</span></div>
            <div><span className="text-muted-foreground">Genre:</span> <span className="font-medium">{book.genre}{book.sub_genre ? ` / ${book.sub_genre}` : ""}</span></div>
          </div>
          {book.awards && book.awards.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                {t.nav.awards || "Prix"}
              </h2>
              <ul className="space-y-2">
                {book.awards.map((award: any, i: number) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{award.name}</span>
                    <span className="text-muted-foreground">({award.year})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;