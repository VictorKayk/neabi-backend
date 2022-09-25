export class InvalidTitleError extends Error {
  constructor(name: string) {
    super(`Invalid Title: ${name}`);
    this.name = 'InvalidTitleError';
  }
}
