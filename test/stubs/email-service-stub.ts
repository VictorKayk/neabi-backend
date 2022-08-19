import { IEmailOptions, IEmailService } from '@/use-cases/services/email-service/interfaces';
import { SendEmailService } from '@/use-cases/services/email-service/send-email';

export const makeEmailService = (): IEmailService => {
  class EmailServiceStub implements IEmailService {
    async send(emailOptions: IEmailOptions): Promise<null> {
      return null;
    }
  }
  return new EmailServiceStub();
};

export const makeSendEmailService = (): SendEmailService => {
  const sendEmailService = new SendEmailService(
    makeEmailService(),
  );
  return sendEmailService;
};
