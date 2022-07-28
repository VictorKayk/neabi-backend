import { Either } from '@/shared';
import { UnauthorizedError } from '@/use-cases/user/errors';
import { IPayload } from '@/use-cases/user/interfaces';

export interface IDecrypter {
  decrypt(value: string): Promise<Either<UnauthorizedError, IPayload>>
}
