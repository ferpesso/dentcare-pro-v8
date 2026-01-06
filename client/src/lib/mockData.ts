// Mock data para desenvolvimento sem backend
// Simula dados de utentes e consultas

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
  criadoEm: string;
  atualizadoEm: string;
}

// Utentes mock
const UTENTES_MOCK: Utente[] = [
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
    infoMedica: {
      alergias: [],
      medicamentos: [],
      condicoesMedicas: [],
      classificacaoAsa: "I",
    },
    status: "ativo",
    criadoEm: "2024-02-10T14:30:00Z",
    atualizadoEm: "2024-02-10T14:30:00Z",
  },
  {
    id: "utente-003",
    numeroUtente: "U003",
    nomeCompleto: "Ana Rita Ferreira",
    dataNascimento: "1978-11-30",
    genero: "F",
    nif: "345678901",
    contacto: {
      telefone: "934567890",
      email: "ana.ferreira@email.pt",
    },
    infoMedica: {
      alergias: ["Látex"],
      medicamentos: ["Ibuprofeno"],
      condicoesMedicas: ["Diabetes Tipo 2"],
      classificacaoAsa: "II",
      grupoSanguineo: "O+",
    },
    status: "ativo",
    tags: ["Implantes"],
    criadoEm: "2024-03-05T09:15:00Z",
    atualizadoEm: "2024-03-05T09:15:00Z",
  },
  {
    id: "utente-004",
    numeroUtente: "U004",
    nomeCompleto: "Carlos Manuel Oliveira",
    dataNascimento: "1965-05-18",
    genero: "M",
    contacto: {
      telefone: "945678901",
      email: "carlos.oliveira@email.pt",
    },
    infoMedica: {
      alergias: [],
      medicamentos: ["Aspirina"],
      condicoesMedicas: ["Cardiopatia"],
      classificacaoAsa: "III",
      grupoSanguineo: "B+",
    },
    status: "ativo",
    criadoEm: "2024-01-20T11:00:00Z",
    atualizadoEm: "2024-01-20T11:00:00Z",
  },
  {
    id: "utente-005",
    numeroUtente: "U005",
    nomeCompleto: "Sofia Marques Rodrigues",
    dataNascimento: "2000-09-12",
    genero: "F",
    contacto: {
      telefone: "956789012",
      email: "sofia.rodrigues@email.pt",
    },
    infoMedica: {
      alergias: [],
      medicamentos: [],
      condicoesMedicas: [],
      classificacaoAsa: "I",
    },
    status: "ativo",
    tags: ["Ortodontia"],
    criadoEm: "2024-04-01T16:45:00Z",
    atualizadoEm: "2024-04-01T16:45:00Z",
  },
];

// Consultas mock
const CONSULTAS_MOCK: Consulta[] = [
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
  },
  {
    id: "consulta-002",
    utenteId: "utente-002",
    medicoId: null,
    dataHora: new Date(new Date().setHours(10, 30, 0, 0)).toISOString(),
    duracao: 60,
    tipoConsulta: "Restauração",
    procedimento: "Restauração dente 16",
    status: "agendada",
    observacoes: null,
    valorEstimado: 120,
    classificacaoRisco: "ASA I",
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: "consulta-003",
    utenteId: "utente-003",
    medicoId: null,
    dataHora: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    duracao: 45,
    tipoConsulta: "Implante",
    procedimento: "Avaliação para implante",
    status: "confirmada",
    observacoes: "Trazer exames radiológicos",
    valorEstimado: 80,
    classificacaoRisco: "ASA II",
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  {
    id: "consulta-004",
    utenteId: "utente-004",
    medicoId: null,
    dataHora: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    duracao: 30,
    tipoConsulta: "Consulta de Rotina",
    procedimento: "Controlo pós-operatório",
    status: "realizada",
    observacoes: "Recuperação dentro do esperado",
    valorEstimado: 40,
    classificacaoRisco: "ASA III",
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
  // Consulta para amanhã
  {
    id: "consulta-005",
    utenteId: "utente-005",
    medicoId: null,
    dataHora: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] + 'T10:00:00.000Z',
    duracao: 30,
    tipoConsulta: "Ortodontia",
    procedimento: "Ajuste de aparelho",
    status: "agendada",
    observacoes: null,
    valorEstimado: 60,
    classificacaoRisco: "ASA I",
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  },
];

// Storage keys
const STORAGE_KEYS = {
  UTENTES: 'dentcare-utentes-v2',  // v2 para forçar reload
  CONSULTAS: 'dentcare-consultas-v2',  // v2 para forçar reload
  VERSION: 'dentcare-version',
};

const CURRENT_VERSION = '2.0';

// Inicializar dados no localStorage se não existirem
function initMockData() {
  if (!localStorage.getItem(STORAGE_KEYS.UTENTES)) {
    localStorage.setItem(STORAGE_KEYS.UTENTES, JSON.stringify(UTENTES_MOCK));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONSULTAS)) {
    localStorage.setItem(STORAGE_KEYS.CONSULTAS, JSON.stringify(CONSULTAS_MOCK));
  }
}

