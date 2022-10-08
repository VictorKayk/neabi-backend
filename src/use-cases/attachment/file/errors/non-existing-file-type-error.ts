export class NonExistingFileTypeError extends Error {
  constructor() {
    super('Non Existing File Type');
    this.name = 'NonExistingFileTypeError';
  }
}
