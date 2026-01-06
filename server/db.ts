import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: any = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: any = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========================================
// UTENTES (Pacientes)
// ========================================

import { utentes, type Utente, type InsertUtente } from "../drizzle/schema";
import { desc, like, or } from "drizzle-orm";

/**
 * Gerar número de utente sequencial
 * Formato: U-2025-0001
 */
export async function gerarNumeroUtente(): Promise<string> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const ano = new Date().getFullYear();
  const prefixo = `U-${ano}-`;

  // Buscar último número do ano
  const ultimoUtente = await db
    .select()
    .from(utentes)
    .where(like(utentes.numeroUtente, `${prefixo}%`))
    .orderBy(desc(utentes.numeroUtente))
    .limit(1);

  let proximoNumero = 1;
  if (ultimoUtente.length > 0) {
    const ultimoNumero = parseInt(ultimoUtente[0].numeroUtente.split("-")[2]);
    proximoNumero = ultimoNumero + 1;
  }

  return `${prefixo}${proximoNumero.toString().padStart(4, "0")}`;
}

/**
 * Criar novo utente
 */
export async function criarUtente(data: Omit<InsertUtente, "numeroUtente">): Promise<Utente> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const numeroUtente = await gerarNumeroUtente();

  const [utente] = await db.insert(utentes).values({
    ...data,
    numeroUtente,
  } as any).$returningId();

  return await obterUtente(utente.id);
}

/**
 * Obter utente por ID
 */
export async function obterUtente(id: string): Promise<Utente> {
  const db = await getDb();
  
  // Se não houver base de dados, usar dados mock do servidor
  if (!db) {
    const { serverMockUtentesAPI } = await import("./mockData");
    const utente = await serverMockUtentesAPI.obter(id);
    if (!utente) {
      throw new Error(`Utente não encontrado: ${id}`);
    }
    return utente as unknown as Utente;
  }

  const resultado = await db.select().from(utentes).where(eq(utentes.id, id)).limit(1);

  if (resultado.length === 0) {
    throw new Error(`Utente não encontrado: ${id}`);
  }

  return resultado[0] as unknown as Utente;
}

/**
 * Listar todos os utentes
 */
export async function listarUtentes(): Promise<Utente[]> {
  const db = await getDb();
  
  // Se não houver base de dados, usar dados mock do servidor
  if (!db) {
    const { serverMockUtentesAPI } = await import("./mockData");
    return await serverMockUtentesAPI.listar() as unknown as Utente[];
  }

  return await db.select().from(utentes).orderBy(desc(utentes.criadoEm)) as unknown as Utente[];
}

/**
 * Pesquisar utentes por termo
 */
export async function pesquisarUtentes(termo: string): Promise<Utente[]> {
  const db = await getDb();
  
  // Se não houver base de dados, usar dados mock do servidor
  if (!db) {
    const { serverMockUtentesAPI } = await import("./mockData");
    return await serverMockUtentesAPI.pesquisar(termo) as unknown as Utente[];
  }

  const termoPesquisa = `%${termo}%`;

  return await db
    .select()
    .from(utentes)
    .where(
      or(
        like(utentes.nomeCompleto, termoPesquisa),
        like(utentes.nif, termoPesquisa),
        like(utentes.numUtenteSns, termoPesquisa),
        like(utentes.numeroUtente, termoPesquisa)
      )
    )
    .orderBy(desc(utentes.criadoEm)) as unknown as Utente[];
}

/**
 * Atualizar utente
 */
export async function atualizarUtente(id: string, data: Partial<Omit<InsertUtente, "id" | "numeroUtente">>): Promise<Utente> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(utentes).set(data).where(eq(utentes.id, id));

  return await obterUtente(id);
}

/**
 * Remover utente (soft delete)
 */
export async function removerUtente(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(utentes).set({ status: "arquivado" }).where(eq(utentes.id, id));
}

/**
 * Obter estatísticas de utentes
 */
