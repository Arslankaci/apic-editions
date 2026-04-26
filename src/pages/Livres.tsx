import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import BookCard from "@/components/shared/BookCard";
import FilterSidebar from "@/components/shared/FilterSidebar";

const Livres: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") || "");
  const [selectedSubGenre, setSelectedSubGenre] = useState(searchParams.get("sub") || "");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");

  useEffect(() => {
    setSelectedGenre(searchParams.get("genre") || "");
    setSelectedSubGenre(searchParams.get("sub") || "");
  }, [searchParams]);

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books-all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*, book_authors(author_id, authors(id, first_name, last_name)), collections(id, name)")
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  const { data: genres = [] } = useQuery({
    queryKey: ["genres-with-subs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("genres").select("id, name, sub_genres(id, name)").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: collections = [] } = useQuery({
    queryKey: ["collections-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("collections").select("id, name").order("name");
      if (error) throw error;
      return data;
    },
  });

  const genreOptions = useMemo(() => genres.map((g) => ({ value: g.name, label: g.name })), [genres]);

  const subGenreOptions = useMemo(() => {
    const genre = genres.find((g) => g.name === selectedGenre);
    return genre?.sub_genres?.map((sg: any) => ({ value: sg.name, label: sg.name })) ?? [];
  }, [selectedGenre, genres]);

  const collectionOptions = useMemo(() => collections.map((c) => ({ value: c.id, label: c.name })), [collections]);

  const authorOptions = useMemo(() => {
    const names = new Set<string>();
    books.forEach((b: any) => {
      b.book_authors?.forEach((ba: any) => { const n = [ba.authors?.first_name, ba.authors?.last_name].filter(Boolean).join(" "); if (n) names.add(n); });
    });
    return [...names].sort().map((a) => ({ value: a, label: a }));
  }, [books]);

  const filtered = useMemo(() => {
    return books.filter((b: any) => {
      const authorNames = b.book_authors?.map((ba: any) => [ba.authors?.first_name, ba.authors?.last_name].filter(Boolean).join(" ")).join(" ") ?? "";
      const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || authorNames.toLowerCase().includes(search.toLowerCase());
      const matchGenre = !selectedGenre || b.genre === selectedGenre;
      const matchSubGenre = !selectedSubGenre || b.sub_genre === selectedSubGenre;
      const matchCollection = !selectedCollection || b.collection_id === selectedCollection;
      const matchAuthor = !selectedAuthor || b.book_authors?.some((ba: any) => [ba.authors?.first_name, ba.authors?.last_name].filter(Boolean).join(" ") === selectedAuthor);
      return matchSearch && matchGenre && matchSubGenre && matchCollection && matchAuthor;
    });
  }, [search, selectedGenre, selectedSubGenre, selectedCollection, selectedAuthor, books]);

  const handleReset = () => {
    setSelectedGenre(""); setSelectedSubGenre(""); setSelectedCollection(""); setSelectedAuthor("");
  };

  if (isLoading) {
    return <div className="container py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  const booksForCard = filtered.map((b: any) => ({
    ...b,
    authors: b.book_authors?.[0]?.authors ?? null,
    author_id: b.book_authors?.[0]?.author_id ?? null,
  }));

  return (
    <div className="container py-12">
      <PageHeader title={t.books.title} />
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder={t.books.search} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar
          collections={collectionOptions} genres={genreOptions} subGenres={subGenreOptions}
          authors={authorOptions}
          selectedCollection={selectedCollection} selectedGenre={selectedGenre}
          selectedSubGenre={selectedSubGenre} selectedAuthor={selectedAuthor}
          onCollectionChange={setSelectedCollection} onGenreChange={setSelectedGenre}
          onSubGenreChange={setSelectedSubGenre} onAuthorChange={setSelectedAuthor}
          onReset={handleReset} resultCount={filtered.length}
        />
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {booksForCard.map((book: any) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          {filtered.length === 0 && <p className="text-center text-muted-foreground py-12">Aucun résultat trouvé.</p>}
        </div>
      </div>
    </div>
  );
};

export default Livres;
