import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Bot, User, Send } from "lucide-react";
import { toast } from "sonner";

interface AssistenteVirtualProps {
  utenteId: string;
}

interface Mensagem {
  tipo: "user" | "assistant";
  conteudo: string;
  timestamp: Date;
}

export default function AssistenteVirtual({ utenteId }: AssistenteVirtualProps) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      tipo: "assistant",
      conteudo:
        "Olá! Sou o assistente virtual do DentCare Pro. Posso responder perguntas sobre este paciente, histórico médico, tratamentos e muito mais. Como posso ajudar?",
      timestamp: new Date(),
    },
  ]);
  const [pergunta, setPergunta] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const assistenteMutation = trpc.ia.assistente.useMutation({
    onSuccess: (resposta) => {
      setMensagens((prev) => [
        ...prev,
        {
          tipo: "assistant",
          conteudo: resposta,
          timestamp: new Date(),
        },
      ]);
    },
    onError: (error) => {
      toast.error("Erro ao consultar assistente: " + error.message);
      setMensagens((prev) => [
        ...prev,
        {
          tipo: "assistant",
          conteudo: "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.",
          timestamp: new Date(),
        },
      ]);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const handleEnviar = () => {
    if (!pergunta.trim() || assistenteMutation.isPending) return;

    // Adicionar mensagem do usuário
    setMensagens((prev) => [
      ...prev,
      {
        tipo: "user",
        conteudo: pergunta,
        timestamp: new Date(),
      },
    ]);

    // Enviar para IA
    assistenteMutation.mutate({
      utenteId,
      pergunta,
    });

    setPergunta("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  const sugestoes = [
    "Qual é o histórico médico deste paciente?",
    "Quais são as alergias conhecidas?",
    "Que medicamentos o paciente está a tomar?",
    "Há alguma contraindicação importante?",
    "Quando foi a última consulta?",
  ];

  const handleSugestao = (sugestao: string) => {
    setPergunta(sugestao);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Assistente Virtual
        </CardTitle>
        <CardDescription>
          Faça perguntas sobre o paciente e obtenha respostas instantâneas
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Área de Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {mensagens.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.tipo === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.tipo === "assistant" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.tipo === "user"
                    ? "bg-primary text-white"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.conteudo}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.tipo === "user" ? "text-white/70" : "text-muted-foreground"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString("pt-PT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {msg.tipo === "user" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {assistenteMutation.isPending && (
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Sugestões */}
        {mensagens.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Perguntas sugeridas:</p>
            <div className="flex flex-wrap gap-2">
              {sugestoes.map((sug, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSugestao(sug)}
                  className="text-xs"
                >
                  {sug}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Digite sua pergunta..."
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={assistenteMutation.isPending}
              className="flex-1"
            />
            <Button
              onClick={handleEnviar}
              disabled={!pergunta.trim() || assistenteMutation.isPending}
              size="icon"
            >
              {assistenteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

