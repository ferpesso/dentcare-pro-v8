import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Stethoscope, FileText, DollarSign, AlertTriangle, Trash2 } from "lucide-react";

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

interface ModalEditarConsultaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, dados: Partial<Consulta>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  consulta: Consulta | null;
  utentes: Array<{ id: string; nome: string }>;
  medicos: Array<{ id: string; nome: string }>;
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

const STATUS_OPTIONS = [
  { value: "agendada", label: "Agendada", color: "bg-blue-500" },
  { value: "confirmada", label: "Confirmada", color: "bg-green-500" },
  { value: "realizada", label: "Realizada", color: "bg-purple-500" },
  { value: "cancelada", label: "Cancelada", color: "bg-red-500" },
  { value: "faltou", label: "Faltou", color: "bg-orange-500" },
  { value: "em_atendimento", label: "Em Atendimento", color: "bg-cyan-500" },
];

export default function ModalEditarConsulta({
  isOpen,
  onClose,
  onSave,
  onDelete,
  consulta,
  utentes,
  medicos,
}: ModalEditarConsultaProps) {
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    utenteId: "",
    medicoId: "",
    data: "",
    hora: "",
    duracao: 30,
    tipoConsulta: "",
    procedimento: "",
    status: "agendada" as Consulta["status"],
    observacoes: "",
    valorEstimado: "",
    classificacaoRisco: "ASA I",
  });

  useEffect(() => {
    if (consulta) {
      const dataHora = new Date(consulta.dataHora);
      setFormData({
        utenteId: consulta.utenteId,
        medicoId: consulta.medicoId || "",
        data: dataHora.toISOString().split("T")[0],
        hora: dataHora.toTimeString().slice(0, 5),
        duracao: consulta.duracao,
        tipoConsulta: consulta.tipoConsulta || "",
        procedimento: consulta.procedimento || "",
        status: consulta.status,
        observacoes: consulta.observacoes || "",
        valorEstimado: consulta.valorEstimado?.toString() || "",
        classificacaoRisco: consulta.classificacaoRisco || "ASA I",
      });
    }
  }, [consulta]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!consulta) return;

    setLoading(true);
    try {
      const dataHora = `${formData.data}T${formData.hora}:00`;
      
      await onSave(consulta.id, {
        utenteId: formData.utenteId,
        medicoId: formData.medicoId && formData.medicoId !== "__none__" ? formData.medicoId : null,
        dataHora,
        duracao: formData.duracao,
        tipoConsulta: formData.tipoConsulta || null,
        procedimento: formData.procedimento || null,
        status: formData.status,
        observacoes: formData.observacoes || null,
        valorEstimado: formData.valorEstimado ? parseFloat(formData.valorEstimado) : null,
        classificacaoRisco: formData.classificacaoRisco || null,
      });
      
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar consulta:", error);
      alert(error instanceof Error ? error.message : "Erro ao atualizar consulta");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!consulta) return;

    setLoading(true);
    try {
      await onDelete(consulta.id);
      setShowDeleteConfirm(false);
      onClose();
    } catch (error) {
      console.error("Erro ao eliminar consulta:", error);
      alert("Erro ao eliminar consulta");
    } finally {
      setLoading(false);
    }
  };

  if (!consulta) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-purple-600">Editar Consulta</DialogTitle>
        </DialogHeader>

        {showDeleteConfirm ? (
          <div className="space-y-4">
            <p className="text-center text-lg">Tem certeza que deseja eliminar esta consulta?</p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-xl"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Eliminando..." : "Sim, Eliminar"}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Status */}
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value: Consulta["status"]) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Utente */}
            <div>
              <Label htmlFor="utente" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Utente *
              </Label>
              <Select value={formData.utenteId} onValueChange={(value) => setFormData({ ...formData, utenteId: value })}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {utentes.map((utente) => (
                    <SelectItem key={utente.id} value={utente.id}>
                      {utente.nome}
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
                  <SelectValue placeholder="Nenhum" />
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
                className="rounded-xl min-h-[100px]"
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-xl text-red-600 hover:bg-red-50"
                disabled={loading}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </Button>
              <div className="flex-1 flex gap-3">
                <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl" disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700" disabled={loading}>
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

