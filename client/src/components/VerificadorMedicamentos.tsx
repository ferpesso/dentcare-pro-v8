import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Pill, AlertTriangle, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface VerificadorMedicamentosProps {
  utenteId: string;
}

export default function VerificadorMedicamentos({ utenteId }: VerificadorMedicamentosProps) {
  const [medicamento, setMedicamento] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [resultado, setResultado] = useState<any>(null);

  const verificarMutation = trpc.ia.verificarMedicamento.useMutation({
    onSuccess: (data) => {
      setResultado(data);
      if (data.seguro) {
        toast.success("Medicamento verificado - Seguro para prescrever");
      } else {
        toast.warning("⚠️ Alertas de segurança detectados!");
      }
    },
    onError: (error) => {
      toast.error("Erro ao verificar medicamento: " + error.message);
    },
  });

  const handleVerificar = () => {
    if (!medicamento.trim() || !dosagem.trim()) {
      toast.error("Preencha o medicamento e dosagem");
      return;
    }

    verificarMutation.mutate({
      utenteId,
      medicamento,
      dosagem,
    });
  };

  const handleNovo = () => {
    setMedicamento("");
    setDosagem("");
    setResultado(null);
  };

  return (
    <div className="space-y-6">
      {/* Card de Entrada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            Verificador Inteligente de Medicamentos
          </CardTitle>
          <CardDescription>
            A IA verifica interações medicamentosas, alergias e contraindicações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Medicamento *</label>
              <Input
                placeholder="Ex: Amoxicilina"
                value={medicamento}
                onChange={(e) => setMedicamento(e.target.value)}
                disabled={verificarMutation.isPending}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Dosagem *</label>
              <Input
                placeholder="Ex: 500mg"
                value={dosagem}
                onChange={(e) => setDosagem(e.target.value)}
                disabled={verificarMutation.isPending}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleVerificar}
              disabled={verificarMutation.isPending || !medicamento.trim() || !dosagem.trim()}
              className="flex-1 gap-2"
            >
              {verificarMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Verificar Segurança
                </>
              )}
            </Button>

            {resultado && (
              <Button onClick={handleNovo} variant="outline">
                Nova Verificação
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resultado */}
      {resultado && (
        <Card
          className={`border-l-4 ${
            resultado.seguro
              ? "border-l-green-500 bg-green-50"
              : "border-l-red-500 bg-red-50"
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {resultado.seguro ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-green-700">Medicamento Seguro</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-700">Alertas de Segurança</span>
                </>
              )}
            </CardTitle>
            <CardDescription>
              {medicamento} {dosagem}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Alertas */}
            {resultado.alertas && resultado.alertas.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Alertas Importantes
                </h4>
                <div className="space-y-2">
                  {resultado.alertas.map((alerta: string, idx: number) => (
                    <div
                      key={idx}
                      className="bg-yellow-100 border border-yellow-300 rounded-lg p-3"
                    >
                      <p className="text-sm text-yellow-800">⚠️ {alerta}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alternativas */}
            {resultado.alternativas && resultado.alternativas.length > 0 && (
              <div>
                <h4 className="font-semibold text-sm mb-2">Medicamentos Alternativos Sugeridos</h4>
                <div className="flex flex-wrap gap-2">
                  {resultado.alternativas.map((alt: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-sm">
                      {alt}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Ajuste de Dosagem */}
            {resultado.ajusteDosagem && (
              <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                <h4 className="font-semibold text-sm mb-1 text-blue-800">
                  Sugestão de Ajuste de Dosagem
                </h4>
                <p className="text-sm text-blue-700">{resultado.ajusteDosagem}</p>
              </div>
            )}

            {/* Mensagem de Segurança */}
            {resultado.seguro && resultado.alertas.length === 0 && (
              <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  ✓ Nenhuma contraindicação ou interação perigosa detectada. O medicamento pode ser
                  prescrito com segurança.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Aviso */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-800">
            <strong>💡 Como funciona:</strong> A IA analisa o medicamento em relação às alergias,
            medicamentos atuais e condições médicas do paciente, verificando interações perigosas e
            contraindicações.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

