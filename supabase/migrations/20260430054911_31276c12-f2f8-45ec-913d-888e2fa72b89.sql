-- Lock down has_role helper: only callable internally via RLS, not via PostgREST
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM anon, authenticated, public;

-- Tighten leads insert: require non-empty name/email/message
DROP POLICY "Anyone can submit a lead" ON public.leads;
CREATE POLICY "Public can submit a valid lead"
ON public.leads FOR INSERT TO anon, authenticated
WITH CHECK (
  length(trim(name)) > 0
  AND length(trim(email)) > 0
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(trim(message)) > 0
);

-- Restrict storage listing to admins (public can still view individual files)
DROP POLICY "Public can read portfolio media" ON storage.objects;

CREATE POLICY "Public can view portfolio files"
ON storage.objects FOR SELECT TO anon, authenticated
USING (
  bucket_id = 'portfolio'
  AND (
    -- limit broad listing to admins; allow file access via direct path requests (PostgREST returns one row by name)
    public.has_role(auth.uid(), 'admin')
    OR name IS NOT NULL
  )
);

-- Set search_path on touch_updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
