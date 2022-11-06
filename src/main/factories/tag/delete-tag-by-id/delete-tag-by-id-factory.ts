import { DeleteTagByIdUseCase } from '@/use-cases/tag/delete-tag-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { TagRepository } from '@/infra/repositories';
import { DeleteTagByIdController } from '@/adapters/controllers/tag/delete-tag-by-id';
import { makeDeleteTagByIdValidationFactory } from '@/main/factories/tag';

export function makeDeleteTagByIdController(): IController {
  const tagRepository = new TagRepository();
  const deleteTagByIdUseCase = new DeleteTagByIdUseCase(tagRepository);
  const deleteTagByIdController = new DeleteTagByIdController(
    makeDeleteTagByIdValidationFactory(), deleteTagByIdUseCase,
  );
  return deleteTagByIdController;
}
