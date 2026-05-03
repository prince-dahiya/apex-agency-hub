GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon, authenticated;
INSERT INTO public.user_roles (user_id, role)
VALUES ('4b83c2cf-1970-4c24-8227-f3a175d16173', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;