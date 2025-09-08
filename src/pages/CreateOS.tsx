import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, PlusCircle, Trash2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const baseSchema = z.object({
  tipo_ordem: z.string(),
  responsavel: z.string().min(1, "Responsável é obrigatório"),
  setor: z.string().optional(),
  prioridade: z.string().min(1, "Prioridade é obrigatória"),
  prazo: z.string().min(1, "Prazo é obrigatório"),
});

const schemaRetiradaResiduos = baseSchema.extend({
  data: z.string().min(1, "Data é obrigatória"),
  produto_status: z.string().min(1, "Produto/Status é obrigatório"),
  quantidade: z.string().min(1, "Quantidade é obrigatória"),
  destino_pessoa: z.string().min(1, "Destino/Pessoa é obrigatório"),
  observacoes: z.string().optional(),
});

const schemaControlePragas = baseSchema.extend({
  data: z.string().min(1, "Data é obrigatória"),
  local: z.string().min(1, "Local é obrigatório"),
  tipo_praga: z.string().min(1, "Tipo de praga é obrigatório"),
  quantidade: z.string().min(1, "Quantidade é obrigatória"),
  comunicado_responsavel: z.enum(["sim", "nao"], { required_error: "Este campo é obrigatório" }),
  providencias_cliente: z.string().min(1, "Providências do cliente são obrigatórias"),
  providencias_dedetizadora: z.string().min(1, "Providências da dedetizadora são obrigatórias"),
  observacoes: z.string().optional(),
});

const schemaChecklistManipuladores = baseSchema.extend({
  mes: z.string().min(1, "Mês é obrigatório"),
  verificador: z.string().min(1, "Verificador é obrigatório"),
  data: z.string().min(1, "Data é obrigatória"),
  setores_selecionados: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Você precisa selecionar pelo menos um setor.",
  }),
  grid: z.record(z.string(), z.enum(["C", "NC"])),
  nao_conformidades: z.string().optional(),
  acao_corretiva: z.string().optional(),
  funcionarios_reorientados: z.string().optional(),
  motivo_nc: z.string().optional(),
  acao_corretiva_rodape: z.string().optional(),
});

const recebimentoItemSchema = z.object({
  data: z.string().min(1, "Data é obrigatória"),
  produto_recebido: z.string().min(1, "Produto é obrigatório"),
  status: z.enum(["C", "NC"], { required_error: "Status é obrigatório" }),
  quantidade: z.string().min(1, "Quantidade é obrigatória"),
  fornecedor: z.string().min(1, "Fornecedor é obrigatório"),
  lote: z.string().min(1, "Lote é obrigatório"),
  observacoes: z.string().optional(),
});

const schemaRecebimentoMP = baseSchema.extend({
  mes: z.string().min(1, "Mês é obrigatório"),
  assinatura: z.string().min(1, "Assinatura é obrigatória"),
  itens: z.array(recebimentoItemSchema).min(1, "Adicione pelo menos um item."),
});

const recebimentoEmbalagensItemSchema = z.object({
  data: z.string().min(1, "Data é obrigatória"),
  produto: z.string().min(1, "Produto é obrigatório"),
  lote: z.string().min(1, "Lote é obrigatório"),
  validade: z.string().min(1, "Validade é obrigatória"),
  selagem: z.enum(["C", "NC"]),
  impressao: z.enum(["C", "NC"]),
  aparencia: z.enum(["C", "NC"]),
  peso_amostras: z.string().min(1, "Peso das amostras é obrigatório"),
  peso_medio: z.string().min(1, "Peso médio é obrigatório"),
  peso_status: z.enum(["C", "NC"]),
  acao_corretiva: z.string().optional(),
});

const schemaRecebimentoEmbalagens = baseSchema.extend({
  mes_ano: z.string().min(1, "Mês/Ano é obrigatório"),
  itens: z.array(recebimentoEmbalagensItemSchema).min(1, "Adicione pelo menos um item."),
});

const formSchemas = {
  higiene_equipamentos: schemaRetiradaResiduos, 
  retirada_residuos: schemaRetiradaResiduos,
  recebimento_mp: schemaRecebimentoMP,
  recebimento_quimicos: schemaRecebimentoMP, 
  checklist_manipuladores: schemaChecklistManipuladores,
  controle_pragas: schemaControlePragas,
  recebimento_embalagens: schemaRecebimentoEmbalagens,
};

