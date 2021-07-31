-- AlterTable
ALTER TABLE "Iteration" ADD COLUMN     "idRoutineIteration" INTEGER,
ADD COLUMN     "idRoutineRepeat" INTEGER,
ADD COLUMN     "idTodoRepeat" INTEGER;

-- CreateTable
CREATE TABLE "RoutineTodo_Iteration" (
    "id" SERIAL NOT NULL,
    "idRoutineIteration" INTEGER NOT NULL,
    "hasTodoEvent" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoutineTodo_Iteration_idRoutineIteration_unique" ON "RoutineTodo_Iteration"("idRoutineIteration");

-- AddForeignKey
ALTER TABLE "RoutineTodo_Iteration" ADD FOREIGN KEY ("idRoutineIteration") REFERENCES "Iteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Iteration" ADD FOREIGN KEY ("idTodoRepeat") REFERENCES "Repeat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Iteration" ADD FOREIGN KEY ("idRoutineRepeat") REFERENCES "Repeat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Iteration" ADD FOREIGN KEY ("idRoutineIteration") REFERENCES "RoutineTodo_Iteration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
