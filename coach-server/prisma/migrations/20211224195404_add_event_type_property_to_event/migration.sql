-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "idType" INTEGER;

-- AlterTable
ALTER TABLE "Iteration" ADD COLUMN     "idRoutine" INTEGER,
ADD COLUMN     "idTodo" INTEGER;

-- AddForeignKey
ALTER TABLE "Iteration" ADD FOREIGN KEY ("idTodo") REFERENCES "Todo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Iteration" ADD FOREIGN KEY ("idRoutine") REFERENCES "Routine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD FOREIGN KEY ("idType") REFERENCES "Type"("id") ON DELETE SET NULL ON UPDATE CASCADE;
