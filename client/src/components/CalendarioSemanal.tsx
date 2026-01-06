import React, { useMemo } from "react";
import BlocoConsulta from "./BlocoConsulta";
import TimelineHorarios from "./TimelineHorarios";

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

interface Utente {
  id: string;
  nome: string;
}

interface Medico {
  id: string;
  nome: string;
}

interface CalendarioSemanalProps {
  dataInicio: Date;
  consultas: Consulta[];
  utentes: Utente[];
  medicos: Medico[];
  onConsultaClick?: (consulta: Consulta) => void;
  onHorarioClick?: (data: Date, hora: number) => void;
}

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const HORA_INICIO = 8;
const HORA_FIM = 20;

export default function CalendarioSemanal({
  dataInicio,
  consultas,
  utentes,
  medicos,
  onConsultaClick,
  onHorarioClick,
}: CalendarioSemanalProps) {
  // Gerar os 7 dias da semana
  const diasDaSemana = useMemo(() => {
    const dias = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(dataInicio);
      dia.setDate(dia.getDate() + i);
      dias.push(dia);
    }
    return dias;
  }, [dataInicio]);

  // Organizar consultas por dia
  const consultasPorDia = useMemo(() => {
    const mapa = new Map<string, Consulta[]>();
    
    diasDaSemana.forEach((dia) => {
      const chave = dia.toISOString().split("T")[0];
      mapa.set(chave, []);
    });

    consultas.forEach((consulta) => {
      const dataConsulta = new Date(consulta.dataHora);
      const chave = dataConsulta.toISOString().split("T")[0];
      
      if (mapa.has(chave)) {
        mapa.get(chave)!.push(consulta);
      }
    });

    return mapa;
  }, [diasDaSemana, consultas]);

  // Verificar se é hoje
  const isHoje = (data: Date) => {
    const hoje = new Date();
    return (
      data.getDate() === hoje.getDate() &&
      data.getMonth() === hoje.getMonth() &&
      data.getFullYear() === hoje.getFullYear()
    );
  };

  // Calcular posição da consulta no grid
  const calcularPosicao = (consulta: Consulta) => {
    const dataHora = new Date(consulta.dataHora);
    const hora = dataHora.getHours();
    const minuto = dataHora.getMinutes();
    
    const offsetHoras = hora - HORA_INICIO;
    const offsetMinutos = minuto / 60;
    const top = (offsetHoras + offsetMinutos) * 60; // 60px por hora
    
    return top;
  };

  return (
    <div className="flex bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Timeline de horários */}
      <TimelineHorarios horaInicio={HORA_INICIO} horaFim={HORA_FIM} />

      {/* Grid de dias */}
      <div className="flex-1 flex">
        {diasDaSemana.map((dia, index) => {
          const chave = dia.toISOString().split("T")[0];
          const consultasDoDia = consultasPorDia.get(chave) || [];
          const ehHoje = isHoje(dia);

          return (
            <div key={index} className="flex-1 border-r border-gray-200 last:border-r-0">
              {/* Cabeçalho do dia */}
              <div
                className={`h-16 border-b border-gray-200 flex flex-col items-center justify-center ${
                  ehHoje ? "bg-blue-50" : ""
                }`}
              >
                <div className="text-xs text-gray-500 font-medium">
                  {DIAS_SEMANA[dia.getDay()]}
                </div>
                <div
                  className={`text-lg font-bold mt-1 ${
                    ehHoje
                      ? "bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center"
                      : "text-gray-900"
                  }`}
                >
                  {dia.getDate()}
                </div>
              </div>

              {/* Grid de horários */}
              <div className="relative" style={{ height: `${(HORA_FIM - HORA_INICIO + 1) * 60}px` }}>
                {/* Linhas de hora */}
                {Array.from({ length: HORA_FIM - HORA_INICIO + 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                    style={{
                      top: `${i * 60}px`,
                      height: "60px",
                    }}
                    onClick={() => onHorarioClick?.(dia, HORA_INICIO + i)}
                  />
                ))}

                {/* Consultas */}
                {consultasDoDia.map((consulta) => {
                  const utente = utentes.find((u) => u.id === consulta.utenteId);
                  const medico = consulta.medicoId
                    ? medicos.find((m) => m.id === consulta.medicoId)
                    : undefined;

                  return (
                    <div
                      key={consulta.id}
                      className="absolute left-1 right-1 z-10"
                      style={{
                        top: `${calcularPosicao(consulta)}px`,
                      }}
                    >
                      <BlocoConsulta
                        consulta={consulta}
                        utente={utente}
                        medico={medico}
                        onClick={() => onConsultaClick?.(consulta)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

