import {
  IPostHasAttachmentData,
  IPostHasAttachmentRepository,
  IPostHasAttachmentRepositoryReturnData,
} from '@/use-cases/post-has-attachment/interfaces';
import { IAttachmentRepositoryReturnData } from '@/use-cases/attachment/interfaces';
import { IPostRepositoryReturnData } from '@/use-cases/post/interfaces';
import prisma from '@/main/config/prisma';

export class PostHasAttachmentRepository implements IPostHasAttachmentRepository {
  async findPostById(postId: string): Promise<IPostRepositoryReturnData | null> {
    const postOrNull = await prisma.post.findFirst({
      where: { id: postId, isDeleted: false },
    });
    return postOrNull;
  }

  async findAttachmentById(attachmentId: string): Promise<IAttachmentRepositoryReturnData | null> {
    const attachmentOrNull = await prisma.attachment.findFirst({
      where: { id: attachmentId },
    });
    return attachmentOrNull;
  }

  async findPostHasAttachment({ attachmentId, postId }: IPostHasAttachmentData):
    Promise<IPostHasAttachmentRepositoryReturnData | null> {
    const postHasAttachmentOrNull = await prisma.postHasAttachment.findFirst({
      where: { attachmentId, postId },
    });
    return postHasAttachmentOrNull;
  }

  async addAttachmentToPost(postHasAttachmentData: IPostHasAttachmentData):
    Promise<IPostHasAttachmentRepositoryReturnData> {
    const postHasAttachment = await prisma.postHasAttachment.create({
      data: {
        ...postHasAttachmentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return postHasAttachment;
  }

  async removeAttachmentFromPost(postHasAttachment: IPostHasAttachmentData):
    Promise<IPostHasAttachmentRepositoryReturnData> {
    const postHasAttachmentData = prisma.postHasAttachment.delete({
      where: { postId_attachmentId: postHasAttachment },
    });
    return postHasAttachmentData;
  }
}
