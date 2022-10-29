export class PostAlreadyHaveThisAttachmentError extends Error {
  constructor() {
    super('Post Already Have This Attachment');
    this.name = 'PostAlreadyHaveThisAttachmentError';
  }
}
