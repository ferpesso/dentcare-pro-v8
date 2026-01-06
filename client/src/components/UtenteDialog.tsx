import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";

interface UtenteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  utenteId?: string;
  mode: "create" | "edit";
}

// Listas pré-definidas
const ALERGIAS_COMUNS = [
  "Penicilina",
  "Amoxicilina",
  "Látex",
  "Níquel",
  "Acrílico",
  "Lidocaína",
  "Articaína",
  "Ibuprofeno",
  "Aspirina",
  "Amendoim",
  "Marisco",
  "Glúten",
];

const MEDICAMENTOS_COMUNS = [
  "Paracetamol",
  "Ibuprofeno",
  "Amoxicilina",
  "Azitromicina",
  "Enalapril 10mg",
  "Losartan 50mg",
  "Metformina 850mg",
  "Metformina 1000mg",
  "Insulina",
  "Sinvastatina 40mg",
  "Atorvastatina 20mg",
  "Levotiroxina 100mcg",
  "Omeprazol 20mg",
];

const CONDICOES_COMUNS = [
  "Hipertensão",
  "Diabetes tipo 1",
  "Diabetes tipo 2",
  "Colesterol alto",
  "Asma",
  "Problemas cardíacos",
  "Problemas respiratórios",
  "Epilepsia",
  "Osteoporose",
  "Artrite",
];

const DISTRITOS_PORTUGAL = [
  "Aveiro",
  "Beja",
  "Braga",
  "Bragança",
  "Castelo Branco",
  "Coimbra",
  "Évora",
  "Faro",
  "Guarda",
  "Leiria",
  "Lisboa",
  "Portalegre",
  "Porto",
  "Santarém",
  "Setúbal",
  "Viana do Castelo",
  "Vila Real",
  "Viseu",
  "Açores",
  "Madeira",
];

