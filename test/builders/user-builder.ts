import { IUserData } from '@/use-cases/interfaces';

export class UserBuilder {
  private user: IUserData = {
    id: '1',
    name: 'any_name',
    email: 'any_email@test.com',
    password: 'any_password1',
  }

  public emptyName() {
    this.user.name = '';
    return this;
  }

  public emptyEmail() {
    this.user.email = '';
    return this;
  }

  public emptyPassword() {
    this.user.password = '';
    return this;
  }

  public build(): IUserData {
    return this.user;
  }
}
