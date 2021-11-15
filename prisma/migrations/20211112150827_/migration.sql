/*
  Warnings:

  - The primary key for the `Task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `userId` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_userId_fkey`;

-- AlterTable
ALTER TABLE `Task` DROP PRIMARY KEY,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`, `userId`);

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
