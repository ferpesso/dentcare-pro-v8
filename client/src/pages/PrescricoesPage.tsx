import React, { useState } from "react";
import { useUtentes } from "@/hooks/useMockableQuery";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Prescricoes from "@/components/Prescricoes";
import { ClipboardList, User } from "lucide-react";

export default function PrescricoesPage() {
  const { data: utentes = [] } = useUtentes();
  const [utenteSelecionado, setUtenteSelecionado] = useState<string | null>(null);

  const utentesList = (utentes as any[]) || [];

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ClipboardList className="h-8 w-8 text-primary" />
          Prescrições Médicas
        </h1>
        <p className="text-muted-foreground">Emissão e histórico de receitas para pacientes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Selecionar Utente
          </CardTitle>
          <CardDescription>Escolha um utente para gerir as suas prescrições</CardDescription>
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
        <Prescricoes 
          utenteId={utenteSelecionado} 
          onSalvar={(dados) => console.log("Prescrições salvas:", dados)} 
        />
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground">Selecione um utente para visualizar ou criar novas prescrições</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
