import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, Search, Eye, Download, Printer, Trash2 } from "lucide-react";

interface Orcamento {
  id: string;
  numero: string;
  data: string;
  utenteNome: string;
  total: number;
  estado: "rascunho" | "enviado" | "aceite" | "rejeitado";
}

export default function Orcamentos() {
  const [pesquisa, setPesquisa] = useState("");
  
  // Dados mock locais para a página
  const [orcamentos] = useState<Orcamento[]>([
    {
      id: "orc-001",
      numero: "ORC/2025/001",
      data: "2025-10-20",
      utenteNome: "Maria Silva Santos",
      total: 1250.00,
      estado: "aceite"
    },
    {
      id: "orc-002",
      numero: "ORC/2025/002",
      data: "2025-10-22",
      utenteNome: "João Pedro Costa",
      total: 450.00,
      estado: "enviado"
    },
    {
      id: "orc-003",
      numero: "ORC/2025/003",
      data: "2025-10-25",
      utenteNome: "Ana Rita Ferreira",
      total: 3200.00,
      estado: "rascunho"
    }
  ]);

  const getEstadoBadge = (estado: Orcamento["estado"]) => {
    const badges = {
      rascunho: <Badge variant="outline">Rascunho</Badge>,
      enviado: <Badge className="bg-blue-500">Enviado</Badge>,
      aceite: <Badge className="bg-green-500">Aceite</Badge>,
      rejeitado: <Badge className="bg-red-500">Rejeitado</Badge>,
    };
    return badges[estado];
  };

  const orcamentosFiltrados = orcamentos.filter(o => 
    o.utenteNome.toLowerCase().includes(pesquisa.toLowerCase()) ||
    o.numero.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              Orçamentos
            </h1>
            <p className="text-muted-foreground">
              Gestão de planos de tratamento e orçamentos para utentes
            </p>
          </div>
          <Button size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Novo Orçamento
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Listagem de Orçamentos</CardTitle>
            <CardDescription>Consulte e gira os orçamentos emitidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por número ou utente..."
                  value={pesquisa}
                  onChange={(e) => setPesquisa(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Utente</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orcamentosFiltrados.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Nenhum orçamento encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    orcamentosFiltrados.map((orc) => (
                      <TableRow key={orc.id}>
                        <TableCell className="font-medium">{orc.numero}</TableCell>
                        <TableCell>{new Date(orc.data).toLocaleDateString("pt-PT")}</TableCell>
                        <TableCell>{orc.utenteNome}</TableCell>
                        <TableCell className="text-right font-medium">
                          {new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(orc.total)}
                        </TableCell>
                        <TableCell>{getEstadoBadge(orc.estado)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" title="Visualizar">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Imprimir">
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" title="Download PDF">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" title="Eliminar">
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
    </DashboardLayout>
  );
}
