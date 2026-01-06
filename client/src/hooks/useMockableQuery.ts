import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { mockUtentesAPI, mockConsultasAPI } from "@/lib/mockData";

// Flag para forçar uso de mock (útil para desenvolvimento)
const FORCE_MOCK = true; // Mude para false quando o backend estiver rodando

/**
 * Hook para queries que fallback para mock data quando backend não está disponível
 */
export function useMockableQuery<TData>(
  queryKey: any[],
  queryFn: () => Promise<TData>,
  mockFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey,
    queryFn: async () => {
      if (FORCE_MOCK) {
        return mockFn();
      }
      
      try {
        return await queryFn();
      } catch (error: any) {
        // Se erro de rede ou parsing, usa mock
        if (error?.message?.includes('JSON') || error?.message?.includes('fetch')) {
          console.warn('Backend indisponível, usando dados mock');
          return mockFn();
        }
        throw error;
      }
    },
    ...options,
  });
}

/**
 * Hook para mutations que fallback para mock quando backend não está disponível
 */
export function useMockableMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  mockFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, Error, TVariables>
) {
  return useMutation({
    mutationFn: async (variables: TVariables) => {
      if (FORCE_MOCK) {
        return mockFn(variables);
      }
      
      try {
        return await mutationFn(variables);
      } catch (error: any) {
        if (error?.message?.includes('JSON') || error?.message?.includes('fetch')) {
          console.warn('Backend indisponível, usando operação mock');
          return mockFn(variables);
        }
        throw error;
      }
    },
    ...options,
  });
}

// Hooks específicos para Utentes
export function useUtentes() {
  return useMockableQuery(
    ['utentes'],
    () => (trpc.utentes.listar as any).query(),
    () => mockUtentesAPI.listar() as any
  );
}

export function useUtente(id: string) {
  return useMockableQuery(
    ['utente', id],
    () => (trpc.utentes.obter as any).query({ id }),
    () => mockUtentesAPI.obter(id) as any
  );
}

export function useUtentesStats() {
  return useMockableQuery(
    ['utentes-stats'],
    () => (trpc.utentes.estatisticas as any).query(),
    () => mockUtentesAPI.estatisticas() as any
  );
}

export function useCriarUtente() {
  return useMockableMutation(
    (dados: any) => (trpc.utentes.criar as any).mutate(dados),
    (dados: any) => mockUtentesAPI.criar(dados) as any
  );
}

export function useAtualizarUtente() {
  return useMockableMutation(
    ({ id, dados }: { id: string; dados: any }) => 
      (trpc.utentes.atualizar as any).mutate({ id, dados }),
    ({ id, dados }: { id: string; dados: any }) => 
      mockUtentesAPI.atualizar(id, dados) as any
  );
}

export function useRemoverUtente() {
  return useMockableMutation(
    ({ id }: { id: string }) => (trpc.utentes.remover as any).mutate({ id }),
    ({ id }: { id: string }) => mockUtentesAPI.remover(id) as any
  );
}

// Hooks específicos para Consultas
export function useConsultas() {
  return useMockableQuery(
    ['consultas'],
    () => (trpc.consultas.listar as any).query(),
    () => mockConsultasAPI.listar() as any
  );
}

export function useConsultasPorPeriodo(dataInicio: string, dataFim: string) {
  return useMockableQuery(
    ['consultas', dataInicio, dataFim],
    () => (trpc.consultas.listarPorPeriodo as any).query({ dataInicio, dataFim }),
    () => mockConsultasAPI.listarPorPeriodo(dataInicio, dataFim) as any
  );
}

export function useConsultasStats() {
  return useMockableQuery(
    ['consultas-stats'],
    () => (trpc.consultas.estatisticas as any).query(),
    () => mockConsultasAPI.estatisticas() as any
  );
}

export function useCriarConsulta() {
  return useMockableMutation(
    (dados: any) => (trpc.consultas.criar as any).mutate(dados),
    (dados: any) => mockConsultasAPI.criar(dados) as any
  );
}

export function useAtualizarConsulta() {
  return useMockableMutation(
    ({ id, dados }: { id: string; dados: any }) => 
      (trpc.consultas.atualizar as any).mutate({ id, ...dados }),
    ({ id, dados }: { id: string; dados: any }) => 
      mockConsultasAPI.atualizar(id, dados) as any
  );
}

export function useRemoverConsulta() {
  return useMockableMutation(
    ({ id }: { id: string }) => (trpc.consultas.remover as any).mutate({ id }),
    ({ id }: { id: string }) => mockConsultasAPI.remover(id) as any
  );
}
