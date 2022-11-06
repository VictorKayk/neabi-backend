export class ExistingTagError extends Error {
  constructor() {
    super('Existing Tag');
    this.name = 'ExistingTagError';
  }
}
