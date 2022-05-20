-- CreateTable
CREATE TABLE `Metric` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Goal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idType` INTEGER NULL,
    `text` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `position` VARCHAR(191) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `dateTimeDeleted` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Todo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `position` VARCHAR(191) NULL,
    `isGroup` BOOLEAN NOT NULL DEFAULT false,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `dateTimeDeleted` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Routine` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `position` VARCHAR(191) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `dateTimeDeleted` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `altText` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Time` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idType` INTEGER NOT NULL,
    `idEndpoint` INTEGER NOT NULL,
    `idMoment` INTEGER NOT NULL,
    `idFlexibility` INTEGER NOT NULL,
    `dateTime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Goal_TimePair` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idGoal` INTEGER NOT NULL,
    `idTimeType` INTEGER NOT NULL,
    `idStartTime` INTEGER NULL,
    `idEndTime` INTEGER NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Todo_TimePair` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idTodo` INTEGER NOT NULL,
    `idTimeType` INTEGER NOT NULL,
    `idStartTime` INTEGER NULL,
    `idEndTime` INTEGER NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Routine_TimePair` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idRoutine` INTEGER NOT NULL,
    `idTimeType` INTEGER NOT NULL,
    `idStartTime` INTEGER NULL,
    `idEndTime` INTEGER NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Repeat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idRoutineRepeat` INTEGER NULL,
    `idType` INTEGER NOT NULL,
    `idTimeframe` INTEGER NOT NULL,
    `idStartRepeat` INTEGER NULL,
    `idEndRepeat` INTEGER NULL,
    `idStartIteration` INTEGER NULL,
    `idEndIteration` INTEGER NULL,
    `interval` INTEGER NOT NULL,
    `frequency` INTEGER NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Repeat_DayIndex` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idRepeat` INTEGER NOT NULL,
    `index` INTEGER NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Goal_Repeat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idGoal` INTEGER NOT NULL,
    `idRepeat` INTEGER NOT NULL,
    `lastIterationDateTime` DATETIME(0) NULL,
    `isEventVisible` BOOLEAN NOT NULL,
    `isRecommended` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Todo_Repeat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idTodo` INTEGER NOT NULL,
    `idRepeat` INTEGER NOT NULL,
    `lastIterationDateTime` DATETIME(0) NULL,
    `isEventVisible` BOOLEAN NOT NULL,
    `isRecommended` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Routine_Repeat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idRoutine` INTEGER NOT NULL,
    `idRepeat` INTEGER NOT NULL,
    `lastIterationDateTime` DATETIME(0) NULL,
    `isEventVisible` BOOLEAN NOT NULL,
    `isRecommended` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Iteration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `startAt` DATETIME(0) NULL,
    `endAt` DATETIME(0) NULL,
    `attemptedAt` DATETIME(0) NULL,
    `completedAt` DATETIME(0) NULL,
    `isRecommended` BOOLEAN NOT NULL DEFAULT false,
    `idGoogleTask` INTEGER NULL,
    `idGoogleTaskList` INTEGER NULL,
    `idTodo` INTEGER NULL,
    `idRoutine` INTEGER NULL,
    `idRepeat` INTEGER NULL,
    `idTodoRepeat` INTEGER NULL,
    `idRoutineRepeat` INTEGER NULL,
    `idTodoTimePair` INTEGER NULL,
    `idRoutineIteration` INTEGER NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoutineTodo_Iteration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idRoutineIteration` INTEGER NOT NULL,
    `hasTodoEvent` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `RoutineTodo_Iteration_idRoutineIteration_key`(`idRoutineIteration`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `startAt` DATETIME(0) NULL,
    `endAt` DATETIME(0) NULL,
    `isAllDay` BOOLEAN NOT NULL DEFAULT false,
    `isRecommended` BOOLEAN NOT NULL DEFAULT false,
    `isSynced` BOOLEAN NOT NULL DEFAULT false,
    `idGoogleEvent` INTEGER NULL,
    `idType` INTEGER NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Blurb` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MetricToTodo` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MetricToTodo_AB_unique`(`A`, `B`),
    INDEX `_MetricToTodo_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MetricToRoutine` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MetricToRoutine_AB_unique`(`A`, `B`),
    INDEX `_MetricToRoutine_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GoalFamily` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GoalFamily_AB_unique`(`A`, `B`),
    INDEX `_GoalFamily_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GoalToMetric` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GoalToMetric_AB_unique`(`A`, `B`),
    INDEX `_GoalToMetric_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GoalToTodo` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GoalToTodo_AB_unique`(`A`, `B`),
    INDEX `_GoalToTodo_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GoalToRoutine` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GoalToRoutine_AB_unique`(`A`, `B`),
    INDEX `_GoalToRoutine_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GoalToRepeat` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GoalToRepeat_AB_unique`(`A`, `B`),
    INDEX `_GoalToRepeat_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_TodoFamily` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_TodoFamily_AB_unique`(`A`, `B`),
    INDEX `_TodoFamily_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RoutineFamily` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RoutineFamily_AB_unique`(`A`, `B`),
    INDEX `_RoutineFamily_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RoutineToTodo` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RoutineToTodo_AB_unique`(`A`, `B`),
    INDEX `_RoutineToTodo_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RepeatToTodo` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RepeatToTodo_AB_unique`(`A`, `B`),
    INDEX `_RepeatToTodo_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RepeatToRoutine` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RepeatToRoutine_AB_unique`(`A`, `B`),
    INDEX `_RepeatToRoutine_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_EventToIteration` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_EventToIteration_AB_unique`(`A`, `B`),
    INDEX `_EventToIteration_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BlurbToGoal` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BlurbToGoal_AB_unique`(`A`, `B`),
    INDEX `_BlurbToGoal_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Goal` ADD CONSTRAINT `Goal_idType_fkey` FOREIGN KEY (`idType`) REFERENCES `Type`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Time` ADD CONSTRAINT `Time_idType_fkey` FOREIGN KEY (`idType`) REFERENCES `Type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Time` ADD CONSTRAINT `Time_idEndpoint_fkey` FOREIGN KEY (`idEndpoint`) REFERENCES `Type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Time` ADD CONSTRAINT `Time_idMoment_fkey` FOREIGN KEY (`idMoment`) REFERENCES `Type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Time` ADD CONSTRAINT `Time_idFlexibility_fkey` FOREIGN KEY (`idFlexibility`) REFERENCES `Type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goal_TimePair` ADD CONSTRAINT `Goal_TimePair_idGoal_fkey` FOREIGN KEY (`idGoal`) REFERENCES `Goal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goal_TimePair` ADD CONSTRAINT `Goal_TimePair_idTimeType_fkey` FOREIGN KEY (`idTimeType`) REFERENCES `Type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goal_TimePair` ADD CONSTRAINT `Goal_TimePair_idStartTime_fkey` FOREIGN KEY (`idStartTime`) REFERENCES `Time`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goal_TimePair` ADD CONSTRAINT `Goal_TimePair_idEndTime_fkey` FOREIGN KEY (`idEndTime`) REFERENCES `Time`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Todo_TimePair` ADD CONSTRAINT `Todo_TimePair_idTodo_fkey` FOREIGN KEY (`idTodo`) REFERENCES `Todo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Todo_TimePair` ADD CONSTRAINT `Todo_TimePair_idTimeType_fkey` FOREIGN KEY (`idTimeType`) REFERENCES `Type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Todo_TimePair` ADD CONSTRAINT `Todo_TimePair_idStartTime_fkey` FOREIGN KEY (`idStartTime`) REFERENCES `Time`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Todo_TimePair` ADD CONSTRAINT `Todo_TimePair_idEndTime_fkey` FOREIGN KEY (`idEndTime`) REFERENCES `Time`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Routine_TimePair` ADD CONSTRAINT `Routine_TimePair_idRoutine_fkey` FOREIGN KEY (`idRoutine`) REFERENCES `Routine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Routine_TimePair` ADD CONSTRAINT `Routine_TimePair_idTimeType_fkey` FOREIGN KEY (`idTimeType`) REFERENCES `Type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Routine_TimePair` ADD CONSTRAINT `Routine_TimePair_idStartTime_fkey` FOREIGN KEY (`idStartTime`) REFERENCES `Time`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Routine_TimePair` ADD CONSTRAINT `Routine_TimePair_idEndTime_fkey` FOREIGN KEY (`idEndTime`) REFERENCES `Time`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repeat` ADD CONSTRAINT `Repeat_idType_fkey` FOREIGN KEY (`idType`) REFERENCES `Type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repeat` ADD CONSTRAINT `Repeat_idTimeframe_fkey` FOREIGN KEY (`idTimeframe`) REFERENCES `Type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repeat` ADD CONSTRAINT `Repeat_idStartRepeat_fkey` FOREIGN KEY (`idStartRepeat`) REFERENCES `Time`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repeat` ADD CONSTRAINT `Repeat_idEndRepeat_fkey` FOREIGN KEY (`idEndRepeat`) REFERENCES `Time`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repeat` ADD CONSTRAINT `Repeat_idStartIteration_fkey` FOREIGN KEY (`idStartIteration`) REFERENCES `Time`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repeat` ADD CONSTRAINT `Repeat_idEndIteration_fkey` FOREIGN KEY (`idEndIteration`) REFERENCES `Time`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repeat` ADD CONSTRAINT `Repeat_idRoutineRepeat_fkey` FOREIGN KEY (`idRoutineRepeat`) REFERENCES `Repeat`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Repeat_DayIndex` ADD CONSTRAINT `Repeat_DayIndex_idRepeat_fkey` FOREIGN KEY (`idRepeat`) REFERENCES `Repeat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goal_Repeat` ADD CONSTRAINT `Goal_Repeat_idGoal_fkey` FOREIGN KEY (`idGoal`) REFERENCES `Goal`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Goal_Repeat` ADD CONSTRAINT `Goal_Repeat_idRepeat_fkey` FOREIGN KEY (`idRepeat`) REFERENCES `Repeat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Todo_Repeat` ADD CONSTRAINT `Todo_Repeat_idTodo_fkey` FOREIGN KEY (`idTodo`) REFERENCES `Todo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Todo_Repeat` ADD CONSTRAINT `Todo_Repeat_idRepeat_fkey` FOREIGN KEY (`idRepeat`) REFERENCES `Repeat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Routine_Repeat` ADD CONSTRAINT `Routine_Repeat_idRoutine_fkey` FOREIGN KEY (`idRoutine`) REFERENCES `Routine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Routine_Repeat` ADD CONSTRAINT `Routine_Repeat_idRepeat_fkey` FOREIGN KEY (`idRepeat`) REFERENCES `Repeat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Iteration` ADD CONSTRAINT `Iteration_idTodo_fkey` FOREIGN KEY (`idTodo`) REFERENCES `Todo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Iteration` ADD CONSTRAINT `Iteration_idRoutine_fkey` FOREIGN KEY (`idRoutine`) REFERENCES `Routine`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Iteration` ADD CONSTRAINT `Iteration_idTodoTimePair_fkey` FOREIGN KEY (`idTodoTimePair`) REFERENCES `Todo_TimePair`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Iteration` ADD CONSTRAINT `Iteration_idRepeat_fkey` FOREIGN KEY (`idRepeat`) REFERENCES `Repeat`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Iteration` ADD CONSTRAINT `Iteration_idTodoRepeat_fkey` FOREIGN KEY (`idTodoRepeat`) REFERENCES `Repeat`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Iteration` ADD CONSTRAINT `Iteration_idRoutineRepeat_fkey` FOREIGN KEY (`idRoutineRepeat`) REFERENCES `Repeat`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Iteration` ADD CONSTRAINT `Iteration_idRoutineIteration_fkey` FOREIGN KEY (`idRoutineIteration`) REFERENCES `RoutineTodo_Iteration`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoutineTodo_Iteration` ADD CONSTRAINT `RoutineTodo_Iteration_idRoutineIteration_fkey` FOREIGN KEY (`idRoutineIteration`) REFERENCES `Iteration`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_idType_fkey` FOREIGN KEY (`idType`) REFERENCES `Type`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MetricToTodo` ADD FOREIGN KEY (`A`) REFERENCES `Metric`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MetricToTodo` ADD FOREIGN KEY (`B`) REFERENCES `Todo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MetricToRoutine` ADD FOREIGN KEY (`A`) REFERENCES `Metric`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MetricToRoutine` ADD FOREIGN KEY (`B`) REFERENCES `Routine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GoalFamily` ADD FOREIGN KEY (`A`) REFERENCES `Goal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GoalFamily` ADD FOREIGN KEY (`B`) REFERENCES `Goal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GoalToMetric` ADD FOREIGN KEY (`A`) REFERENCES `Goal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GoalToMetric` ADD FOREIGN KEY (`B`) REFERENCES `Metric`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GoalToTodo` ADD FOREIGN KEY (`A`) REFERENCES `Goal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GoalToTodo` ADD FOREIGN KEY (`B`) REFERENCES `Todo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GoalToRoutine` ADD FOREIGN KEY (`A`) REFERENCES `Goal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GoalToRoutine` ADD FOREIGN KEY (`B`) REFERENCES `Routine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GoalToRepeat` ADD FOREIGN KEY (`A`) REFERENCES `Goal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GoalToRepeat` ADD FOREIGN KEY (`B`) REFERENCES `Repeat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TodoFamily` ADD FOREIGN KEY (`A`) REFERENCES `Todo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_TodoFamily` ADD FOREIGN KEY (`B`) REFERENCES `Todo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoutineFamily` ADD FOREIGN KEY (`A`) REFERENCES `Routine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoutineFamily` ADD FOREIGN KEY (`B`) REFERENCES `Routine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoutineToTodo` ADD FOREIGN KEY (`A`) REFERENCES `Routine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RoutineToTodo` ADD FOREIGN KEY (`B`) REFERENCES `Todo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RepeatToTodo` ADD FOREIGN KEY (`A`) REFERENCES `Repeat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RepeatToTodo` ADD FOREIGN KEY (`B`) REFERENCES `Todo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RepeatToRoutine` ADD FOREIGN KEY (`A`) REFERENCES `Repeat`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RepeatToRoutine` ADD FOREIGN KEY (`B`) REFERENCES `Routine`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventToIteration` ADD FOREIGN KEY (`A`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_EventToIteration` ADD FOREIGN KEY (`B`) REFERENCES `Iteration`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BlurbToGoal` ADD FOREIGN KEY (`A`) REFERENCES `Blurb`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BlurbToGoal` ADD FOREIGN KEY (`B`) REFERENCES `Goal`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
