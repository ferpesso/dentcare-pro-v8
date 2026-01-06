import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

// Utilizador mock para modo desenvolvimento (sem autenticação)
const MOCK_USER = {
  id: "dev-user-001",
  name: "Utilizador de Desenvolvimento",
  email: "dev@dentcare.local",
  loginMethod: "dev",
  role: "admin" as const,
  createdAt: new Date(),
  lastSignedIn: new Date(),
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  const utils = trpc.useUtils();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        return;
      }
      throw error;
    } finally {
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    }
  }, [logoutMutation, utils]);

  const state = useMemo(() => {
    // Se não houver dados do backend, usa o utilizador mock
    const user = meQuery.data ?? MOCK_USER;
    
    localStorage.setItem(
      "manus-runtime-user-info",
      JSON.stringify(user)
    );
    
    return {
      user,
      loading: false, // Sempre carregado (modo dev)
      error: null,
      isAuthenticated: true, // Sempre autenticado (modo dev)
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
  ]);

  // Não redireciona em modo desenvolvimento
  // useEffect removido

  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout,
  };
}
