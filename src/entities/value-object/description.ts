import { Either, success, error } from '@/shared';
import { InvalidDescriptionError } from '@/entities/value-object/errors';

const isEmpty = (str: string): boolean => !str;
const isTooShort = (str: string) => str.length < 3;

export class Description {
  readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  public static isValid(title: string): boolean {
    if (isEmpty(title)) return false;
    if (isTooShort(title)) return false;
    return true;
  }

  public static create(title: string): Either<InvalidDescriptionError, Description> {
    if (this.isValid(title)) return success(new Description(title));
    return error(new InvalidDescriptionError(title));
  }
}
