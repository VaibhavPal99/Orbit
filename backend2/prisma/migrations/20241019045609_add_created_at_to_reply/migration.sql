/*
  Warnings:

  - You are about to drop the column `userProfilePic` on the `Reply` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Reply` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "userProfilePic",
DROP COLUMN "username",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
