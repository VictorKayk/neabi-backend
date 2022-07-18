import { Either, error, success } from '@/shared';
import { Name, Email, Password } from '@/entities';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/errors';
import { IUserCreate } from '@/entities/interfaces';

export class User {
  readonly name?: Name;

  readonly email: Email;

  readonly password: Password;

  private constructor(email: Email, password: Password, name?: Name) {
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

    const emailOrError = Email.create(email);
    if (emailOrError.isError()) return error(new InvalidEmailError(email));

    const passwordOrError = Password.create(password);
    if (passwordOrError.isError()) return error(new InvalidPasswordError(password));

    const emailObj = emailOrError.value;
    const passwordObj = passwordOrError.value;
    const nameObj = nameOrError?.value;
    return success(new User(emailObj, passwordObj, nameObj));
  }
}
