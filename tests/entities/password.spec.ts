import { Password } from '@/entities/password';
import { InvalidPasswordError } from '@/entities/errors/invalid-password-error';

describe('Password Entity', () => {
  it('Should create a password on success', () => {
    const password = Password.create('any_password_1');
    expect(password.isSuccess()).toBe(true);
    expect(password.value).toEqual({ value: 'any_password_1' });
  });

  it('Should return an error if password is empty', () => {
    const password = Password.create('');
    expect(password.isError()).toBe(true);
    expect(password.value).toEqual(new InvalidPasswordError(''));
  });

  it('Should return an error if password has no number', () => {
    const password = Password.create('any_password');
    expect(password.isError()).toBe(true);
    expect(password.value).toEqual(new InvalidPasswordError('any_password'));
  });

  it('Should return an error if password is too short', () => {
    const password = Password.create('pass');
    expect(password.isError()).toBe(true);
    expect(password.value).toEqual(new InvalidPasswordError('pass'));
  });
});
