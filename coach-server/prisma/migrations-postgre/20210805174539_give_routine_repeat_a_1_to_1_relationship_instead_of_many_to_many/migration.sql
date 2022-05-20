/*
  Warnings:

  - You are about to drop the `_RepeatToRoutine_Repeat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoutineToRoutine_Repeat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RepeatToRoutine_Repeat" DROP CONSTRAINT "_RepeatToRoutine_Repeat_A_fkey";

-- DropForeignKey
ALTER TABLE "_RepeatToRoutine_Repeat" DROP CONSTRAINT "_RepeatToRoutine_Repeat_B_fkey";

-- DropForeignKey
ALTER TABLE "_RoutineToRoutine_Repeat" DROP CONSTRAINT "_RoutineToRoutine_Repeat_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoutineToRoutine_Repeat" DROP CONSTRAINT "_RoutineToRoutine_Repeat_B_fkey";

-- DropTable
DROP TABLE "_RepeatToRoutine_Repeat";

-- DropTable
DROP TABLE "_RoutineToRoutine_Repeat";
