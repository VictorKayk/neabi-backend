import {
  ISanitizeHtml, ISlugGenerator, IStripHtml, IUseCase,
} from '@/use-cases/interfaces';
import { IPostRepositoryReturnData, IPostEditableData, IPostRepository } from '@/use-cases/post/interfaces';
import { NonExistingPostError } from '@/use-cases/post/errors';
import { Post } from '@/entities/post';
import { InvalidTitleError, InvalidSlugError, InvalidDescriptionError } from '@/entities/value-object/errors';
import { Either, error, success } from '@/shared';

interface Request {
  id: string,
  postData: IPostEditableData
}

type Response = Either<
  NonExistingPostError |
  InvalidTitleError |
  InvalidSlugError |
  InvalidDescriptionError,
  IPostRepositoryReturnData
>;

export class UpdatePostByIdUseCase implements IUseCase {
  constructor(
    private readonly sanitizeHtml: ISanitizeHtml,
    private readonly stripHmtl: IStripHtml,
    private readonly slugGenerator: ISlugGenerator,
    private readonly postRepository: IPostRepository,
  ) { }

  async execute({ id, postData: { title, description } }: Request): Promise<Response> {
    let postOrNull = await this.postRepository.findById(id);
    if (!postOrNull || postOrNull.isDeleted) return error(new NonExistingPostError());

    let descriptionHtml;
    let descriptionPlainText;
    if (description) {
      descriptionHtml = await this.sanitizeHtml.sanitize(description);
      descriptionPlainText = await this.stripHmtl.strip(descriptionHtml);
    }

    let slug;
    if (title) {
      slug = await this.slugGenerator.generate(title);
      slug = slug.toLocaleLowerCase();
      postOrNull = await this.postRepository.findBySlug(slug);
      if (postOrNull) {
        slug = `${slug}-${Math.floor(Math.random() * (1000 - 1) + 1)}`;
        slug = slug.toLocaleLowerCase();
      }
    }

    const postOrError = Post.create({ title, slug, description: descriptionPlainText });
    if (postOrError.isError()) return error(postOrError.value);

    const postUpdated = await this.postRepository.updateById(id, {
      title, slug, description: descriptionPlainText, descriptionHtml,
    });
    return success(postUpdated);
  }
}
