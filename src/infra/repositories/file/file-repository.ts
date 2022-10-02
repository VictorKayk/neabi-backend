import prisma from '@/main/config/prisma';
import {
  IFileData,
  IFileFormatEditableData,
  IFileFormatRepositoryReturnData,
  IFileRepository,
  IFileRepositoryReturnData,
  IFileTypeEditableData,
  IFileTypeRepositoryReturnData,
} from '@/use-cases/file/interfaces';

export class FileRepository implements IFileRepository {
  async findByFileName(fileName: string): Promise<IFileRepositoryReturnData | null> {
    const file = await prisma.file.findFirst({
      where: { fileName },
    });
    return file;
  }

  async findById(id: string): Promise<IFileRepositoryReturnData | null> {
    const file = await prisma.file.findFirst({
      where: { id },
    });
    return file;
  }

  async add(fileData: IFileData): Promise<IFileRepositoryReturnData> {
    const file = await prisma.file.create({
      data: {
        ...fileData,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return file;
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