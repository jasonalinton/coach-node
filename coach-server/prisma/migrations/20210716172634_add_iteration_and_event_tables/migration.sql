-- CreateTable
CREATE TABLE "Iteration" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "startDT" TIMESTAMPTZ(6),
    "endDt" TIMESTAMPTZ(6),
    "attemptedDT" TIMESTAMPTZ(6),
    "completedDT" TIMESTAMPTZ(6),
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "idGoogleTask" INTEGER,
    "idGoogleTaskList" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "startDT" TIMESTAMPTZ(6),
    "endDt" TIMESTAMPTZ(6),
    "isAllDay" BOOLEAN NOT NULL DEFAULT false,
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "isSynced" BOOLEAN NOT NULL DEFAULT false,
    "idGoogleEvent" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_IterationToTodo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_IterationToRoutine" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_EventToIteration" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_IterationToTodo_AB_unique" ON "_IterationToTodo"("A", "B");

-- CreateIndex
CREATE INDEX "_IterationToTodo_B_index" ON "_IterationToTodo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_IterationToRoutine_AB_unique" ON "_IterationToRoutine"("A", "B");

-- CreateIndex
CREATE INDEX "_IterationToRoutine_B_index" ON "_IterationToRoutine"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EventToIteration_AB_unique" ON "_EventToIteration"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToIteration_B_index" ON "_EventToIteration"("B");

-- AddForeignKey
ALTER TABLE "_IterationToTodo" ADD FOREIGN KEY ("A") REFERENCES "Iteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IterationToTodo" ADD FOREIGN KEY ("B") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IterationToRoutine" ADD FOREIGN KEY ("A") REFERENCES "Iteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IterationToRoutine" ADD FOREIGN KEY ("B") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToIteration" ADD FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToIteration" ADD FOREIGN KEY ("B") REFERENCES "Iteration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
