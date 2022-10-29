export class PostDoesNotHaveThisAttachmentError extends Error {
  constructor() {
    super('Post Does Not Have This Attachment');
    this.name = 'NonExistingPostAttachmentError';
  }
}
