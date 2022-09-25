import { CreatePostUseCase } from '@/use-cases/post/create-post';
import {
  makeUniversallyUniqueIdentifierGenerator,
  makePostRepository,
  makeSanitizeHtml,
  makeStripHtml,
  makeSlugGenerator,
} from '@/test/stubs';

export const makeCreatePostUseCase = (): CreatePostUseCase => {
  const sanitizeHtml = makeSanitizeHtml();
  const stripHtml = makeStripHtml();
  const slugGenerator = makeSlugGenerator();
  const postRepository = makePostRepository();
  const idGenerator = makeUniversallyUniqueIdentifierGenerator();
  return new CreatePostUseCase(
    sanitizeHtml, stripHtml, slugGenerator, postRepository, idGenerator,
  );
};
