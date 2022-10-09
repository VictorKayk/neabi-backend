export class ExistingFileTypeError extends Error {
  constructor() {
    super('Existing File Type');
    this.name = 'ExistingFileTypeError';
  }
}
