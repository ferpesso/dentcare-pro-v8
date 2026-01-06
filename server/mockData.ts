import fs from "fs";
import path from "path";

// Caminho para o ficheiro de persistência
const DATA_FILE = path.join(process.cwd(), "data", "mock-db.json");

// Garantir que a pasta data existe
if (!fs.existsSync(path.join(process.cwd(), "data"))) {
  fs.mkdirSync(path.join(process.cwd(), "data"), { recursive: true });
}

export interface Utente {
  id: string;
  numeroUtente: string;
  nomeCompleto: string;
  dataNascimento: string;
  genero: "M" | "F" | "Outro";
  nif?: string;
  numUtenteSns?: string;
  fotoPerfil?: string;
  contacto: {
    telefone: string;
    email?: string;
    telemovel?: string;
    telefoneEmergencia?: string;
  };
  morada?: {
    rua?: string;
    numero?: string;
    codigoPostal?: string;
    localidade?: string;
    distrito?: string;
  };
  infoMedica: {
    alergias: string[];
    medicamentos: string[];
    condicoesMedicas: string[];
    classificacaoAsa: "I" | "II" | "III" | "IV" | "V" | "VI";
    grupoSanguineo?: string;
    notasImportantes?: string;
  };
  status: "ativo" | "inativo" | "arquivado";
  tags?: string[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface Consulta {
  id: string;
  utenteId: string;
  medicoId: string | null;
  dataHora: string;
  duracao: number;
  tipoConsulta: string | null;
  procedimento: string | null;
  status: "agendada" | "confirmada" | "realizada" | "cancelada" | "faltou" | "em_atendimento";
  observacoes: string | null;
  valorEstimado: number | null;
  classificacaoRisco: string | null;
  criadoEm?: string;
  atualizadoEm?: string;
}

// Estrutura do ficheiro JSON
interface MockDB {
  utentes: Utente[];
  consultas: Consulta[];
}

// Dados iniciais se o ficheiro não existir
const INITIAL_DATA: MockDB = {
  utentes: [
    {
      id: "utente-001",
      numeroUtente: "U001",
      nomeCompleto: "Maria Silva Santos",
      dataNascimento: "1985-03-15",
      genero: "F",
      nif: "123456789",
      numUtenteSns: "987654321",
      contacto: {
        telefone: "912345678",
        email: "maria.silva@email.pt",
        telemovel: "912345678",
      },
      morada: {
        rua: "Rua das Flores",
        numero: "123",
        codigoPostal: "1000-100",
        localidade: "Lisboa",
        distrito: "Lisboa",
      },
      infoMedica: {
        alergias: ["Penicilina"],
        medicamentos: ["Paracetamol"],
        condicoesMedicas: ["Hipertensão"],
        classificacaoAsa: "II",
        grupoSanguineo: "A+",
      },
      status: "ativo",
      tags: ["VIP", "Ortodontia"],
      criadoEm: "2024-01-15T10:00:00Z",
      atualizadoEm: "2024-01-15T10:00:00Z",
    },
    {
      id: "utente-002",
      numeroUtente: "U002",
      nomeCompleto: "João Pedro Costa",
      dataNascimento: "1990-07-22",
      genero: "M",
      nif: "234567890",
      contacto: {
        telefone: "923456789",
        email: "joao.costa@email.pt",
      },
      morada: {
        rua: "Avenida da Liberdade",
        numero: "456",
        codigoPostal: "1200-200",
        localidade: "Lisboa",
      },
      infoMedica: {
        alergias: [],
        medicamentos: [],
        condicoesMedicas: [],
        classificacaoAsa: "I",
      },
      status: "ativo",
      criadoEm: "2024-02-10T14:30:00Z",
      atualizadoEm: "2024-02-10T14:30:00Z",
    }
  ],
  consultas: [
    {
      id: "consulta-001",
      utenteId: "utente-001",
      medicoId: null,
      dataHora: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
      duracao: 30,
      tipoConsulta: "Consulta de Rotina",
      procedimento: "Limpeza",
      status: "confirmada",
      observacoes: "Paciente com sensibilidade dentária",
      valorEstimado: 50,
      classificacaoRisco: "ASA II",
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    }
  ]
};

// Funções de leitura e escrita
function readDB(): MockDB {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Erro ao ler base de dados mock:", error);
  }
  return INITIAL_DATA;
}

function writeDB(data: MockDB) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Erro ao escrever na base de dados mock:", error);
  }
}

