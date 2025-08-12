-- Update the user_roles table to use the correct enum type
ALTER TABLE public.user_roles 
ALTER COLUMN role TYPE public.app_role USING role::text::public.app_role;

-- Update the profiles table role column
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE public.app_role USING role::text::public.app_role;

-- Set default role for profiles
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'usuario'::public.app_role;