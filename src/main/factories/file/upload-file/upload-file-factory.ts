import { UploadFileUseCase } from '@/use-cases/file/upload-file';
import { IController } from '@/adapters/controllers/interfaces';
import { UuidAdapter } from '@/infra/universally-unique-identifier';
import { FileRepository } from '@/infra/repositories';
import { makeUploadFileValidationFactory } from '@/main/factories/file';
import { UploadFileController } from '@/adapters/controllers/file/upload-file';
import { CreateFileTypeUseCase } from '@/use-cases/file/create-file-type';
import { CreateFileFormatUseCase } from '@/use-cases/file/create-file-format';

export function makeUploadFileController(): IController {
  const fileRepository = new FileRepository();
  const uuidAdapter = new UuidAdapter();
  const uploadFileUseCase = new UploadFileUseCase(fileRepository, uuidAdapter);
  const createTypeUseCase = new CreateFileTypeUseCase(fileRepository, uuidAdapter);
  const createFormatUseCase = new CreateFileFormatUseCase(fileRepository, uuidAdapter);
  const uploadFileController = new UploadFileController(
    makeUploadFileValidationFactory(), uploadFileUseCase, createTypeUseCase, createFormatUseCase,
  );
  return uploadFileController;
}