// API mock para o servidor
export const serverMockUtentesAPI = {
  listar: async (): Promise<Utente[]> => {
    const db = readDB();
    return db.utentes;
  },

  obter: async (id: string): Promise<Utente | null> => {
    const db = readDB();
    const utente = db.utentes.find(u => u.id === id);
    return utente ? { ...utente } : null;
  },

  pesquisar: async (termo: string): Promise<Utente[]> => {
    const db = readDB();
    const termoLower = termo.toLowerCase();
    return db.utentes.filter(u =>
      u.nomeCompleto.toLowerCase().includes(termoLower) ||
      u.numeroUtente.toLowerCase().includes(termoLower) ||
      (u.nif && u.nif.includes(termo)) ||
      (u.numUtenteSns && u.numUtenteSns.includes(termo))
    );
  },
  
  criar: async (dados: Utente): Promise<Utente> => {
    const db = readDB();
    db.utentes.push(dados);
    writeDB(db);
    return dados;
  },
  
  atualizar: async (id: string, dados: Partial<Utente>): Promise<Utente> => {
    const db = readDB();
    const index = db.utentes.findIndex(u => u.id === id);
    if (index === -1) throw new Error("Utente não encontrado");
    db.utentes[index] = { ...db.utentes[index], ...dados, atualizadoEm: new Date().toISOString() };
    writeDB(db);
    return db.utentes[index];
  }
};

export const serverMockConsultasAPI = {
  listar: async (): Promise<Consulta[]> => {
    const db = readDB();
    return db.consultas;
  },

  listarPorPeriodo: async (dataInicio: string, dataFim: string): Promise<Consulta[]> => {
    const db = readDB();
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    return db.consultas.filter(c => {
      const dataConsulta = new Date(c.dataHora);
      return dataConsulta >= inicio && dataConsulta <= fim;
    });
  },

  obter: async (id: string): Promise<Consulta | null> => {
    const db = readDB();
    return db.consultas.find(c => c.id === id) || null;
  },

  criar: async (dados: Partial<Consulta>): Promise<Consulta> => {
    const db = readDB();
    const novaConsulta: Consulta = {
      id: `consulta-${Date.now()}`,
      utenteId: dados.utenteId || '',
      medicoId: dados.medicoId || null,
      dataHora: dados.dataHora || new Date().toISOString(),
      duracao: dados.duracao || 30,
      tipoConsulta: dados.tipoConsulta || null,
      procedimento: dados.procedimento || null,
      status: dados.status || 'agendada',
      observacoes: dados.observacoes || null,
      valorEstimado: dados.valorEstimado || null,
      classificacaoRisco: dados.classificacaoRisco || null,
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    db.consultas.push(novaConsulta);
    writeDB(db);
    return novaConsulta;
  },

  atualizar: async (id: string, dados: Partial<Consulta>): Promise<Consulta> => {
    const db = readDB();
    const index = db.consultas.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Consulta não encontrada');
    
    db.consultas[index] = {
      ...db.consultas[index],
      ...dados,
      atualizadoEm: new Date().toISOString(),
    };
    writeDB(db);
    return db.consultas[index];
  },

  remover: async (id: string): Promise<void> => {
    const db = readDB();
    db.consultas = db.consultas.filter(c => c.id !== id);
    writeDB(db);
  },

  estatisticas: async () => {
    const db = readDB();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    return {
      hoje: db.consultas.filter(c => {
        const d = new Date(c.dataHora);
        return d >= hoje && d < amanha;
      }).length,
      agendadas: db.consultas.filter(c => c.status === 'agendada').length,
      confirmadas: db.consultas.filter(c => c.status === 'confirmada').length,
      realizadas: db.consultas.filter(c => c.status === 'realizada').length,
      faltou: db.consultas.filter(c => c.status === 'faltou').length,
    };
  },
};
