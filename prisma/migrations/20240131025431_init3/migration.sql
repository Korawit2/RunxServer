-- DropForeignKey
ALTER TABLE "Race_result" DROP CONSTRAINT "Race_result_runx_id_fkey";

-- AlterTable
ALTER TABLE "Race_result" ALTER COLUMN "runx_id" DROP NOT NULL;
