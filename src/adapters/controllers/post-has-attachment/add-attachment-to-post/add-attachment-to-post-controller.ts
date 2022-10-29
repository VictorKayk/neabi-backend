import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { AddAttachmentToPostUseCase } from '@/use-cases/post-has-attachment/add-attachment-to-post';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  created,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';

export class AddAttachmentToPostController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly addAttachmentToPost: AddAttachmentToPostUseCase,
  ) { }

  async handle({ params }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { postId, attachmentId } = params;

      const postHasAttachmentOrError = await this.addAttachmentToPost
        .execute({ postId, attachmentId });
      if (postHasAttachmentOrError.isError()) return forbidden(postHasAttachmentOrError.value);

      const postHasAttachmentData = postHasAttachmentOrError.value;
      return created(postHasAttachmentData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
