export class MissingParamsError extends Error {
  constructor(paramName: string) {
    super(`Missing param: ${paramName}`);
    this.name = 'MissingParamsError';
  }
}
