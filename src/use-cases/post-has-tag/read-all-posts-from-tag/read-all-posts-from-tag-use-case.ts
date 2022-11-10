import { IUseCase } from '@/use-cases/interfaces';
import { NonExistingTagError } from '@/use-cases/tag/errors';
import { IPostHasTagRepository } from '@/use-cases/post-has-tag/interfaces';
import { Either, error, success } from '@/shared';
import { IPostDataQuery, IPostRepositoryReturnData } from '@/use-cases/post/interfaces';

type Response = Either<NonExistingTagError, IPostRepositoryReturnData[] | []>;

interface Request {
  tagId: string,
  postDataQuery: IPostDataQuery
}

export class ReadAllPostsFromTagUseCase implements IUseCase {
  constructor(
    private readonly postHasTagRepository: IPostHasTagRepository,
  ) { }

  async execute({ tagId, postDataQuery }: Request): Promise<Response> {
    const tagOrNull = await this.postHasTagRepository.findTagById(tagId);
    if (!tagOrNull) return error(new NonExistingTagError());

    const postHasPosts = await this.postHasTagRepository
      .readAllPostsFromTag(tagId, postDataQuery);
    return success(postHasPosts);
  }
}
