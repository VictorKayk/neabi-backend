import { IStripHtml } from '@/use-cases/interfaces';

export const makeStripHtml = (): IStripHtml => {
  class StripHtmlStub implements IStripHtml {
    async strip(html: string): Promise<string> {
      return 'any_striped_html';
    }
  }
  return new StripHtmlStub();
};
