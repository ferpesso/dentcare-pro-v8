import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface MedicoesPeriodontais {
  numeroDente: string;
  profundidadeVestibular: [number, number, number];
  profundidadeLingual: [number, number, number];
  sangramentoVestibular: [boolean, boolean, boolean];
  sangramentoLingual: [boolean, boolean, boolean];
  mobilidade: 0 | 1 | 2 | 3;
}

interface PeriodontogramaProps {
  utenteId: string;
  dataAvaliacao?: string;
  dados?: MedicoesPeriodontais[];
  onSalvar?: (dados: MedicoesPeriodontais[], dataAvaliacao: string) => void;
}

const DENTES = [
  "18", "17", "16", "15", "14", "13", "12", "11",
  "21", "22", "23", "24", "25", "26", "27", "28",
  "48", "47", "46", "45", "44", "43", "42", "41",
  "31", "32", "33", "34", "35", "36", "37", "38",
];

export default function Periodontograma({ utenteId, dataAvaliacao, dados = [], onSalvar }: PeriodontogramaProps) {
  const [data, setData] = useState(dataAvaliacao || new Date().toISOString().split("T")[0]);
  const [medicoes, setMedicoes] = useState<Record<string, MedicoesPeriodontais>>(
    dados.reduce((acc, d) => ({ ...acc, [d.numeroDente]: d }), {})
  );
  const [denteSelecionado, setDenteSelecionado] = useState<string | null>(null);

  const getMedicao = (numeroDente: string): MedicoesPeriodontais => {
    return (
      medicoes[numeroDente] || {
        numeroDente,
        profundidadeVestibular: [0, 0, 0],
        profundidadeLingual: [0, 0, 0],
        sangramentoVestibular: [false, false, false],
        sangramentoLingual: [false, false, false],
        mobilidade: 0,
      }
    );
  };

  const updateMedicao = (numeroDente: string, campo: string, valor: any) => {
    setMedicoes((prev) => ({
      ...prev,
      [numeroDente]: {
        ...getMedicao(numeroDente),
        [campo]: valor,
      },
    }));
  };

  const getCorProfundidade = (prof: number) => {
    if (prof === 0) return "#E5E7EB";
    if (prof <= 3) return "#86EFAC"; // Verde
    if (prof <= 5) return "#FDE047"; // Amarelo
    return "#FCA5A5"; // Vermelho
  };

  const handleSalvar = () => {
    const dadosArray = Object.values(medicoes).filter(
      (m) => m.profundidadeVestibular.some((p) => p > 0) || m.profundidadeLingual.some((p) => p > 0)
    );
    if (onSalvar) {
      onSalvar(dadosArray, data);
    }
    toast.success("Periodontograma salvo com sucesso!");
  };

  const renderDente = (numeroDente: string) => {
    const medicao = getMedicao(numeroDente);
    const maxProf = Math.max(...medicao.profundidadeVestibular, ...medicao.profundidadeLingual);
    const temSangramento =
      medicao.sangramentoVestibular.some((s) => s) || medicao.sangramentoLingual.some((s) => s);

    return (
      <div
        key={numeroDente}
        className={`flex flex-col items-center gap-1 p-2 rounded cursor-pointer transition-all ${
          denteSelecionado === numeroDente ? "bg-primary/10 ring-2 ring-primary" : "hover:bg-muted"
        }`}
        onClick={() => setDenteSelecionado(numeroDente)}
      >
        {/* Profundidade Vestibular */}
        <div className="flex gap-px">
          {medicao.profundidadeVestibular.map((prof, idx) => (
            <div
              key={`v-${idx}`}
              className="w-5 h-8 flex items-end justify-center text-xs font-mono border"
              style={{ backgroundColor: getCorProfundidade(prof) }}
            >
              {prof > 0 && prof}
              {medicao.sangramentoVestibular[idx] && (
                <span className="text-red-600 font-bold">•</span>
              )}
            </div>
          ))}
        </div>

        {/* Número do dente */}
        <div className="text-xs font-mono font-bold">{numeroDente}</div>

        {/* Mobilidade */}
        {medicao.mobilidade > 0 && (
          <Badge variant="destructive" className="text-xs">
            M{medicao.mobilidade}
          </Badge>
        )}

        {/* Profundidade Lingual */}
        <div className="flex gap-px">
          {medicao.profundidadeLingual.map((prof, idx) => (
            <div
              key={`l-${idx}`}
              className="w-5 h-8 flex items-start justify-center text-xs font-mono border"
              style={{ backgroundColor: getCorProfundidade(prof) }}
            >
              {prof > 0 && prof}
              {medicao.sangramentoLingual[idx] && (
                <span className="text-red-600 font-bold">•</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const medicaoAtual = denteSelecionado ? getMedicao(denteSelecionado) : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Periodontograma</CardTitle>
          <CardDescription>
            Registo rápido de profundidade de sondagem e sangramento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Data da Avaliação:</label>
            <Input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-auto"
            />
          </div>

          {/* Arcada Superior */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Arcada Superior</p>
            <div className="flex justify-center gap-1 flex-wrap">
              {DENTES.slice(0, 16).map(renderDente)}
            </div>
          </div>

          <div className="border-t" />

          {/* Arcada Inferior */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Arcada Inferior</p>
            <div className="flex justify-center gap-1 flex-wrap">
              {DENTES.slice(16).map(renderDente)}
            </div>
          </div>

          {/* Legenda */}
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-300 border" />
              <span>≤3mm (Saudável)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-300 border" />
              <span>4-5mm (Alerta)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-300 border" />
              <span>&gt;5mm (Doença)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-600 font-bold text-lg">•</span>
              <span>Sangramento</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor do Dente Selecionado */}
      {denteSelecionado && medicaoAtual && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dente {denteSelecionado}</CardTitle>
            <CardDescription>Edição rápida de medições</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Profundidade Vestibular */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Profundidade Vestibular (mm)</label>
              <div className="flex gap-2">
                {[0, 1, 2].map((idx) => (
                  <Input
                    key={`pv-${idx}`}
                    type="number"
                    min="0"
                    max="15"
                    value={medicaoAtual.profundidadeVestibular[idx]}
                    onChange={(e) => {
                      const newVals = [...medicaoAtual.profundidadeVestibular] as [number, number, number];
                      newVals[idx] = parseInt(e.target.value) || 0;
                      updateMedicao(denteSelecionado, "profundidadeVestibular", newVals);
                    }}
                    className="w-20 text-center"
                  />
                ))}
              </div>
            </div>

            {/* Profundidade Lingual */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Profundidade Lingual (mm)</label>
              <div className="flex gap-2">
                {[0, 1, 2].map((idx) => (
                  <Input
                    key={`pl-${idx}`}
                    type="number"
                    min="0"
                    max="15"
                    value={medicaoAtual.profundidadeLingual[idx]}
                    onChange={(e) => {
                      const newVals = [...medicaoAtual.profundidadeLingual] as [number, number, number];
                      newVals[idx] = parseInt(e.target.value) || 0;
                      updateMedicao(denteSelecionado, "profundidadeLingual", newVals);
                    }}
                    className="w-20 text-center"
                  />
                ))}
              </div>
            </div>

            {/* Mobilidade */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Mobilidade</label>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((mob) => (
                  <Button
                    key={mob}
                    variant={medicaoAtual.mobilidade === mob ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateMedicao(denteSelecionado, "mobilidade", mob)}
                  >
                    {mob === 0 ? "Nenhuma" : `Grau ${mob}`}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={handleSalvar} className="w-full">
              Guardar Periodontograma
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

