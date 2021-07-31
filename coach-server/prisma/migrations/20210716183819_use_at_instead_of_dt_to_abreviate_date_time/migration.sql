/*
  Warnings:

  - You are about to drop the column `endDt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `startDT` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `attemptedDT` on the `Iteration` table. All the data in the column will be lost.
  - You are about to drop the column `completedDT` on the `Iteration` table. All the data in the column will be lost.
  - You are about to drop the column `endDt` on the `Iteration` table. All the data in the column will be lost.
  - You are about to drop the column `startDT` on the `Iteration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "endDt",
DROP COLUMN "startDT",
ADD COLUMN     "endAt" TIMESTAMPTZ(6),
ADD COLUMN     "startAt" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Iteration" DROP COLUMN "attemptedDT",
DROP COLUMN "completedDT",
DROP COLUMN "endDt",
DROP COLUMN "startDT",
ADD COLUMN     "attemptedAt" TIMESTAMPTZ(6),
ADD COLUMN     "completedAt" TIMESTAMPTZ(6),
ADD COLUMN     "endAt" TIMESTAMPTZ(6),
ADD COLUMN     "startAt" TIMESTAMPTZ(6);
