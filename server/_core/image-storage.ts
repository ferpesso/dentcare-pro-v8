/**
 * Módulo de Gestão de Imagens com Persistência
 * 
 * Este módulo implementa armazenamento persistente de imagens no sistema de ficheiros.
 * As imagens são organizadas por utente e não se perdem quando o servidor reinicia.
 * 
 * Estrutura de pastas:
 * uploads/
 *   └── imagens/
 *       └── {utenteId}/
 *           ├── {imagemId}_original.{ext}
 *           └── {imagemId}_thumb.{ext}
 */

import fs from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";

// Configuração
const UPLOADS_DIR = path.join(process.cwd(), "uploads");
const IMAGENS_DIR = path.join(UPLOADS_DIR, "imagens");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];

// Interface para metadados de imagem
export interface AnaliseIA {
  dataAnalise: string;
  tipoImagem: string;
  qualidade: string;
  problemasDetectados: string[];
  observacoes: string[];
  recomendacoes: string[];
  nivelUrgencia: "baixo" | "medio" | "alto";
  relatorioCompleto: string;
}

export interface ImagemMetadata {
  id: string;
  utenteId: string;
  tipo: "raio_x" | "fotografia" | "tomografia" | "scanner_3d" | "outro";
  categoria?: string;
  nomeOriginal: string;
  nomeArquivo: string;
  extensao: string;
  tamanho: number;
  tamanhoFormatado: string;
  dataUpload: string;
  dataImagem?: string;
  descricao?: string;
  caminhoOriginal: string;
  url: string;
  analiseIA?: AnaliseIA; // Análise de IA salva
}

/**
 * Inicializa as pastas necessárias para armazenamento
 */
export async function inicializarArmazenamento(): Promise<void> {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.mkdir(IMAGENS_DIR, { recursive: true });
    console.log("✅ Diretórios de armazenamento inicializados");
  } catch (error) {
    console.error("❌ Erro ao inicializar armazenamento:", error);
    throw error;
  }
}

/**
 * Gera um ID único para a imagem
 */
function gerarIdImagem(): string {
  return `img_${Date.now()}_${randomBytes(8).toString("hex")}`;
}

/**
 * Valida extensão do ficheiro
 */
