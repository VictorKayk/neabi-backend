import { v4 as uuid } from 'uuid';
import { IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';

export class UuidAdapter implements IUniversallyUniqueIdentifierGenerator {
  async generate(): Promise<string> {
    return uuid();
  }
}
