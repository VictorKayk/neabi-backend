import {
  IPostHasTagData,
  IPostHasTagEditableData,
  IPostHasTagRepository,
  IPostHasTagRepositoryReturnData,
} from '@/use-cases/post-has-tag/interfaces';
import { ITagRepositoryReturnData } from '@/use-cases/tag/interfaces';
import { IPostRepositoryReturnData } from '@/use-cases/post/interfaces';
import prisma from '@/main/config/prisma';

export class PostHasTagRepository implements IPostHasTagRepository {
  async findPostById(postId: string): Promise<IPostRepositoryReturnData | null> {
    const postOrNull = await prisma.post.findFirst({
      where: { id: postId, isDeleted: false },
    });
    return postOrNull;
  }

  async findTagById(tagId: string): Promise<ITagRepositoryReturnData | null> {
    const tagOrNull = await prisma.tag.findFirst({
      where: { id: tagId },
    });
    return tagOrNull;
  }

  async findPostHasTag({ tagId, postId }: IPostHasTagData):
    Promise<IPostHasTagRepositoryReturnData | null> {
    const postHasTagOrNull = await prisma.postHasTag.findFirst({
      where: { tagId, postId },
    });
    return postHasTagOrNull;
  }

  async updateById(postHasTagData: IPostHasTagData, { isDeleted }: IPostHasTagEditableData):
    Promise<IPostHasTagRepositoryReturnData> {
    const postHasTag = await prisma.postHasTag.update({
      where: { postId_tagId: postHasTagData },
      data: { isDeleted, updatedAt: new Date() },
    });
    return postHasTag;
  }

  async addTagToPost(postHasTagData: IPostHasTagData):
    Promise<IPostHasTagRepositoryReturnData> {
    const postHasTag = await prisma.postHasTag.create({
      data: {
        ...postHasTagData,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return postHasTag;
  }
}
