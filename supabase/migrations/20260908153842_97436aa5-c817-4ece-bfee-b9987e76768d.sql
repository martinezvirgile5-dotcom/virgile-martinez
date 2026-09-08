CREATE TABLE public.site_visits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visited_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.site_visits TO anon;
GRANT SELECT, INSERT ON public.site_visits TO authenticated;
GRANT ALL ON public.site_visits TO service_role;

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anonymous visits can be recorded"
ON public.site_visits
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can read visits"
ON public.site_visits
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);