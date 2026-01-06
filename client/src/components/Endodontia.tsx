import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TratamentoEndodontico {
  id?: string;
  numeroDente: string;
  numeroCanais: string;
  comprimentoTrabalho: Record<string, string>;
  tecnicaInstrumentacao?: string;
  materialObturacao?: string;
  dataInicio?: string;
  dataFinalizacao?: string;
  status: "em_andamento" | "concluido" | "retratamento";
  observacoes?: string;
}

interface EndodontiaProps {
  utenteId: string;
  tratamentos?: TratamentoEndodontico[];
  onSalvar?: (tratamentos: TratamentoEndodontico[]) => void;
}

export default function Endodontia({ utenteId, tratamentos = [], onSalvar }: EndodontiaProps) {
  const [lista, setLista] = useState<TratamentoEndodontico[]>(tratamentos);
  const [editando, setEditando] = useState<TratamentoEndodontico | null>(null);
  const [novoTratamento, setNovoTratamento] = useState(false);

  const handleNovo = () => {
    setEditando({
      numeroDente: "",
      numeroCanais: "1",
      comprimentoTrabalho: { "Canal 1": "" },
      status: "em_andamento",
    });
    setNovoTratamento(true);
  };

  const handleEditar = (tratamento: TratamentoEndodontico) => {
    setEditando(tratamento);
    setNovoTratamento(false);
  };

  const handleSalvar = () => {
    if (!editando || !editando.numeroDente) {
      toast.error("Preencha o número do dente!");
      return;
    }

    if (novoTratamento) {
      setLista([...lista, { ...editando, id: Date.now().toString() }]);
    } else {
      setLista(lista.map((t) => (t.id === editando.id ? editando : t)));
    }

    setEditando(null);
    setNovoTratamento(false);
    toast.success("Tratamento salvo!");
  };

  const handleRemover = (id: string) => {
    if (confirm("Remover este tratamento?")) {
      setLista(lista.filter((t) => t.id !== id));
      toast.success("Tratamento removido!");
    }
  };

  const handleSalvarTodos = () => {
    if (onSalvar) {
      onSalvar(lista);
    }
    toast.success("Endodontia salva com sucesso!");
  };

  const updateCanais = (num: number) => {
    if (!editando) return;
    const comprimento: Record<string, string> = {};
    for (let i = 1; i <= num; i++) {
      comprimento[`Canal ${i}`] = editando.comprimentoTrabalho[`Canal ${i}`] || "";
    }
    setEditando({ ...editando, numeroCanais: num.toString(), comprimentoTrabalho: comprimento });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Endodontia</CardTitle>
              <CardDescription>Tratamentos de canal realizados</CardDescription>
            </div>
            <Button onClick={handleNovo} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Tratamento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {lista.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum tratamento endodôntico registado
            </p>
          ) : (
            <div className="space-y-4">
              {lista.map((trat) => (
                <div
                  key={trat.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono font-bold">Dente {trat.numeroDente}</span>
                      <Badge
                        variant={
                          trat.status === "concluido"
                            ? "default"
                            : trat.status === "em_andamento"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {trat.status === "concluido"
                          ? "Concluído"
                          : trat.status === "em_andamento"
                          ? "Em Andamento"
                          : "Retratamento"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {trat.numeroCanais} {parseInt(trat.numeroCanais) === 1 ? "canal" : "canais"} •{" "}
                      {trat.tecnicaInstrumentacao || "Sem técnica especificada"}
                    </p>
                    {trat.dataInicio && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Início: {trat.dataInicio}
                        {trat.dataFinalizacao && ` • Fim: ${trat.dataFinalizacao}`}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditar(trat)}>
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemover(trat.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Editor */}
      {editando && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {novoTratamento ? "Novo Tratamento Endodôntico" : "Editar Tratamento"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Dente *</label>
                <Input
                  value={editando.numeroDente}
                  onChange={(e) => setEditando({ ...editando, numeroDente: e.target.value })}
                  placeholder="Ex: 16"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Número de Canais *</label>
                <Select
                  value={editando.numeroCanais}
                  onValueChange={(v) => updateCanais(parseInt(v))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {n} {n === 1 ? "canal" : "canais"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Comprimento de Trabalho */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Comprimento de Trabalho</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(editando.comprimentoTrabalho).map((canal) => (
                  <div key={canal} className="flex items-center gap-2">
                    <span className="text-sm w-20">{canal}:</span>
                    <Input
                      value={editando.comprimentoTrabalho[canal]}
                      onChange={(e) =>
                        setEditando({
                          ...editando,
                          comprimentoTrabalho: {
                            ...editando.comprimentoTrabalho,
                            [canal]: e.target.value,
                          },
                        })
                      }
                      placeholder="Ex: 21mm"
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Técnica de Instrumentação</label>
                <Input
                  value={editando.tecnicaInstrumentacao || ""}
                  onChange={(e) =>
                    setEditando({ ...editando, tecnicaInstrumentacao: e.target.value })
                  }
                  placeholder="Ex: Rotatória ProTaper"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Material de Obturação</label>
                <Input
                  value={editando.materialObturacao || ""}
                  onChange={(e) =>
                    setEditando({ ...editando, materialObturacao: e.target.value })
                  }
                  placeholder="Ex: Guta-percha + AH Plus"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Início</label>
                <Input
                  type="date"
                  value={editando.dataInicio || ""}
                  onChange={(e) => setEditando({ ...editando, dataInicio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Finalização</label>
                <Input
                  type="date"
                  value={editando.dataFinalizacao || ""}
                  onChange={(e) => setEditando({ ...editando, dataFinalizacao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={editando.status}
                  onValueChange={(v: any) => setEditando({ ...editando, status: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="retratamento">Retratamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Observações</label>
              <Textarea
                value={editando.observacoes || ""}
                onChange={(e) => setEditando({ ...editando, observacoes: e.target.value })}
                placeholder="Notas sobre o tratamento..."
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSalvar} className="flex-1">
                Salvar Tratamento
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditando(null);
                  setNovoTratamento(false);
                }}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {lista.length > 0 && !editando && (
        <Button onClick={handleSalvarTodos} className="w-full">
          Guardar Todas as Alterações
        </Button>
      )}
    </div>
  );
}

