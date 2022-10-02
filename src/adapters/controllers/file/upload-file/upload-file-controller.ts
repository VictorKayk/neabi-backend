import { IHttpRequest, IHttpResponse } from '@/adapters/interfaces';
import { UploadFileUseCase } from '@/use-cases/file/upload-file';
import { } from '@/use-cases/file/errors';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  created,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';
import { IFileRepository } from '@/use-cases/file/interfaces';
import { CreateFileTypeUseCase } from '@/use-cases/file/create-file-type';
import { CreateFileFormatUseCase } from '@/use-cases/file/create-file-format';

export class UploadFileController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly fileRepository: IFileRepository,
    private readonly uploadFile: UploadFileUseCase,
    private readonly createFileType: CreateFileTypeUseCase,
    private readonly createFileFormat: CreateFileFormatUseCase,
    private readonly uploadUrl: string,
  ) { }

  async handle({ files }: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(files);
      if (validationError) return badRequest(validationError);

      const {
        originalname, filename, size, mimetype,
      } = files;

      const [fileType, fileFormat] = mimetype.split('/');

      let fileTypeOrNull = await this.fileRepository.findFileTypeByType(fileType);
      if (!fileTypeOrNull) {
        const fileTypeOrError = await this.createFileType.execute(fileType);
        if (fileTypeOrError.isError()) return forbidden(fileTypeOrError.value);
        fileTypeOrNull = fileTypeOrError.value;
      }

      let fileFormatOrNull = await this.fileRepository.findFileFormatByFormat(fileFormat);
      if (!fileFormatOrNull) {
        const fileFormatOrError = await this.createFileFormat
          .execute({ format: fileFormat, fileTypeId: fileTypeOrNull.id });
        if (fileFormatOrError.isError()) return forbidden(fileFormatOrError.value);
        fileFormatOrNull = fileFormatOrError.value;
      }

      const fileOrError = await this.uploadFile.execute({
        fileName: filename, size, originalFileName: originalname, url: `${this.uploadUrl}/${filename}`, fileFormatId: fileFormatOrNull.id,
      });
      if (fileOrError.isError()) return forbidden(fileOrError.value);

      const fileData = fileOrError.value;
      return created(fileData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
