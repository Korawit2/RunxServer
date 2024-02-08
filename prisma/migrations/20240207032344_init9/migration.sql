/*
  Warnings:

  - Made the column `races_Id` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_races_Id_fkey";

-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "races_Id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_races_Id_fkey" FOREIGN KEY ("races_Id") REFERENCES "Races"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
