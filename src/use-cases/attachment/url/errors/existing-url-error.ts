export class ExistingUrlError extends Error {
  constructor() {
    super('Existing Url');
    this.name = 'ExistingUrlError';
  }
}
