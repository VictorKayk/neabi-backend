export class PostAlreadyHaveThisTagError extends Error {
  constructor() {
    super('Post Already Have This Tag');
    this.name = 'PostAlreadyHaveThisTagError';
  }
}
