export class CopyUserExternalFileError extends Error {
  constructor(message: string) {
    super('Copy User External File Error');
    this.name = message;
  }
}
