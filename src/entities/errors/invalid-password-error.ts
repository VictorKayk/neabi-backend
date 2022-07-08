export class InvalidPasswordError extends Error {
  constructor(email: string) {
    super(`Invalid Password: ${email}`);
    this.name = 'InvalidPasswordError';
  }
}
