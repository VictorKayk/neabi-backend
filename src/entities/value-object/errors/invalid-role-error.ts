export class InvalidRoleError extends Error {
  constructor(role: string) {
    super(`Invalid Role: ${role}`);
    this.name = 'InvalidRoleError';
  }
}
