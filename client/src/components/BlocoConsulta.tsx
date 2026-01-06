import React from "react";
import { Clock, User, Stethoscope } from "lucide-react";

interface BlocoConsultaProps {
  consulta: {
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
  };
  utente?: {
    id: string;
    nome: string;
  };
  medico?: {
    id: string;
    nome: string;
  };
  onClick?: () => void;
}

const STATUS_CONFIG = {
  agendada: {
    bg: "bg-blue-500",
    text: "text-white",
    label: "Agendada",
  },
  confirmada: {
    bg: "bg-green-500",
    text: "text-white",
    label: "Confirmada",
  },
  realizada: {
    bg: "bg-purple-500",
    text: "text-white",
    label: "Realizada",
  },
  cancelada: {
    bg: "bg-red-500",
    text: "text-white",
    label: "Cancelada",
  },
  faltou: {
    bg: "bg-orange-500",
    text: "text-white",
    label: "Faltou",
  },
  em_atendimento: {
    bg: "bg-cyan-500",
    text: "text-white",
    label: "Em Atendimento",
  },
};

export default function BlocoConsulta({ consulta, utente, medico, onClick }: BlocoConsultaProps) {
  const config = STATUS_CONFIG[consulta.status];
  const dataHora = new Date(consulta.dataHora);
  const horaInicio = dataHora.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });
  const horaFim = new Date(dataHora.getTime() + consulta.duracao * 60000).toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className={`${config.bg} ${config.text} p-3 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-white/30`}
      onClick={onClick}
      style={{
        minHeight: `${(consulta.duracao / 30) * 60}px`,
      }}
    >
      {/* Horário */}
      <div className="flex items-center gap-1.5 text-xs font-semibold mb-2 opacity-90">
        <Clock className="w-3.5 h-3.5" />
        <span>{horaInicio} - {horaFim}</span>
      </div>

      {/* Nome do Utente */}
      {utente && (
        <div className="flex items-center gap-1.5 mb-1.5">
          <User className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="font-semibold text-sm truncate">{utente.nome}</span>
        </div>
      )}

      {/* Nome do Médico */}
      {medico && (
        <div className="flex items-center gap-1.5 mb-1.5 opacity-90">
          <Stethoscope className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-xs truncate">{medico.nome}</span>
        </div>
      )}

      {/* Tipo de Consulta */}
      {consulta.tipoConsulta && (
        <div className="text-xs mt-2 px-2 py-1 bg-white/20 rounded-lg inline-block">
          {consulta.tipoConsulta}
        </div>
      )}

      {/* Badge de Status (pequeno) */}
      <div className="text-[10px] mt-2 opacity-75">
        {config.label}
      </div>
    </div>
  );
}

