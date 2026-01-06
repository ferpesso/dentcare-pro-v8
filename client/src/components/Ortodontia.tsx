import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface Ortodontia {
  id?: string;
  tipoAparelho?: string;
  dataInicio?: string;
  previsaoTermino?: string;
  dataTermino?: string;
  diagnostico?: string;
  planoTratamento?: string;
  status: "planejamento" | "ativo" | "contencao" | "concluido";
  observacoes?: string;
  consultas: Array<{
    id: string;
    dataConsulta: string;
    procedimentos?: string;
    observacoes?: string;
    proximaConsulta?: string;
  }>;
}

interface OrtodontiaProps {
  utenteId: string;
  dados?: Ortodontia;
  onSalvar?: (dados: Ortodontia) => void;
}

const STATUS_LABELS = {
  planejamento: "Planejamento",
  ativo: "Ativo",
  contencao: "Contenção",
  concluido: "Concluído",
};

export default function Ortodontia({ utenteId, dados, onSalvar }: OrtodontiaProps) {
  const [tratamento, setTratamento] = useState<Ortodontia>(
    dados || {
      status: "planejamento",
      consultas: [],
    }
  );

  const [novaConsulta, setNovaConsulta] = useState({
    dataConsulta: new Date().toISOString().split("T")[0],
    procedimentos: "",
    observacoes: "",
    proximaConsulta: "",
  });

  const handleAdicionarConsulta = () => {
    if (!novaConsulta.dataConsulta) {
      toast.error("Preencha a data da consulta!");
      return;
    }
    setTratamento({
      ...tratamento,
      consultas: [
        ...tratamento.consultas,
        { ...novaConsulta, id: Date.now().toString() },
      ],
    });
    setNovaConsulta({
      dataConsulta: new Date().toISOString().split("T")[0],
      procedimentos: "",
      observacoes: "",
      proximaConsulta: "",
    });
    toast.success("Consulta adicionada!");
  };

  const handleSalvar = () => {
    if (onSalvar) {
      onSalvar(tratamento);
    }
    toast.success("Ortodontia salva com sucesso!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ortodontia</CardTitle>
          <CardDescription>Plano de tratamento ortodôntico</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Aparelho</label>
              <Input
                value={tratamento.tipoAparelho || ""}
                onChange={(e) => setTratamento({ ...tratamento, tipoAparelho: e.target.value })}
                placeholder="Ex: Fixo metálico"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={tratamento.status}
                onValueChange={(v: any) => setTratamento({ ...tratamento, status: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Início</label>
              <Input
                type="date"
                value={tratamento.dataInicio || ""}
                onChange={(e) => setTratamento({ ...tratamento, dataInicio: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Previsão Término</label>
              <Input
                type="date"
                value={tratamento.previsaoTermino || ""}
                onChange={(e) => setTratamento({ ...tratamento, previsaoTermino: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Término</label>
              <Input
                type="date"
                value={tratamento.dataTermino || ""}
                onChange={(e) => setTratamento({ ...tratamento, dataTermino: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Diagnóstico</label>
            <Textarea
              value={tratamento.diagnostico || ""}
              onChange={(e) => setTratamento({ ...tratamento, diagnostico: e.target.value })}
              placeholder="Classe II, apinhamento anterior..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Plano de Tratamento</label>
            <Textarea
              value={tratamento.planoTratamento || ""}
              onChange={(e) => setTratamento({ ...tratamento, planoTratamento: e.target.value })}
              placeholder="Extrações, expansão, alinhamento..."
              rows={3}
            />
          </div>

          <Button onClick={handleSalvar} className="w-full">
            Guardar Plano de Tratamento
          </Button>
        </CardContent>
      </Card>

      {/* Consultas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Consultas de Ortodontia</CardTitle>
          <CardDescription>Registo de consultas e procedimentos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tratamento.consultas.length > 0 && (
            <div className="space-y-2">
              {tratamento.consultas.map((consulta) => (
                <div key={consulta.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{consulta.dataConsulta}</span>
                    {consulta.proximaConsulta && (
                      <Badge variant="outline">Próxima: {consulta.proximaConsulta}</Badge>
                    )}
                  </div>
                  {consulta.procedimentos && (
                    <p className="text-sm text-muted-foreground">{consulta.procedimentos}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-4 space-y-4">
            <p className="text-sm font-medium">Nova Consulta</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data *</label>
                <Input
                  type="date"
                  value={novaConsulta.dataConsulta}
                  onChange={(e) => setNovaConsulta({ ...novaConsulta, dataConsulta: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Próxima Consulta</label>
                <Input
                  type="date"
                  value={novaConsulta.proximaConsulta}
                  onChange={(e) => setNovaConsulta({ ...novaConsulta, proximaConsulta: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Procedimentos</label>
              <Textarea
                value={novaConsulta.procedimentos}
                onChange={(e) => setNovaConsulta({ ...novaConsulta, procedimentos: e.target.value })}
                placeholder="Troca de arco, ativação..."
                rows={2}
              />
            </div>
            <Button onClick={handleAdicionarConsulta} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Consulta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

