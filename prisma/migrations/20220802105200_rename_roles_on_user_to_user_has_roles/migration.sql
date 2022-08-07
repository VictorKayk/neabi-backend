/*
  Warnings:

  - You are about to drop the `RolesOnUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RolesOnUser" DROP CONSTRAINT "RolesOnUser_rolesId_fkey";

-- DropForeignKey
ALTER TABLE "RolesOnUser" DROP CONSTRAINT "RolesOnUser_userId_fkey";

-- DropTable
DROP TABLE "RolesOnUser";

-- CreateTable
CREATE TABLE "UserHasRoles" (
    "userId" TEXT NOT NULL,
    "rolesId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserHasRoles_pkey" PRIMARY KEY ("userId","rolesId")
);

-- AddForeignKey
ALTER TABLE "UserHasRoles" ADD CONSTRAINT "UserHasRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserHasRoles" ADD CONSTRAINT "UserHasRoles_rolesId_fkey" FOREIGN KEY ("rolesId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
