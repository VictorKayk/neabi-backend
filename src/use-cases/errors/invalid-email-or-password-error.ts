export class InvalidEmailOrPasswordError extends Error {
  constructor(email: string, password: string) {
    super(`Invalid Email: ${email} or Password ${password}`);
    this.name = 'InvalidEmailOrPasswordError';
  }
}
