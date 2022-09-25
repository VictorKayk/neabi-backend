import { stripHtml } from 'string-strip-html';
import { IStripHtml } from '@/use-cases/interfaces';

export class StripHtmlAdapter implements IStripHtml {
  async strip(html: string): Promise<string> {
    return stripHtml(html).result;
  }
}
