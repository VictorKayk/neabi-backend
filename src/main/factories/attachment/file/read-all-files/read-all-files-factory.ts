import { ReadAllFilesUseCase } from '@/use-cases/attachment/file/read-all-files';
import { IController } from '@/adapters/controllers/interfaces';
import { FileRepository } from '@/infra/repositories';
import { ReadAllFilesController } from '@/adapters/controllers/attachment/file/read-all-files';

export function makeReadAllFilesController(): IController {
  const fileRepository = new FileRepository();
  const readAllFiesUseCase = new ReadAllFilesUseCase(fileRepository);
  const readAllFiesController = new ReadAllFilesController(readAllFiesUseCase);
  return readAllFiesController;
}
