import { DeletePostByIdUseCase } from '@/use-cases/post/delete-post-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { PostRepository } from '@/infra/repositories';
import { makeDeletePostByIdValidationFactory } from '@/main/factories/post/delete-post-by-id';
import { DeletePostByIdController } from '@/adapters/controllers/post/delete-post-by-id';

export function makeDeletePostByIdController(): IController {
  const postRepository = new PostRepository();
  const readPostUseCase = new DeletePostByIdUseCase(postRepository);
  const readPostController = new DeletePostByIdController(
    makeDeletePostByIdValidationFactory(), readPostUseCase,
  );
  return readPostController;
}
