import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Clock, 
  BarChart3, 
  AlertTriangle,
  Download,
  FileText,
  FileSpreadsheet
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const Indicators = () => {
  // Dados dos cards principais
  const mainMetrics = [
    {
      title: "Taxa de Conformidade",
      value: "94.2%",
      change: "+2.1% vs. mês anterior",
      icon: TrendingUp,
      positive: true
    },
    {
      title: "Tempo Médio Resolução",
      value: "2.4h",
      change: "+3min vs. mês anterior",
      icon: Clock,
      positive: false
    },
    {
      title: "Eficiência Operacional", 
      value: "87.5%",
      change: "+2.4% vs. mês anterior",
      icon: BarChart3,
      positive: true
    },
    {
      title: "Alertas Mensais",
      value: "48",
      change: "+12% vs. mês anterior",
      icon: AlertTriangle,
      positive: false
    }
  ];

  // Dados do gráfico de conformidade por mês
  const conformidadeData = [
    { mes: "Jan", valor: 94.2 },
    { mes: "Fev", valor: 96.1 },
    { mes: "Mar", valor: 92.8 },
    { mes: "Abr", valor: 95.5 },
    { mes: "Mai", valor: 97.2 },
    { mes: "Jun", valor: 93.9 }
  ];

  // Dados do gráfico de pizza - Distribuição de Tarefas
  const tarefasData = [
    { name: "Concluídas", value: 67, color: "#10b981" },
    { name: "Pendentes", value: 8, color: "#f59e0b" },
    { name: "Atrasadas", value: 3, color: "#ef4444" },
    { name: "Em Andamento", value: 12, color: "#3b82f6" }
  ];

  // Dados das tendências de alertas
  const tendenciasAlertas = [
    {
      title: "Parâmetros Críticos",
      value: "15",
      change: "-12% vs. mês anterior",
      positive: true
    },
    {
      title: "Tarefas Atrasadas",
      value: "8", 
      change: "-25% vs. mês anterior",
      positive: true
    },
    {
      title: "Não Conformidades",
      value: "3",
      change: "-66% vs. mês anterior", 
      positive: true
    },
    {
      title: "Alertas Sistema",
      value: "22",
      change: "+18% vs. mês anterior",
      positive: false
    }
  ];

  const exportOptions = [
    {
      name: "Power BI",
      description: "Exportar para Power BI",
      icon: BarChart3
    },
    {
      name: "Excel", 
      description: "Baixar como planilha",
      icon: FileSpreadsheet
    },
    {
      name: "CSV",
      description: "Dados em formato CSV", 
      icon: FileText
    }
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Indicadores</h1>
        <p className="text-sm text-slate-600">Visualize métricas e tendências das operações</p>
      </div>

      {/* Cards de métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {mainMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="bg-white">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-slate-600">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
                <p className={`text-xs mt-1 ${metric.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Taxa de Conformidade por Mês */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Taxa de Conformidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conformidadeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 w-8">{item.mes}</span>
                  <div className="flex-1 mx-4">
                    <Progress value={item.valor} className="h-2" />
                  </div>
                  <span className="text-sm font-medium text-slate-900 w-12 text-right">{item.valor}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Distribuição de Tarefas */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Distribuição de Tarefas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tarefasData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {tarefasData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex-1 ml-6">
                <div className="space-y-2">
                  {tarefasData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-slate-600 flex-1">{item.name}</span>
                      <span className="text-sm font-medium text-slate-900">{item.value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900">110</div>
                    <div className="text-sm text-slate-600">Total de Tarefas</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tendências de Alertas */}
      <Card className="bg-white mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Tendências de Alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tendenciasAlertas.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                <div className="text-sm text-slate-600 mb-1">{item.title}</div>
                <div className={`text-xs ${item.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exportar Dados */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Exportar Dados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exportOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Button 
                  key={index}
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Icon className="h-6 w-6 text-slate-600" />
                  <div className="text-center">
                    <div className="font-medium text-slate-900">{option.name}</div>
                    <div className="text-xs text-slate-600">{option.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Indicators;