export class UserDoesNotHaveThisRoleError extends Error {
  constructor() {
    super('User Does Not Have This Role');
    this.name = 'NonExistingUserRoleError';
  }
}
