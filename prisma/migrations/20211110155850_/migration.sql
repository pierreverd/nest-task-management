/*
  Warnings:

  - You are about to drop the column `deleted` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Task` DROP COLUMN `deleted`,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