function validarExtensao(nomeArquivo: string): boolean {
  const ext = path.extname(nomeArquivo).toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

/**
 * Formata tamanho em bytes para formato legível
 */
function formatarTamanho(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Cria pasta para utente se não existir
 */
async function criarPastaUtente(utenteId: string): Promise<string> {
  const pastaUtente = path.join(IMAGENS_DIR, utenteId);
  await fs.mkdir(pastaUtente, { recursive: true });
  return pastaUtente;
}

/**
 * Salva imagem no disco
 * 
 * @param utenteId - ID do utente
 * @param arquivo - Buffer do arquivo
 * @param nomeOriginal - Nome original do arquivo
 * @param tipo - Tipo de imagem
 * @param categoria - Categoria (opcional)
 * @param descricao - Descrição (opcional)
 * @param dataImagem - Data da imagem (opcional)
 * @returns Metadados da imagem salva
 */
export async function salvarImagem(
  utenteId: string,
  arquivo: Buffer,
  nomeOriginal: string,
  tipo: ImagemMetadata["tipo"],
  categoria?: string,
  descricao?: string,
  dataImagem?: string
): Promise<ImagemMetadata> {
  // Validações
  if (!validarExtensao(nomeOriginal)) {
    throw new Error(`Extensão não permitida. Use: ${ALLOWED_EXTENSIONS.join(", ")}`);
  }

  if (arquivo.length > MAX_FILE_SIZE) {
    throw new Error(`Arquivo muito grande. Máximo: ${formatarTamanho(MAX_FILE_SIZE)}`);
  }

  // Gerar ID e preparar caminhos
  const id = gerarIdImagem();
  const extensao = path.extname(nomeOriginal).toLowerCase();
  const pastaUtente = await criarPastaUtente(utenteId);
  const nomeArquivo = `${id}${extensao}`;
  const caminhoCompleto = path.join(pastaUtente, nomeArquivo);

  // Salvar arquivo
  await fs.writeFile(caminhoCompleto, arquivo);

  // Criar metadados
  const metadata: ImagemMetadata = {
    id,
    utenteId,
    tipo,
    categoria,
    nomeOriginal,
    nomeArquivo,
    extensao,
    tamanho: arquivo.length,
    tamanhoFormatado: formatarTamanho(arquivo.length),
    dataUpload: new Date().toISOString(),
    dataImagem,
    descricao,
    caminhoOriginal: caminhoCompleto,
    url: `/uploads/imagens/${utenteId}/${nomeArquivo}`,
  };

  // Salvar metadados em JSON
  const metadataPath = path.join(pastaUtente, `${id}.json`);
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

  console.log(`✅ Imagem salva: ${nomeArquivo} (${metadata.tamanhoFormatado})`);

  return metadata;
}

/**
 * Lista todas as imagens de um utente
 * 
 * @param utenteId - ID do utente
 * @returns Array de metadados das imagens
 */
export async function listarImagensUtente(utenteId: string): Promise<ImagemMetadata[]> {
  const pastaUtente = path.join(IMAGENS_DIR, utenteId);

  try {
    await fs.access(pastaUtente);
  } catch {
    // Pasta não existe, retornar array vazio
    return [];
  }

  const arquivos = await fs.readdir(pastaUtente);
  const arquivosJson = arquivos.filter((f) => f.endsWith(".json"));

  const imagens: ImagemMetadata[] = [];

  for (const arquivo of arquivosJson) {
    try {
      const conteudo = await fs.readFile(path.join(pastaUtente, arquivo), "utf-8");
      const metadata = JSON.parse(conteudo) as ImagemMetadata;
      imagens.push(metadata);
    } catch (error) {
      console.error(`Erro ao ler metadados: ${arquivo}`, error);
    }
  }

  // Ordenar por data de upload (mais recentes primeiro)
  return imagens.sort((a, b) => 
    new Date(b.dataUpload).getTime() - new Date(a.dataUpload).getTime()
  );
}

/**
 * Obtém metadados de uma imagem específica
 * 
 * @param utenteId - ID do utente
 * @param imagemId - ID da imagem
 * @returns Metadados da imagem ou null se não encontrada
 */
export async function obterImagem(
  utenteId: string,
  imagemId: string
): Promise<ImagemMetadata | null> {
  const metadataPath = path.join(IMAGENS_DIR, utenteId, `${imagemId}.json`);

  try {
    const conteudo = await fs.readFile(metadataPath, "utf-8");
    return JSON.parse(conteudo) as ImagemMetadata;
  } catch {
    return null;
  }
}

/**
 * Remove uma imagem do disco
 * 
 * @param utenteId - ID do utente
 * @param imagemId - ID da imagem
 * @returns true se removida com sucesso, false se não encontrada
 */
export async function removerImagem(
  utenteId: string,
  imagemId: string
): Promise<boolean> {
  const metadata = await obterImagem(utenteId, imagemId);

  if (!metadata) {
    return false;
  }

  try {
    // Remover arquivo de imagem
    await fs.unlink(metadata.caminhoOriginal);

    // Remover arquivo de metadados
    const metadataPath = path.join(IMAGENS_DIR, utenteId, `${imagemId}.json`);
    await fs.unlink(metadataPath);

    console.log(`✅ Imagem removida: ${metadata.nomeArquivo}`);
    return true;
  } catch (error) {
    console.error(`❌ Erro ao remover imagem: ${imagemId}`, error);
    return false;
  }
}

/**
 * Lê o conteúdo de uma imagem como Buffer
 * 
 * @param utenteId - ID do utente
 * @param imagemId - ID da imagem
 * @returns Buffer da imagem ou null se não encontrada
 */
export async function lerImagem(
  utenteId: string,
  imagemId: string
): Promise<Buffer | null> {
  const metadata = await obterImagem(utenteId, imagemId);

  if (!metadata) {
    return null;
  }

  try {
    return await fs.readFile(metadata.caminhoOriginal);
  } catch {
    return null;
  }
}

/**
 * Obtém estatísticas de armazenamento de um utente
 * 
 * @param utenteId - ID do utente
 * @returns Estatísticas de uso
 */
export async function obterEstatisticas(utenteId: string): Promise<{
  totalImagens: number;
  tamanhoTotal: number;
  tamanhoTotalFormatado: string;
  porTipo: Record<string, number>;
}> {
  const imagens = await listarImagensUtente(utenteId);

  const tamanhoTotal = imagens.reduce((acc, img) => acc + img.tamanho, 0);

  const porTipo = imagens.reduce((acc, img) => {
    acc[img.tipo] = (acc[img.tipo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalImagens: imagens.length,
    tamanhoTotal,
    tamanhoTotalFormatado: formatarTamanho(tamanhoTotal),
    porTipo,
  };
}

/**
 * Limpa imagens antigas (opcional - para manutenção)
 * 
 * @param diasAntigos - Número de dias para considerar imagem antiga
 * @returns Número de imagens removidas
 */
export async function limparImagensAntigas(diasAntigos: number = 365): Promise<number> {
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() - diasAntigos);

  let removidas = 0;

  try {
    const utentes = await fs.readdir(IMAGENS_DIR);

    for (const utenteId of utentes) {
      const imagens = await listarImagensUtente(utenteId);

      for (const imagem of imagens) {
        const dataUpload = new Date(imagem.dataUpload);

        if (dataUpload < dataLimite) {
          const sucesso = await removerImagem(utenteId, imagem.id);
          if (sucesso) removidas++;
        }
      }
    }
  } catch (error) {
    console.error("Erro ao limpar imagens antigas:", error);
  }

  console.log(`🧹 Limpeza concluída: ${removidas} imagens antigas removidas`);
  return removidas;
}



/**
 * Salva análise de IA para uma imagem
 * 
 * @param utenteId - ID do utente
 * @param imagemId - ID da imagem
 * @param analise - Resultado da análise de IA
 * @returns Metadados atualizados ou null se imagem não encontrada
 */
export async function salvarAnaliseIA(
  utenteId: string,
  imagemId: string,
  analise: Omit<AnaliseIA, "dataAnalise">
): Promise<ImagemMetadata | null> {
  const metadata = await obterImagem(utenteId, imagemId);

  if (!metadata) {
    return null;
  }

  // Adicionar data da análise
  const analiseCompleta: AnaliseIA = {
    ...analise,
    dataAnalise: new Date().toISOString(),
  };

  // Atualizar metadados
  metadata.analiseIA = analiseCompleta;

  // Salvar metadados atualizados
  const metadataPath = path.join(IMAGENS_DIR, utenteId, `${imagemId}.json`);
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

  console.log(`✅ Análise de IA salva para imagem: ${imagemId}`);

  return metadata;
}

/**
 * Remove análise de IA de uma imagem
 * 
 * @param utenteId - ID do utente
 * @param imagemId - ID da imagem
 * @returns true se removida com sucesso, false se não encontrada
 */
export async function removerAnaliseIA(
  utenteId: string,
  imagemId: string
): Promise<boolean> {
  const metadata = await obterImagem(utenteId, imagemId);

  if (!metadata || !metadata.analiseIA) {
    return false;
  }

  // Remover análise
  delete metadata.analiseIA;

  // Salvar metadados atualizados
  const metadataPath = path.join(IMAGENS_DIR, utenteId, `${imagemId}.json`);
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));

  console.log(`✅ Análise de IA removida da imagem: ${imagemId}`);

  return true;
}

