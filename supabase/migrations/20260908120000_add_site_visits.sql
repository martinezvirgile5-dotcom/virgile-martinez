-- Compteur de visites anonyme : aucune donnée personnelle (pas d'IP, pas de
-- cookie, pas d'identifiant) — uniquement l'heure de chaque visite.
CREATE TABLE public.site_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.site_visits TO anon, authenticated;
GRANT SELECT ON public.site_visits TO authenticated;

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log a visit"
ON public.site_visits FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can read visits"
ON public.site_visits FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));
