import sanitizeHtml from 'sanitize-html';
import { ISanitizeHtml } from '@/use-cases/interfaces';

export class SanitizeHtmlAdapter implements ISanitizeHtml {
  async sanitize(html: string): Promise<string> {
    return sanitizeHtml(html);
  }
}
