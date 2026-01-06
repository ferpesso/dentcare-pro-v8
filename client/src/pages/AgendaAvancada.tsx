import React, { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  useConsultasPorPeriodo, 
  useUtentes, 
  useConsultasStats,
  useCriarConsulta,
  useAtualizarConsulta,
  useRemoverConsulta
} from "@/hooks/useMockableQuery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon,
  Search,
  Filter,
  Grid3x3,
  List,
  X
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ModalNovaConsulta from "@/components/ModalNovaConsulta";
import ModalEditarConsulta from "@/components/ModalEditarConsulta";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ViewMode = "day" | "week" | "month";

interface Consulta {
  id: string;
  utenteId: string;
  medicoId: string | null;
  dataHora: string;
  duracao: number;
  tipoConsulta: string | null;
  procedimento: string | null;
  status: "agendada" | "confirmada" | "realizada" | "cancelada" | "faltou" | "em_atendimento";
  observacoes: string | null;
  valorEstimado: number | null;
  classificacaoRisco: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  agendada: "bg-blue-100 text-blue-700 border-blue-200",
  confirmada: "bg-green-100 text-green-700 border-green-200",
  realizada: "bg-purple-100 text-purple-700 border-purple-200",
  cancelada: "bg-red-100 text-red-700 border-red-200",
  faltou: "bg-orange-100 text-orange-700 border-orange-200",
  em_atendimento: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const STATUS_LABELS: Record<string, string> = {
  agendada: "Agendada",
  confirmada: "Confirmada",
  realizada: "Realizada",
  cancelada: "Cancelada",
  faltou: "Faltou",
  em_atendimento: "Em Atendimento",
};

const HORA_INICIO = 8;
const HORA_FIM = 20;
const HORAS = Array.from({ length: HORA_FIM - HORA_INICIO + 1 }, (_, i) => HORA_INICIO + i);

export default function AgendaAvancada() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [dataAtual, setDataAtual] = useState(new Date());
  const [modalNovaConsulta, setModalNovaConsulta] = useState(false);
  const [modalEditarConsulta, setModalEditarConsulta] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState<any>(null);
  const [dataHoraInicial, setDataHoraInicial] = useState<Date | undefined>();
  
