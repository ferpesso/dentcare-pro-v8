import React, { useState } from "react";
import { useUtentes } from "@/hooks/useMockableQuery";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, Plus, User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Orcamentos() {
  const { data: utentes = [] } = useUtentes();
  const [utenteSelecionado, setUtenteSelecionado] = useState<string | null>(null);

  const utentesList = (utentes as any[]) || [];

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Orçamentos
          </h1>
          <p className="text-muted-foreground">Criação e gestão de planos de tratamento e orçamentos</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Orçamento
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-4 w-4" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Utente</label>
              <Select onValueChange={setUtenteSelecionado} value={utenteSelecionado || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os utentes" />
                </SelectTrigger>
                <SelectContent>
                  {utentesList.map((u: any) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.nomeCompleto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select defaultValue="todos">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="rejeitado">Rejeitado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Lista de Orçamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground">Nenhum orçamento encontrado para os filtros selecionados</p>
              <Button variant="outline" className="mt-4" onClick={() => setUtenteSelecionado(null)}>
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
