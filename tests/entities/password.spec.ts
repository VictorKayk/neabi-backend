import { Password } from '@/entities/password';

describe('Password Entity', () => {
  it('Should create a password on success', () => {
    const password = Password.create('any_password');
    expect(password.isSuccess()).toBe(true);
    expect(password.value).toEqual({ value: 'any_password' });
  });
});
