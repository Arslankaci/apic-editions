import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import SectionWrapper from "@/components/shared/SectionWrapper";
import BookCard from "@/components/shared/BookCard";
import NewsCard from "@/components/shared/NewsCard";

const Index: React.FC = () => {
  const { t } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: newBooks = [] } = useQuery({
    queryKey: ["home-new-books"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*, book_authors(author_id, authors(id, first_name, last_name)), price, currency")
        .eq("is_new", true)
        .order("published_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: newsArticles = [] } = useQuery({
    queryKey: ["home-news"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .order("date", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative bg-secondary text-secondary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary to-primary/20" />
        <div className="container relative py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-4 leading-tight">
              {t.home.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 text-secondary-foreground/80">
              {t.home.heroSubtitle}
            </p>
            <Button asChild size="lg" className="text-base">
              <Link to="/livres">
                {t.home.heroCta} <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Nouveautés */}
      <SectionWrapper bg="bg-cream">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-bold">{t.home.newBooks}</h2>
          <div className="flex gap-2">
            <button onClick={() => scroll("left")} className="p-2 rounded-full border border-border hover:bg-muted transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll("right")} className="p-2 rounded-full border border-border hover:bg-muted transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {newBooks.map((book) => (
            <BookCard key={book.id} book={book} className="flex-shrink-0 w-48 snap-start" />
          ))}
        </div>
      </SectionWrapper>

      {/* About preview */}
      <SectionWrapper>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">{t.home.aboutTitle}</h2>
          <p className="text-muted-foreground leading-relaxed text-lg mb-6">
            {t.home.aboutText}
          </p>
          <Button variant="outline" asChild>
            <Link to="/qui-sommes-nous">{t.home.readMore}</Link>
          </Button>
        </div>
      </SectionWrapper>

      {/* Latest news */}
      <SectionWrapper bg="bg-muted/50">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-heading font-bold">{t.home.latestNews}</h2>
          <Button variant="ghost" asChild>
            <Link to="/actualites" className="flex items-center gap-1">
              {t.home.viewAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {newsArticles.map((article) => (
            <NewsCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </SectionWrapper>
    </>
  );
};

export default Index;
