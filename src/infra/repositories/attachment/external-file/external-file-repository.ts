import prisma from '@/main/config/prisma';
import {
  IExternalUserCredentials,
  IExternalFileRepository,
  IReadExternalFileData,
  IUserExternalFilePermissionReturnData,
  IUserExternalFile,
  IPublicUserExternalFileData,
  IExternalFileRepositoryReturnData,
  IExternalFileData,
  IExternalFileDataQuery,
} from '@/use-cases/attachment/external-file/interfaces';
import driveConfig from '@/main/config/google-drive';
import { IAttachmentRepositoryReturnData } from '@/use-cases/attachment/interfaces';
import { getFileTypeAndFileFormat } from '@/infra/repositories/utils';

export class ExternalFileRepository implements IExternalFileRepository {
  private drive: any;

  setCredentialToDrive(credentials: IExternalUserCredentials) {
    const { drive } = driveConfig(credentials);
    this.drive = drive;
  }

  async readAllUserExternalFiles(): Promise<IReadExternalFileData[] | []> {
    const files = await this.drive.files.list({
      corpora: 'allDrives',
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
      fields: 'files(id, name, mimeType, size, iconLink, thumbnailLink)',
    });

    const filesWithCorrectMimeTypeFormat = files.data.files?.map((file: any) => ({ ...file, mimeType: file.mimeType?.replace('vnd.google-apps.', '') }));
    const filesWithoutFolderMimeType = filesWithCorrectMimeTypeFormat?.filter((file: any) => file.mimeType?.split('/')[1] !== 'folder');
    return filesWithoutFolderMimeType || [];
  }

  async addPublicVisibilityToUserExternalFile(fileId: string):
    Promise<IUserExternalFilePermissionReturnData> {
    const permission = await this.drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
      fields: 'id, type, role',
    });
    return permission.data;
  }

  async copyUserExternalFile(fileId: string): Promise<IUserExternalFile> {
    const copyExternalFile = await this.drive.files.copy({
      fileId,
      fields: 'id, name, mimeType',
    });
    const { id, name, mimeType } = copyExternalFile.data;
    return { externalId: id, name, mimeType };
  }

  async readPublicUserExternalFileData(fileId: string): Promise<IPublicUserExternalFileData> {
    const externalFile = await this.drive.files.get({
      fileId,
      fields: 'id, name, mimeType, size, originalFilename, webViewLink, webContentLink',
    });
    const {
      id, name, mimeType, size, originalFilename, webViewLink, webContentLink,
    } = externalFile.data;
    return {
      externalId: id,
      name,
      mimeType,
      size,
      originalFileName: originalFilename,
      url: webViewLink,
      downloadUrl: webContentLink,
    };
  }

  async findExternalFileByFileId(fileId: string):
    Promise<IExternalFileRepositoryReturnData | null> {
    const externalFile = await prisma.externalFile.findFirst({
      where: { fileId },
      select: {
        downloadUrl: true,
        externalId: true,
        File: {
          select: {
            id: true,
            originalFileName: true,
            size: true,
            attachmentId: true,
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
        },
      },
    });
    if (externalFile) {
      const { File, downloadUrl, externalId } = externalFile;
      const { FileFormat, Attachment, ...fileWithoutFileFormat } = File;
      return {
        ...fileWithoutFileFormat,
        size: fileWithoutFileFormat.size?.toString(),
        ...Attachment,
        ...getFileTypeAndFileFormat(FileFormat),
        downloadUrl,
        externalId,
      };
    }
    return null;
  }

  async findAttachmentById(id: string): Promise<IAttachmentRepositoryReturnData | null> {
    const attachment = await prisma.attachment.findFirst({
      where: { id },
    });
    return attachment;
  }

  async findExternalFileById(id: string): Promise<IExternalFileRepositoryReturnData | null> {
    const externalFile = await prisma.externalFile.findFirst({
      where: { File: { id } },
      select: {
        downloadUrl: true,
        externalId: true,
        File: {
          select: {
            id: true,
            originalFileName: true,
            size: true,
            attachmentId: true,
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
        },
      },
    });
    if (externalFile) {
      const { File, downloadUrl, externalId } = externalFile;
      const { FileFormat, Attachment, ...fileWithoutFileFormat } = File;
      return {
        ...fileWithoutFileFormat,
        size: fileWithoutFileFormat.size?.toString(),
        ...Attachment,
        ...getFileTypeAndFileFormat(FileFormat),
        downloadUrl,
        externalId,
      };
    }
    return null;
  }

  async addExternalFile({
    attachmentId, externalId, fileFormatId, id, name, originalFileName, downloadUrl, size, url,
  }: IExternalFileData):
    Promise<IExternalFileRepositoryReturnData> {
    const attachment = await prisma.attachment.create({
      data: {
        id: attachmentId, name, url, createdAt: new Date(), updatedAt: new Date(),
      },
    });

    const file = await prisma.file.create({
      data: {
        id,
        originalFileName,
        size: size ? parseInt(size, 10) : undefined,
        fileFormatId,
        attachmentId: attachment.id,
      },
      select: {
        id: true,
        originalFileName: true,
        size: true,
        attachmentId: true,
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

    await prisma.externalFile
      .create({ data: { fileId: file.id, downloadUrl, externalId } });

    const { FileFormat, Attachment, ...fileWithoutFileFormat } = file;
    return {
      ...fileWithoutFileFormat,
      size: fileWithoutFileFormat.size?.toString(),
      ...Attachment,
      ...getFileTypeAndFileFormat(FileFormat),
      downloadUrl,
      externalId,
    };
  }

  async readAllExternalFiles({
    fileId, name, originalFileName, format, page, type,
  }: IExternalFileDataQuery):
  Promise<IExternalFileRepositoryReturnData[] | []> {
    const externalFiles = await prisma.externalFile.findMany({
      where: {
        File: {
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
      },
      select: {
        File: {
          select: {
            id: true,
            originalFileName: true,
            size: true,
            attachmentId: true,
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
        },
      },
      take: 100,
      skip: page && page >= 1 ? (page - 1) * 100 : 0,
    });

    return externalFiles.map((externalFile: any) => {
      const { File, downloadUrl, externalId } = externalFile;
      const { FileFormat, Attachment, ...fileWithoutFileFormat } = File;
      return {
        ...fileWithoutFileFormat,
        size: fileWithoutFileFormat.size?.toString(),
        ...Attachment,
        ...getFileTypeAndFileFormat(FileFormat),
        downloadUrl,
        externalId,
      };
    });
  }

  async deleteExternalFileById(fileId: string): Promise<IExternalFileRepositoryReturnData> {
    const externalFile = await prisma.externalFile.delete({
      where: { fileId },
      select: {
        downloadUrl: true,
        externalId: true,
        File: true,
      },
    });

    const file = await prisma.file.delete({
      where: { id: fileId },
      select: {
        id: true,
        originalFileName: true,
        size: true,
        attachmentId: true,
        Attachment: {
          select: {
            id: true,
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
    const { downloadUrl, externalId } = externalFile;
    const { FileFormat, Attachment, ...fileWithoutFileFormat } = file;

    await prisma.attachment.delete({
      where: { id: Attachment.id },
    });

    return {
      ...fileWithoutFileFormat,
      size: fileWithoutFileFormat.size?.toString(),
      ...Attachment,
      ...getFileTypeAndFileFormat(FileFormat),
      downloadUrl,
      externalId,
    };
  }
}
