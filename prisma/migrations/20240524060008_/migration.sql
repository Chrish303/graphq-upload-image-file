-- CreateTable
CREATE TABLE "bio" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" BYTEA,
    "file" BYTEA,

    CONSTRAINT "bio_pkey" PRIMARY KEY ("id")
);
