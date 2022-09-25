import striptags from 'striptags';
import { IStripHtml } from '@/use-cases/interfaces';

export class StripHtmlAdapter implements IStripHtml {
  async strip(html: string): Promise<string> {
    return striptags(html);
  }
}
