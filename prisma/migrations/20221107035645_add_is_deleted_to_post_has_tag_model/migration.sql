/*
  Warnings:

  - Added the required column `isDeleted` to the `PostHasTag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PostHasTag" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL;
