CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
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

CREATE OR REPLACE FUNCTION public.grant_first_user_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_first_user_admin();

CREATE TABLE public.site_content (
  id text PRIMARY KEY DEFAULT 'main',
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portfolio content is public"
ON public.site_content FOR SELECT
USING (true);

CREATE POLICY "Admins can create content"
ON public.site_content FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update content"
ON public.site_content FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER site_content_touch
BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.site_content (id, data) VALUES ('main', '{}'::jsonb);

CREATE POLICY "Portfolio media is readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

CREATE POLICY "Admins can upload portfolio media"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update portfolio media"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete portfolio media"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'portfolio' AND public.has_role(auth.uid(), 'admin'));