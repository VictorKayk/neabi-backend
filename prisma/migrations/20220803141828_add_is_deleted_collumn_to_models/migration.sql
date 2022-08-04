/*
  Warnings:

  - Added the required column `isDeleted` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isDeleted` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isDeleted` to the `UserHasRoles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "UserHasRoles" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL;
