export class NonExistingTokenError extends Error {
  constructor() {
    super('Non Existing Token Error');
    this.name = 'NonExistingTokenError';
  }
}
