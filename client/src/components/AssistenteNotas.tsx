import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface AssistenteNotasProps {
  utenteId: string;
}

export default function AssistenteNotas({ utenteId }: AssistenteNotasProps) {
  const [notasConsulta, setNotasConsulta] = useState("");
  const [resumo, setResumo] = useState<any>(null);
  const [analiseRisco, setAnaliseRisco] = useState<any>(null);

  const gerarResumoMutation = trpc.ia.gerarResumo.useMutation({
    onSuccess: (data) => {
      setResumo(data);
      toast.success("Resumo gerado com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao gerar resumo: " + error.message);
    },
  });

  const analisarRiscoMutation = trpc.ia.analisarRisco.useMutation({
    onSuccess: (data) => {
      setAnaliseRisco(data);
      toast.success("Análise de risco concluída!");
    },
    onError: (error) => {
      toast.error("Erro ao analisar risco: " + error.message);
    },
  });

  const handleGerarResumo = () => {
    if (!notasConsulta.trim()) {
      toast.error("Por favor, escreva as notas da consulta");
      return;
    }

    gerarResumoMutation.mutate({
      notasConsulta,
    });
  };

  const handleAnalisarRisco = () => {
    analisarRiscoMutation.mutate({
      utenteId,
    });
  };

  const getRiscoColor = (nivel: string) => {
    switch (nivel) {
      case "alto":
        return "bg-red-100 text-red-800 border-red-200";
      case "medio":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baixo":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Gerador de Resumo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Gerador Automático de Resumo
          </CardTitle>
          <CardDescription>
            A IA cria um resumo profissional das notas da consulta
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Notas da Consulta</label>
            <Textarea
              placeholder="Escreva as notas da consulta aqui..."
              value={notasConsulta}
              onChange={(e) => setNotasConsulta(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleGerarResumo}
            disabled={gerarResumoMutation.isPending || !notasConsulta.trim()}
            className="w-full gap-2"
          >
            {gerarResumoMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando resumo...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Gerar Resumo Automático
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resumo Gerado */}
      {resumo && (
        <Card className="border-l-4 border-l-primary bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Resumo Gerado pela IA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Resumo</h4>
              <p className="text-sm text-muted-foreground">{resumo.resumo}</p>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Pontos-Chave</h4>
              <ul className="space-y-1">
                {resumo.pontosChave.map((ponto: string, idx: number) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{ponto}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2">Próximos Passos</h4>
              <ul className="space-y-1">
                {resumo.proximosPassos.map((passo: string, idx: number) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span>{passo}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análise Preditiva */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Análise Preditiva de Risco
          </CardTitle>
          <CardDescription>
            A IA avalia o nível de risco do paciente com base no histórico médico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleAnalisarRisco}
            disabled={analisarRiscoMutation.isPending}
            className="w-full gap-2"
            variant="outline"
          >
            {analisarRiscoMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Analisar Risco do Paciente
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultado da Análise de Risco */}
      {analiseRisco && (
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Análise de Risco
              </CardTitle>
              <Badge className={getRiscoColor(analiseRisco.nivelRisco)}>
                Risco {analiseRisco.nivelRisco}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Fatores de Risco */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Fatores de Risco Identificados</h4>
              <div className="space-y-2">
                {analiseRisco.fatores.map((fator: string, idx: number) => (
                  <div
                    key={idx}
                    className="bg-yellow-50 border border-yellow-200 rounded-lg p-2"
                  >
                    <p className="text-sm text-yellow-800">⚠️ {fator}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recomendações */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Recomendações</h4>
              <ul className="space-y-1">
                {analiseRisco.recomendacoes.map((rec: string, idx: number) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

