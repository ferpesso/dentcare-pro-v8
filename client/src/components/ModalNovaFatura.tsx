/**
 * Modal para Criar Nova Fatura
 * DentCare PRO v8.0
 */

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Save } from "lucide-react";
import { trpc } from "@/lib/trpc";
import type { ItemFatura } from "@shared/types-financeiro";

interface ModalNovaFaturaProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModalNovaFatura({ open, onClose, onSuccess }: ModalNovaFaturaProps) {
  const [utenteId, setUtenteId] = useState("");
  const [dentista, setDentista] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [itens, setItens] = useState<Partial<ItemFatura>[]>([
    {
      descricao: "",
      quantidade: 1,
      precoUnitario: 0,
      desconto: 0,
      iva: 23,
      categoria: "consulta",
    },
  ]);

  const { data: utentes = [] } = trpc.utentes.listar.useQuery();
  const criarFatura = trpc.financeiro.criar.useMutation({
    onSuccess: () => {
      onSuccess();
    },
  });

  const adicionarItem = () => {
    setItens([
      ...itens,
      {
        descricao: "",
        quantidade: 1,
        precoUnitario: 0,
        desconto: 0,
        iva: 23,
        categoria: "tratamento",
      },
    ]);
  };

  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const atualizarItem = (index: number, campo: string, valor: any) => {
    const novosItens = [...itens];
    novosItens[index] = { ...novosItens[index], [campo]: valor };
    setItens(novosItens);
  };

  const calcularTotal = () => {
    return itens.reduce((total, item) => {
      const valorSemDesconto = (item.quantidade || 0) * (item.precoUnitario || 0);
      const valorDesconto = valorSemDesconto * ((item.desconto || 0) / 100);
      const valorComDesconto = valorSemDesconto - valorDesconto;
      const valorIva = valorComDesconto * ((item.iva || 0) / 100);
      return total + valorComDesconto + valorIva;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!utenteId || !dentista || !dataVencimento || itens.length === 0) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const utente = utentes.find((u) => u.id === utenteId);
    if (!utente) {
      alert("Utente não encontrado");
      return;
    }

    criarFatura.mutate({
      utenteId,
      utenteNome: utente.nomeCompleto,
      utenteNif: utente.nif || undefined,
      utenteMorada: utente.morada
        ? `${(utente.morada as any).rua}, ${(utente.morada as any).numero}, ${(utente.morada as any).codigoPostal} ${(utente.morada as any).localidade}`
        : undefined,
      dentista,
      dataVencimento,
      itens: itens.map((item) => ({
        descricao: item.descricao || "",
        quantidade: item.quantidade || 1,
        precoUnitario: item.precoUnitario || 0,
        desconto: item.desconto || 0,
        iva: item.iva || 23,
        categoria: item.categoria || "outro",
      })),
      observacoes: observacoes || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Fatura</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados do Utente e Dentista */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="utente">Utente *</Label>
              <Select value={utenteId} onValueChange={setUtenteId}>
                <SelectTrigger id="utente">
                  <SelectValue placeholder="Selecione o utente" />
                </SelectTrigger>
                <SelectContent>
                  {utentes.map((utente) => (
                    <SelectItem key={utente.id} value={utente.id}>
                      {utente.nomeCompleto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dentista">Dentista *</Label>
              <Input
                id="dentista"
                value={dentista}
                onChange={(e) => setDentista(e.target.value)}
                placeholder="Nome do dentista"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataVencimento">Data de Vencimento *</Label>
              <Input
                id="dataVencimento"
                type="date"
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Itens da Fatura */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Itens da Fatura</Label>
              <Button type="button" variant="outline" size="sm" onClick={adicionarItem}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>

            <div className="space-y-4">
              {itens.map((item, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Item {index + 1}</span>
                    {itens.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removerItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Descrição *</Label>
                      <Input
                        value={item.descricao}
                        onChange={(e) => atualizarItem(index, "descricao", e.target.value)}
                        placeholder="Ex: Consulta de avaliação"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Categoria</Label>
                      <Select
                        value={item.categoria}
                        onValueChange={(value) => atualizarItem(index, "categoria", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consulta">Consulta</SelectItem>
                          <SelectItem value="tratamento">Tratamento</SelectItem>
                          <SelectItem value="material">Material</SelectItem>
                          <SelectItem value="laboratorio">Laboratório</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Quantidade *</Label>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={item.quantidade}
                        onChange={(e) =>
                          atualizarItem(index, "quantidade", parseFloat(e.target.value))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Preço Unitário (€) *</Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.precoUnitario}
                        onChange={(e) =>
                          atualizarItem(index, "precoUnitario", parseFloat(e.target.value))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Desconto (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.desconto}
                        onChange={(e) =>
                          atualizarItem(index, "desconto", parseFloat(e.target.value))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>IVA (%)</Label>
                      <Select
                        value={String(item.iva)}
                        onValueChange={(value) => atualizarItem(index, "iva", parseFloat(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="6">6%</SelectItem>
                          <SelectItem value="13">13%</SelectItem>
                          <SelectItem value="23">23%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total (com IVA):</span>
              <span>
                {new Intl.NumberFormat("pt-PT", {
                  style: "currency",
                  currency: "EUR",
                }).format(calcularTotal())}
              </span>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={criarFatura.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {criarFatura.isPending ? "A criar..." : "Criar Fatura"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

