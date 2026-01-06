import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Stethoscope, FileText, DollarSign, AlertTriangle, UserPlus } from "lucide-react";
import { useLocation } from "wouter";

interface ModalNovaConsultaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (consulta: {
    utenteId: string;
    medicoId?: string | null;
    dataHora: string;
    duracao: number;
    tipoConsulta?: string | null;
    procedimento?: string | null;
    status?: "agendada" | "confirmada" | "realizada" | "cancelada" | "faltou" | "em_atendimento";
    observacoes?: string | null;
    valorEstimado?: number | null;
    classificacaoRisco?: string | null;
  }) => Promise<void>;
  utentes: Array<{ id: string; nome: string }>;
  medicos: Array<{ id: string; nome: string }>;
  dataHoraInicial?: Date;
}

const TIPOS_CONSULTA = [
  "Consulta de Rotina",
  "Limpeza",
  "Extração",
  "Tratamento de Canal",
  "Restauração",
  "Implante",
  "Ortodontia",
  "Emergência",
  "Outro",
];

const CLASSIFICACOES_RISCO = ["ASA I", "ASA II", "ASA III", "ASA IV", "ASA V", "ASA VI"];

export default function ModalNovaConsulta({
  isOpen,
  onClose,
  onSave,
  utentes,
  medicos,
  dataHoraInicial,
}: ModalNovaConsultaProps) {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(() => {
    const dataHora = dataHoraInicial || new Date();
    return {
      utenteId: "",
      medicoId: "",
      data: dataHora.toISOString().split("T")[0],
      hora: dataHora.toTimeString().slice(0, 5),
      duracao: 30,
      tipoConsulta: "",
      procedimento: "",
      observacoes: "",
      valorEstimado: "",
      classificacaoRisco: "ASA I",
    };
  });

  // Atualizar data/hora quando dataHoraInicial mudar
  useEffect(() => {
    if (dataHoraInicial) {
      setFormData(prev => ({
        ...prev,
        data: dataHoraInicial.toISOString().split("T")[0],
        hora: dataHoraInicial.toTimeString().slice(0, 5),
      }));
    }
  }, [dataHoraInicial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.utenteId) {
      alert("Por favor, selecione um utente");
      return;
    }

    setLoading(true);
    try {
      const dataHora = `${formData.data}T${formData.hora}:00`;
      
      await onSave({
        utenteId: formData.utenteId,
        medicoId: formData.medicoId && formData.medicoId !== "__none__" ? formData.medicoId : null,
        dataHora,
        duracao: formData.duracao,
        tipoConsulta: formData.tipoConsulta || null,
        procedimento: formData.procedimento || null,
        status: "agendada",
        observacoes: formData.observacoes || null,
        valorEstimado: formData.valorEstimado ? parseFloat(formData.valorEstimado) : null,
        classificacaoRisco: formData.classificacaoRisco || null,
      });
      
      onClose();
      
      // Reset form
      setFormData({
        utenteId: "",
        medicoId: "",
        data: new Date().toISOString().split("T")[0],
        hora: new Date().toTimeString().slice(0, 5),
        duracao: 30,
        tipoConsulta: "",
        procedimento: "",
        observacoes: "",
        valorEstimado: "",
        classificacaoRisco: "ASA I",
      });
    } catch (error) {
      console.error("Erro ao criar consulta:", error);
      alert(error instanceof Error ? error.message : "Erro ao criar consulta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-600">Nova Consulta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Utente */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="utente" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Utente *
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  setLocation("/utentes?novo=true");
                }}
                className="rounded-xl text-xs"
              >
                <UserPlus className="w-3 h-3 mr-1" />
                Novo Utente
              </Button>
            </div>
            <Select value={formData.utenteId} onValueChange={(value) => setFormData({ ...formData, utenteId: value })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecione o utente" />
              </SelectTrigger>
              <SelectContent>
                {utentes.map((utente: any) => (
                  <SelectItem key={utente.id} value={utente.id}>
                    {utente.nomeCompleto || utente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Médico */}
          <div>
            <Label htmlFor="medico" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Médico Dentista
            </Label>
            <Select value={formData.medicoId} onValueChange={(value) => setFormData({ ...formData, medicoId: value })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecione o médico (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Nenhum</SelectItem>
                {medicos.map((medico) => (
                  <SelectItem key={medico.id} value={medico.id}>
                    {medico.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Data *
              </Label>
              <Input
                id="data"
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                className="rounded-xl"
                required
              />
            </div>
            <div>
              <Label htmlFor="hora" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Hora *
              </Label>
              <Input
                id="hora"
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                className="rounded-xl"
                required
              />
            </div>
          </div>

          {/* Duração */}
          <div>
            <Label htmlFor="duracao" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Duração (minutos) *
            </Label>
            <Select value={formData.duracao.toString()} onValueChange={(value) => setFormData({ ...formData, duracao: parseInt(value) })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="45">45 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="90">1h 30min</SelectItem>
                <SelectItem value="120">2 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Consulta */}
          <div>
            <Label htmlFor="tipoConsulta" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Tipo de Consulta
            </Label>
            <Select value={formData.tipoConsulta} onValueChange={(value) => setFormData({ ...formData, tipoConsulta: value })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_CONSULTA.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Procedimento */}
          <div>
            <Label htmlFor="procedimento">Procedimento</Label>
            <Input
              id="procedimento"
              value={formData.procedimento}
              onChange={(e) => setFormData({ ...formData, procedimento: e.target.value })}
              placeholder="Ex: Restauração dente 16"
              className="rounded-xl"
            />
          </div>

          {/* Valor Estimado */}
          <div>
            <Label htmlFor="valorEstimado" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Valor Estimado (€)
            </Label>
            <Input
              id="valorEstimado"
              type="number"
              step="0.01"
              value={formData.valorEstimado}
              onChange={(e) => setFormData({ ...formData, valorEstimado: e.target.value })}
              placeholder="0.00"
              className="rounded-xl"
            />
          </div>

          {/* Classificação de Risco */}
          <div>
            <Label htmlFor="classificacaoRisco" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Classificação de Risco (ASA)
            </Label>
            <Select value={formData.classificacaoRisco} onValueChange={(value) => setFormData({ ...formData, classificacaoRisco: value })}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLASSIFICACOES_RISCO.map((risco) => (
                  <SelectItem key={risco} value={risco}>
                    {risco}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações adicionais..."
              className="rounded-xl min-h-[100px]"
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl" disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? "Criando..." : "Criar Consulta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

