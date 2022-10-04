/*
  Warnings:

  - A unique constraint covering the columns `[format]` on the table `FileFormat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type]` on the table `FileType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FileFormat_format_key" ON "FileFormat"("format");

-- CreateIndex
CREATE UNIQUE INDEX "FileType_type_key" ON "FileType"("type");
