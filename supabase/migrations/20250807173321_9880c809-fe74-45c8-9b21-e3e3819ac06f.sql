-- Remove all user-isolated RLS policies and create shared access policies

-- Drop existing user-isolated policies
DROP POLICY IF EXISTS "Users can access own weekly signatures" ON public.assinaturas_semanais;
DROP POLICY IF EXISTS "Users can access own headers" ON public.cabecalho;
DROP POLICY IF EXISTS "Users can access own cleaning headers" ON public.cabecalho_limpeza;
DROP POLICY IF EXISTS "Users can access own receiving headers" ON public.cabecalho_recebimento;
DROP POLICY IF EXISTS "Users can access own temperature headers" ON public.cabecalho_temperatura_umidade;
DROP POLICY IF EXISTS "Users can access own receiving controls" ON public.controle_recebimentos;
DROP POLICY IF EXISTS "Users can access own detailed cleaning" ON public.limpeza_detalhada;
DROP POLICY IF EXISTS "Users can access own cleaning installations" ON public.limpeza_instalacoes;
DROP POLICY IF EXISTS "Users can access own non-conformities" ON public.nao_conformidades;
DROP POLICY IF EXISTS "Users can access own temperature records" ON public.registros_temperatura_umidade;

-- Create new shared access policies - all authenticated users can access all data
CREATE POLICY "All authenticated users can access weekly signatures" 
ON public.assinaturas_semanais 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "All authenticated users can access headers" 
ON public.cabecalho 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "All authenticated users can access cleaning headers" 
ON public.cabecalho_limpeza 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "All authenticated users can access receiving headers" 
ON public.cabecalho_recebimento 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "All authenticated users can access temperature headers" 
ON public.cabecalho_temperatura_umidade 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "All authenticated users can access receiving controls" 
ON public.controle_recebimentos 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "All authenticated users can access detailed cleaning" 
ON public.limpeza_detalhada 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "All authenticated users can access cleaning installations" 
ON public.limpeza_instalacoes 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "All authenticated users can access non-conformities" 
ON public.nao_conformidades 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "All authenticated users can access temperature records" 
ON public.registros_temperatura_umidade 
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);