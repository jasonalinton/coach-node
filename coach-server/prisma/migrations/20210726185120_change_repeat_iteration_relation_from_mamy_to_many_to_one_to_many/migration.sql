/*
  Warnings:

  - You are about to drop the `_IterationToRepeat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_IterationToRepeat" DROP CONSTRAINT "_IterationToRepeat_A_fkey";

-- DropForeignKey
ALTER TABLE "_IterationToRepeat" DROP CONSTRAINT "_IterationToRepeat_B_fkey";

-- AlterTable
ALTER TABLE "Iteration" ADD COLUMN     "idRepeat" INTEGER;

-- DropTable
DROP TABLE "_IterationToRepeat";

-- AddForeignKey
ALTER TABLE "Iteration" ADD FOREIGN KEY ("idRepeat") REFERENCES "Repeat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
