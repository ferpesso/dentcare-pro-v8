/**
 * Router tRPC para o Módulo Financeiro/Faturação
 * DentCare PRO v8.0
 */

import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import type { 
  Fatura, 
  ItemFatura, 
  Pagamento, 
  EstatisticasFinanceiras,
  EstadoFatura,
  MetodoPagamento 
} from "../../shared/types-financeiro";

// Dados mock para desenvolvimento
let faturasMock: Fatura[] = [
  {
    id: "fat-001",
    numero: "2025/001",
    serie: "FT",
    tipo: "fatura",
    data: "2025-10-15T10:00:00Z",
    dataVencimento: "2025-11-15T10:00:00Z",
    utenteId: "utente-001",
    utenteNome: "Maria Silva Santos",
    utenteNif: "123456789",
    utenteMorada: "Rua das Flores, 123, 1000-100 Lisboa",
    dentista: "Dr. João Costa",
    itens: [
      {
        id: "item-001",
        descricao: "Consulta de Avaliação",
        quantidade: 1,
        precoUnitario: 50,
        desconto: 0,
        iva: 23,
        total: 61.50,
        categoria: "consulta"
      },
      {
        id: "item-002",
        descricao: "Limpeza Dentária (Destartarização)",
        quantidade: 1,
        precoUnitario: 80,
        desconto: 10,
        iva: 23,
        total: 88.56,
        categoria: "tratamento"
      }
    ],
    subtotal: 122,
    descontoTotal: 8,
    ivaTotal: 26.22,
    total: 150.06,
    estado: "paga",
    pagamentos: [
      {
        id: "pag-001",
        faturaId: "fat-001",
        data: "2025-10-15T11:00:00Z",
        valor: 150.06,
        metodo: "multibanco",
        referencia: "MB123456789",
        criadoPor: "Sistema",
        criadoEm: "2025-10-15T11:00:00Z"
      }
    ],
    valorPago: 150.06,
    valorEmDivida: 0,
    criadoPor: "Dr. João Costa",
    criadoEm: "2025-10-15T10:00:00Z",
    atualizadoEm: "2025-10-15T11:00:00Z"
  },
  {
    id: "fat-002",
    numero: "2025/002",
    serie: "FT",
    tipo: "fatura",
    data: "2025-10-16T14:00:00Z",
    dataVencimento: "2025-11-16T14:00:00Z",
    utenteId: "utente-002",
    utenteNome: "João Pedro Oliveira",
    utenteNif: "987654321",
    dentista: "Dra. Ana Martins",
    itens: [
      {
        id: "item-003",
        descricao: "Restauração em Resina Composta",
        quantidade: 2,
        precoUnitario: 120,
        desconto: 0,
        iva: 23,
        total: 295.20,
        categoria: "tratamento"
      }
    ],
    subtotal: 240,
    descontoTotal: 0,
    ivaTotal: 55.20,
    total: 295.20,
    estado: "pendente",
    pagamentos: [],
    valorPago: 0,
    valorEmDivida: 295.20,
    observacoes: "Pagamento previsto para próxima consulta",
    criadoPor: "Dra. Ana Martins",
    criadoEm: "2025-10-16T14:00:00Z",
    atualizadoEm: "2025-10-16T14:00:00Z"
  },
  {
    id: "fat-003",
    numero: "2025/003",
    serie: "FT",
    tipo: "fatura",
    data: "2025-10-17T09:00:00Z",
    dataVencimento: "2025-11-17T09:00:00Z",
    utenteId: "utente-003",
    utenteNome: "Ana Rita Costa",
    dentista: "Dr. João Costa",
    itens: [
      {
        id: "item-004",
        descricao: "Extração Dentária Simples",
        quantidade: 1,
        precoUnitario: 150,
        desconto: 0,
        iva: 23,
        total: 184.50,
        categoria: "tratamento"
      }
    ],
    subtotal: 150,
    descontoTotal: 0,
    ivaTotal: 34.50,
    total: 184.50,
    estado: "parcial",
    pagamentos: [
      {
        id: "pag-002",
        faturaId: "fat-003",
        data: "2025-10-17T09:30:00Z",
        valor: 100,
        metodo: "dinheiro",
        criadoPor: "Receção",
        criadoEm: "2025-10-17T09:30:00Z"
      }
    ],
    valorPago: 100,
    valorEmDivida: 84.50,
    observacoes: "Restante a pagar na próxima consulta",
    criadoPor: "Dr. João Costa",
    criadoEm: "2025-10-17T09:00:00Z",
    atualizadoEm: "2025-10-17T09:30:00Z"
  }
];

