export class NonExistingUrlError extends Error {
  constructor() {
    super('Non Existing Url');
    this.name = 'NonExistingUrlError';
  }
}
