import { ReadAllPostsUseCase } from '@/use-cases/post/read-all-posts';
import { IController } from '@/adapters/controllers/interfaces';
import { PostRepository } from '@/infra/repositories';
import { ReadAllPostsController } from '@/adapters/controllers/post/read-all-posts';

export function makeReadAllPostsController(): IController {
  const postRepository = new PostRepository();
  const readPostUseCase = new ReadAllPostsUseCase(postRepository);
  const readPostController = new ReadAllPostsController(readPostUseCase);
  return readPostController;
}
