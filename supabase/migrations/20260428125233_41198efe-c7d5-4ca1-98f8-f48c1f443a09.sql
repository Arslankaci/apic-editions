-- 1. Table families
CREATE TABLE public.families (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read families" ON public.families FOR SELECT USING (true);
CREATE POLICY "Admin insert families" ON public.families FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin update families" ON public.families FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admin delete families" ON public.families FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Add family_id, position, is_hidden to genres
ALTER TABLE public.genres
  ADD COLUMN family_id UUID REFERENCES public.families(id) ON DELETE SET NULL,
  ADD COLUMN position INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT false;

-- 3. Add position, is_hidden to sub_genres
ALTER TABLE public.sub_genres
  ADD COLUMN position INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN is_hidden BOOLEAN NOT NULL DEFAULT false;

-- 4. Add position to collections
ALTER TABLE public.collections
  ADD COLUMN position INTEGER NOT NULL DEFAULT 0;

-- 5. Add type to news_articles
ALTER TABLE public.news_articles
  ADD COLUMN event_type TEXT NOT NULL DEFAULT 'autre';

-- 6. Seed families
INSERT INTO public.families (name, position) VALUES
  ('Littératures', 1),
  ('Essais', 2);

-- 7. Hide legacy genres
UPDATE public.genres SET is_hidden = true
  WHERE name IN ('Histoire', 'Sciences', 'Jeunesse', 'Art & Culture');

-- 8. Attach existing "Littérature" genre to Littératures family (it stays as a legacy group)
UPDATE public.genres
  SET family_id = (SELECT id FROM public.families WHERE name = 'Littératures'),
      is_hidden = true
  WHERE name = 'Littérature';

-- 9. Insert new genres for Littératures family
WITH lit AS (SELECT id FROM public.families WHERE name = 'Littératures')
INSERT INTO public.genres (name, family_id, position) VALUES
  ('Romans',    (SELECT id FROM lit), 1),
  ('Nouvelles', (SELECT id FROM lit), 2),
  ('Poésies',   (SELECT id FROM lit), 3),
  ('Théâtres',  (SELECT id FROM lit), 4),
  ('Récits',    (SELECT id FROM lit), 5);

-- 10. Insert collections per the mockup
-- Romans
INSERT INTO public.collections (name, genre, position) VALUES
  ('Hors Collections',              'Romans', 0),
  ('Collection "Résonances"',       'Romans', 1),
  ('Collection "Terres solidaires"', 'Romans', 2);

-- Nouvelles
INSERT INTO public.collections (name, genre, position) VALUES
  ('Hors Collections', 'Nouvelles', 0);

-- Poésies
INSERT INTO public.collections (name, genre, position) VALUES
  ('Hors Collections',              'Poésies', 0),
  ('Collection "Poèmes du monde"',  'Poésies', 1);

-- Théâtres
INSERT INTO public.collections (name, genre, position) VALUES
  ('Collection "Messrah"', 'Théâtres', 0);

-- Récits
INSERT INTO public.collections (name, genre, position) VALUES
  ('Hors Collections', 'Récits', 0);

-- Essais (no genre level needed per mockup; collections directly under family)
-- We use a placeholder genre 'Essais' to keep the same data model
WITH ess AS (SELECT id FROM public.families WHERE name = 'Essais')
INSERT INTO public.genres (name, family_id, position) VALUES
  ('Essais', (SELECT id FROM ess), 1);

INSERT INTO public.collections (name, genre, position) VALUES
  ('Hors Collections',          'Essais', 0),
  ('Collection "Dissonances"',  'Essais', 1);

-- 11. Index for performance
CREATE INDEX IF NOT EXISTS idx_genres_family_id ON public.genres(family_id);
CREATE INDEX IF NOT EXISTS idx_news_articles_event_type ON public.news_articles(event_type);