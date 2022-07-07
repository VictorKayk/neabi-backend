import { Either, success, error } from '@/shared';
import { InvalidEmailError } from '@/entities/errors/invalid-email-error';

export class Email {
  readonly value: string;

  private constructor(email: string) {
    this.value = email;
    Object.freeze(this);
  }

  public static isValid(email: string): boolean {
    if (!email) return false;
    return true;
  }

  public static create(email: string): Either<InvalidEmailError, Email> {
    if (this.isValid(email)) return success(new Email(email));
    return error(new InvalidEmailError(email));
  }
}
