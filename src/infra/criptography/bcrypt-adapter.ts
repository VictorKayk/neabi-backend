import bcrypt from 'bcrypt';
import { IHasher, IHashCompare } from '@/use-cases/user/interfaces';

export class BcryptAdapter implements IHasher, IHashCompare {
  constructor(private readonly salt: number) { }

  async hash(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt);
    return hash;
  }

  async compare(hash: string, value: string): Promise<boolean> {
    const compare = await bcrypt.compare(value, hash);
    return compare;
  }
}
