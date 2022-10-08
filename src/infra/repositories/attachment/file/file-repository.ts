import prisma from '@/main/config/prisma';
import {
  IFileData,
  IFileDataQuery,
  IFileFormatEditableData,
  IFileFormatRepositoryReturnData,
  IFileRepository,
  IFileRepositoryReturnData,
  IFileTypeEditableData,
  IFileTypeRepositoryReturnData,
} from '@/use-cases/attachment/file/interfaces';
import { getFileTypeAndFileFormat } from '@/infra/repositories/utils';
import { IAttachmentRepositoryReturnData } from '@/use-cases/attachment/interfaces';

export class FileRepository implements IFileRepository {
  async findAttachmentById(id: string): Promise<IAttachmentRepositoryReturnData | null> {
    const attachment = await prisma.attachment.findFirst({
      where: { id },
    });
    return attachment;
  }

  async findFileById(id: string): Promise<IFileRepositoryReturnData | null> {
    const file = await prisma.file.findFirst({
      where: { id },
      select: {
        id: true,
        originalFileName: true,
        size: true,
        Attachment: {
          select: {
            name: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
        },
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
      },
    });
    if (file) {
      const { FileFormat, Attachment, ...fileWithoutFileFormat } = file;
      return { ...fileWithoutFileFormat, ...Attachment, ...getFileTypeAndFileFormat(FileFormat) };
    }
    return null;
  }

  async findFileByName(name: string): Promise<IFileRepositoryReturnData | null> {
    const file = await prisma.file.findFirst({
      where: { Attachment: { name } },
      select: {
        id: true,
        originalFileName: true,
        size: true,
        Attachment: {
          select: {
            name: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
        },
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
      },
    });
    if (file) {
      const { FileFormat, Attachment, ...fileWithoutFileFormat } = file;
      return { ...fileWithoutFileFormat, ...Attachment, ...getFileTypeAndFileFormat(FileFormat) };
    }
    return null;
  }

  async findById(id: string): Promise<IFileRepositoryReturnData | null> {
    const file = await prisma.file.findFirst({
      where: { id },
      select: {
        id: true,
        originalFileName: true,
        size: true,
        Attachment: {
          select: {
            name: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
        },
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
      },
    });
    if (file) {
      const { FileFormat, Attachment, ...fileWithoutFileFormat } = file;
      return { ...fileWithoutFileFormat, ...Attachment, ...getFileTypeAndFileFormat(FileFormat) };
    }
    return null;
  }

  async add({
    id, name, url, originalFileName, size, fileFormatId, attachmentId,
  }: IFileData): Promise<IFileRepositoryReturnData> {
    const attachment = await prisma.attachment.create({
      data: {
        id: attachmentId, name, url, createdAt: new Date(), updatedAt: new Date(),
      },
    });

    const file = await prisma.file.create({
      data: {
        id,
        originalFileName,
        size,
        fileFormatId,
        attachmentId: attachment.id,
      },
      select: {
        id: true,
        originalFileName: true,
        size: true,
        Attachment: {
          select: {
            name: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
        },
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
      },
    });
    const { FileFormat, Attachment, ...fileWithoutFileFormat } = file;
    return { ...fileWithoutFileFormat, ...Attachment, ...getFileTypeAndFileFormat(FileFormat) };
  }

  async deleteFileById(id: string): Promise<IFileRepositoryReturnData> {
    const file = await prisma.file.delete({
      where: { id },
      select: {
        id: true,
        originalFileName: true,
        size: true,
        Attachment: {
          select: {
            name: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
        },
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
      },
    });
    const { FileFormat, Attachment, ...fileWithoutFileFormat } = file;
    return { ...fileWithoutFileFormat, ...Attachment, ...getFileTypeAndFileFormat(FileFormat) };
  }

  async readAllFiles({
    fileId, name, originalFileName, format, page, type,
  }: IFileDataQuery): Promise<IFileRepositoryReturnData[] | []> {
    const files = await prisma.file.findMany({
      where: {
        id: { contains: fileId, mode: 'insensitive' },
        originalFileName: { contains: originalFileName, mode: 'insensitive' },
        Attachment: {
          name: { contains: name, mode: 'insensitive' },
        },
        FileFormat: {
          format: { contains: format, mode: 'insensitive' },
          FileType: {
            type: { contains: type, mode: 'insensitive' },
          },
        },
      },
      select: {
        id: true,
        originalFileName: true,
        size: true,
        Attachment: {
          select: {
            name: true,
            url: true,
            createdAt: true,
            updatedAt: true,
          },
        },
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
      },
      take: 100,
      skip: page && page >= 1 ? (page - 1) * 100 : 0,
    });

    return files.map((file: any) => {
      const { FileFormat, ...fileWithoutFileFormat } = file;
      return { ...fileWithoutFileFormat, ...getFileTypeAndFileFormat(FileFormat) };
    });
  }

  async findFileFormatByFormat(format: string): Promise<IFileFormatRepositoryReturnData | null> {
    const fileFormat = await prisma.fileFormat.findFirst({
      where: { format },
    });
    return fileFormat;
  }

  async findFormatById(id: string): Promise<IFileFormatRepositoryReturnData | null> {
    const fileFormat = await prisma.fileFormat.findFirst({
      where: { id },
    });
    return fileFormat;
  }

  async addFileFormat(id: string, format: string, fileTypeId: string):
    Promise<IFileFormatRepositoryReturnData> {
    const fileFormat = await prisma.fileFormat.create({
      data: {
        id,
        format,
        fileTypeId,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
    });
    return fileFormat;
  }

  async updateFileFormatById(id: string, fileFormatEditableData: IFileFormatEditableData):
    Promise<IFileFormatRepositoryReturnData> {
    const fileFormat = await prisma.fileFormat.update({
      where: { id },
      data: { ...fileFormatEditableData, updatedAt: new Date() },
    });
    return fileFormat;
  }

  async findFileTypeByType(type: string): Promise<IFileTypeRepositoryReturnData | null> {
    const fileType = await prisma.fileType.findFirst({
      where: { type },
    });
    return fileType;
  }

  async findTypeById(id: string): Promise<IFileTypeRepositoryReturnData | null> {
    const fileType = await prisma.fileType.findFirst({
      where: { id },
    });
    return fileType;
  }

  async addFileType(id: string, type: string): Promise<IFileTypeRepositoryReturnData> {
    const fileType = await prisma.fileType.create({
      data: {
        id,
        type,
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
      },
    });
    return fileType;
  }

  async updateFileTypeById(id: string, fileTypeEditableData: IFileTypeEditableData):
    Promise<IFileTypeRepositoryReturnData> {
    const fileType = await prisma.fileType.update({
      where: { id },
      data: { ...fileTypeEditableData, updatedAt: new Date() },
    });
    return fileType;
  }
}
