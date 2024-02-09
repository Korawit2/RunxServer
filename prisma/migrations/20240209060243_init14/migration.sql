-- AlterTable
ALTER TABLE "Race_result" ADD COLUMN     "categoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "Race_result" ADD CONSTRAINT "Race_result_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
