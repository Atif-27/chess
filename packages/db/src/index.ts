import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};



export const prisma = prismaClientSingleton();



export * from "@prisma/client";
