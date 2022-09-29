import { ReadPostBySlugUseCase } from '@/use-cases/post/read-post-by-slug';
import { IController } from '@/adapters/controllers/interfaces';
import { PostRepository } from '@/infra/repositories';
import { makeReadPostBySlugValidationFactory } from '@/main/factories/post';
import { ReadPostBySlugController } from '@/adapters/controllers/post/read-post-by-slug';

export function makeReadPostBySlugController(): IController {
  const postRepository = new PostRepository();
  const readPostUseCase = new ReadPostBySlugUseCase(postRepository);
  const readPostController = new ReadPostBySlugController(
    makeReadPostBySlugValidationFactory(), readPostUseCase,
  );
  return readPostController;
}
