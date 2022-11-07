-- CreateTable
CREATE TABLE "PostHasTag" (
    "postId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostHasTag_pkey" PRIMARY KEY ("postId","tagId")
);

-- AddForeignKey
ALTER TABLE "PostHasTag" ADD CONSTRAINT "PostHasTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostHasTag" ADD CONSTRAINT "PostHasTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
