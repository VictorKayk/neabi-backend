import { DeleteExternalFileByIdUseCase } from '@/use-cases/attachment/external-file/delete-external-file-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { ExternalFileRepository } from '@/infra/repositories';
import { makeDeleteExternalFileByIdValidationFactory } from '@/main/factories/attachment/external-file';
import { DeleteExternalFileByIdController } from '@/adapters/controllers/attachment/external-file/delete-external-file-by-id';

export function makeDeleteExternalFileByIdController(): IController {
  const externalFileRepository = new ExternalFileRepository();
  const deleteExternalFileUseCase = new DeleteExternalFileByIdUseCase(externalFileRepository);
  const deleteExternalFileController = new DeleteExternalFileByIdController(
    makeDeleteExternalFileByIdValidationFactory(),
    deleteExternalFileUseCase,
  );
  return deleteExternalFileController;
}
