import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./cookies";
import { systemRouter } from "./systemRouter";
import { publicProcedure, protectedProcedure, router } from "./trpc";
import { z } from "zod";
import { imagensRouter } from "./routers-imagens";
import { financeiroRouter } from "../routers/financeiro";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ========================================
  // UTENTES (Pacientes)
  // ========================================
  utentes: router({
    // Listar todos os utentes
    listar: protectedProcedure.query(async () => {
      const { listarUtentes } = await import("../db");
      return await listarUtentes();
    }),

    // Obter utente por ID
    obter: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const { obterUtente } = await import("../db");
        return await obterUtente(input.id);
      }),

    // Pesquisar utentes
    pesquisar: protectedProcedure
      .input(z.object({ termo: z.string() }))
      .query(async ({ input }) => {
        const { pesquisarUtentes } = await import("../db");
        return await pesquisarUtentes(input.termo);
      }),

    // Criar novo utente
    criar: protectedProcedure
      .input(
        z.object({
          nomeCompleto: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
          dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida (use YYYY-MM-DD)"),
          genero: z.enum(["M", "F", "Outro"]),
          nif: z.string().length(9, "NIF deve ter 9 dígitos").optional(),
          numUtenteSns: z.string().length(9).optional(),
          fotoPerfil: z.string().optional(),
          contacto: z.object({
            telefone: z.string(),
            email: z.string().email("Email inválido").optional(),
            telemovel: z.string().optional(),
            telefoneEmergencia: z.string().optional(),
          }),
          morada: z.object({
            rua: z.string().optional(),
            numero: z.string().optional(),
            codigoPostal: z.string().regex(/^\d{4}-\d{3}$/, "Código postal inválido").optional(),
            localidade: z.string().optional(),
            distrito: z.string().optional(),
          }).optional(),
          infoMedica: z.object({
            alergias: z.array(z.string()),
            medicamentos: z.array(z.string()),
            condicoesMedicas: z.array(z.string()),
            classificacaoAsa: z.enum(["I", "II", "III", "IV", "V", "VI"]),
            grupoSanguineo: z.string().optional(),
            notasImportantes: z.string().optional(),
          }),
          tags: z.array(z.string()).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { criarUtente } = await import("../db");
        return await criarUtente({
          ...input,
          status: "ativo",
          criadoPor: (ctx.user as any)?.id || "sistema",
        } as any);
      }),

    // Atualizar utente
    atualizar: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          dados: z.object({
            nomeCompleto: z.string().min(3).optional(),
            dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
            genero: z.enum(["M", "F", "Outro"]).optional(),
            nif: z.string().length(9).optional(),
            numUtenteSns: z.string().length(9).optional(),
            fotoPerfil: z.string().optional(),
            contacto: z.object({
              telefone: z.string(),
              email: z.string().email(),
              telemovel: z.string().optional(),
              telefoneEmergencia: z.string().optional(),
            }).optional(),
            morada: z.object({
              rua: z.string(),
              numero: z.string(),
              codigoPostal: z.string().regex(/^\d{4}-\d{3}$/),
              localidade: z.string(),
              distrito: z.string(),
            }).optional(),
            infoMedica: z.object({
              alergias: z.array(z.string()),
              medicamentos: z.array(z.string()),
              condicoesMedicas: z.array(z.string()),
              classificacaoAsa: z.enum(["I", "II", "III", "IV", "V", "VI"]),
              grupoSanguineo: z.string().optional(),
              notasImportantes: z.string().optional(),
            }).optional(),
            status: z.enum(["ativo", "inativo", "arquivado"]).optional(),
            tags: z.array(z.string()).optional(),
          }),
        })
      )
      .mutation(async ({ input }) => {
        const { atualizarUtente } = await import("../db");
        return await atualizarUtente(input.id, input.dados as any);
      }),

    // Remover utente (soft delete)
    remover: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const { removerUtente } = await import("../db");
        await removerUtente(input.id);
        return { sucesso: true };
      }),

    // Obter estatísticas
    estatisticas: protectedProcedure.query(async () => {
      const { obterEstatisticasUtentes } = await import("../db");
      return await obterEstatisticasUtentes();
    }),
  }),

  // ========================================
  // IA - ASSISTENTE INTELIGENTE
  // ========================================
  ia: router({
    // Análise de Imagem Dentária (Raio-X, etc)
    analisarImagem: protectedProcedure
      .input(
        z.object({
          imagemBase64: z.string(),
          tipoImagem: z.string(),
          contexto: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        console.log("🔍 [IA] Iniciando análise de imagem...");
        const { analisarImagemComGemini } = await import("../gemini-image-helper");
        return await analisarImagemComGemini(input);
      }),

    // Assistente de Diagnóstico
    analisarSintomas: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          sintomas: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { obterUtente } = await import("../db");
        const { analisarSintomas } = await import("../ai-helper");

        const utente = await obterUtente(input.utenteId);
        if (!utente) throw new Error("Utente não encontrado");

        const infoMedica: any =
          typeof utente.infoMedica === "string"
            ? JSON.parse(utente.infoMedica)
            : utente.infoMedica;

        const idade =
          new Date().getFullYear() -
          new Date(utente.dataNascimento).getFullYear();

        return await analisarSintomas({
          sintomas: input.sintomas,
          historicoMedico: infoMedica?.notasImportantes,
          alergias: infoMedica?.alergias || [],
          medicamentos: infoMedica?.medicamentos || [],
          idade,
          genero: utente.genero,
        });
      }),

    // Verificação de Medicamento
    verificarMedicamento: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          medicamento: z.string(),
          dosagem: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { obterUtente } = await import("../db");
        const { verificarMedicamento } = await import("../ai-helper");

        const utente = await obterUtente(input.utenteId);
        if (!utente) throw new Error("Utente não encontrado");

        const infoMedica: any =
          typeof utente.infoMedica === "string"
            ? JSON.parse(utente.infoMedica)
            : utente.infoMedica;

        const idade =
          new Date().getFullYear() -
          new Date(utente.dataNascimento).getFullYear();

        return await verificarMedicamento({
          medicamento: input.medicamento,
          dosagem: input.dosagem,
          alergias: infoMedica?.alergias || [],
          medicamentosAtuais: infoMedica?.medicamentos || [],
          condicoesMedicas: infoMedica?.condicoesMedicas || [],
          idade,
        });
      }),

    // Gerar Resumo de Consulta
    gerarResumo: protectedProcedure
      .input(
        z.object({
          notasConsulta: z.string(),
          tratamentosRealizados: z.array(z.string()).optional(),
          proximaConsulta: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { gerarResumoConsulta } = await import("../ai-helper");
        return await gerarResumoConsulta(input);
      }),

    // Análise de Risco
    analisarRisco: protectedProcedure
      .input(z.object({ utenteId: z.string() }))
      .mutation(async ({ input }) => {
        const { obterUtente } = await import("../db");
        const { analisarRiscoPaciente } = await import("../ai-helper");

        const utente = await obterUtente(input.utenteId);
        if (!utente) throw new Error("Utente não encontrado");

        const infoMedica: any =
          typeof utente.infoMedica === "string"
            ? JSON.parse(utente.infoMedica)
            : utente.infoMedica;

        const idade =
          new Date().getFullYear() -
          new Date(utente.dataNascimento).getFullYear();

        return await analisarRiscoPaciente({
          historicoMedico: infoMedica?.notasImportantes || "",
          condicoesMedicas: infoMedica?.condicoesMedicas || [],
          idade,
        });
      }),

    // Assistente Virtual
    assistente: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          pergunta: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { obterUtente } = await import("../db");
        const { assistenteVirtual } = await import("../ai-helper");

        const utente = await obterUtente(input.utenteId);
        if (!utente) throw new Error("Utente não encontrado");

        const infoMedica: any =
          typeof utente.infoMedica === "string"
            ? JSON.parse(utente.infoMedica)
            : utente.infoMedica;

        const idade =
          new Date().getFullYear() -
          new Date(utente.dataNascimento).getFullYear();

        return await assistenteVirtual({
          pergunta: input.pergunta,
          contextoUtente: {
            nome: utente.nomeCompleto,
            idade,
            historicoMedico: infoMedica?.notasImportantes,
            alergias: infoMedica?.alergias,
            medicamentos: infoMedica?.medicamentos,
            condicoesMedicas: infoMedica?.condicoesMedicas,
          },
        });
      }),
  }),

  // ========================================
  // CONSULTAS (Agenda)
  // ========================================
  consultas: router({
    // Listar todas as consultas
    listar: protectedProcedure.query(async () => {
      const { listarConsultas } = await import("../db");
      return await listarConsultas();
    }),

    listarPorPeriodo: protectedProcedure
      .input(z.object({ dataInicio: z.string(), dataFim: z.string() }))
      .query(async ({ input }) => {
        const { listarConsultasPorPeriodo } = await import("../db");
        return await listarConsultasPorPeriodo(input.dataInicio, input.dataFim);
      }),

    // Obter por ID
    obter: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const { obterConsulta } = await import("../db");
        return await obterConsulta(input.id);
      }),

    // Criar nova consulta
    criar: protectedProcedure
      .input(
        z.object({
          utenteId: z.string(),
          medicoId: z.string().optional(),
          dataHora: z.string(),
          duracao: z.number().default(30),
          tipoConsulta: z.string().optional(),
          procedimento: z.string().optional(),
          status: z.enum(["agendada", "confirmada", "realizada", "cancelada", "faltou", "em_atendimento"]).default("agendada"),
          observacoes: z.string().optional(),
          valorEstimado: z.number().optional(),
          classificacaoRisco: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { criarConsulta, verificarConflito } = await import("../db");
        
        // Verificar conflitos se houver médico atribuído
        if (input.medicoId) {
          const temConflito = await verificarConflito(input.medicoId, input.dataHora, input.duracao);
          if (temConflito) {
            throw new Error("Já existe uma consulta agendada para este médico neste horário.");
          }
        }
        
        return await criarConsulta(input as any);
      }),

    // Atualizar consulta
    atualizar: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          utenteId: z.string().optional(),
          medicoId: z.string().optional(),
          dataHora: z.string().optional(),
          duracao: z.number().optional(),
          tipoConsulta: z.string().optional(),
          procedimento: z.string().optional(),
          status: z.enum(["agendada", "confirmada", "realizada", "cancelada", "faltou", "em_atendimento"]).optional(),
          observacoes: z.string().optional(),
          valorEstimado: z.number().optional(),
          classificacaoRisco: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { atualizarConsulta, verificarConflito } = await import("../db");
        const { id, ...dados } = input;
        
        // Verificar conflitos se houver alteração de horário ou médico
        if (dados.medicoId || dados.dataHora || dados.duracao) {
          const consultaAtual = await (await import("../db")).obterConsulta(id);
          const medicoId = dados.medicoId || consultaAtual.medicoId;
          const dataHora = dados.dataHora || consultaAtual.dataHora;
          const duracao = dados.duracao || consultaAtual.duracao;
          
          if (medicoId) {
            const temConflito = await verificarConflito(medicoId, dataHora, duracao, id);
            if (temConflito) {
              throw new Error("Já existe uma consulta agendada para este médico neste horário.");
            }
          }
        }
        
        return await atualizarConsulta(id, dados as any);
      }),

    // Remover consulta
    remover: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        const { removerConsulta } = await import("../db");
        await removerConsulta(input.id);
        return { sucesso: true };
      }),

    // Estatísticas
    estatisticas: protectedProcedure.query(async () => {
      const { obterEstatisticasConsultas } = await import("../db");
      return await obterEstatisticasConsultas();
    }),
  }),

  // Módulo de Imagens
  imagens: imagensRouter,

  // Módulo Financeiro
  financeiro: financeiroRouter,
});

export type AppRouter = typeof appRouter;
