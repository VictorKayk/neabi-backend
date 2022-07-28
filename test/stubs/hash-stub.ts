import { IHasher, IHashCompare } from '@/use-cases/user/interfaces';

export const makeHasher = (): IHasher => {
  class HasherStub implements IHasher {
    async hash(value: string): Promise<string> {
      return 'any_hash';
    }
  }
  return new HasherStub();
};

export const makeHashCompare = (): IHashCompare => {
  class HashCompareStub implements IHashCompare {
    async compare(hash: string, value: string): Promise<boolean> {
      return true;
    }
  }
  return new HashCompareStub();
};
