import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Settings, Plus, Edit, Trash2, AlertTriangle, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Parameters = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState<any>(null);

  // Mock data - em produção viria do backend
  const [parametros, setParametros] = useState([
    {
      id: 1,
      nome: "Temperatura Ambiente",
      unidade: "°C",
      minimo: 18,
      maximo: 25,
      setor: "Produção A",
      ativo: true,
      alertas: true,
      emails: ["supervisor@empresa.com", "qualidade@empresa.com"]
    },
    {
      id: 2,
      nome: "Umidade Relativa",
      unidade: "%",
      minimo: 60,
      maximo: 80,
      setor: "Produção A",
      ativo: true,
      alertas: true,
      emails: ["operador@empresa.com"]
    },
    {
      id: 3,
      nome: "Temperatura Câmara Fria",
      unidade: "°C",
      minimo: 2,
      maximo: 6,
      setor: "Estoque",
      ativo: true,
      alertas: true,
      emails: ["estoque@empresa.com", "qualidade@empresa.com"]
    },
    {
      id: 4,
      nome: "pH do Produto",
      unidade: "pH",
      minimo: 6.0,
      maximo: 7.0,
      setor: "Laboratório",
      ativo: true,
      alertas: true,
      emails: ["lab@empresa.com"]
    }
  ]);

  const [novoParametro, setNovoParametro] = useState({
    nome: "",
    unidade: "",
    minimo: "",
    maximo: "",
    setor: "",
    ativo: true,
    alertas: true,
    emails: []
  });

  const handleEditParameter = (parametro: any) => {
    setSelectedParameter(parametro);
    setIsEditing(true);
  };

  const handleSaveParameter = () => {
    if (selectedParameter) {
      setParametros(parametros.map(p => 
        p.id === selectedParameter.id ? selectedParameter : p
      ));
      toast({
        title: "Sucesso!",
        description: "Parâmetro atualizado com sucesso.",
      });
    }
    setIsEditing(false);
    setSelectedParameter(null);
  };

  const handleDeleteParameter = (id: number) => {
    setParametros(parametros.filter(p => p.id !== id));
    toast({
      title: "Parâmetro removido",
      description: "O parâmetro foi removido com sucesso.",
    });
  };

  const handleAddParameter = () => {
    // Validação dos campos obrigatórios
    if (!novoParametro.nome.trim()) {
      toast({
        title: "Erro",
        description: "O nome do parâmetro é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    if (!novoParametro.unidade.trim()) {
      toast({
        title: "Erro",
        description: "A unidade de medida é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    if (!novoParametro.setor) {
      toast({
        title: "Erro",
        description: "Selecione um setor.",
        variant: "destructive",
      });
      return;
    }

    if (!novoParametro.minimo || !novoParametro.maximo) {
      toast({
        title: "Erro",
        description: "Defina os valores mínimo e máximo.",
        variant: "destructive",
      });
      return;
    }

    const minimoNum = parseFloat(novoParametro.minimo);
    const maximoNum = parseFloat(novoParametro.maximo);

    if (isNaN(minimoNum) || isNaN(maximoNum)) {
      toast({
        title: "Erro",
        description: "Os valores mínimo e máximo devem ser números válidos.",
        variant: "destructive",
      });
      return;
    }

    if (minimoNum >= maximoNum) {
      toast({
        title: "Erro",
        description: "O valor mínimo deve ser menor que o valor máximo.",
        variant: "destructive",
      });
      return;
    }

    // Criar novo parâmetro
    const newId = parametros.length > 0 ? Math.max(...parametros.map(p => p.id)) + 1 : 1;
    const novoParametroCompleto = {
      id: newId,
      nome: novoParametro.nome.trim(),
      unidade: novoParametro.unidade.trim(),
      minimo: minimoNum,
      maximo: maximoNum,
      setor: novoParametro.setor,
      ativo: novoParametro.ativo,
      alertas: novoParametro.alertas,
      emails: []
    };

    // Adicionar à lista
    setParametros([...parametros, novoParametroCompleto]);

    // Limpar formulário
    setNovoParametro({
      nome: "",
      unidade: "",
      minimo: "",
      maximo: "",
      setor: "",
      ativo: true,
      alertas: true,
      emails: []
    });

    toast({
      title: "Sucesso!",
      description: `Parâmetro "${novoParametroCompleto.nome}" adicionado com sucesso.`,
    });
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
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configuração de Parâmetros</h1>
              <p className="text-sm text-gray-600">Gerencie os parâmetros críticos e configure alertas</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Parâmetros */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Parâmetros Configurados</CardTitle>
                <CardDescription>Lista de todos os parâmetros críticos monitorados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parametros.map((parametro) => (
                    <div key={parametro.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-gray-900">{parametro.nome}</h3>
                          <Badge variant={parametro.ativo ? "default" : "secondary"}>
                            {parametro.ativo ? "Ativo" : "Inativo"}
                          </Badge>
                          {parametro.alertas && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Alertas
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Setor:</strong> {parametro.setor}</p>
                          <p><strong>Limites:</strong> {parametro.minimo} - {parametro.maximo} {parametro.unidade}</p>
                          <p><strong>E-mails:</strong> {parametro.emails.length > 0 ? parametro.emails.join(", ") : "Nenhum configurado"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditParameter(parametro)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteParameter(parametro.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulário */}
          <div className="space-y-6">
            {!isEditing ? (
              /* Adicionar Novo Parâmetro */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Novo Parâmetro
                  </CardTitle>
                  <CardDescription>Adicione um novo parâmetro crítico para monitoramento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Parâmetro *</Label>
                    <Input
                      id="nome"
                      placeholder="Ex: Temperatura Ambiente"
                      value={novoParametro.nome}
                      onChange={(e) => setNovoParametro({...novoParametro, nome: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minimo">Valor Mínimo *</Label>
                      <Input
                        id="minimo"
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={novoParametro.minimo}
                        onChange={(e) => setNovoParametro({...novoParametro, minimo: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maximo">Valor Máximo *</Label>
                      <Input
                        id="maximo"
                        type="number"
                        step="0.01"
                        placeholder="100"
                        value={novoParametro.maximo}
                        onChange={(e) => setNovoParametro({...novoParametro, maximo: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unidade">Unidade de Medida *</Label>
                    <Input
                      id="unidade"
                      placeholder="Ex: °C, %, pH"
                      value={novoParametro.unidade}
                      onChange={(e) => setNovoParametro({...novoParametro, unidade: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="setor">Setor *</Label>
                    <Select value={novoParametro.setor} onValueChange={(value) => setNovoParametro({...novoParametro, setor: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Produção A">Produção A</SelectItem>
                        <SelectItem value="Produção B">Produção B</SelectItem>
                        <SelectItem value="Estoque">Estoque</SelectItem>
                        <SelectItem value="Laboratório">Laboratório</SelectItem>
                        <SelectItem value="Qualidade">Qualidade</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="ativo"
                        checked={novoParametro.ativo}
                        onCheckedChange={(checked) => setNovoParametro({...novoParametro, ativo: checked})}
                      />
                      <Label htmlFor="ativo">Parâmetro Ativo</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="alertas"
                        checked={novoParametro.alertas}
                        onCheckedChange={(checked) => setNovoParametro({...novoParametro, alertas: checked})}
                      />
                      <Label htmlFor="alertas">Enviar Alertas</Label>
                    </div>
                  </div>

                  <Button onClick={handleAddParameter} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Parâmetro
                  </Button>
                </CardContent>
              </Card>
            ) : (
              /* Editar Parâmetro */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Editar Parâmetro
                  </CardTitle>
                  <CardDescription>Modifique as configurações do parâmetro selecionado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedParameter && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="edit-nome">Nome do Parâmetro</Label>
                        <Input
                          id="edit-nome"
                          value={selectedParameter.nome}
                          onChange={(e) => setSelectedParameter({...selectedParameter, nome: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-minimo">Valor Mínimo</Label>
                          <Input
                            id="edit-minimo"
                            type="number"
                            value={selectedParameter.minimo}
                            onChange={(e) => setSelectedParameter({...selectedParameter, minimo: parseFloat(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-maximo">Valor Máximo</Label>
                          <Input
                            id="edit-maximo"
                            type="number"
                            value={selectedParameter.maximo}
                            onChange={(e) => setSelectedParameter({...selectedParameter, maximo: parseFloat(e.target.value)})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-unidade">Unidade de Medida</Label>
                        <Input
                          id="edit-unidade"
                          value={selectedParameter.unidade}
                          onChange={(e) => setSelectedParameter({...selectedParameter, unidade: e.target.value})}
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="edit-ativo"
                            checked={selectedParameter.ativo}
                            onCheckedChange={(checked) => setSelectedParameter({...selectedParameter, ativo: checked})}
                          />
                          <Label htmlFor="edit-ativo">Parâmetro Ativo</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="edit-alertas"
                            checked={selectedParameter.alertas}
                            onCheckedChange={(checked) => setSelectedParameter({...selectedParameter, alertas: checked})}
                          />
                          <Label htmlFor="edit-alertas">Enviar Alertas</Label>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleSaveParameter} className="flex-1 bg-green-600 hover:bg-green-700">
                          <Save className="w-4 h-4 mr-2" />
                          Salvar
                        </Button>
                        <Button variant="outline" onClick={() => {setIsEditing(false); setSelectedParameter(null);}}>
                          Cancelar
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Configurações de Alertas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Configurações de Alertas
                </CardTitle>
                <CardDescription>Configure como e quando os alertas devem ser enviados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emails-globais">E-mails Globais para Alertas</Label>
                  <Input
                    id="emails-globais"
                    placeholder="email1@empresa.com, email2@empresa.com"
                  />
                  <p className="text-xs text-gray-500">Separe múltiplos e-mails com vírgula</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequencia-alertas">Frequência de Alertas</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a frequência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="imediato">Imediato</SelectItem>
                      <SelectItem value="5min">A cada 5 minutos</SelectItem>
                      <SelectItem value="15min">A cada 15 minutos</SelectItem>
                      <SelectItem value="30min">A cada 30 minutos</SelectItem>
                      <SelectItem value="1h">A cada 1 hora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Parameters;
