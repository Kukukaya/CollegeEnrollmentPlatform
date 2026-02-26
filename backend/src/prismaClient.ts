// backend/src/prismaClient.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // allow global caching in dev to prevent too many connections
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var __prismaClient__: PrismaClient | undefined;
}

const prisma =
  global.__prismaClient__ ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") global.__prismaClient__ = prisma;

export default prisma;
