/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Race_result` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_event_id_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_races_Id_fkey";

-- DropForeignKey
ALTER TABLE "Race_result" DROP CONSTRAINT "Race_result_categoryId_fkey";

-- AlterTable
ALTER TABLE "Race_result" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "Races" ADD COLUMN     "distance" INTEGER;

-- DropTable
DROP TABLE "Category";
