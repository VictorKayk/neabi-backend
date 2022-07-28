export class InvalidNameError extends Error {
  constructor(name: string) {
    super(`Invalid Name: ${name}`);
    this.name = 'InvalidNameError';
  }
}
