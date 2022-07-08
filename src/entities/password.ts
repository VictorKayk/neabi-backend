import { Either, success } from '@/shared';
import { InvalidPasswordError } from '@/entities/errors/invalid-password-error';

export class Password {
  readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  public static create(password: string): Either<InvalidPasswordError, Password> {
    return success(new Password(password));
  }
}
