
ALTER TABLE public.distributors DROP COLUMN region;
ALTER TABLE public.distributors ADD COLUMN street text;
ALTER TABLE public.distributors ADD COLUMN street_complement text;
ALTER TABLE public.distributors ADD COLUMN postal_code text;
ALTER TABLE public.distributors ADD COLUMN city text;
ALTER TABLE public.distributors ADD COLUMN country text;
ALTER TABLE public.distributors ADD COLUMN description text;

INSERT INTO storage.buckets (id, name, public) VALUES ('distributor-logos', 'distributor-logos', true);

CREATE POLICY "Public read distributor-logos" ON storage.objects FOR SELECT USING (bucket_id = 'distributor-logos');
CREATE POLICY "Admin insert distributor-logos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'distributor-logos' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin update distributor-logos" ON storage.objects FOR UPDATE USING (bucket_id = 'distributor-logos' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin delete distributor-logos" ON storage.objects FOR DELETE USING (bucket_id = 'distributor-logos' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
