import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, AlertCircle, CheckCircle, Info, Save, Download, Calendar } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface AnalisadorImagemIAProps {
  imagemUrl: string;
  imagemTipo: string;
  imagemNome: string;
  imagemId?: string; // ID da imagem para salvar análise
  utenteId?: string; // ID do utente
  analiseExistente?: ResultadoAnalise | null; // Análise já salva
}

interface ResultadoAnalise {
  dataAnalise?: string;
  tipoImagem: string;
  qualidade: string;
  problemasDetectados: string[];
  observacoes: string[];
  recomendacoes: string[];
  nivelUrgencia: "baixo" | "medio" | "alto";
  relatorioCompleto: string;
}

export default function AnalisadorImagemIA({ 
  imagemUrl, 
  imagemTipo, 
  imagemNome,
  imagemId,
  utenteId,
  analiseExistente = null,
}: AnalisadorImagemIAProps) {
  const [analisando, setAnalisando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoAnalise | null>(analiseExistente);
  const [salvando, setSalvando] = useState(false);

  const analisarImagemMutation = (trpc.ia as any).analisarImagem.useMutation();
  const salvarAnaliseMutation = trpc.imagens?.salvarAnaliseIA?.useMutation?.();

  const handleAnalisar = async () => {
    setAnalisando(true);
    setResultado(null);

    try {
      // Converter imagem para base64 se for blob URL
      let imagemBase64 = imagemUrl;
      
      if (imagemUrl.startsWith("blob:")) {
        const response = await fetch(imagemUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        
        imagemBase64 = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      const analise = await analisarImagemMutation.mutateAsync({
        imagemBase64,
        tipoImagem: imagemTipo,
        contexto: `Análise de imagem dentária: ${imagemNome}`,
      });

      setResultado(analise as ResultadoAnalise);
      toast.success("Análise concluída!");
    } catch (error) {
      console.error("Erro na análise:", error);
      toast.error("Erro ao analisar imagem. Tente novamente.");
    } finally {
      setAnalisando(false);
    }
  };

  const handleSalvarAnalise = async () => {
    if (!resultado || !imagemId || !utenteId || !salvarAnaliseMutation) {
      toast.error("Não é possível salvar a análise");
      return;
    }

    setSalvando(true);

    try {
      await salvarAnaliseMutation.mutateAsync({
        utenteId,
        imagemId,
        analise: {
          tipoImagem: resultado.tipoImagem,
          qualidade: resultado.qualidade,
          problemasDetectados: resultado.problemasDetectados,
          observacoes: resultado.observacoes,
          recomendacoes: resultado.recomendacoes,
          nivelUrgencia: resultado.nivelUrgencia,
          relatorioCompleto: resultado.relatorioCompleto,
        },
      });

      toast.success("Análise salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar análise:", error);
      toast.error("Erro ao salvar análise");
    } finally {
      setSalvando(false);
    }
  };

  const handleExportarPDF = () => {
    if (!resultado) return;

    // Criar conteúdo do relatório
    const conteudo = `
ANÁLISE DE IMAGEM DENTÁRIA COM IA
${resultado.dataAnalise ? `Data: ${new Date(resultado.dataAnalise).toLocaleString('pt-PT')}` : ''}
Imagem: ${imagemNome}

TIPO IDENTIFICADO: ${resultado.tipoImagem}
QUALIDADE: ${resultado.qualidade}
NÍVEL DE URGÊNCIA: ${resultado.nivelUrgencia.toUpperCase()}

${resultado.problemasDetectados.length > 0 ? `
PROBLEMAS DETECTADOS (${resultado.problemasDetectados.length}):
${resultado.problemasDetectados.map((p, i) => `${i + 1}. ${p}`).join('\n')}
` : ''}

${resultado.observacoes.length > 0 ? `
OBSERVAÇÕES (${resultado.observacoes.length}):
${resultado.observacoes.map((o, i) => `${i + 1}. ${o}`).join('\n')}
` : ''}

${resultado.recomendacoes.length > 0 ? `
RECOMENDAÇÕES (${resultado.recomendacoes.length}):
${resultado.recomendacoes.map((r, i) => `${i + 1}. ${r}`).join('\n')}
` : ''}

RELATÓRIO COMPLETO:
${resultado.relatorioCompleto}

---
⚠️ Esta análise é gerada por IA e deve ser usada apenas como suporte.
Sempre consulte um profissional qualificado para diagnóstico definitivo.
    `.trim();

    // Criar blob e fazer download
    const blob = new Blob([conteudo], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analise-ia-${imagemNome}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Relatório exportado!");
  };

  const getUrgenciaColor = (nivel: string) => {
    switch (nivel) {
      case "alto":
        return "bg-red-500";
      case "medio":
        return "bg-yellow-500";
      case "baixo":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getUrgenciaText = (nivel: string) => {
    switch (nivel) {
      case "alto":
        return "text-red-700";
      case "medio":
        return "text-yellow-700";
      case "baixo":
        return "text-green-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Análise com Inteligência Artificial
          </CardTitle>
          <CardDescription>
            Análise automática de imagens dentárias usando IA avançada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!resultado && !analisando && (
            <Button 
              onClick={handleAnalisar} 
              className="w-full"
              size="lg"
            >
              <Brain className="h-5 w-5 mr-2" />
              Analisar Imagem com IA
            </Button>
          )}

          {analisando && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
              <p className="text-sm text-muted-foreground">
                Analisando imagem... Isso pode levar alguns segundos.
              </p>
            </div>
          )}

          {resultado && (
            <div className="space-y-4">
              {/* Data da Análise */}
              {resultado.dataAnalise && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Análise realizada em {new Date(resultado.dataAnalise).toLocaleString('pt-PT')}
                  </span>
                </div>
              )}

              {/* Tipo e Qualidade */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Tipo Identificado
                  </p>
                  <Badge variant="outline" className="text-sm">
                    {resultado.tipoImagem}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Qualidade da Imagem
                  </p>
                  <Badge variant="outline" className="text-sm">
                    {resultado.qualidade}
                  </Badge>
                </div>
              </div>

              {/* Nível de Urgência */}
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Nível de Urgência
                </p>
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${getUrgenciaColor(resultado.nivelUrgencia)}`} />
                  <span className={`text-sm font-medium capitalize ${getUrgenciaText(resultado.nivelUrgencia)}`}>
                    {resultado.nivelUrgencia}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Área com Scroll para Resultados */}
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <div className="space-y-4">
                  {/* Problemas Detectados */}
                  {resultado.problemasDetectados.length > 0 && (
                    <Card className="border-red-200 bg-red-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-red-700">
                          <AlertCircle className="h-4 w-4" />
                          Problemas Detectados ({resultado.problemasDetectados.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {resultado.problemasDetectados.map((problema, idx) => (
                            <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                              <span className="text-red-500 mt-0.5 font-bold">{idx + 1}.</span>
                              <span>{problema}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Observações */}
                  {resultado.observacoes.length > 0 && (
                    <Card className="border-blue-200 bg-blue-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-blue-700">
                          <Info className="h-4 w-4" />
                          Observações ({resultado.observacoes.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {resultado.observacoes.map((obs, idx) => (
                            <li key={idx} className="text-sm text-blue-700 flex items-start gap-2">
                              <span className="text-blue-500 mt-0.5 font-bold">{idx + 1}.</span>
                              <span>{obs}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recomendações */}
                  {resultado.recomendacoes.length > 0 && (
                    <Card className="border-green-200 bg-green-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2 text-green-700">
                          <CheckCircle className="h-4 w-4" />
                          Recomendações ({resultado.recomendacoes.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {resultado.recomendacoes.map((rec, idx) => (
                            <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                              <span className="text-green-500 mt-0.5 font-bold">{idx + 1}.</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Relatório Completo */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Relatório Completo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {resultado.relatorioCompleto}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>

              <Separator />

              {/* Botões de Ação */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {imagemId && utenteId && !resultado.dataAnalise && (
                  <Button 
                    onClick={handleSalvarAnalise}
                    disabled={salvando}
                    variant="default"
                    className="w-full"
                  >
                    {salvando ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        A salvar...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Análise
                      </>
                    )}
                  </Button>
                )}

                <Button 
                  onClick={handleExportarPDF}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Relatório
                </Button>

                <Button 
                  onClick={handleAnalisar} 
                  variant="outline"
                  className="w-full"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Analisar Novamente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground text-center bg-yellow-50 border border-yellow-200 rounded p-2">
        ⚠️ <strong>Aviso Importante:</strong> Esta análise é gerada por IA e deve ser usada apenas como suporte.
        Sempre consulte um profissional qualificado para diagnóstico definitivo.
      </div>
    </div>
  );
}

