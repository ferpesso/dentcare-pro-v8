import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { useUtentes, useUtentesStats, useRemoverUtente } from "@/hooks/useMockableQuery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  User, 
  Phone, 
  Mail, 
  Calendar,
  AlertCircle,
  Pill,
  FileText,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import UtenteDialog from "@/components/UtenteDialog";

export default function Utentes() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [utenteEditando, setUtenteEditando] = useState<string | undefined>();

  // Abrir modal automaticamente se vier com ?novo=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("novo") === "true") {
      setUtenteEditando(undefined);
      setDialogMode("create");
      setDialogOpen(true);
      // Limpar o parâmetro da URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Query client para invalidar queries
  const queryClient = useQueryClient();
  
  // Query para listar utentes
  const { data: utentes, isLoading, error } = useUtentes();
  const { data: stats } = useUtentesStats();

  // Mutation para remover utente
  const removerMutation = useRemoverUtente();

  // Filtrar utentes pela pesquisa
  const utentesFiltrados = (utentes as any[])?.filter((utente: any) => {
    if (!searchTerm) return true;
    const termo = searchTerm.toLowerCase();
    
    const contacto = typeof utente.contacto === "string" 
      ? JSON.parse(utente.contacto) 
      : utente.contacto;
    
    return (
      utente.nomeCompleto.toLowerCase().includes(termo) ||
      (utente.nif && utente.nif.toLowerCase().includes(termo)) ||
      utente.numeroUtente.toLowerCase().includes(termo) ||
      (utente.numUtenteSns && utente.numUtenteSns.toLowerCase().includes(termo)) ||
      (contacto && contacto.email && contacto.email.toLowerCase().includes(termo))
    );
  }) || [];

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

  const handleVer = (id: string) => {
    setLocation(`/utentes/${id}`);
  };

  const handleEditar = (id: string) => {
    setUtenteEditando(id);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleArquivar = (id: string, nome: string) => {
    if (confirm(`Tem a certeza que deseja arquivar o utente ${nome}?`)) {
      removerMutation.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['utentes'] });
          queryClient.invalidateQueries({ queryKey: ['utentes-stats'] });
          toast.success("Utente arquivado com sucesso!");
        },
        onError: (error: any) => {
          toast.error(`Erro ao arquivar utente: ${error.message}`);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-lg">A carregar utentes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                Erro ao carregar utentes
              </CardTitle>
              <CardDescription>{(error as any).message}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const statsData = stats as any;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Utentes</h1>
              <p className="text-muted-foreground">Gestão de pacientes da clínica</p>
            </div>
            <Button
              className="gap-2"
              onClick={() => {
                setUtenteEditando(undefined);
                setDialogMode("create");
                setDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Novo Utente
            </Button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{statsData?.total || 0}</div>
                <p className="text-sm text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-green-600">{statsData?.ativos || 0}</div>
                <p className="text-sm text-muted-foreground">Ativos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-orange-600">{statsData?.inativos || 0}</div>
                <p className="text-sm text-muted-foreground">Inativos</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-gray-600">{statsData?.arquivados || 0}</div>
                <p className="text-sm text-muted-foreground">Arquivados</p>
              </CardContent>
            </Card>
          </div>

          {/* Pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar por nome, NIF, SNS, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Lista de Utentes */}
      <div className="container py-8">
        {utentesFiltrados.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Nenhum utente encontrado com os critérios de pesquisa"
                  : "Nenhum utente cadastrado"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {utentesFiltrados.map((utente: any) => {
              const contacto = typeof utente.contacto === "string"
                ? JSON.parse(utente.contacto)
                : utente.contacto;
              const infoMedica = typeof utente.infoMedica === "string"
                ? JSON.parse(utente.infoMedica)
                : utente.infoMedica;
              const idade = calcularIdade(utente.dataNascimento);

              return (
                <Card key={utente.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div
                        className={`${gerarCorAvatar(
                          utente.nomeCompleto
                        )} h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}
                      >
                        {obterIniciais(utente.nomeCompleto)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg truncate">
                            {utente.nomeCompleto}
                          </CardTitle>
                          <Badge
                            variant={
                              utente.status === "ativo"
                                ? "default"
                                : utente.status === "inativo"
                                ? "secondary"
                                : "outline"
                            }
                            className="flex-shrink-0"
                          >
                            {utente.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {utente.numeroUtente}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 flex-shrink-0" />
                      <span>
                        {idade} anos ({utente.genero})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{contacto?.telefone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{contacto?.email}</span>
                    </div>

                    {/* Tags Médicas Rápidas */}
                    <div className="flex flex-wrap gap-1 pt-2">
                      {infoMedica?.alergias?.length > 0 && (
                        <Badge variant="destructive" className="text-[10px] h-5">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Alergias
                        </Badge>
                      )}
                      {infoMedica?.medicamentos?.length > 0 && (
                        <Badge variant="secondary" className="text-[10px] h-5">
                          <Pill className="h-3 w-3 mr-1" />
                          Medicação
                        </Badge>
                      )}
                      {infoMedica?.condicoesMedicas?.length > 0 && (
                        <Badge variant="outline" className="text-[10px] h-5">
                          <FileText className="h-3 w-3 mr-1" />
                          Condições
                        </Badge>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex items-center gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => handleVer(utente.id)}
                      >
                        <Eye className="h-3 w-3" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1"
                        onClick={() => handleEditar(utente.id)}
                      >
                        <Edit className="h-3 w-3" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleArquivar(utente.id, utente.nomeCompleto)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Dialog de Criação/Edição */}
      <UtenteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        utenteId={utenteEditando}
      />
    </div>
  );
}
