import { IUseCase } from '@/use-cases/interfaces';
import { NonExistingPostError } from '@/use-cases/post/errors';
import { NonExistingAttachmentError } from '@/use-cases/attachment/errors';
import { PostDoesNotHaveThisAttachmentError } from '@/use-cases/post-has-attachment/errors';
import { IPostHasAttachmentData, IPostHasAttachmentRepositoryReturnData, IPostHasAttachmentRepository } from '@/use-cases/post-has-attachment/interfaces';
import { Either, error, success } from '@/shared';

type Response = Either<
  NonExistingPostError | NonExistingAttachmentError | PostDoesNotHaveThisAttachmentError,
  IPostHasAttachmentRepositoryReturnData
>;

export class RemoveAttachmentFromPostUseCase implements IUseCase {
  constructor(
    private readonly postHasAttachmentRepository: IPostHasAttachmentRepository,
  ) { }

  async execute({ postId, attachmentId }: IPostHasAttachmentData): Promise<Response> {
    const postOrNull = await this.postHasAttachmentRepository.findPostById(postId);
    if (!postOrNull) return error(new NonExistingPostError());

    const attachmentOrNull = await this.postHasAttachmentRepository
      .findAttachmentById(attachmentId);
    if (!attachmentOrNull) return error(new NonExistingAttachmentError());

    const postAlreadyHasThisAttachmentOrNull = await this.postHasAttachmentRepository
      .findPostHasAttachment({ postId, attachmentId });
    if (!postAlreadyHasThisAttachmentOrNull) {
      return error(new PostDoesNotHaveThisAttachmentError());
    }

    const postHasAttachmentData = await this.postHasAttachmentRepository
      .removeAttachmentFromPost({ postId, attachmentId });
    return success(postHasAttachmentData);
  }
}
