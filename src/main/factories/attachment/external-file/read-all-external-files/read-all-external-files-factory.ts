import { ReadAllExternalFilesUseCase } from '@/use-cases/attachment/external-file/read-all-external-files';
import { IController } from '@/adapters/controllers/interfaces';
import { ExternalFileRepository } from '@/infra/repositories';
import { ReadAllExternalFilesController } from '@/adapters/controllers/attachment/external-file/read-all-external-file';

export function makeReadAllExternalFilesController(): IController {
  const externalFileRepository = new ExternalFileRepository();
  const readAllExternalFilesUseCase = new ReadAllExternalFilesUseCase(externalFileRepository);
  const readAllExternalFilesController = new ReadAllExternalFilesController(
    readAllExternalFilesUseCase,
  );
  return readAllExternalFilesController;
}
