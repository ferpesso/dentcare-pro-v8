import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, AlertTriangle, CheckCircle2, Brain } from "lucide-react";
import { toast } from "sonner";

interface AssistenteDiagnosticoProps {
  utenteId: string;
}

export default function AssistenteDiagnostico({ utenteId }: AssistenteDiagnosticoProps) {
  const [sintomas, setSintomas] = useState("");
  const [diagnosticos, setDiagnosticos] = useState<any[]>([]);

  const analisarMutation = trpc.ia.analisarSintomas.useMutation({
    onSuccess: (data) => {
      setDiagnosticos(data);
      toast.success("Análise concluída com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao analisar sintomas: " + error.message);
    },
  });

  const handleAnalisar = () => {
    if (!sintomas.trim()) {
      toast.error("Por favor, descreva os sintomas");
      return;
    }

    analisarMutation.mutate({
      utenteId,
      sintomas,
    });
  };

  const getProbabilidadeColor = (prob: string) => {
    switch (prob) {
      case "alta":
        return "bg-red-100 text-red-800 border-red-200";
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baixa":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Card de Entrada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Assistente de Diagnóstico com IA
          </CardTitle>
          <CardDescription>
            Descreva os sintomas do paciente e a IA sugerirá possíveis diagnósticos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Sintomas e Queixas do Paciente
            </label>
            <Textarea
              placeholder="Ex: Dor intensa no dente 36, sensibilidade ao frio, gengiva inchada..."
              value={sintomas}
              onChange={(e) => setSintomas(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleAnalisar}
            disabled={analisarMutation.isPending || !sintomas.trim()}
            className="w-full gap-2"
          >
            {analisarMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analisando com IA...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analisar Sintomas
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultados */}
      {diagnosticos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Diagnósticos Sugeridos pela IA
          </h3>

          {diagnosticos.map((diag, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{diag.diagnostico}</CardTitle>
                  <Badge className={getProbabilidadeColor(diag.probabilidade)}>
                    Probabilidade {diag.probabilidade}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Fundamentação */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Fundamentação
                  </h4>
                  <p className="text-sm text-muted-foreground">{diag.fundamentacao}</p>
                </div>

                {/* Tratamentos Recomendados */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Tratamentos Recomendados</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {diag.tratamentosRecomendados.map((trat: string, idx: number) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        {trat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Alertas */}
                {diag.alertas && diag.alertas.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-yellow-800">
                      <AlertTriangle className="h-4 w-4" />
                      Alertas Importantes
                    </h4>
                    <ul className="space-y-1">
                      {diag.alertas.map((alerta: string, idx: number) => (
                        <li key={idx} className="text-sm text-yellow-700">
                          • {alerta}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-800">
                <strong>⚠️ Aviso:</strong> Estas sugestões são geradas por IA e devem ser usadas
                apenas como auxílio ao diagnóstico. O médico dentista deve sempre fazer a avaliação
                clínica final.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

