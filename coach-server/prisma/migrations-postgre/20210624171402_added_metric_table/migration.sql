-- CreateTable
CREATE TABLE "Metric" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GoalToMetric" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MetricToTodo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MetricToRoutine" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GoalToMetric_AB_unique" ON "_GoalToMetric"("A", "B");

-- CreateIndex
CREATE INDEX "_GoalToMetric_B_index" ON "_GoalToMetric"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MetricToTodo_AB_unique" ON "_MetricToTodo"("A", "B");

-- CreateIndex
CREATE INDEX "_MetricToTodo_B_index" ON "_MetricToTodo"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MetricToRoutine_AB_unique" ON "_MetricToRoutine"("A", "B");

-- CreateIndex
CREATE INDEX "_MetricToRoutine_B_index" ON "_MetricToRoutine"("B");

-- AddForeignKey
ALTER TABLE "_GoalToMetric" ADD FOREIGN KEY ("A") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GoalToMetric" ADD FOREIGN KEY ("B") REFERENCES "Metric"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetricToTodo" ADD FOREIGN KEY ("A") REFERENCES "Metric"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetricToTodo" ADD FOREIGN KEY ("B") REFERENCES "Todo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetricToRoutine" ADD FOREIGN KEY ("A") REFERENCES "Metric"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MetricToRoutine" ADD FOREIGN KEY ("B") REFERENCES "Routine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
