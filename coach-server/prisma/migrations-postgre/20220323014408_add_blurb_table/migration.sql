-- DropForeignKey
ALTER TABLE "Goal_Repeat" DROP CONSTRAINT "Goal_Repeat_idGoal_fkey";

-- DropForeignKey
ALTER TABLE "Goal_Repeat" DROP CONSTRAINT "Goal_Repeat_idRepeat_fkey";

-- DropForeignKey
ALTER TABLE "Goal_TimePair" DROP CONSTRAINT "Goal_TimePair_idGoal_fkey";

-- DropForeignKey
ALTER TABLE "Goal_TimePair" DROP CONSTRAINT "Goal_TimePair_idTimeType_fkey";

-- DropForeignKey
ALTER TABLE "Repeat" DROP CONSTRAINT "Repeat_idTimeframe_fkey";

-- DropForeignKey
ALTER TABLE "Repeat" DROP CONSTRAINT "Repeat_idType_fkey";

-- DropForeignKey
ALTER TABLE "Repeat_DayIndex" DROP CONSTRAINT "Repeat_DayIndex_idRepeat_fkey";

-- DropForeignKey
ALTER TABLE "RoutineTodo_Iteration" DROP CONSTRAINT "RoutineTodo_Iteration_idRoutineIteration_fkey";

-- DropForeignKey
ALTER TABLE "Routine_Repeat" DROP CONSTRAINT "Routine_Repeat_idRepeat_fkey";

-- DropForeignKey
ALTER TABLE "Routine_Repeat" DROP CONSTRAINT "Routine_Repeat_idRoutine_fkey";

-- DropForeignKey
ALTER TABLE "Routine_TimePair" DROP CONSTRAINT "Routine_TimePair_idRoutine_fkey";

-- DropForeignKey
ALTER TABLE "Routine_TimePair" DROP CONSTRAINT "Routine_TimePair_idTimeType_fkey";

-- DropForeignKey
ALTER TABLE "Time" DROP CONSTRAINT "Time_idEndpoint_fkey";

-- DropForeignKey
ALTER TABLE "Time" DROP CONSTRAINT "Time_idFlexibility_fkey";

-- DropForeignKey
ALTER TABLE "Time" DROP CONSTRAINT "Time_idMoment_fkey";

-- DropForeignKey
ALTER TABLE "Time" DROP CONSTRAINT "Time_idType_fkey";

-- DropForeignKey
ALTER TABLE "Todo_Repeat" DROP CONSTRAINT "Todo_Repeat_idRepeat_fkey";

-- DropForeignKey
ALTER TABLE "Todo_Repeat" DROP CONSTRAINT "Todo_Repeat_idTodo_fkey";

-- DropForeignKey
ALTER TABLE "Todo_TimePair" DROP CONSTRAINT "Todo_TimePair_idTimeType_fkey";

-- DropForeignKey
ALTER TABLE "Todo_TimePair" DROP CONSTRAINT "Todo_TimePair_idTodo_fkey";

-- CreateTable
CREATE TABLE "Blurb" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blurb_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlurbToGoal" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlurbToGoal_AB_unique" ON "_BlurbToGoal"("A", "B");

-- CreateIndex
CREATE INDEX "_BlurbToGoal_B_index" ON "_BlurbToGoal"("B");

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_idType_fkey" FOREIGN KEY ("idType") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_idEndpoint_fkey" FOREIGN KEY ("idEndpoint") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_idMoment_fkey" FOREIGN KEY ("idMoment") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_idFlexibility_fkey" FOREIGN KEY ("idFlexibility") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal_TimePair" ADD CONSTRAINT "Goal_TimePair_idGoal_fkey" FOREIGN KEY ("idGoal") REFERENCES "Goal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal_TimePair" ADD CONSTRAINT "Goal_TimePair_idTimeType_fkey" FOREIGN KEY ("idTimeType") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo_TimePair" ADD CONSTRAINT "Todo_TimePair_idTodo_fkey" FOREIGN KEY ("idTodo") REFERENCES "Todo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo_TimePair" ADD CONSTRAINT "Todo_TimePair_idTimeType_fkey" FOREIGN KEY ("idTimeType") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_TimePair" ADD CONSTRAINT "Routine_TimePair_idRoutine_fkey" FOREIGN KEY ("idRoutine") REFERENCES "Routine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_TimePair" ADD CONSTRAINT "Routine_TimePair_idTimeType_fkey" FOREIGN KEY ("idTimeType") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repeat" ADD CONSTRAINT "Repeat_idType_fkey" FOREIGN KEY ("idType") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repeat" ADD CONSTRAINT "Repeat_idTimeframe_fkey" FOREIGN KEY ("idTimeframe") REFERENCES "Type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repeat_DayIndex" ADD CONSTRAINT "Repeat_DayIndex_idRepeat_fkey" FOREIGN KEY ("idRepeat") REFERENCES "Repeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal_Repeat" ADD CONSTRAINT "Goal_Repeat_idGoal_fkey" FOREIGN KEY ("idGoal") REFERENCES "Goal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal_Repeat" ADD CONSTRAINT "Goal_Repeat_idRepeat_fkey" FOREIGN KEY ("idRepeat") REFERENCES "Repeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo_Repeat" ADD CONSTRAINT "Todo_Repeat_idTodo_fkey" FOREIGN KEY ("idTodo") REFERENCES "Todo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo_Repeat" ADD CONSTRAINT "Todo_Repeat_idRepeat_fkey" FOREIGN KEY ("idRepeat") REFERENCES "Repeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_Repeat" ADD CONSTRAINT "Routine_Repeat_idRoutine_fkey" FOREIGN KEY ("idRoutine") REFERENCES "Routine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_Repeat" ADD CONSTRAINT "Routine_Repeat_idRepeat_fkey" FOREIGN KEY ("idRepeat") REFERENCES "Repeat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoutineTodo_Iteration" ADD CONSTRAINT "RoutineTodo_Iteration_idRoutineIteration_fkey" FOREIGN KEY ("idRoutineIteration") REFERENCES "Iteration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlurbToGoal" ADD FOREIGN KEY ("A") REFERENCES "Blurb"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlurbToGoal" ADD FOREIGN KEY ("B") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "RoutineTodo_Iteration_idRoutineIteration_unique" RENAME TO "RoutineTodo_Iteration_idRoutineIteration_key";
