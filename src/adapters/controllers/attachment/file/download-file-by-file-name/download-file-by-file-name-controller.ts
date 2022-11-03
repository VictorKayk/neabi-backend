import { IHttpRequestAuthenticated } from '@/adapters/interfaces';
import { IController, IValidation } from '@/adapters/controllers/interfaces';
import { serverError, badRequest } from '@/adapters/utils/http';

export class DownloadFileByFileNameController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly directoryPath: string,
  ) { }

  async handle({ download, params }: IHttpRequestAuthenticated): Promise<any> {
    try {
      const validationError = this.validation.validate(params);
      if (validationError) return badRequest(validationError);

      const { fileName } = params;

      return download(`${this.directoryPath}/${fileName}`, fileName, (err: any) => {
        if (err) {
          throw new Error(err);
        }
      });
    } catch (error) {
      return serverError(error as Error);
    }
  }
}
