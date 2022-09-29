export class NonExistingPostError extends Error {
  constructor() {
    super('Non Existing Post');
    this.name = 'NonExistingPostError';
  }
}
