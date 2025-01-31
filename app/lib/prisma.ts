import { PrismaClient } from "@prisma/client";

// ✅ Ensure Prisma is initialized properly
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({log: ['query', 'info', 'warn', 'error'],});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
