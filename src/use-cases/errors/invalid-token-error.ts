export class InvalidTokenError extends Error {
  constructor() {
    super('Invalid Token Error');
    this.name = 'InvalidTokenError';
  }
}
