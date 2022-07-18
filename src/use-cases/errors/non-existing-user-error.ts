export class NonExistingUserError extends Error {
  constructor() {
    super('Non Existing User');
    this.name = 'Non ExistingUserError';
  }
}
