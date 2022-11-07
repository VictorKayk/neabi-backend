import { IUseCase } from '@/use-cases/interfaces';
import { NonExistingPostError } from '@/use-cases/post/errors';
import { Either, error, success } from '@/shared';
import { NonExistingTagError } from '@/use-cases/tag/errors';
import { PostAlreadyHaveThisTagError } from '@/use-cases/post-has-tag/errors';
import { IPostHasTagData, IPostHasTagRepositoryReturnData, IPostHasTagRepository } from '@/use-cases/post-has-tag/interfaces';

type Response = Either<
  NonExistingPostError | NonExistingTagError | PostAlreadyHaveThisTagError,
  IPostHasTagRepositoryReturnData
>;

export class AddTagToPostUseCase implements IUseCase {
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
    if (postAlreadyHasThisTagOrNull) return error(new PostAlreadyHaveThisTagError());

    const postHasTagData = await this.postHasTagRepository
      .addTagToPost({ postId, tagId });
    return success(postHasTagData);
  }
}
