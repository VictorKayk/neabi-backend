export class UserIsAlreadyVerifiedError extends Error {
  constructor() {
    super('User Is Already Verified');
    this.name = 'UserIsAlreadyVerifiedError';
  }
}
