export class NonExistingRoleError extends Error {
  constructor() {
    super('Non Existing Role');
    this.name = 'NonExistingRoleError';
  }
}
