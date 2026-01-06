/**
 * Página Principal do Módulo Financeiro/Faturação
 * DentCare PRO v8.0
 */

import { useState } from "react";
import { Link } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  FileText,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Ban,
  Receipt,
  Calendar,
  Users,
  CreditCard,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { ModalNovaFatura } from "@/components/ModalNovaFatura";
import { ModalVisualizarFatura } from "@/components/ModalVisualizarFatura";
import { ModalRegistarPagamento } from "@/components/ModalRegistarPagamento";
import type { Fatura, EstadoFatura } from "@shared/types-financeiro";

export default function Faturacao() {
  const [filtroEstado, setFiltroEstado] = useState<EstadoFatura | "todas">("todas");
  const [pesquisa, setPesquisa] = useState("");
  const [modalNovaFatura, setModalNovaFatura] = useState(false);
  const [faturaVisualizando, setFaturaVisualizando] = useState<Fatura | null>(null);
  const [faturaParaPagamento, setFaturaParaPagamento] = useState<Fatura | null>(null);

  // Queries
  const { data: faturas = [], isLoading, refetch } = trpc.financeiro.listar.useQuery({
    estado: filtroEstado !== "todas" ? filtroEstado : undefined,
    pesquisa: pesquisa || undefined,
  });

  const { data: estatisticas } = trpc.financeiro.estatisticas.useQuery({
    dataInicio: new Date(new Date().getFullYear(), 0, 1).toISOString(),
    dataFim: new Date().toISOString(),
  });

  // Mutations
  const anularFatura = trpc.financeiro.anular.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  // Funções auxiliares
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-PT");
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

  const handleAnularFatura = (fatura: Fatura) => {
    if (confirm(`Tem a certeza que deseja anular a fatura ${fatura.numero}?`)) {
      const motivo = prompt("Motivo da anulação:");
      if (motivo) {
        anularFatura.mutate({ id: fatura.id, motivo });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-teal-600" />
              Faturação
            </h1>
            <p className="text-muted-foreground">
              Gestão de faturas, recibos e controlo financeiro
            </p>
          </div>
          <Button onClick={() => setModalNovaFatura(true)} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Nova Fatura
          </Button>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatarMoeda(estatisticas?.receitaTotal || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {estatisticas?.totalFaturas || 0} faturas emitidas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Receita Paga</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatarMoeda(estatisticas?.receitaPaga || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {estatisticas?.faturasPagas || 0} faturas pagas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendente</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatarMoeda(estatisticas?.receitaPendente || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {estatisticas?.faturasPendentes || 0} faturas pendentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
              <Receipt className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatarMoeda(estatisticas?.ticketMedio || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Por fatura
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Pesquisa */}
        <Card>
          <CardHeader>
            <CardTitle>Faturas</CardTitle>
            <CardDescription>
              Listagem e gestão de todas as faturas emitidas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar por número, utente ou dentista..."
                    value={pesquisa}
                    onChange={(e) => setPesquisa(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select
                value={filtroEstado}
                onValueChange={(value) => setFiltroEstado(value as EstadoFatura | "todas")}
              >
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="paga">Pagas</SelectItem>
                  <SelectItem value="parcial">Parciais</SelectItem>
                  <SelectItem value="vencida">Vencidas</SelectItem>
                  <SelectItem value="anulada">Anuladas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabela de Faturas */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Utente</TableHead>
                    <TableHead>Dentista</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Pago</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        A carregar...
                      </TableCell>
                    </TableRow>
                  ) : faturas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <FileText className="h-12 w-12 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            Nenhuma fatura encontrada
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    faturas.map((fatura) => (
                      <TableRow key={fatura.id}>
                        <TableCell className="font-medium">{fatura.numero}</TableCell>
                        <TableCell>{formatarData(fatura.data)}</TableCell>
                        <TableCell>
                          <Link href={`/utentes/${fatura.utenteId}`}>
                            <span className="text-blue-600 hover:underline cursor-pointer">
                              {fatura.utenteNome}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell>{fatura.dentista}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatarMoeda(fatura.total)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatarMoeda(fatura.valorPago)}
                        </TableCell>
                        <TableCell>{getEstadoBadge(fatura.estado)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setFaturaVisualizando(fatura)}
                              title="Visualizar"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {fatura.estado !== "paga" && fatura.estado !== "anulada" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setFaturaParaPagamento(fatura)}
                                title="Registar Pagamento"
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            )}
                            {fatura.estado !== "anulada" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAnularFatura(fatura)}
                                title="Anular"
                              >
                                <Ban className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modais */}
      {modalNovaFatura && (
        <ModalNovaFatura
          open={modalNovaFatura}
          onClose={() => setModalNovaFatura(false)}
          onSuccess={() => {
            setModalNovaFatura(false);
            refetch();
          }}
        />
      )}

      {faturaVisualizando && (
        <ModalVisualizarFatura
          fatura={faturaVisualizando}
          open={!!faturaVisualizando}
          onClose={() => setFaturaVisualizando(null)}
        />
      )}

      {faturaParaPagamento && (
        <ModalRegistarPagamento
          fatura={faturaParaPagamento}
          open={!!faturaParaPagamento}
          onClose={() => setFaturaParaPagamento(null)}
          onSuccess={() => {
            setFaturaParaPagamento(null);
            refetch();
          }}
        />
      )}
    </DashboardLayout>
  );
}

