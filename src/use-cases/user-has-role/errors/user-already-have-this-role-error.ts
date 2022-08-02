export class UserAlreadyHaveThisRoleError extends Error {
  constructor() {
    super('User Already Have This Role');
    this.name = 'ExistingUserError';
  }
}
