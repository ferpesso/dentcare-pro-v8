import { StatCard } from "@/components/ui/card-modern";
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Clock,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Home() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, {user?.name || "Dr. Ricardo"}</h1>
        <p className="text-muted-foreground">Aqui está o resumo da sua clínica para hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Utentes" 
          value="1,284" 
          icon={Users} 
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Consultas Hoje" 
          value="12" 
          icon={Calendar} 
          color="purple"
        />
        <StatCard 
          title="Faturação Mês" 
          value="14.250€" 
          icon={DollarSign} 
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard 
          title="Taxa de Ocupação" 
          value="85%" 
          icon={TrendingUp} 
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 hover-lift">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Próximas Consultas</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setLocation("/agenda")}>
              Ver Agenda <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { nome: "Ana Martins", hora: "14:30", procedimento: "Limpeza", status: "Confirmado" },
                { nome: "Carlos Rocha", hora: "15:15", procedimento: "Restauração", status: "Em espera" },
                { nome: "Sofia Oliveira", hora: "16:00", procedimento: "Avaliação", status: "Agendado" },
              ].map((consulta, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{consulta.nome}</p>
                      <p className="text-xs text-muted-foreground">{consulta.procedimento} • {consulta.hora}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    consulta.status === 'Confirmado' ? 'bg-green-100 text-green-700' : 
                    consulta.status === 'Em espera' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {consulta.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { acao: "Novo Utente", desc: "Maria Silva registada", tempo: "há 10 min" },
                { acao: "Pagamento", desc: "Fatura #8812 liquidada", tempo: "há 45 min" },
                { acao: "IA", desc: "Análise de Raio-X concluída", tempo: "há 2 horas" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{item.acao}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{item.tempo}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
