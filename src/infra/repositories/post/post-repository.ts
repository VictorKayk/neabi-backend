import prisma from '@/main/config/prisma';
import { IPostData, IPostRepository, IPostRepositoryReturnData } from '@/use-cases/post/interfaces';

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
}
