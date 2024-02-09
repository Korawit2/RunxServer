/*
  Warnings:

  - Made the column `categoryId` on table `Race_result` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Race_result" DROP CONSTRAINT "Race_result_categoryId_fkey";

-- AlterTable
ALTER TABLE "Race_result" ALTER COLUMN "categoryId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Race_result" ADD CONSTRAINT "Race_result_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
