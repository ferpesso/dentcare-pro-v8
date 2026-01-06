import React, { useState } from "react";
import { useUtentes } from "@/hooks/useMockableQuery";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Odontograma3D from "@/components/Odontograma3D";
import { Activity, User } from "lucide-react";

export default function Tratamentos() {
  const { data: utentes = [] } = useUtentes();
  const [utenteSelecionado, setUtenteSelecionado] = useState<string | null>(null);

  const utentesList = (utentes as any[]) || [];

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Activity className="h-8 w-8 text-primary" />
          Tratamentos e Odontograma
        </h1>
        <p className="text-muted-foreground">Gestão clínica e registo de tratamentos por utente</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Selecionar Utente
          </CardTitle>
          <CardDescription>Escolha um utente para visualizar ou editar o odontograma</CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setUtenteSelecionado} value={utenteSelecionado || undefined}>
            <SelectTrigger className="w-full md:w-[400px]">
              <SelectValue placeholder="Pesquisar utente..." />
            </SelectTrigger>
            <SelectContent>
              {utentesList.map((u: any) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.nomeCompleto} ({u.numeroUtente})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {utenteSelecionado ? (
        <Odontograma3D 
          utenteId={utenteSelecionado} 
          onSalvar={(dados) => console.log("Dados salvos:", dados)} 
        />
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground">Selecione um utente para carregar o odontograma digital</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
