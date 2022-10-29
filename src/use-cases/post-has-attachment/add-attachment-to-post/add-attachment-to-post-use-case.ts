import { IUseCase } from '@/use-cases/interfaces';
import { NonExistingPostError } from '@/use-cases/post/errors';
import { Either, error, success } from '@/shared';
import { NonExistingAttachmentError } from '@/use-cases/attachment/errors';
import { PostAlreadyHaveThisAttachmentError } from '@/use-cases/post-has-attachment/errors';
import { IPostHasAttachmentData, IPostHasAttachmentRepositoryReturnData, IPostHasAttachmentRepository } from '@/use-cases/post-has-attachment/interfaces';

type Response = Either<
  NonExistingPostError | NonExistingAttachmentError | PostAlreadyHaveThisAttachmentError,
  IPostHasAttachmentRepositoryReturnData
>;

export class AddAttachmentToPostUseCase implements IUseCase {
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

    if (postAlreadyHasThisAttachmentOrNull) return error(new PostAlreadyHaveThisAttachmentError());

    const postHasAttachmentData = await this.postHasAttachmentRepository
      .addAttachmentToPost({ postId, attachmentId });
    return success(postHasAttachmentData);
  }
}
