import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  TrendingUp,
  BarChart3,
  Settings,
  FileText as FilePlus
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Mock data - baseado na imagem
  const stats = {
    osTotal: 156,
    osConcluidas: 12,
    osPendentes: 8,
    osAtrasadas: 3,
    alertasCriticos: 1,
    conformidade: 94.2
  };

  const atividadeRecente = [
    { 
      id: 1, 
      titulo: "Controle de Umidade - Sala Limpa A", 
      responsavel: "Atribuída para João Silva",
      data: "14/07/2025 - Pendente",
      status: "pendente" 
    },
    { 
      id: 2, 
      titulo: "Verificação de Temperatura - Sistema HVAC", 
      responsavel: "Atribuída para João Silva",
      data: "14/07/2025 - Concluída",
      status: "concluida" 
    },
    { 
      id: 3, 
      titulo: "Inspeção Semanal de Equipamentos", 
      responsavel: "Atribuída para João Silva",
      data: "14/07/2025 - Atrasada",
      status: "atrasada" 
    }
  ];

  const alertasRecentes = [
    {
      id: 1,
      titulo: "Pressão Diferencial Crítica",
      descricao: "Pressão diferencial abaixo do limite mínimo (8.2 Pa < 10 Pa)",
      data: "23/07/2025 às 14:31:20",
      tipo: "critico"
    },
    {
      id: 2,
      titulo: "Tarefa em Atraso",
      descricao: "Inspeção Semanal de Equipamentos está 12 horas em atraso",
      data: "24/07/2025 às 08:41:38",
      tipo: "atraso"
    },
    {
      id: 3,
      titulo: "Umidade Acima do Limite",
      descricao: "Umidade relativa acima do limite máximo (63.2% > 60%)",
      data: "25/07/2025 às 03:51:08",
      tipo: "alerta"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluida': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'pendente': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'atrasada': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'critico': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'atraso': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'alerta': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600">Visão geral das operações e indicadores</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <Card className="bg-white">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Total de OS</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.osTotal}</div>
            <p className="text-xs text-emerald-600 mt-1">+12% vs. mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Concluídas Hoje</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.osConcluidas}</div>
            <p className="text-xs text-emerald-600 mt-1">+8% vs. mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.osPendentes}</div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Em Atraso</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.osAtrasadas}</div>
            <p className="text-xs text-red-600 mt-1">+25% vs. mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Alertas Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.alertasCriticos}</div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Taxa de Conformidade</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{stats.conformidade}%</div>
            <p className="text-xs text-emerald-600 mt-1">+2.1% vs. mês anterior</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Atividade Recente */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {atividadeRecente.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  {getStatusIcon(item.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{item.titulo}</p>
                    <p className="text-xs text-slate-600">{item.responsavel}</p>
                    <p className="text-xs text-slate-500">{item.data}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas Recentes */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Alertas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alertasRecentes.map((alerta) => (
                <div key={alerta.id} className="flex items-start gap-3">
                  {getAlertIcon(alerta.tipo)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{alerta.titulo}</p>
                    <p className="text-xs text-slate-600">{alerta.descricao}</p>
                    <p className="text-xs text-slate-500">{alerta.data}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Link to="/create-os">
                <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer bg-slate-50">
                  <FilePlus className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                  <p className="text-sm font-medium text-slate-900">Nova OS</p>
                  <p className="text-xs text-slate-600">Criar ordem de serviço</p>
                </Card>
              </Link>
              
              <Link to="/parameters">
                <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer bg-slate-50">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-sm font-medium text-slate-900">Registrar Parâmetro</p>
                  <p className="text-xs text-slate-600">Inserir valores monitorados</p>
                </Card>
              </Link>
              
              <Link to="/reports">
                <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer bg-slate-50">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium text-slate-900">Gerar Relatório</p>
                  <p className="text-xs text-slate-600">Relatório consolidado</p>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;