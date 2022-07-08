import { Email } from '@/entities/email';
import { InvalidEmailError } from '@/entities/errors/invalid-email-error';

describe('Email', () => {
  it('Should create an email on success', () => {
    const email = Email.create('valid_email@it.com');
    expect(email.isSuccess()).toBe(true);
    expect(email.value).toEqual({ value: 'valid_email@it.com' });
  });

  it('Should return an error if email is empty', () => {
    const error = Email.create('');
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(''));
  });

  it('Should return an error if email is larger than 320 chars', () => {
    const email = `${'invalid'.repeat(10)}@${'invalid'.repeat(19)}.${'invalid'.repeat(19)}`;
    const error = Email.create(email);
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(email));
  });

  it('Should return an error if domain part is larger than 255 chars', () => {
    const email = `invalid@${'invalid'.repeat(19)}.${'invalid'.repeat(19)}`;
    const error = Email.create(email);
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(email));
  });

  it('Should return an error if local part is larger than 64 chars', () => {
    const email = `${'invalid'.repeat(10)}@invalid.com`;
    const error = Email.create(email);
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(email));
  });

  it('Should return an error if domain a part is larger than 63 chars', () => {
    const email = `any@${'d'.repeat(64)}.com`;
    const error = Email.create(email);
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(email));
  });

  it('Should return an error if local part is empty', () => {
    const email = '@mail.com';
    const error = Email.create(email);
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(email));
  });

  it('Should return an error if domain is empty', () => {
    const email = 'any@';
    const error = Email.create(email);
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(email));
  });

  it('Should return an error if local part have invalid char', () => {
    const email = 'any email@mail.com';
    const error = Email.create(email);
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(email));
  });

  it('Should return an error if local part have two dots', () => {
    const email = 'any..email@mail.com';
    const error = Email.create(email);
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(email));
  });

  it('Should return an error if local part have ending dot', () => {
    const email = 'any.@mail.com';
    const error = Email.create(email);
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(email));
  });

  it('Should return an error if email do not have an at-sign', () => {
    const email = 'anymail.com';
    const error = Email.create(email);
    expect(error.isError()).toBe(true);
    expect(error.value).toEqual(new InvalidEmailError(email));
  });
});
