import { IUserRepositoryData } from '@/use-cases/interfaces';

export class UserBuilder {
  private user: IUserRepositoryData = {
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@test.com',
    password: 'any_password1',
    accessToken: 'any_encrypted_string',
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

  public build(): IUserRepositoryData {
    return this.user;
  }
}
