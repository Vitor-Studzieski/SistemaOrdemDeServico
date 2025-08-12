-- Criar tabela para controle de qualidade/recebimento
CREATE TABLE public.controle_qualidade (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mes TEXT NOT NULL,
  responsavel TEXT NOT NULL,
  assinatura TEXT,
  codigo_doc TEXT,
  elaborado_por TEXT,
  elaborado_em DATE,
  revisado_por TEXT,
  revisado_em DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para os itens de controle (cada linha da tabela)
CREATE TABLE public.itens_controle (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  controle_id UUID NOT NULL REFERENCES public.controle_qualidade(id) ON DELETE CASCADE,
  data_recebimento DATE NOT NULL,
  produto_recebido TEXT NOT NULL,
  status TEXT CHECK (status IN ('C', 'NC')) NOT NULL, -- C = Conforme, NC = Não Conforme
  quantidade DECIMAL(10,2),
  fornecedor TEXT,
  lote TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.controle_qualidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_controle ENABLE ROW LEVEL SECURITY;

-- Create policies for controle_qualidade
CREATE POLICY "Users can view their own quality controls" 
ON public.controle_qualidade 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quality controls" 
ON public.controle_qualidade 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quality controls" 
ON public.controle_qualidade 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quality controls" 
ON public.controle_qualidade 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for itens_controle
CREATE POLICY "Users can view items from their quality controls" 
ON public.itens_controle 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.controle_qualidade 
  WHERE id = itens_controle.controle_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can create items for their quality controls" 
ON public.itens_controle 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.controle_qualidade 
  WHERE id = itens_controle.controle_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can update items from their quality controls" 
ON public.itens_controle 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.controle_qualidade 
  WHERE id = itens_controle.controle_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Users can delete items from their quality controls" 
ON public.itens_controle 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.controle_qualidade 
  WHERE id = itens_controle.controle_id 
  AND user_id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_controle_qualidade_updated_at
  BEFORE UPDATE ON public.controle_qualidade
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_itens_controle_updated_at
  BEFORE UPDATE ON public.itens_controle
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_controle_qualidade_user_id ON public.controle_qualidade(user_id);
CREATE INDEX idx_controle_qualidade_mes ON public.controle_qualidade(mes);
CREATE INDEX idx_itens_controle_controle_id ON public.itens_controle(controle_id);
CREATE INDEX idx_itens_controle_data ON public.itens_controle(data_recebimento);