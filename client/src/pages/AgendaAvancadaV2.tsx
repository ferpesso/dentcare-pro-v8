import React, { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
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
  Calendar as CalendarIcon,
  Search,
  X,
  Plus,
  GripVertical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ModalNovaConsultaV2 from "@/components/ModalNovaConsultaV2";
import ModalEditarConsulta from "@/components/ModalEditarConsulta";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  agendada: "bg-blue-100 text-blue-700 border-blue-300",
  confirmada: "bg-green-100 text-green-700 border-green-300",
  realizada: "bg-purple-100 text-purple-700 border-purple-300",
  cancelada: "bg-red-100 text-red-700 border-red-300",
  faltou: "bg-orange-100 text-orange-700 border-orange-300",
  em_atendimento: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

const HORA_INICIO = 8;
const HORA_FIM = 20;
const HORAS = Array.from({ length: HORA_FIM - HORA_INICIO + 1 }, (_, i) => HORA_INICIO + i);

// Componente de consulta arrastável
function ConsultaCard({ consulta, utente, onClick }: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: consulta.id,
    data: consulta,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-2 rounded-lg border-2 cursor-grab active:cursor-grabbing hover:shadow-lg transition-all",
        STATUS_COLORS[consulta.status],
        isDragging && "opacity-50 scale-95"
      )}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      <div className="flex items-start gap-1">
        <GripVertical className="w-3 h-3 opacity-50 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold truncate">
            {new Date(consulta.dataHora).toLocaleTimeString("pt-PT", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
          <div className="text-xs font-medium truncate mt-1">
            {utente?.nomeCompleto || "Sem nome"}
          </div>
          {consulta.tipoConsulta && (
            <div className="text-xs truncate opacity-75">
              {consulta.tipoConsulta}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente de slot de horário (droppable)
function HorarioSlot({ dia, hora, onClick, children }: any) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${dia.toISOString()}-${hora}`,
    data: { dia, hora },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "absolute w-full border-b border-gray-100 hover:bg-blue-50/30 cursor-pointer transition-colors group",
        isOver && "bg-blue-100/50 border-blue-300"
      )}
      style={{
        top: `${(hora - HORA_INICIO) * 60}px`,
        height: "60px",
      }}
      onClick={onClick}
    >
      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-600 font-medium p-1">
        {isOver ? "Soltar aqui" : "Clique para agendar"}
      </div>
      {children}
    </div>
  );
}

export default function AgendaAvancadaV2() {
  const queryClient = useQueryClient();
  
  // Configurar sensores para evitar conflito entre clique e drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Só ativa o drag se mover 8 pixels
      },
    })
  );
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [dataAtual, setDataAtual] = useState(new Date());
  const [modalNovaConsulta, setModalNovaConsulta] = useState(false);
  const [modalEditarConsulta, setModalEditarConsulta] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState<any>(null);
  const [dataHoraInicial, setDataHoraInicial] = useState<Date | undefined>();
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroMedico, setFiltroMedico] = useState("todos");
  const [pesquisa, setPesquisa] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  // Calcular período
  const { inicio, fim } = useMemo(() => {
    const data = new Date(dataAtual);
    
    if (viewMode === "day") {
      const inicio = new Date(data.getFullYear(), data.getMonth(), data.getDate(), 0, 0, 0);
      const fim = new Date(data.getFullYear(), data.getMonth(), data.getDate(), 23, 59, 59, 999);
      return { inicio, fim };
    }
    
    if (viewMode === "week") {
      const diaSemana = data.getDay();
      const inicio = new Date(data);
      inicio.setDate(data.getDate() - diaSemana);
      inicio.setHours(0, 0, 0, 0);
      
      const fim = new Date(inicio);
      fim.setDate(inicio.getDate() + 6);
      fim.setHours(23, 59, 59, 999);
      
      return { inicio, fim };
    }
    
    // month
    const inicio = new Date(data.getFullYear(), data.getMonth(), 1, 0, 0, 0);
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

    // Filtro por status
    if (filtroStatus !== "todos") {
      filtered = filtered.filter((c: Consulta) => c.status === filtroStatus);
    }

    // Filtro por médico
    if (filtroMedico !== "todos") {
      filtered = filtered.filter((c: Consulta) => c.medicoId === filtroMedico);
    }

    // Pesquisa por paciente
    if (pesquisa.trim()) {
      const termo = pesquisa.toLowerCase();
      filtered = filtered.filter((c: Consulta) => {
        const utente = utentes.find((u: any) => u.id === c.utenteId);
        return utente?.nomeCompleto.toLowerCase().includes(termo);
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

  const handleHorarioClick = (dia: Date, hora: number) => {
    const dataHora = new Date(dia);
    dataHora.setHours(hora, 0, 0, 0);
    setDataHoraInicial(dataHora);
    setModalNovaConsulta(true);
  };

  const handleConsultaClick = (consulta: Consulta) => {
    setConsultaSelecionada(consulta);
    setModalEditarConsulta(true);
  };

  // Drag and Drop
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const consultaId = active.id as string;
    const consulta = consultas.find((c: Consulta) => c.id === consultaId);
    
    if (!consulta) return;

    // Extrair dia e hora do droppable
    const [diaStr, horaStr] = (over.id as string).split('-');
    const novoDia = new Date(diaStr);
    const novaHora = parseInt(horaStr);

    if (isNaN(novoDia.getTime()) || isNaN(novaHora)) return;

    // Criar nova data/hora
    const novaDataHora = new Date(novoDia);
    novaDataHora.setHours(novaHora, 0, 0, 0);

    // Atualizar consulta
    try {
      await atualizarConsultaMutation.mutateAsync({
        id: consultaId,
        dados: { 
          utenteId: consulta.utenteId,
          medicoId: consulta.medicoId,
          dataHora: novaDataHora.toISOString(),
          duracao: consulta.duracao,
          tipoConsulta: consulta.tipoConsulta,
          procedimento: consulta.procedimento,
          status: consulta.status,
          observacoes: consulta.observacoes,
          valorEstimado: consulta.valorEstimado,
          classificacaoRisco: consulta.classificacaoRisco
        }
      });
      
      // Forçar reload imediato dos dados
      await queryClient.refetchQueries({ queryKey: ['consultas'] });
      await queryClient.refetchQueries({ queryKey: ['consultas-stats'] });
      
      toast.success("Consulta reagendada!");
    } catch (error) {
      console.error("Erro ao reagendar:", error);
      toast.error("Erro ao reagendar consulta");
    }
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
      return [new Date(dataAtual)]; // Clone da data
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
      const chaveConsulta = dataConsulta.toISOString().split("T")[0];
      return chaveConsulta === chave;
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

  // Consulta ativa durante drag
  const consultaAtiva = activeId ? consultas.find((c: Consulta) => c.id === activeId) : null;
  const utenteAtivo = consultaAtiva ? utentes.find((u: any) => u.id === consultaAtiva.utenteId) : null;

  const estatisticasData = estatisticas as any;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Agenda</h1>
          <p className="text-gray-600">{formatarPeriodo()}</p>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Seletor de visualização */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "day" ? "default" : "outline"}
              onClick={() => setViewMode("day")}
              className="rounded-xl"
            >
              Dia
            </Button>
            <Button
              variant={viewMode === "week" ? "default" : "outline"}
              onClick={() => setViewMode("week")}
              className="rounded-xl"
            >
              Semana
            </Button>
            <Button
              variant={viewMode === "month" ? "default" : "outline"}
              onClick={() => setViewMode("month")}
              className="rounded-xl"
            >
              Mês
            </Button>
          </div>

          {/* Navegação */}
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => navegar(-1)} className="rounded-xl">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={irParaHoje} className="rounded-xl gap-2">
              <CalendarIcon className="h-4 w-4" />
              Hoje
            </Button>
            <Button variant="outline" size="icon" onClick={() => navegar(1)} className="rounded-xl">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1" />

          {/* Nova Consulta */}
          <Button
            onClick={() => {
              setDataHoraInicial(undefined);
              setModalNovaConsulta(true);
            }}
            className="rounded-xl gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Plus className="h-4 w-4" />
            Nova Consulta
          </Button>
        </div>

        {/* Filtros */}
        <Card className="mb-6 rounded-2xl shadow-sm border-orange-200 bg-orange-50/30">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar paciente..."
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    className="pl-10 rounded-xl border-orange-200 focus:border-orange-400"
                  />
                </div>
              </div>

              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-[180px] rounded-xl border-orange-200">
                  <SelectValue placeholder="Todos os Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="agendada">Agendada</SelectItem>
                  <SelectItem value="confirmada">Confirmada</SelectItem>
                  <SelectItem value="realizada">Realizada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                  <SelectItem value="faltou">Faltou</SelectItem>
                  <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                </SelectContent>
              </Select>

              {temFiltrosAtivos && (
                <Button variant="ghost" onClick={limparFiltros} className="rounded-xl gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-100">
                  <X className="h-4 w-4" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <Card className="rounded-2xl shadow-sm border-none bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 mb-1">Hoje</div>
              <div className="text-3xl font-bold text-gray-900">{(estatisticasData as any)?.hoje || 0}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm border-none bg-white/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 mb-1">Esta Semana</div>
              <div className="text-3xl font-bold text-gray-900">{(estatisticasData as any)?.estaSemana || 0}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm border-none bg-blue-50/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm text-blue-600 mb-1">Agendadas</div>
              <div className="text-3xl font-bold text-blue-900">{(estatisticasData as any)?.agendadas || 0}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm border-none bg-green-50/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm text-green-600 mb-1">Confirmadas</div>
              <div className="text-3xl font-bold text-green-900">{(estatisticasData as any)?.confirmadas || 0}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm border-none bg-purple-50/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm text-purple-600 mb-1">Realizadas</div>
              <div className="text-3xl font-bold text-purple-900">{(estatisticasData as any)?.realizadas || 0}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm border-none bg-orange-50/50 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="text-sm text-orange-600 mb-1">Faltas</div>
              <div className="text-3xl font-bold text-orange-900">{(estatisticasData as any)?.faltou || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Grid da Agenda */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
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

            {/* Slots e Consultas */}
            <div className="flex-1 flex relative">
              {dias.map((dia, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 relative border-r border-gray-200 last:border-r-0",
                    isHoje(dia) && "bg-blue-50/20"
                  )}
                >
                  {HORAS.map((hora) => (
                    <HorarioSlot
                      key={hora}
                      dia={dia}
                      hora={hora}
                      onClick={() => handleHorarioClick(dia, hora)}
                    >
                      {/* Consultas do dia e hora */}
                      {getConsultasDoDia(dia)
                        .filter((c: Consulta) => new Date(c.dataHora).getHours() === hora)
                        .map((consulta: Consulta) => {
                          const utente = utentes.find((u: any) => u.id === consulta.utenteId);
                          return (
                            <div
                              key={consulta.id}
                              className="absolute left-1 right-1 z-10"
                              style={{
                                top: `${(new Date(consulta.dataHora).getMinutes() / 60) * 60}px`,
                                height: `${(consulta.duracao / 60) * 60 - 4}px`,
                              }}
                            >
                              <ConsultaCard
                                consulta={consulta}
                                utente={utente}
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  handleConsultaClick(consulta);
                                }}
                              />
                            </div>
                          );
                        })}
                    </HorarioSlot>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId && consultaAtiva ? (
          <div className={cn(
            "p-3 rounded-xl border-2 shadow-2xl w-48",
            STATUS_COLORS[consultaAtiva.status]
          )}>
            <div className="text-xs font-bold">
              {new Date(consultaAtiva.dataHora).toLocaleTimeString("pt-PT", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-sm font-bold mt-1">
              {utenteAtivo?.nomeCompleto || "Carregando..."}
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Modais */}
      <ModalNovaConsultaV2
        isOpen={modalNovaConsulta}
        onClose={() => setModalNovaConsulta(false)}
        onSave={async (dados: any) => {
          await criarConsultaMutation.mutateAsync(dados);
          queryClient.invalidateQueries({ queryKey: ['consultas'] });
        }}
        utentes={utentes}
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
          queryClient.invalidateQueries({ queryKey: ['consultas'] });
        }}
        onDelete={async (id: string) => {
          await removerConsultaMutation.mutateAsync({ id });
          queryClient.invalidateQueries({ queryKey: ['consultas'] });
        }}
        consulta={consultaSelecionada}
        utentes={utentes.map((u: any) => ({ id: u.id, nome: u.nomeCompleto }))}
        medicos={[]}
      />
    </DndContext>
  );
}
