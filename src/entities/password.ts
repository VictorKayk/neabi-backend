import { Either, success, error } from '@/shared';
import { InvalidPasswordError } from '@/entities/errors/invalid-password-error';

const isEmpty = (str: string): boolean => !str;
const noNumberIn = (str: string) => !(/\d/.test(str));
const isTooShort = (str: string) => str.length < 6;

export class Password {
  readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  public static isValid(password: string): boolean {
    if (isEmpty(password)) return false;
    if (noNumberIn(password)) return false;
    if (isTooShort(password)) return false;
    return true;
  }

  public static create(password: string): Either<InvalidPasswordError, Password> {
    if (this.isValid(password)) return success(new Password(password));
    return error(new InvalidPasswordError(password));
  }
}
