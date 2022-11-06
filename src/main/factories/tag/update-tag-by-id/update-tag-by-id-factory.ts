import { UpdateTagByIdUseCase } from '@/use-cases/tag/update-tag-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { TagRepository } from '@/infra/repositories';
import { makeUpdateTagByIdValidationFactory } from '@/main/factories/tag';
import { UpdateTagByIdController } from '@/adapters/controllers/tag/update-tag-by-id';

export function makeUpdateTagByIdController(): IController {
  const tagRepository = new TagRepository();
  const updateTagByIdUseCase = new UpdateTagByIdUseCase(tagRepository);
  const updateTagByIdController = new UpdateTagByIdController(
    makeUpdateTagByIdValidationFactory(), updateTagByIdUseCase,
  );
  return updateTagByIdController;
}
