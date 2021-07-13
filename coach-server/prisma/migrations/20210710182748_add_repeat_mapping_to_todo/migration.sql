-- CreateTable
CREATE TABLE "_RepeatToTodo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RepeatToTodo_AB_unique" ON "_RepeatToTodo"("A", "B");

-- CreateIndex
CREATE INDEX "_RepeatToTodo_B_index" ON "_RepeatToTodo"("B");

-- AddForeignKey
ALTER TABLE "_RepeatToTodo" ADD FOREIGN KEY ("A") REFERENCES "Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RepeatToTodo" ADD FOREIGN KEY ("B") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
