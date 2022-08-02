/*
  Warnings:

  - The primary key for the `UserHasRoles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `rolesId` on the `UserHasRoles` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `UserHasRoles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserHasRoles" DROP CONSTRAINT "UserHasRoles_rolesId_fkey";

-- AlterTable
ALTER TABLE "UserHasRoles" DROP CONSTRAINT "UserHasRoles_pkey",
DROP COLUMN "rolesId",
ADD COLUMN     "roleId" TEXT NOT NULL,
ADD CONSTRAINT "UserHasRoles_pkey" PRIMARY KEY ("userId", "roleId");

-- AddForeignKey
ALTER TABLE "UserHasRoles" ADD CONSTRAINT "UserHasRoles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
