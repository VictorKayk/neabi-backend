export class NonExistingTagError extends Error {
  constructor() {
    super('Non Existing Tag');
    this.name = 'NonExistingTagError';
  }
}
