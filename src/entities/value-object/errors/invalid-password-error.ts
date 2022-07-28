export class InvalidPasswordError extends Error {
  constructor(password: string) {
    super(`Invalid Password: ${password}`);
    this.name = 'InvalidPasswordError';
  }
}
