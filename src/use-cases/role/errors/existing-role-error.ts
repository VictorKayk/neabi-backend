export class ExistingRoleError extends Error {
  constructor() {
    super('Existing Role');
    this.name = 'ExistingRoleError';
  }
}