let proximoNumeroFatura = 4;

// Função auxiliar para gerar número de fatura
function gerarNumeroFatura(): string {
  const ano = new Date().getFullYear();
  const numero = String(proximoNumeroFatura).padStart(3, '0');
  proximoNumeroFatura++;
  return `${ano}/${numero}`;
}

// Função auxiliar para calcular estado da fatura
function calcularEstadoFatura(fatura: Fatura): EstadoFatura {
  if (fatura.estado === "anulada") return "anulada";
  
  const agora = new Date();
  const vencimento = new Date(fatura.dataVencimento);
  
  if (fatura.valorPago >= fatura.total) {
    return "paga";
  } else if (fatura.valorPago > 0) {
    return "parcial";
  } else if (vencimento < agora) {
    return "vencida";
  } else {
    return "pendente";
  }
}

// Função auxiliar para calcular totais da fatura
function calcularTotaisFatura(itens: ItemFatura[]): {
  subtotal: number;
  descontoTotal: number;
  ivaTotal: number;
  total: number;
} {
  let subtotal = 0;
  let descontoTotal = 0;
  let ivaTotal = 0;

  itens.forEach(item => {
    const valorSemDesconto = item.quantidade * item.precoUnitario;
    const valorDesconto = valorSemDesconto * (item.desconto / 100);
    const valorComDesconto = valorSemDesconto - valorDesconto;
    const valorIva = valorComDesconto * (item.iva / 100);
    
    subtotal += valorSemDesconto;
    descontoTotal += valorDesconto;
    ivaTotal += valorIva;
    
    // Atualizar total do item
    item.total = valorComDesconto + valorIva;
  });

  const total = subtotal - descontoTotal + ivaTotal;

  return { subtotal, descontoTotal, ivaTotal, total };
}

