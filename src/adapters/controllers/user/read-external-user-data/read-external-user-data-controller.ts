import { IHttpRequestAuthenticated, IHttpResponse } from '@/adapters/interfaces';
import { IController } from '@/adapters/controllers/interfaces';
import { ok, serverError } from '@/adapters/utils/http';

export class ReadExternalUserDataController implements IController {
  async handle({ user }: IHttpRequestAuthenticated): Promise<IHttpResponse> {
    try {
      const { data, credentials } = user;

      return ok({ user: data, credentials });
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
