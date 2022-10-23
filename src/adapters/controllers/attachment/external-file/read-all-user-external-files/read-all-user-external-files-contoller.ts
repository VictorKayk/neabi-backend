/* eslint-disable camelcase */
import { IHttpResponse, IHttpRequestAuthenticated } from '@/adapters/interfaces';
import { ReadAllUserExternalFilesUseCase } from '@/use-cases/attachment/external-file/read-all-user-external-files';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import { serverError, ok, badRequest } from '@/adapters/utils/http';
import { IExternalUserCredentials } from '@/use-cases/attachment/external-file/interfaces';

export class ReadAllUserExternalFilesController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly readAllUserExternalFiles: ReadAllUserExternalFilesUseCase,
  ) { }

  async handle({ body }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const validationError = this.validation.validate(body);
      if (validationError) return badRequest(validationError);

      const {
        access_token, expires_in, id_token, scope, token_type, refresh_token,
      }: IExternalUserCredentials = body;

      const externalFiles = await this.readAllUserExternalFiles.execute({
        access_token, expires_in, id_token, scope, token_type, refresh_token,
      });
      return ok(externalFiles);
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
