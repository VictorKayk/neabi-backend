import { IUseCase } from '@/use-cases/interfaces';
import { IPostRepositoryReturnData, IPostRepository } from '@/use-cases/post/interfaces';
import { Either, error, success } from '@/shared';
import { NonExistingPostError } from '@/use-cases/post/errors';

type Response = Either<NonExistingPostError, IPostRepositoryReturnData>;

export class ReadPostBySlugUseCase implements IUseCase {
  constructor(
    private readonly postRepository: IPostRepository,
  ) { }

  async execute(slug: string): Promise<Response> {
    const postOrNull = await this.postRepository.findBySlug(slug);
    if (!postOrNull) return error(new NonExistingPostError());
    return success(postOrNull);
  }
}
