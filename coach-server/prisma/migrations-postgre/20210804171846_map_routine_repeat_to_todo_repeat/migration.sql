-- AlterTable
ALTER TABLE "Repeat" ADD COLUMN     "idRoutineRepeat" INTEGER;

-- AddForeignKey
ALTER TABLE "Repeat" ADD FOREIGN KEY ("idRoutineRepeat") REFERENCES "Repeat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
