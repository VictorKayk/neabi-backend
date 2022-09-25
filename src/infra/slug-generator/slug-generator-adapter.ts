import slugify from 'slugify';
import { ISlugGenerator } from '@/use-cases/interfaces';

export class SlugGenerator implements ISlugGenerator {
  async generate(value: string): Promise<string> {
    return slugify(value);
  }
}
