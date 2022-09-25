import { SanitizeHtmlAdapter } from '@/infra/sanitize-html';

type SutTypes = {
  sut: SanitizeHtmlAdapter,
};

const makeSut = (): SutTypes => {
  const sut = new SanitizeHtmlAdapter();
  return {
    sut,
  };
};

describe('SanitizeHtmlAdapter Adapter', () => {
  it('Should return an slug on success', async () => {
    const { sut } = makeSut();
    const slug = await sut.sanitize('<p>any_html</p>');
    expect(slug).toBe('<p>any_html</p>');
  });
});
