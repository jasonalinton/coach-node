-- AlterTable
ALTER TABLE "Iteration" ADD COLUMN     "idTodoTimePair" INTEGER;

-- AddForeignKey
ALTER TABLE "Iteration" ADD CONSTRAINT "Iteration_idTodoTimePair_fkey" FOREIGN KEY ("idTodoTimePair") REFERENCES "Todo_TimePair"("id") ON DELETE SET NULL ON UPDATE CASCADE;
