/*
  Warnings:

  - The primary key for the `Task` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Task` DROP FOREIGN KEY `Task_userId_fkey`;

-- AlterTable
ALTER TABLE `Task` DROP PRIMARY KEY,
    MODIFY `userId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Task` ADD CONSTRAINT `Task_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
