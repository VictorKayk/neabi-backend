export class ExistingUserError extends Error {
  constructor() {
    super('Existing User');
    this.name = 'ExistingUserError';
  }
}
