import { ReadExternalFileByIdUseCase } from '@/use-cases/attachment/external-file/read-external-file-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { ExternalFileRepository } from '@/infra/repositories';
import { ReadExternalFileByIdController } from '@/adapters/controllers/attachment/external-file/read-external-file-by-id';
import { makeReadExternalFileByIdValidationFactory } from '@/main/factories/attachment/external-file';

export function makeReadExternalFileByIdController(): IController {
  const externalFileRepository = new ExternalFileRepository();
  const readFileByIdUseCase = new ReadExternalFileByIdUseCase(externalFileRepository);
  const readFileByIdController = new ReadExternalFileByIdController(
    makeReadExternalFileByIdValidationFactory(), readFileByIdUseCase,
  );
  return readFileByIdController;
}
