/*
  Warnings:

  - You are about to drop the column `downloadUrl` on the `ExternalFile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExternalFile" DROP COLUMN "downloadUrl";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "downloadUrl" TEXT;