  // Filtros
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroMedico, setFiltroMedico] = useState<string>("todos");
  const [pesquisa, setPesquisa] = useState("");

  // Calcular período baseado no modo de visualização
  const { inicio, fim } = useMemo(() => {
    const data = new Date(dataAtual);
    
    if (viewMode === "day") {
      const inicio = new Date(data);
      inicio.setHours(0, 0, 0, 0);
      const fim = new Date(data);
      fim.setHours(23, 59, 59, 999);
      return { inicio, fim };
    }
    
    if (viewMode === "week") {
      const dia = data.getDay();
      const inicio = new Date(data);
      inicio.setDate(data.getDate() - dia);
      inicio.setHours(0, 0, 0, 0);
      const fim = new Date(inicio);
      fim.setDate(inicio.getDate() + 6);
      fim.setHours(23, 59, 59, 999);
      return { inicio, fim };
    }
    
    // month
    const inicio = new Date(data.getFullYear(), data.getMonth(), 1);
    const fim = new Date(data.getFullYear(), data.getMonth() + 1, 0, 23, 59, 59, 999);
    return { inicio, fim };
  }, [dataAtual, viewMode]);

  // Buscar consultas
  const { data: todasConsultasData = [], isLoading } = useConsultasPorPeriodo(
    inicio.toISOString().split("T")[0],
    fim.toISOString().split("T")[0]
  );
  const todasConsultas = (todasConsultasData as any[]) || [];

  // Buscar utentes
  const { data: utentesData = [] } = useUtentes();
  const utentes = (utentesData as any[]) || [];

  // Buscar estatísticas
  const { data: estatisticas } = useConsultasStats();

  // Filtrar consultas
  const consultas = useMemo(() => {
    let filtered = todasConsultas;

    // Filtro de status
    if (filtroStatus !== "todos") {
      filtered = filtered.filter((c: Consulta) => c.status === filtroStatus);
    }

    // Filtro de médico
    if (filtroMedico !== "todos") {
      filtered = filtered.filter((c: Consulta) => c.medicoId === filtroMedico);
    }

    // Pesquisa por paciente
    if (pesquisa.trim()) {
      const termo = pesquisa.toLowerCase();
      filtered = filtered.filter((c: Consulta) => {
        const utente = utentes.find((u: any) => u.id === c.utenteId);
        return utente?.nomeCompleto?.toLowerCase().includes(termo);
      });
    }

    return filtered;
  }, [todasConsultas, filtroStatus, filtroMedico, pesquisa, utentes]);

  // Mutations
  const criarConsultaMutation = useCriarConsulta();
  const atualizarConsultaMutation = useAtualizarConsulta();
  const removerConsultaMutation = useRemoverConsulta();

  // Navegação
  const navegar = (direcao: number) => {
    const novaData = new Date(dataAtual);
    
    if (viewMode === "day") {
      novaData.setDate(dataAtual.getDate() + direcao);
    } else if (viewMode === "week") {
      novaData.setDate(dataAtual.getDate() + (direcao * 7));
    } else {
      novaData.setMonth(dataAtual.getMonth() + direcao);
    }
    
    setDataAtual(novaData);
  };

  const irParaHoje = () => {
    setDataAtual(new Date());
  };

  // Handlers
  const handleHorarioClick = (data: Date, hora: number) => {
    const dataHora = new Date(data);
    dataHora.setHours(hora, 0, 0, 0);
    setDataHoraInicial(dataHora);
    setModalNovaConsulta(true);
  };

  const handleConsultaClick = (consulta: Consulta) => {
    setConsultaSelecionada(consulta);
    setModalEditarConsulta(true);
  };

  // Formatação
  const formatarPeriodo = () => {
    const opcoes: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    
    if (viewMode === "day") {
      return dataAtual.toLocaleDateString("pt-PT", opcoes);
    }
    
    if (viewMode === "week") {
      const inicioStr = inicio.toLocaleDateString("pt-PT", { day: "numeric", month: "short" });
      const fimStr = fim.toLocaleDateString("pt-PT", { day: "numeric", month: "short", year: "numeric" });
      return `${inicioStr} - ${fimStr}`;
    }
    
    return dataAtual.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });
  };

  // Gerar dias para visualização
  const dias = useMemo(() => {
    if (viewMode === "day") {
      return [dataAtual];
    }
    
    if (viewMode === "week") {
      const dias = [];
      for (let i = 0; i < 7; i++) {
        const dia = new Date(inicio);
        dia.setDate(inicio.getDate() + i);
        dias.push(dia);
      }
      return dias;
    }
    
    // month - gerar todos os dias do mês
    const dias = [];
    const primeiroDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);
    const ultimoDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);
    
    for (let d = primeiroDia.getDate(); d <= ultimoDia.getDate(); d++) {
      const dia = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), d);
      dias.push(dia);
    }
    
    return dias;
  }, [dataAtual, viewMode, inicio]);

  const isHoje = (data: Date) => {
    const hoje = new Date();
    return (
      data.getDate() === hoje.getDate() &&
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear()
    );
  };

  const getConsultasDoDia = (dia: Date) => {
    const chave = dia.toISOString().split("T")[0];
    return consultas.filter((c: Consulta) => {
      const dataConsulta = new Date(c.dataHora);
      return dataConsulta.toISOString().split("T")[0] === chave;
    });
  };

  const calcularPosicao = (consulta: Consulta) => {
    const dataHora = new Date(consulta.dataHora);
    const hora = dataHora.getHours();
    const minuto = dataHora.getMinutes();
    
    const offsetHoras = hora - HORA_INICIO;
    const offsetMinutos = minuto / 60;
    const top = (offsetHoras + offsetMinutos) * 60; // 60px por hora
    
    return top;
  };

  const calcularAltura = (duracao: number) => {
    return (duracao / 60) * 60; // 60px por hora
  };

  const limparFiltros = () => {
    setFiltroStatus("todos");
    setFiltroMedico("todos");
    setPesquisa("");
  };

  const temFiltrosAtivos = filtroStatus !== "todos" || filtroMedico !== "todos" || pesquisa.trim() !== "";

  const estatisticasData = estatisticas as any;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-[1920px] mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Agenda</h1>
            <p className="text-gray-600 text-lg">{formatarPeriodo()}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Modo de visualização */}
            <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
              <Button
                variant={viewMode === "day" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("day")}
                className="rounded-lg"
              >
                Dia
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("week")}
                className="rounded-lg"
              >
                Semana
              </Button>
              <Button
                variant={viewMode === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("month")}
                className="rounded-lg"
              >
                Mês
              </Button>
            </div>

            {/* Navegação */}
            <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 p-1">
              <Button variant="ghost" size="icon" onClick={() => navegar(-1)} className="rounded-lg">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" onClick={irParaHoje} className="px-4 font-medium">
                Hoje
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navegar(1)} className="rounded-lg">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Button
              onClick={() => {
                setDataHoraInicial(undefined);
                setModalNovaConsulta(true);
              }}
              className="rounded-xl gap-2 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
            >
              <Plus className="h-4 w-4" />
              Nova Consulta
            </Button>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="rounded-2xl shadow-sm border-none bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 mb-1">Hoje</div>
              <div className="text-2xl font-bold text-gray-900">{estatisticasData?.hoje || 0}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm border-none bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 mb-1">Esta Semana</div>
              <div className="text-2xl font-bold text-gray-900">{estatisticasData?.estaSemana || 0}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm border-none bg-blue-50/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm text-blue-600 mb-1">Agendadas</div>
              <div className="text-2xl font-bold text-blue-900">{estatisticasData?.agendadas || 0}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm border-none bg-green-50/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm text-green-600 mb-1">Confirmadas</div>
              <div className="text-2xl font-bold text-green-900">{estatisticasData?.confirmadas || 0}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm border-none bg-purple-50/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm text-purple-600 mb-1">Realizadas</div>
              <div className="text-2xl font-bold text-purple-900">{estatisticasData?.realizadas || 0}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm border-none bg-orange-50/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm text-orange-600 mb-1">Faltas</div>
              <div className="text-2xl font-bold text-orange-900">{estatisticasData?.faltou || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Pesquisa */}
        <Card className="rounded-2xl shadow-sm border-none bg-white/80 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[250px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar paciente..."
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    className="pl-10 rounded-xl border-gray-200 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger className="w-[180px] rounded-xl border-gray-200">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Status</SelectItem>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {temFiltrosAtivos && (
                <Button variant="ghost" onClick={limparFiltros} className="rounded-xl gap-2 text-gray-500 hover:text-gray-900">
                  <X className="h-4 w-4" />
                  Limpar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Grid da Agenda */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Cabeçalho dos Dias */}
          <div className="flex border-b border-gray-200 bg-gray-50/50">
            <div className="w-20 flex-shrink-0 border-r border-gray-200" />
            <div className="flex-1 flex">
              {dias.map((dia, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 py-4 text-center border-r border-gray-200 last:border-r-0",
                    isHoje(dia) && "bg-blue-50/50"
                  )}
                >
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {dia.toLocaleDateString("pt-PT", { weekday: "short" })}
                  </div>
                  <div className={cn(
                    "text-2xl font-black",
                    isHoje(dia) ? "text-blue-600" : "text-gray-900"
                  )}>
                    {dia.getDate()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Corpo da Agenda */}
          <div className="relative flex overflow-y-auto" style={{ height: "720px" }}>
            {/* Horas */}
            <div className="w-20 flex-shrink-0 bg-gray-50/30 border-r border-gray-200">
              {HORAS.map((hora) => (
                <div
                  key={hora}
                  className="h-[60px] text-right pr-4 pt-2 text-xs font-bold text-gray-400"
                >
                  {hora.toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {/* Slots de Consultas */}
            <div className="flex-1 flex relative">
              {/* Linhas de fundo */}
              <div className="absolute inset-0 pointer-events-none">
                {HORAS.map((hora) => (
                  <div key={hora} className="h-[60px] border-b border-gray-100" />
                ))}
              </div>

              {/* Colunas de dias */}
              {dias.map((dia, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 relative border-r border-gray-200 last:border-r-0",
                    isHoje(dia) && "bg-blue-50/10"
                  )}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    const hora = Math.floor(y / 60) + HORA_INICIO;
                    if (hora >= HORA_INICIO && hora <= HORA_FIM) {
                      handleHorarioClick(dia, hora);
                    }
                  }}
                >
                  {/* Consultas */}
                  {getConsultasDoDia(dia).map((consulta) => {
                    const utente = utentes.find((u: any) => u.id === consulta.utenteId);
                    return (
                      <div
                        key={consulta.id}
                        className={cn(
                          "absolute left-1 right-1 p-2 rounded-xl border-2 shadow-sm cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md z-10 overflow-hidden",
                          STATUS_COLORS[consulta.status]
                        )}
                        style={{
                          top: `${calcularPosicao(consulta)}px`,
                          height: `${calcularAltura(consulta.duracao) - 4}px`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConsultaClick(consulta);
                        }}
                      >
                        <div className="text-[10px] font-bold opacity-70 mb-0.5">
                          {new Date(consulta.dataHora).toLocaleTimeString("pt-PT", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        <div className="text-xs font-bold truncate">
                          {utente?.nomeCompleto || "Paciente não encontrado"}
                        </div>
                        {consulta.duracao >= 45 && (
                          <div className="text-[10px] truncate opacity-80 mt-1">
                            {consulta.tipoConsulta || "Consulta Geral"}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modais */}
      <ModalNovaConsulta
        isOpen={modalNovaConsulta}
        onClose={() => setModalNovaConsulta(false)}
        onSave={async (dados: any) => {
          await criarConsultaMutation.mutateAsync(dados);
          queryClient.invalidateQueries({ queryKey: ["consultas"] });
        }}
        utentes={utentes.map((u: any) => ({ id: u.id, nome: u.nomeCompleto }))}
        medicos={[]}
        dataHoraInicial={dataHoraInicial}
      />

      <ModalEditarConsulta
        isOpen={modalEditarConsulta}
        onClose={() => {
          setModalEditarConsulta(false);
          setConsultaSelecionada(null);
        }}
        onSave={async (id: string, dados: any) => {
          await atualizarConsultaMutation.mutateAsync({ id, dados });
          queryClient.invalidateQueries({ queryKey: ["consultas"] });
        }}
        onDelete={async (id: string) => {
          await removerConsultaMutation.mutateAsync({ id });
          queryClient.invalidateQueries({ queryKey: ["consultas"] });
        }}
        consulta={consultaSelecionada}
        utentes={utentes.map((u: any) => ({ id: u.id, nome: u.nomeCompleto }))}
        medicos={[]}
      />
    </div>
  );
}
