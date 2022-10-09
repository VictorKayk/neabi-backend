/*
  Warnings:

  - A unique constraint covering the columns `[attachmentId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[attachmentId]` on the table `Url` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_attachmentId_key" ON "File"("attachmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Url_attachmentId_key" ON "Url"("attachmentId");
