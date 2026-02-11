INSERT INTO public.user_roles (user_id, role)
VALUES ('e5221d96-cca0-484a-9387-f83ba4621e0b', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;