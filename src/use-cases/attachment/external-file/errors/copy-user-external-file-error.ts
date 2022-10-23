export class CopyUserExternalFileError extends Error {
  constructor() {
    super('Copy User External File Error');
    this.name = 'UserExternalFileError';
  }
}
