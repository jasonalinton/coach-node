/*
  Warnings:

  - You are about to drop the `_RepeatToRepeat_DayIndex` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RepeatToRepeat_DayIndex" DROP CONSTRAINT "_RepeatToRepeat_DayIndex_A_fkey";

-- DropForeignKey
ALTER TABLE "_RepeatToRepeat_DayIndex" DROP CONSTRAINT "_RepeatToRepeat_DayIndex_B_fkey";

-- DropTable
DROP TABLE "_RepeatToRepeat_DayIndex";

-- AddForeignKey
ALTER TABLE "Repeat_DayIndex" ADD FOREIGN KEY ("idRepeat") REFERENCES "Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
