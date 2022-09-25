import { StripHtmlAdapter } from '@/infra/strip-html';

type SutTypes = {
  sut: StripHtmlAdapter,
};

const makeSut = (): SutTypes => {
  const sut = new StripHtmlAdapter();
  return {
    sut,
  };
};

jest.mock('string-strip-html', () => ({
  stripHtml() {
    return {
      result: 'any_html',
    };
  },
}));

describe('StripHtmlAdapter Adapter', () => {
  it('Should return an slug on success', async () => {
    const { sut } = makeSut();
    const slug = await sut.strip('<p>any_html</p>');
    expect(slug).toBe('any_html');
  });
});
