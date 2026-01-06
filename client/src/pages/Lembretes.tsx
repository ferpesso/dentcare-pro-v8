import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, Settings, CheckCircle2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Lembretes() {
  const [template, setTemplate] = useState(
    "Olá [NOME_UTENTE], lembramos que tem uma consulta agendada na DentCare Pro para amanhã, dia [DATA], às [HORA]. Por favor, confirme a sua presença respondendo a esta mensagem. Até breve!"
  );

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MessageSquare className="h-8 w-8 text-primary" />
          Lembretes WhatsApp
        </h1>
        <p className="text-muted-foreground">Automatização de notificações e confirmações de consulta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Template</CardTitle>
              <CardDescription>Personalize a mensagem que será enviada aos pacientes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Mensagem Padrão</label>
                <Textarea 
                  value={template} 
                  onChange={(e) => setTemplate(e.target.value)}
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  Variáveis disponíveis: [NOME_UTENTE], [DATA], [HORA], [MEDICO]
                </p>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Envio Automático</p>
                  <p className="text-xs text-muted-foreground">Enviar 24h antes da consulta</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button className="w-full gap-2">
                <Settings className="h-4 w-4" />
                Guardar Configurações
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fila de Envio</CardTitle>
              <CardDescription>Mensagens agendadas para as próximas 24 horas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { nome: "João Silva", hora: "09:30", status: "pendente" },
                  { nome: "Maria Santos", hora: "11:00", status: "enviado" },
                  { nome: "Pedro Oliveira", hora: "14:30", status: "pendente" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.nome}</p>
                        <p className="text-xs text-muted-foreground">Amanhã às {item.hora}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === "enviado" ? (
                        <Badge variant="outline" className="text-green-600 gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Enviado
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-600 gap-1">
                          <Clock className="h-3 w-3" /> Agendado
                        </Badge>
                      )}
                      <Button variant="ghost" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status da API</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Conexão</span>
                <Badge className="bg-green-600">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Créditos</span>
                <span className="font-bold">1.240</span>
              </div>
              <Button variant="outline" className="w-full">Recarregar Créditos</Button>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-base">Dica de Ouro</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs opacity-90">
                Mensagens enviadas via WhatsApp têm uma taxa de abertura de 98%, comparado a apenas 20% do e-mail.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
