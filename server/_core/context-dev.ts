import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

// Usuário mock para desenvolvimento (bypass OAuth)
const MOCK_USER: User = {
  id: "dev-user-001",
  name: "Utilizador de Desenvolvimento",
  email: "dev@dentcare.local",
  loginMethod: "dev",
  role: "admin",
  createdAt: new Date(),
  lastSignedIn: new Date(),
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // Em modo de desenvolvimento, sempre retorna um usuário mock
  // Isso permite testar o sistema sem configurar OAuth
  console.log("[Dev Mode] Using mock user for authentication bypass");
  
  return {
    req: opts.req,
    res: opts.res,
    user: MOCK_USER,
  };
}

