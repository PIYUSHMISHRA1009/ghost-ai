import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// ─── Accelerate (prisma+postgres://) ─────────────────────────────────────────

function createAccelerateClient(): PrismaClient {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { withAccelerate } = require("@prisma/extension-accelerate");
  // @ts-expect-error Accelerate extension setup for prisma+postgres:// URLs
  return new PrismaClient().$extends(withAccelerate()) as unknown as PrismaClient;
}

// ─── Direct pg adapter ────────────────────────────────────────────────────────

function createPgClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

// ─── Singleton factory ────────────────────────────────────────────────────────

function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "";
  if (url.startsWith("prisma+postgres://")) {
    return createAccelerateClient();
  }
  return createPgClient();
}

// ─── Global cache for development hot reloads ─────────────────────────────────

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
export default prisma;
