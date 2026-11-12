import { PrismaClient } from "@prisma/client";

// Uma única instância para todo o app (evita abrir conexões demais no banco).
export const prisma = new PrismaClient();
