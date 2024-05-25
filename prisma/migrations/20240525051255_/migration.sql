/*
  Warnings:

  - You are about to drop the `bio` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "bio";

-- CreateTable
CREATE TABLE "Bio" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" BYTEA,
    "file" BYTEA,

    CONSTRAINT "Bio_pkey" PRIMARY KEY ("id")
);
