/*
  Warnings:

  - You are about to drop the column `status` on the `tasks` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."tasks_status_idx";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "status",
ADD COLUMN     "completed_at" TIMESTAMP(3),
ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "tasks_is_completed_idx" ON "tasks"("is_completed");
