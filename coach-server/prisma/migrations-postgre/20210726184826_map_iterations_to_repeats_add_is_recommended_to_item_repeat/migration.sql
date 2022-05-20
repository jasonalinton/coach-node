-- AlterTable
ALTER TABLE "Goal_Repeat" ADD COLUMN     "isRecommended" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Routine_Repeat" ADD COLUMN     "isRecommended" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Todo_Repeat" ADD COLUMN     "isRecommended" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "_IterationToRepeat" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_IterationToRepeat_AB_unique" ON "_IterationToRepeat"("A", "B");

-- CreateIndex
CREATE INDEX "_IterationToRepeat_B_index" ON "_IterationToRepeat"("B");

-- AddForeignKey
ALTER TABLE "_IterationToRepeat" ADD FOREIGN KEY ("A") REFERENCES "Iteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IterationToRepeat" ADD FOREIGN KEY ("B") REFERENCES "Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
