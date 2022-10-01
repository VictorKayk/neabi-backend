export class ExistingFileError extends Error {
  constructor() {
    super('Existing File');
    this.name = 'ExistingFileError';
  }
}
