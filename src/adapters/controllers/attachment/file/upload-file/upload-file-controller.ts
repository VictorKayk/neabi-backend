import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { CreateFileUseCase } from '@/use-cases/attachment/file/create-file';
import { } from '@/use-cases/attachment/file/errors';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  created,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';
import { IFileRepository } from '@/use-cases/attachment/file/interfaces';
import { CreateFileTypeUseCase } from '@/use-cases/attachment/file/create-file-type';
import { CreateFileFormatUseCase } from '@/use-cases/attachment/file/create-file-format';

export class UploadFileController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly fileRepository: IFileRepository,
    private readonly createFile: CreateFileUseCase,
    private readonly createFileType: CreateFileTypeUseCase,
    private readonly createFileFormat: CreateFileFormatUseCase,
    private readonly uploadUrl: string,
  ) { }

  async handle({ files }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const filesData = await files.reduce(async (prev: any, file: any) => {
        const newPrev = await prev;
        if (newPrev[0] && (newPrev[0] instanceof Error || newPrev[0].isError())) return newPrev;

        const validationError = this.validation.validate(file);
        if (validationError) return [validationError];

        const {
          originalname, filename, size, mimetype,
        } = file;

        const [fileType, fileFormat] = mimetype.split('/');

        let fileTypeOrNull = await this.fileRepository.findFileTypeByType(fileType);
        if (!fileTypeOrNull || fileTypeOrNull.isDeleted) {
          const fileTypeOrError = await this.createFileType.execute(fileType);

          if (fileTypeOrError.isError()) return [fileTypeOrError];
          fileTypeOrNull = fileTypeOrError.value;
        }

        let fileFormatOrNull = await this.fileRepository.findFileFormatByFormat(fileFormat);
        if (!fileFormatOrNull || fileFormatOrNull.isDeleted) {
          const fileFormatOrError = await this.createFileFormat
            .execute({ format: fileFormat, fileTypeId: fileTypeOrNull.id });

          if (fileFormatOrError.isError()) return [fileFormatOrError];
          fileFormatOrNull = fileFormatOrError.value;
        }

        const fileOrError = await this.createFile.execute({
          name: filename, size, originalFileName: originalname, url: `${this.uploadUrl}/${filename}`, fileFormatId: fileFormatOrNull.id,
        });
        if (fileOrError.isError()) return [fileOrError];

        return [...newPrev, fileOrError];
      }, []);

      if (filesData.length === 0) return badRequest(new Error('Please send a file to upload.'));
      if (filesData[0] instanceof Error) return badRequest(filesData[0]);
      if (filesData[0].isError()) return forbidden(filesData[0].value);
      return created(filesData.map((file: any) => file.value));
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
