import { PrismaClient } from "@prisma/client";

// A singleton instance of Prisma Client
function createInstance() {
  return new PrismaClient();
}

// This is the type of the Prisma Client instance
type ClientType = ReturnType<typeof createInstance>;

// A global is used here to maintain a single instance of Prisma Client
const GlobalForPrisma = globalThis as unknown as {
  prisma: ClientType | undefined;
};

const prisma = GlobalForPrisma.prisma ?? createInstance();
// this verify is for dev so multiple instance of prisma is not created on reload
if (process.env.NODE_ENV !== "production") GlobalForPrisma.prisma = prisma;
export default prisma;
