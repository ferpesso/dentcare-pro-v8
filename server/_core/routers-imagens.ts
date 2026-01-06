/**
 * Rotas tRPC para Gestão de Imagens
 * 
 * Este ficheiro contém as rotas para upload, listagem e remoção de imagens.
 * Adicione estas rotas ao appRouter principal em routers.ts
 */

import { protectedProcedure, router } from "./trpc";
import { z } from "zod";
import {
  salvarImagem,
  listarImagensUtente,
  obterImagem,
  removerImagem,
  salvarAnaliseIA,
  obterEstatisticas,
  inicializarArmazenamento,
} from "./image-storage";

// Inicializar armazenamento ao carregar módulo
inicializarArmazenamento().catch(console.error);

export const imagensRouter = router({
  /**
   * Upload de imagem
   */
  upload: protectedProcedure
    .input(
      z.object({
        utenteId: z.string(),
        arquivoBase64: z.string(), // Arquivo em base64
        nomeOriginal: z.string(),
        tipo: z.enum(["raio_x", "fotografia", "tomografia", "scanner_3d", "outro"]),
        categoria: z.string().optional(),
        descricao: z.string().optional(),
        dataImagem: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Converter base64 para Buffer
      const base64Data = input.arquivoBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Salvar imagem
      const metadata = await salvarImagem(
        input.utenteId,
        buffer,
        input.nomeOriginal,
        input.tipo,
        input.categoria,
        input.descricao,
        input.dataImagem
      );

      return metadata;
    }),

  /**
   * Listar imagens de um utente
   */
  listar: protectedProcedure
    .input(z.object({ utenteId: z.string() }))
    .query(async ({ input }) => {
      return await listarImagensUtente(input.utenteId);
    }),

  /**
   * Obter uma imagem específica
   */
  obter: protectedProcedure
    .input(
      z.object({
        utenteId: z.string(),
        imagemId: z.string(),
      })
    )
    .query(async ({ input }) => {
      return await obterImagem(input.utenteId, input.imagemId);
    }),

  /**
   * Remover imagem
   */
  remover: protectedProcedure
    .input(
      z.object({
        utenteId: z.string(),
        imagemId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const sucesso = await removerImagem(input.utenteId, input.imagemId);

      if (!sucesso) {
        throw new Error("Imagem não encontrada");
      }

      return { sucesso: true };
    }),

  /**
   * Salvar análise de IA
   */
  salvarAnaliseIA: protectedProcedure
    .input(
      z.object({
        utenteId: z.string(),
        imagemId: z.string(),
        analise: z.object({
          tipoImagem: z.string(),
          qualidade: z.string(),
          problemasDetectados: z.array(z.string()),
          observacoes: z.array(z.string()),
          recomendacoes: z.array(z.string()),
          nivelUrgencia: z.enum(["baixo", "medio", "alto"]),
          relatorioCompleto: z.string(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const metadata = await salvarAnaliseIA(
        input.utenteId,
        input.imagemId,
        input.analise
      );

      if (!metadata) {
        throw new Error("Imagem não encontrada");
      }

      return metadata;
    }),

  /**
   * Obter estatísticas de armazenamento
   */
  estatisticas: protectedProcedure
    .input(z.object({ utenteId: z.string() }))
    .query(async ({ input }) => {
      return await obterEstatisticas(input.utenteId);
    }),
});

