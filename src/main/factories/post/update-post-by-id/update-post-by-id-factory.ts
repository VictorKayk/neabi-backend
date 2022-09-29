import { UpdatePostByIdUseCase } from '@/use-cases/post/update-post-by-id';
import { IController } from '@/adapters/controllers/interfaces';
import { PostRepository } from '@/infra/repositories';
import { makeUpdatePostByIdValidationFactory } from '@/main/factories/post/update-post-by-id';
import { UpdatePostByIdController } from '@/adapters/controllers/post/update-post-by-id';
import { SanitizeHtmlAdapter } from '@/infra/sanitize-html';
import { StripHtmlAdapter } from '@/infra/strip-html';
import { SlugGenerator } from '@/infra/slug-generator';

export function makeUpdatePostByIdController(): IController {
  const sanitizeHtml = new SanitizeHtmlAdapter();
  const stripHtml = new StripHtmlAdapter();
  const slugGenerator = new SlugGenerator();
  const postRepository = new PostRepository();
  const updatePostUseCase = new UpdatePostByIdUseCase(
    sanitizeHtml, stripHtml, slugGenerator, postRepository,
  );
  const updatePostController = new UpdatePostByIdController(
    makeUpdatePostByIdValidationFactory(), updatePostUseCase,
  );
  return updatePostController;
}
