export class EmailServiceError extends Error {
  constructor() {
    super('Email Service Error');
    this.name = 'EmailServiceError';
  }
}
