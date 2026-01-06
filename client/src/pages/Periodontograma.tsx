import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Activity, Save, RefreshCw, AlertCircle } from "lucide-react";

export default function Periodontograma() {
  const [dados, setDados] = useState([
    { dente: 18, sangramento: false, placa: false, profundidade: 2, recessao: 0 },
    { dente: 17, sangramento: true, placa: true, profundidade: 4, recessao: 1 },
    { dente: 16, sangramento: false, placa: true, profundidade: 3, recessao: 0 },
    { dente: 15, sangramento: false, placa: false, profundidade: 2, recessao: 0 },
  ]);

  return (
    <div className="container py-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            Periodontograma
          </h1>
          <p className="text-muted-foreground">Avaliação detalhada da saúde gengival e suporte ósseo</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Resetar
          </Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Guardar Exame
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 hover-lift">
          <CardHeader>
            <CardTitle>Mapeamento Periodontal</CardTitle>
            <CardDescription>Insira os valores de profundidade de sondagem e recessão</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dente</TableHead>
                  <TableHead>Sangramento</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Profundidade (mm)</TableHead>
                  <TableHead>Recessão (mm)</TableHead>
                  <TableHead>Nível de Inserção</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dados.map((d, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-bold">{d.dente}</TableCell>
                    <TableCell>
                      <input type="checkbox" checked={d.sangramento} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    </TableCell>
                    <TableCell>
                      <input type="checkbox" checked={d.placa} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    </TableCell>
                    <TableCell>
                      <input type="number" defaultValue={d.profundidade} className="w-16 p-1 border rounded text-center" />
                    </TableCell>
                    <TableCell>
                      <input type="number" defaultValue={d.recessao} className="w-16 p-1 border rounded text-center" />
                    </TableCell>
                    <TableCell>
                      <Badge variant={d.profundidade + d.recessao > 3 ? "destructive" : "outline"}>
                        {d.profundidade + d.recessao} mm
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="hover-lift border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">Resumo do Exame</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Sítios com Sangramento</span>
                <Badge variant="destructive">25%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Índice de Placa</span>
                <Badge variant="destructive">40%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Média Profundidade</span>
                <span className="font-bold">2.8 mm</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6 flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800">
                <strong>Atenção:</strong> Foram detetadas bolsas periodontais superiores a 3mm nos dentes 17 e 16. Recomenda-se raspagem e alisamento radicular.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
