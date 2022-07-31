export class UnauthorizedError extends Error {
  constructor() {
    super('User Unauthorized');
    this.name = 'UnauthorizedError';
  }
}