export async function obterEstatisticasUtentes(): Promise<{
  total: number;
  ativos: number;
  inativos: number;
  arquivados: number;
}> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const todosUtentes = await db.select().from(utentes) as any[];

  return {
    total: todosUtentes.length,
    ativos: todosUtentes.filter(u => u.status === "ativo").length,
    inativos: todosUtentes.filter(u => u.status === "inativo").length,
    arquivados: todosUtentes.filter(u => u.status === "arquivado").length,
  };
}


// ========================================
// CONSULTAS
// ========================================

export interface Consulta {
  id: string;
  utenteId: string;
  medicoId: string | null;
  dataHora: string; // ISO 8601 format
  duracao: number;
  tipoConsulta: string | null;
  procedimento: string | null;
  status: "agendada" | "confirmada" | "realizada" | "cancelada" | "faltou" | "em_atendimento";
  observacoes: string | null;
  valorEstimado: number | null;
  classificacaoRisco: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface InsertConsulta {
  id?: string;
  utenteId: string;
  medicoId?: string | null;
  dataHora: string;
  duracao?: number;
  tipoConsulta?: string | null;
  procedimento?: string | null;
  status?: "agendada" | "confirmada" | "realizada" | "cancelada" | "faltou" | "em_atendimento";
  observacoes?: string | null;
  valorEstimado?: number | null;
  classificacaoRisco?: string | null;
}

/**
 * Listar todas as consultas
 */
export async function listarConsultas(): Promise<Consulta[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.execute(sql`
    SELECT 
      id,
      utente_id as utenteId,
      medico_id as medicoId,
      DATE_FORMAT(data_hora, '%Y-%m-%dT%H:%i:%s') as dataHora,
      duracao,
      tipo_consulta as tipoConsulta,
      procedimento,
      status,
      observacoes,
      valor_estimado as valorEstimado,
      classificacao_risco as classificacaoRisco,
      DATE_FORMAT(criado_em, '%Y-%m-%dT%H:%i:%s') as criadoEm,
      DATE_FORMAT(atualizado_em, '%Y-%m-%dT%H:%i:%s') as atualizadoEm
    FROM consultas
    ORDER BY data_hora DESC
  `);
  
  return result[0] as unknown as Consulta[];
}

/**
 * Obter consulta por ID
 */
export async function obterConsulta(id: string): Promise<Consulta> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.execute(sql`
    SELECT 
      id,
      utente_id as utenteId,
      medico_id as medicoId,
      DATE_FORMAT(data_hora, '%Y-%m-%dT%H:%i:%s') as dataHora,
      duracao,
      tipo_consulta as tipoConsulta,
      procedimento,
      status,
      observacoes,
      valor_estimado as valorEstimado,
      classificacao_risco as classificacaoRisco,
      DATE_FORMAT(criado_em, '%Y-%m-%dT%H:%i:%s') as criadoEm,
      DATE_FORMAT(atualizado_em, '%Y-%m-%dT%H:%i:%s') as atualizadoEm
    FROM consultas
    WHERE id = ${id}
  `);
  
  const consultas = result[0] as unknown as Consulta[];
  if (!consultas || consultas.length === 0) {
    throw new Error(`Consulta com ID ${id} não encontrada`);
  }
  
  return consultas[0];
}

/**
 * Criar nova consulta
 */
export async function criarConsulta(data: InsertConsulta): Promise<Consulta> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const id = data.id || `CST${Date.now()}${Math.random().toString(36).substring(2, 9)}`;
  
  await db.execute(sql`
    INSERT INTO consultas (
      id, utente_id, medico_id, data_hora, duracao, 
      tipo_consulta, procedimento, status, observacoes, 
      valor_estimado, classificacao_risco
    ) VALUES (
      ${id}, ${data.utenteId}, ${data.medicoId || null}, ${data.dataHora}, ${data.duracao || 30},
      ${data.tipoConsulta || null}, ${data.procedimento || null}, ${data.status || 'agendada'}, 
      ${data.observacoes || null}, ${data.valorEstimado || null}, ${data.classificacaoRisco || null}
    )
  `);
  
  return await obterConsulta(id);
}

