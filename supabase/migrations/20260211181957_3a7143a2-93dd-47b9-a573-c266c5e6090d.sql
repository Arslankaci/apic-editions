
-- Authors: add first_name/last_name, migrate data, drop name
ALTER TABLE public.authors ADD COLUMN first_name text;
ALTER TABLE public.authors ADD COLUMN last_name text;
UPDATE public.authors SET last_name = name, first_name = '' WHERE name IS NOT NULL;
ALTER TABLE public.authors ALTER COLUMN last_name SET NOT NULL;
ALTER TABLE public.authors DROP COLUMN name;

-- Team members: add first_name/last_name, migrate data, drop name
ALTER TABLE public.team_members ADD COLUMN first_name text;
ALTER TABLE public.team_members ADD COLUMN last_name text;
UPDATE public.team_members SET last_name = name, first_name = '' WHERE name IS NOT NULL;
ALTER TABLE public.team_members ALTER COLUMN last_name SET NOT NULL;
ALTER TABLE public.team_members DROP COLUMN name;
