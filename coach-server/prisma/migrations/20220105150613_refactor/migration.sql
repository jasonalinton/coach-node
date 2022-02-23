-- CreateTable
CREATE TABLE "_IterationToTodo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_IterationToRoutine" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_IterationToTodo_AB_unique" ON "_IterationToTodo"("A", "B");

-- CreateIndex
CREATE INDEX "_IterationToTodo_B_index" ON "_IterationToTodo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_IterationToRoutine_AB_unique" ON "_IterationToRoutine"("A", "B");

-- CreateIndex
CREATE INDEX "_IterationToRoutine_B_index" ON "_IterationToRoutine"("B");

-- AddForeignKey
ALTER TABLE "_IterationToTodo" ADD FOREIGN KEY ("A") REFERENCES "Iteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IterationToTodo" ADD FOREIGN KEY ("B") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IterationToRoutine" ADD FOREIGN KEY ("A") REFERENCES "Iteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IterationToRoutine" ADD FOREIGN KEY ("B") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
