import { IEmailOptions, IEmailService } from '@/use-cases/interfaces';

export const makeEmailService = (): IEmailService => {
  class EmailServiceStub implements IEmailService {
    async send(emailOptions: IEmailOptions): Promise<null> {
      return null;
    }
  }
  return new EmailServiceStub();
};
