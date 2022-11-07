import { AddTagToPostUseCase } from '@/use-cases/post-has-tag/add-tag-to-post';
import { IController } from '@/adapters/controllers/interfaces';
import { PostHasTagRepository } from '@/infra/repositories';
import { makeAddTagToPostValidationFactory } from '@/main/factories/post-has-tag';
import { AddTagToPostController } from '@/adapters/controllers/post-has-tag/add-tag-to-post';

export function makeAddTagToPostController(): IController {
  const postHasTagRepository = new PostHasTagRepository();
  const addTagToPostUseCase = new AddTagToPostUseCase(postHasTagRepository);
  const addTagToPostController = new AddTagToPostController(
    makeAddTagToPostValidationFactory(), addTagToPostUseCase,
  );
  return addTagToPostController;
}
