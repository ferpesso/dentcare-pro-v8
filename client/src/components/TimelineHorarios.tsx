import React from "react";

interface TimelineHorariosProps {
  horaInicio?: number;
  horaFim?: number;
}

export default function TimelineHorarios({ horaInicio = 8, horaFim = 20 }: TimelineHorariosProps) {
  const horarios = [];
  
  for (let hora = horaInicio; hora <= horaFim; hora++) {
    horarios.push(hora);
  }

  return (
    <div className="flex flex-col border-r border-gray-200">
      {/* Cabeçalho vazio para alinhar com os dias */}
      <div className="h-16 border-b border-gray-200"></div>

      {/* Horários */}
      {horarios.map((hora) => (
        <div key={hora} className="relative" style={{ height: "60px" }}>
          <div className="absolute -top-2 right-2 text-xs text-gray-500 font-medium">
            {hora.toString().padStart(2, "0")}:00
          </div>
        </div>
      ))}
    </div>
  );
}

