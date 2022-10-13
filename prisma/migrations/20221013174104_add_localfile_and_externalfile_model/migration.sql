-- CreateTable
CREATE TABLE "LocalFile" (
    "fileId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ExternalFile" (
    "externalId" TEXT NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "fileId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "LocalFile_fileId_key" ON "LocalFile"("fileId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalFile_fileId_key" ON "ExternalFile"("fileId");

-- AddForeignKey
ALTER TABLE "LocalFile" ADD CONSTRAINT "LocalFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalFile" ADD CONSTRAINT "ExternalFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
