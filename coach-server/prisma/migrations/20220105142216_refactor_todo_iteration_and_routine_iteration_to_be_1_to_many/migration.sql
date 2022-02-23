/*
  Warnings:

  - You are about to drop the `_IterationToRoutine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_IterationToTodo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_IterationToRoutine" DROP CONSTRAINT "_IterationToRoutine_A_fkey";

-- DropForeignKey
ALTER TABLE "_IterationToRoutine" DROP CONSTRAINT "_IterationToRoutine_B_fkey";

-- DropForeignKey
ALTER TABLE "_IterationToTodo" DROP CONSTRAINT "_IterationToTodo_A_fkey";

-- DropForeignKey
ALTER TABLE "_IterationToTodo" DROP CONSTRAINT "_IterationToTodo_B_fkey";

-- DropTable
DROP TABLE "_IterationToRoutine";

-- DropTable
DROP TABLE "_IterationToTodo";
