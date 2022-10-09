import prisma from '@/main/config/prisma';
import {
  IUrlData, IUrlDataQuery, IUrlRepository, IUrlRepositoryReturnData,
} from '@/use-cases/attachment/url/interfaces';
import { IAttachmentRepositoryReturnData } from '@/use-cases/attachment/interfaces';

export class UrlRepository implements IUrlRepository {
  async findAttachmentById(id: string): Promise<IAttachmentRepositoryReturnData | null> {
    const attachment = await prisma.attachment.findFirst({
      where: { id },
    });
    return attachment;
  }

  async findById(id: string): Promise<IUrlRepositoryReturnData | null> {
    const url = await prisma.url.findFirst({
      where: { id },
      select: {
        id: true,
        Attachment: {
          select: {
            name: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    if (url) {
      const { id: urlId, Attachment } = url;
      return { id: urlId, ...Attachment };
    }
    return null;
  }

  async findByUrl(url: string): Promise<IUrlRepositoryReturnData | null> {
    const urlData = await prisma.url.findFirst({
      where: { Attachment: { url } },
      select: {
        id: true,
        Attachment: {
          select: {
            name: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    if (urlData) {
      const { id: urlId, Attachment } = urlData;
      return { id: urlId, ...Attachment };
    }
    return null;
  }

  async add({
    attachmentId, name, url, id,
  }: IUrlData): Promise<IUrlRepositoryReturnData> {
    const attachment = await prisma.attachment.create({
      data: {
        id: attachmentId, name, url, createdAt: new Date(), updatedAt: new Date(),
      },
    });

    const urlData = await prisma.url.create({
      data: {
        id, attachmentId: attachment.id,
      },
      select: {
        id: true,
        Attachment: {
          select: {
            name: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
    const { id: urlId, Attachment } = urlData;
    return { id: urlId, ...Attachment };
  }

  async readAllUrls({
    urlId, name, url, page,
  }: IUrlDataQuery): Promise<IUrlRepositoryReturnData[] | []> {
    const urls = await prisma.url.findMany({
      where: {
        id: { contains: urlId, mode: 'insensitive' },
        Attachment: {
          name: { contains: name, mode: 'insensitive' },
          url: { contains: url, mode: 'insensitive' },
        },
      },
      select: {
        id: true,
        Attachment: {
          select: {
            name: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      take: 100,
      skip: page && page >= 1 ? (page - 1) * 100 : 0,
    });

    return urls.map((urlData) => {
      const { id, Attachment } = urlData;
      return { id, ...Attachment };
    });
  }

  async deleteUrlById(id: string): Promise<IUrlRepositoryReturnData> {
    const urlData = await prisma.url.delete({
      where: { id },
      select: {
        id: true,
        Attachment: {
          select: {
            id: true,
            name: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const { id: urlId, Attachment } = urlData;
    const { id: attachmentId, ...attachmentWithoutId } = Attachment;

    await prisma.attachment.delete({
      where: { id: attachmentId },
    });

    return { id: urlId, ...attachmentWithoutId };
  }
}
