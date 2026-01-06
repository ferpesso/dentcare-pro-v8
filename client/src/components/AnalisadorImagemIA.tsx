import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, AlertCircle, CheckCircle, Info, Download, Sparkles, TrendingUp, Clock, FileText } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface AnalisadorImagemIAProps {
  imagemUrl: string;
  imagemTipo: string;
  imagemNome: string;
}

interface ResultadoAnalise {
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
  imagemNome 
}: AnalisadorImagemIAProps) {
  const [analisando, setAnalisando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoAnalise | null>(null);
  const [progresso, setProgresso] = useState(0);

  const analisarImagemMutation = (trpc.ia as any).analisarImagem.useMutation();

  const handleAnalisar = async () => {
    setAnalisando(true);
    setResultado(null);
    setProgresso(0);

    // Simular progresso
    const progressInterval = setInterval(() => {
      setProgresso((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

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

      clearInterval(progressInterval);
      setProgresso(100);
      setResultado(analise as ResultadoAnalise);
      toast.success("Análise concluída com sucesso!");
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Erro na análise:", error);
      toast.error("Erro ao analisar imagem. Tente novamente.");
    } finally {
      setAnalisando(false);
    }
  };

  const handleExportarRelatorio = () => {
    if (!resultado) return;

    const conteudo = `
╔═══════════════════════════════════════════════════════════════╗
║         ANÁLISE DE IMAGEM DENTÁRIA COM IA                     ║
║         DentCare PRO - Relatório Automático                   ║
╚═══════════════════════════════════════════════════════════════╝

📅 Data: ${new Date().toLocaleString('pt-PT')}
📁 Imagem: ${imagemNome}
🔍 Tipo: ${imagemTipo}

═══════════════════════════════════════════════════════════════

📊 RESUMO DA ANÁLISE

Tipo Identificado: ${resultado.tipoImagem}
Qualidade da Imagem: ${resultado.qualidade}
Nível de Urgência: ${resultado.nivelUrgencia.toUpperCase()}

═══════════════════════════════════════════════════════════════

${resultado.problemasDetectados.length > 0 ? `
🚨 PROBLEMAS DETECTADOS (${resultado.problemasDetectados.length})

${resultado.problemasDetectados.map((p, i) => `   ${i + 1}. ${p}`).join('\n')}

═══════════════════════════════════════════════════════════════
` : ''}

${resultado.observacoes.length > 0 ? `
ℹ️  OBSERVAÇÕES CLÍNICAS (${resultado.observacoes.length})

${resultado.observacoes.map((o, i) => `   ${i + 1}. ${o}`).join('\n')}

═══════════════════════════════════════════════════════════════
` : ''}

${resultado.recomendacoes.length > 0 ? `
✅ RECOMENDAÇÕES (${resultado.recomendacoes.length})

${resultado.recomendacoes.map((r, i) => `   ${i + 1}. ${r}`).join('\n')}

═══════════════════════════════════════════════════════════════
` : ''}

📋 RELATÓRIO DETALHADO

${resultado.relatorioCompleto}

═══════════════════════════════════════════════════════════════

⚠️  AVISO IMPORTANTE

Esta análise foi gerada por Inteligência Artificial e deve ser
utilizada apenas como ferramenta de suporte ao diagnóstico.

Sempre consulte um profissional qualificado para avaliação
definitiva e tomada de decisões clínicas.

═══════════════════════════════════════════════════════════════

Gerado por: DentCare PRO v8.0
Sistema de Gestão para Clínicas Dentárias
    `.trim();

    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-ia-${imagemNome.replace(/\s+/g, '-')}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Relatório exportado com sucesso!");
  };

  const getUrgenciaConfig = (nivel: string) => {
    switch (nivel) {
      case "alto":
        return {
          color: "bg-gradient-to-br from-red-500 to-red-600",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
          borderColor: "border-red-300",
          icon: "🔴",
          label: "Urgência Alta",
          description: "Requer atenção imediata"
        };
      case "medio":
        return {
          color: "bg-gradient-to-br from-yellow-500 to-orange-500",
          textColor: "text-yellow-800",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-300",
          icon: "🟡",
          label: "Urgência Média",
          description: "Acompanhamento necessário"
        };
      case "baixo":
        return {
          color: "bg-gradient-to-br from-green-500 to-green-600",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
          borderColor: "border-green-300",
          icon: "🟢",
          label: "Urgência Baixa",
          description: "Situação controlada"
        };
      default:
        return {
          color: "bg-gradient-to-br from-gray-500 to-gray-600",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-300",
          icon: "⚪",
          label: "Não definido",
          description: ""
        };
    }
  };

  const urgenciaConfig = resultado ? getUrgenciaConfig(resultado.nivelUrgencia) : null;

  return (
    <div className="space-y-6">
      {/* Card Principal */}
      <Card className="border-2 border-purple-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Análise com Inteligência Artificial</CardTitle>
                <CardDescription className="text-sm mt-1">
                  Análise automática de imagens dentárias usando IA avançada
                </CardDescription>
              </div>
            </div>
            <Sparkles className="h-8 w-8 text-purple-400 animate-pulse" />
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          {/* Botão Inicial */}
          {!resultado && !analisando && (
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-4">
                  <Brain className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Pronto para Analisar</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  A IA irá identificar problemas, fazer observações e sugerir recomendações
                </p>
              </div>
              
              <Button 
                onClick={handleAnalisar} 
                className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg"
                size="lg"
              >
                <Brain className="h-6 w-6 mr-3" />
                Iniciar Análise com IA
                <Sparkles className="h-5 w-5 ml-3" />
              </Button>
            </div>
          )}

          {/* Estado de Análise */}
          {analisando && (
            <div className="space-y-6 py-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping opacity-20"></div>
                  <Loader2 className="h-16 w-16 animate-spin text-purple-600 relative z-10" />
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">Analisando Imagem...</h3>
                  <p className="text-sm text-muted-foreground">
                    A IA está processando a imagem e identificando detalhes
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Progresso</span>
                  <span className="font-medium">{progresso}%</span>
                </div>
                <Progress value={progresso} className="h-3" />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="space-y-1">
                  <div className="text-2xl">🔍</div>
                  <div className="text-muted-foreground">Detectando</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl">🧠</div>
                  <div className="text-muted-foreground">Analisando</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl">📊</div>
                  <div className="text-muted-foreground">Processando</div>
                </div>
              </div>
            </div>
          )}

          {/* Resultados */}
          {resultado && urgenciaConfig && (
            <div className="space-y-6">
              {/* Header dos Resultados */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-lg">Análise Concluída</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date().toLocaleString('pt-PT')}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleExportarRelatorio}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>

              {/* Informações Principais em Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Tipo Identificado */}
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <div className="text-3xl">🦷</div>
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                        Tipo Identificado
                      </p>
                      <p className="text-lg font-bold text-blue-900">
                        {resultado.tipoImagem}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Qualidade */}
                <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <div className="text-3xl">⭐</div>
                      <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">
                        Qualidade
                      </p>
                      <p className="text-lg font-bold text-purple-900">
                        {resultado.qualidade}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Nível de Urgência */}
                <Card className={`border-2 ${urgenciaConfig.borderColor} ${urgenciaConfig.bgColor}`}>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <div className="text-3xl">{urgenciaConfig.icon}</div>
                      <p className={`text-xs font-medium ${urgenciaConfig.textColor} uppercase tracking-wide`}>
                        Nível de Urgência
                      </p>
                      <p className={`text-lg font-bold ${urgenciaConfig.textColor}`}>
                        {urgenciaConfig.label}
                      </p>
                      <p className={`text-xs ${urgenciaConfig.textColor}`}>
                        {urgenciaConfig.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="my-6" />

              {/* Problemas Detectados */}
              {resultado.problemasDetectados.length > 0 && (
                <Card className="border-2 border-red-300 shadow-md">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 border-b-2 border-red-200">
                    <CardTitle className="flex items-center gap-3 text-red-800">
                      <div className="p-2 bg-red-500 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          Problemas Detectados
                          <Badge variant="destructive" className="text-xs">
                            {resultado.problemasDetectados.length}
                          </Badge>
                        </div>
                        <p className="text-xs font-normal text-red-600 mt-1">
                          Situações que requerem atenção profissional
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {resultado.problemasDetectados.map((problema, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border-l-4 border-red-500 hover:bg-red-100 transition-colors"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-red-900 font-medium pt-1">
                            {problema}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Observações */}
              {resultado.observacoes.length > 0 && (
                <Card className="border-2 border-blue-300 shadow-md">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
                    <CardTitle className="flex items-center gap-3 text-blue-800">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Info className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          Observações Clínicas
                          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                            {resultado.observacoes.length}
                          </Badge>
                        </div>
                        <p className="text-xs font-normal text-blue-600 mt-1">
                          Detalhes e características identificadas
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {resultado.observacoes.map((obs, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-blue-900 pt-1">
                            {obs}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recomendações */}
              {resultado.recomendacoes.length > 0 && (
                <Card className="border-2 border-green-300 shadow-md">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
                    <CardTitle className="flex items-center gap-3 text-green-800">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          Recomendações
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                            {resultado.recomendacoes.length}
                          </Badge>
                        </div>
                        <p className="text-xs font-normal text-green-600 mt-1">
                          Sugestões de tratamento e acompanhamento
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      {resultado.recomendacoes.map((rec, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500 hover:bg-green-100 transition-colors"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {idx + 1}
                          </div>
                          <p className="text-sm text-green-900 pt-1">
                            {rec}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Relatório Completo */}
              <Card className="border-2 border-gray-300">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <CardTitle className="flex items-center gap-3 text-gray-800">
                    <div className="p-2 bg-gray-600 rounded-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div>Relatório Detalhado</div>
                      <p className="text-xs font-normal text-gray-600 mt-1">
                        Análise completa gerada pela IA
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {resultado.relatorioCompleto}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Ações */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleAnalisar} 
                  variant="outline"
                  className="flex-1 h-12"
                  size="lg"
                >
                  <Brain className="h-5 w-5 mr-2" />
                  Analisar Novamente
                </Button>
                <Button 
                  onClick={handleExportarRelatorio}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Exportar Relatório
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Aviso Legal */}
      <Card className="border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-amber-900">
                ⚠️ Aviso Importante
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">
                Esta análise é gerada por Inteligência Artificial e deve ser utilizada 
                <span className="font-semibold"> apenas como ferramenta de suporte</span> ao diagnóstico. 
                Sempre consulte um profissional qualificado para avaliação definitiva e tomada de decisões clínicas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

