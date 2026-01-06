/**
 * Tipos TypeScript para o Módulo Financeiro/Faturação
 * DentCare PRO v8.0
 */

export type EstadoFatura = "pendente" | "paga" | "parcial" | "anulada" | "vencida";
export type MetodoPagamento = "dinheiro" | "mbway" | "multibanco" | "cartao" | "transferencia" | "cheque";

export interface ItemFatura {
  id: string;
  descricao: string;
  quantidade: number;
  precoUnitario: number;
  desconto: number; // Percentagem (0-100)
  iva: number; // Percentagem (0, 6, 13, 23)
  total: number;
  tratamentoId?: string; // Ligação com tratamento (futuro)
  categoria?: "consulta" | "tratamento" | "material" | "laboratorio" | "outro";
}

export interface Pagamento {
  id: string;
  faturaId: string;
  data: string; // ISO date
  valor: number;
  metodo: MetodoPagamento;
  referencia?: string; // Número de referência MB, cheque, etc
  observacoes?: string;
  criadoPor?: string; // Nome do utilizador que registou
  criadoEm: string; // ISO date
}

export interface Fatura {
  id: string;
  numero: string; // Ex: "2025/001"
  serie?: string; // Ex: "A", "B", "FT", "FR"
  tipo: "fatura" | "fatura-recibo" | "recibo" | "nota-credito";
  
  // Datas
  data: string; // ISO date - Data de emissão
  dataVencimento: string; // ISO date
  dataPagamento?: string; // ISO date - Data do pagamento completo
  
  // Integrações
  utenteId: string; // Ligação com Utente
  utenteNome: string; // Cache do nome
  utenteNif?: string; // Cache do NIF
  utenteMorada?: string; // Cache da morada
  
  consultaId?: string; // Ligação com Consulta (opcional)
  
  dentista: string; // Nome do dentista responsável
  dentistaId?: string; // ID do dentista (quando implementado)
  
  // Itens da fatura
  itens: ItemFatura[];
  
  // Valores calculados
  subtotal: number; // Soma dos itens sem IVA
  descontoTotal: number; // Desconto total aplicado
  ivaTotal: number; // IVA total
  total: number; // Valor final a pagar
  
  // Pagamento
  estado: EstadoFatura;
  pagamentos: Pagamento[];
  valorPago: number; // Total já pago
  valorEmDivida: number; // Restante a pagar
  
  // Observações e notas
  observacoes?: string;
  notasInternas?: string;
  
  // Metadata
  criadoPor?: string;
  criadoEm: string; // ISO date
  atualizadoEm: string; // ISO date
  anuladaEm?: string; // ISO date
  motivoAnulacao?: string;
}

export interface EstatisticasFinanceiras {
  // Período
  periodoInicio: string;
  periodoFim: string;
  
  // Receitas
  receitaTotal: number;
  receitaPaga: number;
  receitaPendente: number;
  
  // Faturas
  totalFaturas: number;
  faturasPagas: number;
  faturasPendentes: number;
  faturasVencidas: number;
  faturasAnuladas: number;
  
  // Médias
  ticketMedio: number;
  
  // Por método de pagamento
  porMetodoPagamento: {
    metodo: MetodoPagamento;
    valor: number;
    quantidade: number;
  }[];
  
  // Por dentista
  porDentista: {
    dentista: string;
    valor: number;
    quantidade: number;
  }[];
  
  // Evolução mensal
  evolucaoMensal: {
    mes: string; // "2025-01"
    receita: number;
    faturas: number;
  }[];
}

export interface FiltrosFaturas {
  utenteId?: string;
  dentista?: string;
  estado?: EstadoFatura;
  dataInicio?: string;
  dataFim?: string;
  valorMinimo?: number;
  valorMaximo?: number;
  pesquisa?: string; // Pesquisa por número, nome utente, etc
}

export interface ResumoFatura {
  id: string;
  numero: string;
  data: string;
  utenteNome: string;
  dentista: string;
  total: number;
  valorPago: number;
  estado: EstadoFatura;
}

