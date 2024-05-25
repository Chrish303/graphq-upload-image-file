/*
  Warnings:

  - You are about to drop the `Bio` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Bio";

-- CreateTable
CREATE TABLE "bio" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "file" TEXT NOT NULL,

    CONSTRAINT "bio_pkey" PRIMARY KEY ("id")
);
