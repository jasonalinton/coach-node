-- CreateTable
CREATE TABLE "_RepeatToTodo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TodoToTodo_Repeat" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RepeatToTodo_AB_unique" ON "_RepeatToTodo"("A", "B");

-- CreateIndex
CREATE INDEX "_RepeatToTodo_B_index" ON "_RepeatToTodo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TodoToTodo_Repeat_AB_unique" ON "_TodoToTodo_Repeat"("A", "B");

-- CreateIndex
CREATE INDEX "_TodoToTodo_Repeat_B_index" ON "_TodoToTodo_Repeat"("B");

-- AddForeignKey
ALTER TABLE "Todo_Repeat" ADD FOREIGN KEY ("idTodo") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RepeatToTodo" ADD FOREIGN KEY ("A") REFERENCES "Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RepeatToTodo" ADD FOREIGN KEY ("B") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TodoToTodo_Repeat" ADD FOREIGN KEY ("A") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TodoToTodo_Repeat" ADD FOREIGN KEY ("B") REFERENCES "Todo_Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
