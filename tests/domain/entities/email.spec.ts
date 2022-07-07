import { Email } from '@/entities/email';
import { InvalidEmailError } from '@/entities/errors/invalid-email-error';

describe('Email', () => {
  it('Should create if email is valid', () => {
    const email = Email.create('valid_email@test.com');
    expect(email.isSuccess()).toBe(true);
    expect(email.value).toEqual({ value: 'valid_email@test.com' });
  });

  it('Should return an error if email is empty', () => {
    const error = Email.create('');
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(''));
  });
});
