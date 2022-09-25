import {
  IUseCase,
  ISanitizeHtml,
  IStripHtml,
  ISlugGenerator,
  IUniversallyUniqueIdentifierGenerator,
} from '@/use-cases/interfaces';
import { IPostRepositoryReturnData, IPostRepository } from '@/use-cases/post/interfaces';
import { Post } from '@/entities/post';
import { InvalidTitleError, InvalidSlugError, InvalidDescriptionError } from '@/entities/value-object/errors';
import { Either, error, success } from '@/shared';
import { ICreatePostData } from './interfaces';

type Response = Either<
    InvalidTitleError | InvalidSlugError | InvalidDescriptionError, IPostRepositoryReturnData
>;

export class CreatePostUseCase implements IUseCase {
  constructor(
    private readonly sanitizeHtml: ISanitizeHtml,
    private readonly stripHmtl: IStripHtml,
    private readonly slugGenerator: ISlugGenerator,
    private readonly postRepository: IPostRepository,
    private readonly idGenerator: IUniversallyUniqueIdentifierGenerator,
  ) { }

  async execute({ title, description }: ICreatePostData): Promise<Response> {
    const descriptionHtml = await this.sanitizeHtml.sanitize(description);
    const descriptionPlainText = await this.stripHmtl.strip(descriptionHtml);

    let slug = await this.slugGenerator.generate(title);
    slug = slug.toLocaleLowerCase();
    let postOrNull = await this.postRepository.findBySlug(slug);
    if (postOrNull) {
      slug = `${slug}-${Math.floor(Math.random() * (1000 - 1) + 1)}`;
      slug = slug.toLocaleLowerCase();
    }

    const postOrError = Post.create({ title, slug, description: descriptionPlainText });
    if (postOrError.isError()) return error(postOrError.value);

    let id: string;
    do {
      id = await this.idGenerator.generate();
      postOrNull = await this.postRepository.findById(id);
    } while (postOrNull);

    const postData = await this.postRepository
      .add({
        id, title, slug, description: descriptionPlainText, descriptionHtml,
      });

    return success(postData);
  }
}
