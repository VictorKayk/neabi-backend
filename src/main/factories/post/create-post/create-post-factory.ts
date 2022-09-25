import { CreatePostUseCase } from '@/use-cases/post/create-post';
import { IController } from '@/adapters/controllers/interfaces';
import { UuidAdapter } from '@/infra/universally-unique-identifier';
import { PostRepository } from '@/infra/repositories';
import { makeCreatePostValidationFactory } from '@/main/factories/post';
import { CreatePostController } from '@/adapters/controllers/post/create-post';
import { SanitizeHtmlAdapter } from '@/infra/sanitize-html';
import { StripHtmlAdapter } from '@/infra/strip-html';
import { SlugGenerator } from '@/infra/slug-generator';

export function makeCreatePostController(): IController {
  const sanitizeHtml = new SanitizeHtmlAdapter();
  const stripHtml = new StripHtmlAdapter();
  const slugGenerator = new SlugGenerator();
  const postRepository = new PostRepository();
  const uuidAdapter = new UuidAdapter();
  const createPostUseCase = new CreatePostUseCase(
    sanitizeHtml, stripHtml, slugGenerator, postRepository, uuidAdapter,
  );
  const createPostController = new CreatePostController(
    makeCreatePostValidationFactory(), createPostUseCase,
  );
  return createPostController;
}
