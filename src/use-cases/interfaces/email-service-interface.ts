import { IEmailOptions } from '@/use-cases/email-service/interfaces';

export interface IEmailService {
  send(emailOptions: IEmailOptions): Promise<null>
}
