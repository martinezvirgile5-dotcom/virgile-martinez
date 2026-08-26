DROP POLICY "Admins can create content" ON public.site_content;
DROP POLICY "Admins can update content" ON public.site_content;
DROP POLICY "Admins can upload portfolio media" ON storage.objects;
DROP POLICY "Admins can update portfolio media" ON storage.objects;
DROP POLICY "Admins can delete portfolio media" ON storage.objects;
DROP FUNCTION public.has_role(uuid, public.app_role);

CREATE POLICY "Admins can create content"
ON public.site_content FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

CREATE POLICY "Admins can update content"
ON public.site_content FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

CREATE POLICY "Admins can upload portfolio media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'portfolio' AND EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

CREATE POLICY "Admins can update portfolio media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'portfolio' AND EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

CREATE POLICY "Admins can delete portfolio media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'portfolio' AND EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));