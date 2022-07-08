import { Either, error, success } from '@/shared';
import { Name, Email, Password } from '@/entities';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/errors';

export class User {
  readonly name: Name;

  readonly email: Email;

  readonly password: Password;

  private constructor(name: Name, email: Email, password: Password) {
    this.name = name;
    this.email = email;
    this.password = password;
    Object.freeze(this);
  }

  public static create(name: string, email: string, password: string):
    Either<InvalidNameError | InvalidEmailError | InvalidPasswordError, User> {
    const nameOrError = Name.create(name);
    if (nameOrError.isError()) return error(new InvalidNameError(name));

    const emailOrError = Email.create(email);
    if (emailOrError.isError()) return error(new InvalidEmailError(email));

    const passwordOrError = Password.create(password);
    if (passwordOrError.isError()) return error(new InvalidPasswordError(password));

    const nameObj = nameOrError.value;
    const emailObj = emailOrError.value;
    const passwordObj = passwordOrError.value;
    return success(new User(nameObj, emailObj, passwordObj));
  }
}
