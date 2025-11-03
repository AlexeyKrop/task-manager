/*
  Warnings:

  - Added the required column `position` to the `groups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "position" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "groups_position_idx" ON "groups"("position");
