-- AlterTable
ALTER TABLE "ExternalFile" ALTER COLUMN "downloadUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "originalFileName" DROP NOT NULL,
ALTER COLUMN "size" DROP NOT NULL;