const tipoOrdemLabels = {
  higiene_equipamentos: "Controle de Higiene dos Equipamentos",
  retirada_residuos: "Planilha de Retiradas de Resíduos",
  recebimento_mp: "Recebimento de Matérias-Primas",
  recebimento_quimicos: "Recebimento de Produtos Químicos",
  checklist_manipuladores: "Checklist de Higiene e Saúde",
  controle_pragas: "Controle de Ocorrência de Pragas",
  recebimento_embalagens: "Recebimento de Embalagens",
};

const CreateOS = () => {
  const [formType, setFormType] = useState("higiene_equipamentos");
  
  const form = useForm({
    resolver: zodResolver(formSchemas[formType]),
    defaultValues: {
      tipo_ordem: formType,
    },
  });

  const { fields: mpFields, append: mpAppend, remove: mpRemove } = useFieldArray({
    control: form.control,
    name: "itens",
  });

  const { fields: embFields, append: embAppend, remove: embRemove } = useFieldArray({
    control: form.control,
    name: "itens",
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    form.reset({ tipo_ordem: formType });
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
    const { responsavel, setor, prioridade, prazo, ...details } = values;
    const payload = {
      titulo: `${tipoOrdemLabels[formType]}`,
      tipo: tipoOrdemLabels[formType],
      responsavel,
      setor,
      prioridade,
      prazo,
      status: 'Pendente',
      detalhes: details,
    };
    createOrderMut.mutate(payload);
  };
  
  const renderFormFields = () => {
    const commonFields = (
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white shadow-md z-50">
                    <SelectItem value="critica">Crítica</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                  </SelectContent>
                </Select>
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
      case "higiene_equipamentos":
      case "retirada_residuos":
        return <>
          {commonFields}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="data" render={({ field }) => (<FormItem><FormLabel>Data</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="produto_status" render={({ field }) => (<FormItem><FormLabel>Produto Retirado / Status</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="quantidade" render={({ field }) => (<FormItem><FormLabel>Quantidade</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="destino_pessoa" render={({ field }) => (<FormItem><FormLabel>Destino ou Pessoa</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          </div>
          <FormField control={form.control} name="observacoes" render={({ field }) => (<FormItem><FormLabel>Observações</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
        </>
      case "controle_pragas":
         return <>
          {commonFields}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField control={form.control} name="data" render={({ field }) => (<FormItem><FormLabel>Data</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="local" render={({ field }) => (<FormItem><FormLabel>Local</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <FormField control={form.control} name="tipo_praga" render={({ field }) => (<FormItem><FormLabel>Tipo de Praga</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="quantidade" render={({ field }) => (<FormItem><FormLabel>Quantidade</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
           </div>
           <FormField control={form.control} name="comunicado_responsavel" render={({ field }) => (
              <FormItem><FormLabel>Comunicado Responsável</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                  <SelectContent className="bg-white shadow-md z-50"><SelectItem value="sim">Sim</SelectItem><SelectItem value="nao">Não</SelectItem></SelectContent>
                </Select><FormMessage />
              </FormItem>)}
            />
           <FormField control={form.control} name="providencias_cliente" render={({ field }) => (<FormItem><FormLabel>Providências Adotadas pelo Cliente</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
           <FormField control={form.control} name="providencias_dedetizadora" render={({ field }) => (<FormItem><FormLabel>Providências Adotadas pela Dedetizadora</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
           <FormField control={form.control} name="observacoes" render={({ field }) => (<FormItem><FormLabel>Observações</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
        </>
      case "recebimento_mp":
      case "recebimento_quimicos":
        return <>
          {commonFields}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="mes" render={({ field }) => (<FormItem><FormLabel>Mês</FormLabel><FormControl><Input placeholder="Ex: Setembro" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="assinatura" render={({ field }) => (<FormItem><FormLabel>Assinatura (Responsável)</FormLabel><FormControl><Input placeholder="Digite o nome" {...field} /></FormControl><FormMessage /></FormItem>)} />
          </div>
          <CardTitle className="mt-6 mb-2 text-lg">Itens Recebidos</CardTitle>
          {mpFields.map((item, index) => (
            <Card key={item.id} className="p-4 relative space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name={`itens.${index}.data`} render={({ field }) => (<FormItem><FormLabel>Data</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`itens.${index}.produto_recebido`} render={({ field }) => (<FormItem><FormLabel>Produto Recebido</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name={`itens.${index}.quantidade`} render={({ field }) => (<FormItem><FormLabel>Quantidade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`itens.${index}.fornecedor`} render={({ field }) => (<FormItem><FormLabel>Fornecedor</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name={`itens.${index}.lote`} render={({ field }) => (<FormItem><FormLabel>Lote</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name={`itens.${index}.status`} render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl><SelectContent className="bg-white shadow-md z-50"><SelectItem value="C">Conforme (C)</SelectItem><SelectItem value="NC">Não Conforme (NC)</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              </div>
              <FormField control={form.control} name={`itens.${index}.observacoes`} render={({ field }) => (<FormItem><FormLabel>Observações</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
              <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => mpRemove(index)}><Trash2 className="w-4 h-4" /></Button>
            </Card>
          ))}
          <Button type="button" variant="outline" onClick={() => mpAppend({ data: '', produto_recebido: '', status: 'C', quantidade: '', fornecedor: '', lote: '', observacoes: ''})}><PlusCircle className="mr-2 h-4 w-4" />Adicionar Item</Button>
          <FormMessage>{form.formState.errors.itens?.message}</FormMessage>
        </>
      case "recebimento_embalagens":
         return <>
          {commonFields}
           <FormField control={form.control} name="mes_ano" render={({ field }) => (<FormItem><FormLabel>Mês/Ano</FormLabel><FormControl><Input placeholder="Ex: 09/2025" {...field} /></FormControl><FormMessage /></FormItem>)} />
           <CardTitle className="mt-6 mb-2 text-lg">Embalagens Recebidas</CardTitle>
          {embFields.map((item, index) => (
            <Card key={item.id} className="p-4 relative space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name={`itens.${index}.data`} render={({ field }) => (<FormItem><FormLabel>Data</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name={`itens.${index}.produto`} render={({ field }) => (<FormItem><FormLabel>Produto</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField control={form.control} name={`itens.${index}.lote`} render={({ field }) => (<FormItem><FormLabel>Lote</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name={`itens.${index}.validade`} render={({ field }) => (<FormItem><FormLabel>Validade</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                 <FormField control={form.control} name={`itens.${index}.selagem`} render={({ field }) => (<FormItem><FormLabel>Selagem</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="C/NC" /></SelectTrigger></FormControl><SelectContent className="bg-white z-50"><SelectItem value="C">C</SelectItem><SelectItem value="NC">NC</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name={`itens.${index}.impressao`} render={({ field }) => (<FormItem><FormLabel>Impressão</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="C/NC" /></SelectTrigger></FormControl><SelectContent className="bg-white z-50"><SelectItem value="C">C</SelectItem><SelectItem value="NC">NC</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name={`itens.${index}.aparencia`} render={({ field }) => (<FormItem><FormLabel>Aparência</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="C/NC" /></SelectTrigger></FormControl><SelectContent className="bg-white z-50"><SelectItem value="C">C</SelectItem><SelectItem value="NC">NC</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                 <FormField control={form.control} name={`itens.${index}.peso_amostras`} render={({ field }) => (<FormItem><FormLabel>Peso Amostras (g)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name={`itens.${index}.peso_medio`} render={({ field }) => (<FormItem><FormLabel>Peso Médio (g)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField control={form.control} name={`itens.${index}.peso_status`} render={({ field }) => (<FormItem><FormLabel>Peso (Status)</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="C/NC" /></SelectTrigger></FormControl><SelectContent className="bg-white z-50"><SelectItem value="C">C</SelectItem><SelectItem value="NC">NC</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
               </div>
               <FormField control={form.control} name={`itens.${index}.acao_corretiva`} render={({ field }) => (<FormItem><FormLabel>Ação Corretiva</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
              <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => embRemove(index)}><Trash2 className="w-4 h-4" /></Button>
            </Card>
          ))}
          <Button type="button" variant="outline" onClick={() => embAppend({})}><PlusCircle className="mr-2 h-4 w-4" />Adicionar Item</Button>
          <FormMessage>{form.formState.errors.itens?.message}</FormMessage>
        </>
      case "checklist_manipuladores":
        return <>
          {commonFields}
           <p className="text-sm font-medium">WIP: Checklist form is complex and needs specific grid implementation.</p>
        </>
      default:
        return commonFields;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Criar Nova Ordem de Serviço</h1>
        <Link to="/orders">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Ordens
          </Button>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tipo de Ordem de Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <Select onValueChange={(value) => setFormType(value)} defaultValue={formType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de ordem" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-md z-50">
                  {Object.entries(tipoOrdemLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Ordem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {renderFormFields()}
              </div>
            </CardContent>
          </Card>
          
          <Button type="submit" className="w-full" disabled={createOrderMut.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {createOrderMut.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateOS;  