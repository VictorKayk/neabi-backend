import { SlugGenerator } from '@/infra/slug-generator';

type SutTypes = {
  sut: SlugGenerator,
};

const makeSut = (): SutTypes => {
  const sut = new SlugGenerator();
  return {
    sut,
  };
};

describe('SlugGenerator Adapter', () => {
  it('Should return an slug on success', async () => {
    const { sut } = makeSut();
    const slug = await sut.generate('any_slug');
    expect(slug).toBe('any_slug');
  });
});
