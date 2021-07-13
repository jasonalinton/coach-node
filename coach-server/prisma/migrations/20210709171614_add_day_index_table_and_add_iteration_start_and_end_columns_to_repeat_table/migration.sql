-- DropForeignKey
ALTER TABLE "Repeat" DROP CONSTRAINT "Repeat_idMoment_fkey";

-- CreateTable
CREATE TABLE "Repeat_DayIndex" (
    "id" SERIAL NOT NULL,
    "idRepeat" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RepeatToRepeat_DayIndex" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RepeatToRepeat_DayIndex_AB_unique" ON "_RepeatToRepeat_DayIndex"("A", "B");

-- CreateIndex
CREATE INDEX "_RepeatToRepeat_DayIndex_B_index" ON "_RepeatToRepeat_DayIndex"("B");

-- AddForeignKey
ALTER TABLE "Repeat" ADD FOREIGN KEY ("idStartIteration") REFERENCES "Time"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repeat" ADD FOREIGN KEY ("idEndIteration") REFERENCES "Time"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RepeatToRepeat_DayIndex" ADD FOREIGN KEY ("A") REFERENCES "Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RepeatToRepeat_DayIndex" ADD FOREIGN KEY ("B") REFERENCES "Repeat_DayIndex"("id") ON DELETE CASCADE ON UPDATE CASCADE;
