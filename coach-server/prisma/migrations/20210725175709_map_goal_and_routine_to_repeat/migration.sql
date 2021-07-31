-- CreateTable
CREATE TABLE "_GoalToRepeat" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_RepeatToRoutine" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GoalToRepeat_AB_unique" ON "_GoalToRepeat"("A", "B");

-- CreateIndex
CREATE INDEX "_GoalToRepeat_B_index" ON "_GoalToRepeat"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RepeatToRoutine_AB_unique" ON "_RepeatToRoutine"("A", "B");

-- CreateIndex
CREATE INDEX "_RepeatToRoutine_B_index" ON "_RepeatToRoutine"("B");

-- AddForeignKey
ALTER TABLE "_GoalToRepeat" ADD FOREIGN KEY ("A") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GoalToRepeat" ADD FOREIGN KEY ("B") REFERENCES "Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RepeatToRoutine" ADD FOREIGN KEY ("A") REFERENCES "Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RepeatToRoutine" ADD FOREIGN KEY ("B") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
