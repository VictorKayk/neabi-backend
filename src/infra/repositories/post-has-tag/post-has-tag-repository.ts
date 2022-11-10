import {
  IPostHasTagData,
  IPostHasTagEditableData,
  IPostHasTagRepository,
  IPostHasTagRepositoryReturnData,
} from '@/use-cases/post-has-tag/interfaces';
import { ITagDataQuery, ITagRepositoryReturnData } from '@/use-cases/tag/interfaces';
import { IPostDataQuery, IPostRepositoryReturnData } from '@/use-cases/post/interfaces';
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

  async readAllTagsFromPost(postId: string, { id, tag, page }: ITagDataQuery):
    Promise<ITagRepositoryReturnData[] | []> {
    const postHasTags = await prisma.postHasTag.findMany({
      where: {
        postId,
        tagId: { contains: id, mode: 'insensitive' },
        Tag: {
          tag: { contains: tag, mode: 'insensitive' },
        },
      },
      select: {
        Tag: {
          select: {
            id: true,
            tag: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      take: 100,
      skip: page && page >= 1 ? (page - 1) * 100 : 0,
      orderBy: { isDeleted: 'asc' },
    });
    return postHasTags.map((postHasTag) => postHasTag.Tag);
  }

  async readAllPostsFromTag(tagId: string, {
    id, title, slug, description, page,
  }: IPostDataQuery):
    Promise<IPostRepositoryReturnData[] | []> {
    const postHasTags = await prisma.postHasTag.findMany({
      where: {
        tagId,
        postId: { contains: id, mode: 'insensitive' },
        Post: {
          title: { contains: title, mode: 'insensitive' },
          slug: { contains: slug, mode: 'insensitive' },
          description: { contains: description, mode: 'insensitive' },
        },
      },
      select: {
        Post: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            descriptionHtml: true,
            isDeleted: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      take: 100,
      skip: page && page >= 1 ? (page - 1) * 100 : 0,
      orderBy: { isDeleted: 'asc' },
    });
    return postHasTags.map((postHasTag) => postHasTag.Post);
  }
}
