import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis;

function createPrismaClient() {
    const connectionString =
        process.env.DATABASE_URL ||
        "postgresql://neondb_owner:npg_rOlAPV2uf8DU@ep-winter-darkness-aipgtclw-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require";
    const pool = new Pool({ connectionString, ssl: true });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
