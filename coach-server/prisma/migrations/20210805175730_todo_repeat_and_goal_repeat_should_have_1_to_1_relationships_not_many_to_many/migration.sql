/*
  Warnings:

  - You are about to drop the `_GoalToGoal_Repeat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Goal_RepeatToRepeat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RepeatToTodo_Repeat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TodoToTodo_Repeat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GoalToGoal_Repeat" DROP CONSTRAINT "_GoalToGoal_Repeat_A_fkey";

-- DropForeignKey
ALTER TABLE "_GoalToGoal_Repeat" DROP CONSTRAINT "_GoalToGoal_Repeat_B_fkey";

-- DropForeignKey
ALTER TABLE "_Goal_RepeatToRepeat" DROP CONSTRAINT "_Goal_RepeatToRepeat_A_fkey";

-- DropForeignKey
ALTER TABLE "_Goal_RepeatToRepeat" DROP CONSTRAINT "_Goal_RepeatToRepeat_B_fkey";

-- DropForeignKey
ALTER TABLE "_RepeatToTodo_Repeat" DROP CONSTRAINT "_RepeatToTodo_Repeat_A_fkey";

-- DropForeignKey
ALTER TABLE "_RepeatToTodo_Repeat" DROP CONSTRAINT "_RepeatToTodo_Repeat_B_fkey";

-- DropForeignKey
ALTER TABLE "_TodoToTodo_Repeat" DROP CONSTRAINT "_TodoToTodo_Repeat_A_fkey";

-- DropForeignKey
ALTER TABLE "_TodoToTodo_Repeat" DROP CONSTRAINT "_TodoToTodo_Repeat_B_fkey";

-- DropTable
DROP TABLE "_GoalToGoal_Repeat";

-- DropTable
DROP TABLE "_Goal_RepeatToRepeat";

-- DropTable
DROP TABLE "_RepeatToTodo_Repeat";

-- DropTable
DROP TABLE "_TodoToTodo_Repeat";
