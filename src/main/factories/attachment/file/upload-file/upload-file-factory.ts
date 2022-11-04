import { CreateFileUseCase } from '@/use-cases/attachment/file/create-file';
import { IController } from '@/adapters/controllers/interfaces';
import { UuidAdapter } from '@/infra/universally-unique-identifier';
import { FileRepository } from '@/infra/repositories';
import { makeUploadFileValidationFactory } from '@/main/factories/attachment/file';
import { UploadFileController } from '@/adapters/controllers/attachment/file/upload-file';
import { CreateFileTypeUseCase } from '@/use-cases/attachment/file/create-file-type';
import { CreateFileFormatUseCase } from '@/use-cases/attachment/file/create-file-format';
import env from '@/main/config/env';

export function makeUploadFileController(): IController {
  const fileRepository = new FileRepository();
  const uuidAdapter = new UuidAdapter();
  const createFileUseCase = new CreateFileUseCase(fileRepository, uuidAdapter);
  const createTypeUseCase = new CreateFileTypeUseCase(fileRepository, uuidAdapter);
  const createFormatUseCase = new CreateFileFormatUseCase(fileRepository, uuidAdapter);
  const uploadFileController = new UploadFileController(
    makeUploadFileValidationFactory(),
    fileRepository,
    createFileUseCase,
    createTypeUseCase,
    createFormatUseCase,
    env.uploadUrl,
    env.downloadUrl,
  );
  return uploadFileController;
}
