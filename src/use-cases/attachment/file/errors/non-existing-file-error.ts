export class NonExistingFileError extends Error {
  constructor() {
    super('Non Existing File');
    this.name = 'NonExistingFileError';
  }
}
