import { User } from '@/entities';
import { InvalidNameError, InvalidEmailError, InvalidPasswordError } from '@/entities/errors';

describe('User Entity', () => {
  it('Should create an user on success', () => {
    const userOrError = User.create('any_name', 'any_email@test.com', 'any_password_1');
    expect(userOrError.isSuccess()).toBe(true);
    const user = userOrError.value as User;
    expect(user.name.value).toEqual('any_name');
    expect(user.email.value).toEqual('any_email@test.com');
    expect(user.password.value).toEqual('any_password_1');
  });

  it('Should create an user on success', () => {
    const user = User.create('', 'any_email@test.com', 'any_password_1');
    expect(user.isSuccess()).toBe(true);
    expect(user.value).toEqual(new InvalidNameError(''));
  });

  it('Should create an user on success', () => {
    const user = User.create('any_name', '', 'any_password_1');
    expect(user.isSuccess()).toBe(true);
    expect(user.value).toEqual(new InvalidEmailError(''));
  });

  it('Should create an user on success', () => {
    const user = User.create('any_name', 'any_email@test.com', '');
    expect(user.isSuccess()).toBe(true);
    expect(user.value).toEqual(new InvalidPasswordError(''));
  });
});
