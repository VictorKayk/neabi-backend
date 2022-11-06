import { ReadTagByIdUseCase } from '@/use-cases/tag/read-tag-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { TagRepository } from '@/infra/repositories';
import { ReadTagByIdController } from '@/adapters/controllers/tag/read-tag-by-id';
import { makeReadTagByIdValidationFactory } from '@/main/factories/tag';

export function makeReadTagByIdController(): IController {
  const tagRepository = new TagRepository();

  const readTagByIdUseCase = new ReadTagByIdUseCase(tagRepository);
  const readTagByIdController = new ReadTagByIdController(
    makeReadTagByIdValidationFactory(), readTagByIdUseCase,
  );
  return readTagByIdController;
}
