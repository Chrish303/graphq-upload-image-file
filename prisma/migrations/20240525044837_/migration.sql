/*
  Warnings:

  - The `image` column on the `bio` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `file` column on the `bio` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "bio" DROP COLUMN "image",
ADD COLUMN     "image" BYTEA,
DROP COLUMN "file",
ADD COLUMN     "file" BYTEA;
