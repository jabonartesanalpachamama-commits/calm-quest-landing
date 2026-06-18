-- 1. Roles infrastructure
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
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

-- Bootstrap: first authenticated user becomes admin if none exists yet
CREATE OR REPLACE FUNCTION public.bootstrap_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_exists boolean;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') INTO admin_exists;
  IF admin_exists THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (auth.uid(), 'admin')
  ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.bootstrap_admin() TO authenticated;

-- 2. chat_leads: remove public read, admins only; keep public insert
DROP POLICY IF EXISTS "Allow public read on chat_leads" ON public.chat_leads;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_leads TO authenticated;
CREATE POLICY "Admins can read chat_leads"
  ON public.chat_leads FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. cms_submissions: remove permissive ALL (which leaked SELECT); admins manage, public insert stays
DROP POLICY IF EXISTS "Allow service role or admin key to manage cms_submissions" ON public.cms_submissions;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_submissions TO authenticated;
CREATE POLICY "Admins can manage cms_submissions"
  ON public.cms_submissions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. registrations: admins can read
GRANT SELECT, INSERT, UPDATE, DELETE ON public.registrations TO authenticated;
CREATE POLICY "Admins can read registrations"
  ON public.registrations FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. cms_pages: public read stays; only admins manage
DROP POLICY IF EXISTS "Allow service role or admin key to manage cms_pages" ON public.cms_pages;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_pages TO authenticated;
CREATE POLICY "Admins can manage cms_pages"
  ON public.cms_pages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. cms_forms: public read stays; only admins manage
DROP POLICY IF EXISTS "Allow service role or admin key to manage cms_forms" ON public.cms_forms;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_forms TO authenticated;
CREATE POLICY "Admins can manage cms_forms"
  ON public.cms_forms FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. cms_posts: public read stays; only admins manage
DROP POLICY IF EXISTS "Allow service role or admin key to manage cms_posts" ON public.cms_posts;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_posts TO authenticated;
CREATE POLICY "Admins can manage cms_posts"
  ON public.cms_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 8. cms_settings: public read stays (visual identity); only admins manage
DROP POLICY IF EXISTS "Allow service role or admin key to manage cms_settings" ON public.cms_settings;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_settings TO authenticated;
CREATE POLICY "Admins can manage cms_settings"
  ON public.cms_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));