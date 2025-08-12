-- Service Orders schema for persistence

-- Create main table
CREATE TABLE IF NOT EXISTS public.service_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  setor TEXT NOT NULL,
  responsavel TEXT NOT NULL,
  prioridade TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  prazo DATE NULL,
  recorrente BOOLEAN NOT NULL DEFAULT false,
  frequencia TEXT NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create parameters table
CREATE TABLE IF NOT EXISTS public.service_order_parameters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.service_orders(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  unidade TEXT NULL,
  valor_minimo NUMERIC NULL,
  valor_maximo NUMERIC NULL,
  user_id UUID NULL,
  criado_em TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_order_parameters ENABLE ROW LEVEL SECURITY;

-- Policies: allow all authenticated users full access (mirrors existing pattern)
DROP POLICY IF EXISTS "All authenticated users can access service orders" ON public.service_orders;
CREATE POLICY "All authenticated users can access service orders"
ON public.service_orders
FOR ALL
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "All authenticated users can access service order parameters" ON public.service_order_parameters;
CREATE POLICY "All authenticated users can access service order parameters"
ON public.service_order_parameters
FOR ALL
USING (true)
WITH CHECK (true);

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_service_orders_updated_at ON public.service_orders;
CREATE TRIGGER update_service_orders_updated_at
BEFORE UPDATE ON public.service_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_service_order_parameters_updated_at ON public.service_order_parameters;
CREATE TRIGGER update_service_order_parameters_updated_at
BEFORE UPDATE ON public.service_order_parameters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON public.service_orders(status);
CREATE INDEX IF NOT EXISTS idx_service_orders_prazo ON public.service_orders(prazo);
CREATE INDEX IF NOT EXISTS idx_service_order_parameters_order_id ON public.service_order_parameters(order_id);
