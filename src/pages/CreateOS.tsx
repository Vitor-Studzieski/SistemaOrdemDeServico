import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Definições dos esquemas de validação para cada tipo de planilha
const schemaHigienizacao = z.object({
  setor: z.string().min(1, "Setor é obrigatório"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  prioridade: z.string().min(1, "Prioridade é obrigatória"),
  prazo: z.string().min(1, "Prazo é obrigatório"),
  mes: z.string().optional(),
  ass: z.string().optional(),
  data: z.string().optional(),
  produto_status: z.string().optional(),
  quantidade: z.string().optional(),
  destino_pessoa: z.string().optional(),
  observacoes: z.string().optional(),
});

const schemaRecebimento = z.object({
  setor: z.string().min(1, "Setor é obrigatório"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  prioridade: z.string().min(1, "Prioridade é obrigatória"),
  prazo: z.string().min(1, "Prazo é obrigatório"),
  mes: z.string().optional(),
  ass: z.string().optional(),
  data: z.string().optional(),
  produto_recebido_status: z.string().optional(),
  quantidade: z.string().optional(),
  fornecedor: z.string().optional(),
  lote: z.string().optional(),
  observacoes: z.string().optional(),
});

const schemaChecklist = z.object({
  setor: z.string().min(1, "Setor é obrigatório"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  prioridade: z.string().min(1, "Prioridade é obrigatória"),
  prazo: z.string().min(1, "Prazo é obrigatório"),
  mes: z.string().optional(),
  verificador: z.string().optional(),
  data: z.string().optional(),
  nao_conformidades: z.string().optional(),
  acao_corretiva: z.string().optional(),
  motivo_nc: z.string().optional(),
  nome_assinaturas: z.string().optional(),
});

const schemaPragas = z.object({
  setor: z.string().min(1, "Setor é obrigatório"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  prioridade: z.string().min(1, "Prioridade é obrigatória"),
  prazo: z.string().min(1, "Prazo é obrigatório"),
  frequencia: z.string().optional(),
  data: z.string().optional(),
  local: z.string().optional(),
  tipos_praga: z.string().optional(),
  quantidade: z.string().optional(),
  comunicado_responsavel: z.string().optional(),
  prov_cliente: z.string().optional(),
  prov_dedetizadora: z.string().optional(),
  observacoes: z.string().optional(),
});

const schemaTreinamento = z.object({
  setor: z.string().min(1, "Setor é obrigatório"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  prioridade: z.string().min(1, "Prioridade é obrigatória"),
  prazo: z.string().min(1, "Prazo é obrigatório"),
  frequencia: z.string().optional(),
  evento: z.string().optional(),
  periodo: z.string().optional(),
  local: z.string().optional(),
  instrutor: z.string().optional(),
  conteudo_treinamento: z.string().optional(),
});

const schemaResiduos = z.object({
  setor: z.string().min(1, "Setor é obrigatório"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  prioridade: z.string().min(1, "Prioridade é obrigatória"),
  prazo: z.string().min(1, "Prazo é obrigatório"),
  mes: z.string().optional(),
  ass: z.string().optional(),
  data: z.string().optional(),
  produto_status: z.string().optional(),
  quantidade: z.string().optional(),
  destino_pessoa: z.string().optional(),
  observacoes: z.string().optional(),
});

const schemaTemperatura = z.object({
  setor: z.string().min(1, "Setor é obrigatório"),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  prioridade: z.string().min(1, "Prioridade é obrigatória"),
  prazo: z.string().min(1, "Prazo é obrigatório"),
  frequencia: z.string().optional(),
  data_hora: z.string().optional(),
  umidade: z.string().optional(),
  temperatura: z.string().optional(),
  nao_conformidades: z.string().optional(),
  acoes_corretivas: z.string().optional(),
  medidas_preventivas: z.string().optional(),
  resp: z.string().optional(),
});

const formSchemas = {
  "higienizacao": schemaHigienizacao,
  "recebimento": schemaRecebimento,
  "checklist": schemaChecklist,
  "pragas": schemaPragas,
  "treinamento": schemaTreinamento,
  "residuos": schemaResiduos,
  "temperatura": schemaTemperatura,
};

const CreateOS = () => {
  const [formType, setFormType] = useState("higienizacao");
  const form = useForm({
    resolver: zodResolver(formSchemas[formType]),
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    form.reset();
  }, [formType, form.reset]);

  const createOrderMut = useMutation({
    mutationFn: async (newOrder) => {
      const { data, error } = await supabase.from("service_orders").insert([newOrder]).select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service_orders"] });
      toast({
        title: "Ordem de serviço criada!",
        description: "A nova ordem foi salva com sucesso.",
      });
      navigate("/orders");
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar ordem",
        description: `Ocorreu um erro: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values) => {
    let titulo = "";
    let descricao = "";

    switch (formType) {
        case "higienizacao":
            titulo = `Higienização de Equipamentos - Mês: ${values.mes}`;
            descricao = `Responsável: ${values.responsavel}. Data: ${values.data}.`;
            break;
        case "recebimento":
            titulo = `Recebimento de Matéria-Prima - Mês: ${values.mes}`;
            descricao = `Fornecedor: ${values.fornecedor}. Lote: ${values.lote}.`;
            break;
        case "checklist":
            titulo = `Checklist de Manipuladores - Mês: ${values.mes}`;
            descricao = `Verificador: ${values.verificador}. Setor: ${values.setor}.`;
            break;
        case "pragas":
            titulo = `Controle de Pragas - Data: ${values.data}`;
            descricao = `Local: ${values.local}. Quantidade: ${values.quantidade}.`;
            break;
        case "treinamento":
            titulo = `Registro de Treinamento - Evento: ${values.evento}`;
            descricao = `Instrutor: ${values.instrutor}. Período: ${values.periodo}.`;
            break;
        case "residuos":
            titulo = `Retirada de Resíduos - Mês: ${values.mes}`;
            descricao = `Responsável: ${values.responsavel}. Data: ${values.data}.`;
            break;
        case "temperatura":
            titulo = `Registro de Temperatura e Umidade - Setor: ${values.setor}`;
            descricao = `Umidade: ${values.umidade}%. Temperatura: ${values.temperatura}°C.`;
            break;
        default:
            titulo = "Nova Ordem de Serviço";
            descricao = "Detalhes não especificados.";
    }

    const orderData = {
      tipo_os: formType,
      titulo: titulo,
      descricao: descricao,
      status: "pendente",
      criado_em: new Date().toISOString(),
      responsavel: values.responsavel,
      setor: values.setor,
      prioridade: values.prioridade,
      prazo: values.prazo,
      form_data: values,
    };

    createOrderMut.mutate(orderData);
  };

  const renderFormFields = () => {
    const commonFormFields = (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Maria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="setor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setor</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Produção" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="prioridade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critica">Crítica</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="baixa">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prazo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
    );

    switch (formType) {
      case "higienizacao":
      case "residuos":
        return (
          <>
            {commonFormFields}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="mes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mês</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Março" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assinatura</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Assinatura do responsável" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="produto_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto retirado/status</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Conforme/Não Conforme" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destino_pessoa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destino ou pessoa</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Lixo comum" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Adicione observações aqui" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case "recebimento":
        return (
          <>
            {commonFormFields}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="mes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mês</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Março" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assinatura</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Assinatura do responsável" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="produto_recebido_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto recebido/Status</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Produto A / Conforme" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fornecedor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Fornecedor X" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lote</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Lote 123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Adicione observações aqui" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case "checklist":
        return (
          <>
            {commonFormFields}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mês</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Março" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="verificador"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verificador</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Pedro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <h3 className="font-semibold mt-4">Checklist de Higiene</h3>
            <div className="border rounded-md mt-2">
              <div className="grid grid-cols-6 border-b bg-gray-100 font-medium">
                <div className="p-2 col-span-2 border-r"></div>
                <div className="p-2 text-center border-r">Pasta</div>
                <div className="p-2 text-center border-r">Seleção</div>
                <div className="p-2 text-center border-r">Beneficiamento</div>
                <div className="p-2 text-center">Expedição</div>
              </div>
              
              {/* Higiene */}
              <div className="grid grid-cols-6 border-b">
                <div className="p-2 col-span-2 border-r">Os profissionais tem asseio corporal...?</div>
                <div className="p-2 text-center border-r">
                  <FormField
                    control={form.control}
                    name="pasta_higiene"
                    render={({ field }) => (
                      <Input {...field} placeholder="C/NC" className="text-center" />
                    )}
                  />
                </div>
                <div className="p-2 text-center border-r">
                  <FormField
                    control={form.control}
                    name="selecao_higiene"
                    render={({ field }) => (
                      <Input {...field} placeholder="C/NC" className="text-center" />
                    )}
                  />
                </div>
                <div className="p-2 text-center border-r">
                  <FormField
                    control={form.control}
                    name="beneficiamento_higiene"
                    render={({ field }) => (
                      <Input {...field} placeholder="C/NC" className="text-center" />
                    )}
                  />
                </div>
                <div className="p-2 text-center">
                  <FormField
                    control={form.control}
                    name="expedicao_higiene"
                    render={({ field }) => (
                      <Input {...field} placeholder="C/NC" className="text-center" />
                    )}
                  />
                </div>
              </div>

              {/* Adornos */}
              <div className="grid grid-cols-6 border-b">
                <div className="p-2 col-span-2 border-r">Os profissionais utilizam adornos na área de produção...?</div>
                <div className="p-2 text-center border-r">
                  <FormField
                    control={form.control}
                    name="pasta_adornos"
                    render={({ field }) => (
                      <Input {...field} placeholder="C/NC" className="text-center" />
                    )}
                  />
                </div>
                <div className="p-2 text-center border-r">
                  <FormField
                    control={form.control}
                    name="selecao_adornos"
                    render={({ field }) => (
                      <Input {...field} placeholder="C/NC" className="text-center" />
                    )}
                  />
                </div>
                <div className="p-2 text-center border-r">
                  <FormField
                    control={form.control}
                    name="beneficiamento_adornos"
                    render={({ field }) => (
                      <Input {...field} placeholder="C/NC" className="text-center" />
                    )}
                  />
                </div>
                <div className="p-2 text-center">
                  <FormField
                    control={form.control}
                    name="expedicao_adornos"
                    render={({ field }) => (
                      <Input {...field} placeholder="C/NC" className="text-center" />
                    )}
                  />
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="nao_conformidades"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Não conformidades</FormLabel>
                  <FormControl>
                    <Input placeholder="Liste as não conformidades" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acao_corretiva"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ação Corretiva</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva a ação corretiva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="motivo_nc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo da NC</FormLabel>
                  <FormControl>
                    <Input placeholder="Motivo da não conformidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nome_assinaturas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome e Assinaturas dos funcionários reorientados</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Nomes e assinaturas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case "pragas":
        return (
          <>
            {commonFormFields}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="frequencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequência</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Mensal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="local"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Depósito" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipos_praga"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipos de Praga</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Insetos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="comunicado_responsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comunicado Responsável</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prov_cliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Providências Adotadas pelo Cliente</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva as providências" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="prov_dedetizadora"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Providências Adotadas pela Dedetizadora</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva as providências" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Adicione observações aqui" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case "treinamento":
        return (
          <>
            {commonFormFields}
            <FormField
              control={form.control}
              name="frequencia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequência</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Quando necessário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="evento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Treinamento de Boas Práticas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="periodo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="local"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Empresa MR AMENDOIM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="instrutor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instrutor</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Regiele Pedroso" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="conteudo_treinamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo do treinamento</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva o conteúdo do treinamento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case "temperatura":
        return (
          <>
            {commonFormFields}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="frequencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequência</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Diário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data_hora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data e Hora</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="umidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Umidade (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="temperatura"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperatura (°C)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="nao_conformidades"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição das Não-Conformidades</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva as não-conformidades" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acoes_corretivas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ações Corretivas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva as ações corretivas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medidas_preventivas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medidas Preventivas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descreva as medidas preventivas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="resp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resp.</FormLabel>
                  <FormControl>
                    <Input placeholder="Responsável" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      default:
        return commonFormFields;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Criar Nova Ordem</h1>
            <p className="text-sm text-gray-600">Preencha os campos para criar uma nova ordem de serviço.</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Tipo de Ordem de Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setFormType(value)} defaultValue={formType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de ordem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="higienizacao">Higienização e Resíduos</SelectItem>
                <SelectItem value="recebimento">Recebimento de Matéria-Prima</SelectItem>
                <SelectItem value="checklist">Checklist de Manipuladores</SelectItem>
                <SelectItem value="pragas">Controle de Ocorrência de Pragas</SelectItem>
                <SelectItem value="treinamento">Registro de Treinamento</SelectItem>
                <SelectItem value="residuos">Retiradas de Resíduos</SelectItem>
                <SelectItem value="temperatura">Registro de Temperatura e Umidade</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Detalhes da Ordem</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {renderFormFields()}
                <Button type="submit" className="w-full" disabled={createOrderMut.isPending}>
                  <Save className="mr-2 h-4 w-4" />
                  {createOrderMut.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateOS;