import { IUseCase } from '@/use-cases/interfaces';
import { NonExistingPostError } from '@/use-cases/post/errors';
import { IPostHasAttachmentRepository } from '@/use-cases/post-has-attachment/interfaces';
import { Either, error, success } from '@/shared';
import { IAttachmentDataQuery } from '@/use-cases/attachment/interfaces';
import { IUrlRepositoryReturnData } from '@/use-cases/attachment/url/interfaces';
import { IFileFormatRepositoryReturnData } from '@/use-cases/attachment/file/interfaces';
import { IExternalFileRepositoryReturnData } from '@/use-cases/attachment/external-file/interfaces';

type Response = Either<NonExistingPostError, {
  url: IUrlRepositoryReturnData[] | [],
  file: IFileFormatRepositoryReturnData[] | [],
  externalFile: IExternalFileRepositoryReturnData[] | [],
}>;

interface Request {
  postId: string,
  attachmentDataQuery: IAttachmentDataQuery
}

export class ReadAllAttachmentsFromPostUseCase implements IUseCase {
  constructor(
    private readonly postHasAttachmentRepository: IPostHasAttachmentRepository,
  ) { }

  async execute({ postId, attachmentDataQuery }: Request): Promise<Response> {
    const postOrNull = await this.postHasAttachmentRepository.findPostById(postId);
    if (!postOrNull) return error(new NonExistingPostError());

    const postHasAttachments = await this.postHasAttachmentRepository
      .readAllAttachmentsFromPost(postId, attachmentDataQuery);
    return success(postHasAttachments);
  }
}
