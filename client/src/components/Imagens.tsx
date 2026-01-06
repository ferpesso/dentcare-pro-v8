import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Upload, Download, Eye, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import AnalisadorImagemIA from "./AnalisadorImagemIA-MELHORADO";

interface Imagem {
  id: string;
  tipo: "raio_x" | "fotografia" | "tomografia" | "scanner_3d" | "outro";
  categoria?: string;
  url: string;
  nomeArquivo: string;
  tamanho?: string;
  dataImagem?: string;
  descricao?: string;
}

interface ImagensProps {
  utenteId: string;
  imagens?: Imagem[];
  onUpload?: (file: File, tipo: string, categoria: string, descricao: string) => Promise<Imagem>;
  onRemover?: (id: string) => void;
}

const TIPOS_IMAGEM = [
  { value: "raio_x", label: "Raio-X" },
  { value: "fotografia", label: "Fotografia" },
  { value: "tomografia", label: "Tomografia" },
  { value: "scanner_3d", label: "Scanner 3D" },
  { value: "outro", label: "Outro" },
];

const CATEGORIAS_RAIO_X = [
  "Periapical",
  "Panorâmica",
  "Bite-wing",
  "Oclusal",
  "Cefalométrica",
];

export default function Imagens({ utenteId, imagens = [], onUpload, onRemover }: ImagensProps) {
  const [lista, setLista] = useState<Imagem[]>(imagens);
  const [imagemVisualizando, setImagemVisualizando] = useState<Imagem | null>(null);
  const [invertida, setInvertida] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Upload form
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [tipo, setTipo] = useState<string>("raio_x");
  const [categoria, setCategoria] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArquivo(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!arquivo) {
      toast.error("Selecione um arquivo!");
      return;
    }

    setUploading(true);
    try {
      if (onUpload) {
        const novaImagem = await onUpload(arquivo, tipo, categoria, descricao);
        setLista([...lista, novaImagem]);
        toast.success("Imagem carregada com sucesso!");
      } else {
        // Simular upload local
        const url = URL.createObjectURL(arquivo);
        const novaImagem: Imagem = {
          id: Date.now().toString(),
          tipo: tipo as any,
          categoria,
          url,
          nomeArquivo: arquivo.name,
          tamanho: `${(arquivo.size / 1024).toFixed(1)} KB`,
          dataImagem: new Date().toISOString().split("T")[0],
          descricao,
        };
        setLista([...lista, novaImagem]);
        toast.success("Imagem adicionada!");
      }
      
      // Reset form
      setArquivo(null);
      setTipo("raio_x");
      setCategoria("");
      setDescricao("");
    } catch (error) {
      toast.error("Erro ao carregar imagem!");
    } finally {
      setUploading(false);
    }
  };

  const handleRemover = (id: string) => {
    if (confirm("Remover esta imagem?")) {
      setLista(lista.filter((i) => i.id !== id));
      if (onRemover) {
        onRemover(id);
      }
      toast.success("Imagem removida!");
    }
  };

  const handleDownload = (imagem: Imagem) => {
    const a = document.createElement("a");
    a.href = imagem.url;
    a.download = imagem.nomeArquivo;
    a.click();
    toast.success("Download iniciado!");
  };

  return (
    <div className="space-y-6">
      {/* Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload de Imagens</CardTitle>
          <CardDescription>Raios-X, fotografias, tomografias e outros</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo *</label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TIPOS_IMAGEM.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              {tipo === "raio_x" ? (
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIAS_RAIO_X.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Ex: Intraoral"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Arquivo *</label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            {arquivo && (
              <p className="text-sm text-muted-foreground">
                {arquivo.name} ({(arquivo.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Observações sobre a imagem..."
              rows={2}
            />
          </div>

          <Button onClick={handleUpload} disabled={uploading || !arquivo} className="w-full gap-2">
            <Upload className="h-4 w-4" />
            {uploading ? "A carregar..." : "Carregar Imagem"}
          </Button>
        </CardContent>
      </Card>

      {/* Galeria */}
      <Card>
        <CardHeader>
          <CardTitle>Imagens ({lista.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {lista.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma imagem carregada</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {lista.map((imagem) => (
                <div key={imagem.id} className="border rounded-lg overflow-hidden group">
                  <div className="aspect-square bg-muted relative">
                    <img
                      src={imagem.url}
                      alt={imagem.nomeArquivo}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => {
                          setImagemVisualizando(imagem);
                          setInvertida(false);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleDownload(imagem)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleRemover(imagem.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-2">
                    <Badge variant="outline" className="text-xs mb-1">
                      {TIPOS_IMAGEM.find((t) => t.value === imagem.tipo)?.label}
                    </Badge>
                    <p className="text-xs font-medium truncate">{imagem.nomeArquivo}</p>
                    {imagem.categoria && (
                      <p className="text-xs text-muted-foreground">{imagem.categoria}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visualizador */}
      <Dialog open={!!imagemVisualizando} onOpenChange={() => setImagemVisualizando(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{imagemVisualizando?.nomeArquivo}</DialogTitle>
          </DialogHeader>
          {imagemVisualizando && (
            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              <div className="flex items-center gap-2">
                <Badge>{TIPOS_IMAGEM.find((t) => t.value === imagemVisualizando.tipo)?.label}</Badge>
                {imagemVisualizando.categoria && <Badge variant="outline">{imagemVisualizando.categoria}</Badge>}
                {imagemVisualizando.dataImagem && (
                  <span className="text-sm text-muted-foreground">{imagemVisualizando.dataImagem}</span>
                )}
              </div>

              <div className="relative bg-black rounded-lg overflow-hidden max-h-[300px] flex items-center justify-center">
                <img
                  src={imagemVisualizando.url}
                  alt={imagemVisualizando.nomeArquivo}
                  className="w-auto h-auto max-h-[300px] max-w-full object-contain"
                  style={{
                    filter: invertida ? "invert(1)" : "none",
                  }}
                />
              </div>

              {imagemVisualizando.descricao && (
                <p className="text-sm text-muted-foreground">{imagemVisualizando.descricao}</p>
              )}

              <div className="flex gap-2">
                <Button
                  variant={invertida ? "default" : "outline"}
                  onClick={() => setInvertida(!invertida)}
                  className="flex-1"
                >
                  {invertida ? "Cor Normal" : "Inverter Cor"}
                </Button>
                <Button variant="outline" onClick={() => handleDownload(imagemVisualizando)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              {/* Análise com IA */}
              <AnalisadorImagemIA 
                imagemUrl={imagemVisualizando.url}
                imagemTipo={imagemVisualizando.tipo}
                imagemNome={imagemVisualizando.nomeArquivo}
                imagemId={imagemVisualizando.id}
                utenteId={utenteId}
                analiseExistente={(imagemVisualizando as any).analiseIA || null}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

