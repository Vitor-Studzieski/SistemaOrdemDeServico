import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Plus, Search } from "lucide-react";

// --- NOVA ESTRUTURA DE DADOS PARA OS DOCUMENTOS ---
const allDocuments = [
  {
    title: "Planilha de Registro de Treinamento",
    category: "Procedimento",
    description: "Garante o registro de todos os treinamentos realizados.",
    version: "01/2025",
    size: "152 KB",
    fileName: "MQ01.PO1.01 Planilha de registro de treinamento.pdf",
  },
  {
    title: "Checklist de Manipuladores",
    category: "Procedimento",
    description: "Verifica a conformidade de higiene e saúde dos manipuladores.",
    version: "01/2025",
    size: "170 KB",
    fileName: "MQ01.POP.01.PL05_ Checklist_Manipuladores.pdf",
  },
  {
    title: "Relatório de Não Conformidade em Água",
    category: "Procedimento",
    description: "Documenta e gerencia não conformidades na qualidade da água.",
    version: "01/2025",
    size: "163 KB",
    fileName: "MQ01.POP.02.PL02 PLANILHA DE RELATÓRIO DE NÃO CONFORMIDADE EM ÁGUA.pdf",
  },
  {
    title: "Controle de Água de Abastecimento",
    category: "Instrução",
    description: "Instruções para controle de Cloro e Ph da água de abastecimento.",
    version: "01/2025",
    size: "158 KB",
    fileName: "MQ01.POP.02.PL03 - Controle de Água de Abastecimento (Cloro e Ph).pdf",
  },
  {
    title: "Controle de Visitante",
    category: "Procedimento",
    description: "Planilha para registrar a entrada e saída de visitantes.",
    version: "01/2025",
    size: "53 KB",
    fileName: "MQ01.POP01.PL11 PLANILHA DE CONTROLE DE VISITANTE.pdf",
  },
  {
    title: "Controle de Entrega de EPI e Uniforme",
    category: "Procedimento",
    description: "Gerencia a entrega e devolução de equipamentos de proteção.",
    version: "01/2025",
    size: "303 KB",
    fileName: "MQ01.POP01.PL22 - Controle de entrega e Devolução de EPI e uniforme.pdf",
  },
  {
    title: "Higienização do Reservatório de Água",
    category: "Instrução",
    description: "Planilha para controle da higienização periódica do reservatório.",
    version: "01/2025",
    size: "100 KB",
    fileName: "MQ01.POP02. PL04 PLANILHA DE HIGIENIZAÇÃO DO RESERVATÓRIO DE ÁGUA.pdf",
  },
  {
    title: "Controle de Destinação Final de Resíduos",
    category: "Procedimento",
    description: "Gerencia e documenta a destinação final de todos os resíduos.",
    version: "01/2025",
    size: "171 KB",
    fileName: "MQ01.POP04.PL06 - CONTROLE DE DESTINAÇÃO FINAL DE RESÍDUOS.pdf",
  },
  {
    title: "POP 1 - Higiene e Saúde dos Manipuladores",
    category: "Manual",
    description: "Manual de procedimento operacional padrão para higiene.",
    version: "01/2025",
    size: "1.2 MB",
    fileName: "POP 1 - Higiene e saúde dos manipuladores.pdf",
  },
  {
    title: "POP 2 - Controle de Potabilidade da Água",
    category: "Manual",
    description: "Manual de procedimento para o controle de potabilidade da água.",
    version: "01/2025",
    size: "712 KB",
    fileName: "POP 2 - Controle de potabilidade da água.pdf",
  },
];

const PopsManuais = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas as Categorias");

  const handleDownload = (fileName) => {
    const link = document.createElement("a");
    link.href = `/documents/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (fileName) => {
    window.open(`/documents/${fileName}`, "_blank");
  };

  const filteredDocuments = allDocuments
    .filter((doc) => {
      if (selectedCategory === "Todas as Categorias") return true;
      return doc.category === selectedCategory;
    })
    .filter((doc) => 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const totalCount = allDocuments.length;
  const procedimentoCount = allDocuments.filter(doc => doc.category === 'Procedimento').length;
  const manualCount = allDocuments.filter(doc => doc.category === 'Manual').length;
  const instrucaoCount = allDocuments.filter(doc => doc.category === 'Instrução').length;

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">POPs e Manuais</h1>
          <p className="text-muted-foreground">Acesse e gerencie procedimentos operacionais padrão e manuais</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Documento
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Procedimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{procedimentoCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manuais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{manualCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Instruções</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{instrucaoCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar documentos..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categorias" />
          </SelectTrigger>
          <SelectContent className="bg-white shadow-md z-50">
            <SelectItem value="Todas as Categorias">Todas as Categorias</SelectItem>
            <SelectItem value="Procedimento">Procedimento</SelectItem>
            <SelectItem value="Manual">Manual</SelectItem>
            <SelectItem value="Instrução">Instrução</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredDocuments.map((doc) => (
          <Card key={doc.fileName} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{doc.title}</CardTitle>
                <Badge className="bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100">
                  {doc.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground pt-2">{doc.description}</p>
            </CardHeader>
            <CardContent className="flex items-center justify-between mt-auto">
              <span className="text-xs text-muted-foreground">Versão: {doc.version} · {doc.size}</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleView(doc.fileName)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleDownload(doc.fileName)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
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