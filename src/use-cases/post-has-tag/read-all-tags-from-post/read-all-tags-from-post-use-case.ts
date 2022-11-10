import { IUseCase } from '@/use-cases/interfaces';
import { NonExistingPostError } from '@/use-cases/post/errors';
import { IPostHasTagRepository } from '@/use-cases/post-has-tag/interfaces';
import { Either, error, success } from '@/shared';
import { ITagDataQuery, ITagRepositoryReturnData } from '@/use-cases/tag/interfaces';

type Response = Either<NonExistingPostError, ITagRepositoryReturnData[] | []>;

interface Request {
  postId: string,
  tagDataQuery: ITagDataQuery
}

export class ReadAllTagsFromPostUseCase implements IUseCase {
  constructor(
    private readonly postHasTagRepository: IPostHasTagRepository,
  ) { }

  async execute({ postId, tagDataQuery }: Request): Promise<Response> {
    const postOrNull = await this.postHasTagRepository.findPostById(postId);
    if (!postOrNull) return error(new NonExistingPostError());

    const postHasTags = await this.postHasTagRepository
      .readAllTagsFromPost(postId, tagDataQuery);
    return success(postHasTags);
  }
}
