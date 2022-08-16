export class UserIsAlreadyVerifiedError extends Error {
  constructor() {
    super('User Is Already Verified Error');
    this.name = 'UserIsAlreadyVerifiedError';
  }
}
