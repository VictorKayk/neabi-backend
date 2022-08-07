/*
  Warnings:

  - Added the required column `updatedAt` to the `UserHasRoles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserHasRoles" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "createdAt" DROP DEFAULT;
