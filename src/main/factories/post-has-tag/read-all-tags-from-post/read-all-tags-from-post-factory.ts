import { IController } from '@/adapters/controllers/interfaces';
import { PostHasTagRepository } from '@/infra/repositories';
import { makeReadAllTagsFromPostValidationFactory } from '@/main/factories/post-has-tag';
import { ReadAllTagsFromPostUseCase } from '@/use-cases/post-has-tag/read-all-tags-from-post';
import { ReadAllTagsFromPostController } from '@/adapters/controllers/post-has-tag/read-all-tags-from-post';

export function makeReadAllTagsFromPostController(): IController {
  const postHasTagRepository = new PostHasTagRepository();
  const readAllTagsFromPostUseCase = new ReadAllTagsFromPostUseCase(
    postHasTagRepository,
  );
  const readAllTagsFromPostController = new ReadAllTagsFromPostController(
    makeReadAllTagsFromPostValidationFactory(), readAllTagsFromPostUseCase,
  );
  return readAllTagsFromPostController;
}
