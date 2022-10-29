export class ReadPublicUserExternalFileDataError extends Error {
  constructor(message: string) {
    super('Read Public User External File Data Error');
    this.name = message;
  }
}
