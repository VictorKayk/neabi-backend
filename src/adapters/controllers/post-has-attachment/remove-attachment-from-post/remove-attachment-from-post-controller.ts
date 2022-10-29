import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { RemoveAttachmentFromPostUseCase } from '@/use-cases/post-has-attachment/remove-attachment-from-post';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';

export class RemoveAttachmentFromPostController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly removeAttachmentFromPost: RemoveAttachmentFromPostUseCase,
  ) { }

  async handle({ params }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { postId, attachmentId } = params;

      const attachmentOrError = await this.removeAttachmentFromPost
        .execute({ postId, attachmentId });
      if (attachmentOrError.isError()) return forbidden(attachmentOrError.value);

      const postHasAttachmentData = attachmentOrError.value;
      return ok(postHasAttachmentData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
