import { IEmailOptions } from '@/use-cases/services/email-service/interfaces';

export interface IEmailService {
  send(emailOptions: IEmailOptions): Promise<null>
}
