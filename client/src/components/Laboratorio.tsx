import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TrabalhoLaboratorio {
  id?: string;
  tipoTrabalho: string;
  dentes?: string;
  laboratorioNome?: string;
  cor?: string;
  material?: string;
  dataEnvio?: string;
  dataPrevisao?: string;
  dataRecepcao?: string;
  dataInstalacao?: string;
  custo?: string;
  status: "pendente" | "enviado" | "em_producao" | "recebido" | "instalado" | "ajuste_necessario";
  observacoes?: string;
}

interface LaboratorioProps {
  utenteId: string;
  trabalhos?: TrabalhoLaboratorio[];
  onSalvar?: (trabalhos: TrabalhoLaboratorio[]) => void;
}

const TIPOS_TRABALHO = [
  "Coroa",
  "Ponte",
  "Prótese Total",
  "Prótese Parcial",
  "Faceta",
  "Inlay/Onlay",
  "Provisório",
  "Placa Oclusal",
  "Aparelho Ortodôntico",
  "Contenção",
];

const STATUS_LABELS = {
  pendente: "Pendente",
  enviado: "Enviado",
  em_producao: "Em Produção",
  recebido: "Recebido",
  instalado: "Instalado",
  ajuste_necessario: "Ajuste Necessário",
};

const STATUS_COLORS = {
  pendente: "secondary",
  enviado: "default",
  em_producao: "default",
  recebido: "default",
  instalado: "default",
  ajuste_necessario: "destructive",
} as const;

export default function Laboratorio({ utenteId, trabalhos = [], onSalvar }: LaboratorioProps) {
  const [lista, setLista] = useState<TrabalhoLaboratorio[]>(trabalhos);
  const [editando, setEditando] = useState<TrabalhoLaboratorio | null>(null);
  const [novo, setNovo] = useState(false);

  const handleNovo = () => {
    setEditando({
      tipoTrabalho: "",
      status: "pendente",
      dataEnvio: new Date().toISOString().split("T")[0],
    });
    setNovo(true);
  };

  const handleSalvar = () => {
    if (!editando?.tipoTrabalho) {
      toast.error("Preencha o tipo de trabalho!");
      return;
    }
    if (novo) {
      setLista([...lista, { ...editando, id: Date.now().toString() }]);
    } else {
      setLista(lista.map((t) => (t.id === editando.id ? editando : t)));
    }
    setEditando(null);
    setNovo(false);
    toast.success("Trabalho salvo!");
  };

  const handleRemover = (id: string) => {
    if (confirm("Remover este trabalho?")) {
      setLista(lista.filter((t) => t.id !== id));
      toast.success("Trabalho removido!");
    }
  };

  const calcularPrazo = (trabalho: TrabalhoLaboratorio) => {
    if (!trabalho.dataEnvio || !trabalho.dataPrevisao) return null;
    const hoje = new Date();
    const previsao = new Date(trabalho.dataPrevisao);
    const diff = Math.ceil((previsao.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Laboratório</CardTitle>
              <CardDescription>Trabalhos laboratoriais em andamento</CardDescription>
            </div>
            <Button onClick={handleNovo} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Trabalho
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {lista.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum trabalho registado</p>
          ) : (
            <div className="space-y-4">
              {lista.map((trabalho) => {
                const prazo = calcularPrazo(trabalho);
                return (
                  <div
                    key={trabalho.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold">{trabalho.tipoTrabalho}</span>
                        <Badge variant={STATUS_COLORS[trabalho.status]}>
                          {STATUS_LABELS[trabalho.status]}
                        </Badge>
                        {prazo !== null && trabalho.status !== "instalado" && (
                          <Badge variant={prazo < 0 ? "destructive" : "outline"}>
                            {prazo < 0 ? `Atrasado ${Math.abs(prazo)}d` : `${prazo}d restantes`}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {trabalho.dentes && <p>Dentes: {trabalho.dentes}</p>}
                        {trabalho.laboratorioNome && <p>Lab: {trabalho.laboratorioNome}</p>}
                        {trabalho.material && trabalho.cor && (
                          <p>
                            {trabalho.material} • Cor {trabalho.cor}
                          </p>
                        )}
                        {trabalho.custo && <p className="font-medium">Custo: {trabalho.custo}€</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditando(trabalho);
                          setNovo(false);
                        }}
                      >
                        Editar
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleRemover(trabalho.id!)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {editando && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {novo ? "Novo Trabalho de Laboratório" : "Editar Trabalho"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Trabalho *</label>
                <Select
                  value={editando.tipoTrabalho}
                  onValueChange={(v) => setEditando({ ...editando, tipoTrabalho: v })}
                >
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {TIPOS_TRABALHO.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Dentes</label>
                <Input
                  value={editando.dentes || ""}
                  onChange={(e) => setEditando({ ...editando, dentes: e.target.value })}
                  placeholder="Ex: 11, 12, 13"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Laboratório</label>
                <Input
                  value={editando.laboratorioNome || ""}
                  onChange={(e) => setEditando({ ...editando, laboratorioNome: e.target.value })}
                  placeholder="Nome do laboratório"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Material</label>
                <Input
                  value={editando.material || ""}
                  onChange={(e) => setEditando({ ...editando, material: e.target.value })}
                  placeholder="Ex: Zircónia"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cor</label>
                <Input
                  value={editando.cor || ""}
                  onChange={(e) => setEditando({ ...editando, cor: e.target.value })}
                  placeholder="Ex: A2"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Envio</label>
                <Input
                  type="date"
                  value={editando.dataEnvio || ""}
                  onChange={(e) => setEditando({ ...editando, dataEnvio: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Previsão</label>
                <Input
                  type="date"
                  value={editando.dataPrevisao || ""}
                  onChange={(e) => setEditando({ ...editando, dataPrevisao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Recepção</label>
                <Input
                  type="date"
                  value={editando.dataRecepcao || ""}
                  onChange={(e) => setEditando({ ...editando, dataRecepcao: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Instalação</label>
                <Input
                  type="date"
                  value={editando.dataInstalacao || ""}
                  onChange={(e) => setEditando({ ...editando, dataInstalacao: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Custo (€)</label>
                <Input
                  type="number"
                  value={editando.custo || ""}
                  onChange={(e) => setEditando({ ...editando, custo: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={editando.status}
                  onValueChange={(v: any) => setEditando({ ...editando, status: v })}
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Observações</label>
              <Textarea
                value={editando.observacoes || ""}
                onChange={(e) => setEditando({ ...editando, observacoes: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSalvar} className="flex-1">Salvar</Button>
              <Button variant="outline" onClick={() => { setEditando(null); setNovo(false); }}>
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

