export class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`Invalid Email: ${email}`);
    this.name = 'InvalidEmailError';
  }
}
