import { ReadFileByIdUseCase } from '@/use-cases/attachment/file/read-file-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { FileRepository } from '@/infra/repositories';
import { ReadFileByIdController } from '@/adapters/controllers/attachment/file/read-file-by-id';
import { makeReadFileByIdValidationFactory } from '@/main/factories/attachment/file';

export function makeReadFileByIdController(): IController {
  const fileRepository = new FileRepository();
  const readFileByIdUseCase = new ReadFileByIdUseCase(fileRepository);
  const readFileByIdController = new ReadFileByIdController(
    makeReadFileByIdValidationFactory(), readFileByIdUseCase,
  );
  return readFileByIdController;
}
