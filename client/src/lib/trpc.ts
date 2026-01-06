import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "../../../server/_core/routers";

export const trpc = createTRPCReact<AppRouter>();
