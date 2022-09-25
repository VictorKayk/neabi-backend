import { Either, success, error } from '@/shared';
import { InvalidTitleError } from '@/entities/value-object/errors';

const isEmpty = (str: string): boolean => !str;
const isTooShort = (str: string) => str.length < 3;

export class Title {
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

  public static create(title: string): Either<InvalidTitleError, Title> {
    if (this.isValid(title)) return success(new Title(title));
    return error(new InvalidTitleError(title));
  }
}
