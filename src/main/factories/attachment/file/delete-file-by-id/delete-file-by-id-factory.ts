import { DeleteFileByIdUseCase } from '@/use-cases/attachment/file/delete-file-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { FileRepository } from '@/infra/repositories';
import { makeDeleteFileByIdValidationFactory } from '@/main/factories/attachment/file';
import { DeleteFileByIdController } from '@/adapters/controllers/attachment/file/delete-file-by-id';
import { DeleteFileService } from '@/use-cases/services/file-service/delete-file';
import env from '@/main/config/env';
import { FileService } from '@/infra/services/file-service';

export function makeDeleteFileByIdController(): IController {
  const fileRepository = new FileRepository();
  const deleteFileUseCase = new DeleteFileByIdUseCase(fileRepository);
  const fileService = new FileService(env.uploadFolder);
  const deleteFileService = new DeleteFileService(fileService);
  const deleteFileController = new DeleteFileByIdController(
    makeDeleteFileByIdValidationFactory(),
    deleteFileUseCase,
    deleteFileService,
  );
  return deleteFileController;
}