export const financeiroRouter = router({
  // Listar faturas
  listar: publicProcedure
    .input(z.object({
      utenteId: z.string().optional(),
      dentista: z.string().optional(),
      estado: z.enum(["pendente", "paga", "parcial", "anulada", "vencida"]).optional(),
      dataInicio: z.string().optional(),
      dataFim: z.string().optional(),
      pesquisa: z.string().optional(),
    }).optional())
    .query(({ input }) => {
      let faturas = [...faturasMock];

      if (input) {
        if (input.utenteId) {
          faturas = faturas.filter(f => f.utenteId === input.utenteId);
        }
        if (input.dentista) {
          faturas = faturas.filter(f => f.dentista.toLowerCase().includes(input.dentista!.toLowerCase()));
        }
        if (input.estado) {
          faturas = faturas.filter(f => f.estado === input.estado);
        }
        if (input.dataInicio) {
          faturas = faturas.filter(f => f.data >= input.dataInicio!);
        }
        if (input.dataFim) {
          faturas = faturas.filter(f => f.data <= input.dataFim!);
        }
        if (input.pesquisa) {
          const termo = input.pesquisa.toLowerCase();
          faturas = faturas.filter(f => 
            f.numero.toLowerCase().includes(termo) ||
            f.utenteNome.toLowerCase().includes(termo) ||
            f.dentista.toLowerCase().includes(termo)
          );
        }
      }

      // Ordenar por data (mais recentes primeiro)
      faturas.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

      return faturas;
    }),

  // Obter fatura por ID
  obter: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const fatura = faturasMock.find(f => f.id === input.id);
      if (!fatura) {
        throw new Error("Fatura não encontrada");
      }
      return fatura;
    }),

  // Criar nova fatura
  criar: publicProcedure
    .input(z.object({
      utenteId: z.string(),
      utenteNome: z.string(),
      utenteNif: z.string().optional(),
      utenteMorada: z.string().optional(),
      dentista: z.string(),
      consultaId: z.string().optional(),
      dataVencimento: z.string(),
      itens: z.array(z.object({
        descricao: z.string(),
        quantidade: z.number(),
        precoUnitario: z.number(),
        desconto: z.number().default(0),
        iva: z.number().default(23),
        categoria: z.enum(["consulta", "tratamento", "material", "laboratorio", "outro"]).optional(),
      })),
      observacoes: z.string().optional(),
    }))
    .mutation(({ input }) => {
      const agora = new Date().toISOString();
      
      // Criar itens com IDs
      const itens: ItemFatura[] = input.itens.map((item, index) => ({
        id: `item-${Date.now()}-${index}`,
        ...item,
        total: 0, // Será calculado
        tratamentoId: undefined,
      }));

      // Calcular totais
      const totais = calcularTotaisFatura(itens);

      const novaFatura: Fatura = {
        id: `fat-${Date.now()}`,
        numero: gerarNumeroFatura(),
        serie: "FT",
        tipo: "fatura",
        data: agora,
        dataVencimento: input.dataVencimento,
        utenteId: input.utenteId,
        utenteNome: input.utenteNome,
        utenteNif: input.utenteNif,
        utenteMorada: input.utenteMorada,
        consultaId: input.consultaId,
        dentista: input.dentista,
        itens,
        ...totais,
        estado: "pendente",
        pagamentos: [],
        valorPago: 0,
        valorEmDivida: totais.total,
        observacoes: input.observacoes,
        criadoPor: input.dentista,
        criadoEm: agora,
        atualizadoEm: agora,
      };

      faturasMock.push(novaFatura);
      return novaFatura;
    }),

  // Editar fatura
  editar: publicProcedure
    .input(z.object({
      id: z.string(),
      dataVencimento: z.string().optional(),
      itens: z.array(z.object({
        id: z.string().optional(),
        descricao: z.string(),
        quantidade: z.number(),
        precoUnitario: z.number(),
        desconto: z.number(),
        iva: z.number(),
        categoria: z.enum(["consulta", "tratamento", "material", "laboratorio", "outro"]).optional(),
      })).optional(),
      observacoes: z.string().optional(),
    }))
    .mutation(({ input }) => {
      const fatura = faturasMock.find(f => f.id === input.id);
      if (!fatura) {
        throw new Error("Fatura não encontrada");
      }

      // Não permitir editar faturas pagas ou anuladas
      if (fatura.estado === "paga" || fatura.estado === "anulada") {
        throw new Error("Não é possível editar faturas pagas ou anuladas");
      }

      if (input.dataVencimento) {
        fatura.dataVencimento = input.dataVencimento;
      }

      if (input.itens) {
        // Atualizar itens
        const novosItens: ItemFatura[] = input.itens.map((item, index) => ({
          id: item.id || `item-${Date.now()}-${index}`,
          descricao: item.descricao,
          quantidade: item.quantidade,
          precoUnitario: item.precoUnitario,
          desconto: item.desconto,
          iva: item.iva,
          total: 0, // Será calculado
          categoria: item.categoria,
        }));

        // Recalcular totais
        const totais = calcularTotaisFatura(novosItens);
        fatura.itens = novosItens;
        fatura.subtotal = totais.subtotal;
        fatura.descontoTotal = totais.descontoTotal;
        fatura.ivaTotal = totais.ivaTotal;
        fatura.total = totais.total;
        fatura.valorEmDivida = totais.total - fatura.valorPago;
      }

      if (input.observacoes !== undefined) {
        fatura.observacoes = input.observacoes;
      }

      fatura.atualizadoEm = new Date().toISOString();
      fatura.estado = calcularEstadoFatura(fatura);

      return fatura;
    }),

  // Anular fatura
  anular: publicProcedure
    .input(z.object({
      id: z.string(),
      motivo: z.string(),
    }))
    .mutation(({ input }) => {
      const fatura = faturasMock.find(f => f.id === input.id);
      if (!fatura) {
        throw new Error("Fatura não encontrada");
      }

      fatura.estado = "anulada";
      fatura.anuladaEm = new Date().toISOString();
      fatura.motivoAnulacao = input.motivo;
      fatura.atualizadoEm = new Date().toISOString();

      return fatura;
    }),

  // Registar pagamento
  registarPagamento: publicProcedure
    .input(z.object({
      faturaId: z.string(),
      valor: z.number().positive(),
      metodo: z.enum(["dinheiro", "mbway", "multibanco", "cartao", "transferencia", "cheque"]),
      referencia: z.string().optional(),
      observacoes: z.string().optional(),
    }))
    .mutation(({ input }) => {
      const fatura = faturasMock.find(f => f.id === input.faturaId);
      if (!fatura) {
        throw new Error("Fatura não encontrada");
      }

      if (fatura.estado === "anulada") {
        throw new Error("Não é possível registar pagamento em fatura anulada");
      }

      const agora = new Date().toISOString();

      const novoPagamento: Pagamento = {
        id: `pag-${Date.now()}`,
        faturaId: input.faturaId,
        data: agora,
        valor: input.valor,
        metodo: input.metodo,
        referencia: input.referencia,
        observacoes: input.observacoes,
        criadoPor: "Sistema",
        criadoEm: agora,
      };

      fatura.pagamentos.push(novoPagamento);
      fatura.valorPago += input.valor;
      fatura.valorEmDivida = fatura.total - fatura.valorPago;
      
      // Atualizar estado
      if (fatura.valorPago >= fatura.total) {
        fatura.estado = "paga";
        fatura.dataPagamento = agora;
      } else if (fatura.valorPago > 0) {
        fatura.estado = "parcial";
      }

      fatura.atualizadoEm = agora;

      return { fatura, pagamento: novoPagamento };
    }),

  // Obter estatísticas
  estatisticas: publicProcedure
    .input(z.object({
      dataInicio: z.string(),
      dataFim: z.string(),
    }))
    .query(({ input }) => {
      const faturas = faturasMock.filter(f => 
        f.data >= input.dataInicio && f.data <= input.dataFim
      );

      const receitaTotal = faturas.reduce((sum, f) => sum + f.total, 0);
      const receitaPaga = faturas.filter(f => f.estado === "paga").reduce((sum, f) => sum + f.total, 0);
      const receitaPendente = faturas.filter(f => f.estado === "pendente" || f.estado === "parcial").reduce((sum, f) => sum + f.valorEmDivida, 0);

      const totalFaturas = faturas.length;
      const faturasPagas = faturas.filter(f => f.estado === "paga").length;
      const faturasPendentes = faturas.filter(f => f.estado === "pendente").length;
      const faturasVencidas = faturas.filter(f => f.estado === "vencida").length;
      const faturasAnuladas = faturas.filter(f => f.estado === "anulada").length;

      const ticketMedio = totalFaturas > 0 ? receitaTotal / totalFaturas : 0;

      // Por método de pagamento
      const pagamentosPorMetodo = new Map<MetodoPagamento, { valor: number; quantidade: number }>();
      faturas.forEach(f => {
        f.pagamentos.forEach(p => {
          const atual = pagamentosPorMetodo.get(p.metodo) || { valor: 0, quantidade: 0 };
          pagamentosPorMetodo.set(p.metodo, {
            valor: atual.valor + p.valor,
            quantidade: atual.quantidade + 1,
          });
        });
      });

      const porMetodoPagamento = Array.from(pagamentosPorMetodo.entries()).map(([metodo, dados]) => ({
        metodo,
        ...dados,
      }));

      // Por dentista
      const faturasPorDentista = new Map<string, { valor: number; quantidade: number }>();
      faturas.forEach(f => {
        const atual = faturasPorDentista.get(f.dentista) || { valor: 0, quantidade: 0 };
        faturasPorDentista.set(f.dentista, {
          valor: atual.valor + f.total,
          quantidade: atual.quantidade + 1,
        });
      });

      const porDentista = Array.from(faturasPorDentista.entries()).map(([dentista, dados]) => ({
        dentista,
        ...dados,
      }));

      const estatisticas: EstatisticasFinanceiras = {
        periodoInicio: input.dataInicio,
        periodoFim: input.dataFim,
        receitaTotal,
        receitaPaga,
        receitaPendente,
        totalFaturas,
        faturasPagas,
        faturasPendentes,
        faturasVencidas,
        faturasAnuladas,
        ticketMedio,
        porMetodoPagamento,
        porDentista,
        evolucaoMensal: [], // TODO: Implementar
      };

      return estatisticas;
    }),
});

