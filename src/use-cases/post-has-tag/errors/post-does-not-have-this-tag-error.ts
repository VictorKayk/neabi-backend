export class PostDoesNotHaveThisTagError extends Error {
  constructor() {
    super('Post Does Not Have This Tag');
    this.name = 'NonExistingPostTagError';
  }
}
