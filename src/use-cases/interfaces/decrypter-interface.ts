import { Either } from '@/shared';
import { UnauthorizedError } from '@/use-cases/errors';
import { IPayload } from '@/use-cases/interfaces';

export interface IDecrypter {
  decrypt(value: string): Promise<Either<UnauthorizedError, IPayload>>
}
