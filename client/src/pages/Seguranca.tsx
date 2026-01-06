import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, History, UserX, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Seguranca() {
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Segurança e RGPD
        </h1>
        <p className="text-muted-foreground">Controlo de acessos, auditoria e conformidade com a proteção de dados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Acesso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Autenticação 2FA</span>
              <Badge variant="outline" className="text-green-600 border-green-600">Ativo</Badge>
            </div>
            <Button variant="outline" className="w-full">Alterar Palavra-passe</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserX className="h-4 w-4" />
              Direitos do Utente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Download className="h-4 w-4" /> Portabilidade de Dados
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
              <UserX className="h-4 w-4" /> Direito ao Esquecimento
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Privacidade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Encriptação DB</span>
              <Badge className="bg-blue-600">AES-256</Badge>
            </div>
            <Button variant="outline" className="w-full">Termos de Utilização</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Log de Auditoria
          </CardTitle>
          <CardDescription>Registo de todas as ações realizadas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilizador</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>Data e Hora</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { user: "Dr. Ricardo", acao: "Visualização", recurso: "Ficha Utente #124", data: "2024-01-06 14:22", ip: "192.168.1.45" },
                { user: "Dra. Sofia", acao: "Edição", recurso: "Prescrição #8812", data: "2024-01-06 11:05", ip: "192.168.1.12" },
                { user: "Admin", acao: "Login", recurso: "Sistema", data: "2024-01-06 08:30", ip: "85.241.10.122" },
              ].map((log, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{log.acao}</Badge>
                  </TableCell>
                  <TableCell>{log.recurso}</TableCell>
                  <TableCell>{log.data}</TableCell>
                  <TableCell className="text-xs font-mono">{log.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="ghost" className="w-full mt-4 text-muted-foreground">Ver Logs Antigos</Button>
        </CardContent>
      </Card>
    </div>
  );
}
