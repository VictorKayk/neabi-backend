import { v4 as uuid } from 'uuid';
import { IIdGenerator } from '@/use-cases/interfaces';

export class UuidAdapter implements IIdGenerator {
  async generate(): Promise<string> {
    return uuid();
  }
}
