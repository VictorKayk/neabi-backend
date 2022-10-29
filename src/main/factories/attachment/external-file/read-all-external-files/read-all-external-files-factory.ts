import { ReadAllExternalFilesUseCase } from '@/use-cases/attachment/external-file/read-all-external-files';
import { IController } from '@/adapters/controllers/interfaces';
import { ExternalFileRepository } from '@/infra/repositories';
import { ReadAllExternalFilesController } from '@/adapters/controllers/attachment/external-file/read-all-external-files';

export function makeReadAllExternalFilesController(): IController {
  const externalFileRepository = new ExternalFileRepository();
  const readAllFiesUseCase = new ReadAllExternalFilesUseCase(externalFileRepository);
  const readAllFiesController = new ReadAllExternalFilesController(readAllFiesUseCase);
  return readAllFiesController;
}
