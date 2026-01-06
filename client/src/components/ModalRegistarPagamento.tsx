/**
 * Modal para Registar Pagamento
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
import { CreditCard, Save } from "lucide-react";
import { trpc } from "@/lib/trpc";
import type { Fatura, MetodoPagamento } from "@shared/types-financeiro";

interface ModalRegistarPagamentoProps {
  fatura: Fatura;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ModalRegistarPagamento({
  fatura,
  open,
  onClose,
  onSuccess,
}: ModalRegistarPagamentoProps) {
  const [valor, setValor] = useState(fatura.valorEmDivida);
  const [metodo, setMetodo] = useState<MetodoPagamento>("dinheiro");
  const [referencia, setReferencia] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const registarPagamento = trpc.financeiro.registarPagamento.useMutation({
    onSuccess: () => {
      onSuccess();
    },
  });

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(valor);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (valor <= 0) {
      alert("O valor do pagamento deve ser maior que zero");
      return;
    }

    if (valor > fatura.valorEmDivida) {
      if (
        !confirm(
          `O valor inserido (${formatarMoeda(valor)}) é maior que o valor em dívida (${formatarMoeda(fatura.valorEmDivida)}). Deseja continuar?`
        )
      ) {
        return;
      }
    }

    registarPagamento.mutate({
      faturaId: fatura.id,
      valor,
      metodo,
      referencia: referencia || undefined,
      observacoes: observacoes || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Registar Pagamento
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações da Fatura */}
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fatura:</span>
              <span className="font-medium">{fatura.numero}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Utente:</span>
              <span className="font-medium">{fatura.utenteNome}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total da Fatura:</span>
              <span className="font-medium">{formatarMoeda(fatura.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Já Pago:</span>
              <span className="font-medium text-green-600">
                {formatarMoeda(fatura.valorPago)}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-muted-foreground">Em Dívida:</span>
              <span className="font-bold text-red-600">
                {formatarMoeda(fatura.valorEmDivida)}
              </span>
            </div>
          </div>

          {/* Dados do Pagamento */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor a Pagar (€) *</Label>
              <Input
                id="valor"
                type="number"
                min="0.01"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(parseFloat(e.target.value))}
                required
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValor(fatura.valorEmDivida)}
                >
                  Pagar Total
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValor(fatura.valorEmDivida / 2)}
                >
                  Pagar Metade
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metodo">Método de Pagamento *</Label>
              <Select value={metodo} onValueChange={(value) => setMetodo(value as MetodoPagamento)}>
                <SelectTrigger id="metodo">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dinheiro">💵 Dinheiro</SelectItem>
                  <SelectItem value="mbway">📱 MB WAY</SelectItem>
                  <SelectItem value="multibanco">🏧 Multibanco</SelectItem>
                  <SelectItem value="cartao">💳 Cartão</SelectItem>
                  <SelectItem value="transferencia">🏦 Transferência</SelectItem>
                  <SelectItem value="cheque">📝 Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {metodo !== "dinheiro" && (
              <div className="space-y-2">
                <Label htmlFor="referencia">
                  Referência / Nº de Transação
                  {metodo === "cheque" && " / Nº do Cheque"}
                </Label>
                <Input
                  id="referencia"
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder={
                    metodo === "mbway"
                      ? "Ex: 912345678"
                      : metodo === "multibanco"
                      ? "Ex: MB123456789"
                      : metodo === "cheque"
                      ? "Ex: CHQ001234"
                      : "Referência da transação"
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações sobre o pagamento..."
                rows={3}
              />
            </div>
          </div>

          {/* Resumo */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Valor a Registar:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatarMoeda(valor)}
              </span>
            </div>
            {valor < fatura.valorEmDivida && (
              <p className="text-xs text-muted-foreground mt-2">
                Ficará em dívida: {formatarMoeda(fatura.valorEmDivida - valor)}
              </p>
            )}
            {valor >= fatura.valorEmDivida && (
              <p className="text-xs text-green-600 mt-2">
                ✓ A fatura ficará totalmente paga
              </p>
            )}
          </div>

          {/* Botões */}
          <div className="flex items-center justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={registarPagamento.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {registarPagamento.isPending ? "A registar..." : "Registar Pagamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

