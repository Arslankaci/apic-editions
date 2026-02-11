
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('author-photos', 'author-photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('book-covers', 'book-covers', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('news-images', 'news-images', true);

-- Public read access for all buckets
CREATE POLICY "Public read access for author photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'author-photos');

CREATE POLICY "Public read access for book covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'book-covers');

CREATE POLICY "Public read access for news images"
ON storage.objects FOR SELECT
USING (bucket_id = 'news-images');

-- Admin upload for all buckets
CREATE POLICY "Admins can upload author photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'author-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload book covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'book-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload news images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'news-images' AND public.has_role(auth.uid(), 'admin'));

-- Admin delete for all buckets
CREATE POLICY "Admins can delete author photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'author-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete book covers"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'book-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete news images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'news-images' AND public.has_role(auth.uid(), 'admin'));

-- Admin update for all buckets
CREATE POLICY "Admins can update author photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'author-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update book covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'book-covers' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update news images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'news-images' AND public.has_role(auth.uid(), 'admin'));
