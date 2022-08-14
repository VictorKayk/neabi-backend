import { IEmailOptions } from '@/use-cases/interfaces';

export interface IEmailService {
  send(emailOptions: IEmailOptions): Promise<null>
}
