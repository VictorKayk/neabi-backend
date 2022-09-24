import { ISanitizeHtml } from '@/use-cases/interfaces';

export const makeSanitizeHtml = (): ISanitizeHtml => {
  class SanitizeHtmlStub implements ISanitizeHtml {
    async sanitize(html: string): Promise<string> {
      return 'any_sanitized_html';
    }
  }
  return new SanitizeHtmlStub();
};
