import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Trash2, Plus } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const EditOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    setor: "",
    responsavel: "",
    prioridade: "",
    status: "",
    prazo: "",
    parametros: [] as any[]
  });

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('service_orders')
        .select('*, service_order_parameters(*)')
        .eq('id', id)
        .maybeSingle();
      if (error) {
        toast({ title: 'Erro ao carregar OS', description: error.message, variant: 'destructive' });
        return;
      }
      if (data) {
        setFormData({
          titulo: data.titulo || '',
          descricao: data.descricao || '',
          setor: data.setor || '',
          responsavel: data.responsavel || '',
          prioridade: data.prioridade || '',
          status: data.status || 'pendente',
          prazo: data.prazo || '',
          parametros: (data.service_order_parameters || []).map((p: any) => ({
            nome: p.nome,
            min: p.valor_minimo ?? '',
            max: p.valor_maximo ?? '',
            unidade: p.unidade ?? '',
          })),
        });
      }
    };
    fetchOrder();
  }, [id]);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    const { error } = await supabase
      .from('service_orders')
      .update({
        titulo: formData.titulo,
        descricao: formData.descricao,
        setor: formData.setor,
        responsavel: formData.responsavel,
        prioridade: formData.prioridade,
        status: formData.status,
        prazo: formData.prazo,
      })
      .eq('id', id);

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
      return;
    }

    // Replace parameters: delete all and reinsert
    await supabase.from('service_order_parameters').delete().eq('order_id', id);
    const paramsToSave = (formData.parametros || [])
      .filter((p: any) => p.nome)
      .map((p: any) => ({
        order_id: id,
        nome: p.nome,
        unidade: p.unidade || null,
        valor_minimo: p.min ? Number(p.min) : null,
        valor_maximo: p.max ? Number(p.max) : null,
      }));
    if (paramsToSave.length) {
      const { error: pErr } = await supabase.from('service_order_parameters').insert(paramsToSave);
      if (pErr) {
        toast({ title: 'Aviso', description: 'OS salva, mas houve erro nos parâmetros.', variant: 'destructive' });
      }
    }

    toast({
      title: "Ordem de serviço atualizada!",
      description: "As alterações foram salvas com sucesso.",
    });
    
    navigate("/orders");
  };

const addParametro = () => {
    setFormData({
      ...formData,
      parametros: [...formData.parametros, { nome: "", min: "", max: "", unidade: "" }]
    });
  };

  const removeParametro = (index: number) => {
    setFormData({
      ...formData,
      parametros: formData.parametros.filter((_, i) => i !== index)
    });
  };

const updateParametro = (index: number, field: string, value: string | number) => {
    const newParametros: any[] = [...formData.parametros];
    newParametros[index] = { ...newParametros[index], [field]: value };
    setFormData({ ...formData, parametros: newParametros });
  };

  if (!formData.titulo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ordem não encontrada</h1>
          <Link to="/orders">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar para Ordens
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Editar Ordem de Serviço #{id}</h1>
            <p className="text-sm text-gray-600">Modifique os dados da ordem de serviço</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="setor">Setor *</Label>
                  <Select value={formData.setor} onValueChange={(value) => setFormData({ ...formData, setor: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Produção A">Produção A</SelectItem>
                      <SelectItem value="Produção B">Produção B</SelectItem>
                      <SelectItem value="Estoque">Estoque</SelectItem>
                      <SelectItem value="Laboratório">Laboratório</SelectItem>
                      <SelectItem value="Administrativo">Administrativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição *</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável *</Label>
                  <Input
                    id="responsavel"
                    value={formData.responsavel}
                    onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade *</Label>
                  <Select value={formData.prioridade} onValueChange={(value) => setFormData({ ...formData, prioridade: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="critica">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                      <SelectItem value="atrasada">Atrasada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prazo">Prazo *</Label>
                <Input
                  id="prazo"
                  type="date"
                  value={formData.prazo}
                  onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Parâmetros */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Parâmetros Monitorados</CardTitle>
                <Button type="button" variant="outline" onClick={addParametro}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Parâmetro
                </Button>
              </div>
            </CardHeader>
            <CardContent>
{formData.parametros.length > 0 ? (
                <div className="space-y-4">
                  {formData.parametros.map((param: any, index: number) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                      <div className="space-y-2">
                        <Label>Nome do Parâmetro</Label>
                        <Input
                          value={param.nome}
                          onChange={(e) => updateParametro(index, 'nome', e.target.value)}
                          placeholder="Ex: Temperatura"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Valor Mínimo</Label>
                        <Input
                          value={param.min}
                          onChange={(e) => updateParametro(index, 'min', e.target.value)}
                          placeholder="Ex: 20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Valor Máximo</Label>
                        <Input
                          value={param.max}
                          onChange={(e) => updateParametro(index, 'max', e.target.value)}
                          placeholder="Ex: 30"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unidade</Label>
                        <Input
                          value={param.unidade}
                          onChange={(e) => updateParametro(index, 'unidade', e.target.value)}
                          placeholder="Ex: °C"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Ações</Label>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeParametro(index)}
                          className="w-full"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Nenhum parâmetro adicionado. Clique em "Adicionar Parâmetro" para incluir um.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4">
            <Link to="/orders">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditOrder;