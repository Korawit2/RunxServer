-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "races_Id" INTEGER;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_races_Id_fkey" FOREIGN KEY ("races_Id") REFERENCES "Races"("id") ON DELETE SET NULL ON UPDATE CASCADE;
