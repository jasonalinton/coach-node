-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "idType" INTEGER;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_idType_fkey" FOREIGN KEY ("idType") REFERENCES "Type"("id") ON DELETE SET NULL ON UPDATE CASCADE;
