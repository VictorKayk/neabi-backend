import jwt from 'jsonwebtoken';
import { IEncrypter } from '@/use-cases/interfaces';

export class JwtAdapter implements IEncrypter {
  constructor(private readonly secret: string) { }

  async encrypt(value: string): Promise<string> {
    return jwt.sign({
      id: value,
    }, this.secret);
  }
}
