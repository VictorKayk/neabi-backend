-- CreateTable
CREATE TABLE "Url" (
    "id" TEXT NOT NULL,
    "attachmentId" TEXT NOT NULL,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Url" ADD CONSTRAINT "Url_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "Attachment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
