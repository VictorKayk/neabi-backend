import { Either, success } from '@/shared';
import { UnauthorizedError } from '@/use-cases/errors';
import { IEncrypter, IDecrypter, IPayload } from '@/use-cases/interfaces';

export const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return 'any_encrypted_string';
    }
  }
  return new EncrypterStub();
};

export const makeDecrypter = (): IDecrypter => {
  class DecrypterStub implements IDecrypter {
    async decrypt(value: string): Promise<Either<UnauthorizedError, IPayload>> {
      return success({
        id: 'any_id',
      });
    }
  }
  return new DecrypterStub();
};