// Funções de CRUD para Utentes
export const mockUtentesAPI = {
  listar: async (): Promise<Utente[]> => {
    initMockData();
    const data = localStorage.getItem(STORAGE_KEYS.UTENTES);
    return data ? JSON.parse(data) : [];
  },

  obter: async (id: string): Promise<Utente | null> => {
    const utentes = await mockUtentesAPI.listar();
    return utentes.find(u => u.id === id) || null;
  },

  criar: async (dados: Partial<Utente>): Promise<Utente> => {
    const utentes = await mockUtentesAPI.listar();
    const novoUtente: Utente = {
      id: `utente-${Date.now()}`,
      numeroUtente: `U${String(utentes.length + 1).padStart(3, '0')}`,
      nomeCompleto: dados.nomeCompleto || '',
      dataNascimento: dados.dataNascimento || '',
      genero: dados.genero || 'Outro',
      nif: dados.nif,
      numUtenteSns: dados.numUtenteSns,
      fotoPerfil: dados.fotoPerfil,
      contacto: dados.contacto || { telefone: '' },
      morada: dados.morada,
      infoMedica: dados.infoMedica || {
        alergias: [],
        medicamentos: [],
        condicoesMedicas: [],
        classificacaoAsa: 'I',
      },
      status: 'ativo',
      tags: dados.tags || [],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    utentes.push(novoUtente);
    localStorage.setItem(STORAGE_KEYS.UTENTES, JSON.stringify(utentes));
    return novoUtente;
  },

  atualizar: async (id: string, dados: Partial<Utente>): Promise<Utente> => {
    const utentes = await mockUtentesAPI.listar();
    const index = utentes.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Utente não encontrado');
    
    utentes[index] = {
      ...utentes[index],
      ...dados,
      atualizadoEm: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.UTENTES, JSON.stringify(utentes));
    return utentes[index];
  },

  remover: async (id: string): Promise<void> => {
    const utentes = await mockUtentesAPI.listar();
    const index = utentes.findIndex(u => u.id === id);
    if (index !== -1) {
      utentes[index].status = 'arquivado';
      localStorage.setItem(STORAGE_KEYS.UTENTES, JSON.stringify(utentes));
    }
  },

  estatisticas: async () => {
    const utentes = await mockUtentesAPI.listar();
    return {
      total: utentes.length,
      ativos: utentes.filter(u => u.status === 'ativo').length,
      inativos: utentes.filter(u => u.status === 'inativo').length,
      arquivados: utentes.filter(u => u.status === 'arquivado').length,
    };
  },
};

// Funções de CRUD para Consultas
export const mockConsultasAPI = {
  listar: async (): Promise<Consulta[]> => {
    initMockData();
    const data = localStorage.getItem(STORAGE_KEYS.CONSULTAS);
    return data ? JSON.parse(data) : [];
  },

  listarPorPeriodo: async (dataInicio: string, dataFim: string): Promise<Consulta[]> => {
    const consultas = await mockConsultasAPI.listar();
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    return consultas.filter(c => {
      const dataConsulta = new Date(c.dataHora);
      return dataConsulta >= inicio && dataConsulta <= fim;
    });
  },

  obter: async (id: string): Promise<Consulta | null> => {
    const consultas = await mockConsultasAPI.listar();
    return consultas.find(c => c.id === id) || null;
  },

  criar: async (dados: Partial<Consulta>): Promise<Consulta> => {
    const consultas = await mockConsultasAPI.listar();
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
    consultas.push(novaConsulta);
    localStorage.setItem(STORAGE_KEYS.CONSULTAS, JSON.stringify(consultas));
    return novaConsulta;
  },

  atualizar: async (id: string, dados: Partial<Consulta>): Promise<Consulta> => {
    const consultas = await mockConsultasAPI.listar();
    const index = consultas.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Consulta não encontrada');
    
    const consultaAntes = { ...consultas[index] };
    
    consultas[index] = {
      ...consultas[index],
      ...dados,
      atualizadoEm: new Date().toISOString(),
    };
    
    console.log('[MOCK] Atualizando consulta:', {
      id,
      antes: consultaAntes,
      dados,
      depois: consultas[index]
    });
    
    localStorage.setItem(STORAGE_KEYS.CONSULTAS, JSON.stringify(consultas));
    return consultas[index];
  },

  remover: async (id: string): Promise<void> => {
    const consultas = await mockConsultasAPI.listar();
    const filtered = consultas.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONSULTAS, JSON.stringify(filtered));
  },

  estatisticas: async () => {
    const consultas = await mockConsultasAPI.listar();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 7);

    return {
      hoje: consultas.filter(c => {
        const data = new Date(c.dataHora);
        return data >= hoje && data < amanha;
      }).length,
      estaSemana: consultas.filter(c => {
        const data = new Date(c.dataHora);
        return data >= inicioSemana && data < fimSemana;
      }).length,
      agendadas: consultas.filter(c => c.status === 'agendada').length,
      confirmadas: consultas.filter(c => c.status === 'confirmada').length,
      realizadas: consultas.filter(c => c.status === 'realizada').length,
      faltou: consultas.filter(c => c.status === 'faltou').length,
    };
  },
};

// Exportar tudo
export { UTENTES_MOCK, CONSULTAS_MOCK };

