import jwt from 'jsonwebtoken';
import { IEncrypter, IDecrypter, IPayload } from '@/use-cases/user/interfaces';
import { Either, success, error } from '@/shared';
import { UnauthorizedError } from '@/use-cases/user/errors';

export class JwtAdapter implements IEncrypter, IDecrypter {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string,
  ) { }

  async encrypt(value: string): Promise<string> {
    return jwt.sign({
      id: value,
    }, this.secret, {
      expiresIn: this.expiresIn,
    });
  }

  async decrypt(value: string): Promise<Either<UnauthorizedError, IPayload>> {
    try {
      const payload = jwt.verify(value, this.secret) as IPayload;
      return success(payload);
    } catch (e) {
      return error(new UnauthorizedError());
    }
  }
}
