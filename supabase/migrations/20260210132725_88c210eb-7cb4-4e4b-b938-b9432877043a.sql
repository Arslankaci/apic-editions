
-- =============================================
-- Migration 1: book_authors (many-to-many)
-- =============================================
CREATE TABLE public.book_authors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES public.authors(id) ON DELETE CASCADE,
  UNIQUE(book_id, author_id)
);

ALTER TABLE public.book_authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read book_authors" ON public.book_authors FOR SELECT USING (true);
CREATE POLICY "Admin insert book_authors" ON public.book_authors FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update book_authors" ON public.book_authors FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete book_authors" ON public.book_authors FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Migrate existing data from books.author_id
INSERT INTO public.book_authors (book_id, author_id)
SELECT id, author_id FROM public.books WHERE author_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- =============================================
-- Migration 2: book_points_of_sale (many-to-many)
-- =============================================
CREATE TABLE public.book_points_of_sale (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  point_of_sale_id uuid NOT NULL REFERENCES public.points_of_sale(id) ON DELETE CASCADE,
  UNIQUE(book_id, point_of_sale_id)
);

ALTER TABLE public.book_points_of_sale ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read book_points_of_sale" ON public.book_points_of_sale FOR SELECT USING (true);
CREATE POLICY "Admin insert book_points_of_sale" ON public.book_points_of_sale FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update book_points_of_sale" ON public.book_points_of_sale FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete book_points_of_sale" ON public.book_points_of_sale FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- Migration 3: collections.sub_genre_id
-- =============================================
ALTER TABLE public.collections ADD COLUMN sub_genre_id uuid REFERENCES public.sub_genres(id);

-- =============================================
-- Migration 4: Enrich news_articles
-- =============================================
ALTER TABLE public.news_articles ADD COLUMN content text;
ALTER TABLE public.news_articles ADD COLUMN type text DEFAULT 'actualite';

CREATE TABLE public.news_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  news_article_id uuid NOT NULL REFERENCES public.news_articles(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  position integer DEFAULT 0
);

ALTER TABLE public.news_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read news_images" ON public.news_images FOR SELECT USING (true);
CREATE POLICY "Admin insert news_images" ON public.news_images FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update news_images" ON public.news_images FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete news_images" ON public.news_images FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- Migration 5: UNIQUE constraint on books.title
-- =============================================
ALTER TABLE public.books ADD CONSTRAINT books_title_unique UNIQUE(title);
