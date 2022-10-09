import prisma from '@/main/config/prisma';
import { IUrlData, IUrlRepository, IUrlRepositoryReturnData } from '@/use-cases/attachment/url/interfaces';
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
}
