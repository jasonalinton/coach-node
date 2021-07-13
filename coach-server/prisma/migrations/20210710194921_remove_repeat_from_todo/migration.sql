/*
  Warnings:

  - You are about to drop the `_RepeatToTodo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TodoToTodo_Repeat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Todo_Repeat" DROP CONSTRAINT "Todo_Repeat_idTodo_fkey";

-- DropForeignKey
ALTER TABLE "_RepeatToTodo" DROP CONSTRAINT "_RepeatToTodo_A_fkey";

-- DropForeignKey
ALTER TABLE "_RepeatToTodo" DROP CONSTRAINT "_RepeatToTodo_B_fkey";

-- DropForeignKey
ALTER TABLE "_TodoToTodo_Repeat" DROP CONSTRAINT "_TodoToTodo_Repeat_A_fkey";

-- DropForeignKey
ALTER TABLE "_TodoToTodo_Repeat" DROP CONSTRAINT "_TodoToTodo_Repeat_B_fkey";

-- DropTable
DROP TABLE "_RepeatToTodo";

-- DropTable
DROP TABLE "_TodoToTodo_Repeat";
