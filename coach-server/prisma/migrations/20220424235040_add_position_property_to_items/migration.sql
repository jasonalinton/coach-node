-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "position" TEXT;

-- AlterTable
ALTER TABLE "Routine" ADD COLUMN     "position" TEXT;

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "position" TEXT;

-- CreateTable
CREATE TABLE "Goal_Todo" (
    "id" SERIAL NOT NULL,
    "idGoal_Parent" INTEGER NOT NULL,
    "idTodo_Child" INTEGER NOT NULL,
    "todoPosition" INTEGER NOT NULL,

    CONSTRAINT "Goal_Todo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Goal_Todo" ADD CONSTRAINT "Goal_Todo_idGoal_Parent_fkey" FOREIGN KEY ("idGoal_Parent") REFERENCES "Goal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal_Todo" ADD CONSTRAINT "Goal_Todo_idTodo_Child_fkey" FOREIGN KEY ("idTodo_Child") REFERENCES "Todo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
