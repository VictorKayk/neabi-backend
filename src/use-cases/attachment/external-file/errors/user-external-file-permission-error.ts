export class UserExternalFilePermissionError extends Error {
  constructor(message: string) {
    super('User External File Permission Error');
    this.name = message;
  }
}
