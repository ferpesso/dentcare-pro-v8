// Mock data para o servidor (sem localStorage)
// Dados de utentes mock

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

// Utentes mock (dados em memória para o servidor)
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
  },
  {
    id: "utente-003",
    numeroUtente: "U003",
    nomeCompleto: "Ana Rita Ferreira",
    dataNascimento: "1978-11-05",
    genero: "F",
    nif: "345678901",
    numUtenteSns: "876543210",
    contacto: {
      telefone: "934567890",
      email: "ana.ferreira@email.pt",
    },
    infoMedica: {
      alergias: ["Látex"],
      medicamentos: ["Ibuprofeno"],
      condicoesMedicas: ["Diabetes tipo 2"],
      classificacaoAsa: "II",
      grupoSanguineo: "B+",
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
    dataNascimento: "1965-04-18",
    genero: "M",
    nif: "456789012",
    contacto: {
      telefone: "945678901",
    },
    morada: {
      rua: "Rua do Comércio",
      numero: "789",
      codigoPostal: "1300-300",
      localidade: "Lisboa",
    },
    infoMedica: {
      alergias: [],
      medicamentos: ["Aspirina", "Atorvastatina"],
      condicoesMedicas: ["Hipertensão", "Colesterol alto"],
      classificacaoAsa: "III",
      grupoSanguineo: "O+",
    },
    status: "ativo",
    criadoEm: "2024-04-12T11:45:00Z",
    atualizadoEm: "2024-04-12T11:45:00Z",
  },
  {
    id: "utente-005",
    numeroUtente: "U005",
    nomeCompleto: "Sofia Marques Rodrigues",
    dataNascimento: "2000-09-30",
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
    tags: ["Ortodontia", "Jovem"],
    criadoEm: "2024-05-20T16:20:00Z",
    atualizadoEm: "2024-05-20T16:20:00Z",
  },
];

// API mock para o servidor
export const serverMockUtentesAPI = {
  listar: async (): Promise<Utente[]> => {
    return [...UTENTES_MOCK]; // Retorna cópia para evitar mutação
  },

  obter: async (id: string): Promise<Utente | null> => {
    const utente = UTENTES_MOCK.find(u => u.id === id);
    return utente ? { ...utente } : null; // Retorna cópia
  },

  pesquisar: async (termo: string): Promise<Utente[]> => {
    const termoLower = termo.toLowerCase();
    return UTENTES_MOCK.filter(u =>
      u.nomeCompleto.toLowerCase().includes(termoLower) ||
      u.numeroUtente.toLowerCase().includes(termoLower) ||
      (u.nif && u.nif.includes(termo)) ||
      (u.numUtenteSns && u.numUtenteSns.includes(termo))
    );
  },
};



// ============================================
// CONSULTAS MOCK
// ============================================

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

// Consultas mock (dados em memória para o servidor)
let CONSULTAS_MOCK: Consulta[] = [
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
];

// API mock para consultas no servidor
export const serverMockConsultasAPI = {
  listar: async (): Promise<Consulta[]> => {
    return [...CONSULTAS_MOCK]; // Retorna cópia
  },

  listarPorPeriodo: async (dataInicio: string, dataFim: string): Promise<Consulta[]> => {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    
    return CONSULTAS_MOCK.filter(c => {
      const dataConsulta = new Date(c.dataHora);
      return dataConsulta >= inicio && dataConsulta <= fim;
    });
  },

  obter: async (id: string): Promise<Consulta | null> => {
    return CONSULTAS_MOCK.find(c => c.id === id) || null;
  },

  criar: async (dados: Partial<Consulta>): Promise<Consulta> => {
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
    CONSULTAS_MOCK.push(novaConsulta);
    return novaConsulta;
  },

  atualizar: async (id: string, dados: Partial<Consulta>): Promise<Consulta> => {
    const index = CONSULTAS_MOCK.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Consulta não encontrada');
    
    CONSULTAS_MOCK[index] = {
      ...CONSULTAS_MOCK[index],
      ...dados,
      atualizadoEm: new Date().toISOString(),
    };
    
    return CONSULTAS_MOCK[index];
  },

  remover: async (id: string): Promise<void> => {
    CONSULTAS_MOCK = CONSULTAS_MOCK.filter(c => c.id !== id);
  },

  estatisticas: async () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);
    
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay());
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 7);
    
    return {
      hoje: CONSULTAS_MOCK.filter(c => {
        const d = new Date(c.dataHora);
        return d >= hoje && d < amanha;
      }).length,
      estaSemana: CONSULTAS_MOCK.filter(c => {
        const d = new Date(c.dataHora);
        return d >= inicioSemana && d < fimSemana;
      }).length,
      agendadas: CONSULTAS_MOCK.filter(c => c.status === 'agendada').length,
      confirmadas: CONSULTAS_MOCK.filter(c => c.status === 'confirmada').length,
      realizadas: CONSULTAS_MOCK.filter(c => c.status === 'realizada').length,
      faltou: CONSULTAS_MOCK.filter(c => c.status === 'faltou').length,
    };
  },
};

