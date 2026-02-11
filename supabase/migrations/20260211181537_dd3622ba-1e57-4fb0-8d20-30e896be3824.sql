
ALTER TABLE public.books ADD COLUMN price numeric;
ALTER TABLE public.books ADD COLUMN currency text DEFAULT 'EUR';
