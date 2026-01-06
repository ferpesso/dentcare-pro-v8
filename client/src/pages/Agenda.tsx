import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import CalendarioSemanal from "@/components/CalendarioSemanal";
import ModalNovaConsulta from "@/components/ModalNovaConsulta";
import ModalEditarConsulta from "@/components/ModalEditarConsulta";
import { toast } from "sonner";

export default function Agenda() {
  const queryClient = useQueryClient();
  const [dataAtual, setDataAtual] = useState(new Date());
  const [modalNovaConsulta, setModalNovaConsulta] = useState(false);
  const [modalEditarConsulta, setModalEditarConsulta] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState<any>(null);
  const [dataHoraInicial, setDataHoraInicial] = useState<Date | undefined>();

  // Calcular início da semana (domingo)
  const inicioDaSemana = useMemo(() => {
    const data = new Date(dataAtual);
    const dia = data.getDay();
    data.setDate(data.getDate() - dia);
    data.setHours(0, 0, 0, 0);
    return data;
  }, [dataAtual]);

  // Calcular fim da semana (sábado)
  const fimDaSemana = useMemo(() => {
    const data = new Date(inicioDaSemana);
    data.setDate(data.getDate() + 6);
    data.setHours(23, 59, 59, 999);
    return data;
  }, [inicioDaSemana]);

  // Buscar consultas do período
  const { data: consultas = [], isLoading: loadingConsultas } = useQuery({
    queryKey: ["consultas", inicioDaSemana.toISOString(), fimDaSemana.toISOString()],
    queryFn: async () => {
      const result = await (trpc.consultas.listarPorPeriodo as any).query({
        dataInicio: inicioDaSemana.toISOString().split("T")[0],
        dataFim: fimDaSemana.toISOString().split("T")[0],
      });
      return result;
    },
  });

  // Buscar utentes
  const { data: utentes = [] } = useQuery({
    queryKey: ["utentes"],
    queryFn: async () => {
      const result = await (trpc.utentes.listar as any).query();
      return (result as any[]).map((u: any) => ({ id: u.id, nome: u.nomeCompleto }));
    },
  });

  // Buscar médicos (assumindo que existe uma rota)
  const { data: medicos = [] } = useQuery({
    queryKey: ["medicos"],
    queryFn: async () => {
      // Se não tiver rota de médicos, retornar array vazio
      return [];
    },
  });

  // Buscar estatísticas
  const { data: estatisticas } = useQuery({
    queryKey: ["consultas-estatisticas"],
    queryFn: async () => {
      return await (trpc.consultas.estatisticas as any).query();
    },
  });

  // Mutation para criar consulta
  const criarConsultaMutation = useMutation({
    mutationFn: async (dados: any) => {
      return await (trpc.consultas.criar as any).mutate(dados);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultas"] });
      queryClient.invalidateQueries({ queryKey: ["consultas-estatisticas"] });
      toast.success("Consulta criada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao criar consulta");
    },
  });

  // Mutation para atualizar consulta
  const atualizarConsultaMutation = useMutation({
    mutationFn: async ({ id, dados }: { id: string; dados: any }) => {
      return await (trpc.consultas.atualizar as any).mutate({ id, ...dados });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultas"] });
      queryClient.invalidateQueries({ queryKey: ["consultas-estatisticas"] });
      toast.success("Consulta atualizada com sucesso!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Erro ao atualizar consulta");
    },
  });

  // Mutation para remover consulta
  const removerConsultaMutation = useMutation({
    mutationFn: async (id: string) => {
      return await (trpc.consultas.remover as any).mutate({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultas"] });
      queryClient.invalidateQueries({ queryKey: ["consultas-estatisticas"] });
      toast.success("Consulta eliminada com sucesso!");
    },
    onError: () => {
      toast.error("Erro ao eliminar consulta");
    },
  });

  // Navegação de semanas
  const semanaAnterior = () => {
    const novaData = new Date(dataAtual);
    novaData.setDate(novaData.getDate() - 7);
    setDataAtual(novaData);
  };

  const proximaSemana = () => {
    const novaData = new Date(dataAtual);
    novaData.setDate(novaData.getDate() + 7);
    setDataAtual(novaData);
  };

  const irParaHoje = () => {
    setDataAtual(new Date());
  };

  // Handlers
  const handleNovaConsulta = () => {
    setDataHoraInicial(undefined);
    setModalNovaConsulta(true);
  };

  const handleHorarioClick = (data: Date, hora: number) => {
    const dataHora = new Date(data);
    dataHora.setHours(hora, 0, 0, 0);
    setDataHoraInicial(dataHora);
    setModalNovaConsulta(true);
  };

  const handleConsultaClick = (consulta: any) => {
    setConsultaSelecionada(consulta);
    setModalEditarConsulta(true);
  };

  const handleSalvarNovaConsulta = async (dados: any) => {
    await criarConsultaMutation.mutateAsync(dados);
  };

  const handleSalvarEdicao = async (id: string, dados: any) => {
    await atualizarConsultaMutation.mutateAsync({ id, dados });
  };

  const handleEliminarConsulta = async (id: string) => {
    await removerConsultaMutation.mutateAsync(id);
  };

  // Formatação de data
  const formatarPeriodo = () => {
    const opcoes: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    const inicio = inicioDaSemana.toLocaleDateString("pt-PT", opcoes);
    const fim = fimDaSemana.toLocaleDateString("pt-PT", opcoes);
    return `${inicio} - ${fim}`;
  };

  const statsData = estatisticas as any;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agenda</h1>
            <p className="text-gray-500 mt-1">{formatarPeriodo()}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={semanaAnterior}
              className="rounded-xl"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              onClick={irParaHoje}
              className="rounded-xl"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Hoje
            </Button>

            <Button
              variant="outline"
              onClick={proximaSemana}
              className="rounded-xl"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleNovaConsulta}
              className="rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Consulta
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        {statsData && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500">Hoje</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{statsData.hoje}</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="text-sm text-gray-500">Esta Semana</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{statsData.estaSemana}</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200">
              <div className="text-sm text-blue-600">Agendadas</div>
              <div className="text-2xl font-bold text-blue-700 mt-1">{statsData.agendadas}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-200">
              <div className="text-sm text-green-600">Confirmadas</div>
              <div className="text-2xl font-bold text-green-700 mt-1">{statsData.confirmadas}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl shadow-sm border border-purple-200">
              <div className="text-sm text-purple-600">Realizadas</div>
              <div className="text-2xl font-bold text-purple-700 mt-1">{statsData.realizadas}</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl shadow-sm border border-orange-200">
              <div className="text-sm text-orange-600">Faltas</div>
              <div className="text-2xl font-bold text-orange-700 mt-1">{statsData.faltou}</div>
            </div>
          </div>
        )}

        {/* Calendário */}
        {loadingConsultas ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-500">Carregando consultas...</div>
          </div>
        ) : (
          <CalendarioSemanal
            dataInicio={inicioDaSemana}
            consultas={consultas as any[]}
            utentes={utentes as any[]}
            medicos={medicos as any[]}
            onConsultaClick={handleConsultaClick}
            onHorarioClick={handleHorarioClick}
          />
        )}
      </div>

      {/* Modais */}
      <ModalNovaConsulta
        isOpen={modalNovaConsulta}
        onClose={() => setModalNovaConsulta(false)}
        onSave={handleSalvarNovaConsulta}
        utentes={utentes as any[]}
        medicos={medicos as any[]}
        dataHoraInicial={dataHoraInicial}
      />

      <ModalEditarConsulta
        isOpen={modalEditarConsulta}
        onClose={() => {
          setModalEditarConsulta(false);
          setConsultaSelecionada(null);
        }}
        onSave={handleSalvarEdicao}
        onDelete={handleEliminarConsulta}
        consulta={consultaSelecionada}
        utentes={utentes as any[]}
        medicos={medicos as any[]}
      />
    </div>
  );
}
