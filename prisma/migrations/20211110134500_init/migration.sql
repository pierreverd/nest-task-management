/*
  Warnings:

  - Made the column `status` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Task` MODIFY `status` ENUM('OPEN', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'OPEN';
