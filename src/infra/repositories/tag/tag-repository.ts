import {
  ITagRepositoryReturnData, ITagData, ITagRepository, ITagEditableData,
} from '@/use-cases/tag/interfaces';
import prisma from '@/main/config/prisma';

export class TagRepository implements ITagRepository {
  async add(tagData: ITagData): Promise<ITagRepositoryReturnData> {
    const tagReturnData = await prisma.tag.create({
      data: {
        ...tagData,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
    });
    return tagReturnData;
  }

  async findByTag(tag: string): Promise<ITagRepositoryReturnData | null> {
    const tagReturnData = await prisma.tag.findFirst({
      where: { tag },
    });
    return tagReturnData;
  }

  async findById(id: string): Promise<ITagRepositoryReturnData | null> {
    const tagReturnData = await prisma.tag.findFirst({
      where: { id },
    });
    return tagReturnData;
  }

  async updateById(id: string, { tag, isDeleted }: ITagEditableData):
    Promise<ITagRepositoryReturnData> {
    const tagUpdated = await prisma.tag.update({
      where: { id },
      data: { tag, isDeleted, updatedAt: new Date() },
    });
    return tagUpdated;
  }
}
