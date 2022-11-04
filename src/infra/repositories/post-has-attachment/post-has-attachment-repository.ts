import {
  IPostHasAttachmentData,
  IPostHasAttachmentRepository,
  IPostHasAttachmentRepositoryReturnData,
} from '@/use-cases/post-has-attachment/interfaces';
import { IAttachmentDataQuery, IAttachmentRepositoryReturnData } from '@/use-cases/attachment/interfaces';
import { IPostRepositoryReturnData } from '@/use-cases/post/interfaces';
import prisma from '@/main/config/prisma';
import { IExternalFileRepositoryReturnData } from '@/use-cases/attachment/external-file/interfaces';
import { IFileFormatRepositoryReturnData } from '@/use-cases/attachment/file/interfaces';
import { IUrlRepositoryReturnData } from '@/use-cases/attachment/url/interfaces';
import { getFileTypeAndFileFormat } from '@/infra/repositories/utils';

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

  async readAllAttachmentsFromPost(postId: string, {
    id, name, url, page,
  }: IAttachmentDataQuery):
  Promise<{
    url: IUrlRepositoryReturnData[] | [];
    file: [] | IFileFormatRepositoryReturnData[];
    externalFile: [] | IExternalFileRepositoryReturnData[];
  }> {
    const attachments = await prisma.attachment.findMany({
      where: {
        PostHasAttachment: { some: { postId } },
        id: { contains: id, mode: 'insensitive' },
        name: { contains: name, mode: 'insensitive' },
        url: { contains: url, mode: 'insensitive' },
      },
      select: {
        id: true,
        name: true,
        url: true,
        createdAt: true,
        updatedAt: true,
        Url: {
          select: {
            id: true,
            attachmentId: true,
          },
        },
        File: {
          select: {
            id: true,
            originalFileName: true,
            size: true,
            downloadUrl: true,
            FileFormat: {
              select: {
                id: true,
                format: true,
                createdAt: true,
                updatedAt: true,
                FileType: {
                  select: {
                    id: true,
                    type: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                },
              },
            },
            ExternalFile: {
              select: {
                externalId: true,
              },
            },
            LocalFile: {
              select: {
                fileId: true,
              },
            },
          },
        },
      },
      take: 100,
      skip: page && page >= 1 ? (page - 1) * 100 : 0,
    });

    return attachments.reduce((prev: any, attachment: any) => {
      const { Url, File, ...attachmentData } = attachment;

      if (File) {
        const {
          LocalFile, ExternalFile, FileFormat, ...fileData
        } = File;
        return {
          url: Url ? [...prev.url, { ...attachmentData }] : prev.url,
          file: LocalFile ? [...prev.file, {
            ...fileData,
            ...getFileTypeAndFileFormat(FileFormat),
          }] : prev.file,
          externalFile: ExternalFile ? [...prev.externalFile, {
            ...fileData,
            size: fileData.size?.toString(),
            ...getFileTypeAndFileFormat(FileFormat),
            ...ExternalFile,
          }] : prev.externalFile,
        };
      }

      return {
        url: Url ? [...prev.url, { ...attachmentData }] : prev.url,
        file: prev.file,
        externalFile: prev.externalFile,
      };
    }, { url: [], file: [], externalFile: [] });
  }
}
