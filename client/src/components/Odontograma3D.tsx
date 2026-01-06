import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Numeração FDI dos dentes
const DENTES_SUPERIORES = {
  direita: ["18", "17", "16", "15", "14", "13", "12", "11"],
  esquerda: ["21", "22", "23", "24", "25", "26", "27", "28"],
};

const DENTES_INFERIORES = {
  direita: ["48", "47", "46", "45", "44", "43", "42", "41"],
  esquerda: ["31", "32", "33", "34", "35", "36", "37", "38"],
};

const ESTADOS_DENTE = [
  { value: "saudavel", label: "Saudável", cor: "#FFFFFF", borda: "#E5E7EB" },
  { value: "carie", label: "Cárie", cor: "#FEE2E2", borda: "#EF4444" },
  { value: "restauracao", label: "Restauração", cor: "#DBEAFE", borda: "#3B82F6" },
  { value: "coroa", label: "Coroa", cor: "#FEF3C7", borda: "#F59E0B" },
  { value: "ponte", label: "Ponte", cor: "#E9D5FF", borda: "#A855F7" },
  { value: "implante", label: "Implante", cor: "#D1FAE5", borda: "#10B981" },
  { value: "extraido", label: "Extraído", cor: "#F3F4F6", borda: "#6B7280" },
  { value: "ausente", label: "Ausente", cor: "#FAFAFA", borda: "#D1D5DB" },
  { value: "tratamento_canal", label: "Trat. Canal", cor: "#FCE7F3", borda: "#EC4899" },
];

interface DenteEstado {
  numeroDente: string;
  estado: string;
  observacoes?: string;
}

interface Odontograma3DProps {
  utenteId: string;
  dados?: DenteEstado[];
  onSalvar?: (dados: DenteEstado[]) => void;
}

export default function Odontograma3D({ utenteId, dados = [], onSalvar }: Odontograma3DProps) {
  const [denteSelecionado, setDenteSelecionado] = useState<string | null>(null);
  const [estadosDentes, setEstadosDentes] = useState<Record<string, DenteEstado>>(
    dados.reduce((acc, d) => ({ ...acc, [d.numeroDente]: d }), {})
  );

  const getCorDente = (numeroDente: string) => {
    const estado = estadosDentes[numeroDente]?.estado || "saudavel";
    return ESTADOS_DENTE.find((e) => e.value === estado) || ESTADOS_DENTE[0];
  };

  const handleDenteClick = (numeroDente: string) => {
    setDenteSelecionado(numeroDente);
  };

  const handleEstadoChange = (estado: string) => {
    if (!denteSelecionado) return;
    
    setEstadosDentes((prev) => ({
      ...prev,
      [denteSelecionado]: {
        numeroDente: denteSelecionado,
        estado,
        observacoes: prev[denteSelecionado]?.observacoes || "",
      },
    }));
  };

  const handleObservacoesChange = (observacoes: string) => {
    if (!denteSelecionado) return;
    
    setEstadosDentes((prev) => ({
      ...prev,
      [denteSelecionado]: {
        ...prev[denteSelecionado],
        numeroDente: denteSelecionado,
        estado: prev[denteSelecionado]?.estado || "saudavel",
        observacoes,
      },
    }));
  };

  const handleSalvar = () => {
    const dadosArray = Object.values(estadosDentes);
    if (onSalvar) {
      onSalvar(dadosArray);
    }
    toast.success("Odontograma salvo com sucesso!");
  };

  const renderDente = (numeroDente: string) => {
    const cores = getCorDente(numeroDente);
    const selecionado = denteSelecionado === numeroDente;

    return (
      <div
        key={numeroDente}
        className="flex flex-col items-center gap-1 cursor-pointer"
        onClick={() => handleDenteClick(numeroDente)}
      >
        <svg
          width="32"
          height="48"
          viewBox="0 0 32 48"
          className={`transition-all ${selecionado ? "scale-110" : "hover:scale-105"}`}
        >
          {/* Dente 3D com efeito de profundidade */}
          <defs>
            <linearGradient id={`grad-${numeroDente}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: cores.cor, stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: cores.cor, stopOpacity: 0.7 }} />
            </linearGradient>
            <filter id={`shadow-${numeroDente}`}>
              <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.3" />
            </filter>
          </defs>
          
          {/* Coroa do dente */}
          <path
            d="M 8 8 Q 8 4 12 4 L 20 4 Q 24 4 24 8 L 24 24 Q 24 28 20 28 L 12 28 Q 8 28 8 24 Z"
            fill={`url(#grad-${numeroDente})`}
            stroke={cores.borda}
            strokeWidth={selecionado ? "3" : "2"}
            filter={`url(#shadow-${numeroDente})`}
          />
          
          {/* Raiz do dente */}
          <path
            d="M 12 28 L 14 44 L 18 44 L 20 28 Z"
            fill={cores.cor}
            fillOpacity="0.6"
            stroke={cores.borda}
            strokeWidth={selecionado ? "2" : "1"}
          />
          
          {/* Brilho 3D */}
          <ellipse
            cx="14"
            cy="12"
            rx="4"
            ry="6"
            fill="white"
            opacity="0.3"
          />
        </svg>
        <span className={`text-xs font-mono ${selecionado ? "font-bold text-primary" : "text-muted-foreground"}`}>
          {numeroDente}
        </span>
      </div>
    );
  };

  const denteAtual = denteSelecionado ? estadosDentes[denteSelecionado] : null;

  return (
    <div className="space-y-6">
      {/* Odontograma Visual */}
      <Card>
        <CardHeader>
          <CardTitle>Odontograma 3D</CardTitle>
          <CardDescription>Clique num dente para editar o seu estado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Arcada Superior */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-center">Arcada Superior</p>
            <div className="flex justify-center gap-8">
              <div className="flex gap-2">
                {DENTES_SUPERIORES.direita.map(renderDente)}
              </div>
              <div className="w-px bg-border" />
              <div className="flex gap-2">
                {DENTES_SUPERIORES.esquerda.map(renderDente)}
              </div>
            </div>
          </div>

          {/* Linha divisória */}
          <div className="border-t-2 border-dashed border-border" />

          {/* Arcada Inferior */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-center">Arcada Inferior</p>
            <div className="flex justify-center gap-8">
              <div className="flex gap-2">
                {DENTES_INFERIORES.direita.map(renderDente)}
              </div>
              <div className="w-px bg-border" />
              <div className="flex gap-2">
                {DENTES_INFERIORES.esquerda.map(renderDente)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legenda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Legenda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ESTADOS_DENTE.map((estado) => (
              <Badge
                key={estado.value}
                variant="outline"
                style={{
                  backgroundColor: estado.cor,
                  borderColor: estado.borda,
                  color: "#000",
                }}
              >
                {estado.label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Editor do Dente Selecionado */}
      {denteSelecionado && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Dente {denteSelecionado}</CardTitle>
            <CardDescription>Editar estado e observações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select
                value={denteAtual?.estado || "saudavel"}
                onValueChange={handleEstadoChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS_DENTE.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border"
                          style={{
                            backgroundColor: estado.cor,
                            borderColor: estado.borda,
                          }}
                        />
                        {estado.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Observações</label>
              <Textarea
                value={denteAtual?.observacoes || ""}
                onChange={(e) => handleObservacoesChange(e.target.value)}
                placeholder="Notas sobre este dente..."
                rows={3}
              />
            </div>

            <Button onClick={handleSalvar} className="w-full">
              Guardar Alterações
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

