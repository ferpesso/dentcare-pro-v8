import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Search, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Produto {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  minimo: number;
  unidade: string;
  ultimaReposicao: string;
}

export default function Stocks() {
  const [produtos] = useState<Produto[]>([
    { id: "1", nome: "Anestésico Articaina", categoria: "Consumíveis", quantidade: 45, minimo: 50, unidade: "Ampolas", ultimaReposicao: "2023-12-20" },
    { id: "2", nome: "Resina Composta A2", categoria: "Dentística", quantidade: 12, minimo: 5, unidade: "Seringas", ultimaReposicao: "2024-01-02" },
    { id: "3", nome: "Luvas Nitrilo M", categoria: "Proteção", quantidade: 8, minimo: 10, unidade: "Caixas", ultimaReposicao: "2023-12-15" },
    { id: "4", nome: "Agulhas Curtas", categoria: "Consumíveis", quantidade: 100, minimo: 50, unidade: "Unidades", ultimaReposicao: "2023-11-30" },
  ]);

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            Gestão de Stocks
          </h1>
          <p className="text-muted-foreground">Controlo de inventário e materiais da clínica</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <ArrowDownRight className="h-4 w-4" />
            Registar Saída
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-5 w-5 text-blue-600" />
              <Badge variant="outline">Total</Badge>
            </div>
            <div className="text-2xl font-bold">{produtos.length}</div>
            <p className="text-sm text-muted-foreground">Produtos registados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <Badge variant="destructive">Crítico</Badge>
            </div>
            <div className="text-2xl font-bold">
              {produtos.filter(p => p.quantidade <= p.minimo).length}
            </div>
            <p className="text-sm text-muted-foreground">Produtos abaixo do mínimo</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <ArrowUpRight className="h-5 w-5 text-green-600" />
              <Badge variant="outline">Mês</Badge>
            </div>
            <div className="text-2xl font-bold">1.240€</div>
            <p className="text-sm text-muted-foreground">Investimento em materiais</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inventário</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pesquisar produto..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Mínimo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Reposição</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.nome}</TableCell>
                  <TableCell>{p.categoria}</TableCell>
                  <TableCell className="text-right">{p.quantidade} {p.unidade}</TableCell>
                  <TableCell className="text-right">{p.minimo} {p.unidade}</TableCell>
                  <TableCell>
                    {p.quantidade <= p.minimo ? (
                      <Badge variant="destructive">Repor</Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-600 border-green-600">OK</Badge>
                    )}
                  </TableCell>
                  <TableCell>{p.ultimaReposicao}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Editar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
