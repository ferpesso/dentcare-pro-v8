import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Upload, Search, AlertCircle, CheckCircle2, FileSearch } from "lucide-react";

export default function AnaliseRadiografica() {
  const [analisando, setAnalisando] = useState(false);
  const [resultado, setResultado] = useState(false);

  const handleAnalise = () => {
    setAnalisando(true);
    setTimeout(() => {
      setAnalisando(false);
      setResultado(true);
    }, 2000);
  };

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          Análise Radiográfica IA
        </h1>
        <p className="text-muted-foreground">Deteção assistida por inteligência artificial em exames de imagem</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-dashed flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
          <div className="h-20 w-20 bg-primary/5 rounded-full flex items-center justify-center">
            <Upload className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Carregar Radiografia</h3>
            <p className="text-sm text-muted-foreground">Arraste o ficheiro DICOM ou JPG aqui ou clique para selecionar</p>
          </div>
          <Button onClick={handleAnalise} disabled={analisando}>
            {analisando ? "A Processar Imagem..." : "Iniciar Análise Inteligente"}
          </Button>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSearch className="h-5 w-5" />
              Relatório de IA
            </CardTitle>
            <CardDescription>Resultados da análise automática</CardDescription>
          </CardHeader>
          <CardContent>
            {!resultado ? (
              <div className="py-12 text-center text-muted-foreground italic">
                Aguardando carregamento de imagem para análise...
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-900">Possível Cárie Detetada</p>
                    <p className="text-xs text-amber-800">Dente 46 - Face distal. Probabilidade: 89%</p>
                  </div>
                </div>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-green-900">Estrutura Óssea Saudável</p>
                    <p className="text-xs text-green-800">Nível ósseo alveolar dentro dos parâmetros normais.</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-bold mb-2">Sugestão de Tratamento</h4>
                  <p className="text-sm text-muted-foreground">
                    Recomenda-se exploração clínica do dente 46 para confirmação de lesão de cárie e possível restauração.
                  </p>
                </div>
                <Button variant="outline" className="w-full">Exportar Relatório IA</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted/50 p-6 rounded-xl border">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="font-bold">Como funciona?</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A nossa IA foi treinada com mais de 500.000 radiografias dentárias para identificar padrões de patologias comuns. 
          Este sistema serve como uma <strong>segunda opinião digital</strong> para auxiliar o diagnóstico clínico, não substituindo a avaliação final do médico dentista.
        </p>
      </div>
    </div>
  );
}
