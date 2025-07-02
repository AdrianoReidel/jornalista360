// lib/prisma.js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // opcional: para logar as queries no terminal
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
