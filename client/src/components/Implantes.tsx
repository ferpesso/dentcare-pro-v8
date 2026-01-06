import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Implante {
  id?: string;
  posicao: string;
  marca?: string;
  modelo?: string;
  diametro?: string;
  comprimento?: string;
  lote?: string;
  dataColocacao?: string;
  dataCarga?: string;
  tipoProtese?: string;
  status: "planejado" | "colocado" | "osseointegrado" | "protese_instalada" | "falha";
  observacoes?: string;
}

interface ImplantesProps {
  utenteId: string;
  implantes?: Implante[];
  onSalvar?: (implantes: Implante[]) => void;
}

const STATUS_LABELS = {
  planejado: "Planejado",
  colocado: "Colocado",
  osseointegrado: "Osseointegrado",
  protese_instalada: "Prótese Instalada",
  falha: "Falha",
};

export default function Implantes({ utenteId, implantes = [], onSalvar }: ImplantesProps) {
  const [lista, setLista] = useState<Implante[]>(implantes);
  const [editando, setEditando] = useState<Implante | null>(null);
  const [novo, setNovo] = useState(false);

  const handleNovo = () => {
    setEditando({ posicao: "", status: "planejado" });
    setNovo(true);
  };

  const handleSalvar = () => {
    if (!editando?.posicao) {
      toast.error("Preencha a posição!");
      return;
    }
    if (novo) {
      setLista([...lista, { ...editando, id: Date.now().toString() }]);
    } else {
      setLista(lista.map((i) => (i.id === editando.id ? editando : i)));
    }
    setEditando(null);
    setNovo(false);
    toast.success("Implante salvo!");
  };

  const handleRemover = (id: string) => {
    if (confirm("Remover este implante?")) {
      setLista(lista.filter((i) => i.id !== id));
      toast.success("Implante removido!");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Implantes</CardTitle>
              <CardDescription>Gestão de implantes dentários</CardDescription>
            </div>
            <Button onClick={handleNovo} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Implante
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {lista.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum implante registado</p>
          ) : (
            <div className="space-y-4">
              {lista.map((imp) => (
                <div key={imp.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono font-bold">Posição {imp.posicao}</span>
                      <Badge>{STATUS_LABELS[imp.status]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {imp.marca} {imp.modelo} • {imp.diametro} × {imp.comprimento}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditando(imp); setNovo(false); }}>
                      Editar
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleRemover(imp.id!)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
            <CardTitle className="text-base">{novo ? "Novo Implante" : "Editar Implante"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Posição *</label>
                <Input value={editando.posicao} onChange={(e) => setEditando({ ...editando, posicao: e.target.value })} placeholder="Ex: 16" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Marca</label>
                <Input value={editando.marca || ""} onChange={(e) => setEditando({ ...editando, marca: e.target.value })} placeholder="Ex: Straumann" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Modelo</label>
                <Input value={editando.modelo || ""} onChange={(e) => setEditando({ ...editando, modelo: e.target.value })} placeholder="Ex: BLT" />
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Diâmetro</label>
                <Input value={editando.diametro || ""} onChange={(e) => setEditando({ ...editando, diametro: e.target.value })} placeholder="4.1mm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Comprimento</label>
                <Input value={editando.comprimento || ""} onChange={(e) => setEditando({ ...editando, comprimento: e.target.value })} placeholder="10mm" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Lote</label>
                <Input value={editando.lote || ""} onChange={(e) => setEditando({ ...editando, lote: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={editando.status} onValueChange={(v: any) => setEditando({ ...editando, status: v })}>
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
                <label className="text-sm font-medium">Data Colocação</label>
                <Input type="date" value={editando.dataColocacao || ""} onChange={(e) => setEditando({ ...editando, dataColocacao: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Carga</label>
                <Input type="date" value={editando.dataCarga || ""} onChange={(e) => setEditando({ ...editando, dataCarga: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo Prótese</label>
                <Input value={editando.tipoProtese || ""} onChange={(e) => setEditando({ ...editando, tipoProtese: e.target.value })} placeholder="Coroa unitária" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Observações</label>
              <Textarea value={editando.observacoes || ""} onChange={(e) => setEditando({ ...editando, observacoes: e.target.value })} rows={2} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSalvar} className="flex-1">Salvar</Button>
              <Button variant="outline" onClick={() => { setEditando(null); setNovo(false); }}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {lista.length > 0 && !editando && (
        <Button onClick={() => onSalvar?.(lista)} className="w-full">Guardar Alterações</Button>
      )}
    </div>
  );
}

