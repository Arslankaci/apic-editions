
-- Enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- ========================
-- TABLES
-- ========================

CREATE TABLE public.authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  photo TEXT,
  bio TEXT,
  specialty TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  genre TEXT,
  description TEXT,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE public.sub_genres (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  genre_id UUID REFERENCES public.genres(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author_id UUID REFERENCES public.authors(id) ON DELETE SET NULL,
  cover TEXT,
  description TEXT,
  isbn TEXT,
  pages INTEGER,
  published_date DATE,
  genre TEXT,
  sub_genre TEXT,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  is_new BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  image TEXT,
  date DATE,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  year INTEGER,
  book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
  category TEXT
);

CREATE TABLE public.distributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo TEXT,
  website TEXT,
  region TEXT
);

CREATE TABLE public.points_of_sale (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  type TEXT DEFAULT 'bookstore'
);

CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  photo TEXT
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- ========================
-- SECURITY DEFINER FUNCTION
-- ========================

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ========================
-- ENABLE RLS ON ALL TABLES
-- ========================

ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.points_of_sale ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ========================
-- RLS POLICIES: Public read, admin write
-- ========================

-- Helper macro: for each content table, public SELECT + admin INSERT/UPDATE/DELETE

-- AUTHORS
CREATE POLICY "Public read authors" ON public.authors FOR SELECT USING (true);
CREATE POLICY "Admin insert authors" ON public.authors FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update authors" ON public.authors FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete authors" ON public.authors FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- COLLECTIONS
CREATE POLICY "Public read collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Admin insert collections" ON public.collections FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update collections" ON public.collections FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete collections" ON public.collections FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- GENRES
CREATE POLICY "Public read genres" ON public.genres FOR SELECT USING (true);
CREATE POLICY "Admin insert genres" ON public.genres FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update genres" ON public.genres FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete genres" ON public.genres FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- SUB_GENRES
CREATE POLICY "Public read sub_genres" ON public.sub_genres FOR SELECT USING (true);
CREATE POLICY "Admin insert sub_genres" ON public.sub_genres FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update sub_genres" ON public.sub_genres FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete sub_genres" ON public.sub_genres FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- BOOKS
CREATE POLICY "Public read books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Admin insert books" ON public.books FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update books" ON public.books FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete books" ON public.books FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- NEWS_ARTICLES
CREATE POLICY "Public read news_articles" ON public.news_articles FOR SELECT USING (true);
CREATE POLICY "Admin insert news_articles" ON public.news_articles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update news_articles" ON public.news_articles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete news_articles" ON public.news_articles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- AWARDS
CREATE POLICY "Public read awards" ON public.awards FOR SELECT USING (true);
CREATE POLICY "Admin insert awards" ON public.awards FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update awards" ON public.awards FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete awards" ON public.awards FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- DISTRIBUTORS
CREATE POLICY "Public read distributors" ON public.distributors FOR SELECT USING (true);
CREATE POLICY "Admin insert distributors" ON public.distributors FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update distributors" ON public.distributors FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete distributors" ON public.distributors FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- POINTS_OF_SALE
CREATE POLICY "Public read points_of_sale" ON public.points_of_sale FOR SELECT USING (true);
CREATE POLICY "Admin insert points_of_sale" ON public.points_of_sale FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update points_of_sale" ON public.points_of_sale FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete points_of_sale" ON public.points_of_sale FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- TEAM_MEMBERS
CREATE POLICY "Public read team_members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Admin insert team_members" ON public.team_members FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update team_members" ON public.team_members FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete team_members" ON public.team_members FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- USER_ROLES (admin only for everything)
CREATE POLICY "Admin read user_roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin insert user_roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update user_roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete user_roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
