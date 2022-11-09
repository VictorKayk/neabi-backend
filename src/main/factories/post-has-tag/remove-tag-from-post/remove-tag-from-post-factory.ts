import { RemoveTagFromPostUseCase } from '@/use-cases/post-has-tag/remove-tag-from-post';
import { IController } from '@/adapters/controllers/interfaces';
import { PostHasTagRepository } from '@/infra/repositories';
import { makeRemoveTagFromPostValidationFactory } from '@/main/factories/post-has-tag';
import { RemoveTagFromPostController } from '@/adapters/controllers/post-has-tag/remove-tag-from-post';

export function makeRemoveTagFromPostController(): IController {
  const postHasTagRepository = new PostHasTagRepository();
  const removeTagFromPostUseCase = new RemoveTagFromPostUseCase(
    postHasTagRepository,
  );
  const removeTagFromPostController = new RemoveTagFromPostController(
    makeRemoveTagFromPostValidationFactory(), removeTagFromPostUseCase,
  );
  return removeTagFromPostController;
}
