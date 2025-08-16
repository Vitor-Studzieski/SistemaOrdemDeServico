import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, FileText, Download, Printer, Calendar as CalendarIcon, Eye, TrendingUp, AlertTriangle, Trash } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Reports = () => {
  const [mesAno, setMesAno] = useState(new Date());
  const [setor, setSetor] = useState("Todos os Setores");
  const [tipoRelatorio, setTipoRelatorio] = useState("completo");
  const [visualizingReport, setVisualizingReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dados = {
    osExecutadas: 38,
    osTotal: 42,
    conformidade: 90.5,
    naoConformidades: 4,
    setoresMonitorados: 5,
    parametrosVerificados: 156,
    alertasGerados: 12,
    tempoMedioExecucao: "2.3 dias"
  };

  const naoConformidadesPorSetor = [
    { setor: "Produção A", total: 2, criticas: 1, menores: 1 },
    { setor: "Estoque", total: 1, criticas: 0, menores: 1 },
    { setor: "Laboratório", total: 1, criticas: 1, menores: 0 }
  ];

  const { data: relatoriosGerados = [], isLoading, error: fetchError } = useQuery({
    queryKey: ["reports_history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports_history")
        .select("*")
        .order("data_geracao", { ascending: false });
      if (error) {
        console.error("Erro ao buscar relatórios:", error);
        return [];
      }
      return data;
    },
  });

  const queryClient = useQueryClient();
  
  const generateReportMut = useMutation({
    mutationFn: async (newReport) => {
      const { data, error } = await supabase
        .from("reports_history")
        .insert([newReport])
        .select();
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports_history"] });
      toast({
        title: "Relatório Gerado!",
        description: `O relatório para ${format(mesAno, "MMMM/yyyy", { locale: ptBR })} foi salvo no histórico.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao gerar relatório",
        description: `Ocorreu um erro: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteReportMut = useMutation({
    mutationFn: async (relatorioId) => {
      const { error } = await supabase
        .from("reports_history")
        .delete()
        .eq("id", relatorioId);
      if (error) {
        throw error;
      }
      return relatorioId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports_history"] });
      toast({
        title: "Relatório excluído!",
        description: "O relatório foi removido do histórico com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir relatório",
        description: `Ocorreu um erro: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleGerarRelatorio = () => {
    const newReport = {
      periodo: format(mesAno, "MMMM/yyyy", { locale: ptBR }),
      setor: setor,
      tipo: tipoRelatorio,
      osTotal: dados.osTotal,
      osCompletas: dados.osExecutadas,
      naoConformidades: dados.naoConformidades,
      conformidade: dados.conformidade,
    };
    generateReportMut.mutate(newReport);
  };

  const handleView = (relatorio) => {
    setVisualizingReport(relatorio);
    setIsModalOpen(true);
  };

  const handleDelete = (relatorioId) => {
    deleteReportMut.mutate(relatorioId);
  };

  // Função de download do PDF com placeholder
  const downloadPDF = (relatorio) => {
    toast({
      title: "Recurso em desenvolvimento",
      description: "A funcionalidade de download de PDF está sendo implementada.",
      variant: "destructive",
    });
  };

  const handlePrint = (relatorioId) => {
    toast({
      title: "Impressão iniciada",
      description: "O relatório está sendo enviado para impressão.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Relatórios Consolidados</h1>
              <p className="text-sm text-gray-600">Gere e visualize relatórios mensais de conformidade</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Gerador de Relatórios */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Gerar Novo Relatório</CardTitle>
              <CardDescription>Configure e gere um novo relatório mensal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Período</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !mesAno && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {mesAno ? format(mesAno, "MMMM/yyyy", { locale: ptBR }) : "Selecionar período"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={mesAno}
                      onSelect={setMesAno}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Setor</label>
                <Input 
                  value={setor} 
                  onChange={(e) => setSetor(e.target.value)} 
                  placeholder="Digite o setor" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Relatório</label>
                <Select value={tipoRelatorio} onValueChange={setTipoRelatorio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completo">Relatório Completo</SelectItem>
                    <SelectItem value="resumido">Relatório Resumido</SelectItem>
                    <SelectItem value="nao-conformidades">Apenas Não-Conformidades</SelectItem>
                    <SelectItem value="parametros">Parâmetros Críticos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGerarRelatorio} className="w-full bg-blue-600 hover:bg-blue-700">
                <FileText className="w-4 h-4 mr-2" />
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>

          {/* Resumo Executivo */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Resumo Executivo - Junho/2025
              </CardTitle>
              <CardDescription>Principais indicadores de desempenho do período</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">{dados.osExecutadas}/{dados.osTotal}</div>
                  <div className="text-sm text-blue-700">OS Executadas</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600">{dados.conformidade}%</div>
                  <div className="text-sm text-green-700">Conformidade</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-2xl font-bold text-red-600">{dados.naoConformidades}</div>
                  <div className="text-sm text-red-700">Não-Conformidades</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600">{dados.alertasGerados}</div>
                  <div className="text-sm text-orange-700">Alertas Gerados</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Estatísticas Gerais</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Setores Monitorados:</span>
                      <span className="font-medium">{dados.setoresMonitorados}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parâmetros Verificados:</span>
                      <span className="font-medium">{dados.parametrosVerificados}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tempo Médio de Execução:</span>
                      <span className="font-medium">{dados.tempoMedioExecucao}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Não-Conformidades por Setor</h4>
                  <div className="space-y-2">
                    {naoConformidadesPorSetor.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{item.setor}:</span>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            {item.criticas} crítica(s)
                          </Badge>
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            {item.menores} menor(es)
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Relatórios */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Relatórios</CardTitle>
            <CardDescription>Relatórios gerados anteriormente disponíveis para download</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatoriosGerados.map((relatorio) => (
                <div key={relatorio.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="font-medium text-gray-900">{relatorio.tipo}</h3>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Concluído
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Período:</span> {relatorio.periodo}
                      </div>
                      <div>
                        <span className="font-medium">Setor:</span> {relatorio.setor}
                      </div>
                      <div>
                        <span className="font-medium">Gerado:</span> {new Date(relatorio.data_geracao).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <span className="font-medium">Conformidade:</span> {relatorio.conformidade}%
                      </div>
                    </div>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>OS Total: {relatorio.osTotal}</span>
                      <span>OS Completas: {relatorio.osCompletas}</span>
                      <span>Não-Conformidades: {relatorio.naoConformidades}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button variant="outline" size="sm" onClick={() => handleView(relatorio)}>
                      <Eye className="w-4 h-4 mr-1" />
                      Visualizar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => downloadPDF(relatorio)}>
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(relatorio.id)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Relatório para Auditoria</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Para processos de certificação, recomendamos gerar o "Relatório Completo" incluindo todos os setores. 
                    Este relatório atende aos requisitos da Consultoria Hygie para auditoria e assinatura.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] p-6">
          <DialogHeader>
            <DialogTitle>Visualizar Relatório</DialogTitle>
            <DialogDescription>
              Detalhes do relatório gerado.
            </DialogDescription>
          </DialogHeader>
          {visualizingReport && (
            <div className="space-y-4 text-sm mt-4">
              <div className="grid grid-cols-2 gap-2">
                <p><strong>Período:</strong> {visualizingReport.periodo}</p>
                <p><strong>Setor:</strong> {visualizingReport.setor}</p>
                <p><strong>Tipo:</strong> {visualizingReport.tipo}</p>
                <p><strong>Gerado em:</strong> {new Date(visualizingReport.data_geracao).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <div className="font-bold">{visualizingReport.osTotal}</div>
                  <div className="text-xs text-blue-700">OS Totais</div>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <div className="font-bold">{visualizingReport.osCompletas}</div>
                  <div className="text-xs text-green-700">OS Concluídas</div>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                  <div className="font-bold">{visualizingReport.naoConformidades}</div>
                  <div className="text-xs text-red-700">Não-Conformidades</div>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <div className="font-bold">{visualizingReport.conformidade}%</div>
                  <div className="text-xs text-green-700">Conformidade</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
