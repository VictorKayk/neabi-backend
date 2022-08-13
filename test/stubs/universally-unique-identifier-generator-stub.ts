import { IUniversallyUniqueIdentifierGenerator } from '@/use-cases/interfaces';

export const makeUniversallyUniqueIdentifierGenerator = ():
  IUniversallyUniqueIdentifierGenerator => {
  class IdGeneratorStub implements IUniversallyUniqueIdentifierGenerator {
    async generate(): Promise<string> {
      return 'any_uuid';
    }
  }
  return new IdGeneratorStub();
};
