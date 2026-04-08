import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined;
}

// Singleton em TODOS os ambientes — crítico para serverless (Neon/Vercel)
// Em produção sem singleton: nova conexão a cada cold start = pool exhaustion
if (!global.cachedPrisma) {
  global.cachedPrisma = new PrismaClient();
}

export const db = global.cachedPrisma;
