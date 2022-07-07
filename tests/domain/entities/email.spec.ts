import { Email } from '@/entities/email';

describe('Email', () => {
  it('Should create if email is valid', () => {
    const email = Email.create('valid_email@test.com');
    expect(email.isSuccess()).toBe(true);
    expect(email.value).toEqual({ value: 'valid_email@test.com' });
  });
});
