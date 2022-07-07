import { Either, success, error } from '@/shared';
import { InvalidEmailError } from '@/entities/errors/invalid-email-error';
import { isValid } from '@/entities/email-validation';

export class Email {
  readonly value: string;

  private constructor(email: string) {
    this.value = email;
    Object.freeze(this);
  }

  public static create(email: string): Either<InvalidEmailError, Email> {
    if (isValid(email)) return success(new Email(email));
    return error(new InvalidEmailError(email));
  }
}