export default function UtenteDialog({
  open,
  onOpenChange,
  utenteId,
  mode,
}: UtenteDialogProps) {
  const utils = trpc.useUtils();

  // Estado do formulário
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    dataNascimento: "",
    genero: "M" as "M" | "F" | "Outro",
    nif: "",
    numUtenteSns: "",
    telefone: "",
    email: "",
    telemovel: "",
    telefoneEmergencia: "",
    rua: "",
    numero: "",
    codigoPostal: "",
    localidade: "",
    distrito: "",
    alergias: [] as string[],
    medicamentos: [] as string[],
    condicoesMedicas: [] as string[],
    classificacaoAsa: "I" as "I" | "II" | "III" | "IV" | "V" | "VI",
    grupoSanguineo: "",
    notasImportantes: "",
  });

  const [novaAlergia, setNovaAlergia] = useState("");
  const [novoMedicamento, setNovoMedicamento] = useState("");
  const [novaCondicao, setNovaCondicao] = useState("");

  // Carregar dados do utente se for edição
  const { data: utente } = trpc.utentes.obter.useQuery(
    { id: utenteId! },
    { enabled: mode === "edit" && !!utenteId }
  );

  useEffect(() => {
    if (utente && mode === "edit") {
      const contacto = utente.contacto
        ? (typeof utente.contacto === "string" 
          ? JSON.parse(utente.contacto) 
          : utente.contacto)
        : { telefone: "", email: "", telemovel: "", telefoneEmergencia: "" };
      const morada = utente.morada
        ? (typeof utente.morada === "string"
          ? JSON.parse(utente.morada)
          : utente.morada)
        : { rua: "", numero: "", codigoPostal: "", localidade: "", distrito: "" };
      const infoMedica = typeof utente.infoMedica === "string"
        ? JSON.parse(utente.infoMedica)
        : utente.infoMedica;

      setFormData({
        nomeCompleto: utente.nomeCompleto,
        dataNascimento: utente.dataNascimento,
        genero: utente.genero,
        nif: utente.nif || "",
        numUtenteSns: utente.numUtenteSns || "",
        telefone: contacto.telefone || "",
        email: contacto.email || "",
        telemovel: contacto.telemovel || "",
        telefoneEmergencia: contacto.telefoneEmergencia || "",
        rua: morada.rua || "",
        numero: morada.numero || "",
        codigoPostal: morada.codigoPostal || "",
        localidade: morada.localidade || "",
        distrito: morada.distrito || "",
        alergias: infoMedica.alergias || [],
        medicamentos: infoMedica.medicamentos || [],
        condicoesMedicas: infoMedica.condicoesMedicas || [],
        classificacaoAsa: infoMedica.classificacaoAsa,
        grupoSanguineo: infoMedica.grupoSanguineo || "",
        notasImportantes: infoMedica.notasImportantes || "",
      });
    }
  }, [utente, mode]);

  // Mutations
  const criarMutation = trpc.utentes.criar.useMutation({
    onSuccess: () => {
      utils.utentes.listar.invalidate();
      utils.utentes.estatisticas.invalidate();
      toast.success("Utente criado com sucesso!");
      onOpenChange(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(`Erro ao criar utente: ${(error as any).message}`);
    },
  });

  const atualizarMutation = trpc.utentes.atualizar.useMutation({
    onSuccess: () => {
      utils.utentes.listar.invalidate();
      utils.utentes.obter.invalidate({ id: utenteId! });
      toast.success("Utente atualizado com sucesso!");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar utente: ${(error as any).message}`);
    },
  });

  const resetForm = () => {
    setFormData({
      nomeCompleto: "",
      dataNascimento: "",
      genero: "M",
      nif: "",
      numUtenteSns: "",
      telefone: "",
      email: "",
      telemovel: "",
      telefoneEmergencia: "",
      rua: "",
      numero: "",
      codigoPostal: "",
      localidade: "",
      distrito: "",
      alergias: [],
      medicamentos: [],
      condicoesMedicas: [],
      classificacaoAsa: "I",
      grupoSanguineo: "",
      notasImportantes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nomeCompleto: formData.nomeCompleto,
      dataNascimento: formData.dataNascimento,
      genero: formData.genero,
      nif: formData.nif,
      numUtenteSns: formData.numUtenteSns || undefined,
      contacto: {
        telefone: formData.telefone,
        email: formData.email,
        telemovel: formData.telemovel || undefined,
        telefoneEmergencia: formData.telefoneEmergencia || undefined,
      },
      morada: {
        rua: formData.rua,
        numero: formData.numero,
        codigoPostal: formData.codigoPostal,
        localidade: formData.localidade,
        distrito: formData.distrito,
      },
      infoMedica: {
        alergias: formData.alergias,
        medicamentos: formData.medicamentos,
        condicoesMedicas: formData.condicoesMedicas,
        classificacaoAsa: formData.classificacaoAsa,
        grupoSanguineo: formData.grupoSanguineo || undefined,
        notasImportantes: formData.notasImportantes || undefined,
      },
    };

    if (mode === "create") {
      criarMutation.mutate(payload);
    } else {
      atualizarMutation.mutate({
        id: utenteId!,
        dados: payload,
      });
    }
  };

  const adicionarItem = (tipo: "alergia" | "medicamento" | "condicao") => {
    if (tipo === "alergia" && novaAlergia.trim()) {
      setFormData({
        ...formData,
        alergias: [...formData.alergias, novaAlergia.trim()],
      });
      setNovaAlergia("");
    } else if (tipo === "medicamento" && novoMedicamento.trim()) {
      setFormData({
        ...formData,
        medicamentos: [...formData.medicamentos, novoMedicamento.trim()],
      });
      setNovoMedicamento("");
    } else if (tipo === "condicao" && novaCondicao.trim()) {
      setFormData({
        ...formData,
        condicoesMedicas: [...formData.condicoesMedicas, novaCondicao.trim()],
      });
      setNovaCondicao("");
    }
  };

  const removerItem = (tipo: "alergia" | "medicamento" | "condicao", index: number) => {
    if (tipo === "alergia") {
      setFormData({
        ...formData,
        alergias: formData.alergias.filter((_, i) => i !== index),
      });
    } else if (tipo === "medicamento") {
      setFormData({
        ...formData,
        medicamentos: formData.medicamentos.filter((_, i) => i !== index),
      });
    } else if (tipo === "condicao") {
      setFormData({
        ...formData,
        condicoesMedicas: formData.condicoesMedicas.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Novo Utente" : "Editar Utente"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Preencha os dados do novo utente"
              : "Atualize as informações do utente"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="geral" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
              <TabsTrigger value="contacto">Contactos</TabsTrigger>
              <TabsTrigger value="medico">Informações Médicas</TabsTrigger>
            </TabsList>

            {/* Tab: Dados Gerais */}
            <TabsContent value="geral" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                  <Input
                    id="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={(e) =>
                      setFormData({ ...formData, nomeCompleto: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                  <Input
                    id="dataNascimento"
                    type="date"
                    value={formData.dataNascimento}
                    onChange={(e) =>
                      setFormData({ ...formData, dataNascimento: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="genero">Género *</Label>
                  <Select
                    value={formData.genero}
                    onValueChange={(value: "M" | "F" | "Outro") =>
                      setFormData({ ...formData, genero: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Feminino</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="nif">NIF *</Label>
                  <Input
                    id="nif"
                    value={formData.nif}
                    onChange={(e) =>
                      setFormData({ ...formData, nif: e.target.value })
                    }
                    maxLength={9}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="numUtenteSns">Número de Utente SNS</Label>
                  <Input
                    id="numUtenteSns"
                    value={formData.numUtenteSns}
                    onChange={(e) =>
                      setFormData({ ...formData, numUtenteSns: e.target.value })
                    }
                    maxLength={9}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab: Contactos */}
            <TabsContent value="contacto" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone *</Label>
                  <Input
                    id="telefone"
                    type="tel"
                    placeholder="+351 912 345 678"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({ ...formData, telefone: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="telemovel">Telemóvel</Label>
                  <Input
                    id="telemovel"
                    type="tel"
                    placeholder="+351 912 345 678"
                    value={formData.telemovel}
                    onChange={(e) =>
                      setFormData({ ...formData, telemovel: e.target.value })
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="telefoneEmergencia">Telefone de Emergência</Label>
                  <Input
                    id="telefoneEmergencia"
                    type="tel"
                    placeholder="+351 912 345 678"
                    value={formData.telefoneEmergencia}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        telefoneEmergencia: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="rua">Rua *</Label>
                  <Input
                    id="rua"
                    value={formData.rua}
                    onChange={(e) =>
                      setFormData({ ...formData, rua: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="numero">Número *</Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) =>
                      setFormData({ ...formData, numero: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="codigoPostal">Código Postal *</Label>
                  <Input
                    id="codigoPostal"
                    placeholder="1000-001"
                    value={formData.codigoPostal}
                    onChange={(e) =>
                      setFormData({ ...formData, codigoPostal: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="localidade">Localidade *</Label>
                  <Input
                    id="localidade"
                    value={formData.localidade}
                    onChange={(e) =>
                      setFormData({ ...formData, localidade: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="distrito">Distrito *</Label>
                  <Select
                    value={formData.distrito}
                    onValueChange={(value) =>
                      setFormData({ ...formData, distrito: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      {DISTRITOS_PORTUGAL.map((distrito) => (
                        <SelectItem key={distrito} value={distrito}>
                          {distrito}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Tab: Informações Médicas */}
            <TabsContent value="medico" className="space-y-4">
              {/* Alergias */}
              <div>
                <Label>Alergias</Label>
                <div className="flex gap-2 mt-2">
                  <Select
                    value={novaAlergia}
                    onValueChange={setNovaAlergia}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione ou digite" />
                    </SelectTrigger>
                    <SelectContent>
                      {ALERGIAS_COMUNS.map((alergia) => (
                        <SelectItem key={alergia} value={alergia}>
                          {alergia}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Ou digite nova alergia"
                    value={novaAlergia}
                    onChange={(e) => setNovaAlergia(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => adicionarItem("alergia")}
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.alergias.map((alergia, index) => (
                    <Badge key={index} variant="destructive" className="gap-1">
                      {alergia}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removerItem("alergia", index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Medicamentos */}
              <div>
                <Label>Medicamentos</Label>
                <div className="flex gap-2 mt-2">
                  <Select
                    value={novoMedicamento}
                    onValueChange={setNovoMedicamento}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione ou digite" />
                    </SelectTrigger>
                    <SelectContent>
                      {MEDICAMENTOS_COMUNS.map((med) => (
                        <SelectItem key={med} value={med}>
                          {med}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Ou digite novo medicamento"
                    value={novoMedicamento}
                    onChange={(e) => setNovoMedicamento(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => adicionarItem("medicamento")}
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.medicamentos.map((med, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {med}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removerItem("medicamento", index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Condições Médicas */}
              <div>
                <Label>Condições Médicas</Label>
                <div className="flex gap-2 mt-2">
                  <Select
                    value={novaCondicao}
                    onValueChange={setNovaCondicao}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecione ou digite" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDICOES_COMUNS.map((cond) => (
                        <SelectItem key={cond} value={cond}>
                          {cond}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Ou digite nova condição"
                    value={novaCondicao}
                    onChange={(e) => setNovaCondicao(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => adicionarItem("condicao")}
                    size="icon"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.condicoesMedicas.map((cond, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {cond}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removerItem("condicao", index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="classificacaoAsa">Classificação ASA *</Label>
                  <Select
                    value={formData.classificacaoAsa}
                    onValueChange={(value: "I" | "II" | "III" | "IV" | "V" | "VI") =>
                      setFormData({ ...formData, classificacaoAsa: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="I">ASA I - Saudável</SelectItem>
                      <SelectItem value="II">ASA II - Doença sistémica leve</SelectItem>
                      <SelectItem value="III">ASA III - Doença sistémica grave</SelectItem>
                      <SelectItem value="IV">ASA IV - Doença grave com risco de vida</SelectItem>
                      <SelectItem value="V">ASA V - Moribundo</SelectItem>
                      <SelectItem value="VI">ASA VI - Morte cerebral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="grupoSanguineo">Grupo Sanguíneo</Label>
                  <Select
                    value={formData.grupoSanguineo}
                    onValueChange={(value) =>
                      setFormData({ ...formData, grupoSanguineo: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="notasImportantes">Notas Importantes</Label>
                <Textarea
                  id="notasImportantes"
                  value={formData.notasImportantes}
                  onChange={(e) =>
                    setFormData({ ...formData, notasImportantes: e.target.value })
                  }
                  rows={4}
                  placeholder="Observações relevantes sobre o utente..."
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={criarMutation.isPending || atualizarMutation.isPending}
            >
              {mode === "create" ? "Criar Utente" : "Guardar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

