-- Update RLS policies to allow unauthenticated access for controle_qualidade table
DROP POLICY "Users can view their own quality controls" ON public.controle_qualidade;
DROP POLICY "Users can create their own quality controls" ON public.controle_qualidade;
DROP POLICY "Users can update their own quality controls" ON public.controle_qualidade;
DROP POLICY "Users can delete their own quality controls" ON public.controle_qualidade;

-- Create new policies that allow access without authentication
CREATE POLICY "Allow all operations on quality controls" 
ON public.controle_qualidade 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Update RLS policies to allow unauthenticated access for itens_controle table
DROP POLICY "Users can view items from their quality controls" ON public.itens_controle;
DROP POLICY "Users can create items for their quality controls" ON public.itens_controle;
DROP POLICY "Users can update items from their quality controls" ON public.itens_controle;
DROP POLICY "Users can delete items from their quality controls" ON public.itens_controle;

-- Create new policies that allow access without authentication
CREATE POLICY "Allow all operations on control items" 
ON public.itens_controle 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Make user_id nullable in controle_qualidade since we're not requiring authentication
ALTER TABLE public.controle_qualidade ALTER COLUMN user_id DROP NOT NULL;