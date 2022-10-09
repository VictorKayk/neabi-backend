export class ExistingFileFormatError extends Error {
  constructor() {
    super('Existing File Format');
    this.name = 'ExistingFileFormatError';
  }
}
