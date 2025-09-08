import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";
import {
    Filter,
    TrendingUp,
    Users,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Charts = () => {
    const [selectedPeriod, setSelectedPeriod] = useState("daily");
    const [selectedProcess, setSelectedProcess] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [serviceOrders, setServiceOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: orders, error } = await supabase.from("service_orders").select("*");
            if (error) throw error;
            setServiceOrders(orders || []);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar dados",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const metrics = useMemo(() => {
        if (!serviceOrders.length) return { total: 0, taxaConclusao: 0, alertasAtivos: 0 };
        const total = serviceOrders.length;
        const concluidos = serviceOrders.filter(o => o.status.toLowerCase() === "concluida").length;
        const taxaConclusao = total > 0 ? (concluidos / total) * 100 : 0;
        const alertasAtivos = serviceOrders.filter(o => o.status.toLowerCase() === "atrasada").length;
        return { total, taxaConclusao, alertasAtivos };
    }, [serviceOrders]);

    const processedData = useMemo(() => {
        if (loading || !serviceOrders.length) return {
            processoEvolution: [],
            statusDistribution: [],
            processComparison: [],
            priorityDistribution: []
        };

        // Evolução temporal
        const periodData = serviceOrders.reduce((acc: any, order) => {
            const date = parseISO(order.criado_em);
            let period: string;
            if (selectedPeriod === "daily") period = format(date, 'EEE', { locale: ptBR });
            else if (selectedPeriod === "weekly") period = `Sem ${format(date, 'w', { locale: ptBR })}`;
            else period = format(date, 'MMM', { locale: ptBR });

            if (!acc[period]) acc[period] = { concluidos: 0, pendentes: 0, atrasados: 0 };
            if (order.status === 'concluida') acc[period].concluidos++;
            else if (order.status === 'pendente') acc[period].pendentes++;
            else if (order.status === 'atrasada') acc[period].atrasados++;
            return acc;
        }, {});
        const processoEvolution = Object.entries(periodData).map(([periodo, data]: [string, any]) => ({ periodo, ...data }));

        // Distribuição de status
        const statusCount = serviceOrders.reduce((acc: any, order) => {
            const status = order.status;
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});
        const statusDistribution = [
            { name: "Concluídos", value: statusCount.concluida || 0, color: "#16a34a" },
            { name: "Pendentes", value: statusCount.pendente || 0, color: "hsl(45, 93%, 65%)" },
            { name: "Atrasados", value: statusCount.atrasada || 0, color: "hsl(var(--destructive))" }
        ];

        // Comparação entre processos
        const processCount = serviceOrders.reduce((acc: any, order) => {
            const tipo = order.tipo_os || 'Outros';
            if (!acc[tipo]) acc[tipo] = { total: 0, concluidos: 0, pendentes: 0 };
            acc[tipo].total++;
            if (order.status === 'concluida') acc[tipo].concluidos++;
            else acc[tipo].pendentes++;
            return acc;
        }, {});
        const processComparison = Object.entries(processCount).map(([processo, data]: [string, any]) => ({ processo, ...data }));

        // Distribuição de prioridade
        const priorityCount = serviceOrders.reduce((acc: any, order) => {
            const prioridade = order.prioridade || "Baixa"; // Ajuste conforme seu schema
            acc[prioridade] = (acc[prioridade] || 0) + 1;
            return acc;
        }, {});
        
        const priorityDistribution = Object.entries(priorityCount).map(([name, value]) => ({
            name,
            value,
            color: name === "critica" ? "#dc2626" : name === "alta" ? "#f59e0b" : name === "media" ? "#ffff00" : "#16a34a"
        }));

        return { processoEvolution, statusDistribution, processComparison, priorityDistribution };
    }, [serviceOrders, selectedPeriod, loading]);

    const filteredData = useMemo(() => {
        if (loading) return { ...processedData };
        let filtered = JSON.parse(JSON.stringify(processedData));

        // Filtros
        if (selectedStatus !== "all") {
            const statusMap: { [key: string]: string } = {
                "completed": "Concluídos",
                "pending": "Pendentes",
                "delayed": "Atrasados"
            };
            const selectedStatusName = statusMap[selectedStatus];
            if (selectedStatusName) {
                filtered.statusDistribution = filtered.statusDistribution.filter(i => i.name === selectedStatusName);
                filtered.processoEvolution = filtered.processoEvolution.map(item => ({
                    periodo: item.periodo,
                    concluidos: selectedStatus === "completed" ? item.concluidos : 0,
                    pendentes: selectedStatus === "pending" ? item.pendentes : 0,
                    atrasados: selectedStatus === "delayed" ? item.atrasados : 0
                }));
            }
        }
        return filtered;
    }, [processedData, selectedStatus, loading]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-3 border border-border rounded-lg shadow-lg bg-white">
                    <p className="font-semibold text-card-foreground">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
                            {`${entry.dataKey}: ${entry.value}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-6 bg-background min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Painel de Gráficos</h1>
                <p className="text-muted-foreground">Monitoramento visual dos processos</p>
            </div>

            {/* Filtros */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filtros
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Período</label>
                            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o período" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="daily">Diário</SelectItem>
                                    <SelectItem value="weekly">Semanal</SelectItem>
                                    <SelectItem value="monthly">Mensal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                   

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Status</label>
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="all">Todos os Status</SelectItem>
                                    <SelectItem value="completed">Concluído</SelectItem>
                                    <SelectItem value="pending">Pendente</SelectItem>
                                    <SelectItem value="delayed">Atrasado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Grid de Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Evolução Temporal */}
                <Card className="card-shadow">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Evolução dos Processos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={filteredData.processoEvolution}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="periodo" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="concluidos" stroke="#16a34a" strokeWidth={2} name="Concluídos" />
                                <Line type="monotone" dataKey="pendentes" stroke="hsl(45, 93%, 65%)" strokeWidth={2} name="Pendentes" />
                                <Line type="monotone" dataKey="atrasados" stroke="hsl(var(--destructive))" strokeWidth={2} name="Atrasados" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Distribuição de Status */}
                <Card className="card-shadow">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            Distribuição por Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <ResponsiveContainer width={250} height={250}>
                                <PieChart>
                                    <Pie
                                        data={filteredData.statusDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {filteredData.statusDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="space-y-3">
                                {filteredData.statusDistribution.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                                        <div>
                                            <p className="font-medium text-foreground">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">{item.value} processos</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Comparação entre Processos */}
                <Card className="card-shadow">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            Comparação entre Processos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={filteredData.processComparison}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis dataKey="processo" stroke="hsl(var(--muted-foreground))" fontSize={12} angle={-45} textAnchor="end" height={60} />
                                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar dataKey="concluidos" fill="#16a34a" name="Concluídos" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="pendentes" fill="hsl(45, 93%, 65%)" name="Pendentes" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Prioridade das Ordens */}
                {/* Prioridade das Ordens */}
                <Card className="card-shadow">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-primary" />
                            Prioridade das Ordens
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <ResponsiveContainer width={250} height={250}>
                                <PieChart>
                                    <Pie
                                        data={processedData.priorityDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {processedData.priorityDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="space-y-3">
                                {processedData.priorityDistribution.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <div>
                                            <p className="font-medium text-foreground">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">{item.value} ordens</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>


            </div>

            {/* Resumo de Indicadores */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <Card className="card-shadow">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total de Processos</p>
                        <p className="text-2xl font-bold text-foreground">{metrics.total}</p>
                    </CardContent>
                </Card>
                <Card className="card-shadow">
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                        <p className="text-2xl font-bold text-foreground">{metrics.taxaConclusao.toFixed(1)}%</p>
                    </CardContent>
                </Card>
                <Card className="card-shadow">
                    <CardContent className="p-4 flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">Alerta</p>
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                        <p className="text-2xl font-bold text-foreground">{metrics.alertasAtivos}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Charts;
