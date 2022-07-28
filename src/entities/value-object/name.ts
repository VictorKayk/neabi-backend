import { Either, success, error } from '@/shared';
import { InvalidNameError } from '@/entities/errors';

const isEmpty = (str: string): boolean => !str;
const isTooShort = (str: string) => str.length < 4;

export class Name {
  readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  public static isValid(name: string): boolean {
    if (isEmpty(name)) return false;
    if (isTooShort(name)) return false;
    return true;
  }

  public static create(name: string): Either<InvalidNameError, Name> {
    if (this.isValid(name)) return success(new Name(name));
    return error(new InvalidNameError(name));
  }
}
