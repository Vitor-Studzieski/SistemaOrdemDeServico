
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Save, Plus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CreateOS = () => {
const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [setor, setSetor] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [prazo, setPrazo] = useState<Date>();
  const [recorrente, setRecorrente] = useState(false);
  const [frequencia, setFrequencia] = useState("");
  const [parametros, setParametros] = useState([{ nome: "", min: "", max: "", unidade: "" }]);
  const navigate = useNavigate();

  const handleAddParametro = () => {
    setParametros([...parametros, { nome: "", min: "", max: "", unidade: "" }]);
  };

  const handleParametroChange = (index: number, field: string, value: string) => {
    const newParametros = [...parametros];
    newParametros[index] = { ...newParametros[index], [field]: value };
    setParametros(newParametros);
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !responsavel || !setor || !prioridade) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const { data: ordem, error } = await supabase
      .from('service_orders')
      .insert({
        titulo,
        descricao,
        responsavel,
        setor,
        prioridade,
        prazo: prazo ? format(prazo, 'yyyy-MM-dd') : null,
        recorrente,
        frequencia: recorrente ? frequencia : null,
        status: 'pendente'
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
      return;
    }

    const paramsToSave = parametros
      .filter(p => p.nome)
      .map(p => ({
        order_id: ordem.id,
        nome: p.nome,
        unidade: p.unidade || null,
        valor_minimo: p.min ? Number(p.min) : null,
        valor_maximo: p.max ? Number(p.max) : null,
      }));

    if (paramsToSave.length) {
      const { error: pErr } = await supabase.from('service_order_parameters').insert(paramsToSave);
      if (pErr) {
        toast({ title: 'Aviso', description: 'OS criada, mas houve erro ao salvar parâmetros.', variant: 'destructive' });
      }
    }

    toast({ title: 'Sucesso!', description: 'Ordem de Serviço criada com sucesso.' });
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nova Ordem de Serviço</h1>
            <p className="text-sm text-gray-600">Crie uma nova OS ou configure uma tarefa recorrente</p>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Defina as informações principais da ordem de serviço</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título da OS *</Label>
                  <Input
                    id="titulo"
                    placeholder="Ex: Controle de Temperatura Diário"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="setor">Setor *</Label>
<Select value={setor} onValueChange={setSetor} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Produção A">Produção A</SelectItem>
                      <SelectItem value="Produção B">Produção B</SelectItem>
                      <SelectItem value="Estoque">Estoque</SelectItem>
                      <SelectItem value="Laboratório">Laboratório</SelectItem>
                      <SelectItem value="Qualidade">Qualidade</SelectItem>
                      <SelectItem value="Expedição">Expedição</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva detalhadamente a tarefa a ser executada..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="responsavel">Responsável *</Label>
<Select value={responsavel} onValueChange={setResponsavel} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="João Silva">João Silva</SelectItem>
                      <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                      <SelectItem value="Pedro Lima">Pedro Lima</SelectItem>
                      <SelectItem value="Ana Costa">Ana Costa</SelectItem>
                      <SelectItem value="Carlos Oliveira">Carlos Oliveira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade *</Label>
                  <Select value={prioridade} onValueChange={setPrioridade} required>
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
                  <Label>Prazo</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !prazo && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {prazo ? format(prazo, "PPP", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={prazo}
                        onSelect={setPrazo}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuração de Recorrência */}
          <Card>
            <CardHeader>
              <CardTitle>Configuração de Recorrência</CardTitle>
              <CardDescription>Configure se esta OS deve ser executada periodicamente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="recorrente"
                  checked={recorrente}
                  onCheckedChange={setRecorrente}
                />
                <Label htmlFor="recorrente">Tarefa Recorrente</Label>
              </div>

              {recorrente && (
                <div className="space-y-2">
                  <Label htmlFor="frequencia">Frequência</Label>
                  <Select value={frequencia} onValueChange={setFrequencia}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diaria">Diária</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="quinzenal">Quinzenal</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="trimestral">Trimestral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Parâmetros de Controle */}
          <Card>
            <CardHeader>
              <CardTitle>Parâmetros de Controle</CardTitle>
              <CardDescription>Defina os parâmetros que devem ser monitorados e seus limites</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {parametros.map((parametro, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-2">
                    <Label>Nome do Parâmetro</Label>
                    <Input
                      placeholder="Ex: Temperatura"
                      value={parametro.nome}
                      onChange={(e) => handleParametroChange(index, "nome", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor Mínimo</Label>
                    <Input
                      placeholder="Ex: 15"
                      value={parametro.min}
                      onChange={(e) => handleParametroChange(index, "min", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valor Máximo</Label>
                    <Input
                      placeholder="Ex: 25"
                      value={parametro.max}
                      onChange={(e) => handleParametroChange(index, "max", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unidade</Label>
                    <Input
                      placeholder="Ex: °C"
                      value={parametro.unidade}
                      onChange={(e) => handleParametroChange(index, "unidade", e.target.value)}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={handleAddParametro}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Parâmetro
              </Button>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-end gap-4">
            <Link to="/">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Criar Ordem de Serviço
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOS;
