/*
  Warnings:

  - You are about to drop the column `distance` on the `Races` table. All the data in the column will be lost.
  - You are about to drop the column `max_point` on the `Races` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Races" DROP COLUMN "distance",
DROP COLUMN "max_point";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "max_point" INTEGER NOT NULL,
    "distance" INTEGER NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
