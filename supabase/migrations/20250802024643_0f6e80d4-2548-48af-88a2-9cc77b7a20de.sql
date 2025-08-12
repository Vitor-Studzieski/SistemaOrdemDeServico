-- Fix critical security vulnerabilities

-- 1. Fix the function search path security issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 2. Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Enable RLS on all tables that don't have it
ALTER TABLE public.registros_temperatura_umidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.limpeza_instalacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.limpeza_detalhada ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cabecalho_temperatura_umidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nao_conformidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cabecalho ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas_semanais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cabecalho_limpeza ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Add user_id columns to tables that need user association
ALTER TABLE public.registros_temperatura_umidade ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.limpeza_instalacoes ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.limpeza_detalhada ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.cabecalho_temperatura_umidade ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.nao_conformidades ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.cabecalho ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.assinaturas_semanais ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.cabecalho_limpeza ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id);

-- 5. Create secure RLS policies for profiles table
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. Create RLS policies for all other tables (user can only access their own data)
CREATE POLICY "Users can access own temperature records" ON public.registros_temperatura_umidade
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own cleaning installations" ON public.limpeza_instalacoes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own detailed cleaning" ON public.limpeza_detalhada
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own temperature headers" ON public.cabecalho_temperatura_umidade
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own non-conformities" ON public.nao_conformidades
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own headers" ON public.cabecalho
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own weekly signatures" ON public.assinaturas_semanais
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access own cleaning headers" ON public.cabecalho_limpeza
  FOR ALL USING (auth.uid() = user_id);

-- 7. Update existing overly permissive policies
DROP POLICY IF EXISTS "Allow all operations on control items" ON public.controle_recebimentos;
DROP POLICY IF EXISTS "Allow all operations on quality controls" ON public.cabecalho_recebimento;

-- Create proper user-based policies for these tables
CREATE POLICY "Users can access own receiving controls" ON public.controle_recebimentos
  FOR ALL USING (auth.uid() = (SELECT user_id FROM public.cabecalho_recebimento WHERE id = id_cabecalho));

CREATE POLICY "Users can access own receiving headers" ON public.cabecalho_recebimento
  FOR ALL USING (auth.uid() = user_id);

-- 8. Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

-- 9. Create trigger to automatically create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();