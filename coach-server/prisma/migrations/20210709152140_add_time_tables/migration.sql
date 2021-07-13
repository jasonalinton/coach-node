-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "dateTimeDeleted" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Routine" ADD COLUMN     "dateTimeDeleted" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "dateTimeDeleted" TIMESTAMPTZ(6);

-- CreateTable
CREATE TABLE "Type" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Time" (
    "id" SERIAL NOT NULL,
    "idType" INTEGER NOT NULL,
    "idEndpoint" INTEGER NOT NULL,
    "idMoment" INTEGER NOT NULL,
    "idFlexibility" INTEGER NOT NULL,
    "dateTime" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal_TimePair" (
    "id" SERIAL NOT NULL,
    "idGoal" INTEGER NOT NULL,
    "idTimeType" INTEGER NOT NULL,
    "idStartTime" INTEGER,
    "idEndTime" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Todo_TimePair" (
    "id" SERIAL NOT NULL,
    "idTodo" INTEGER NOT NULL,
    "idTimeType" INTEGER NOT NULL,
    "idStartTime" INTEGER,
    "idEndTime" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routine_TimePair" (
    "id" SERIAL NOT NULL,
    "idRoutine" INTEGER NOT NULL,
    "idTimeType" INTEGER NOT NULL,
    "idStartTime" INTEGER,
    "idEndTime" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repeat" (
    "id" SERIAL NOT NULL,
    "idType" INTEGER NOT NULL,
    "idTimeframe" INTEGER NOT NULL,
    "idMoment" INTEGER NOT NULL,
    "idStartRepeat" INTEGER,
    "idEndRepeat" INTEGER,
    "idStartIteration" INTEGER,
    "idEndIteration" INTEGER,
    "interval" INTEGER NOT NULL,
    "frequency" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal_Repeat" (
    "id" SERIAL NOT NULL,
    "idGoal" INTEGER NOT NULL,
    "idRepeat" INTEGER NOT NULL,
    "lastIterationDateTime" TIMESTAMPTZ(6),
    "isEventVisible" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Todo_Repeat" (
    "id" SERIAL NOT NULL,
    "idTodo" INTEGER NOT NULL,
    "idRepeat" INTEGER NOT NULL,
    "lastIterationDateTime" TIMESTAMPTZ(6),
    "isEventVisible" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Routine_Repeat" (
    "id" SERIAL NOT NULL,
    "idRoutine" INTEGER NOT NULL,
    "idRepeat" INTEGER NOT NULL,
    "lastIterationDateTime" TIMESTAMPTZ(6),
    "isEventVisible" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GoalToGoal_Repeat" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_TodoToTodo_Repeat" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_RoutineToRoutine_Repeat" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_Goal_RepeatToRepeat" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_RepeatToTodo_Repeat" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_RepeatToRoutine_Repeat" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GoalToGoal_Repeat_AB_unique" ON "_GoalToGoal_Repeat"("A", "B");

-- CreateIndex
CREATE INDEX "_GoalToGoal_Repeat_B_index" ON "_GoalToGoal_Repeat"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TodoToTodo_Repeat_AB_unique" ON "_TodoToTodo_Repeat"("A", "B");

-- CreateIndex
CREATE INDEX "_TodoToTodo_Repeat_B_index" ON "_TodoToTodo_Repeat"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoutineToRoutine_Repeat_AB_unique" ON "_RoutineToRoutine_Repeat"("A", "B");

-- CreateIndex
CREATE INDEX "_RoutineToRoutine_Repeat_B_index" ON "_RoutineToRoutine_Repeat"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_Goal_RepeatToRepeat_AB_unique" ON "_Goal_RepeatToRepeat"("A", "B");

-- CreateIndex
CREATE INDEX "_Goal_RepeatToRepeat_B_index" ON "_Goal_RepeatToRepeat"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RepeatToTodo_Repeat_AB_unique" ON "_RepeatToTodo_Repeat"("A", "B");

-- CreateIndex
CREATE INDEX "_RepeatToTodo_Repeat_B_index" ON "_RepeatToTodo_Repeat"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RepeatToRoutine_Repeat_AB_unique" ON "_RepeatToRoutine_Repeat"("A", "B");

-- CreateIndex
CREATE INDEX "_RepeatToRoutine_Repeat_B_index" ON "_RepeatToRoutine_Repeat"("B");

-- AddForeignKey
ALTER TABLE "Time" ADD FOREIGN KEY ("idType") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time" ADD FOREIGN KEY ("idEndpoint") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time" ADD FOREIGN KEY ("idMoment") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time" ADD FOREIGN KEY ("idFlexibility") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal_TimePair" ADD FOREIGN KEY ("idGoal") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal_TimePair" ADD FOREIGN KEY ("idTimeType") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal_TimePair" ADD FOREIGN KEY ("idStartTime") REFERENCES "Time"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal_TimePair" ADD FOREIGN KEY ("idEndTime") REFERENCES "Time"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo_TimePair" ADD FOREIGN KEY ("idTodo") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo_TimePair" ADD FOREIGN KEY ("idTimeType") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo_TimePair" ADD FOREIGN KEY ("idStartTime") REFERENCES "Time"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo_TimePair" ADD FOREIGN KEY ("idEndTime") REFERENCES "Time"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_TimePair" ADD FOREIGN KEY ("idRoutine") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_TimePair" ADD FOREIGN KEY ("idTimeType") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_TimePair" ADD FOREIGN KEY ("idStartTime") REFERENCES "Time"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_TimePair" ADD FOREIGN KEY ("idEndTime") REFERENCES "Time"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repeat" ADD FOREIGN KEY ("idType") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repeat" ADD FOREIGN KEY ("idTimeframe") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repeat" ADD FOREIGN KEY ("idMoment") REFERENCES "Type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repeat" ADD FOREIGN KEY ("idStartRepeat") REFERENCES "Time"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Repeat" ADD FOREIGN KEY ("idEndRepeat") REFERENCES "Time"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal_Repeat" ADD FOREIGN KEY ("idGoal") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal_Repeat" ADD FOREIGN KEY ("idRepeat") REFERENCES "Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo_Repeat" ADD FOREIGN KEY ("idTodo") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Todo_Repeat" ADD FOREIGN KEY ("idRepeat") REFERENCES "Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_Repeat" ADD FOREIGN KEY ("idRoutine") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Routine_Repeat" ADD FOREIGN KEY ("idRepeat") REFERENCES "Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GoalToGoal_Repeat" ADD FOREIGN KEY ("A") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GoalToGoal_Repeat" ADD FOREIGN KEY ("B") REFERENCES "Goal_Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TodoToTodo_Repeat" ADD FOREIGN KEY ("A") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TodoToTodo_Repeat" ADD FOREIGN KEY ("B") REFERENCES "Todo_Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoutineToRoutine_Repeat" ADD FOREIGN KEY ("A") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoutineToRoutine_Repeat" ADD FOREIGN KEY ("B") REFERENCES "Routine_Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Goal_RepeatToRepeat" ADD FOREIGN KEY ("A") REFERENCES "Goal_Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Goal_RepeatToRepeat" ADD FOREIGN KEY ("B") REFERENCES "Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RepeatToTodo_Repeat" ADD FOREIGN KEY ("A") REFERENCES "Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RepeatToTodo_Repeat" ADD FOREIGN KEY ("B") REFERENCES "Todo_Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RepeatToRoutine_Repeat" ADD FOREIGN KEY ("A") REFERENCES "Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RepeatToRoutine_Repeat" ADD FOREIGN KEY ("B") REFERENCES "Routine_Repeat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
