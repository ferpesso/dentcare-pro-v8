/**
 * Modal para Visualizar Fatura
 * DentCare PRO v8.0
 */

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Printer } from "lucide-react";
import type { Fatura, EstadoFatura } from "@shared/types-financeiro";

interface ModalVisualizarFaturaProps {
  fatura: Fatura;
  open: boolean;
  onClose: () => void;
}

export function ModalVisualizarFatura({ fatura, open, onClose }: ModalVisualizarFaturaProps) {
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getEstadoBadge = (estado: EstadoFatura) => {
    const badges = {
      paga: <Badge className="bg-green-500">Paga</Badge>,
      pendente: <Badge className="bg-yellow-500">Pendente</Badge>,
      parcial: <Badge className="bg-blue-500">Parcial</Badge>,
      vencida: <Badge className="bg-red-500">Vencida</Badge>,
      anulada: <Badge variant="outline" className="text-gray-500">Anulada</Badge>,
    };
    return badges[estado];
  };

  const handleImprimir = () => {
    window.print();
  };

  const handleExportarPDF = () => {
    // TODO: Implementar exportação para PDF
    alert("Funcionalidade de exportação PDF em desenvolvimento");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Fatura {fatura.numero}</span>
            <div className="flex items-center gap-2">
              {getEstadoBadge(fatura.estado)}
              <Button variant="outline" size="sm" onClick={handleImprimir}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportarPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-6 bg-white text-black print:p-0">
          {/* Cabeçalho da Fatura */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">DentCare PRO</h2>
              <p className="text-sm text-muted-foreground">Clínica Dentária</p>
            </div>
            <div className="text-right">
              <p className="text-sm">
                <strong>Fatura Nº:</strong> {fatura.numero}
              </p>
              <p className="text-sm">
                <strong>Data:</strong> {formatarData(fatura.data)}
              </p>
              <p className="text-sm">
                <strong>Vencimento:</strong> {formatarData(fatura.dataVencimento)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Dados do Utente */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Cliente:</h3>
              <p className="text-sm">{fatura.utenteNome}</p>
              {fatura.utenteNif && <p className="text-sm">NIF: {fatura.utenteNif}</p>}
              {fatura.utenteMorada && <p className="text-sm">{fatura.utenteMorada}</p>}
            </div>
            <div>
              <h3 className="font-semibold mb-2">Dentista Responsável:</h3>
              <p className="text-sm">{fatura.dentista}</p>
            </div>
          </div>

          <Separator />

          {/* Itens da Fatura */}
          <div>
            <h3 className="font-semibold mb-4">Itens:</h3>
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2">Descrição</th>
                  <th className="text-center py-2">Qtd</th>
                  <th className="text-right py-2">Preço Unit.</th>
                  <th className="text-right py-2">Desc.</th>
                  <th className="text-right py-2">IVA</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {fatura.itens.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2">
                      {item.descricao}
                      {item.categoria && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({item.categoria})
                        </span>
                      )}
                    </td>
                    <td className="text-center py-2">{item.quantidade}</td>
                    <td className="text-right py-2">{formatarMoeda(item.precoUnitario)}</td>
                    <td className="text-right py-2">{item.desconto}%</td>
                    <td className="text-right py-2">{item.iva}%</td>
                    <td className="text-right py-2 font-medium">{formatarMoeda(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Separator />

          {/* Totais */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatarMoeda(fatura.subtotal)}</span>
              </div>
              {fatura.descontoTotal > 0 && (
                <div className="flex justify-between text-sm text-red-600">
                  <span>Desconto:</span>
                  <span>-{formatarMoeda(fatura.descontoTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>IVA:</span>
                <span>{formatarMoeda(fatura.ivaTotal)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatarMoeda(fatura.total)}</span>
              </div>
            </div>
          </div>

          {/* Informações de Pagamento */}
          {fatura.pagamentos.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-4">Pagamentos:</h3>
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2">Data</th>
                      <th className="text-left py-2">Método</th>
                      <th className="text-left py-2">Referência</th>
                      <th className="text-right py-2">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fatura.pagamentos.map((pagamento) => (
                      <tr key={pagamento.id} className="border-b">
                        <td className="py-2">{formatarData(pagamento.data)}</td>
                        <td className="py-2 capitalize">{pagamento.metodo}</td>
                        <td className="py-2">{pagamento.referencia || "-"}</td>
                        <td className="text-right py-2">{formatarMoeda(pagamento.valor)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-4 flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Pago:</span>
                      <span className="text-green-600 font-medium">
                        {formatarMoeda(fatura.valorPago)}
                      </span>
                    </div>
                    {fatura.valorEmDivida > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Em Dívida:</span>
                        <span className="text-red-600 font-medium">
                          {formatarMoeda(fatura.valorEmDivida)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Observações */}
          {fatura.observacoes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Observações:</h3>
                <p className="text-sm text-muted-foreground">{fatura.observacoes}</p>
              </div>
            </>
          )}

          {/* Fatura Anulada */}
          {fatura.estado === "anulada" && (
            <>
              <Separator />
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-600 mb-2">Fatura Anulada</h3>
                <p className="text-sm">
                  <strong>Data:</strong> {formatarData(fatura.anuladaEm!)}
                </p>
                {fatura.motivoAnulacao && (
                  <p className="text-sm">
                    <strong>Motivo:</strong> {fatura.motivoAnulacao}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Rodapé */}
          <Separator />
          <div className="text-center text-xs text-muted-foreground">
            <p>DentCare PRO - Sistema de Gestão para Clínicas Dentárias</p>
            <p>Documento processado eletronicamente</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

