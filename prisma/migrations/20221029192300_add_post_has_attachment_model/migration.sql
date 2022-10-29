-- CreateTable
CREATE TABLE "PostHasAttachment" (
    "postId" TEXT NOT NULL,
    "attachmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostHasAttachment_pkey" PRIMARY KEY ("postId","attachmentId")
);

-- AddForeignKey
ALTER TABLE "PostHasAttachment" ADD CONSTRAINT "PostHasAttachment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostHasAttachment" ADD CONSTRAINT "PostHasAttachment_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "Attachment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
