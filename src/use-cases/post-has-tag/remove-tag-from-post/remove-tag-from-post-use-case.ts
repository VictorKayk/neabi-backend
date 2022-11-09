import { IUseCase } from '@/use-cases/interfaces';
import { NonExistingPostError } from '@/use-cases/post/errors';
import { NonExistingTagError } from '@/use-cases/tag/errors';
import { PostDoesNotHaveThisTagError } from '@/use-cases/post-has-tag/errors';
import { IPostHasTagData, IPostHasTagRepositoryReturnData, IPostHasTagRepository } from '@/use-cases/post-has-tag/interfaces';
import { Either, error, success } from '@/shared';

type Response = Either<
  NonExistingPostError | NonExistingTagError | PostDoesNotHaveThisTagError,
  IPostHasTagRepositoryReturnData
>;

export class RemoveTagFromPostUseCase implements IUseCase {
  constructor(
    private readonly postHasTagRepository: IPostHasTagRepository,
  ) { }

  async execute({ postId, tagId }: IPostHasTagData): Promise<Response> {
    const postOrNull = await this.postHasTagRepository.findPostById(postId);
    if (!postOrNull) return error(new NonExistingPostError());

    const tagOrNull = await this.postHasTagRepository
      .findTagById(tagId);
    if (!tagOrNull) return error(new NonExistingTagError());

    const postAlreadyHasThisTagOrNull = await this.postHasTagRepository
      .findPostHasTag({ postId, tagId });
    if (!postAlreadyHasThisTagOrNull || postAlreadyHasThisTagOrNull.isDeleted) {
      return error(new PostDoesNotHaveThisTagError());
    }

    const postHasTagData = await this.postHasTagRepository
      .removeTagFromPost({ postId, tagId });
    return success(postHasTagData);
  }
}
