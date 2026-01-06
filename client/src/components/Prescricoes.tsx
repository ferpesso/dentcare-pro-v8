import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";

interface Medicamento {
  nome: string;
  dosagem: string;
  frequencia: string;
  duracao: string;
  observacoes?: string;
}

interface Prescricao {
  id?: string;
  dataPrescricao: string;
  medicamentos: Medicamento[];
  diagnostico?: string;
  observacoes?: string;
}

interface PrescricoesProps {
  utenteId: string;
  prescricoes?: Prescricao[];
  onSalvar?: (prescricoes: Prescricao[]) => void;
}

// Templates comuns
const MEDICAMENTOS_COMUNS = [
  { nome: "Amoxicilina", dosagem: "500mg", frequencia: "8/8h", duracao: "7 dias" },
  { nome: "Ibuprofeno", dosagem: "600mg", frequencia: "8/8h", duracao: "3 dias" },
  { nome: "Paracetamol", dosagem: "1000mg", frequencia: "8/8h", duracao: "3 dias" },
  { nome: "Nimesulida", dosagem: "100mg", frequencia: "12/12h", duracao: "5 dias" },
  { nome: "Azitromicina", dosagem: "500mg", frequencia: "24/24h", duracao: "3 dias" },
  { nome: "Clorexidina 0,12%", dosagem: "10ml", frequencia: "12/12h", duracao: "7 dias" },
];

export default function Prescricoes({ utenteId, prescricoes = [], onSalvar }: PrescricoesProps) {
  const [lista, setLista] = useState<Prescricao[]>(prescricoes);
  const [editando, setEditando] = useState<Prescricao | null>(null);
  const [novo, setNovo] = useState(false);

  const handleNovo = () => {
    setEditando({
      dataPrescricao: new Date().toISOString().split("T")[0],
      medicamentos: [],
    });
    setNovo(true);
  };

  const handleAdicionarMedicamento = () => {
    if (!editando) return;
    setEditando({
      ...editando,
      medicamentos: [
        ...editando.medicamentos,
        { nome: "", dosagem: "", frequencia: "", duracao: "" },
      ],
    });
  };

  const handleAdicionarTemplate = (template: Medicamento) => {
    if (!editando) return;
    setEditando({
      ...editando,
      medicamentos: [...editando.medicamentos, { ...template }],
    });
  };

  const handleRemoverMedicamento = (index: number) => {
    if (!editando) return;
    setEditando({
      ...editando,
      medicamentos: editando.medicamentos.filter((_, i) => i !== index),
    });
  };

  const handleUpdateMedicamento = (index: number, campo: keyof Medicamento, valor: string) => {
    if (!editando) return;
    const novos = [...editando.medicamentos];
    novos[index] = { ...novos[index], [campo]: valor };
    setEditando({ ...editando, medicamentos: novos });
  };

  const handleSalvar = () => {
    if (!editando || editando.medicamentos.length === 0) {
      toast.error("Adicione pelo menos um medicamento!");
      return;
    }
    if (novo) {
      setLista([...lista, { ...editando, id: Date.now().toString() }]);
    } else {
      setLista(lista.map((p) => (p.id === editando.id ? editando : p)));
    }
    setEditando(null);
    setNovo(false);
    toast.success("Prescrição salva!");
  };

  const handleRemover = (id: string) => {
    if (confirm("Remover esta prescrição?")) {
      setLista(lista.filter((p) => p.id !== id));
      toast.success("Prescrição removida!");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Prescrições</CardTitle>
              <CardDescription>Histórico de prescrições médicas</CardDescription>
            </div>
            <Button onClick={handleNovo} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Prescrição
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {lista.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma prescrição registada</p>
          ) : (
            <div className="space-y-4">
              {lista.map((prescricao) => (
                <div key={prescricao.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">{prescricao.dataPrescricao}</span>
                      </div>
                      {prescricao.diagnostico && (
                        <p className="text-sm text-muted-foreground">{prescricao.diagnostico}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditando(prescricao);
                          setNovo(false);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemover(prescricao.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {prescricao.medicamentos.map((med, idx) => (
                      <div key={idx} className="bg-muted p-2 rounded text-sm">
                        <p className="font-medium">{med.nome}</p>
                        <p className="text-muted-foreground">
                          {med.dosagem} • {med.frequencia} • {med.duracao}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {editando && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {novo ? "Nova Prescrição" : "Editar Prescrição"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data *</label>
                <Input
                  type="date"
                  value={editando.dataPrescricao}
                  onChange={(e) => setEditando({ ...editando, dataPrescricao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Diagnóstico</label>
                <Input
                  value={editando.diagnostico || ""}
                  onChange={(e) => setEditando({ ...editando, diagnostico: e.target.value })}
                  placeholder="Ex: Pulpite aguda"
                />
              </div>
            </div>

            {/* Templates Rápidos */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Templates Rápidos</label>
              <div className="flex flex-wrap gap-2">
                {MEDICAMENTOS_COMUNS.map((template, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAdicionarTemplate(template)}
                  >
                    + {template.nome}
                  </Button>
                ))}
              </div>
            </div>

            {/* Medicamentos */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Medicamentos</label>
              {editando.medicamentos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum medicamento adicionado
                </p>
              ) : (
                <div className="space-y-3">
                  {editando.medicamentos.map((med, idx) => (
                    <div key={idx} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Medicamento {idx + 1}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoverMedicamento(idx)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={med.nome}
                          onChange={(e) => handleUpdateMedicamento(idx, "nome", e.target.value)}
                          placeholder="Nome do medicamento"
                        />
                        <Input
                          value={med.dosagem}
                          onChange={(e) => handleUpdateMedicamento(idx, "dosagem", e.target.value)}
                          placeholder="Dosagem (ex: 500mg)"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={med.frequencia}
                          onChange={(e) =>
                            handleUpdateMedicamento(idx, "frequencia", e.target.value)
                          }
                          placeholder="Frequência (ex: 8/8h)"
                        />
                        <Input
                          value={med.duracao}
                          onChange={(e) => handleUpdateMedicamento(idx, "duracao", e.target.value)}
                          placeholder="Duração (ex: 7 dias)"
                        />
                      </div>
                      <Input
                        value={med.observacoes || ""}
                        onChange={(e) =>
                          handleUpdateMedicamento(idx, "observacoes", e.target.value)
                        }
                        placeholder="Observações (opcional)"
                      />
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="outline"
                onClick={handleAdicionarMedicamento}
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar Medicamento
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Observações Gerais</label>
              <Textarea
                value={editando.observacoes || ""}
                onChange={(e) => setEditando({ ...editando, observacoes: e.target.value })}
                placeholder="Instruções adicionais..."
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSalvar} className="flex-1">
                Salvar Prescrição
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditando(null);
                  setNovo(false);
                }}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {lista.length > 0 && !editando && (
        <Button onClick={() => onSalvar?.(lista)} className="w-full">
          Guardar Alterações
        </Button>
      )}
    </div>
  );
}

