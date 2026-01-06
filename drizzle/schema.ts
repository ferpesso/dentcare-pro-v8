import { mysqlTable, varchar, text, timestamp, mysqlEnum, int, decimal, datetime } from "drizzle-orm/mysql-core";

// ========================================
// USERS (Sistema de autenticação)
// ========================================

export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).notNull().default("user"),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ========================================
// UTENTES (Pacientes)
// ========================================

export const utentes = mysqlTable("utentes", {
  id: varchar("id", { length: 36 }).primaryKey(),
  numeroUtente: varchar("numeroUtente", { length: 20 }).notNull().unique(),
  nomeCompleto: varchar("nomeCompleto", { length: 200 }).notNull(),
  dataNascimento: varchar("dataNascimento", { length: 10 }).notNull(),
  genero: mysqlEnum("genero", ["M", "F", "Outro"]).notNull(),
  nif: varchar("nif", { length: 9 }),
  numUtenteSns: varchar("numUtenteSns", { length: 9 }),
  fotoPerfil: text("fotoPerfil"),
  contacto: text("contacto"),
  morada: text("morada"),
  infoMedica: text("infoMedica").notNull(),
  status: mysqlEnum("status", ["ativo", "inativo", "arquivado"]).notNull().default("ativo"),
  tags: text("tags"),
  criadoPor: varchar("criadoPor", { length: 64 }).notNull(),
  criadoEm: timestamp("criadoEm").defaultNow(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow(),
});

export type Utente = typeof utentes.$inferSelect;
export type InsertUtente = typeof utentes.$inferInsert;

// ========================================
// CONSULTAS
// ========================================

export const consultas = mysqlTable("consultas", {
  id: varchar("id", { length: 255 }).primaryKey(),
  utenteId: varchar("utente_id", { length: 255 }).notNull(),
  medicoId: varchar("medico_id", { length: 255 }),
  dataHora: datetime("data_hora").notNull(),
  duracao: int("duracao").default(30),
  tipoConsulta: varchar("tipo_consulta", { length: 100 }),
  procedimento: text("procedimento"),
  status: mysqlEnum("status", ["agendada", "confirmada", "realizada", "cancelada", "faltou", "em_atendimento"]).default("agendada"),
  observacoes: text("observacoes"),
  valorEstimado: decimal("valor_estimado", { precision: 10, scale: 2 }),
  classificacaoRisco: varchar("classificacao_risco", { length: 10 }),
  criadoEm: timestamp("criado_em").defaultNow(),
  atualizadoEm: timestamp("atualizado_em").defaultNow().onUpdateNow(),
});

export type Consulta = typeof consultas.$inferSelect;
export type InsertConsulta = typeof consultas.$inferInsert;

// ========================================
// IMAGENS
// ========================================

export const imagens = mysqlTable("imagens", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  tipo: mysqlEnum("tipo", ["raio_x", "fotografia", "tomografia", "scanner_3d", "outro"]).notNull(),
  categoria: varchar("categoria", { length: 100 }),
  url: text("url").notNull(),
  nomeArquivo: varchar("nomeArquivo", { length: 255 }).notNull(),
  tamanho: varchar("tamanho", { length: 50 }),
  dataImagem: varchar("dataImagem", { length: 10 }),
  descricao: text("descricao"),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type Imagem = typeof imagens.$inferSelect;
export type InsertImagem = typeof imagens.$inferInsert;

// ========================================
// ODONTOGRAMA
// ========================================

export const odontograma = mysqlTable("odontograma", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  numeroDente: varchar("numeroDente", { length: 10 }).notNull(),
  faces: text("faces"),
  condicao: varchar("condicao", { length: 100 }),
  tratamento: varchar("tratamento", { length: 100 }),
  observacoes: text("observacoes"),
  dataRegistro: varchar("dataRegistro", { length: 10 }),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type Odontograma = typeof odontograma.$inferSelect;
export type InsertOdontograma = typeof odontograma.$inferInsert;

// ========================================
// ENDODONTIA
// ========================================

export const endodontia = mysqlTable("endodontia", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  numeroDente: varchar("numeroDente", { length: 10 }).notNull(),
  numeroCanais: varchar("numeroCanais", { length: 10 }).notNull(),
  comprimentoTrabalho: text("comprimentoTrabalho"),
  tecnicaInstrumentacao: varchar("tecnicaInstrumentacao", { length: 100 }),
  materialObturacao: varchar("materialObturacao", { length: 100 }),
  dataInicio: varchar("dataInicio", { length: 10 }),
  dataFinalizacao: varchar("dataFinalizacao", { length: 10 }),
  status: mysqlEnum("status", ["em_andamento", "concluido", "retratamento"]).default("em_andamento"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type Endodontia = typeof endodontia.$inferSelect;
export type InsertEndodontia = typeof endodontia.$inferInsert;

// ========================================
// IMPLANTES
// ========================================

export const implantes = mysqlTable("implantes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  posicao: varchar("posicao", { length: 10 }).notNull(),
  marca: varchar("marca", { length: 100 }),
  modelo: varchar("modelo", { length: 100 }),
  diametro: varchar("diametro", { length: 20 }),
  comprimento: varchar("comprimento", { length: 20 }),
  lote: varchar("lote", { length: 50 }),
  dataColocacao: varchar("dataColocacao", { length: 10 }),
  dataCarga: varchar("dataCarga", { length: 10 }),
  tipoProtese: varchar("tipoProtese", { length: 100 }),
  status: mysqlEnum("status", ["planejado", "colocado", "osseointegrado", "protese_instalada", "falha"]).default("planejado"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type Implante = typeof implantes.$inferSelect;
export type InsertImplante = typeof implantes.$inferInsert;

// ========================================
// LABORATÓRIO
// ========================================

export const laboratorio = mysqlTable("laboratorio", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  tipoTrabalho: varchar("tipoTrabalho", { length: 100 }).notNull(),
  dentes: varchar("dentes", { length: 255 }),
  laboratorioNome: varchar("laboratorioNome", { length: 200 }),
  cor: varchar("cor", { length: 50 }),
  material: varchar("material", { length: 100 }),
  dataEnvio: varchar("dataEnvio", { length: 10 }),
  dataPrevisao: varchar("dataPrevisao", { length: 10 }),
  dataRecepcao: varchar("dataRecepcao", { length: 10 }),
  dataInstalacao: varchar("dataInstalacao", { length: 10 }),
  custo: varchar("custo", { length: 20 }),
  status: mysqlEnum("status", ["pendente", "enviado", "em_producao", "recebido", "instalado", "ajuste_necessario"]).default("pendente"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type Laboratorio = typeof laboratorio.$inferSelect;
export type InsertLaboratorio = typeof laboratorio.$inferInsert;

// ========================================
// ORTODONTIA
// ========================================

export const ortodontia = mysqlTable("ortodontia", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  tipoAparelho: varchar("tipoAparelho", { length: 100 }),
  dataInicio: varchar("dataInicio", { length: 10 }),
  dataPrevisaoTermino: varchar("dataPrevisaoTermino", { length: 10 }),
  status: mysqlEnum("status", ["ativo", "concluido", "pausado"]).default("ativo"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type Ortodontia = typeof ortodontia.$inferSelect;
export type InsertOrtodontia = typeof ortodontia.$inferInsert;

// ========================================
// ORTODONTIA CONSULTAS
// ========================================

export const ortodontiaConsultas = mysqlTable("ortodontia_consultas", {
  id: varchar("id", { length: 64 }).primaryKey(),
  ortodontiaId: varchar("ortodontiaId", { length: 64 }).notNull(),
  dataConsulta: varchar("dataConsulta", { length: 10 }).notNull(),
  procedimentos: text("procedimentos"),
  observacoes: text("observacoes"),
  proximaConsulta: varchar("proximaConsulta", { length: 10 }),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type OrtodontiaConsulta = typeof ortodontiaConsultas.$inferSelect;
export type InsertOrtodontiaConsulta = typeof ortodontiaConsultas.$inferInsert;

// ========================================
// PERIODONTOGRAMA
// ========================================

export const periodontograma = mysqlTable("periodontograma", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  numeroDente: varchar("numeroDente", { length: 10 }).notNull(),
  medicoes: text("medicoes").notNull(),
  dataAvaliacao: varchar("dataAvaliacao", { length: 10 }).notNull(),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type Periodontograma = typeof periodontograma.$inferSelect;
export type InsertPeriodontograma = typeof periodontograma.$inferInsert;

// ========================================
// PRESCRIÇÕES
// ========================================

export const prescricoes = mysqlTable("prescricoes", {
  id: varchar("id", { length: 64 }).primaryKey(),
  utenteId: varchar("utenteId", { length: 64 }).notNull(),
  dataPrescricao: varchar("dataPrescricao", { length: 10 }).notNull(),
  medicamentos: text("medicamentos").notNull(),
  diagnostico: text("diagnostico"),
  observacoes: text("observacoes"),
  criadoEm: timestamp("criadoEm").defaultNow(),
});

export type Prescricao = typeof prescricoes.$inferSelect;
export type InsertPrescricao = typeof prescricoes.$inferInsert;

