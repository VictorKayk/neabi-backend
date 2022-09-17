export class ExpiredTokenError extends Error {
  constructor() {
    super('Expired Token Error');
    this.name = 'ExpiredTokenError';
  }
}
