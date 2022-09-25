import { ISlugGenerator } from '@/use-cases/interfaces';

export const makeSlugGenerator = (): ISlugGenerator => {
  class SlugGeneratorStub implements ISlugGenerator {
    async generate(value: string): Promise<string> {
      return 'any_slug';
    }
  }
  return new SlugGeneratorStub();
};
