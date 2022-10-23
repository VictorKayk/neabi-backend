export class ExistingExternalFileError extends Error {
  constructor() {
    super('Existing External File');
    this.name = 'ExistingExternalFileError';
  }
}
