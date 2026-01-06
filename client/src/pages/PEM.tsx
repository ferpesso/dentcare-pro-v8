import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, FileText, Lock, RefreshCw, ExternalLink } from "lucide-react";

export default function PEM() {
  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Prescrição Eletrónica (PEM)
          </h1>
          <p className="text-muted-foreground">Integração certificada com o sistema nacional de saúde (SPMS)</p>
        </div>
        <Badge variant="outline" className="text-primary border-primary gap-1 px-3 py-1">
          <Lock className="h-3 w-3" /> Acesso Seguro
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Autenticação Profissional</CardTitle>
            <CardDescription>Necessário Cartão de Cidadão ou Chave Móvel Digital</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg bg-muted/50 text-center space-y-3">
              <div className="h-12 w-12 bg-background rounded-full flex items-center justify-center mx-auto border shadow-sm">
                <RefreshCw className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Sessão não iniciada</p>
              <Button className="w-full">Autenticar no PEM</Button>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Nº Cédula Profissional</label>
              <Input placeholder="Ex: 12345" />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Últimas Prescrições Emitidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { utente: "Ana Martins", data: "2024-01-05", guia: "PEM-2024-8812", status: "Ativa" },
                { utente: "Carlos Rocha", data: "2024-01-03", guia: "PEM-2024-7741", status: "Dispensada" },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded bg-primary/5 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{p.utente}</p>
                      <p className="text-xs text-muted-foreground">Guia: {p.guia} • {p.data}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={p.status === "Ativa" ? "default" : "secondary"}>{p.status}</Badge>
                    <Button variant="ghost" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed">Ver Histórico Completo</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-6 flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-primary">Conformidade Legal</h4>
            <p className="text-sm text-primary/80">
              Este módulo cumpre todas as normas da SPMS e da ACSS para a prescrição eletrónica de medicamentos e meios complementares de diagnóstico e terapêutica (MCDT).
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
