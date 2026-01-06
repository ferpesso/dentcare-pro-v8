import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Stethoscope, FileText, DollarSign, AlertTriangle, UserPlus, Search, X } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ModalNovaConsultaV2Props {
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
  utentes: Array<any>;
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

export default function ModalNovaConsultaV2({
  isOpen,
  onClose,
  onSave,
  utentes,
  medicos,
  dataHoraInicial,
}: ModalNovaConsultaV2Props) {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [pesquisaUtente, setPesquisaUtente] = useState("");
  const [utenteSelecionado, setUtenteSelecionado] = useState<any>(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  
  const [formData, setFormData] = useState(() => {
    const dataHora = dataHoraInicial || new Date();
    return {
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

  // Resetar ao abrir
  useEffect(() => {
    if (isOpen) {
      setPesquisaUtente("");
      setUtenteSelecionado(null);
      setMostrarResultados(false);
    }
  }, [isOpen]);

  // Filtrar utentes pela pesquisa
  const utentesFiltrados = useMemo(() => {
    if (!pesquisaUtente.trim()) return [];

    const termo = pesquisaUtente.toLowerCase();
    
    return utentes.filter((utente) => {
      // Buscar por nome
      if (utente.nomeCompleto?.toLowerCase().includes(termo)) return true;
      
      // Buscar por NIF
      if (utente.nif?.toLowerCase().includes(termo)) return true;
      
      // Buscar por número de utente
      if (utente.numeroUtente?.toLowerCase().includes(termo)) return true;
      
      // Buscar por SNS
      if (utente.numUtenteSns?.toLowerCase().includes(termo)) return true;
      
      // Buscar por contacto
      const contacto = typeof utente.contacto === "string" 
        ? JSON.parse(utente.contacto) 
        : utente.contacto;
      
      if (contacto?.telefone?.includes(termo)) return true;
      if (contacto?.telemovel?.includes(termo)) return true;
      if (contacto?.email?.toLowerCase().includes(termo)) return true;
      
      // Buscar por data de nascimento
      if (utente.dataNascimento?.includes(termo)) return true;
      
      return false;
    }).slice(0, 10); // Limitar a 10 resultados
  }, [utentes, pesquisaUtente]);

  // Calcular idade
  const calcularIdade = (dataNascimento: string) => {
    const data = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - data.getFullYear();
    const mes = hoje.getMonth() - data.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < data.getDate())) {
      idade--;
    }
    return idade;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!utenteSelecionado) {
      alert("Por favor, selecione um utente");
      return;
    }

    setLoading(true);
    try {
      const dataHora = `${formData.data}T${formData.hora}:00`;
      
      await onSave({
        utenteId: utenteSelecionado.id,
        medicoId: formData.medicoId && formData.medicoId !== "__none__" ? formData.medicoId : null,
        dataHora,
        duracao: formData.duracao,
        tipoConsulta: formData.tipoConsulta || null,
        procedimento: formData.procedimento || null,
        observacoes: formData.observacoes || null,
        valorEstimado: formData.valorEstimado ? parseFloat(formData.valorEstimado) : null,
        classificacaoRisco: formData.classificacaoRisco || null,
        status: "agendada",
      });

      // Reset form
      setPesquisaUtente("");
      setUtenteSelecionado(null);
      setFormData({
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
      onClose();
    } catch (error) {
      console.error("Erro ao criar consulta:", error);
      alert("Erro ao criar consulta");
    } finally {
      setLoading(false);
    }
  };

  const handleNovoUtente = () => {
    // Por enquanto, apenas mostra alerta
    // TODO: Implementar modal inline de criar utente
    alert("Funcionalidade de criar utente inline em desenvolvimento.\n\nPor favor, vá em Utentes > Novo Utente para criar um novo paciente.");
  };

  const selecionarUtente = (utente: any) => {
    setUtenteSelecionado(utente);
    setPesquisaUtente(utente.nomeCompleto);
    setMostrarResultados(false);
  };

  const limparSelecao = () => {
    setUtenteSelecionado(null);
    setPesquisaUtente("");
    setMostrarResultados(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            Nova Consulta
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pesquisa de Utente */}
          <div className="space-y-2">
            <Label className="text-base font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Paciente *
            </Label>
            
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Pesquisar por nome, NIF, telemóvel, data de nascimento..."
                  value={pesquisaUtente}
                  onChange={(e) => {
                    setPesquisaUtente(e.target.value);
                    setMostrarResultados(true);
                    if (!e.target.value.trim()) {
                      setUtenteSelecionado(null);
                    }
                  }}
                  onFocus={() => setMostrarResultados(true)}
                  className="pl-10 pr-10"
                />
                {utenteSelecionado && (
                  <button
                    type="button"
                    onClick={limparSelecao}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Resultados da Pesquisa */}
              {mostrarResultados && pesquisaUtente.trim() && !utenteSelecionado && (
                <Card className="absolute z-50 w-full mt-2 max-h-[300px] overflow-y-auto shadow-lg">
                  <CardContent className="p-2">
                    {utentesFiltrados.length > 0 ? (
                      <div className="space-y-1">
                        {utentesFiltrados.map((utente) => {
                          const contacto = typeof utente.contacto === "string" 
                            ? JSON.parse(utente.contacto) 
                            : utente.contacto;
                          
                          return (
                            <button
                              key={utente.id}
                              type="button"
                              onClick={() => selecionarUtente(utente)}
                              className="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200"
                            >
                              <div className="font-semibold text-gray-900">{utente.nomeCompleto}</div>
                              <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                                {utente.nif && <div>NIF: {utente.nif}</div>}
                                {utente.numeroUtente && <div>Nº Utente: {utente.numeroUtente}</div>}
                                {contacto?.telefone && <div>Tel: {contacto.telefone}</div>}
                                {utente.dataNascimento && (
                                  <div>
                                    Nascimento: {new Date(utente.dataNascimento).toLocaleDateString("pt-PT")} 
                                    ({calcularIdade(utente.dataNascimento)} anos)
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 text-center">
                        <p className="text-gray-600 mb-3">Nenhum utente encontrado</p>
                        <Button
                          type="button"
                          onClick={handleNovoUtente}
                          variant="outline"
                          className="gap-2"
                        >
                          <UserPlus className="h-4 w-4" />
                          Criar Novo Utente
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Utente Selecionado */}
            {utenteSelecionado && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-blue-900">{utenteSelecionado.nomeCompleto}</div>
                      <div className="text-sm text-blue-700 mt-1">
                        {utenteSelecionado.numeroUtente && <span>Nº {utenteSelecionado.numeroUtente}</span>}
                        {utenteSelecionado.dataNascimento && (
                          <span className="ml-3">
                            {calcularIdade(utenteSelecionado.dataNascimento)} anos
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={limparSelecao}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botão Criar Utente */}
            {!utenteSelecionado && (
              <Button
                type="button"
                onClick={handleNovoUtente}
                variant="outline"
                className="w-full gap-2 border-dashed"
              >
                <UserPlus className="h-4 w-4" />
                Criar Novo Utente
              </Button>
            )}
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Data *
              </Label>
              <Input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Hora *
              </Label>
              <Input
                type="time"
                value={formData.hora}
                onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Duração e Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Duração (minutos) *</Label>
              <Input
                type="number"
                value={formData.duracao}
                onChange={(e) => setFormData({ ...formData, duracao: parseInt(e.target.value) })}
                min={15}
                step={15}
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Tipo de Consulta
              </Label>
              <Select value={formData.tipoConsulta} onValueChange={(value) => setFormData({ ...formData, tipoConsulta: value })}>
                <SelectTrigger>
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
          </div>

          {/* Procedimento */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Procedimento
            </Label>
            <Input
              value={formData.procedimento}
              onChange={(e) => setFormData({ ...formData, procedimento: e.target.value })}
              placeholder="Ex: Limpeza dente 16"
            />
          </div>

          {/* Valor e Risco */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Valor Estimado (€)
              </Label>
              <Input
                type="number"
                value={formData.valorEstimado}
                onChange={(e) => setFormData({ ...formData, valorEstimado: e.target.value })}
                min={0}
                step={0.01}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Classificação de Risco
              </Label>
              <Select value={formData.classificacaoRisco} onValueChange={(value) => setFormData({ ...formData, classificacaoRisco: value })}>
                <SelectTrigger>
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
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !utenteSelecionado} className="flex-1">
              {loading ? "A guardar..." : "Criar Consulta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

