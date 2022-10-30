import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { ReadAllAttachmentsFromPostUseCase } from '@/use-cases/post-has-attachment/read-all-attachments-from-post';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import {
  ok,
  serverError,
  badRequest,
  forbidden,
} from '@/adapters/utils/http';

export class ReadAllAttachmentsFromPostController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly readAllAttachmentsFromPost: ReadAllAttachmentsFromPostUseCase,
  ) { }

  async handle({ params, query }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { postId } = params;

      const attachmentOrError = await this.readAllAttachmentsFromPost
        .execute({ postId, attachmentDataQuery: query });
      if (attachmentOrError.isError()) return forbidden(attachmentOrError.value);

      const attachmentsData = attachmentOrError.value;
      return ok(attachmentsData);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
