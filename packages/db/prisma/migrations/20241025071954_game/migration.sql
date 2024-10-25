/*
  Warnings:

  - You are about to drop the column `lastLogin` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABONDNED');

-- CreateEnum
CREATE TYPE "GameResult" AS ENUM ('WHITE_WINS', 'BLACK_WINS', 'DRAW');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "lastLogin";

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "whitePlayerId" TEXT NOT NULL,
    "blackPlayerId" TEXT NOT NULL,
    "status" "GameStatus" NOT NULL,
    "result" "GameStatus" NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_rating_idx" ON "User"("rating");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_whitePlayerId_fkey" FOREIGN KEY ("whitePlayerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_blackPlayerId_fkey" FOREIGN KEY ("blackPlayerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
