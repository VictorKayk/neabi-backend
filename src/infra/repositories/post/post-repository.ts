import prisma from '@/main/config/prisma';
import {
  IPostData, IPostDataQuery, IPostEditableData, IPostRepository, IPostRepositoryReturnData,
} from '@/use-cases/post/interfaces';

export class PostRepository implements IPostRepository {
  async findBySlug(slug: string): Promise<IPostRepositoryReturnData | null> {
    const post = await prisma.post.findFirst({
      where: { slug },
    });
    return post;
  }

  async findById(id: string): Promise<IPostRepositoryReturnData | null> {
    const post = await prisma.post.findFirst({
      where: { id },
    });
    return post;
  }

  async add(postData: IPostData): Promise<IPostRepositoryReturnData> {
    const post = await prisma.post.create({
      data: {
        ...postData,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return post;
  }

  async readAllPosts({
    id, title, slug, description, page,
  }: IPostDataQuery):
    Promise<IPostRepositoryReturnData[] | []> {
    const posts = await prisma.post.findMany({
      where: {
        id: { contains: id, mode: 'insensitive' },
        title: { contains: title, mode: 'insensitive' },
        slug: { contains: slug, mode: 'insensitive' },
        description: { contains: description, mode: 'insensitive' },
      },
      take: 100,
      skip: page && page >= 1 ? (page - 1) * 100 : 0,
      orderBy: { isDeleted: 'asc' },
    });
    return posts;
  }

  async updateById(id: string, postEditableData: IPostEditableData):
  Promise<IPostRepositoryReturnData> {
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...postEditableData, updatedAt: new Date(),
      },
    });
    return post;
  }

  async deleteById(id: string): Promise<IPostRepositoryReturnData> {
    const post = await prisma.post.update({
      where: { id },
      data: {
        isDeleted: true, updatedAt: new Date(),
      },
    });
    return post;
  }
}
