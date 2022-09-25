import { Either, success, error } from '@/shared';
import { InvalidSlugError } from '@/entities/value-object/errors';

const isEmpty = (str: string): boolean => !str;
const isTooShort = (str: string) => str.length < 3;

export class Slug {
  readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  public static isValid(slug: string): boolean {
    if (isEmpty(slug)) return false;
    if (isTooShort(slug)) return false;
    return true;
  }

  public static create(slug: string): Either<InvalidSlugError, Slug> {
    if (this.isValid(slug)) return success(new Slug(slug));
    return error(new InvalidSlugError(slug));
  }
}