/**
 * Atualizar consulta
 */
export async function atualizarConsulta(id: string, data: Partial<InsertConsulta>): Promise<Consulta> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const sets = [];
  if (data.utenteId) sets.push(sql`utente_id = ${data.utenteId}`);
  if (data.medicoId !== undefined) sets.push(sql`medico_id = ${data.medicoId}`);
  if (data.dataHora) sets.push(sql`data_hora = ${data.dataHora}`);
  if (data.duracao !== undefined) sets.push(sql`duracao = ${data.duracao}`);
  if (data.tipoConsulta !== undefined) sets.push(sql`tipo_consulta = ${data.tipoConsulta}`);
  if (data.procedimento !== undefined) sets.push(sql`procedimento = ${data.procedimento}`);
  if (data.status) sets.push(sql`status = ${data.status}`);
  if (data.observacoes !== undefined) sets.push(sql`observacoes = ${data.observacoes}`);
  if (data.valorEstimado !== undefined) sets.push(sql`valor_estimado = ${data.valorEstimado}`);
  if (data.classificacaoRisco !== undefined) sets.push(sql`classificacao_risco = ${data.classificacaoRisco}`);
  
  if (sets.length === 0) return await obterConsulta(id);
  
  const query = sql`UPDATE consultas SET ${sql.join(sets, sql`, `)}, atualizado_em = NOW() WHERE id = ${id}`;
  await db.execute(query);
  
  return await obterConsulta(id);
}

/**
 * Remover consulta
 */
export async function removerConsulta(id: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.execute(sql`DELETE FROM consultas WHERE id = ${id}`);
}

/**
 * Listar consultas por período
 */
export async function listarConsultasPorPeriodo(dataInicio: string, dataFim: string): Promise<Consulta[]> {
  const db = await getDb();
  
  if (!db) {
    const { serverMockConsultasAPI } = await import('./mockData');
    return await serverMockConsultasAPI.listarPorPeriodo(dataInicio, dataFim) as unknown as Consulta[];
  }
  
  const result = await db.execute(sql`
    SELECT 
      id,
      utente_id as utenteId,
      medico_id as medicoId,
      DATE_FORMAT(data_hora, '%Y-%m-%dT%H:%i:%s') as dataHora,
      duracao,
      tipo_consulta as tipoConsulta,
      procedimento,
      status,
      observacoes,
      valor_estimado as valorEstimado,
      classificacao_risco as classificacaoRisco,
      DATE_FORMAT(criado_em, '%Y-%m-%dT%H:%i:%s') as criadoEm,
      DATE_FORMAT(atualizado_em, '%Y-%m-%dT%H:%i:%s') as atualizadoEm
    FROM consultas
    WHERE DATE(data_hora) BETWEEN ${dataInicio} AND ${dataFim}
    ORDER BY data_hora ASC
  `);
  
  return result[0] as unknown as Consulta[];
}

/**
 * Listar consultas por médico
 */
export async function listarConsultasPorMedico(medicoId: string): Promise<Consulta[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.execute(sql`
    SELECT 
      id,
      utente_id as utenteId,
      medico_id as medicoId,
      DATE_FORMAT(data_hora, '%Y-%m-%dT%H:%i:%s') as dataHora,
      duracao,
      tipo_consulta as tipoConsulta,
      procedimento,
      status,
      observacoes,
      valor_estimado as valorEstimado,
      classificacao_risco as classificacaoRisco,
      DATE_FORMAT(criado_em, '%Y-%m-%dT%H:%i:%s') as criadoEm,
      DATE_FORMAT(atualizado_em, '%Y-%m-%dT%H:%i:%s') as atualizadoEm
    FROM consultas
    WHERE medico_id = ${medicoId}
    ORDER BY data_hora ASC
  `);
  
  return result[0] as unknown as Consulta[];
}

/**
 * Verificar conflito de horário
 */
