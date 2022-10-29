export class NonExistingAttachmentError extends Error {
  constructor() {
    super('Non Existing Attachment');
    this.name = 'NonExistingAttachmentError';
  }
}
