GRANT UPDATE (estado) ON public.waitlist_sabiduria_ciclica TO authenticated;
CREATE POLICY "Admins can update waitlist status"
ON public.waitlist_sabiduria_ciclica
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));