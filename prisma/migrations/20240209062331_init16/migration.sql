/*
  Warnings:

  - Made the column `date` on table `Races` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Races" ALTER COLUMN "date" SET NOT NULL;
