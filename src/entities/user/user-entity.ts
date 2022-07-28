import { Either, error, success } from '@/shared';
import { Name, Email, Password } from '@/entities/value-object';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/value-object/errors';
import { IUserCreate } from '@/entities/user/interfaces';

export class User {
  readonly name?: Name;

  readonly email?: Email;

  readonly password?: Password;

  private constructor(email?: Email, password?: Password, name?: Name) {
    this.email = email;
    this.password = password;
    this.name = name;
    Object.freeze(this);
  }

  public static create({ name, email, password }: IUserCreate):
    Either<InvalidNameError | InvalidEmailError | InvalidPasswordError, User> {
    let nameOrError;
    if (name !== undefined) {
      nameOrError = Name.create(name);
      if (nameOrError.isError()) return error(new InvalidNameError(name));
    }

    let emailOrError;
    if (email !== undefined) {
      emailOrError = Email.create(email);
      if (emailOrError.isError()) return error(new InvalidEmailError(email));
    }

    let passwordOrError;
    if (password !== undefined) {
      passwordOrError = Password.create(password);
      if (passwordOrError.isError()) return error(new InvalidPasswordError(password));
    }

    const emailObj = emailOrError?.value;
    const passwordObj = passwordOrError?.value;
    const nameObj = nameOrError?.value;
    return success(new User(emailObj, passwordObj, nameObj));
  }
}
