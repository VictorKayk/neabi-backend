import { ReadAllUserExternalFilesUseCase } from '@/use-cases/attachment/external-file/read-all-user-external-files';
import { IController } from '@/adapters/controllers/interfaces';
import { ExternalFileRepository } from '@/infra/repositories';
import { ReadAllUserExternalFilesController } from '@/adapters/controllers/attachment/external-file/read-all-user-external-files';
import { makeReadAllUserExternalFilesValidationFactory } from '@/main/factories/attachment/external-file/read-all-user-external-files';

export function makeReadAllUserExternalFilesController(): IController {
  const externalFileRepository = new ExternalFileRepository();
  const readAllUserExternalFilesUseCase = new ReadAllUserExternalFilesUseCase(
    externalFileRepository,
  );
  const readAllUserExternalFilesController = new ReadAllUserExternalFilesController(
    makeReadAllUserExternalFilesValidationFactory(),
    readAllUserExternalFilesUseCase,
  );
  return readAllUserExternalFilesController;
}
