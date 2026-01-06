import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../drizzle/schema";
import { eq, desc, or, like } from "drizzle-orm";

const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite, { schema });

// ========================================
// UTENTES (Pacientes)
// ========================================

export async function listarUtentes() {
  try {
    return db.select().from(schema.utentes).orderBy(desc(schema.utentes.criadoEm)).all();
  } catch (error) {
    console.error("Erro ao listar utentes:", error);
    return [];
  }
}

export async function obterUtente(id: string) {
  try {
    return db.select().from(schema.utentes).where(eq(schema.utentes.id, id)).get();
  } catch (error) {
    console.error("Erro ao obter utente:", error);
    return null;
  }
}

export async function pesquisarUtentes(termo: string) {
  try {
    const termoPesquisa = `%${termo}%`;
    return db
      .select()
      .from(schema.utentes)
      .where(
        or(
          like(schema.utentes.nomeCompleto, termoPesquisa),
          like(schema.utentes.nif, termoPesquisa),
          like(schema.utentes.numeroUtente, termoPesquisa)
        )
      )
      .orderBy(desc(schema.utentes.criadoEm))
      .all();
  } catch (error) {
    console.error("Erro ao pesquisar utentes:", error);
    return [];
  }
}

export async function criarUtente(data: any) {
  try {
    const id = Math.random().toString(36).substring(2, 11);
    const ano = new Date().getFullYear();
    const numeroUtente = `U-${ano}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    const novoUtente = {
      ...data,
      id,
      numeroUtente,
      status: data.status || "ativo",
      genero: data.genero || "Outro",
      dataNascimento: data.dataNascimento || new Date().toISOString().split('T')[0],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
      // Garantir que objetos complexos são guardados como string se necessário
      contacto: typeof data.contacto === 'object' ? JSON.stringify(data.contacto) : data.contacto,
      morada: typeof data.morada === 'object' ? JSON.stringify(data.morada) : data.morada,
      infoMedica: typeof data.infoMedica === 'object' ? JSON.stringify(data.infoMedica) : data.infoMedica,
      tags: typeof data.tags === 'object' ? JSON.stringify(data.tags) : data.tags,
    };
    
    db.insert(schema.utentes).values(novoUtente).run();
    return novoUtente;
  } catch (error) {
    console.error("Erro ao criar utente no DB:", error);
    throw error;
  }
}

export async function atualizarUtente(id: string, data: any) {
  try {
    const dadosAtualizados = {
      ...data,
      atualizadoEm: new Date().toISOString(),
      contacto: typeof data.contacto === 'object' ? JSON.stringify(data.contacto) : data.contacto,
      morada: typeof data.morada === 'object' ? JSON.stringify(data.morada) : data.morada,
      infoMedica: typeof data.infoMedica === 'object' ? JSON.stringify(data.infoMedica) : data.infoMedica,
      tags: typeof data.tags === 'object' ? JSON.stringify(data.tags) : data.tags,
    };
    
    db.update(schema.utentes).set(dadosAtualizados).where(eq(schema.utentes.id, id)).run();
    return obterUtente(id);
  } catch (error) {
    console.error("Erro ao atualizar utente:", error);
    throw error;
  }
}

export async function removerUtente(id: string) {
  try {
    db.update(schema.utentes).set({ status: "arquivado" }).where(eq(schema.utentes.id, id)).run();
  } catch (error) {
    console.error("Erro ao remover utente:", error);
    throw error;
  }
}

export async function obterEstatisticasUtentes() {
  try {
    const todos = db.select().from(schema.utentes).all();
    return {
      total: todos.length,
      ativos: todos.filter((u: any) => u.status === "ativo").length,
      inativos: todos.filter((u: any) => u.status === "inativo").length,
      arquivados: todos.filter((u: any) => u.status === "arquivado").length,
    };
  } catch (error) {
    return { total: 0, ativos: 0, inativos: 0, arquivados: 0 };
  }
}

// ========================================
// CONSULTAS
// ========================================

export async function listarConsultas() {
  try {
    return db.select().from(schema.consultas).orderBy(desc(schema.consultas.dataHora)).all();
  } catch (error) {
    return [];
  }
}

export async function criarConsulta(data: any) {
  try {
    const id = data.id || `CST${Date.now()}${Math.random().toString(36).substring(2, 5)}`;
    const novaConsulta = {
      ...data,
      id,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    db.insert(schema.consultas).values(novaConsulta).run();
    return novaConsulta;
  } catch (error) {
    console.error("Erro ao criar consulta:", error);
    throw error;
  }
}

export async function getDb() { return db; }
export async function upsertUser(user: any) { return; }
export async function getUser(id: string) { return null; }
