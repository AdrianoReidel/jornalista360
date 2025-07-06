/*
  Warnings:

  - You are about to drop the column `cpf` on the `UserProfile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `UserProfile_cpf_key` ON `UserProfile`;

-- AlterTable
ALTER TABLE `UserProfile` DROP COLUMN `cpf`;
