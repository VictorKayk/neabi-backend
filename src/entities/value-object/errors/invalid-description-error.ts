export class InvalidDescriptionError extends Error {
  constructor(name: string) {
    super(`Invalid Description: ${name}`);
    this.name = 'InvalidDescriptionError';
  }
}
