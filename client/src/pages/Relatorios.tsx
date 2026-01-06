import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, TrendingUp, Users, Calendar, DollarSign, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Relatorios() {
  const stats = [
    { title: "Novos Utentes", value: "24", change: "+12%", icon: Users, color: "text-blue-600" },
    { title: "Consultas Realizadas", value: "142", change: "+5%", icon: Calendar, color: "text-green-600" },
    { title: "Faturação Mensal", value: "12.450€", change: "+18%", icon: DollarSign, color: "text-teal-600" },
    { title: "Taxa de Conversão", value: "65%", change: "+2%", icon: TrendingUp, color: "text-purple-600" },
  ];

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <PieChart className="h-8 w-8 text-primary" />
            Relatórios e Estatísticas
          </h1>
          <p className="text-muted-foreground">Análise de desempenho da clínica e indicadores chave</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  {s.change}
                </span>
              </div>
              <div className="text-2xl font-bold">{s.value}</div>
              <p className="text-sm text-muted-foreground">{s.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Faturação por Categoria</CardTitle>
            <CardDescription>Distribuição de receitas nos últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t">
            <p className="text-muted-foreground italic">Gráfico de faturação em processamento...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ocupação da Agenda</CardTitle>
            <CardDescription>Percentagem de horários preenchidos por médico</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center border-t">
            <p className="text-muted-foreground italic">Gráfico de ocupação em processamento...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