export async function verificarConflito(
  medicoId: string, 
  dataHora: string, 
  duracao: number,
  consultaIdExcluir?: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Calcular hora de fim da nova consulta
  const dataInicio = new Date(dataHora);
  const dataFim = new Date(dataInicio.getTime() + duracao * 60000);
  
  const query = consultaIdExcluir
    ? sql`
        SELECT COUNT(*) as count
        FROM consultas
        WHERE medico_id = ${medicoId}
          AND id != ${consultaIdExcluir}
          AND status NOT IN ('cancelada', 'faltou')
          AND (
            (data_hora <= ${dataHora} AND DATE_ADD(data_hora, INTERVAL duracao MINUTE) > ${dataHora})
            OR
            (data_hora < ${dataFim.toISOString()} AND DATE_ADD(data_hora, INTERVAL duracao MINUTE) >= ${dataFim.toISOString()})
            OR
            (data_hora >= ${dataHora} AND data_hora < ${dataFim.toISOString()})
          )
      `
    : sql`
        SELECT COUNT(*) as count
        FROM consultas
        WHERE medico_id = ${medicoId}
          AND status NOT IN ('cancelada', 'faltou')
          AND (
            (data_hora <= ${dataHora} AND DATE_ADD(data_hora, INTERVAL duracao MINUTE) > ${dataHora})
            OR
            (data_hora < ${dataFim.toISOString()} AND DATE_ADD(data_hora, INTERVAL duracao MINUTE) >= ${dataFim.toISOString()})
            OR
            (data_hora >= ${dataHora} AND data_hora < ${dataFim.toISOString()})
          )
      `;
  
  const result = await db.execute(query);
  const rows = result[0] as any[];
  
  return rows[0].count > 0;
}

/**
 * Obter estatísticas de consultas
 */
export async function obterEstatisticasConsultas(): Promise<{
  total: number;
  agendadas: number;
  confirmadas: number;
  realizadas: number;
  canceladas: number;
  faltou: number;
  emAtendimento: number;
  hoje: number;
  estaSemana: number;
  esteMes: number;
}> {
  const db = await getDb();
  if (!db) {
    // Fallback para dados mock
    const { serverMockConsultasAPI } = await import('./mockData');
    return await serverMockConsultasAPI.estatisticas() as any;
  }
  
  const result = await db.execute(sql`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'agendada' THEN 1 ELSE 0 END) as agendadas,
      SUM(CASE WHEN status = 'confirmada' THEN 1 ELSE 0 END) as confirmadas,
      SUM(CASE WHEN status = 'realizada' THEN 1 ELSE 0 END) as realizadas,
      SUM(CASE WHEN status = 'cancelada' THEN 1 ELSE 0 END) as canceladas,
      SUM(CASE WHEN status = 'faltou' THEN 1 ELSE 0 END) as faltou,
      SUM(CASE WHEN status = 'em_atendimento' THEN 1 ELSE 0 END) as emAtendimento,
      SUM(CASE WHEN DATE(data_hora) = CURDATE() THEN 1 ELSE 0 END) as hoje,
      SUM(CASE WHEN YEARWEEK(data_hora, 1) = YEARWEEK(CURDATE(), 1) THEN 1 ELSE 0 END) as estaSemana,
      SUM(CASE WHEN YEAR(data_hora) = YEAR(CURDATE()) AND MONTH(data_hora) = MONTH(CURDATE()) THEN 1 ELSE 0 END) as esteMes
    FROM consultas
  `);
  
  const stats = (result[0] as any[])[0];
  
  return {
    total: Number(stats.total) || 0,
    agendadas: Number(stats.agendadas) || 0,
    confirmadas: Number(stats.confirmadas) || 0,
    realizadas: Number(stats.realizadas) || 0,
    canceladas: Number(stats.canceladas) || 0,
    faltou: Number(stats.faltou) || 0,
    emAtendimento: Number(stats.emAtendimento) || 0,
    hoje: Number(stats.hoje) || 0,
    estaSemana: Number(stats.estaSemana) || 0,
    esteMes: Number(stats.esteMes) || 0,
  };
}
