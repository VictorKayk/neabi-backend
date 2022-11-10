import { IController } from '@/adapters/controllers/interfaces';
import { PostHasTagRepository } from '@/infra/repositories';
import { makeReadAllPostsFromTagValidationFactory } from '@/main/factories/post-has-tag';
import { ReadAllPostsFromTagUseCase } from '@/use-cases/post-has-tag/read-all-posts-from-tag';
import { ReadAllPostsFromTagController } from '@/adapters/controllers/post-has-tag/read-all-posts-from-tag';

export function makeReadAllPostsFromTagController(): IController {
  const postHasTagRepository = new PostHasTagRepository();
  const readAllPostsFromTagUseCase = new ReadAllPostsFromTagUseCase(
    postHasTagRepository,
  );
  const readAllPostsFromTagController = new ReadAllPostsFromTagController(
    makeReadAllPostsFromTagValidationFactory(), readAllPostsFromTagUseCase,
  );
  return readAllPostsFromTagController;
}
