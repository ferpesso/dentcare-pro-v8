import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  Pill,
  Heart,
  FileText,
  Droplet,
} from "lucide-react";
import { toast } from "sonner";
import UtenteDialog from "@/components/UtenteDialog";
import Odontograma3D from "@/components/Odontograma3D";
import Periodontograma from "@/components/Periodontograma";
import Endodontia from "@/components/Endodontia";
import Implantes from "@/components/Implantes";
import Ortodontia from "@/components/Ortodontia";
import Imagens from "@/components/Imagens";
import Laboratorio from "@/components/Laboratorio";
import Prescricoes from "@/components/Prescricoes";
import AssistenteDiagnostico from "@/components/AssistenteDiagnostico";
import VerificadorMedicamentos from "@/components/VerificadorMedicamentos";
import AssistenteNotas from "@/components/AssistenteNotas";
import AssistenteVirtual from "@/components/AssistenteVirtual";

export default function UtenteDetail() {
  const [, params] = useRoute("/utentes/:id");
  const [, setLocation] = useLocation();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const utenteId = params?.id;

  const { data: utente, isLoading, error } = trpc.utentes.obter.useQuery(
    { id: utenteId! },
    { enabled: !!utenteId }
  );

  // Calcular idade
  const calcularIdade = (dataNascimento: string) => {
    const data = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - data.getFullYear();
    const mes = hoje.getMonth() - data.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < data.getDate())) {
      idade--;
    }
    return idade;
  };

  // Obter iniciais do nome
  const obterIniciais = (nome: string) => {
    return nome
      .split(" ")
      .filter((p) => p.length > 0)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("");
  };

  // Gerar cor do avatar
  const gerarCorAvatar = (nome: string) => {
    let hash = 0;
    for (let i = 0; i < nome.length; i++) {
      hash = nome.charCodeAt(i) + ((hash << 5) - hash);
    }
    const cores = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ];
    return cores[Math.abs(hash) % cores.length];
  };

  // Formatar data
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-lg">A carregar...</div>
      </div>
    );
  }

  if (error || !utente) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Erro ao carregar utente
              </CardTitle>
              <CardDescription>
                {error?.message || "Utente não encontrado"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setLocation("/utentes")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar à lista
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const contacto = utente.contacto
    ? (typeof utente.contacto === "string"
      ? JSON.parse(utente.contacto)
      : utente.contacto)
    : null;
  const morada = utente.morada
    ? (typeof utente.morada === "string"
      ? JSON.parse(utente.morada)
      : utente.morada)
    : null;
  const infoMedica = typeof utente.infoMedica === "string"
    ? JSON.parse(utente.infoMedica)
    : utente.infoMedica;

  const idade = calcularIdade(utente.dataNascimento);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/utentes")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Ficha do Utente</h1>
              <p className="text-muted-foreground">{utente.numeroUtente}</p>
            </div>
            <Button onClick={() => setEditDialogOpen(true)} className="gap-2">
              <Edit className="h-4 w-4" />
              Editar
            </Button>
          </div>

          {/* Cabeçalho do utente */}
          <div className="flex items-start gap-6">
            <div
              className={`${gerarCorAvatar(
                utente.nomeCompleto
              )} h-24 w-24 rounded-full flex items-center justify-center text-white font-bold text-3xl`}
            >
              {obterIniciais(utente.nomeCompleto)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold">{utente.nomeCompleto}</h2>
                <Badge
                  variant={
                    utente.status === "ativo"
                      ? "default"
                      : utente.status === "inativo"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {utente.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{idade} anos ({utente.genero})</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>NIF: {utente.nif}</span>
                </div>
                {utente.numUtenteSns && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Heart className="h-4 w-4" />
                    <span>SNS: {utente.numUtenteSns}</span>
                  </div>
                )}
                {infoMedica.grupoSanguineo && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Droplet className="h-4 w-4" />
                    <span>{infoMedica.grupoSanguineo}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container py-8">
        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid grid-cols-6 lg:grid-cols-12 w-full">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="medico">Médico</TabsTrigger>
            <TabsTrigger value="odontograma">Odontograma</TabsTrigger>
            <TabsTrigger value="periodonto">Periodonto</TabsTrigger>
            <TabsTrigger value="endodontia">Endodontia</TabsTrigger>
            <TabsTrigger value="implantes">Implantes</TabsTrigger>
            <TabsTrigger value="ortodontia">Ortodontia</TabsTrigger>
            <TabsTrigger value="imagens">Imagens</TabsTrigger>
            <TabsTrigger value="laboratorio">Laboratório</TabsTrigger>
            <TabsTrigger value="prescricoes">Prescrições</TabsTrigger>
            <TabsTrigger value="ia" className="bg-gradient-to-r from-primary to-purple-600 text-white">🤖 Assistente IA</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
          </TabsList>

          {/* Tab: Informações Gerais */}
          <TabsContent value="geral" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dados Pessoais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Dados Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Nome Completo</p>
                    <p className="font-medium">{utente.nomeCompleto}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium">{formatarData(utente.dataNascimento)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Género</p>
                    <p className="font-medium">
                      {utente.genero === "M"
                        ? "Masculino"
                        : utente.genero === "F"
                        ? "Feminino"
                        : "Outro"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NIF</p>
                    <p className="font-medium">{utente.nif}</p>
                  </div>
                  {utente.numUtenteSns && (
                    <div>
                      <p className="text-sm text-muted-foreground">Número de Utente SNS</p>
                      <p className="font-medium">{utente.numUtenteSns}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contactos */}
              {contacto && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Contactos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {contacto.telefone && (
                      <div>
                        <p className="text-sm text-muted-foreground">Telefone</p>
                        <p className="font-medium">{contacto.telefone}</p>
                      </div>
                    )}
                    {contacto.email && (
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{contacto.email}</p>
                      </div>
                    )}
                    {contacto.telemovel && (
                      <div>
                        <p className="text-sm text-muted-foreground">Telemóvel</p>
                        <p className="font-medium">{contacto.telemovel}</p>
                      </div>
                    )}
                    {contacto.telefoneEmergencia && (
                      <div>
                        <p className="text-sm text-muted-foreground">Telefone de Emergência</p>
                        <p className="font-medium">{contacto.telefoneEmergencia}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Morada */}
              {morada && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Morada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">
                      {morada.rua && morada.numero && `${morada.rua}, ${morada.numero}`}
                    </p>
                    <p className="text-muted-foreground">
                      {morada.codigoPostal && morada.localidade && `${morada.codigoPostal} ${morada.localidade}`}
                    </p>
                    {morada.distrito && <p className="text-muted-foreground">{morada.distrito}</p>}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Tab: Informações Médicas */}
          <TabsContent value="medico" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Alergias */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    Alergias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {infoMedica.alergias && infoMedica.alergias.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {infoMedica.alergias.map((alergia: string, index: number) => (
                        <Badge key={index} variant="destructive">
                          {alergia}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Sem alergias registadas</p>
                  )}
                </CardContent>
              </Card>

              {/* Medicamentos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-600">
                    <Pill className="h-5 w-5" />
                    Medicamentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {infoMedica.medicamentos && infoMedica.medicamentos.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {infoMedica.medicamentos.map((med: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {med}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Sem medicamentos registados</p>
                  )}
                </CardContent>
              </Card>

              {/* Condições Médicas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Condições Médicas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {infoMedica.condicoesMedicas && infoMedica.condicoesMedicas.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {infoMedica.condicoesMedicas.map((cond: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {cond}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Sem condições médicas registadas</p>
                  )}
                </CardContent>
              </Card>

              {/* Classificação ASA */}
              <Card>
                <CardHeader>
                  <CardTitle>Classificação ASA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      ASA {infoMedica.classificacaoAsa}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {infoMedica.classificacaoAsa === "I" && "Saudável"}
                      {infoMedica.classificacaoAsa === "II" && "Doença sistémica leve"}
                      {infoMedica.classificacaoAsa === "III" && "Doença sistémica grave"}
                      {infoMedica.classificacaoAsa === "IV" && "Doença grave com risco de vida"}
                      {infoMedica.classificacaoAsa === "V" && "Moribundo"}
                      {infoMedica.classificacaoAsa === "VI" && "Morte cerebral"}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Notas Importantes */}
              {infoMedica.notasImportantes && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Notas Importantes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{infoMedica.notasImportantes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Tab: Odontograma */}
          <TabsContent value="odontograma" className="space-y-6">
            <Odontograma3D utenteId={utenteId!} />
          </TabsContent>

          {/* Tab: Periodontograma */}
          <TabsContent value="periodonto" className="space-y-6">
            <Periodontograma utenteId={utenteId!} />
          </TabsContent>

          {/* Tab: Endodontia */}
          <TabsContent value="endodontia" className="space-y-6">
            <Endodontia utenteId={utenteId!} />
          </TabsContent>

          {/* Tab: Implantes */}
          <TabsContent value="implantes" className="space-y-6">
            <Implantes utenteId={utenteId!} />
          </TabsContent>

          {/* Tab: Ortodontia */}
          <TabsContent value="ortodontia" className="space-y-6">
            <Ortodontia utenteId={utenteId!} />
          </TabsContent>

          {/* Tab: Imagens */}
          <TabsContent value="imagens" className="space-y-6">
            <Imagens utenteId={utenteId!} />
          </TabsContent>

          {/* Tab: Laboratório */}
          <TabsContent value="laboratorio" className="space-y-6">
            <Laboratorio utenteId={utenteId!} />
          </TabsContent>

          {/* Tab: Prescrições */}
          <TabsContent value="prescricoes" className="space-y-6">
            <Prescricoes utenteId={utenteId!} />
          </TabsContent>

          {/* Tab: Assistente IA */}
          <TabsContent value="ia" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Coluna Esquerda */}
              <div className="space-y-6">
                <AssistenteDiagnostico utenteId={utenteId!} />
                <VerificadorMedicamentos utenteId={utenteId!} />
              </div>

              {/* Coluna Direita */}
              <div className="space-y-6">
                <AssistenteVirtual utenteId={utenteId!} />
              </div>
            </div>

            {/* Linha Inferior */}
            <AssistenteNotas utenteId={utenteId!} />
          </TabsContent>

          {/* Tab: Histórico */}
          <TabsContent value="historico" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Atividades</CardTitle>
                <CardDescription>
                  Consultas, tratamentos e atualizações do utente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Histórico em desenvolvimento</p>
                  <p className="text-sm">
                    Esta funcionalidade estará disponível em breve
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Diálogo de edição */}
      <UtenteDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        utenteId={utenteId}
        mode="edit"
      />
    </div>
  );
}

