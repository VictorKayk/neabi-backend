export class NonExistingExternalFileError extends Error {
  constructor() {
    super('Non Existing External File');
    this.name = 'NonExistingExternalFileError';
  }
}
