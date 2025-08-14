import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Eye, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const allDocuments = [
  {
    id: "pop3",
    code: "POP 3",
    title: "HIGIENIZAÇÃO DOS EQUIPAMENTOS, UTENSILIOS E INSTALAÇÃO",
    description: "Garantir a higienização das instalações, equipamentos, móveis e utensílios, visando diminuir a carga microbiana a níveis aceitáveis.",
    version: "001/2025",
    fileSize: "1.1 MB",
    type: "Procedimento",
    url: "/documents/POP_3_-_Higienização_dos_Equipamentos,_Utensílios_e_Instalações[1].pdf"
  },
  {
    id: "pop5",
    code: "POP 5",
    title: "MANUTENÇÃO PREVENTIVA E CALIBRAÇÃO DOS EQUIPAMENTOS",
    description: "Garantir o correto funcionamento dos equipamentos e a leitura dos dados para produzir alimentos de qualidade.",
    version: "001/2025",
    fileSize: "1.6 MB",
    type: "Procedimento",
    url: "/documents/POP_5_-_Manutencao_preventiva_e_calibracao_dos_equipamentos[1].pdf"
  },
  {
    id: "pop7",
    code: "POP 7",
    title: "SELEÇÃO DE MATERIAS PRIMAS INGREDIENTES E EMBALAGENS",
    description: "Garantir a correta seleção de fornecedores, recepção e armazenamento de matérias-primas e embalagens, evitando risco de contaminação.",
    version: "001/2025",
    fileSize: "2.3 MB",
    type: "Procedimento",
    url: "/documents/POP_7_-_Selecao_de_materias_primas_ingredientes_e_embalagens[1].pdf"
  },
  {
    id: "pop10",
    code: "POP 10",
    title: "RECEBIMENTO DE MATÉRIA-PRIMA, INSUMOS",
    description: "Estabelecer procedimentos a serem adotados para o recebimento de matéria-prima e insumos em toda a área industrial.",
    version: "001/2025",
    fileSize: "1.8 MB",
    type: "Procedimento",
    url: "/documents/POP_10_-_Recebimento_de_Matéria-Prima,_Insumos[1].pdf"
  },
];

const PopsManuais = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("todos");

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  const handleView = (url) => {
    window.open(url, '_blank');
  };

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || doc.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "todos" || doc.type === filterType;
    return matchesSearch && matchesType;
  });

  const renderStatsCard = (title, value) => (
    <Card className="flex-1 min-w-[150px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  const stats = {
    total: allDocuments.length,
    procedimentos: allDocuments.filter(doc => doc.type === 'Procedimento').length,
    manuais: allDocuments.filter(doc => doc.type === 'Manual').length,
    instrucoes: allDocuments.filter(doc => doc.type === 'Instrução').length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">POPs e Manuais</h1>
          <p className="text-sm text-gray-600">Acesse e gerencie procedimentos operacionais padrão e manuais</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" /> Novo Documento
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {renderStatsCard("Total", stats.total)}
        {renderStatsCard("Procedimentos", stats.procedimentos)}
        {renderStatsCard("Manuais", stats.manuais)}
        {renderStatsCard("Instruções", stats.instrucoes)}
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="todos">Todas as Categorias</option>
                <option value="Procedimento">Procedimento</option>
                <option value="Manual">Manual</option>
                <option value="Instrução">Instrução</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {filteredDocuments.map(doc => (
          <Card key={doc.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {doc.code} - {doc.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="mr-2">Versão: {doc.version}</span>
                    <span>{doc.fileSize}</span>
                  </div>
                </div>
                <Badge className="ml-4 text-xs">{doc.type}</Badge>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleView(doc.url)}
                >
                  <Eye className="w-4 h-4 mr-2" /> Visualizar
                </Button>
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleDownload(doc.url)}
                >
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PopsManuais;